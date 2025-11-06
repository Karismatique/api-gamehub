const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/stats.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/stats', protect, getStats);

module.exports = router;