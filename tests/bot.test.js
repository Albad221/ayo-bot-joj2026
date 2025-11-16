/**
 * Tests simples pour le Bot Ayo
 * Utiliser Jest pour exécuter: npm test
 */

import knowledgeLoader from '../src/knowledge/loader.js';

describe('Bot Ayo - Tests de base de connaissance', () => {

  beforeAll(async () => {
    // Charger la base de connaissance avant les tests
    await knowledgeLoader.loadAll();
  });

  describe('Chargement de la base de connaissance', () => {

    test('La base statique est chargée', () => {
      const kb = knowledgeLoader.getKnowledgeBase();
      expect(kb.static).toBeDefined();
      expect(Object.keys(kb.static).length).toBeGreaterThan(0);
    });

    test('La base dynamique est chargée', () => {
      const kb = knowledgeLoader.getKnowledgeBase();
      expect(kb.dynamic).toBeDefined();
      expect(Object.keys(kb.dynamic).length).toBeGreaterThan(0);
    });

    test('Tous les fichiers statiques sont présents', () => {
      const kb = knowledgeLoader.getKnowledgeBase();
      expect(kb.static.general).toBeDefined();
      expect(kb.static.ayo).toBeDefined();
      expect(kb.static.sports).toBeDefined();
      expect(kb.static.venues).toBeDefined();
      expect(kb.static.tourism).toBeDefined();
    });

    test('Tous les fichiers dynamiques sont présents', () => {
      const kb = knowledgeLoader.getKnowledgeBase();
      expect(kb.dynamic.schedule).toBeDefined();
      expect(kb.dynamic.results).toBeDefined();
      expect(kb.dynamic.news).toBeDefined();
      expect(kb.dynamic.tickets).toBeDefined();
    });
  });

  describe('Données statiques - General', () => {

    test('Informations JOJ 2026 sont correctes', () => {
      const general = knowledgeLoader.getSection('static', 'general');

      expect(general.joj2026).toBeDefined();
      expect(general.joj2026.ville_hote).toBe('Dakar');
      expect(general.joj2026.pays).toBe('Sénégal');
      expect(general.joj2026.dates.annee).toBe(2026);
    });

    test('Les dates des JOJ sont définies', () => {
      const general = knowledgeLoader.getSection('static', 'general');

      expect(general.joj2026.dates.debut).toBe('2026-10-31');
      expect(general.joj2026.dates.fin).toBe('2026-11-13');
      expect(general.joj2026.dates.duree_jours).toBe(14);
    });

    test('La vision et les valeurs sont présentes', () => {
      const general = knowledgeLoader.getSection('static', 'general');

      expect(general.joj2026.vision.slogan).toBeDefined();
      expect(general.joj2026.valeurs_olympiques).toContain('Excellence');
      expect(general.joj2026.valeurs_olympiques).toContain('Amitié');
      expect(general.joj2026.valeurs_olympiques).toContain('Respect');
    });

    test('FAQ contient des questions', () => {
      const general = knowledgeLoader.getSection('static', 'general');

      expect(general.faq).toBeDefined();
      expect(Array.isArray(general.faq)).toBe(true);
      expect(general.faq.length).toBeGreaterThan(0);

      // Vérifier structure d'une FAQ
      const firstFaq = general.faq[0];
      expect(firstFaq.question).toBeDefined();
      expect(firstFaq.reponse).toBeDefined();
    });
  });

  describe('Données statiques - Ayo', () => {

    test('Informations sur la mascotte Ayo', () => {
      const ayo = knowledgeLoader.getSection('static', 'ayo');

      expect(ayo.mascotte).toBeDefined();
      expect(ayo.mascotte.nom).toBe('Ayo');
      expect(ayo.mascotte.signification.origine).toBe('Wolof (langue sénégalaise)');
      expect(ayo.mascotte.signification.traduction).toBe('Joie');
    });

    test('Description de la mascotte', () => {
      const ayo = knowledgeLoader.getSection('static', 'ayo');

      expect(ayo.mascotte.description.animal).toBe('Lion');
      expect(ayo.mascotte.description.caracteristiques).toBeDefined();
      expect(Array.isArray(ayo.mascotte.description.caracteristiques)).toBe(true);
    });

    test('Personnalité du bot est définie', () => {
      const ayo = knowledgeLoader.getSection('static', 'ayo');

      expect(ayo.personnalite_bot).toBeDefined();
      expect(ayo.personnalite_bot.ton).toBeDefined();
      expect(ayo.personnalite_bot.style_communication).toBeDefined();
      expect(ayo.personnalite_bot.exemples_reponses).toBeDefined();
    });

    test('Phrases types disponibles', () => {
      const ayo = knowledgeLoader.getSection('static', 'ayo');

      expect(ayo.mascotte.phrases_types).toBeDefined();
      expect(Array.isArray(ayo.mascotte.phrases_types)).toBe(true);
      expect(ayo.mascotte.phrases_types.length).toBeGreaterThan(0);
    });
  });

  describe('Données statiques - Sports', () => {

    test('Liste des sports olympiques est présente', () => {
      const sports = knowledgeLoader.getSection('static', 'sports');

      expect(sports.sports_olympiques).toBeDefined();
      expect(Array.isArray(sports.sports_olympiques)).toBe(true);
      expect(sports.sports_olympiques.length).toBeGreaterThan(0);
    });

    test('Sports collectifs sont définis', () => {
      const sports = knowledgeLoader.getSection('static', 'sports');

      const sportsCollectifs = sports.sports_olympiques.find(
        s => s.categorie === 'Sports collectifs'
      );

      expect(sportsCollectifs).toBeDefined();
      expect(sportsCollectifs.sports).toBeDefined();
      expect(Array.isArray(sportsCollectifs.sports)).toBe(true);
    });

    test('Sports de combat incluent le judo', () => {
      const sports = knowledgeLoader.getSection('static', 'sports');

      const sportsCombat = sports.sports_olympiques.find(
        s => s.categorie === 'Sports de combat'
      );

      expect(sportsCombat).toBeDefined();
      const judo = sportsCombat.sports.find(s => s.nom === 'Judo');
      expect(judo).toBeDefined();
    });

    test('Égalité des genres est promue', () => {
      const sports = knowledgeLoader.getSection('static', 'sports');

      expect(sports.egalite_genres).toBeDefined();
      expect(sports.egalite_genres.principes).toBeDefined();
    });
  });

  describe('Données statiques - Venues', () => {

    test('Sites de compétition sont définis', () => {
      const venues = knowledgeLoader.getSection('static', 'venues');

      expect(venues.sites_competition).toBeDefined();
      expect(venues.sites_competition.sites_principaux).toBeDefined();
    });

    test('Stade Abdoulaye Wade est présent', () => {
      const venues = knowledgeLoader.getSection('static', 'venues');

      const stade = venues.sites_competition.sites_principaux.find(
        s => s.nom === 'Stade Abdoulaye Wade (Stade de Diamniadio)'
      );

      expect(stade).toBeDefined();
      expect(stade.capacite).toBe('50000 places');
      expect(stade.sports).toContain('Athlétisme');
    });

    test('Infrastructure de transport est définie', () => {
      const venues = knowledgeLoader.getSection('static', 'venues');

      expect(venues.infrastructure_support.transport).toBeDefined();
      expect(venues.infrastructure_support.transport.aeroport).toBeDefined();
      expect(venues.infrastructure_support.transport.train_ter).toBeDefined();
    });

    test('Initiatives de durabilité sont présentes', () => {
      const venues = knowledgeLoader.getSection('static', 'venues');

      expect(venues.durabilite).toBeDefined();
      expect(venues.durabilite.initiatives).toBeDefined();
      expect(Array.isArray(venues.durabilite.initiatives)).toBe(true);
    });
  });

  describe('Données statiques - Tourism', () => {

    test('Présentation de Dakar', () => {
      const tourism = knowledgeLoader.getSection('static', 'tourism');

      expect(tourism.decouvrir_dakar).toBeDefined();
      expect(tourism.decouvrir_dakar.presentation).toBeDefined();
      expect(tourism.decouvrir_dakar.presentation.monnaie).toBe('Franc CFA (XOF)');
    });

    test('Attractions touristiques sont listées', () => {
      const tourism = knowledgeLoader.getSection('static', 'tourism');

      expect(tourism.decouvrir_dakar.attractions_touristiques).toBeDefined();
      expect(Array.isArray(tourism.decouvrir_dakar.attractions_touristiques)).toBe(true);

      const goree = tourism.decouvrir_dakar.attractions_touristiques.find(
        a => a.nom === 'Île de Gorée'
      );
      expect(goree).toBeDefined();
      expect(goree.categorie).toBe('Patrimoine UNESCO');
    });

    test('Gastronomie sénégalaise est présente', () => {
      const tourism = knowledgeLoader.getSection('static', 'tourism');

      expect(tourism.decouvrir_dakar.gastronomie).toBeDefined();
      expect(tourism.decouvrir_dakar.gastronomie.plats_typiques).toBeDefined();

      const thieb = tourism.decouvrir_dakar.gastronomie.plats_typiques.find(
        p => p.nom === 'Thieboudienne (Tiep bou dien)'
      );
      expect(thieb).toBeDefined();
    });

    test('Concept de Teranga est expliqué', () => {
      const tourism = knowledgeLoader.getSection('static', 'tourism');

      expect(tourism.decouvrir_dakar.culture_et_traditions.teranga).toBeDefined();
      expect(tourism.decouvrir_dakar.culture_et_traditions.teranga.nom).toBe('La Teranga');
    });
  });

  describe('Données dynamiques', () => {

    test('Schedule contient les cérémonies', () => {
      const schedule = knowledgeLoader.getSection('dynamic', 'schedule');

      expect(schedule.ceremonie_ouverture).toBeDefined();
      expect(schedule.ceremonie_cloture).toBeDefined();
      expect(schedule.ceremonie_ouverture.date).toBe('2026-10-31');
      expect(schedule.ceremonie_cloture.date).toBe('2026-11-13');
    });

    test('Results a une structure pour le tableau des médailles', () => {
      const results = knowledgeLoader.getSection('dynamic', 'results');

      expect(results.medailles_par_pays).toBeDefined();
      expect(results.resultats_par_sport).toBeDefined();
    });

    test('News contient des actualités', () => {
      const news = knowledgeLoader.getSection('dynamic', 'news');

      expect(news.actualites).toBeDefined();
      expect(Array.isArray(news.actualites)).toBe(true);
    });

    test('Tickets a un statut général', () => {
      const tickets = knowledgeLoader.getSection('dynamic', 'tickets');

      expect(tickets.statut_general).toBeDefined();
      expect(tickets.types_billets).toBeDefined();
    });
  });

  describe('Fonctions de recherche', () => {

    test('Recherche de "Ayo" trouve des résultats', () => {
      const results = knowledgeLoader.search('Ayo');

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test('Recherche de "football" trouve des résultats', () => {
      const results = knowledgeLoader.search('football');

      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);
    });

    test('Recherche de "Dakar" trouve des résultats', () => {
      const results = knowledgeLoader.search('Dakar');

      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Contexte pour l\'IA', () => {

    test('Le contexte pour l\'IA est généré', () => {
      const context = knowledgeLoader.prepareContextForAI();

      expect(context).toBeDefined();
      expect(context.role).toBe('system');
      expect(context.content).toBeDefined();
      expect(context.content).toContain('Ayo');
      expect(context.content).toContain('JOJ');
    });

    test('Le contexte contient la base de connaissance', () => {
      const context = knowledgeLoader.prepareContextForAI();

      expect(context.content).toContain('Dakar');
      expect(context.content).toContain('2026');
    });
  });
});

// Tests additionnels pour l'intégrité des données
describe('Intégrité des données', () => {

  test('Toutes les dates sont au format ISO', () => {
    const general = knowledgeLoader.getSection('static', 'general');
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

    expect(general.joj2026.dates.debut).toMatch(isoDateRegex);
    expect(general.joj2026.dates.fin).toMatch(isoDateRegex);
  });

  test('Les fichiers dynamiques ont _last_updated', () => {
    const schedule = knowledgeLoader.getSection('dynamic', 'schedule');
    const results = knowledgeLoader.getSection('dynamic', 'results');
    const news = knowledgeLoader.getSection('dynamic', 'news');
    const tickets = knowledgeLoader.getSection('dynamic', 'tickets');

    expect(schedule._last_updated).toBeDefined();
    expect(results._last_updated).toBeDefined();
    expect(news._last_updated).toBeDefined();
    expect(tickets._last_updated).toBeDefined();
  });

  test('Pas de valeurs null dans les données critiques', () => {
    const general = knowledgeLoader.getSection('static', 'general');

    expect(general.joj2026.ville_hote).not.toBeNull();
    expect(general.joj2026.pays).not.toBeNull();
    expect(general.joj2026.dates.debut).not.toBeNull();
    expect(general.joj2026.dates.fin).not.toBeNull();
  });
});
