# 🚀 Guide de Démarrage Rapide - Bot Ayo

## Installation en 5 Minutes

### 1. Prérequis

Assurez-vous d'avoir installé:
- **Node.js 18+** (https://nodejs.org)
- Un éditeur de texte (VS Code recommandé)

### 2. Installation

```bash
# Naviguer dans le dossier
cd ayo

# Installer les dépendances
npm install
```

### 3. Configuration

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec votre clé API
nano .env
```

**Obtenir une clé API:**
- OpenAI: https://platform.openai.com/api-keys
- OU Claude (Anthropic): https://console.anthropic.com

**Configurer .env:**
```env
PORT=3000
OPENAI_API_KEY=sk-votre-cle-ici
ADMIN_API_KEY=une-cle-secrete-123
```

### 4. Lancer le Bot

```bash
# Démarrer le serveur
npm start
```

Vous devriez voir:
```
🦁 ================================ 🦁
   Bot Ayo - JOJ Dakar 2026
🦁 ================================ 🦁

✅ Serveur démarré sur le port 3000
🌐 URL: http://localhost:3000
```

### 5. Tester

Ouvrir votre navigateur: `http://localhost:3000`

Ou utiliser curl:
```bash
# Message de bienvenue
curl http://localhost:3000/api/welcome

# Envoyer un message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Bonjour Ayo!", "sessionId": "test1"}'
```

---

## 🎨 Interface Web

Ouvrir l'interface de test:
```bash
# Dans votre navigateur
open admin/dashboard.html
```

Vous pouvez maintenant chatter avec Ayo! 🦁

---

## 📝 Mettre à Jour les Données

### Via l'API Admin

```bash
# Dans un nouveau terminal, démarrer l'API admin
npm run admin

# Ajouter une actualité
curl -X POST http://localhost:3001/api/admin/news/add \
  -H "X-API-Key: une-cle-secrete-123" \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Test actualité",
    "contenu": "Ceci est un test",
    "categorie": "Annonce"
  }'

# Recharger les données dans le bot
curl -X POST http://localhost:3000/api/admin/reload \
  -H "X-API-Key: une-cle-secrete-123"
```

### Via fichiers JSON

1. Éditer directement: `knowledge/dynamic/news.json`
2. Recharger:
   ```bash
   curl -X POST http://localhost:3000/api/admin/reload \
     -H "X-API-Key: une-cle-secrete-123"
   ```

---

## 📚 Endpoints Disponibles

### Publics (sans authentification)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/health` | GET | État du serveur |
| `/api/welcome` | GET | Message de bienvenue |
| `/api/chat` | POST | Envoyer un message |
| `/api/schedule/today` | GET | Planning du jour |
| `/api/news` | GET | Dernières actualités |
| `/api/medals` | GET | Tableau des médailles |
| `/api/tickets` | GET | Infos billetterie |
| `/api/search?q=` | GET | Rechercher |
| `/api/stats` | GET | Statistiques |

### Admin (avec X-API-Key)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/admin/reload` | POST | Recharger les données |
| `/api/admin/:file` | GET | Lire un fichier |
| `/api/admin/:file` | PUT | Mettre à jour |
| `/api/admin/news/add` | POST | Ajouter une actualité |
| `/api/admin/results/add` | POST | Ajouter un résultat |

---

## 🧪 Tests

```bash
# Lancer les tests
npm test
```

---

## 🛠️ Développement

```bash
# Mode développement (auto-reload)
npm run dev
```

---

## 📁 Structure du Projet

```
ayo/
├── knowledge/           # Base de connaissance
│   ├── static/         # Données permanentes
│   └── dynamic/        # Données à jour
├── src/                # Code source
│   ├── bot/           # Logique du bot
│   └── knowledge/     # Chargement des données
├── admin/             # Administration
├── tests/             # Tests
└── package.json       # Dépendances
```

---

## 📖 Documentation Complète

- `README.md` - Vue d'ensemble du projet
- `DEPLOYMENT.md` - Guide de déploiement production
- `KNOWLEDGE_BASE_SUMMARY.md` - Détails de la base de connaissance
- `knowledge/README.md` - Guide de mise à jour des données

---

## 🆘 Problèmes Courants

### "Cannot find module 'openai'"
```bash
npm install
```

### "Error: OPENAI_API_KEY is not set"
Vérifier que `.env` existe et contient votre clé API.

### Le bot ne répond pas
1. Vérifier que le serveur est démarré (`npm start`)
2. Vérifier l'URL: `http://localhost:3000`
3. Vérifier les logs dans le terminal

### "Rate limit exceeded"
Vous avez atteint la limite de requêtes. Attendez 1 minute.

---

## 🎯 Prochaines Étapes

1. **Compléter la base de connaissance**
   - Ajouter le planning complet dans `knowledge/dynamic/schedule.json`
   - Mettre à jour les informations billetterie
   - Ajouter des actualités

2. **Personnaliser**
   - Ajuster la personnalité d'Ayo dans `knowledge/static/ayo.json`
   - Ajouter des FAQ spécifiques

3. **Déployer en production**
   - Suivre `DEPLOYMENT.md`
   - Configurer un domaine
   - Activer HTTPS

4. **Intégrations**
   - WhatsApp Business API
   - Telegram Bot
   - Widget sur site web

---

## 🤝 Support

Pour toute question, consultez:
- La documentation complète dans les fichiers `.md`
- Les commentaires dans le code source
- L'équipe technique JOJ 2026

---

Bienvenue dans l'équipe Ayo! Ensemble, rendons les JOJ Dakar 2026 inoubliables! 🦁🎉🇸🇳
