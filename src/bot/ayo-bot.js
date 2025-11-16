/**
 * Ayo Bot - Logique principale du chatbot
 * Gère les interactions avec l'utilisateur via l'API OpenAI ou Claude
 */

import OpenAI from 'openai';
import knowledgeLoader from '../knowledge/loader.js';

class AyoBot {
  constructor(apiKey, model = 'gpt-4-turbo-preview') {
    this.openai = new OpenAI({
      apiKey: apiKey
    });
    this.model = model;
    this.conversationHistory = new Map(); // Stocke l'historique par session
  }

  /**
   * Initialise le bot en chargeant la base de connaissance
   */
  async initialize() {
    console.log('🦁 Initialisation d\'Ayo...');
    await knowledgeLoader.loadAll();
    console.log('✅ Ayo est prêt à répondre aux questions!');
  }

  /**
   * Recharge les données dynamiques
   */
  async reloadDynamicData() {
    await knowledgeLoader.reloadDynamic();
  }

  /**
   * Récupère ou crée l'historique de conversation pour une session
   */
  getConversationHistory(sessionId) {
    if (!this.conversationHistory.has(sessionId)) {
      // Nouvelle session: initialiser avec le contexte système
      const systemContext = knowledgeLoader.prepareContextForAI();
      this.conversationHistory.set(sessionId, [systemContext]);
    }
    return this.conversationHistory.get(sessionId);
  }

  /**
   * Nettoie l'historique d'une session
   */
  clearSession(sessionId) {
    this.conversationHistory.delete(sessionId);
  }

  /**
   * Nettoie toutes les sessions inactives (plus de 30 minutes)
   */
  cleanupOldSessions() {
    // À implémenter: système de timestamps pour nettoyer les vieilles sessions
    // Pour l'instant, simple nettoyage manuel possible
  }

  /**
   * Traite un message de l'utilisateur
   */
  async processMessage(userMessage, sessionId = 'default') {
    try {
      // Récupérer l'historique de la conversation
      const history = this.getConversationHistory(sessionId);

      // Ajouter le message de l'utilisateur
      history.push({
        role: 'user',
        content: userMessage
      });

      // Appeler l'API OpenAI
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: history,
        temperature: 0.8, // Un peu créatif pour la personnalité d'Ayo
        max_tokens: 1000,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });

      // Récupérer la réponse
      const ayoResponse = response.choices[0].message.content;

      // Ajouter la réponse à l'historique
      history.push({
        role: 'assistant',
        content: ayoResponse
      });

      // Limiter la taille de l'historique (garder les 10 derniers échanges + contexte)
      if (history.length > 21) { // 1 système + 20 messages (10 échanges)
        history.splice(1, 2); // Supprimer les 2 plus anciens messages (user + assistant)
      }

      return {
        success: true,
        response: ayoResponse,
        sessionId: sessionId
      };

    } catch (error) {
      console.error('❌ Erreur lors du traitement du message:', error);

      return {
        success: false,
        error: error.message,
        response: "Désolé, je rencontre un problème technique. Peux-tu réessayer dans un moment? 😊"
      };
    }
  }

  /**
   * Génère une réponse de bienvenue
   */
  getWelcomeMessage() {
    const welcomeMessages = [
      "Bonjour! Je suis Ayo, la mascotte des JOJ Dakar 2026! 🦁 Comment puis-je t'aider aujourd'hui?",
      "Salut! C'est Ayo qui te parle! Prêt à découvrir les Jeux Olympiques de la Jeunesse Dakar 2026? 🌟",
      "Nanga def! (Bonjour en wolof!) Je suis Ayo, ton guide pour les JOJ 2026! Que veux-tu savoir? 🦁",
      "Hello! Ayo à l'appareil! Pose-moi toutes tes questions sur les JOJ Dakar 2026! ⚡"
    ];

    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  }

  /**
   * Recherche rapide dans la base de connaissance
   */
  async quickSearch(query) {
    const results = knowledgeLoader.search(query);
    return results;
  }

  /**
   * Récupère le planning du jour
   */
  getTodaySchedule() {
    const schedule = knowledgeLoader.getSection('dynamic', 'schedule');
    const today = new Date().toISOString().split('T')[0];

    if (schedule && schedule.competitions_par_jour && schedule.competitions_par_jour[today]) {
      return schedule.competitions_par_jour[today];
    }

    return null;
  }

  /**
   * Récupère les dernières actualités
   */
  getLatestNews(limit = 5) {
    const news = knowledgeLoader.getSection('dynamic', 'news');

    if (news && news.actualites) {
      return news.actualites
        .filter(n => n.visible)
        .slice(0, limit);
    }

    return [];
  }

  /**
   * Récupère le tableau des médailles
   */
  getMedalTable() {
    const results = knowledgeLoader.getSection('dynamic', 'results');

    if (results && results.medailles_par_pays && results.medailles_par_pays.classement) {
      return results.medailles_par_pays.classement;
    }

    return [];
  }

  /**
   * Récupère les informations sur la billetterie
   */
  getTicketInfo() {
    return knowledgeLoader.getSection('dynamic', 'tickets');
  }

  /**
   * Statistiques du bot
   */
  getStats() {
    return {
      activeSessions: this.conversationHistory.size,
      knowledgeBase: {
        static: Object.keys(knowledgeLoader.knowledgeBase.static).length,
        dynamic: Object.keys(knowledgeLoader.knowledgeBase.dynamic).length
      },
      lastKnowledgeUpdate: knowledgeLoader.lastLoad
    };
  }
}

export default AyoBot;
