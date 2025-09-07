const mongoose = require('mongoose');
const path = require('path');
const BirthData = require(path.resolve(__dirname, '../src/models/BirthData')).default || require(path.resolve(__dirname, '../src/models/BirthData'));
const User = require(path.resolve(__dirname, '../src/models/User')).default || require(path.resolve(__dirname, '../src/models/User'));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/your-db-name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create test user if not exists
  let user = await User.findOne({ uid: 'test-user' });
  if (!user) {
    user = new User({
      uid: 'test-user',
      email: 'testuser@example.com',
      name: 'Test User',
      // Add other required fields if any
    });
    await user.save();
    console.log('Test user created');
  } else {
    console.log('Test user already exists');
  }

  // Create birth data for test user
  let birthData = await BirthData.findOne({ userId: 'test-user' });
  if (!birthData) {
    birthData = new BirthData({
      userId: 'test-user',
      birthDate: new Date('1990-01-15'),
      birthTime: '12:30:00',
      latitude: 40.4168,
      longitude: -3.7038,
      timezone: 'Europe/Madrid',
    });
    await birthData.save();
    console.log('Birth data for test user created');
  } else {
    console.log('Birth data for test user already exists');
  }

  mongoose.connection.close();
}

main().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
