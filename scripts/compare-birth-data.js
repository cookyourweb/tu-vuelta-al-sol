// Crea un script rápido: scripts/compare-birth-data.js
const { MongoClient } = require('mongodb');

const URI = 'mongodb+srv://wunjo:hALT8ATrwt76aXpL@cluster0.v22xl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function compare() {
  const client = new MongoClient(URI);
  await client.connect();
  
  const testDb = client.db('test');
  const astrologyDb = client.db('astrology');
  
  const testData = await testDb.collection('birthdatas').findOne({ /* tu userId */ });
  const astrologyData = await astrologyDb.collection('birthdatas').findOne({ /* tu userId */ });
  
  console.log('TEST birthTime:', testData?.birthTime);
  console.log('ASTROLOGY birthTime:', astrologyData?.birthTime);
  
  console.log('TEST timezone:', testData?.timezone);
  console.log('ASTROLOGY timezone:', astrologyData?.timezone);
  
  await client.close();
}

compare();