const Player = require('../models/player.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existing = await Player.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    const hashed = await bcrypt.hash(password, 10);
    const player = await Player.create({
      username,
      email,
      password: hashed,
      role: role || 'player'
    });

    res.status(201).json({
      message: 'Joueur créé avec succès',
      player: { id: player._id, username, email, role: player.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const player = await Player.findOne({ email });
    if (!player || !(await bcrypt.compare(password, player.password))) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { id: player._id, role: player.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      player: { id: player._id, username: player.username, role: player.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };