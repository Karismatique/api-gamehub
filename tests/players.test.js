const request = require('supertest');
const app = require('../index');
const Player = require('../models/player.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Tests Players', () => {
  let adminToken;

  beforeEach(async () => {
    // Créer un admin avec mot de passe valide
    const hashed = await bcrypt.hash('admin123', 10);
    const admin = await Player.create({
      username: 'admin',
      email: 'admin@test.com',
      password: hashed,
      role: 'admin'
    });
    adminToken = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
  });

  it('devrait créer un joueur (POST /api/players)', async () => {
    const res = await request(app)
      .post('/api/players')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'testplayer',
        email: 'test@gamehub.com',
        password: 'pass123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe('testplayer');
  });

  it('devrait lister les joueurs (GET /api/players)', async () => {
    // Mot de passe valide (>= 6 caractères)
    const hashed = await bcrypt.hash('password123', 10);
    await Player.create({
      username: 'player1',
      email: 'p1@test.com',
      password: hashed,
      role: 'player'
    });

    const res = await request(app)
      .get('/api/players')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.players.length).toBeGreaterThan(0);
  });

  it('devrait échouer sans auth (GET /api/players)', async () => {
    const res = await request(app).get('/api/players');
    expect(res.statusCode).toBe(401);
  });
});