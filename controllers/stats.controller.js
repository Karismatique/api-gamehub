const Player = require('../models/player.model');
const Game = require('../models/game.model');
const Session = require('../models/session.model');

const getStats = async (req, res) => {
  try {
    const [totalPlayers, totalGames, totalSessions, top5] = await Promise.all([
      Player.countDocuments(),
      Game.countDocuments(),
      Session.countDocuments(),
      Player.find().sort({ totalScore: -1 }).limit(5).select('username totalScore')
    ]);

    res.json({
      totalPlayers,
      totalGames,
      totalSessions,
      top5
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats };