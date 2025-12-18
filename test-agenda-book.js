// Test script to generate agenda book and check date formats
const fetch = require('node-fetch');

async function testAgendaBook() {
  try {
    console.log('Testing agenda book generation...');

    // First, we need to authenticate and get a token
    // For testing, we'll assume we have a test user
    const response = await fetch('http://localhost:3000/api/agenda/generate-book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add a valid auth token here
        'Authorization': 'Bearer YOUR_TEST_TOKEN'
      }
    });

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

testAgendaBook();
