# 🦁 Guide d'Utilisation - Bot Ayo

## 🎯 Comment Utiliser Ayo

### Option 1: Interface Web (RECOMMANDÉ pour débuter)

**1. Ouvrir le Dashboard**
- Double-cliquer sur le fichier `admin/dashboard.html`
- Il s'ouvrira dans votre navigateur par défaut

**2. Chatter avec Ayo**
- Tapez votre question dans la zone de texte en bas
- Appuyez sur "Envoyer" ou sur la touche Entrée
- Ayo vous répondra en quelques secondes!

**3. Questions Rapides**
- Cliquez sur les boutons bleus pour poser des questions prédéfinies:
  - 📅 **Dates** - Quand ont lieu les JOJ 2026?
  - ⚽ **Sports** - Quels sports au programme?
  - 🎫 **Billets** - Comment acheter des billets?
  - 🌍 **Dakar** - Que visiter à Dakar?
  - 🦁 **Ayo** - Qui est Ayo?

---

### Option 2: API REST (Pour Développeurs)

**Endpoint de Chat:**
```bash
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Votre question ici",
    "sessionId": "votre-session-id"
  }'
```

**Autres Endpoints:**
```bash
# Actualités
curl http://localhost:3002/api/news

# Statistiques
curl http://localhost:3002/api/stats

# Planning du jour
curl http://localhost:3002/api/schedule/today

# Tableau des médailles
curl http://localhost:3002/api/medals
```

---

## 💡 Exemples de Questions

### Sur les JOJ 2026

```
"Quelles sont les dates des JOJ 2026?"
"C'est quoi les Jeux Olympiques de la Jeunesse?"
"Combien d'athlètes vont participer?"
"Pourquoi Dakar a été choisi?"
"Quels sont les objectifs des JOJ?"
"C'est la première fois en Afrique?"
```

### Sur Ayo

```
"Qui es-tu Ayo?"
"Que signifie ton nom?"
"Pourquoi un lion comme mascotte?"
"Quel est ton rôle?"
"Parle-moi de toi!"
```

### Sur les Sports

```
"Quels sports seront au programme?"
"Est-ce qu'il y aura du football?"
"Y a-t-il de la lutte sénégalaise?"
"Quels sports de combat?"
"Parle-moi de l'athlétisme"
"Y a-t-il des sports nouveaux?"
```

### Sur Dakar

```
"Que puis-je visiter à Dakar?"
"Quels sont les plats typiques?"
"Qu'est-ce que la Teranga?"
"Comment aller à l'Île de Gorée?"
"Où manger à Dakar?"
"Quelles plages visiter?"
"Parle-moi de la culture sénégalaise"
```

### Sur les Sites

```
"Où auront lieu les compétitions?"
"C'est quoi le Stade Abdoulaye Wade?"
"Parle-moi du Dakar Arena"
"Comment se déplacer entre les sites?"
"Où est l'aéroport?"
```

### Pratique

```
"Comment acheter des billets?"
"Où se loger à Dakar?"
"Quel est le climat en novembre?"
"Comment devenir bénévole?"
"Y a-t-il des réductions pour étudiants?"
```

---

## 🎨 Comprendre les Réponses d'Ayo

### Style de Communication

Ayo répond toujours avec:
- ✅ **Enthousiasme** - Il est joyeux et énergique
- ✅ **Précision** - Informations exactes et complètes
- ✅ **Emojis** - Pour exprimer sa personnalité
- ✅ **Encouragement** - Il vous motive et vous inspire
- ✅ **Culture** - Il valorise le Sénégal et l'Afrique

### Exemple de Conversation

**Vous:** "Bonjour Ayo!"

**Ayo:** "Nanga def! (Bonjour en wolof!) Je suis Ayo, la mascotte des JOJ Dakar 2026! 🦁 Comment puis-je t'aider aujourd'hui?"

**Vous:** "Quand ont lieu les jeux?"

**Ayo:** "Les Jeux Olympiques de la Jeunesse Dakar 2026 se dérouleront du 31 octobre au 13 novembre 2026. Cela promet deux semaines excitantes pleines d'énergie, de compétitions sportives et de célébrations culturelles! 🎉 Tu es prêt à rejoindre l'aventure? 🦁🌍"

---

## 🔄 Sessions de Conversation

Ayo se souvient de vos conversations précédentes dans une même session:

**Conversation 1:**
```
Vous: "Quels sports y aura-t-il?"
Ayo: [Liste des sports]

Vous: "Et le football?"
Ayo: [Détails sur le football, en comprenant le contexte]
```

Pour recommencer une nouvelle conversation, rafraîchissez la page du dashboard.

---

## 📊 Limitations Actuelles

### Ce qu'Ayo peut faire maintenant:
- ✅ Répondre sur les JOJ 2026 (infos générales)
- ✅ Expliquer qui il est (Ayo la mascotte)
- ✅ Décrire les sports olympiques
- ✅ Donner des infos sur Dakar et le Sénégal
- ✅ Parler des sites de compétition
- ✅ Donner des conseils touristiques

### Ce qui sera ajouté plus tard:
- ⏳ Planning détaillé des compétitions (à compléter)
- ⏳ Résultats en temps réel (pendant les jeux)
- ⏳ Prix exacts de billetterie (à confirmer)
- ⏳ Actualités quotidiennes (à ajouter)
- ⏳ Photos et vidéos (à intégrer)

---

## 🎯 Conseils d'Utilisation

### Pour les Meilleures Réponses

1. **Posez des questions claires**
   - ✅ Bon: "Quelles sont les dates des JOJ 2026?"
   - ❌ Moins bon: "Dates?"

2. **Soyez spécifique**
   - ✅ Bon: "Quels plats sénégalais dois-je goûter?"
   - ❌ Moins bon: "Nourriture?"

3. **Utilisez le contexte**
   - Ayo se souvient de la conversation
   - Vous pouvez poser des questions de suite

4. **N'hésitez pas à reformuler**
   - Si la réponse n'est pas claire, demandez autrement

---

## 📱 Intégration Future

Le bot Ayo pourra être intégré à:
- 💬 WhatsApp (pour chatter via téléphone)
- 🌐 Site web officiel (widget de chat)
- 📱 Application mobile JOJ 2026
- 🤖 Telegram, Messenger, etc.

---

## 🛠️ Pour les Administrateurs JOJ

### Mettre à Jour les Données

**Ajouter une actualité:**
1. Créer un fichier JSON:
```json
{
  "titre": "Billetterie ouverte!",
  "contenu": "Les billets sont maintenant disponibles...",
  "categorie": "Billetterie",
  "importance": "haute"
}
```

2. Envoyer à l'API admin:
```bash
curl -X POST http://localhost:3001/api/admin/news/add \
  -H "X-API-Key: joj-dakar-2026-admin-key-secure-123" \
  -H "Content-Type: application/json" \
  -d @actualite.json
```

3. Recharger le bot:
```bash
curl -X POST http://localhost:3002/api/admin/reload \
  -H "X-API-Key: joj-dakar-2026-admin-key-secure-123"
```

**Guide complet:** Voir `knowledge/README.md`

---

## 🌟 Cas d'Usage

### 1. Visiteur qui planifie son voyage
```
"Quand ont lieu les JOJ?"
"Que visiter à Dakar?"
"Où manger?"
"Comment se déplacer?"
"Quels sports voir?"
```

### 2. Journaliste qui prépare un article
```
"Pourquoi Dakar a été choisi?"
"Quels sont les objectifs des JOJ?"
"Quel est l'héritage attendu?"
"Quelles infrastructures?"
"Qui est la mascotte?"
```

### 3. Famille qui veut assister
```
"Comment acheter des billets?"
"Y a-t-il des réductions enfants?"
"Où se loger avec des enfants?"
"Quels sports pour les jeunes?"
"Y a-t-il des activités en dehors des compétitions?"
```

### 4. Athlète qui se prépare
```
"Quels sont les sites de compétition?"
"Comment est le climat en novembre?"
"Où est le village olympique?"
"Quels sports sont au programme?"
"Y a-t-il des centres d'entraînement?"
```

---

## 🎓 Formation

### Pour Bien Utiliser Ayo

**Niveau 1: Débutant**
- Utilisez le dashboard HTML
- Cliquez sur les questions rapides
- Lisez les réponses d'Ayo

**Niveau 2: Intermédiaire**
- Posez vos propres questions
- Enchaînez les questions dans une conversation
- Explorez tous les sujets (JOJ, sports, Dakar...)

**Niveau 3: Avancé**
- Utilisez l'API REST
- Intégrez Ayo dans votre application
- Mettez à jour les données via l'API admin

---

## 📞 Aide et Support

### Le bot ne répond pas?
1. Vérifiez que le serveur est lancé (voir STATUS.md)
2. Rafraîchissez la page du dashboard
3. Vérifiez votre connexion internet

### Les réponses sont lentes?
- Normal: l'IA prend 2-5 secondes pour répondre
- Connexion lente: peut prendre plus de temps

### Ayo ne connaît pas une information?
- Il vous le dira honnêtement
- Ces données seront ajoutées progressivement

---

## 🎉 Amusez-vous avec Ayo!

Ayo est là pour vous aider et partager sa joie des JOJ Dakar 2026!

N'hésitez pas à:
- 💬 Lui poser toutes vos questions
- 🎨 Découvrir sa personnalité unique
- 🌍 Explorer Dakar et le Sénégal
- ⚽ Apprendre sur les sports olympiques
- 🦁 Comprendre les valeurs olympiques

**Ayo vous dit:**
> "Grandir ensemble! C'est le slogan des JOJ 2026, et c'est aussi ma mission: grandir avec toi en partageant les valeurs du sport et de l'olympisme! 🦁🌟"

---

**Bon chat avec Ayo! 🦁🇸🇳🎉**
