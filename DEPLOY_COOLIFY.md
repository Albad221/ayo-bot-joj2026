# 🚀 Déployer Ayo Bot sur Coolify

## Étape 1: Pousser le code sur GitHub

```bash
# Créer un nouveau repo sur GitHub: https://github.com/new
# Nom suggéré: ayo-bot-joj2026

# Ajouter le remote
git remote add origin https://github.com/VOTRE-USERNAME/ayo-bot-joj2026.git

# Pousser le code
git push -u origin main
```

## Étape 2: Déployer sur Coolify

### Dans Coolify:

1. **New Resource** → **Applications** → **Public Repository**

2. **Configuration du projet:**
   - Repository URL: `https://github.com/VOTRE-USERNAME/ayo-bot-joj2026`
   - Branch: `main`
   - Build Pack: **Node.js**

3. **Build Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Port: `3002`

4. **Variables d'environnement** (Section Environment):

```env
NODE_ENV=production
PORT=3002
OPENAI_API_KEY=sk-proj-...
AI_MODEL=gpt-4o-mini
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=qEqs132fQmytmOsVez6J
ADMIN_API_KEY=joj-dakar-2026-admin-key-secure-123
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
DEFAULT_LANGUAGE=fr
SUPPORT_EMAIL=support@dakar2026.sn
```

5. **Déployer** → Cliquez sur "Deploy"

## Étape 3: Accéder à l'application

Une fois déployé, Coolify vous donnera une URL:
- API: `https://votre-app.coolify.io`
- Interface WhatsApp: `https://votre-app.coolify.io/admin/whatsapp-web.html`

## 🔧 Configuration HTTPS

Coolify configure automatiquement HTTPS avec Let's Encrypt!

## 📊 Monitoring

- Logs: Disponibles dans Coolify Dashboard
- Health Check: `GET /health`

## 🔄 Mises à jour

Pour déployer une nouvelle version:
```bash
git add .
git commit -m "Mise à jour..."
git push
```

Coolify redéploiera automatiquement!

## 🎤 Note sur l'audio

⚠️ **Important**: L'enregistrement audio nécessite HTTPS pour fonctionner dans les navigateurs modernes. Coolify configure automatiquement HTTPS, donc tout fonctionnera parfaitement!

---

Made with ❤️ for JOJ Dakar 2026 🦁
