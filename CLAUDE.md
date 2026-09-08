# Projet Cybercafé — règles permanentes

**Phase actuelle : collecte terrain. Socle technique écrit sur décision explicite du fondateur le 8/09.**

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
- **Aucune fonctionnalité dépendant d'une information terrain ne peut être
  codée.** Le socle indépendant de l'infrastructure a été écrit le 8/09 sur
  décision explicite du fondateur : il ne suppose ni système d'exploitation, ni
  caisse, ni pare-feu, ni antivirus, ni format d'export, ni réseau, ni nombre de
  postes. Les adaptateurs `api` et `pos` refusent de s'exécuter et listent ce
  qui leur manque. **Ne brancher aucune source réelle avant la visite.**
- **Risque à garder en tête : du code existant devient un argument en faveur du
  projet qu'il implémente.** Si le terrain ne justifie pas un objectif, la
  réponse est de ne pas brancher son socle, pas de lui trouver un usage.
- **Outil 1 (dashboard)** : candidat MVP non validé. Conçu comme couche de
  reporting, jamais comme caisse. Interdits tant que le point V1 n'est pas
  tranché : saisir une vente, enregistrer un paiement, éditer un ticket,
  effectuer une clôture de caisse.
- **Objectif 2 — redéfini le 8/09 en widget de raccourcis web.** Un widget de
  raccourcis n'ouvre aucune session, n'identifie personne et ne journalise rien :
  il ne crée donc pas l'obligation de conservation qui motivait la suspension de
  l'ancien outil 2. **La suspension reste valable pour toute réintroduction de
  gestion de sessions.** Interdits permanents sur ce widget : gestionnaire de
  mots de passe, collecte d'identifiants, historique de navigation, profilage.
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
| `docs/PROTOCOLE_VALIDATION_TERRAIN_V1.md` | Protocole de visite d'un établissement tiers : observation, entretien, preuves, scoring, GO/NO-GO | Oui |
| `docs/ARCHITECTURE_CIBLE_ET_VALIDATION_V2.md` | Audit des trois objectifs verrouillés, architecture candidate, inventaire technique, GO/NO-GO par objectif | Oui |
| `docs/SOCLE_TECHNIQUE.md` | Ce qui est construit, les TODO TERRAIN, les hypothèses restantes | Oui |
| `docs/FICHE_TERRAIN_DONNEES_BLOQUANTES.md` | Liste consolidée des 14 bloquants + 4 conditionnels + fiche de saisie. **Document à utiliser sur place** | Oui |
| `docs/GARDE_FOU_DECISIONNEL.md` | Scénarios d'archivage écrits avant la collecte, registre de décision | **Figé** — ne pas assouplir un seuil après la visite |
| `src/`, `public/`, `test/` | Socle applicatif. Zéro dépendance. `npm test` doit rester vert | Oui |

---

## 5. Points ouverts

| # | Point | Statut | Résolu par |
|---|---|---|---|
| O1 | Nature réelle du lieu : cybercafé de proximité ou espace gaming ? | **Ouvert** — le 8/09 le fondateur écrit « un cybercafé », ce qui affaiblit la piste gaming sans la clore | Le fondateur, uniquement |
| O5 | Nature du projet : audit interne d'un lieu que nous contrôlons, ou validation produit chez des tiers ? Le fondateur est-il propriétaire de l'établissement visité ? | **Ouvert** — contradiction ouverte le 8/09 | Le fondateur, uniquement |
| O2 | V1 — le reporting en lecture seule sort-il du champ du logiciel de caisse ? | **Ouvert** | Expert-comptable |
| O3 | V2 — l'obligation de conservation des données de connexion s'applique-t-elle à ce lieu ? | **Ouvert** | Juriste |
| O4 | Données terrain : 14 j feuille de vente + compteurs, 5 j interruptions, 14 j F9/F10, questionnaire | **Non collectées** | Le terrain |

Tant que O1 est ouvert, la validité du protocole de collecte n'est pas établie.
Tant que O4 est ouvert, aucune décision de développement n'est possible.

**O5 conditionne l'applicabilité de `docs/COLLECTE_TERRAIN.md`.** Ses instruments
(14 jours de relevés, compteurs, feuille d'interruptions, F9/F10) supposent un
accès permanent au lieu et la coopération du personnel. Si l'établissement est
un tiers, ce protocole est inapplicable en l'état et
`docs/PROTOCOLE_VALIDATION_TERRAIN_V1.md` le remplace pour la phase de découverte.

Le critère « existe-t-il un marché au-delà d'un établissement » ne peut pas être
établi par une visite unique. Aucune décision GO ne peut être prise sur n = 1.

**Trois objectifs verrouillés le 8/09** — dashboard propriétaire, widget de
raccourcis web, supervision technique. Verrouiller le périmètre de recherche est
une décision de gouvernance ; cela ne vaut pas validation. Aucun des trois n'a le
moindre niveau de preuve à ce jour, et un seul chantier peut être mené à la fois.

**Verdict de gouvernance du 8/09 : GO TECHNIQUE CONDITIONNEL — NO-GO PRODUIT.**
Le socle peut exister ; son existence ne prouve rien. L'ordre est
`TERRAIN → PREUVE → DÉCISION → BRANCHEMENT ÉVENTUEL`, jamais l'inverse. Le temps
déjà investi dans le socle ne doit jamais devenir un argument en faveur de son
utilisation. Interdits tant que la visite n'a pas eu lieu : nouveau module
fonctionnel, écran métier supplémentaire, adaptateur fondé sur une hypothèse,
interface de saisie créée pour compenser l'absence de source, décision de
branchement. **Le socle doit pouvoir être abandonné sans qu'on lui cherche un
usage.**

**Garde-fou décisionnel (`docs/GARDE_FOU_DECISIONNEL.md`, 8/09).** Huit
scénarios d'archivage écrits avant la collecte, tous **actifs par défaut** :
seule une preuve terrain positive les lève. « Archivage » signifie NO-GO sur le
branchement et inscription au registre — **jamais suppression du code**. Le
scénario S6 autorise le terrain à invalider la grille entière plutôt qu'à
choisir entre les objectifs existants. Une décision d'archivage ne se rouvre que
sur une donnée terrain nouvelle, jamais sur une relecture ni sur le coût déjà
engagé.

**Ne jamais nommer l'objectif 3 « sécurité ».** Les sources de données réellement
accessibles dans un petit établissement relèvent à 90 % de la supervision
technique. Aucune alerte ne doit porter le niveau « attaque confirmée » ni
promettre une détection en temps réel.


---

## 6. Règles de code

- **Zéro dépendance externe**, en production comme en test. Ajouter une
  dépendance est une décision à justifier, pas un réflexe.
- `npm test` doit rester vert. Plusieurs tests verrouillent des principes, pas
  des détails : absence de montant en E0, absence de nature « attaque »,
  absence de mesure jamais transformée en zéro. S'ils gênent, c'est qu'une
  règle du projet est en train d'être contournée.
- Le serveur écoute sur `127.0.0.1`. Toute exposition réseau est une décision
  explicite.
- Toute entrée est non fiable : fichiers importés, événements, URL, corps de
  requête, chemins.
- Aucune donnée personnelle : ni identifiant client, ni historique de
  navigation, ni comptage de clics par site, ni donnée nominative dans les
  journaux.
- Une information manquante s'écrit `TODO TERRAIN` à l'endroit concerné du
  code, jamais une valeur plausible.
