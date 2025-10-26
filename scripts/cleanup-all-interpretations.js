// cleanup-all-interpretations.js
// Delete ALL interpretations to start fresh

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Function to read .env.local file manually
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    console.error('Looking for:', envPath);
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key === 'MONGODB_URI') {
        return value;
      }
    }
  }
  
  return null;
}

async function cleanupAllInterpretations() {
  console.log('🚀 Starting Cleanup Process...\n');
  console.log('⚠️  WARNING: This will DELETE ALL interpretations!\n');
  
  const MONGODB_URI = loadEnvFile();
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local file!');
    process.exit(1);
  }
  
  console.log('✅ Found MONGODB_URI');
  console.log('📍 Connecting to MongoDB...\n');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!\n');
    
    const db = client.db();
    const collection = db.collection('interpretations');
    
    // Count before deletion
    const countBefore = await collection.countDocuments();
    console.log(`📊 Current interpretations count: ${countBefore}`);
    
    if (countBefore === 0) {
      console.log('\n✅ Collection is already empty! Nothing to delete.\n');
      return;
    }
    
    // Show some stats before deletion
    console.log('\n📊 Breakdown by chartType:');
    const byChartType = await collection.aggregate([
      {
        $group: {
          _id: '$chartType',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    byChartType.forEach(group => {
      const label = group._id || '(null/undefined)';
      console.log(`  - "${label}": ${group.count} document(s)`);
    });
    
    // Show duplicates
    console.log('\n🔍 Checking for duplicates:');
    const duplicates = await collection.aggregate([
      {
        $group: {
          _id: { userId: '$userId', chartType: '$chartType' },
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray();
    
    if (duplicates.length > 0) {
      console.log(`  ⚠️ Found ${duplicates.length} duplicate group(s):`);
      duplicates.forEach(dup => {
        const userId = dup._id.userId || '(no userId)';
        const chartType = dup._id.chartType || '(no chartType)';
        console.log(`     - User: ${userId.substring(0, 15)}..., chartType: "${chartType}" → ${dup.count} duplicates`);
      });
    } else {
      console.log('  ✅ No duplicates found');
    }
    
    // Confirmation prompt
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  CONFIRMATION REQUIRED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\nThis will DELETE all ${countBefore} interpretation documents.`);
    console.log('\nTo proceed, run this script with the --confirm flag:');
    console.log('node cleanup-all-interpretations.js --confirm');
    console.log('');
    
    // Check for --confirm flag
    if (!process.argv.includes('--confirm')) {
      console.log('❌ Deletion aborted (missing --confirm flag)');
      console.log('✅ No documents were deleted\n');
      return;
    }
    
    // Delete all
    console.log('\n🗑️  Deleting all interpretations...');
    const result = await collection.deleteMany({});
    
    console.log(`\n✅ Cleanup complete!`);
    console.log(`📊 Documents deleted: ${result.deletedCount}`);
    
    // Verify
    const countAfter = await collection.countDocuments();
    console.log(`📊 Documents remaining: ${countAfter}`);
    
    if (countAfter === 0) {
      console.log('\n🎉 SUCCESS! All interpretations have been deleted.');
      console.log('📝 You can now generate fresh interpretations without duplicates.\n');
    } else {
      console.log(`\n⚠️ Warning: ${countAfter} documents still remain. You may need to run this again.\n`);
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  } finally {
    await client.close();
  }
}

// Run the cleanup
cleanupAllInterpretations().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});