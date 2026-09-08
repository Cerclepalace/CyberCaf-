import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  asHttpUrl, asIsoDay, asNumber, asString, asId, hasControlChars, ValidationError,
} from '../src/core/validate.js';

test('asString refuse les caracteres de controle', () => {
  const withNul = `abc${String.fromCharCode(0)}def`;
  assert.equal(hasControlChars(withNul), true);
  assert.throws(() => asString(withNul, 'champ'), ValidationError);
});

test('asString borne la longueur', () => {
  assert.throws(() => asString('x'.repeat(50), 'champ', { max: 10 }), ValidationError);
  assert.equal(asString('  ok  ', 'champ'), 'ok');
});

test('asHttpUrl refuse les schemes dangereux', () => {
  for (const url of [
    'javascript:alert(1)',
    'data:text/html;base64,PHNjcmlwdD4=',
    'file:///etc/passwd',
    'vbscript:msgbox',
  ]) {
    assert.throws(() => asHttpUrl(url, 'url'), ValidationError, `doit refuser ${url}`);
  }
});

test('asHttpUrl refuse les identifiants dans l URL', () => {
  assert.throws(() => asHttpUrl('https://user:pass@example.org/', 'url'), ValidationError);
});

test('asHttpUrl accepte http et https', () => {
  assert.equal(asHttpUrl('https://example.org/a', 'url'), 'https://example.org/a');
  assert.equal(asHttpUrl('http://example.org/', 'url'), 'http://example.org/');
});

test('asIsoDay refuse les dates impossibles', () => {
  assert.equal(asIsoDay('2026-09-08', 'day'), '2026-09-08');
  assert.throws(() => asIsoDay('2026-02-30', 'day'), ValidationError);
  assert.throws(() => asIsoDay('08/09/2026', 'day'), ValidationError);
});

test('asNumber accepte la virgule decimale francaise', () => {
  assert.equal(asNumber('12,5', 'n'), 12.5);
  assert.throws(() => asNumber('abc', 'n'), ValidationError);
  assert.throws(() => asNumber('-1', 'n', { min: 0 }), ValidationError);
});

test('asId refuse les caracteres inattendus', () => {
  assert.equal(asId('poste-01', 'id'), 'poste-01');
  assert.throws(() => asId('poste 01', 'id'), ValidationError);
  assert.throws(() => asId('../etc', 'id'), ValidationError);
});
