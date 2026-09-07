# Cadre de classement réglementaire

**Version 1 — 7 septembre 2026**
**Statut : cadre de travail. Aucun élément réglementaire reçu à ce jour.**

Ce document définit *comment* classer les éléments réglementaires dans la future
`CYBERCAFE_SPECIFICATIONS_V1.md`. Il ne contient encore aucun contenu juridique :
le document réglementaire annoncé n'a pas été transmis.

Déposer les sources reçues dans `docs/sources/`, sous leur forme d'origine,
sans reformulation.

---

## 1. Les trois niveaux

Tout élément réglementaire est classé dans un seul niveau. Un élément dont le
niveau est incertain va en **niveau 2**, jamais en niveau 1 par défaut.

### Niveau 1 — CONTRAINTE À RETENIR

Obligations légales suffisamment établies, et directement applicables
au périmètre retenu.

Effet : contraint la conception. Une spécification qui viole une contrainte de
niveau 1 est rejetée, pas arbitrée.

| Élément | Source | Périmètre concerné | Effet sur la conception |
|---|---|---|---|
| *(vide — aucune source reçue)* | | | |

### Niveau 2 — À VALIDER

Interprétations juridiques, ou exigences dont l'applicabilité à ce périmètre
n'est pas établie.

Effet : bloque uniquement la fonctionnalité concernée, pas le projet.
Chaque ligne porte une question précise et un destinataire.

| Élément | Question ouverte | À valider par | Fonctionnalité bloquée |
|---|---|---|---|
| Reporting en lecture seule vs logiciel de caisse | Un outil qui ne saisit ni règlement ni ticket, et ne fait que lire des données existantes, sort-il du champ de l'art. 286-I-3° bis CGI ? | Comptable | Toute fonction d'encaissement (P2/P3) |
| Attestation individuelle éditeur | Un logiciel développé en interne pour son propre usage peut-il en faire l'objet, et qui la signe ? | Comptable | P3 |
| Assistance aux démarches administratives | Quel est le cadre applicable quand le personnel manipule le compte administratif d'un client ? | À déterminer | Toute fonction touchant à l'assistance |
| Durées de conservation RGPD | Ne constituent pas des exigences produit universelles — lesquelles s'appliquent réellement ici ? | À déterminer | Journalisation, historisation |

### Niveau 3 — BONNE PRATIQUE

Ni obligation ni interprétation : mesures d'hygiène. Elles n'attendent
aucune validation juridique et relèvent de l'outil 3.

| Élément | Statut |
|---|---|
| Comptes temporaires | Bonne pratique |
| Nettoyage des postes entre deux clients | Bonne pratique |
| Séparation réseau | Bonne pratique |
| Sauvegardes | Bonne pratique |
| Supervision | Bonne pratique |

---

## 2. Règle architecturale — Outil 1

**L'outil 1 n'est pas une caisse, et ne le devient pas par défaut.**

Ordre de préférence, si le terrain le confirme :

```
caisse existante  →  export / API / données existantes  →  reporting
```

Interdits tant que le périmètre fiscal n'est pas validé :

- saisir une vente ;
- enregistrer un paiement ;
- éditer un ticket.

Périmètres, rappel (détail dans `COLLECTE_TERRAIN.md` §8) :

| Périmètre | Contenu | Statut |
|---|---|---|
| **P1** | Volumes seuls : pages, sessions, durées. Aucun montant. | Cible par défaut |
| **P2** | Totaux journaliers issus d'une caisse existante | Gate niveau 2 |
| **P3** | Enregistrement du règlement | Gate niveau 2, interdit à ce stade |

### Conditions de viabilité de la chaîne « export → reporting »

À vérifier au terrain avant de retenir cette architecture :

1. L'export produit-il un **fichier**, ou seulement un rapport papier ?
   Un rapport papier impose une recopie quotidienne : cela crée une tâche
   manuelle répétitive au lieu d'en supprimer une. La chaîne est alors invalide.
2. L'export peut-il se faire **sans intervention quotidienne** ?
   Une clé USB à brancher chaque soir est une nouvelle tâche, pas une automatisation.
3. Si l'information existe déjà, imprimée chaque soir par la caisse :
   la valeur du reporting **pour l'exploitation** est proche de zéro.
   La valeur restante (historisation, tendance, accès à distance) est une
   valeur **de pilotage**, à porter dans la colonne correspondante — pas à
   présenter comme un gain opérationnel.

---

## 3. Évaluation de l'outil 1 — deux colonnes distinctes

Aucune fusion des deux colonnes. Un gain de pilotage ne compense pas
l'absence de gain d'exploitation ; il se justifie seul, ou pas du tout.

| | Valeur pour l'exploitation | Valeur pour le pilotage |
|---|---|---|
| Bénéficiaire | Le cybercafé, le personnel | Le fondateur |
| Mesure | € gagnés ou € de fuite évités, ventes non perdues, temps en heure de pointe | Temps du fondateur, fiabilité de l'information, décisions rendues possibles |
| À remplir | *(après données terrain)* | *(après données terrain)* |

---

## 4. Ordre de traitement à réception des données

```
DONNÉES BRUTES
  → faits observés (séparés des hypothèses et des contraintes réglementaires)
  → problèmes mesurés
  → fréquence
  → temps perdu
  → opportunités
  → analyse ROI
  → gate réglementaire
  → spécifications
  → architecture
  → MVP
  → code
```

Aucune donnée manquante n'est comblée. Une information absente est marquée
`NON RENSEIGNÉ` et le reste jusqu'à ce qu'elle soit collectée.
