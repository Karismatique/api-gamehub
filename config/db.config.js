const mongoose = require('mongoose');

const connectDB = async () => {
  // Ne connecte QUE si on n'est PAS en mode test
  if (process.env.NODE_ENV !== 'test') {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connecté (production/dev)');
    } catch (err) {
      console.error('Erreur MongoDB:', err.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;