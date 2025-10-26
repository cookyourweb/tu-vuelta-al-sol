// diagnose-collections-simple.js
// Simple diagnostic script that works with Next.js .env files

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Function to read .env.local file manually
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env  file not found!');
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

async function diagnoseCollections() {
  console.log('🔍 Loading MongoDB URI from .env ...\n');
  
  const MONGODB_URI = loadEnvFile();
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env  local file!');
    console.error('');
    console.error('Make sure your .env  has a line like:');
    console.error('MONGODB_URI=mongodb+srv://...');
    process.exit(1);
  }
  
  console.log('✅ Found MONGODB_URI');
  console.log('📍 Connecting to MongoDB...\n');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!\n');
    
    const db = client.db();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📂 AVAILABLE COLLECTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    collections.forEach(c => console.log(`  - ${c.name}`));
    console.log('');
    
    // Check 'charts' collection
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 CHARTS COLLECTION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const chartsCollection = db.collection('charts');
    const chartCount = await chartsCollection.countDocuments();
    console.log(`📈 Total documents: ${chartCount}`);
    
    if (chartCount > 0) {
      const sampleChart = await chartsCollection.findOne();
      console.log('\n📋 Sample document fields:', Object.keys(sampleChart));
      console.log('\n🔍 Structure check:');
      console.log('  - Has natalChart?', !!sampleChart.natalChart ? '✅' : '❌');
      console.log('  - Has solarReturnChart?', !!sampleChart.solarReturnChart ? '✅' : '❌');
      console.log('  - Has progressedChart?', !!sampleChart.progressedChart ? '✅' : '❌');
      console.log('  - Has progressedCharts (array)?', !!sampleChart.progressedCharts ? '✅' : '❌');
      console.log('  - Has interpretation?', !!sampleChart.interpretation ? '⚠️ WRONG!' : '✅ Good');
      console.log('  - Has chartType?', !!sampleChart.chartType ? `✅ (value: "${sampleChart.chartType}")` : '❌');
    } else {
      console.log('\n📭 No documents in charts collection');
    }
    
    // Check 'interpretations' collection
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💬 INTERPRETATIONS COLLECTION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const interpretationsCollection = db.collection('interpretations');
    const interpCount = await interpretationsCollection.countDocuments();
    console.log(`📈 Total documents: ${interpCount}`);
    
    if (interpCount > 0) {
      const sampleInterp = await interpretationsCollection.findOne();
      console.log('\n📋 Sample document fields:', Object.keys(sampleInterp));
      console.log('\n🔍 Structure check:');
      console.log('  - Has interpretation?', !!sampleInterp.interpretation ? '✅ Correct' : '❌ MISSING!');
      console.log('  - Has natalChart?', !!sampleInterp.natalChart ? '⚠️ WRONG! Should not be here' : '✅ Good');
      console.log('  - Has solarReturnChart?', !!sampleInterp.solarReturnChart ? '⚠️ WRONG! Should not be here' : '✅ Good');
      console.log('  - Has progressedChart?', !!sampleInterp.progressedChart ? '⚠️ WRONG! Should not be here' : '✅ Good');
      console.log('  - Has chartType?', !!sampleInterp.chartType ? `✅ (value: "${sampleInterp.chartType}")` : '❌ MISSING!');
      
      // Group by chartType
      console.log('\n📊 Documents by chartType:');
      const byChartType = await interpretationsCollection.aggregate([
        {
          $group: {
            _id: '$chartType',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray();
      
      if (byChartType.length === 0) {
        console.log('  ⚠️ No chartType field found in documents');
      } else {
        byChartType.forEach(group => {
          const label = group._id || '(null/undefined)';
          console.log(`  - "${label}": ${group.count} document(s)`);
        });
      }
      
      // Check for duplicates
      console.log('\n🔍 Checking for duplicates:');
      const duplicates = await interpretationsCollection.aggregate([
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
      
      if (duplicates.length === 0) {
        console.log('  ✅ No duplicates found! Perfect!');
      } else {
        console.log(`  ⚠️ Found ${duplicates.length} duplicate group(s):`);
        duplicates.forEach(dup => {
          const userId = dup._id.userId || '(no userId)';
          const chartType = dup._id.chartType || '(no chartType)';
          console.log(`     - User: ${userId.substring(0, 10)}..., chartType: "${chartType}" → ${dup.count} duplicates`);
        });
      }
    } else {
      console.log('\n📭 No documents in interpretations collection');
    }
    
    // Check for naming inconsistencies
    if (interpCount > 0) {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 CHECKING chartType VALUES');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const allChartTypes = await interpretationsCollection.distinct('chartType');
      console.log('Unique chartType values found:');
      
      allChartTypes.forEach(type => {
        if (!type) {
          console.log(`  - (null/undefined) ❌ PROBLEM: Missing chartType!`);
          return;
        }
        
        let issues = [];
        
        // Check for common variations
        if (type.includes('_')) {
          issues.push('Contains underscore (should use hyphen)');
        }
        if (type !== type.toLowerCase()) {
          issues.push('Contains uppercase (should be lowercase)');
        }
        
        if (issues.length > 0) {
          console.log(`  - "${type}" ⚠️ ${issues.join(', ')}`);
        } else {
          console.log(`  - "${type}" ✅`);
        }
      });
      
      // Expected values
      const expected = ['natal', 'solar-return', 'progressed'];
      const unexpected = allChartTypes.filter(t => t && !expected.includes(t));
      
      if (unexpected.length > 0) {
        console.log('\n❌ Unexpected chartType values found:');
        unexpected.forEach(type => console.log(`     "${type}"`));
        console.log('\n✅ Expected values should be:');
        expected.forEach(type => console.log(`     "${type}"`));
      } else if (allChartTypes.length > 0 && allChartTypes[0]) {
        console.log('\n✅ All chartType values are correct!');
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Charts collection: ${chartCount} document(s)`);
    console.log(`Interpretations collection: ${interpCount} document(s)`);
    
    if (interpCount === 0) {
      console.log('\n⚠️ No interpretations found. This is normal if you just started.');
    } else if (interpCount > 10) {
      console.log('\n⚠️ High number of interpretations. Check for duplicates!');
      console.log('   Expected: ~1-3 per user (natal, solar-return, progressed)');
    }
    
    console.log('\n✅ DIAGNOSIS COMPLETE!\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.message.includes('authentication')) {
      console.error('\n💡 This looks like an authentication error.');
      console.error('   Check your MONGODB_URI has the correct username/password.');
    }
  } finally {
    await client.close();
  }
}

console.log('🚀 Starting MongoDB Diagnosis...\n');
diagnoseCollections();