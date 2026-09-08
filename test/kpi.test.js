import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeKpis, trend, listDays, addDays, daysBetween } from '../src/dashboard/kpi.js';

const record = (day, category, quantity) => ({
  day, category, quantity, unit: 'page', amount: null, source: 'test',
});

test('arithmetique des jours', () => {
  assert.equal(addDays('2026-09-08', -1), '2026-09-07');
  assert.equal(daysBetween('2026-09-01', '2026-09-07'), 7);
  assert.equal(listDays('2026-09-01', '2026-09-03').length, 3);
});

test('une periode sans donnee est vide, pas nulle', () => {
  const kpis = computeKpis([], { from: '2026-09-01', to: '2026-09-07' });
  assert.equal(kpis.isEmpty, true);
  assert.equal(kpis.totals.quantity, null, 'un total absent ne doit jamais valoir 0');
  assert.equal(kpis.coverage.daysWithData, 0);
});

test('un jour sans mesure vaut null dans la serie, pas zero', () => {
  const kpis = computeKpis([record('2026-09-01', 'print', 10)], { from: '2026-09-01', to: '2026-09-03' });
  assert.equal(kpis.dailySeries.length, 3);
  assert.equal(kpis.dailySeries[0].quantity, 10);
  assert.equal(kpis.dailySeries[1].quantity, null);
  assert.equal(kpis.dailySeries[1].measured, false);
});

test('la variation est nulle quand la comparaison n a pas de sens', () => {
  assert.equal(trend(10, 0), null, 'diviser par une base nulle produit un chiffre trompeur');
  assert.equal(trend(10, null), null);
  assert.equal(trend(12, 10), 20);
});

test('la variation compare a la periode precedente de meme longueur', () => {
  const records = [
    record('2026-09-01', 'print', 10),
    record('2026-09-02', 'print', 10),
    record('2026-09-03', 'print', 30),
    record('2026-09-04', 'print', 30),
  ];
  const kpis = computeKpis(records, { from: '2026-09-03', to: '2026-09-04' });
  assert.equal(kpis.previousPeriod.from, '2026-09-01');
  assert.equal(kpis.previousPeriod.to, '2026-09-02');
  assert.equal(kpis.totals.quantity, 60);
  assert.equal(kpis.totals.trendPercent, 200);
});

test('le montant reste nul quand aucun enregistrement n en porte', () => {
  const kpis = computeKpis([record('2026-09-01', 'print', 10)], { from: '2026-09-01', to: '2026-09-01' });
  assert.equal(kpis.totals.amount, null);
});

test('la couverture compte les jours reellement mesures', () => {
  const records = [record('2026-09-01', 'print', 1), record('2026-09-03', 'print', 1)];
  const kpis = computeKpis(records, { from: '2026-09-01', to: '2026-09-04' });
  assert.equal(kpis.coverage.daysWithData, 2);
  assert.equal(kpis.coverage.daysInPeriod, 4);
  assert.equal(kpis.coverage.ratio, 0.5);
});
