/**
 * Interface du tableau de bord.
 *
 * Aucune donnee recue n'est inseree en HTML : tout passe par textContent ou par
 * des noeuds crees explicitement. Les libelles affiches viennent d'un
 * dictionnaire, jamais directement d'un fichier importe.
 */
import { formatNumber, formatTrend, el, svgEl, renderBarChart, renderCategoryChart } from './charts.js';

const state = { meta: null, kpis: null };

async function api(path, options) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.error || `erreur ${res.status}`);
  return payload;
}

function notice(text, kind = 'info') {
  const box = el('p', { className: 'notice' });
  box.textContent = text;
  if (kind === 'info') box.style.borderLeftColor = 'var(--series-1)';
  return box;
}

function renderNotices() {
  const host = document.getElementById('notices');
  host.replaceChildren();

  const level = state.kpis ? state.kpis.recordingLevel : 'E0';
  if (level === 'E0') {
    host.append(notice(
      "Niveau d'enregistrement E0 : seuls les volumes sont suivis. Aucun montant n'est enregistre.",
      'info',
    ));
  }

  const summary = state.kpis && state.kpis.lastImport;
  if (summary && summary.adapter === 'sample') {
    host.append(notice(
      "Ces chiffres sont un jeu d'exemple genere. Ils ne decrivent aucun etablissement reel.",
    ));
  }
  if (summary && summary.rejected > 0) {
    host.append(notice(
      `${summary.rejected} ligne(s) ont ete rejetees au dernier import et ne sont pas comptees.`,
    ));
  }
  if (summary && summary.unmappedCategories && summary.unmappedCategories.length > 0) {
    host.append(notice(
      `Libelles non rattaches, comptes dans « Autres » : ${summary.unmappedCategories.join(', ')}`,
    ));
  }
}

function kpiCard(label, value, note, { unknown = false } = {}) {
  const card = el('div', { className: 'kpi' });
  card.append(el('p', { className: 'kpi-label', text: label }));
  card.append(el('p', {
    className: unknown ? 'kpi-value is-unknown' : 'kpi-value',
    text: value,
  }));
  if (note) card.append(el('p', { className: 'kpi-note', text: note }));
  return card;
}

function renderKpis() {
  const host = document.getElementById('kpis');
  const kpis = state.kpis;
  host.replaceChildren();

  const totals = kpis.totals;
  host.append(kpiCard(
    'Volume total sur la periode',
    totals.quantity === null ? 'Non mesure' : formatNumber(totals.quantity),
    totals.quantity === null ? 'Aucune ligne pour cette periode' : `${totals.entries} lignes`,
    { unknown: totals.quantity === null },
  ));

  host.append(kpiCard(
    'Variation vs periode precedente',
    totals.trendPercent === null ? 'Comparaison impossible' : formatTrend(totals.trendPercent),
    totals.trendPercent === null
      ? 'Pas assez de donnees sur la periode precedente'
      : `Du ${kpis.previousPeriod.from} au ${kpis.previousPeriod.to}`,
    { unknown: totals.trendPercent === null },
  ));

  const coverage = kpis.coverage;
  host.append(kpiCard(
    'Jours couverts',
    `${coverage.daysWithData} / ${coverage.daysInPeriod}`,
    coverage.daysWithData < coverage.daysInPeriod
      ? 'Les jours sans donnee ne sont pas comptes comme des zeros'
      : 'Periode complete',
  ));

  const amount = totals.amount;
  host.append(kpiCard(
    'Montant',
    amount === null ? 'Non suivi (E0)' : formatNumber(amount),
    amount === null ? 'Le suivi des montants est desactive' : null,
    { unknown: amount === null },
  ));
}

function renderTable() {
  const body = document.querySelector('#category-table tbody');
  body.replaceChildren();
  const labels = state.meta ? state.meta.categoryLabels : {};

  for (const row of state.kpis.byCategory) {
    const tr = el('tr');
    tr.append(el('td', { text: labels[row.category] || row.category }));
    tr.append(el('td', { className: 'num', text: formatNumber(row.quantity) }));
    tr.append(el('td', {
      className: 'num',
      text: row.trendPercent === null ? 'n/d' : formatTrend(row.trendPercent),
    }));
    tr.append(el('td', { className: 'num', text: String(row.entries) }));
    body.append(tr);
  }
}

function render() {
  const kpis = state.kpis;
  document.getElementById('subtitle').textContent = `Periode du ${kpis.period.from} au ${kpis.period.to}`;

  const summary = kpis.lastImport;
  document.getElementById('last-import').textContent = summary
    ? `Dernier import : ${summary.adapter}, ${summary.accepted} lignes retenues`
    : 'Aucun import effectue';

  renderNotices();

  const hasData = !kpis.isEmpty;
  document.getElementById('content').hidden = !hasData;
  document.getElementById('empty-state').hidden = hasData;
  if (!hasData) return;

  renderKpis();
  renderBarChart(document.getElementById('daily-chart'), kpis.dailySeries);
  document.getElementById('daily-caption').textContent =
    'Les jours sans mesure apparaissent en gris clair : ils ne valent pas zero.';
  renderCategoryChart(
    document.getElementById('category-chart'),
    kpis.byCategory,
    state.meta ? state.meta.categoryLabels : {},
  );
  renderTable();
}

async function refresh() {
  state.meta = await api('/api/dashboard/meta');
  state.kpis = await api('/api/dashboard/kpis');
  render();
}

document.getElementById('load-sample').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = 'Chargement...';
  try {
    await api('/api/dashboard/import', { method: 'POST', body: JSON.stringify({ adapter: 'sample' }) });
    await refresh();
  } catch (err) {
    document.getElementById('notices').prepend(notice(`Import impossible : ${err.message}`));
  } finally {
    button.disabled = false;
    button.textContent = "Charger des donnees d'exemple";
  }
});

refresh().catch((err) => {
  document.getElementById('subtitle').textContent = `Erreur : ${err.message}`;
});

export { svgEl };
