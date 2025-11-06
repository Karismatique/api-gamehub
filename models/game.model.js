const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre du jeu est requis'],
    trim: true,
    unique: true
  },
  genre: {
    type: String,
    required: [true, 'Le genre est requis'],
    trim: true
  },
  releaseYear: {
    type: Number,
    min: 1950,
    max: new Date().getFullYear() + 1
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuels : sessions du jeu
gameSchema.virtual('sessions', {
  ref: 'Session',
  localField: '_id',
  foreignField: 'game'
});

module.exports = mongoose.model('Game', gameSchema);