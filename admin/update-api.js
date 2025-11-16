/**
 * API d'administration pour mettre à jour les données dynamiques
 * Permet aux organisateurs JOJ de mettre à jour le planning, résultats, news, etc.
 */

import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.ADMIN_PORT || 3001;

app.use(express.json());

// Middleware d'authentification
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({
      error: 'Non autorisé',
      message: 'Clé API invalide ou manquante'
    });
  }

  next();
};

// Chemins vers les fichiers dynamiques
const getDynamicFilePath = (filename) => {
  return path.join(__dirname, '../knowledge/dynamic', `${filename}.json`);
};

/**
 * Lire un fichier dynamique
 */
app.get('/api/admin/:file', authenticate, async (req, res) => {
  try {
    const { file } = req.params;
    const filePath = getDynamicFilePath(file);

    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({
        error: 'Fichier non trouvé'
      });
    }

    const data = await fs.readJson(filePath);

    res.json({
      success: true,
      file: file,
      data: data
    });

  } catch (error) {
    console.error('Erreur lecture:', error);
    res.status(500).json({
      error: 'Erreur lors de la lecture du fichier'
    });
  }
});

/**
 * Mettre à jour un fichier dynamique complet
 */
app.put('/api/admin/:file', authenticate, async (req, res) => {
  try {
    const { file } = req.params;
    const filePath = getDynamicFilePath(file);
    const newData = req.body;

    // Validation JSON
    if (!newData || typeof newData !== 'object') {
      return res.status(400).json({
        error: 'Données invalides',
        message: 'Le corps de la requête doit être un objet JSON valide'
      });
    }

    // Backup de l'ancien fichier
    const backupPath = path.join(__dirname, '../knowledge/dynamic/backups');
    await fs.ensureDir(backupPath);

    if (await fs.pathExists(filePath)) {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const backupFile = path.join(backupPath, `${file}_${timestamp}.json`);
      await fs.copy(filePath, backupFile);
    }

    // Mettre à jour _last_updated
    newData._last_updated = new Date().toISOString().split('T')[0];

    // Écrire le nouveau fichier
    await fs.writeJson(filePath, newData, { spaces: 2 });

    res.json({
      success: true,
      message: `Fichier ${file}.json mis à jour avec succès`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur mise à jour:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du fichier'
    });
  }
});

/**
 * Mettre à jour une section spécifique d'un fichier
 */
app.patch('/api/admin/:file/:section', authenticate, async (req, res) => {
  try {
    const { file, section } = req.params;
    const filePath = getDynamicFilePath(file);
    const updates = req.body;

    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({
        error: 'Fichier non trouvé'
      });
    }

    // Lire le fichier actuel
    const data = await fs.readJson(filePath);

    // Mettre à jour la section
    if (data[section]) {
      data[section] = { ...data[section], ...updates };
    } else {
      data[section] = updates;
    }

    // Mettre à jour _last_updated
    data._last_updated = new Date().toISOString().split('T')[0];

    // Sauvegarder
    await fs.writeJson(filePath, data, { spaces: 2 });

    res.json({
      success: true,
      message: `Section ${section} du fichier ${file}.json mise à jour`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur mise à jour section:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour de la section'
    });
  }
});

/**
 * Ajouter une actualité
 */
app.post('/api/admin/news/add', authenticate, async (req, res) => {
  try {
    const newsItem = req.body;
    const filePath = getDynamicFilePath('news');

    // Validation
    if (!newsItem.titre || !newsItem.contenu) {
      return res.status(400).json({
        error: 'Données invalides',
        message: 'titre et contenu sont requis'
      });
    }

    const data = await fs.readJson(filePath);

    // Générer un ID
    const lastId = data.actualites.length > 0
      ? parseInt(data.actualites[0].id.split('_')[1])
      : 0;
    const newId = `news_${String(lastId + 1).padStart(3, '0')}`;

    // Créer la nouvelle actualité
    const newNews = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      categorie: newsItem.categorie || 'Annonce',
      titre: newsItem.titre,
      resume: newsItem.resume || newsItem.titre,
      contenu: newsItem.contenu,
      importance: newsItem.importance || 'normale',
      visible: newsItem.visible !== undefined ? newsItem.visible : true,
      ...newsItem
    };

    // Ajouter en premier
    data.actualites.unshift(newNews);
    data._last_updated = new Date().toISOString().split('T')[0];

    await fs.writeJson(filePath, data, { spaces: 2 });

    res.json({
      success: true,
      message: 'Actualité ajoutée avec succès',
      news: newNews
    });

  } catch (error) {
    console.error('Erreur ajout actualité:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'ajout de l\'actualité'
    });
  }
});

/**
 * Ajouter un résultat
 */
app.post('/api/admin/results/add', authenticate, async (req, res) => {
  try {
    const { sport, epreuve, resultat } = req.body;
    const filePath = getDynamicFilePath('results');

    if (!sport || !epreuve || !resultat) {
      return res.status(400).json({
        error: 'Paramètres manquants: sport, epreuve, resultat requis'
      });
    }

    const data = await fs.readJson(filePath);

    // Créer la structure si nécessaire
    if (!data.resultats_par_sport[sport]) {
      data.resultats_par_sport[sport] = {};
    }

    data.resultats_par_sport[sport][epreuve] = {
      ...resultat,
      date: resultat.date || new Date().toISOString().split('T')[0]
    };

    data._last_updated = new Date().toISOString().split('T')[0];

    await fs.writeJson(filePath, data, { spaces: 2 });

    res.json({
      success: true,
      message: `Résultat ajouté: ${sport} - ${epreuve}`
    });

  } catch (error) {
    console.error('Erreur ajout résultat:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'ajout du résultat'
    });
  }
});

/**
 * Liste des backups
 */
app.get('/api/admin/backups', authenticate, async (req, res) => {
  try {
    const backupPath = path.join(__dirname, '../knowledge/dynamic/backups');
    await fs.ensureDir(backupPath);

    const files = await fs.readdir(backupPath);

    const backups = files
      .filter(f => f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: `/api/admin/backups/${f}`
      }));

    res.json({
      success: true,
      count: backups.length,
      backups
    });

  } catch (error) {
    console.error('Erreur liste backups:', error);
    res.status(500).json({
      error: 'Erreur lors de la lecture des backups'
    });
  }
});

// Documentation
app.get('/', (req, res) => {
  res.json({
    service: 'Ayo Bot - API d\'administration',
    version: '1.0.0',
    endpoints: {
      read: 'GET /api/admin/:file',
      update: 'PUT /api/admin/:file',
      patch: 'PATCH /api/admin/:file/:section',
      addNews: 'POST /api/admin/news/add',
      addResult: 'POST /api/admin/results/add',
      backups: 'GET /api/admin/backups'
    },
    authentication: 'Utiliser header X-API-Key',
    files: ['schedule', 'results', 'news', 'tickets']
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('🔐 ================================ 🔐');
  console.log('   API d\'Administration Ayo');
  console.log('   JOJ Dakar 2026');
  console.log('🔐 ================================ 🔐');
  console.log('');
  console.log(`✅ Serveur admin démarré sur le port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('');
  console.log('⚠️  Authentification requise (X-API-Key)');
  console.log('');
});

export default app;
