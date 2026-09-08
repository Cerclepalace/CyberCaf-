# Socle technique — v0.1

**8 septembre 2026 · avant la visite terrain**

Ce document decrit ce qui a ete construit, ce qui a ete deliberement laisse
vide, et ce qui attend la visite. Il est le complement du code : le code dit
comment, ce document dit pourquoi et jusqu'ou.

---

## 1. Perimetre

Construit : le socle independant de l'infrastructure reelle.

Non construit, et non constructible aujourd'hui : tout ce qui suppose de
connaitre l'etablissement. Aucun systeme d'exploitation, aucun pare-feu, aucun
antivirus, aucun logiciel de caisse, aucun format d'export, aucune API, aucune
topologie reseau, aucun nombre de postes n'est suppose nulle part dans le code.
Cette contrainte a une consequence visible : les deux adaptateurs `api` et
`pos` existent, mais refusent de s'executer en listant ce qui leur manque.

---

## 2. Stack retenue

| Choix | Motif |
|---|---|
| Node.js >= 20, ES modules | Present partout, demarre en une commande |
| **Zero dependance, en production comme en test** | `npm install` ne telecharge rien. Rien a mettre a jour, aucune faille de dependance, installation possible sans Internet. Sur une machine de cybercafe que personne n'administrera, c'est le facteur de stabilite le plus important |
| `node:http` | Un routeur de trente lignes suffit pour huit routes |
| `node:test` | Runner integre |
| Stockage en fichiers JSON | Une base de donnees serait une piece de plus a installer, sauvegarder et reparer, pour quelques milliers de lignes sur une machine unique |
| Frontend en HTML/CSS/JS natif | Aucun build, aucun bundler. Le fichier servi est le fichier ecrit |
| Graphiques en SVG ecrit a la main | Une bibliotheque de graphiques pesait plus lourd que le reste de l'application |

Aucune stack preexistante dans le depot : ce choix n'en remplace aucun.

---

## 3. Architecture

```
  SOURCE            ADAPTATEUR         NORMALISEUR      MODELE       INDICATEURS    INTERFACE
  (inconnue)   ->   read()        ->   normalize()  ->  canonique ->  computeKpis -> pages
  fichier,          lignes brutes      + rejets         valide        pur           statiques
  export, API
```

Chaque etage ignore le suivant et peut etre remplace seul. C'est la seule
raison pour laquelle ce socle peut exister avant de connaitre la caisse : le
jour ou son format sera observe, un seul fichier sera ecrit — l'adaptateur — et
une seule configuration remplie — la correspondance de colonnes.

```
src/
  core/          validate.js, logger.js, config.js
  dashboard/     model.js, csv.js, normalizer.js, kpi.js, store.js, adapters/
  monitoring/    event.js, aggregator.js, alerts.js, store.js
  widget/        catalog.js
  server/        app.js, security.js, static.js
public/
  dashboard/     index.html, monitoring.html, app.js, charts.js, monitoring.js, *.css
  widget/        index.html, app.js, styles.css
  shared/        base.css
```

Les trois modules ne partagent que le noyau de validation et le serveur. Ils
n'echangent aucune donnee entre eux : une panne de l'un n'emporte pas les
autres, et deux des trois peuvent etre supprimes sans toucher au troisieme.

---

## 4. Decisions structurantes

### 4.1 Le niveau d'enregistrement est applique par le code

`recording.level` vaut `E0` par defaut : volumes seuls, aucun montant. Une
ligne portant un montant est **rejetee**, pas nettoyee en silence, et le rejet
apparait dans le rapport d'import. `E2` — l'enregistrement d'un reglement —
n'existe pas dans le code : il n'y a aucune notion de paiement, de ticket ni de
cloture. La gate reglementaire n'est pas une note dans un document, c'est un
test qui echoue.

### 4.2 Une donnee absente n'est jamais un zero

Un jour sans mesure vaut `null` partout : dans les indicateurs, dans la serie,
dans le graphique ou il porte une marque grise distincte. Une variation dont la
base precedente est nulle vaut `null` plutot qu'un pourcentage spectaculaire.
Un zero affiche a la place d'une absence de mesure est un mensonge, et le
proprietaire prendra des decisions dessus.

### 4.3 La supervision ne detecte rien

Le module de supervision recoit, valide, regroupe et affiche des signalements
produits par d'autres outils. Il ne conclut jamais. Il n'existe aucune nature
d'evenement « attaque » : un test verifie l'absence de cette valeur, pour que
personne ne la rajoute par commodite. Chaque evenement porte **une gravite et
une confiance separees**, parce qu'une panne certaine et un soupcon vague ne se
traitent pas de la meme facon.

### 4.4 Le widget n'apprend rien de personne

Il ouvre des URL. Il n'y a ni session, ni authentification, ni mots de passe, ni
historique de navigation, ni comptage de clics par site. Les favoris restent
dans le navigateur du poste et ne remontent jamais au serveur.

### 4.5 Local par defaut

Le serveur ecoute sur `127.0.0.1`. Exposer l'interface au reseau local est un
choix explicite qui declenche un avertissement au demarrage : sur un reseau non
separe, ce serait la rendre accessible aux postes clients.

---

## 5. Traitement des entrees non fiables

| Entree | Traitement |
|---|---|
| Fichier CSV/JSON importe | Taille, lignes, colonnes et longueur de champ bornees ; colonnes dupliquees et guillemets non fermes refuses |
| Lignes de donnees | Validees une par une ; une ligne invalide est rejetee avec un motif, sans interrompre l'import |
| Evenements de supervision | Champs valides, enumerations fermees, identifiants restreints |
| URL de raccourci | `http`/`https` uniquement. `javascript:`, `data:`, `file:` et les identifiants integres sont refuses |
| Chemins de fichiers statiques | Octet nul refuse, liste blanche d'extensions, verification que le chemin resolu reste sous la racine |
| Corps de requete | Bornes en octets ; JSON invalide refuse proprement |
| Affichage | Aucune donnee inseree en HTML : `textContent` uniquement. CSP sans script en ligne |
| Journaux | Aucune donnee personnelle, aucun contenu de fichier importe |
| Erreurs | Le detail technique va au journal ; le client recoit un message utilisable, jamais une trace |

---

## 6. Tests

`npm test` — 58 tests, tous verts. Aucune dependance a installer.

| Fichier | Ce qu'il verrouille |
|---|---|
| `test/validate.test.js` | Refus des schemes dangereux, des identifiants dans les URL, des caracteres de controle, des dates impossibles |
| `test/csv.test.js` | Guillemets, echappements, CRLF, BOM, colonnes dupliquees, bornes |
| `test/normalizer.test.js` | Dates FR et ISO, correspondance de categories, **rejet des montants en E0**, tolerance aux lignes invalides |
| `test/kpi.test.js` | **Absence de donnee != zero**, variation impossible = `null`, couverture, periode de comparaison |
| `test/monitoring.test.js` | **Absence de nature « attaque »**, regroupement, fenetre, regles invalides ignorees |
| `test/widget.test.js` | Raccourcis dangereux ecartes sans casser le catalogue |
| `test/static.test.js` | Remontees de repertoire, encodees ou non ; octet nul ; liste blanche |
| `test/app.test.js` | Parcours HTTP complets, en-tetes de securite, codes d'erreur |

Plusieurs tests sont des tests de **non-regression de principe** : ils
echoueront si quelqu'un ajoute un montant en E0, une nature « attaque », ou
transforme une absence de mesure en zero.

---

## 7. TODO TERRAIN — ce que le code attend

Chaque point est marque dans le code a l'endroit concerne.

| # | Inconnue | Fichier concerne | Effet aujourd'hui |
|---|---|---|---|
| T1 | Marque, version et capacite d'export du logiciel de caisse | `adapters/pending.js` | L'adaptateur `pos` repond 501 en listant ce qui manque |
| T2 | Existence, adresse et authentification d'une API | `adapters/pending.js` | Idem pour `api` |
| T3 | Noms reels des colonnes de l'export | `normalizer.js` | Correspondance par defaut, a remplacer par configuration |
| T4 | Libelles reels des prestations vendues | `model.js`, `categoryMap` | Tout libelle non rattache tombe dans `other` et est signale |
| T5 | Separateur et encodage reels des fichiers | `csv.js` | Separateur detecte, encodage suppose UTF-8 |
| T6 | Imprimantes en reseau ou en USB, compteurs lisibles | aucun fichier | Aucune lecture de compteur n'est ecrite |
| T7 | Sites reellement utilises par les clients | `config/shortcuts.json` | Catalogue vide par defaut |
| T8 | Outils de securite et de reseau presents | `monitoring/` | Aucune source n'est branchee : l'ecran est vide |
| T9 | Machine hote, systeme, disponibilite permanente | `config.js`, `logger.js` | Aucun fichier de journal ecrit, retention non decidee |
| T10 | Reseau separe ou non entre administration et postes | `config.js` | Ecoute locale par defaut, avertissement si exposition |
| T11 | Nombre de postes et identifiants d'equipement | `monitoring/event.js` | Identifiants libres, valides mais non contraints |
| T12 | Niveau d'enregistrement autorise (point V1) | `config.js` | Verrouille en E0 |

---

## 8. Hypotheses techniques restantes

Elles ne sont pas verifiees et peuvent tomber a la visite.

1. `HYPOTHESE` Une machine peut rester allumee et executer Node.js.
   Si le seul ordinateur disponible est le poste du comptoir sous un Windows
   ancien, l'installation change de nature.
2. `HYPOTHESE` Le proprietaire consultera l'interface depuis un navigateur.
3. `HYPOTHESE` Un import manuel occasionnel est acceptable. S'il faut un import
   quotidien a la main, le socle cree la tache repetitive qu'il devait supprimer.
4. `HYPOTHESE` Les volumes tiennent en memoire — quelques milliers de lignes.
   Au-dela, le stockage en fichier ne convient plus.
5. `HYPOTHESE` Les catégories canoniques couvrent les prestations reelles.
   `other` amortit l'erreur, il ne la corrige pas.
6. `INCONNU` Qui installe, qui met a jour, qui repare un samedi.

---

## 9. Points bloques par la visite

Aucun de ces points ne peut avancer par du code.

- **Le format d'export de la caisse.** Determine si l'objectif 1 est un lecteur
  de dix jours ou un systeme de saisie de vingt-cinq. C'est la question la plus
  determinante de la visite.
- **L'existence d'une source pour la supervision.** Sans source, l'ecran restera
  vide quelle que soit la qualite du code.
- **La liste des sites du widget.** Sans observation, ce serait une liste
  inventee.
- **La reponse a V1.** Conditionne le passage eventuel de E0 a E1.
- **L'existence d'un probleme coutant reellement de l'argent.** Le socle ne le
  demontre pas et ne peut pas le demontrer.

---

## 10. Etape suivante

1. Visite du 9 septembre : rapporter les douze donnees bloquantes de
   `ARCHITECTURE_CIBLE_ET_VALIDATION_V2.md` §8.
2. Si une source de donnees existe et a ete vue fonctionner : ecrire l'adaptateur
   correspondant et la configuration de correspondance. Un fichier, une
   configuration, rien d'autre a modifier.
3. Si aucune source n'existe : ne pas ecrire d'interface de saisie. Reprendre la
   chaine `PROBLEME -> PREUVE -> VALEUR` depuis le debut.
4. Ne connecter aucune source de supervision avant d'avoir identifie les outils
   reellement presents.

---

## 11. Remarque de methode

Ce socle a ete ecrit **avant** la visite, a la demande explicite du fondateur.
Il est concu pour ne dependre d'aucune information manquante, et il tient cet
engagement.

Le risque qu'il porte n'est pas technique, il est cognitif : **du code existant
devient un argument en faveur du projet qu'il implemente.** Si la visite conclut
qu'aucun probleme ne justifie l'objectif 1, la reponse correcte est de ne pas
brancher ce socle, pas de lui trouver un usage. Il a coute une soiree ; le
jeter coutera moins cher que de le remplir.
