/**
 * Reset interpretations directly via MongoDB connection
 * Does NOT require dev server to be running
 *
 * Usage:
 * MONGODB_URI="your_connection_string" node scripts/reset-interpretations-direct.js solar-return
 * MONGODB_URI="your_connection_string" node scripts/reset-interpretations-direct.js natal
 * MONGODB_URI="your_connection_string" node scripts/reset-interpretations-direct.js all
 */

const { MongoClient } = require('mongodb');

async function resetInterpretations(chartType) {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ Error: MONGODB_URI environment variable not found');
    console.error('Usage: MONGODB_URI="your_uri" node scripts/reset-interpretations-direct.js [chart-type]');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('interpretations');

    let result;

    if (chartType === 'all') {
      console.log('🗑️  Deleting ALL interpretations...');
      result = await collection.deleteMany({});
    } else {
      console.log(`🗑️  Deleting ${chartType} interpretations...`);
      result = await collection.deleteMany({ chartType });
    }

    console.log(`✅ Success! Deleted ${result.deletedCount} ${chartType} interpretations`);
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Regenerate your chart in the app');
    console.log('2. The new interpretation will use the updated structure');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Get chart type from command line argument
const chartType = process.argv[2] || 'solar-return';

if (!['natal', 'solar-return', 'all'].includes(chartType)) {
  console.error('❌ Invalid chart type. Use: natal, solar-return, or all');
  console.error('');
  console.error('Examples:');
  console.error('  MONGODB_URI="..." node scripts/reset-interpretations-direct.js solar-return');
  console.error('  MONGODB_URI="..." node scripts/reset-interpretations-direct.js natal');
  console.error('  MONGODB_URI="..." node scripts/reset-interpretations-direct.js all');
  process.exit(1);
}

resetInterpretations(chartType);
