require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.config');
const setupSwagger = require('./utils/swagger');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion DB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/players', require('./routes/players.routes'));
app.use('/api/games', require('./routes/games.routes'));
app.use('/api/sessions', require('./routes/sessions.routes'));
app.use('/api', require('./routes/stats.routes'));

// Swagger
setupSwagger(app);

// Erreur globale
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API GameHub sur http://localhost:${PORT}`);
  console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
});