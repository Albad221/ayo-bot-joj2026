/**
 * Point d'entrée principal du Bot Ayo
 * Serveur Express avec API REST pour interagir avec le bot
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import multer from 'multer';
import AyoBot from './bot/ayo-bot.js';
import AudioService from './services/audio-service.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de sécurité - Helmet disabled for Coolify deployment
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" },
//   crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
//   crossOriginEmbedderPolicy: false,
//   contentSecurityPolicy: false,
// }));

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));
app.use(express.json());

// Servir les fichiers statiques (interface admin)
app.use('/admin', express.static('admin'));

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 30,
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 || 60
});

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({
      error: 'Trop de requêtes. Veuillez patienter un moment.'
    });
  }
};

// Initialiser le bot Ayo
const ayoBot = new AyoBot(
  process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY,
  process.env.AI_MODEL || 'gpt-4-turbo-preview'
);

// Initialiser le service audio
const audioService = new AudioService(
  process.env.OPENAI_API_KEY,
  process.env.ELEVENLABS_API_KEY
);

// Configuration de multer pour upload de fichiers audio
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Initialisation au démarrage
await ayoBot.initialize();

// ===== ROUTES API =====

/**
 * Route de santé
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Ayo Bot - JOJ Dakar 2026',
    timestamp: new Date().toISOString()
  });
});

/**
 * Message de bienvenue
 */
app.get('/api/welcome', (req, res) => {
  res.json({
    message: ayoBot.getWelcomeMessage()
  });
});

/**
 * Envoyer un message au bot
 */
app.post('/api/chat', rateLimiterMiddleware, async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        error: 'Le message ne peut pas être vide'
      });
    }

    const response = await ayoBot.processMessage(
      message,
      sessionId || `session_${Date.now()}_${Math.random()}`
    );

    res.json(response);

  } catch (error) {
    console.error('Erreur dans /api/chat:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Désolé, une erreur s\'est produite. Réessaie dans un moment! 😊'
    });
  }
});

/**
 * Envoyer un message audio au bot (ASR + TTS)
 */
app.post('/api/audio', rateLimiterMiddleware, upload.single('audio'), async (req, res) => {
  try {
    const { sessionId } = req.body;
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({
        error: 'Fichier audio manquant'
      });
    }

    console.log('🎤 Réception fichier audio:', audioFile.originalname, audioFile.size, 'bytes');

    // Traitement complet: Audio → Texte → Réponse → Audio
    const result = await audioService.processAudioMessage(
      audioFile.buffer,
      (message, sid) => ayoBot.processMessage(message, sid),
      sessionId || `session_${Date.now()}_${Math.random()}`,
      audioFile.originalname
    );

    // Envoyer l'audio en réponse
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': result.audioBuffer.length,
      'X-Transcription': encodeURIComponent(result.transcription),
      'X-Response-Text': encodeURIComponent(result.response)
    });

    res.send(result.audioBuffer);

  } catch (error) {
    console.error('Erreur dans /api/audio:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Désolé, impossible de traiter le message audio. 😔'
    });
  }
});

/**
 * Récupérer le planning du jour
 */
app.get('/api/schedule/today', (req, res) => {
  const schedule = ayoBot.getTodaySchedule();

  if (schedule) {
    res.json({
      success: true,
      data: schedule
    });
  } else {
    res.json({
      success: true,
      message: 'Aucune compétition prévue aujourd\'hui',
      data: null
    });
  }
});

/**
 * Récupérer les dernières actualités
 */
app.get('/api/news', (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const news = ayoBot.getLatestNews(limit);

  res.json({
    success: true,
    count: news.length,
    data: news
  });
});

/**
 * Récupérer le tableau des médailles
 */
app.get('/api/medals', (req, res) => {
  const medals = ayoBot.getMedalTable();

  res.json({
    success: true,
    count: medals.length,
    data: medals
  });
});

/**
 * Récupérer les informations billetterie
 */
app.get('/api/tickets', (req, res) => {
  const tickets = ayoBot.getTicketInfo();

  res.json({
    success: true,
    data: tickets
  });
});

/**
 * Recherche dans la base de connaissance
 */
app.get('/api/search', async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({
      error: 'Paramètre de recherche manquant (q)'
    });
  }

  const results = await ayoBot.quickSearch(q);

  res.json({
    success: true,
    query: q,
    count: results.length,
    results
  });
});

/**
 * Statistiques du bot (admin)
 */
app.get('/api/stats', (req, res) => {
  const stats = ayoBot.getStats();

  res.json({
    success: true,
    stats
  });
});

/**
 * Recharger les données dynamiques (admin)
 */
app.post('/api/admin/reload', async (req, res) => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({
      error: 'Non autorisé'
    });
  }

  try {
    await ayoBot.reloadDynamicData();

    res.json({
      success: true,
      message: 'Données dynamiques rechargées avec succès',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur lors du rechargement:', error);
    res.status(500).json({
      error: 'Erreur lors du rechargement des données'
    });
  }
});

/**
 * Nettoyer une session
 */
app.delete('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  ayoBot.clearSession(sessionId);

  res.json({
    success: true,
    message: 'Session nettoyée'
  });
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({
    service: 'Ayo Bot - Assistant virtuel JOJ Dakar 2026',
    version: '1.0.0',
    mascotte: 'Ayo le Lion 🦁',
    endpoints: {
      health: 'GET /health',
      welcome: 'GET /api/welcome',
      chat: 'POST /api/chat',
      audio: 'POST /api/audio (multipart/form-data)',
      schedule: 'GET /api/schedule/today',
      news: 'GET /api/news',
      medals: 'GET /api/medals',
      tickets: 'GET /api/tickets',
      search: 'GET /api/search?q=<query>',
      stats: 'GET /api/stats'
    },
    documentation: 'https://github.com/joj-dakar-2026/ayo-bot'
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: 'Visite / pour voir les endpoints disponibles'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('');
  console.log('🦁 ================================ 🦁');
  console.log('   Bot Ayo - JOJ Dakar 2026');
  console.log('   Mascotte officielle');
  console.log('🦁 ================================ 🦁');
  console.log('');
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📝 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('Endpoints disponibles:');
  console.log(`  - GET  /health`);
  console.log(`  - GET  /api/welcome`);
  console.log(`  - POST /api/chat`);
  console.log(`  - POST /api/audio (ASR + TTS)`);
  console.log(`  - GET  /api/schedule/today`);
  console.log(`  - GET  /api/news`);
  console.log(`  - GET  /api/medals`);
  console.log(`  - GET  /api/tickets`);
  console.log(`  - GET  /api/search?q=<query>`);
  console.log('');
  console.log('🎉 Ayo est prêt à accueillir les questions!');
  console.log('');
});

export default app;
