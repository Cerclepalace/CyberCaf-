/**
 * Widget de raccourcis.
 *
 * Ce fichier ouvre des URL. Il ne fait rien d'autre, et c'est delibere :
 * pas de navigateur, pas de session, pas d'authentification, pas de mots de
 * passe, pas d'historique de navigation, pas de comptage de clics par site.
 *
 * Les favoris sont conserves dans le navigateur du poste (localStorage). Ils
 * ne remontent jamais au serveur : ce sont des preferences de machine, pas des
 * donnees sur une personne. La lecture est protegee, car un poste public peut
 * avoir le stockage desactive.
 */
const FAVORITES_KEY = 'cybercafe.widget.favorites';

function readFavorites() {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids) {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // Stockage indisponible : les favoris ne sont pas memorises, le reste
    // continue de fonctionner.
  }
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function shortcutCard(shortcut, favorites, onToggle) {
  const card = element('div');

  const link = element('a', 'shortcut');
  link.href = shortcut.url;
  link.target = '_blank';
  // noopener empeche la page ouverte d'agir sur celle-ci ; noreferrer evite de
  // transmettre l'origine.
  link.rel = 'noopener noreferrer';
  link.append(element('span', 'shortcut-label', shortcut.label));
  if (shortcut.description) link.append(element('span', 'shortcut-description', shortcut.description));

  let host = '';
  try {
    host = new URL(shortcut.url).host;
  } catch {
    host = '';
  }
  if (host) link.append(element('span', 'shortcut-host', host));
  card.append(link);

  const isFavorite = favorites.includes(shortcut.id);
  const button = element('button', 'favorite-toggle', isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris');
  button.type = 'button';
  button.addEventListener('click', () => onToggle(shortcut.id));
  card.append(button);

  return card;
}

async function render() {
  const res = await fetch('/api/widget/catalog');
  const catalog = await res.json();

  const favorites = readFavorites();
  const allShortcuts = catalog.categories.flatMap((category) => category.shortcuts);

  document.getElementById('empty-state').hidden = allShortcuts.length > 0;

  const toggle = (id) => {
    const next = favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
    writeFavorites(next);
    render();
  };

  const favoriteShortcuts = allShortcuts.filter((shortcut) => favorites.includes(shortcut.id));
  const favoriteSection = document.getElementById('favorites');
  const favoriteGrid = document.getElementById('favorites-grid');
  favoriteGrid.replaceChildren();
  favoriteSection.hidden = favoriteShortcuts.length === 0;
  for (const shortcut of favoriteShortcuts) {
    favoriteGrid.append(shortcutCard(shortcut, favorites, toggle));
  }

  const host = document.getElementById('categories');
  host.replaceChildren();
  for (const category of catalog.categories) {
    if (category.shortcuts.length === 0) continue;
    host.append(element('h2', null, category.label));
    const grid = element('div', 'grid');
    for (const shortcut of category.shortcuts) grid.append(shortcutCard(shortcut, favorites, toggle));
    host.append(grid);
  }
}

render().catch((err) => {
  document.getElementById('categories').textContent = `Erreur : ${err.message}`;
});
