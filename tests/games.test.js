const request = require('supertest');
const app = require('../index');
const Game = require('../models/game.model');
const Player = require('../models/player.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Tests Games', () => {
  let adminToken;

  beforeEach(async () => {
    const hashed = await bcrypt.hash('admin123', 10);
    const admin = await Player.create({
      username: 'admin',
      email: 'admin@test.com',
      password: hashed,
      role: 'admin'
    });
    adminToken = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
  });

  it('devrait créer un jeu (POST /api/games)', async () => {
    const res = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Game',
        genre: 'Action'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Game');
  });

  it('devrait lister les jeux (GET /api/games)', async () => {
    await Game.create({ title: 'Game1', genre: 'RPG' });

    const res = await request(app)
      .get('/api/games')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.games.length).toBeGreaterThan(0);
  });

  it('devrait échouer sans admin (POST /api/games)', async () => {
    // Token joueur normal
    const playerHashed = await bcrypt.hash('pass123', 10);
    const player = await Player.create({
      username: 'normalplayer',
      email: 'normal@test.com',
      password: playerHashed,
      role: 'player'
    });
    const playerToken = jwt.sign({ id: player._id, role: 'player' }, process.env.JWT_SECRET);

    const res = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ title: 'Forbidden Game', genre: 'FPS' });

    expect(res.statusCode).toBe(403);
  });
});