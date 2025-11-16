# 🦁 Ayo Bot - JOJ Dakar 2026

Bot assistant virtuel multimodal pour les Jeux Olympiques de la Jeunesse Dakar 2026.

## 🌟 Fonctionnalités

- 💬 Chat textuel intelligent avec GPT-4o-mini
- 🎤 Reconnaissance vocale (ASR) avec OpenAI Whisper
- 🗣️ Synthèse vocale (TTS) avec ElevenLabs
- 📚 Base de connaissance complète sur les JOJ 2026
- 🇸🇳 Support multilingue (Français, Anglais, Espagnol, etc.)
- 📱 Interface WhatsApp Web

## 🚀 Déploiement

### Variables d'environnement requises

```env
PORT=3002
NODE_ENV=production
OPENAI_API_KEY=your_openai_key
AI_MODEL=gpt-4o-mini
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=your_voice_id
ADMIN_API_KEY=your_admin_key
```

### Installation

```bash
npm install
npm start
```

## 📍 Endpoints

- `GET /` - Info API
- `GET /health` - Health check
- `POST /api/chat` - Chat textuel
- `POST /api/audio` - Messages vocaux (ASR + TTS)
- `GET /admin/whatsapp-web.html` - Interface utilisateur

## 🦁 Ayo - Mascotte officielle

Yow! Je suis Ayo, le lion guide des JOJ 2026!
