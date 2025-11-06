const express = require('express');
const router = express.Router();
const {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
} = require('../controllers/games.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// Public
router.get('/', protect, getAllGames);
router.get('/:id', protect, getGameById);

// Admin only
router.post('/', protect, adminOnly, createGame);
router.put('/:id', protect, adminOnly, updateGame);
router.delete('/:id', protect, adminOnly, deleteGame);

module.exports = router;