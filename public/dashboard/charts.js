/**
 * Graphiques.
 *
 * SVG construit a la main, sans bibliotheque : deux formes suffisent ici, et
 * une dependance de graphiques pese plus lourd que le reste de l'application.
 *
 * Regles suivies :
 *  - une seule serie par graphique, donc pas de legende de couleurs ;
 *  - un jour sans mesure n'est pas dessine comme un zero : il porte une marque
 *    grise distincte, et la legende le dit ;
 *  - axes et grille discrets, valeurs annotees selectivement ;
 *  - le tableau plus bas donne les memes chiffres, pour qui ne lit pas le
 *    graphique.
 */

const NS = 'http://www.w3.org/2000/svg';

export function el(tag, { className, text } = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function svgEl(tag, attributes = {}) {
  const node = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attributes)) {
    node.setAttribute(name, String(value));
  }
  return node;
}

export function formatNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'n/d';
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(value);
}

export function formatTrend(percent) {
  if (typeof percent !== 'number' || !Number.isFinite(percent)) return 'n/d';
  const sign = percent > 0 ? '+' : '';
  return `${sign}${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(percent)} %`;
}

function clear(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

/**
 * Barres verticales : volume mesure par jour.
 * @param {SVGElement} svg
 * @param {{day: string, quantity: number|null, measured: boolean}[]} series
 */
export function renderBarChart(svg, series) {
  clear(svg);
  if (series.length === 0) return;

  const width = 900;
  const height = 260;
  const padding = { top: 16, right: 12, bottom: 34, left: 48 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const measured = series.filter((point) => point.quantity !== null);
  const max = measured.reduce((acc, point) => Math.max(acc, point.quantity), 0) || 1;

  const step = plotWidth / series.length;
  const barWidth = Math.max(2, step - 2); // 2 px de respiration entre les barres
  const baseline = padding.top + plotHeight;

  svg.append(svgEl('line', {
    class: 'axis-line', x1: padding.left, y1: baseline, x2: width - padding.right, y2: baseline,
  }));

  [0, 0.5, 1].forEach((ratio) => {
    const y = baseline - ratio * plotHeight;
    const label = svgEl('text', { class: 'axis-text', x: padding.left - 8, y: y + 4, 'text-anchor': 'end' });
    label.textContent = formatNumber(Math.round(max * ratio));
    svg.append(label);
  });

  series.forEach((point, index) => {
    const x = padding.left + index * step + (step - barWidth) / 2;

    if (point.quantity === null) {
      // Jour non mesure : marque au ras de l'axe, jamais une barre a zero.
      svg.append(svgEl('rect', {
        class: 'bar-missing', x, y: baseline - 3, width: barWidth, height: 3, rx: 1.5,
      }));
      return;
    }

    const barHeight = Math.max(3, (point.quantity / max) * plotHeight);
    const rect = svgEl('rect', {
      class: 'bar', x, y: baseline - barHeight, width: barWidth, height: barHeight, rx: 4,
    });
    const tooltip = svgEl('title');
    tooltip.textContent = `${point.day} : ${formatNumber(point.quantity)}`;
    rect.append(tooltip);
    svg.append(rect);
  });

  const firstDay = series[0].day;
  const lastDay = series[series.length - 1].day;
  const start = svgEl('text', { class: 'axis-text', x: padding.left, y: height - 12 });
  start.textContent = firstDay;
  const end = svgEl('text', {
    class: 'axis-text', x: width - padding.right, y: height - 12, 'text-anchor': 'end',
  });
  end.textContent = lastDay;
  svg.append(start, end);
}

/**
 * Barres horizontales : volume par prestation, avec valeur annotee.
 * @param {SVGElement} svg
 * @param {{category: string, quantity: number}[]} rows
 * @param {Record<string,string>} labels
 */
export function renderCategoryChart(svg, rows, labels) {
  clear(svg);
  const visible = rows.filter((row) => row.quantity > 0);
  if (visible.length === 0) return;

  const rowHeight = 38;
  const width = 900;
  const height = visible.length * rowHeight + 16;
  const labelWidth = 160;
  const valueWidth = 90;
  const plotWidth = width - labelWidth - valueWidth;

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const max = visible.reduce((acc, row) => Math.max(acc, row.quantity), 0) || 1;

  visible.forEach((row, index) => {
    const y = index * rowHeight + 8;
    const barHeight = 18;

    const label = svgEl('text', { class: 'axis-text', x: 0, y: y + barHeight - 4 });
    label.textContent = labels[row.category] || row.category;
    svg.append(label);

    const barLength = Math.max(3, (row.quantity / max) * plotWidth);
    const rect = svgEl('rect', {
      class: 'bar', x: labelWidth, y, width: barLength, height: barHeight, rx: 4,
    });
    const tooltip = svgEl('title');
    tooltip.textContent = `${labels[row.category] || row.category} : ${formatNumber(row.quantity)}`;
    rect.append(tooltip);
    svg.append(rect);

    const value = svgEl('text', {
      class: 'value-text', x: labelWidth + barLength + 8, y: y + barHeight - 4,
    });
    value.textContent = formatNumber(row.quantity);
    svg.append(value);
  });
}
