/**
 * Ecran d'etat du parc.
 *
 * Affiche des signalements deja produits par d'autres outils. Le vocabulaire
 * est celui du proprietaire, pas celui d'un analyste : « a regarder » plutot
 * que « severity medium ». Chaque ligne porte une icone et un mot en plus de
 * la couleur.
 */
import { el } from './charts.js';

const SEVERITY_ICONS = { info: 'i', low: '!', medium: '!!', high: '!!!' };

async function api(path) {
  const res = await fetch(path);
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.error || `erreur ${res.status}`);
  return payload;
}

function tag(text) {
  return el('span', { className: 'tag', text });
}

function eventCard(group, labels) {
  const card = el('article', { className: 'event' });
  card.setAttribute('data-severity', group.severity);

  const head = el('div', { className: 'event-head' });
  head.append(el('p', { className: 'event-title', text: group.message }));
  head.append(tag(`${SEVERITY_ICONS[group.severity]} ${labels.severity[group.severity]}`));
  head.append(tag(labels.confidence[group.confidence]));
  head.append(tag(labels.kind[group.kind]));
  card.append(head);

  const seen = group.occurrences > 1
    ? `${group.occurrences} fois, de ${group.firstSeen} a ${group.lastSeen}`
    : `Signale le ${group.lastSeen}`;
  card.append(el('p', {
    className: 'event-meta',
    text: `Equipement : ${group.device} · Signale par : ${group.source} · ${seen}`,
  }));

  if (group.advice) card.append(el('p', { className: 'event-advice', text: group.advice }));
  return card;
}

async function render() {
  const overview = await api('/api/monitoring/overview');

  document.getElementById('empty-state').hidden = !overview.isEmpty;

  const alertHost = document.getElementById('alerts');
  alertHost.replaceChildren();
  if (overview.alerts.length > 0) {
    const heading = el('h2', { text: 'A traiter' });
    const list = el('div', { className: 'event-list' });
    for (const alert of overview.alerts) list.append(eventCard(alert, overview.labels));
    alertHost.append(heading, list);
  }

  const groupHost = document.getElementById('groups');
  groupHost.replaceChildren();
  if (overview.groups.length === 0) {
    groupHost.append(el('p', { className: 'muted', text: 'Rien sur la fenetre observee.' }));
  } else {
    const list = el('div', { className: 'event-list' });
    for (const group of overview.groups) list.append(eventCard(group, overview.labels));
    groupHost.append(list);
  }
}

render().catch((err) => {
  document.getElementById('groups').textContent = `Erreur : ${err.message}`;
});
