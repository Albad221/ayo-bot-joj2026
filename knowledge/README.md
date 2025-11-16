# Base de Connaissance - Guide de Mise à Jour

## Structure des Dossiers

```
knowledge/
├── static/          # Données permanentes (ne pas modifier sans raison)
│   ├── general.json
│   ├── ayo.json
│   ├── sports.json
│   ├── venues.json
│   └── tourism.json
│
└── dynamic/         # Données à mettre à jour régulièrement
    ├── schedule.json    # Planning des compétitions
    ├── results.json     # Résultats et médailles
    ├── news.json        # Actualités et annonces
    ├── tickets.json     # Informations billetterie
    └── backups/         # Sauvegardes automatiques
```

---

## 📝 COMMENT METTRE À JOUR LES DONNÉES

### Option 1: Via l'Interface d'Administration (RECOMMANDÉ)

L'API d'administration permet de mettre à jour facilement les données dynamiques.

#### Démarrer l'API Admin:

```bash
npm run admin
# L'API sera accessible sur http://localhost:3001
```

#### Exemples d'utilisation:

**Ajouter une actualité:**

```bash
curl -X POST http://localhost:3001/api/admin/news/add \
  -H "X-API-Key: VOTRE_CLE_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Ouverture de la billetterie!",
    "contenu": "Les billets pour les JOJ 2026 sont maintenant disponibles sur notre site officiel.",
    "categorie": "Billetterie",
    "importance": "haute"
  }'
```

**Ajouter un résultat:**

```bash
curl -X POST http://localhost:3001/api/admin/results/add \
  -H "X-API-Key: VOTRE_CLE_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "sport": "athletisme",
    "epreuve": "100m_masculin",
    "resultat": {
      "date": "2026-11-05",
      "statut": "Terminé",
      "or": {
        "nom": "John DOE",
        "pays": "USA",
        "code_pays": "USA",
        "temps": "10.23"
      },
      "argent": {
        "nom": "Pierre MARTIN",
        "pays": "France",
        "code_pays": "FRA",
        "temps": "10.28"
      },
      "bronze": {
        "nom": "Ahmed DIALLO",
        "pays": "Sénégal",
        "code_pays": "SEN",
        "temps": "10.31"
      }
    }
  }'
```

**Recharger les données dans le bot:**

```bash
curl -X POST http://localhost:3000/api/admin/reload \
  -H "X-API-Key: VOTRE_CLE_ADMIN"
```

---

### Option 2: Modification Directe des Fichiers JSON

Vous pouvez aussi éditer directement les fichiers JSON.

#### ⚠️ RÈGLES IMPORTANTES:

1. **Respecter le format JSON**
   - Toujours utiliser des guillemets doubles `"` (pas simples `'`)
   - Respecter les virgules (sauf dernier élément)
   - Vérifier les accolades `{}` et crochets `[]`

2. **Dates**: Format ISO `YYYY-MM-DD` (ex: `2026-11-05`)

3. **Heures**: Format 24h `HH:MM` (ex: `15:30`)

4. **Mettre à jour `_last_updated`**: Toujours changer cette date quand vous modifiez un fichier

5. **TESTER le JSON**: Utilisez un validateur JSON en ligne avant de sauvegarder

#### Exemple - Ajouter une compétition au planning:

1. Ouvrir `knowledge/dynamic/schedule.json`

2. Trouver la section `competitions_par_jour`

3. Ajouter votre compétition:

```json
"2026-11-05": {
  "jour": "Jour 6",
  "competitions": [
    {
      "sport": "Athlétisme - 100m masculin",
      "heure": "15:30",
      "lieu": "Stade Abdoulaye Wade",
      "type": "Finale",
      "diffusion_tv": true,
      "billetterie_disponible": true
    },
    {
      "sport": "Natation - 200m nage libre féminin",
      "heure": "17:00",
      "lieu": "Centre Aquatique",
      "type": "Finale",
      "diffusion_tv": true,
      "billetterie_disponible": true
    }
  ]
}
```

4. Mettre à jour la date:
```json
"_last_updated": "2025-11-16"
```

5. **VALIDER** le JSON sur https://jsonlint.com

6. Sauvegarder le fichier

7. Recharger dans le bot:
```bash
curl -X POST http://localhost:3000/api/admin/reload \
  -H "X-API-Key: VOTRE_CLE_ADMIN"
```

---

## 📋 GUIDE PAR FICHIER

### 1. schedule.json - Planning

**Quand mettre à jour:**
- Quand le planning officiel est publié
- En cas de changement d'horaire
- Pour ajouter des événements spéciaux

**Sections importantes:**
- `ceremonie_ouverture` et `ceremonie_cloture`
- `competitions_par_jour` - Liste quotidienne
- `competitions_par_sport` - Vue par sport
- `evenements_speciaux` - Événements culturels

**Exemple - Changer l'heure de la cérémonie:**
```json
"ceremonie_ouverture": {
  "date": "2026-10-31",
  "heure": "20:00",  // ← Modifier ici
  "lieu": "Stade Abdoulaye Wade (Diamniadio)",
  "description": "Cérémonie d'ouverture officielle des JOJ Dakar 2026",
  "diffusion_tv": true,
  "billetterie_disponible": true
}
```

---

### 2. results.json - Résultats

**Quand mettre à jour:**
- Immédiatement après chaque finale
- Quand un record est battu
- Mise à jour du tableau des médailles

**Sections importantes:**
- `medailles_par_pays.classement` - Tableau des médailles
- `resultats_par_sport` - Résultats détaillés
- `records_battus` - Liste des records
- `moments_forts` - Highlights

**Exemple - Mettre à jour le tableau des médailles:**
```json
"medailles_par_pays": {
  "classement": [
    {
      "rang": 1,
      "pays": "États-Unis",
      "code_pays": "USA",
      "or": 12,
      "argent": 8,
      "bronze": 10,
      "total": 30
    },
    {
      "rang": 2,
      "pays": "Sénégal",
      "code_pays": "SEN",
      "or": 5,
      "argent": 7,
      "bronze": 9,
      "total": 21
    }
  ]
}
```

---

### 3. news.json - Actualités

**Quand mettre à jour:**
- Nouvelles annonces officielles
- Changements importants
- Résultats exceptionnels
- Alertes diverses

**Sections importantes:**
- `actualites` - Liste des news (dernière en premier)
- `annonces_importantes` - Statuts billetterie, bénévolat, etc.
- `modifications_planning` - Changements de dernière minute

**Exemple - Ajouter une actualité:**
```json
"actualites": [
  {
    "id": "news_002",  // ← Incrémenter l'ID
    "date": "2025-11-20",
    "categorie": "Billetterie",
    "titre": "Billetterie ouverte!",
    "resume": "Les billets sont maintenant disponibles",
    "contenu": "Nous sommes heureux d'annoncer l'ouverture de la billetterie pour les JOJ Dakar 2026! Rendez-vous sur notre site officiel pour réserver vos places.",
    "importance": "haute",
    "visible": true
  },
  {
    "id": "news_001",
    "date": "2025-11-16",
    // ... actualité précédente
  }
]
```

---

### 4. tickets.json - Billetterie

**Quand mettre à jour:**
- Ouverture de la billetterie
- Changement de tarifs
- Ajout de nouveaux types de billets
- Billets épuisés

**Sections importantes:**
- `statut_general` - État de la billetterie
- `types_billets` - Catégories et prix
- `tarifs_reduits` - Réductions disponibles
- `points_vente` - Où acheter

**Exemple - Ouvrir la billetterie:**
```json
"statut_general": {
  "billetterie_ouverte": true,  // ← Changer à true
  "date_ouverture": "2025-12-01",
  "site_billetterie": "https://billetterie.dakar2026.sn",
  "message": "La billetterie est maintenant ouverte! Réservez vos places dès maintenant."
}
```

**Exemple - Ajouter des prix:**
```json
"ceremonie_ouverture": {
  "disponible": true,
  "categories": [
    {
      "categorie": "Premium",
      "prix_fcfa": 50000,     // ← Ajouter prix
      "prix_eur": 76,         // ← Ajouter prix EUR
      "description": "Places VIP avec meilleure vue",
      "avantages": ["Siège premium", "Programme officiel", "Accès lounge"]
    },
    {
      "categorie": "Standard",
      "prix_fcfa": 25000,
      "prix_eur": 38,
      "description": "Places assises standard",
      "avantages": []
    }
  ]
}
```

---

## 🔄 WORKFLOW RECOMMANDÉ

### Avant les JOJ (Préparation)

1. **Compléter le planning** (`schedule.json`)
   - Ajouter toutes les dates de compétitions
   - Vérifier les horaires
   - Confirmer les lieux

2. **Ouvrir la billetterie** (`tickets.json`)
   - Définir les prix
   - Lister les points de vente
   - Mettre statut à "ouverte"

3. **Annoncer les nouvelles** (`news.json`)
   - Compte à rebours
   - Annonces importantes
   - Programme culturel

### Pendant les JOJ (Mise à jour quotidienne)

**Chaque jour:**

1. **Matin**: Vérifier le planning du jour
   - Confirmer les horaires dans `schedule.json`
   - Annoncer dans `news.json` si changements

2. **Après chaque finale**: Ajouter les résultats
   - Mettre à jour `results.json`
   - Podium complet
   - Tableau des médailles

3. **Soir**: Résumé de la journée
   - Ajouter actualité dans `news.json`
   - Moments forts
   - Records battus

4. **Recharger le bot**:
   ```bash
   curl -X POST http://localhost:3000/api/admin/reload \
     -H "X-API-Key: VOTRE_CLE_ADMIN"
   ```

---

## ✅ CHECKLIST DE VÉRIFICATION

Avant de sauvegarder vos modifications:

- [ ] Le JSON est valide (testé sur jsonlint.com)
- [ ] La date `_last_updated` est à jour
- [ ] Les dates sont au format `YYYY-MM-DD`
- [ ] Les heures sont au format `HH:MM` (24h)
- [ ] Les guillemets sont doubles `"`
- [ ] Les virgules sont correctes
- [ ] Pas de virgule après le dernier élément
- [ ] Les caractères spéciaux sont échappés si nécessaire

---

## 🆘 AIDE ET SUPPORT

### Erreurs courantes:

**Erreur: "Unexpected token"**
→ Problème de syntaxe JSON (virgule manquante/en trop, guillemet oublié)

**Erreur: "Cannot read property"**
→ Structure incorrecte (vérifier les noms de propriétés)

**Le bot ne voit pas les changements**
→ Oubli de recharger les données (`/api/admin/reload`)

### Validation JSON en ligne:
- https://jsonlint.com
- https://jsonformatter.org

### Support technique:
Contactez l'équipe technique JOJ en cas de problème.

---

## 📁 BACKUPS

Les backups automatiques sont créés dans `knowledge/dynamic/backups/` à chaque modification via l'API admin.

**Restaurer un backup:**

```bash
# Lister les backups
ls knowledge/dynamic/backups/

# Restaurer (remplacer FICHIER par le nom du backup)
cp knowledge/dynamic/backups/FICHIER knowledge/dynamic/schedule.json

# Recharger
curl -X POST http://localhost:3000/api/admin/reload \
  -H "X-API-Key: VOTRE_CLE_ADMIN"
```

**Créer un backup manuel:**

```bash
cp knowledge/dynamic/schedule.json knowledge/dynamic/schedule.backup-$(date +%Y%m%d).json
```

---

Bonne mise à jour! Ayo compte sur vous pour fournir les meilleures informations aux visiteurs des JOJ 2026! 🦁🎉
