// tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  // Démarre une instance MongoDB in-memory
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connecte Mongoose à cette instance (seulement en test)
  await mongoose.connect(uri);
  console.log('MongoDB in-memory connecté pour les tests');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  // Nettoie toutes les collections entre chaque test
  const collections = mongoose.connection.db.collections();
  for (let collection of await collections) {
    await collection.deleteMany({});
  }
});