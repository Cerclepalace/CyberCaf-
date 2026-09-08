import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCatalog } from '../src/widget/catalog.js';
import { ValidationError } from '../src/core/validate.js';

test('un raccourci dangereux est ecarte, le reste du catalogue survit', () => {
  const result = validateCatalog({
    categories: [{
      id: 'demarches',
      label: 'Demarches',
      shortcuts: [
        { id: 'ok', label: 'Impots', url: 'https://www.impots.gouv.fr/' },
        { id: 'xss', label: 'Piege', url: 'javascript:alert(1)' },
        { id: 'local', label: 'Fichier', url: 'file:///etc/passwd' },
      ],
    }],
  });
  assert.equal(result.categories[0].shortcuts.length, 1);
  assert.equal(result.categories[0].shortcuts[0].id, 'ok');
  assert.equal(result.rejected.length, 2);
});

test('les identifiants de raccourci dupliques sont refuses', () => {
  const result = validateCatalog({
    categories: [{
      id: 'c',
      label: 'C',
      shortcuts: [
        { id: 'meme', label: 'A', url: 'https://a.example/' },
        { id: 'meme', label: 'B', url: 'https://b.example/' },
      ],
    }],
  });
  assert.equal(result.categories[0].shortcuts.length, 1);
  assert.equal(result.rejected.length, 1);
});

test('un catalogue mal forme est refuse', () => {
  assert.throws(() => validateCatalog({ categories: 'non' }), ValidationError);
  assert.throws(() => validateCatalog(null), ValidationError);
});
