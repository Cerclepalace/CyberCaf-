# Projet Cybercafé — règles permanentes

**Phase actuelle : collecte terrain. Aucun développement autorisé.**

Ce fichier est chargé automatiquement à chaque session. Il contient les règles
qui ne dépendent d'aucune donnée et ne doivent pas se perdre entre deux sessions.

---

## 1. Règle méthodologique fondamentale

Tout élément manipulé dans ce projet porte un statut explicite :

| Statut | Définition |
|---|---|
| **FAIT CONFIRMÉ** | Compté, chronométré, photographié, ou vérifié dans une source primaire |
| **DÉCLARÉ** | Affirmé par le fondateur ou le personnel, non encore observé |
| **HYPOTHÈSE** | Supposition de travail, formulée comme telle |
| **À VÉRIFIER** | Question ouverte, avec un destinataire identifié |
| **INCONNU** | Non renseigné, et reconnu comme tel |

`DÉCLARÉ` est une catégorie ajoutée aux quatre demandées : sans elle, la
description du lieu par le fondateur devrait être classée soit en `FAIT`
(ce qui viole la règle), soit en `HYPOTHÈSE` (ce qui est injuste). Une
déclaration est plus forte qu'une hypothèse et plus faible qu'une observation.

### Interdits

- Ne jamais transformer une hypothèse, un contexte supposé ou une
  recommandation antérieure en fait confirmé.
- Ne jamais répondre à la place de l'utilisateur quand une confirmation
  factuelle lui a été demandée. Le point reste ouvert jusqu'à sa réponse.
- Ne jamais combler une donnée manquante. Écrire `NON RENSEIGNÉ`.
- En cas de contradiction : la signaler explicitement et garder le point
  ouvert jusqu'à preuve ou confirmation.
- Aucune décision de développement sur une information non confirmée.

---

## 2. Règles de gouvernance du projet

- **Principe directeur** : automatiser ou simplifier le fonctionnement existant
  sans le remplacer. Le terrain est prioritaire sur toute idée de produit.
- **Aucun code avant réception des données terrain.**
- **Outil 1 (dashboard)** : candidat MVP non validé. Conçu comme couche de
  reporting, jamais comme caisse. Interdits tant que le point V1 n'est pas
  tranché : saisir une vente, enregistrer un paiement, éditer un ticket,
  effectuer une clôture de caisse.
- **Outil 2 (bureau numérique / gestion de sessions)** : suspendu. C'est le seul
  élément du projet susceptible de créer une obligation légale nouvelle.
- **Outil 3 (sécurité)** : actif, sous forme de configuration et de procédures,
  pas d'application.
- **Déclenchement d'un prototype** : quatre conditions cumulatives — problème
  dominant, mesuré, récurrent, économiquement significatif. Trois sur quatre
  ne suffisent pas.
- **Du temps de personnel économisé en heure creuse vaut zéro euro.** Les trois
  natures de perte, par ordre de valeur : fuite d'argent, vente perdue, temps.

---

## 3. Numérotation canonique

Deux échelles distinctes, à ne jamais confondre :

**Gates réglementaires** (source : `docs/sources/CYBERCAFE_REGLEMENTAIRE_V1.md`)

| Gate | Périmètre | Statut |
|---|---|---|
| P1 | Reporting : lecture / import / analyse | Ouvert sous réserve de V1 |
| P2 | Transactionnel : vente, paiement, ticket, clôture | Bloqué |
| P3 | Données personnelles : comptes, historique, stockage | Bloqué |

**Niveaux d'enregistrement**

| Niveau | Contenu | Gate |
|---|---|---|
| E0 | Volumes seuls, aucun montant | P1 — cible par défaut |
| E1 | Totaux journaliers issus d'une caisse existante | P1, sous réserve |
| E2 | Enregistrement du règlement | P2 — bloqué |

`docs/COLLECTE_TERRAIN.md` §8 emploie encore l'ancienne notation P1/P2/P3
pour ce qui est aujourd'hui E0/E1/E2. Le protocole est gelé : ne pas corriger
sans autorisation explicite.

---

## 4. Documents du dossier

| Fichier | Contenu | Modifiable ? |
|---|---|---|
| `docs/COLLECTE_TERRAIN.md` | Protocole de collecte : instruments, questionnaire A→G | **Gelé** — ajouts sur autorisation explicite uniquement |
| `docs/CADRE_REGLEMENTAIRE.md` | Classement de la source en trois niveaux, points V1 à V6 | Oui |
| `docs/EVALUATION_CONCEPTS.md` | Évaluation des trois concepts produits, seuils, règle de décision | Oui |
| `docs/sources/` | Sources reçues, archivées sans modification | **Jamais** |

---

## 5. Points ouverts

| # | Point | Statut | Résolu par |
|---|---|---|---|
| O1 | Nature réelle du lieu : cybercafé de proximité ou espace gaming ? | **Ouvert** | Le fondateur, uniquement |
| O2 | V1 — le reporting en lecture seule sort-il du champ du logiciel de caisse ? | **Ouvert** | Expert-comptable |
| O3 | V2 — l'obligation de conservation des données de connexion s'applique-t-elle à ce lieu ? | **Ouvert** | Juriste |
| O4 | Données terrain : 14 j feuille de vente + compteurs, 5 j interruptions, 14 j F9/F10, questionnaire | **Non collectées** | Le terrain |

Tant que O1 est ouvert, la validité du protocole de collecte n'est pas établie.
Tant que O4 est ouvert, aucune décision de développement n'est possible.
