# Changelog - Bot Ayo

## Version 1.1.0 (16 novembre 2025)

### ✅ Améliorations

**Formatage des Réponses:**
- ✅ Conversion automatique du markdown en HTML
- ✅ Les titres (##, ###) sont maintenant stylisés
- ✅ Le texte en gras (**texte**) s'affiche correctement
- ✅ Les listes à puces sont formatées avec •
- ✅ Meilleure lisibilité des réponses d'Ayo

**Configuration CORS:**
- ✅ Configuration CORS améliorée pour éviter les blocages
- ✅ Support de toutes les origines pour le développement
- ✅ Helmet configuré pour accepter les requêtes cross-origin

**Interface:**
- ✅ Ajout de `simple-chat.html` - interface simplifiée
- ✅ Utilisation de 127.0.0.1 au lieu de localhost
- ✅ Meilleur affichage des messages formatés
- ✅ Style CSS amélioré pour les titres

### 🐛 Corrections

- ✅ Résolution du problème "Serveur inaccessible"
- ✅ Correction du formatage markdown dans le HTML
- ✅ Amélioration de la gestion des erreurs CORS

### 📁 Nouveaux Fichiers

- `admin/simple-chat.html` - Dashboard simplifié
- `chat-terminal.sh` - Chat via terminal
- `TROUBLESHOOTING.md` - Guide de dépannage
- `CHANGELOG.md` - Ce fichier

---

## Version 1.0.0 (16 novembre 2025)

### 🎉 Version Initiale

**Fonctionnalités:**
- ✅ Bot Ayo opérationnel avec GPT-4
- ✅ Base de connaissance complète (9 fichiers JSON)
- ✅ API REST avec 10+ endpoints
- ✅ Interface web de chat
- ✅ Documentation exhaustive (8 fichiers)
- ✅ Tests automatisés
- ✅ Sécurité et rate limiting

**Base de Connaissance:**
- 5 fichiers statiques (general, ayo, sports, venues, tourism)
- 4 fichiers dynamiques (schedule, results, news, tickets)
- ~3000 lignes de données

**Documentation:**
- README.md
- QUICKSTART.md
- DEPLOYMENT.md
- KNOWLEDGE_BASE_SUMMARY.md
- PROJECT_SUMMARY.md
- STATUS.md
- GUIDE_UTILISATION.md
- knowledge/README.md

---

## Prochaines Versions Prévues

### Version 1.2.0 (À venir)
- [ ] Complétion des données dynamiques
- [ ] Ajout de photos et médias
- [ ] Support multilingue (anglais)
- [ ] API d'administration améliorée

### Version 2.0.0 (Avant les JOJ)
- [ ] Intégration WhatsApp Business
- [ ] Widget pour site web
- [ ] Application mobile
- [ ] Base de données PostgreSQL
- [ ] Résultats en temps réel
- [ ] Notifications push
