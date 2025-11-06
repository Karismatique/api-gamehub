const express = require('express');
const router = express.Router();
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/players.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// Public
router.get('/', protect, getAllPlayers);
router.get('/:id', protect, getPlayerById);

// Admin only
router.post('/', protect, adminOnly, createPlayer);
router.put('/:id', protect, adminOnly, updatePlayer);
router.delete('/:id', protect, adminOnly, deletePlayer);

module.exports = router;