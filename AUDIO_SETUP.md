# 🎤 Audio Integration Setup - Ayo Bot

## Overview

Ayo Bot now supports **multimodal communication** with voice messages! Users can:
- 🎙️ Record voice messages
- 🗣️ Have their speech automatically transcribed (ASR)
- 🔊 Receive audio responses from Ayo (TTS)

## Technologies Used

- **ASR (Speech-to-Text)**: OpenAI Whisper API
- **TTS (Text-to-Speech)**: ElevenLabs API
- **Audio Recording**: Web MediaRecorder API
- **File Upload**: Multer middleware

---

## Setup Instructions

### 1. Get Your API Keys

#### OpenAI API Key (for Whisper ASR)
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your key (starts with `sk-...`)

#### ElevenLabs API Key (for TTS)
1. Go to [ElevenLabs](https://elevenlabs.io)
2. Sign up for a free account
3. Navigate to [Settings > API Keys](https://elevenlabs.io/app/settings/api-keys)
4. Copy your API key

### 2. Configure Environment Variables

Add your API keys to `.env` file:

```bash
# OpenAI for ASR (Whisper)
OPENAI_API_KEY=sk-proj-your-openai-key-here

# ElevenLabs for TTS
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Optional: Choose a specific voice
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```

### 3. Choose Your Voice

ElevenLabs offers many voices. Popular options:

| Voice ID | Name | Description |
|----------|------|-------------|
| `pNInz6obpgDQGcFmaJgB` | Adam | Masculine, deep, confident |
| `21m00Tcm4TlvDq8ikWAM` | Rachel | Feminine, calm, clear |
| `XB0fDUnXU5powFXDhCwa` | Charlotte | Feminine, warm, friendly |

To browse all voices:
- Visit: https://api.elevenlabs.io/v1/voices
- Or use the ElevenLabs dashboard

### 4. Start the Server

```bash
npm start
```

You should see:
```
✅ Serveur démarré sur le port 3002
🌐 URL: http://localhost:3002
...
- POST /api/audio (ASR + TTS)
```

### 5. Test the Audio Feature

1. Open `admin/whatsapp-web.html` in your browser
2. Click the microphone button 🎤
3. Allow microphone access when prompted
4. Speak your message
5. Click the microphone again to stop recording
6. Wait for Ayo to:
   - Transcribe your speech
   - Generate a response
   - Convert the response to audio
   - Play it back to you!

---

## How It Works

### Audio Flow

```
User speaks → Browser records → Send to server
                                       ↓
                          OpenAI Whisper (ASR)
                                       ↓
                          Transcribed text → Ayo Bot
                                       ↓
                          Bot response text
                                       ↓
                          ElevenLabs (TTS)
                                       ↓
                      Audio response ← Server
                                       ↓
                          Browser plays audio
```

### API Endpoint

**POST /api/audio**

- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `audio`: Audio file (WebM format)
  - `sessionId`: Session identifier

**Response**:
- **Content-Type**: `audio/mpeg`
- **Headers**:
  - `X-Transcription`: The transcribed text
  - `X-Response-Text`: Ayo's text response
- **Body**: Audio file (MP3)

### Code Example

```javascript
// Send audio to server
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');
formData.append('sessionId', sessionId);

const response = await fetch('http://localhost:3002/api/audio', {
    method: 'POST',
    body: formData
});

// Get transcription from headers
const transcription = response.headers.get('X-Transcription');
const responseText = response.headers.get('X-Response-Text');

// Get audio response
const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

---

## Customization

### Change Voice Characteristics

Edit `src/services/audio-service.js`:

```javascript
voice_settings: {
    stability: 0.5,        // 0-1: Lower = more expressive
    similarity_boost: 0.75, // 0-1: Voice consistency
    style: 0.0,            // 0-1: Exaggeration level
    use_speaker_boost: true // Enhance clarity
}
```

### Use Different Language

Whisper supports multiple languages. Change in `src/services/audio-service.js`:

```javascript
const transcription = await this.openai.audio.transcriptions.create({
    file: fileStream,
    model: 'whisper-1',
    language: 'en', // Change to 'en', 'es', 'ar', etc.
    response_format: 'text'
});
```

### Audio File Size Limits

Adjust in `src/index.js`:

```javascript
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // Change size (bytes)
    }
});
```

---

## Troubleshooting

### "Microphone not accessible"
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browser

### "Erreur serveur" when sending audio
- Verify OPENAI_API_KEY is valid
- Verify ELEVENLABS_API_KEY is valid
- Check server console for errors

### Audio not playing
- Check browser console for errors
- Verify audio response is received
- Try different browser

### Poor transcription quality
- Speak clearly and close to mic
- Reduce background noise
- Check microphone input level

### Voice sounds robotic
- Adjust `stability` setting (lower = more natural)
- Try different voice ID
- Check `use_speaker_boost` is true

---

## Pricing

### OpenAI Whisper
- **Free tier**: No free tier
- **Pricing**: $0.006 per minute of audio
- More info: https://openai.com/pricing

### ElevenLabs
- **Free tier**: 10,000 characters/month
- **Starter**: $5/month for 30,000 characters
- **Creator**: $22/month for 100,000 characters
- More info: https://elevenlabs.io/pricing

---

## Advanced Features

### Get Available Voices Programmatically

```javascript
import AudioService from './services/audio-service.js';

const audioService = new AudioService(openaiKey, elevenLabsKey);
const voices = await audioService.getAvailableVoices();

voices.forEach(voice => {
    console.log(`${voice.name} (${voice.voice_id}): ${voice.description}`);
});
```

### Process Audio Without Frontend

```javascript
import fs from 'fs';
import AudioService from './services/audio-service.js';

const audioService = new AudioService(openaiKey, elevenLabsKey);
const audioBuffer = fs.readFileSync('audio.webm');

const result = await audioService.processAudioMessage(
    audioBuffer,
    (message, sessionId) => ayoBot.processMessage(message, sessionId),
    'test-session'
);

console.log('Transcription:', result.transcription);
console.log('Response:', result.response);
fs.writeFileSync('response.mp3', result.audioBuffer);
```

---

## Security Notes

- Never commit `.env` file to version control
- Keep API keys secure
- Implement rate limiting for production
- Validate audio file types and sizes
- Consider adding authentication for audio endpoint

---

## Support

For issues or questions:
- Check server console logs
- Verify API keys are correct
- Ensure all dependencies are installed (`npm install`)
- Restart the server after .env changes

---

**Made with ❤️ for JOJ Dakar 2026** 🦁
