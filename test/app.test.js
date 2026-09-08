import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../src/server/app.js';
import { DEFAULT_CONFIG } from '../src/core/config.js';
import { ActivityStore } from '../src/dashboard/store.js';
import { EventStore } from '../src/monitoring/store.js';

/**
 * Tests d'integration HTTP.
 * Chaque execution utilise un repertoire temporaire : aucun test n'ecrit dans
 * les donnees reelles.
 */
let dataDir;
let app;
let baseUrl;

const config = () => ({
  ...DEFAULT_CONFIG,
  dataDir,
  monitoring: {
    ...DEFAULT_CONFIG.monitoring,
    rules: [{
      id: 'device-unreachable',
      label: 'Poste injoignable',
      when: { eventType: 'device.unreachable', minSeverity: 'medium' },
      advice: 'Verifier le cable reseau.',
    }],
  },
});

before(async () => {
  dataDir = mkdtempSync(join(tmpdir(), 'cybercafe-test-'));
  const cfg = config();
  app = createApp({
    config: cfg,
    activityStore: new ActivityStore({ dataDir }),
    eventStore: new EventStore({ dataDir }),
    catalogLoader: () => ({
      configured: true,
      rejected: [],
      categories: [{
        id: 'demarches',
        label: 'Demarches',
        shortcuts: [{ id: 'impots', label: 'Impots', url: 'https://www.impots.gouv.fr/', description: null }],
      }],
    }),
  });
  await new Promise((resolve) => app.server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${app.server.address().port}`;
});

after(() => {
  app.server.close();
  rmSync(dataDir, { recursive: true, force: true });
});

const get = (path) => fetch(`${baseUrl}${path}`);
const post = (path, body) => fetch(`${baseUrl}${path}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

test('la sante repond et annonce le niveau d enregistrement', async () => {
  const res = await get('/api/health');
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, recordingLevel: 'E0' });
});

test('les en-tetes de securite sont poses', async () => {
  const res = await get('/api/health');
  assert.match(res.headers.get('content-security-policy'), /default-src 'none'/);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
});

test('le tableau de bord demarre vide, sans inventer de zeros', async () => {
  const res = await get('/api/dashboard/kpis');
  const body = await res.json();
  assert.equal(body.isEmpty, true);
  assert.equal(body.totals.quantity, null);
});

test('l import du jeu d exemple alimente les indicateurs', async () => {
  const importRes = await post('/api/dashboard/import', { adapter: 'sample' });
  assert.equal(importRes.status, 200);
  const summary = await importRes.json();
  assert.ok(summary.accepted > 0);
  assert.equal(summary.rejected, 0);
  assert.equal(summary.adapter, 'sample');

  const kpis = await (await get('/api/dashboard/kpis')).json();
  assert.equal(kpis.isEmpty, false);
  assert.ok(kpis.totals.quantity > 0);
  assert.equal(kpis.totals.amount, null, 'aucun montant au niveau E0');
});

test('l import CSV rejette les lignes illisibles sans tout annuler', async () => {
  const content = [
    'date;categorie;quantite;unite',
    '2026-09-01;print;10;page',
    'pas-une-date;print;5;page',
    '2026-09-02;print;7;page',
  ].join('\n');
  const res = await post('/api/dashboard/import', { adapter: 'csv', content });
  const summary = await res.json();
  assert.equal(summary.accepted, 2);
  assert.equal(summary.rejected, 1);
});

test('un adaptateur en attente du terrain repond 501 et dit ce qui manque', async () => {
  const res = await post('/api/dashboard/import', { adapter: 'pos' });
  assert.equal(res.status, 501);
  const body = await res.json();
  assert.ok(Array.isArray(body.missing));
  assert.ok(body.missing.length > 0);
});

test('une periode incoherente est refusee avec un message utile', async () => {
  const res = await get('/api/dashboard/kpis?from=2026-09-10&to=2026-09-01');
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.error, /posterieure/);
});

test('un evenement de supervision est accepte puis agrege en alerte', async () => {
  const created = await post('/api/monitoring/events', {
    source: 'ping-local',
    device: 'poste-04',
    eventType: 'device.unreachable',
    kind: 'failure',
    severity: 'medium',
    confidence: 'high',
    message: 'Le poste 4 ne repond plus',
  });
  assert.equal(created.status, 201);

  const overview = await (await get('/api/monitoring/overview')).json();
  assert.equal(overview.isEmpty, false);
  assert.equal(overview.alerts.length, 1);
  assert.equal(overview.alerts[0].device, 'poste-04');
  assert.equal(overview.alerts[0].confidence, 'high');
});

test('un evenement invalide est refuse avec le champ fautif', async () => {
  const res = await post('/api/monitoring/events', {
    source: 'ping-local', device: 'poste-04', eventType: 'device.unreachable', message: 'x',
    severity: 'catastrophique',
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.field, 'severity');
});

test('le statut d un evenement peut etre change', async () => {
  const events = await (await get('/api/monitoring/events')).json();
  const id = events.events[0].id;
  const res = await post('/api/monitoring/status', { id, status: 'resolved' });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, 'resolved');

  const missing = await post('/api/monitoring/status', { id: 'evt-inexistant', status: 'resolved' });
  assert.equal(missing.status, 404);
});

test('le catalogue de raccourcis est servi', async () => {
  const body = await (await get('/api/widget/catalog')).json();
  assert.equal(body.categories.length, 1);
  assert.equal(body.categories[0].shortcuts[0].url, 'https://www.impots.gouv.fr/');
});

test('les pages statiques sont servies, les chemins hostiles refuses', async () => {
  assert.equal((await get('/')).status, 200);
  assert.equal((await get('/widget/')).status, 200);
  assert.equal((await get('/dashboard/app.js')).status, 200);
  assert.equal((await get('/../CLAUDE.md')).status, 404);
  assert.equal((await get('/inexistant.html')).status, 404);
});

test('une methode non prevue est refusee', async () => {
  const res = await fetch(`${baseUrl}/dashboard/index.html`, { method: 'DELETE' });
  assert.equal(res.status, 405);
});

test('un corps JSON invalide est refuse proprement', async () => {
  const res = await fetch(`${baseUrl}/api/monitoring/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{ ceci n est pas du json',
  });
  assert.equal(res.status, 400);
});

/* -------------------------------------------------- parcours de demande */

const serviceCatalog = {
  configured: true,
  rejected: [],
  undefinedContent: ['brand.valueProposition', 'nextStep'],
  brand: { name: 'Cybercafé²²', valueProposition: null, howItWorks: [] },
  nextStep: null,
  contactFields: [],
  services: [{
    id: 'exemple',
    name: 'Service exemple',
    shortDescription: 'Description courte',
    info: [],
    conditions: [],
    contact: [{ id: 'nom', type: 'text', label: 'Votre nom', required: true, maxLength: 80, help: null, options: null }],
    fields: [{
      id: 'description', type: 'textarea', label: 'Votre demande',
      required: true, maxLength: 1000, help: null, options: null,
    }],
  }],
};

function appWithServices(catalog) {
  return createApp({
    config: config(),
    activityStore: new ActivityStore({ dataDir }),
    eventStore: new EventStore({ dataDir }),
    catalogLoader: () => ({ configured: true, rejected: [], categories: [] }),
    serviceCatalogLoader: () => catalog,
  });
}

test('le catalogue de services nomme ce qui n est pas defini', async () => {
  const body = await (await get('/api/requests/catalog')).json();
  assert.equal(body.configured, false, 'aucun config/services.json dans le depot');
  assert.equal(body.services.length, 0);
  assert.ok(body.undefinedContent.includes('services'));
  assert.equal(body.brand.valueProposition, null);
});

test('sans catalogue configure, une demande est refusee proprement', async () => {
  const res = await post('/api/requests', { serviceId: 'exemple', answers: {}, contact: {} });
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.reason, 'catalogue-non-configure');
  assert.ok(!/stack|Error:/i.test(body.error), 'aucune erreur technique brute');
});

test('parcours complet : demande enregistree avec reference unique', async () => {
  const app2 = appWithServices(serviceCatalog);
  await new Promise((resolve) => app2.server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${app2.server.address().port}`;

  try {
    const catalogRes = await (await fetch(`${url}/api/requests/catalog`)).json();
    assert.equal(catalogRes.services.length, 1);

    const res = await fetch(`${url}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: 'exemple',
        answers: { description: 'Imprimer un document' },
        contact: { nom: 'Dupont' },
      }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.match(body.reference, /^CC22-\d{8}-[234679ACDEFGHJKMNPQRTUVWXYZ]{5}$/);
    assert.equal(body.nextStep, null, "l'etape suivante n'est pas inventee");
    assert.equal(body.summary.demande[0].value, 'Imprimer un document');

    const second = await fetch(`${url}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: 'exemple',
        answers: { description: 'Autre demande' },
        contact: { nom: 'Martin' },
      }),
    });
    const secondBody = await second.json();
    assert.notEqual(secondBody.reference, body.reference, 'deux demandes, deux references');
    assert.equal(app2.requests.count(), 2);
  } finally {
    app2.server.close();
  }
});

test('un champ obligatoire manquant renvoie un message utilisable', async () => {
  const app2 = appWithServices(serviceCatalog);
  await new Promise((resolve) => app2.server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${app2.server.address().port}`;

  try {
    const res = await fetch(`${url}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'exemple', answers: {}, contact: { nom: 'Dupont' } }),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.field, 'description');
    assert.match(body.error, /obligatoire/);
    assert.ok(!/undefined|null|Error/.test(body.error));
  } finally {
    app2.server.close();
  }
});

test('un service inexistant renvoie 404 sans fuite d information', async () => {
  const app2 = appWithServices(serviceCatalog);
  await new Promise((resolve) => app2.server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${app2.server.address().port}`;

  try {
    const res = await fetch(`${url}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'inexistant', answers: {}, contact: {} }),
    });
    assert.equal(res.status, 404);
  } finally {
    app2.server.close();
  }
});

test('un champ non declare est refuse par l API', async () => {
  const app2 = appWithServices(serviceCatalog);
  await new Promise((resolve) => app2.server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${app2.server.address().port}`;

  try {
    const res = await fetch(`${url}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: 'exemple',
        answers: { description: 'x', numero_carte: '4111111111111111' },
        contact: { nom: 'Dupont' },
      }),
    });
    assert.equal(res.status, 400);
    assert.equal((await res.json()).field, 'numero_carte');
  } finally {
    app2.server.close();
  }
});

test('la page du parcours est servie', async () => {
  assert.equal((await get('/demande/')).status, 200);
  assert.equal((await get('/demande/app.js')).status, 200);
});
