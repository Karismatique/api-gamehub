const Game = require('../models/game.model');

const getAllGames = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const games = await Game.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Game.countDocuments();
    res.json({
      games,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Jeu non trouvé' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ message: 'Jeu non trouvé' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ message: 'Jeu non trouvé' });
    res.json({ message: 'Jeu supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllGames, getGameById, createGame, updateGame, deleteGame };