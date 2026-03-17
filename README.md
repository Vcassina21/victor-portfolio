# 🚀 Portfolio Victor Cassina — Guide de démarrage

## ✅ Étape 1 — Installer Node.js (une seule fois)

1. Va sur https://nodejs.org
2. Clique sur le bouton vert **"LTS"** (version recommandée)
3. Télécharge et installe (clique sur "Suivant" partout)
4. Redémarre ton ordinateur

---

## ✅ Étape 2 — Lancer le site en local

Ouvre le **cmd** (Windows) ou **Terminal** (Mac) et colle ces commandes une par une :

```
cd chemin/vers/victor-portfolio
```
> Remplace `chemin/vers/victor-portfolio` par l'emplacement du dossier.
> Exemple Windows : `cd C:\Users\Victor\Desktop\victor-portfolio`

```
npm install
```
> Attend que ça finisse (1-2 minutes, première fois seulement)

```
npm run dev
```

3. Ouvre ton navigateur et va sur → **http://localhost:3000**
4. Ton portfolio s'affiche ! 🎉

Pour arrêter : appuie sur **Ctrl + C** dans le terminal.

---

## ✏️ Étape 3 — Modifier le contenu

Ouvre le fichier **`contenu.js`** dans n'importe quel éditeur de texte (Notepad, VS Code...).

C'est le SEUL fichier à modifier pour changer :
- Ton nom, titre, citation
- Ta bio
- Tes compétences et les pills
- Tes expériences
- Ton email et LinkedIn

Sauvegarde → le site se met à jour automatiquement dans le navigateur.

---

## 🌍 Étape 4 — Mettre en ligne (gratuit avec Vercel)

1. Crée un compte gratuit sur https://vercel.com
2. Installe l'outil Vercel :
```
npm install -g vercel
```
3. Dans le dossier du projet, lance :
```
vercel
```
4. Suis les instructions (appuie sur Entrée pour tout valider)
5. Ton site est en ligne sur une URL `xxxx.vercel.app` !

### Brancher ton nom de domaine
1. Achète un domaine sur https://namecheap.com ou https://porkbun.com (~10€/an)
2. Dans ton dashboard Vercel → ton projet → "Domains"
3. Ajoute ton domaine et suis les instructions DNS

---

## 📁 Structure du projet

```
victor-portfolio/
├── contenu.js          ← ✏️ MODIFIE UNIQUEMENT CE FICHIER
├── pages/
│   ├── _app.js         ← (ne pas toucher)
│   └── index.js        ← (ne pas toucher)
├── styles/
│   └── globals.css     ← CSS du site (avancé)
├── public/
│   └── victor.png      ← Ta photo (remplace par la tienne)
├── next.config.js      ← (ne pas toucher)
└── package.json        ← (ne pas toucher)
```

---

## ❓ Problèmes fréquents

**"npm n'est pas reconnu"** → Node.js n'est pas installé, recommence l'étape 1 et redémarre le PC.

**Le site ne se lance pas** → Vérifie que tu es bien dans le bon dossier avec `cd`.

**La photo ne s'affiche pas** → Vérifie que `victor.png` est bien dans le dossier `public/`.
