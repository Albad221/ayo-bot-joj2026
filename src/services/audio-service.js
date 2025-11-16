/**
 * Service Audio pour Ayo Bot
 * Intègre ASR (OpenAI Whisper) et TTS (ElevenLabs)
 */

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import OpenAI from 'openai';
import fs from 'fs';
import { Readable } from 'stream';

export default class AudioService {
  constructor(openaiKey, elevenLabsKey) {
    // OpenAI pour ASR (Whisper)
    this.openai = new OpenAI({
      apiKey: openaiKey
    });

    // ElevenLabs pour TTS
    this.elevenlabs = new ElevenLabsClient({
      apiKey: elevenLabsKey
    });

    // Configuration ElevenLabs
    // Vous pouvez changer le voice_id pour personnaliser la voix
    // Liste des voix: https://api.elevenlabs.io/v1/voices
    this.elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Adam voice (masculine)

    // Pour une voix féminine, essayez: '21m00Tcm4TlvDq8ikWAM' (Rachel)
    // Pour une voix africaine/internationale: 'XB0fDUnXU5powFXDhCwa' (Charlotte)
  }

  /**
   * Transcription audio en texte avec OpenAI Whisper
   * @param {Buffer} audioBuffer - Buffer audio
   * @param {string} filename - Nom du fichier
   * @returns {Promise<string>} - Texte transcrit
   */
  async transcribeAudio(audioBuffer, filename = 'audio.webm') {
    try {
      console.log('🎤 Transcription audio avec Whisper...');

      // Créer un fichier temporaire
      const tempPath = `/tmp/${Date.now()}_${filename}`;
      fs.writeFileSync(tempPath, audioBuffer);

      // Créer un stream de fichier pour OpenAI
      const fileStream = fs.createReadStream(tempPath);

      // Transcription avec Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: fileStream,
        model: 'whisper-1',
        language: 'fr', // Français
        response_format: 'text'
      });

      // Supprimer le fichier temporaire
      fs.unlinkSync(tempPath);

      console.log('✅ Transcription réussie:', transcription);
      return transcription;

    } catch (error) {
      console.error('❌ Erreur transcription:', error);
      throw new Error('Erreur lors de la transcription audio');
    }
  }

  /**
   * Convertir texte en audio avec ElevenLabs TTS
   * @param {string} text - Texte à convertir
   * @param {string} voiceId - ID de la voix (optionnel)
   * @returns {Promise<Buffer>} - Buffer audio
   */
  async textToSpeech(text, voiceId = null) {
    try {
      console.log('🗣️  Génération audio avec ElevenLabs...');

      const voice = voiceId || this.elevenLabsVoiceId;

      // Générer l'audio avec ElevenLabs
      const audioStream = await this.elevenlabs.textToSpeech.convert(voice, {
        text: text,
        model_id: 'eleven_multilingual_v2', // Support multilingue incluant français
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      });

      // Convertir le stream en buffer
      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);

      console.log('✅ Génération audio réussie:', audioBuffer.length, 'bytes');
      return audioBuffer;

    } catch (error) {
      console.error('❌ Erreur TTS:', error);
      throw new Error('Erreur lors de la génération audio');
    }
  }

  /**
   * Liste des voix disponibles sur ElevenLabs
   * @returns {Promise<Array>} - Liste des voix
   */
  async getAvailableVoices() {
    try {
      const voices = await this.elevenlabs.voices.getAll();
      return voices.voices.map(voice => ({
        voice_id: voice.voice_id,
        name: voice.name,
        category: voice.category,
        description: voice.description,
        preview_url: voice.preview_url
      }));
    } catch (error) {
      console.error('❌ Erreur récupération voix:', error);
      return [];
    }
  }

  /**
   * Traitement complet: Audio → Texte → Réponse → Audio
   * @param {Buffer} audioBuffer - Buffer audio de l'utilisateur
   * @param {Function} processMessageCallback - Fonction pour traiter le message
   * @param {string} sessionId - ID de session
   * @returns {Promise<Object>} - { transcription, response, audioBuffer }
   */
  async processAudioMessage(audioBuffer, processMessageCallback, sessionId, filename = 'audio.webm') {
    try {
      // 1. Transcrire l'audio en texte
      const transcription = await this.transcribeAudio(audioBuffer, filename);

      if (!transcription || transcription.trim() === '') {
        throw new Error('Impossible de transcrire l\'audio');
      }

      // 2. Traiter le message avec le bot
      const botResponse = await processMessageCallback(transcription, sessionId);

      // 3. Convertir la réponse en audio
      const responseAudio = await this.textToSpeech(botResponse.response);

      return {
        transcription: transcription,
        response: botResponse.response,
        audioBuffer: responseAudio
      };

    } catch (error) {
      console.error('❌ Erreur traitement audio complet:', error);
      throw error;
    }
  }
}
