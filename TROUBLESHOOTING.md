# 🔧 Guide de Dépannage - Bot Ayo

## Problème: "localhost is down" dans le navigateur

### ✅ Vérifications Rapides

**1. Vérifier que le serveur tourne:**
```bash
curl http://localhost:3002/health
```

Si vous voyez `{"status":"ok"...}` → Le serveur fonctionne!

**2. Vérifier le port:**
```bash
lsof -i :3002
```

Si vous voyez `node` dans la liste → Le serveur est actif!

---

## 🔧 Solutions

### Solution 1: Rafraîchir le Navigateur (ESSAYER EN PREMIER)

**Sur Mac:**
- Chrome/Safari: `Cmd + Shift + R` (rechargement forcé)
- Ou: `Cmd + Option + E` puis `Cmd + R`

**Sur Windows:**
- Chrome: `Ctrl + Shift + R`
- Firefox: `Ctrl + F5`

### Solution 2: Vider le Cache du Navigateur

**Chrome:**
1. Ouvrir les DevTools: `Cmd + Option + I` (Mac) ou `F12` (Windows)
2. Clic droit sur le bouton Rafraîchir
3. Choisir "Vider le cache et effectuer une actualisation forcée"

**Safari:**
1. Menu Safari → Préférences
2. Avancées → Cocher "Afficher le menu Développement"
3. Menu Développement → Vider les caches
4. Rafraîchir la page

### Solution 3: Utiliser un Navigateur Différent

Si Chrome ne fonctionne pas, essayez:
- Safari
- Firefox
- Edge

### Solution 4: Accéder via l'IP Directement

Au lieu de `localhost`, utilisez:
```
http://127.0.0.1:3002
```

Ouvrez: http://127.0.0.1:3002

---

## 🚀 Solution Alternative: Utiliser un Nouveau Dashboard

Si le problème persiste, créons un dashboard simplifié:
