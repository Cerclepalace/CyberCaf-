import { CATEGORIES } from './model.js';

/**
 * Moteur d'indicateurs.
 *
 * Fonctions pures : memes entrees, memes sorties, aucun acces disque ni
 * reseau. Tout ce qui est affiche par le tableau de bord est calcule ici, et
 * peut donc etre teste sans lancer le serveur.
 *
 * Regle : quand une donnee manque, l'indicateur vaut `null`. Jamais zero.
 * Un zero affiche a la place d'une absence de mesure est un mensonge, et le
 * proprietaire prendra des decisions dessus.
 */

/** Ajoute `days` jours a un jour ISO. */
export function addDays(day, days) {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Nombre de jours entre deux jours ISO, bornes incluses. */
export function daysBetween(from, to) {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  return Math.floor((end - start) / 86400000) + 1;
}

/** Liste continue des jours de la periode, trous compris. */
export function listDays(from, to) {
  const out = [];
  const total = daysBetween(from, to);
  for (let i = 0; i < total; i += 1) out.push(addDays(from, i));
  return out;
}

function inPeriod(record, from, to) {
  return record.day >= from && record.day <= to;
}

function sumQuantity(records) {
  return records.reduce((total, record) => total + record.quantity, 0);
}

function sumAmount(records) {
  const withAmount = records.filter((record) => typeof record.amount === 'number');
  if (withAmount.length === 0) return null;
  return withAmount.reduce((total, record) => total + record.amount, 0);
}

/**
 * Variation entre deux valeurs, en pourcentage.
 * Renvoie `null` quand la comparaison n'a pas de sens plutot qu'un chiffre
 * spectaculaire calcule sur une base nulle.
 */
export function trend(current, previous) {
  if (typeof current !== 'number' || typeof previous !== 'number') return null;
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

/**
 * @param {import('./model.js').ActivityRecord[]} records
 * @param {{from: string, to: string}} period
 */
export function computeKpis(records, { from, to }) {
  const periodRecords = records.filter((record) => inPeriod(record, from, to));
  const periodLength = daysBetween(from, to);

  const previousTo = addDays(from, -1);
  const previousFrom = addDays(previousTo, -(periodLength - 1));
  const previousRecords = records.filter((record) => inPeriod(record, previousFrom, previousTo));

  const daysWithData = new Set(periodRecords.map((record) => record.day));

  const byCategory = CATEGORIES.map((category) => {
    const subset = periodRecords.filter((record) => record.category === category);
    const previousSubset = previousRecords.filter((record) => record.category === category);
    return {
      category,
      quantity: sumQuantity(subset),
      amount: sumAmount(subset),
      entries: subset.length,
      trendPercent: subset.length === 0 && previousSubset.length === 0
        ? null
        : trend(sumQuantity(subset), sumQuantity(previousSubset)),
    };
  }).filter((entry) => entry.entries > 0 || entry.category !== 'other');

  const dailySeries = listDays(from, to).map((day) => {
    const subset = periodRecords.filter((record) => record.day === day);
    return {
      day,
      quantity: subset.length === 0 ? null : sumQuantity(subset),
      amount: sumAmount(subset),
      measured: daysWithData.has(day),
    };
  });

  const totalQuantity = periodRecords.length === 0 ? null : sumQuantity(periodRecords);
  const previousQuantity = previousRecords.length === 0 ? null : sumQuantity(previousRecords);

  return {
    period: { from, to, days: periodLength },
    previousPeriod: { from: previousFrom, to: previousTo },
    isEmpty: periodRecords.length === 0,
    coverage: {
      daysWithData: daysWithData.size,
      daysInPeriod: periodLength,
      ratio: periodLength === 0 ? null : daysWithData.size / periodLength,
    },
    totals: {
      quantity: totalQuantity,
      amount: sumAmount(periodRecords),
      entries: periodRecords.length,
      trendPercent: trend(totalQuantity, previousQuantity),
    },
    byCategory,
    dailySeries,
  };
}
