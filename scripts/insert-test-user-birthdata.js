const mongoose = require('mongoose');

// Conectar directamente a MongoDB
async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/astrology-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado a MongoDB');

    // Crear datos de nacimiento directamente
    const birthDataCollection = mongoose.connection.collection('birthdatas');

    // Verificar si ya existe
    const existing = await birthDataCollection.findOne({
      $or: [
        { userId: 'test-user-id' },
        { uid: 'test-user-id' }
      ]
    });

    if (existing) {
      console.log('✅ Birth data ya existe para test-user-id');
      console.log('Datos existentes:', existing);
    } else {
      // Crear datos de nacimiento para test
      const testBirthData = {
        userId: 'test-user-id',
        uid: 'test-user-id',
        fullName: 'Usuario de Prueba',
        birthDate: new Date('1974-02-10'),
        birthTime: '07:30:00',
        birthPlace: 'Madrid, Spain',
        latitude: 40.4168,
        longitude: -3.7038,
        timezone: 'Europe/Madrid',
        livesInSamePlace: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await birthDataCollection.insertOne(testBirthData);
      console.log('✅ Birth data creado para test-user-id:', result.insertedId);
      console.log('Datos creados:', testBirthData);
    }

    mongoose.connection.close();
    console.log('✅ Conexión cerrada');

  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
}

main();
