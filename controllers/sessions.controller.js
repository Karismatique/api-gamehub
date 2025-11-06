const Session = require('../models/session.model');
const Player = require('../models/player.model');

const createSession = async (req, res) => {
  try {
    const { playerId, gameId, score, duration } = req.body;

    const session = await Session.create({
      player: playerId,
      game: gameId,
      score,
      duration
    });

    // Mise à jour du score total
    await Player.findByIdAndUpdate(playerId, { $inc: { totalScore: score } });

    const populated = await Session.findById(session._id)
      .populate('player', 'username')
      .populate('game', 'title');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const playerId = req.query.player;
    const gameId = req.query.game;

    let query = {};
    if (playerId) query.player = playerId;
    if (gameId) query.game = gameId;

    const sessions = await Session.find(query)
      .populate('player', 'username')
      .populate('game', 'title')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ playedAt: -1 });

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('player', 'username')
      .populate('game', 'title');
    if (!session) return res.status(404).json({ message: 'Session non trouvée' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSession = async (req, res) => {
  try {
    const oldSession = await Session.findById(req.params.id);
    if (!oldSession) return res.status(404).json({ message: 'Session non trouvée' });

    const diff = req.body.score - oldSession.score;
    if (diff !== 0) {
      await Player.findByIdAndUpdate(oldSession.player, { $inc: { totalScore: diff } });
    }

    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('player', 'username')
      .populate('game', 'title');

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session non trouvée' });

    await Player.findByIdAndUpdate(session.player, { $inc: { totalScore: -session.score } });
    await Session.findByIdAndDelete(req.params.id);

    res.json({ message: 'Session supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createSession, getAllSessions, getSessionById, updateSession, deleteSession };