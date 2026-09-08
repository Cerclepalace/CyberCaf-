import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveStaticPath } from '../src/server/static.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(HERE, '..', 'public');

test('sert un fichier legitime', () => {
  assert.ok(resolveStaticPath(PUBLIC_DIR, '/dashboard/index.html'));
  assert.ok(resolveStaticPath(PUBLIC_DIR, '/shared/base.css'));
});

test('refuse les remontees de repertoire, encodees ou non', () => {
  const attempts = [
    '/../CLAUDE.md',
    '/../../etc/passwd',
    '/dashboard/../../package.json',
    '/%2e%2e/%2e%2e/package.json',
    '/..%2fpackage.json',
  ];
  for (const attempt of attempts) {
    assert.equal(resolveStaticPath(PUBLIC_DIR, attempt), null, `doit refuser ${attempt}`);
  }
});

test('refuse un octet nul dans le chemin', () => {
  const path = `/dashboard/index.html${encodeURIComponent(String.fromCharCode(0))}.png`;
  assert.equal(resolveStaticPath(PUBLIC_DIR, path), null);
});

test('refuse les extensions hors liste blanche', () => {
  assert.equal(resolveStaticPath(PUBLIC_DIR, '/dashboard/app.json'), null);
  assert.equal(resolveStaticPath(PUBLIC_DIR, '/dashboard'), null);
});
