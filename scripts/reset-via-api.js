/**
 * Reset interpretations via API endpoint
 * Requires the dev server to be running (npm run dev)
 *
 * Usage:
 * node scripts/reset-via-api.js solar-return
 * node scripts/reset-via-api.js natal
 * node scripts/reset-via-api.js all
 */

const BASE_URL = 'http://localhost:3000';

async function resetInterpretations(chartType) {
  try {
    console.log(`🔄 Resetting ${chartType} interpretations...`);

    const response = await fetch(`${BASE_URL}/api/admin/reset-interpretations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chartType }),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`✅ ${data.message}`);
      console.log(`📊 Deleted: ${data.deletedCount} interpretations`);
    } else {
      console.error(`❌ Error: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.error('Make sure your dev server is running (npm run dev)');
    return null;
  }
}

// Get chart type from command line argument
const chartType = process.argv[2] || 'solar-return';

if (!['natal', 'solar-return', 'all'].includes(chartType)) {
  console.error('❌ Invalid chart type. Use: natal, solar-return, or all');
  process.exit(1);
}

resetInterpretations(chartType);
