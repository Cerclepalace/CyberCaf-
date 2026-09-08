import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, detectDelimiter, CSV_LIMITS } from '../src/dashboard/csv.js';
import { ValidationError } from '../src/core/validate.js';

test('detecte le separateur', () => {
  assert.equal(detectDelimiter('a;b;c'), ';');
  assert.equal(detectDelimiter('a,b,c'), ',');
});

test('lit les champs entre guillemets, separateurs inclus', () => {
  const { rows } = parseCsv('date;libelle\n2026-09-08;"Impression; A4"');
  assert.deepEqual(rows, [{ date: '2026-09-08', libelle: 'Impression; A4' }]);
});

test('gere les guillemets echappes et les fins de ligne Windows', () => {
  const { rows } = parseCsv('a;b\r\n1;"il a dit ""oui"""\r\n');
  assert.equal(rows[0].b, 'il a dit "oui"');
});

test('ignore le BOM et les lignes vides', () => {
  const { headers, rows } = parseCsv('﻿a;b\n1;2\n\n3;4\n');
  assert.deepEqual(headers, ['a', 'b']);
  assert.equal(rows.length, 2);
});

test('refuse un guillemet non ferme', () => {
  assert.throws(() => parseCsv('a;b\n1;"jamais ferme'), ValidationError);
});

test('refuse les colonnes dupliquees', () => {
  assert.throws(() => parseCsv('a;a\n1;2'), ValidationError);
});

test('borne le nombre de lignes', () => {
  const big = `a\n${'1\n'.repeat(20)}`;
  assert.throws(() => parseCsv(big, { limits: { ...CSV_LIMITS, maxRows: 5 } }), ValidationError);
});
