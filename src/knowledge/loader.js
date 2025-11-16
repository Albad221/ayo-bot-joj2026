/**
 * Loader - Chargement de la base de connaissance
 * Charge les données statiques et dynamiques depuis les fichiers JSON
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class KnowledgeLoader {
  constructor() {
    this.knowledgeBase = {
      static: {},
      dynamic: {}
    };
    this.lastLoad = null;
  }

  /**
   * Charge tous les fichiers de connaissance statique
   */
  async loadStaticKnowledge() {
    const staticPath = path.join(__dirname, '../../knowledge/static');

    try {
      const files = await fs.readdir(staticPath);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(staticPath, file);
          const data = await fs.readJson(filePath);
          const key = file.replace('.json', '');
          this.knowledgeBase.static[key] = data;
        }
      }

      console.log('✅ Base de connaissance statique chargée avec succès');
      console.log(`   Fichiers chargés: ${Object.keys(this.knowledgeBase.static).join(', ')}`);

    } catch (error) {
      console.error('❌ Erreur lors du chargement de la base statique:', error);
      throw error;
    }
  }

  /**
   * Charge tous les fichiers de connaissance dynamique
   */
  async loadDynamicKnowledge() {
    const dynamicPath = path.join(__dirname, '../../knowledge/dynamic');

    try {
      const files = await fs.readdir(dynamicPath);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(dynamicPath, file);
          const data = await fs.readJson(filePath);
          const key = file.replace('.json', '');
          this.knowledgeBase.dynamic[key] = data;
        }
      }

      console.log('✅ Base de connaissance dynamique chargée avec succès');
      console.log(`   Fichiers chargés: ${Object.keys(this.knowledgeBase.dynamic).join(', ')}`);

    } catch (error) {
      console.error('❌ Erreur lors du chargement de la base dynamique:', error);
      throw error;
    }
  }

  /**
   * Charge toute la base de connaissance
   */
  async loadAll() {
    console.log('🔄 Chargement de la base de connaissance...');

    await this.loadStaticKnowledge();
    await this.loadDynamicKnowledge();

    this.lastLoad = new Date();
    console.log(`✅ Base de connaissance complète chargée à ${this.lastLoad.toLocaleString('fr-FR')}`);

    return this.knowledgeBase;
  }

  /**
   * Recharge uniquement les données dynamiques (pour les mises à jour)
   */
  async reloadDynamic() {
    console.log('🔄 Rechargement des données dynamiques...');
    await this.loadDynamicKnowledge();
    this.lastLoad = new Date();
    console.log('✅ Données dynamiques rechargées');
  }

  /**
   * Récupère la base de connaissance complète
   */
  getKnowledgeBase() {
    return this.knowledgeBase;
  }

  /**
   * Récupère une section spécifique
   */
  getSection(type, section) {
    if (type === 'static' || type === 'dynamic') {
      return this.knowledgeBase[type][section] || null;
    }
    return null;
  }

  /**
   * Recherche dans la base de connaissance
   */
  search(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    // Recherche dans les données statiques
    for (const [section, data] of Object.entries(this.knowledgeBase.static)) {
      const dataStr = JSON.stringify(data).toLowerCase();
      if (dataStr.includes(lowerQuery)) {
        results.push({
          type: 'static',
          section,
          data
        });
      }
    }

    // Recherche dans les données dynamiques
    for (const [section, data] of Object.entries(this.knowledgeBase.dynamic)) {
      const dataStr = JSON.stringify(data).toLowerCase();
      if (dataStr.includes(lowerQuery)) {
        results.push({
          type: 'dynamic',
          section,
          data
        });
      }
    }

    return results;
  }

  /**
   * Prépare le contexte pour l'IA
   */
  prepareContextForAI() {
    const context = {
      role: "system",
      content: `Tu es Ayo, la mascotte officielle des Jeux Olympiques de la Jeunesse Dakar 2026.

PERSONNALITÉ:
- Tu es un lion joyeux et énergique
- Ton nom "Ayo" signifie "joie" en wolof
- Tu es accueillant, chaleureux et enthousiaste
- Tu incarnes les valeurs olympiques: excellence, amitié, respect
- Tu es fier de représenter le Sénégal et l'Afrique

STYLE DE COMMUNICATION:
- Utilise un langage simple et accessible
- Sois positif et encourageant
- Partage ta passion pour le sport et l'olympisme
- Valorise la culture sénégalaise et africaine
- Utilise des emojis occasionnellement pour exprimer ta joie

CONNAISSANCES:
Tu as accès à une base de connaissance complète sur:
- Les JOJ Dakar 2026 (dates, lieux, organisation)
- Les sports olympiques
- Les sites de compétition
- La culture et le tourisme à Dakar
- Le planning et les résultats (mis à jour en temps réel)
- La billetterie et informations pratiques

INSTRUCTIONS:
- Réponds de manière concise mais complète
- Si tu ne connais pas une information précise, dis-le honnêtement
- Encourage les utilisateurs à visiter Dakar et découvrir le Sénégal
- Pour les informations dynamiques (planning, résultats, billetterie), indique que ces données sont mises à jour régulièrement
- Termine tes messages importants avec enthousiasme

BASE DE CONNAISSANCE ACTUELLE:
${JSON.stringify(this.knowledgeBase, null, 2)}

N'oublie pas: tu es Ayo, et tu représentes la joie et l'esprit des JOJ 2026! 🦁`
    };

    return context;
  }
}

// Export singleton
const knowledgeLoader = new KnowledgeLoader();
export default knowledgeLoader;
