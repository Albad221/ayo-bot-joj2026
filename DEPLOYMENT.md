# Guide de Déploiement - Bot Ayo

## Prérequis

- Node.js 18+ installé
- Clé API OpenAI ou Claude (Anthropic)
- Serveur avec accès SSH (pour déploiement en production)

## Installation Locale

### 1. Cloner et installer

```bash
cd /path/to/ayo
npm install
```

### 2. Configuration

Copier le fichier d'exemple et configurer:

```bash
cp .env.example .env
```

Éditer `.env` et remplir:

```env
PORT=3000
OPENAI_API_KEY=sk-votre-cle-api
ADMIN_API_KEY=une-cle-secrete-forte
ALLOWED_ORIGINS=http://localhost:3000,https://votre-domaine.com
```

### 3. Lancer en développement

```bash
npm run dev
```

Le bot sera accessible sur `http://localhost:3000`

### 4. Tester

```bash
# Message de bienvenue
curl http://localhost:3000/api/welcome

# Envoyer un message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Bonjour Ayo!", "sessionId": "test123"}'

# Planning du jour
curl http://localhost:3000/api/schedule/today

# Actualités
curl http://localhost:3000/api/news
```

## Déploiement en Production

### Option 1: Serveur Linux (VPS)

#### 1. Préparer le serveur

```bash
# Se connecter au serveur
ssh user@votre-serveur.com

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2
```

#### 2. Déployer le code

```bash
# Cloner le projet
git clone https://github.com/votre-repo/ayo-bot.git
cd ayo-bot

# Installer les dépendances
npm install --production

# Configurer .env
nano .env
# Remplir avec les vraies valeurs de production
```

#### 3. Lancer avec PM2

```bash
# Démarrer le bot
pm2 start src/index.js --name ayo-bot

# Démarrer l'API admin (optionnel)
pm2 start admin/update-api.js --name ayo-admin

# Sauvegarder la configuration PM2
pm2 save

# Configurer le démarrage automatique
pm2 startup
```

#### 4. Nginx (reverse proxy)

```nginx
# /etc/nginx/sites-available/ayo-bot
server {
    listen 80;
    server_name bot.dakar2026.sn;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/ayo-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Installer Let's Encrypt pour HTTPS
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d bot.dakar2026.sn
```

### Option 2: Docker

#### 1. Créer Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
```

#### 2. Créer docker-compose.yml

```yaml
version: '3.8'

services:
  ayo-bot:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - ./knowledge:/app/knowledge
    restart: unless-stopped

  ayo-admin:
    build: .
    command: node admin/update-api.js
    ports:
      - "3001:3001"
    env_file:
      - .env
    volumes:
      - ./knowledge:/app/knowledge
    restart: unless-stopped
```

#### 3. Déployer

```bash
docker-compose up -d
```

### Option 3: Cloud (Heroku, Railway, Render)

#### Heroku

```bash
# Installer Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Se connecter
heroku login

# Créer l'app
heroku create ayo-bot-joj2026

# Configurer les variables d'environnement
heroku config:set OPENAI_API_KEY=votre-cle
heroku config:set ADMIN_API_KEY=votre-cle-admin

# Déployer
git push heroku main

# Voir les logs
heroku logs --tail
```

#### Railway.app

1. Connecter votre repo GitHub à Railway
2. Configurer les variables d'environnement dans l'interface
3. Railway détecte automatiquement Node.js et déploie

#### Render.com

1. Créer un nouveau Web Service
2. Connecter votre repo GitHub
3. Configurer:
   - Build Command: `npm install`
   - Start Command: `node src/index.js`
4. Ajouter les variables d'environnement

## Mise à Jour des Données Dynamiques

### Via l'API Admin

```bash
# Lire le fichier schedule
curl -H "X-API-Key: votre-cle-admin" \
  http://localhost:3001/api/admin/schedule

# Mettre à jour le schedule complet
curl -X PUT -H "X-API-Key: votre-cle-admin" \
  -H "Content-Type: application/json" \
  -d @knowledge/dynamic/schedule.json \
  http://localhost:3001/api/admin/schedule

# Ajouter une actualité
curl -X POST -H "X-API-Key: votre-cle-admin" \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Nouvelle annonce!",
    "contenu": "Les billets sont maintenant disponibles!",
    "categorie": "Billetterie",
    "importance": "haute"
  }' \
  http://localhost:3001/api/admin/news/add

# Recharger les données dans le bot principal
curl -X POST -H "X-API-Key: votre-cle-admin" \
  http://localhost:3000/api/admin/reload
```

### Via édition directe

```bash
# Éditer le fichier
nano knowledge/dynamic/schedule.json

# Recharger dans le bot
curl -X POST -H "X-API-Key: votre-cle-admin" \
  http://localhost:3000/api/admin/reload
```

## Monitoring et Maintenance

### Logs

```bash
# PM2
pm2 logs ayo-bot

# Docker
docker-compose logs -f

# Heroku
heroku logs --tail
```

### Santé du service

```bash
# Vérifier l'état
curl http://localhost:3000/health

# Statistiques
curl http://localhost:3000/api/stats
```

### Backups

Les backups automatiques sont créés dans `knowledge/dynamic/backups/` à chaque mise à jour via l'API admin.

```bash
# Sauvegarder manuellement
cp -r knowledge/dynamic knowledge/dynamic.backup-$(date +%Y%m%d)

# Restaurer
cp knowledge/dynamic.backup-YYYYMMDD/* knowledge/dynamic/
```

## Sécurité

1. **Clés API**: Ne jamais commiter le fichier `.env`
2. **HTTPS**: Toujours utiliser HTTPS en production
3. **Rate Limiting**: Configuré par défaut (30 req/min)
4. **CORS**: Configurer uniquement les domaines autorisés
5. **Admin API**: Protéger avec une clé forte et limiter l'accès (firewall)

## Performance

### Cache (optionnel)

Ajouter Redis pour cacher les réponses fréquentes:

```bash
# Installer Redis
sudo apt install redis-server

# Modifier src/bot/ayo-bot.js pour ajouter le cache
```

### CDN

Pour les ressources statiques (images Ayo, etc.), utiliser un CDN comme Cloudflare.

## Support

Pour toute question sur le déploiement, contactez l'équipe technique JOJ 2026.
