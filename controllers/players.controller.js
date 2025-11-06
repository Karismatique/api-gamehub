const Player = require('../models/player.model');
const bcrypt = require('bcrypt');

const getAllPlayers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const players = await Player.find()
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ totalScore: -1 });

    const total = await Player.countDocuments();

    res.json({
      players,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).select('-password');
    if (!player) return res.status(404).json({ message: 'Joueur non trouvé' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPlayer = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const player = await Player.create({ username, email, password: hashed });
    res.status(201).json({ id: player._id, username, email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const player = await Player.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!player) return res.status(404).json({ message: 'Joueur non trouvé' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: 'Joueur non trouvé' });
    res.json({ message: 'Joueur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer };