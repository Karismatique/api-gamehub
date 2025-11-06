const express = require('express');
const router = express.Router();
const {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession
} = require('../controllers/sessions.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// Tous les joueurs authentifiés
router.post('/', protect, createSession);
router.get('/', protect, getAllSessions);
router.get('/:id', protect, getSessionById);
router.put('/:id', protect, updateSession);
router.delete('/:id', protect, adminOnly, deleteSession); // Admin ou propriétaire ?

module.exports = router;