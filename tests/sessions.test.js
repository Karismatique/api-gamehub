const request = require('supertest');
const app = require('../index');
const Player = require('../models/player.model');
const Game = require('../models/game.model');
const Session = require('../models/session.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Tests Sessions', () => {
  let playerToken;
  let playerId;
  let gameId;

  beforeEach(async () => {
    const hashed = await bcrypt.hash('pass123', 10);
    const player = await Player.create({
      username: 'testplayer',
      email: 'test@gamehub.com',
      password: hashed,
      role: 'player'
    });
    playerId = player._id;
    playerToken = jwt.sign({ id: playerId, role: 'player' }, process.env.JWT_SECRET);

    const game = await Game.create({ title: 'Test Game', genre: 'Action' });
    gameId = game._id;
  });

  it('devrait créer une session (POST /api/sessions)', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({
        playerId: playerId.toString(),
        gameId: gameId.toString(),
        score: 1500,
        duration: 45
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.score).toBe(1500);

    const updatedPlayer = await Player.findById(playerId);
    expect(updatedPlayer.totalScore).toBe(1500);
  });

  it('devrait lister les sessions (GET /api/sessions)', async () => {
    await Session.create({
      player: playerId,
      game: gameId,
      score: 1000,
      duration: 30
    });

    const res = await request(app)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${playerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sessions.length).toBeGreaterThan(0);
  });

  it('devrait échouer avec score négatif (POST /api/sessions)', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({
        playerId: playerId.toString(),
        gameId: gameId.toString(),
        score: -100,
        duration: 45
      });

    expect(res.statusCode).toBe(400); // Grâce à la gestion ValidationError dans le contrôleur
  });
});