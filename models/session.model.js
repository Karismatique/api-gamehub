const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: [true, 'Le joueur est requis']
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: [true, 'Le jeu est requis']
  },
  score: {
    type: Number,
    required: [true, 'Le score est requis'],
    min: [0, 'Le score ne peut pas être négatif']
  },
  duration: {
    type: Number, // en minutes
    required: [true, 'La durée est requise'],
    min: [1, 'La durée doit être d\'au moins 1 minute']
  },
  playedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour performances
sessionSchema.index({ player: 1, playedAt: -1 });
sessionSchema.index({ game: 1 });

module.exports = mongoose.model('Session', sessionSchema);