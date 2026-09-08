import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, normalizeDay, normalizeCategory } from '../src/dashboard/normalizer.js';
import { ValidationError } from '../src/core/validate.js';

const mapping = {
  columns: { day: 'date', category: 'type', quantity: 'qte', unit: 'unite', amount: 'montant' },
  categoryMap: { Impression: 'print', Photocopie: 'copy' },
  defaultUnit: 'page',
};

test('normalise les dates ISO et francaises', () => {
  assert.equal(normalizeDay('2026-09-08'), '2026-09-08');
  assert.equal(normalizeDay('08/09/2026'), '2026-09-08');
  assert.throws(() => normalizeDay('8 septembre'), ValidationError);
});

test('rattache les libelles reels via la configuration', () => {
  assert.equal(normalizeCategory('Impression', mapping.categoryMap), 'print');
  assert.equal(normalizeCategory('Inconnu', mapping.categoryMap), 'other');
});

test('un montant est rejete au niveau E0, la ligne est signalee', () => {
  const rows = [{ date: '2026-09-08', type: 'Impression', qte: '10', unite: 'page', montant: '2.50' }];
  const result = normalize(rows, { mapping, recordingLevel: 'E0', source: 'csv' });
  assert.equal(result.records.length, 0);
  assert.equal(result.rejected.length, 1);
  assert.match(result.rejected[0].reason, /E0/);
});

test('un montant est accepte au niveau E1', () => {
  const rows = [{ date: '2026-09-08', type: 'Impression', qte: '10', unite: 'page', montant: '2,50' }];
  const result = normalize(rows, { mapping, recordingLevel: 'E1', source: 'csv' });
  assert.equal(result.records.length, 1);
  assert.equal(result.records[0].amount, 2.5);
});

test('une ligne invalide n interrompt pas l import', () => {
  const rows = [
    { date: '2026-09-08', type: 'Impression', qte: '10' },
    { date: 'n importe quoi', type: 'Impression', qte: '5' },
    { date: '2026-09-09', type: 'Photocopie', qte: '3' },
  ];
  const result = normalize(rows, { mapping, recordingLevel: 'E0', source: 'csv' });
  assert.equal(result.records.length, 2);
  assert.equal(result.rejected.length, 1);
  assert.equal(result.rejected[0].line, 3);
});

test('les libelles non rattaches sont signales', () => {
  const rows = [{ date: '2026-09-08', type: 'Plastification', qte: '1' }];
  const result = normalize(rows, { mapping, recordingLevel: 'E0', source: 'csv' });
  assert.equal(result.records[0].category, 'other');
  assert.deepEqual(result.unmappedCategories, ['Plastification']);
});
