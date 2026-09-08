import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCatalog, findService } from '../src/requests/catalog.js';
import { buildRequest, summarize } from '../src/requests/model.js';
import { generateReference, generateUniqueReference, isValidReference } from '../src/requests/reference.js';
import { ValidationError } from '../src/core/validate.js';

const catalogSource = {
  brand: { name: 'Cybercafé²²', valueProposition: null, howItWorks: [] },
  nextStep: null,
  contactFields: [
    { id: 'nom', type: 'text', label: 'Votre nom', required: true, maxLength: 80 },
    { id: 'telephone', type: 'tel', label: 'Téléphone', required: true, maxLength: 25 },
    { id: 'email', type: 'email', label: 'E-mail', required: false, maxLength: 120 },
  ],
  services: [{
    id: 'exemple',
    name: 'Service exemple',
    shortDescription: 'Description courte',
    info: ['Une information'],
    conditions: ['Une condition'],
    contact: ['nom', 'telephone'],
    fields: [
      { id: 'description', type: 'textarea', label: 'Votre demande', required: true, maxLength: 1000 },
      {
        id: 'quand', type: 'select', label: 'Quand ?', required: true,
        options: [{ value: 'aujourdhui', label: "Aujourd'hui" }, { value: 'plus-tard', label: 'Plus tard' }],
      },
      { id: 'pages', type: 'number', label: 'Nombre de pages', required: false, min: 1, max: 500 },
    ],
  }],
};

test('le catalogue nomme ce que le projet ne definit pas', () => {
  const catalog = validateCatalog(catalogSource);
  assert.ok(catalog.undefinedContent.includes('brand.valueProposition'));
  assert.ok(catalog.undefinedContent.includes('nextStep'));
  assert.ok(catalog.undefinedContent.includes('brand.howItWorks'));
  assert.equal(catalog.brand.valueProposition, null, 'une valeur absente reste nulle, jamais inventee');
});

test('un service restreint ses champs de contact', () => {
  const catalog = validateCatalog(catalogSource);
  const service = findService(catalog, 'exemple');
  assert.deepEqual(service.contact.map((f) => f.id), ['nom', 'telephone']);
});

test('un service invalide est ecarte, le catalogue survit', () => {
  const catalog = validateCatalog({
    ...catalogSource,
    services: [
      catalogSource.services[0],
      { id: 'casse', name: 'Sans description courte' },
      { id: 'type-inconnu', name: 'X', shortDescription: 'Y', fields: [{ id: 'f', type: 'signature', label: 'L' }] },
    ],
  });
  assert.equal(catalog.services.length, 1);
  assert.equal(catalog.rejected.length, 2);
});

test('un select sans options est refuse', () => {
  const catalog = validateCatalog({
    ...catalogSource,
    services: [{
      id: 's', name: 'S', shortDescription: 'D',
      fields: [{ id: 'choix', type: 'select', label: 'Choix', options: [] }],
    }],
  });
  assert.equal(catalog.services.length, 0);
  assert.equal(catalog.rejected.length, 1);
});

test('un champ de contact reference mais inexistant est refuse', () => {
  const catalog = validateCatalog({
    ...catalogSource,
    services: [{ ...catalogSource.services[0], contact: ['nom', 'adresse-postale'] }],
  });
  assert.equal(catalog.services.length, 0);
  assert.match(catalog.rejected[0].reason, /adresse-postale/);
});

test('une demande valide est construite', () => {
  const service = findService(validateCatalog(catalogSource), 'exemple');
  const request = buildRequest({
    service,
    answers: { description: 'Imprimer un document', quand: 'aujourdhui', pages: '12' },
    contact: { nom: 'Dupont', telephone: '06 12 34 56 78' },
    reference: 'CC22-20260908-ABCDE',
  });
  assert.equal(request.answers.pages, 12);
  assert.equal(request.contact.nom, 'Dupont');
  assert.equal(request.status, 'received');
});

test('un champ obligatoire manquant est refuse avec le nom du champ', () => {
  const service = findService(validateCatalog(catalogSource), 'exemple');
  assert.throws(
    () => buildRequest({
      service,
      answers: { quand: 'aujourdhui' },
      contact: { nom: 'Dupont', telephone: '0612345678' },
      reference: 'CC22-20260908-ABCDE',
    }),
    (err) => err instanceof ValidationError && err.field === 'description',
  );
});

test('un champ non prevu par le service est refuse, pas ignore', () => {
  const service = findService(validateCatalog(catalogSource), 'exemple');
  assert.throws(
    () => buildRequest({
      service,
      answers: { description: 'x', quand: 'aujourdhui', numero_carte: '4111111111111111' },
      contact: { nom: 'D', telephone: '0612345678' },
      reference: 'CC22-20260908-ABCDE',
    }),
    (err) => err instanceof ValidationError && err.field === 'numero_carte',
  );
});

test('les formats email et telephone sont verifies', () => {
  const service = findService(validateCatalog(catalogSource), 'exemple');
  const base = {
    service,
    answers: { description: 'x', quand: 'aujourdhui' },
    reference: 'CC22-20260908-ABCDE',
  };
  assert.throws(() => buildRequest({ ...base, contact: { nom: 'D', telephone: 'appelez-moi' } }), ValidationError);
  assert.doesNotThrow(() => buildRequest({ ...base, contact: { nom: 'D', telephone: '+33 6 12 34 56 78' } }));
});

test('une valeur hors liste est refusee', () => {
  const service = findService(validateCatalog(catalogSource), 'exemple');
  assert.throws(() => buildRequest({
    service,
    answers: { description: 'x', quand: 'jamais' },
    contact: { nom: 'D', telephone: '0612345678' },
    reference: 'CC22-20260908-ABCDE',
  }), ValidationError);
});

test('le recapitulatif rend les libelles, pas les valeurs techniques', () => {
  const service = findService(validateCatalog(catalogSource), 'exemple');
  const request = buildRequest({
    service,
    answers: { description: 'Imprimer', quand: 'aujourdhui' },
    contact: { nom: 'Dupont', telephone: '0612345678' },
    reference: 'CC22-20260908-ABCDE',
  });
  const summary = summarize(service, request);
  const quand = summary.demande.find((line) => line.id === 'quand');
  assert.equal(quand.value, "Aujourd'hui");
  assert.equal(summary.service.conditions.length, 1);
});

test('la reference evite les caracteres ambigus', () => {
  for (let i = 0; i < 200; i += 1) {
    const reference = generateReference({ now: new Date('2026-09-08T10:00:00Z') });
    assert.ok(isValidReference(reference), `reference invalide : ${reference}`);
    const suffix = reference.split('-')[2];
    assert.ok(!/[01ILOSB58]/.test(suffix), `caractere ambigu dans ${reference}`);
  }
});

test('une collision de reference est evitee', () => {
  const taken = new Set();
  let calls = 0;
  const exists = (reference) => {
    calls += 1;
    if (calls === 1) return true; // premiere tentative en collision
    return taken.has(reference);
  };
  const reference = generateUniqueReference(exists);
  assert.ok(isValidReference(reference));
  assert.ok(calls >= 2, 'la collision doit provoquer une nouvelle tentative');
});

test('toute erreur de champ porte l identifiant, jamais le libelle', () => {
  const service = findService(validateCatalog(catalogSource), 'exemple');
  const cases = [
    [{ description: 'x', quand: 'jamais' }, { nom: 'D', telephone: '0612345678' }, 'quand'],
    [{ description: 'x', quand: 'aujourdhui', pages: 'douze' }, { nom: 'D', telephone: '0612345678' }, 'pages'],
    [{ description: 'x', quand: 'aujourdhui' }, { nom: 'D', telephone: 'appelez-moi' }, 'telephone'],
    [{ description: 'x', quand: 'aujourdhui' }, { nom: '', telephone: '0612345678' }, 'nom'],
  ];

  for (const [answers, contact, expectedField] of cases) {
    assert.throws(
      () => buildRequest({ service, answers, contact, reference: 'CC22-20260908-ABCDE' }),
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.equal(err.field, expectedField, `attendu ${expectedField}, recu ${err.field}`);
        return true;
      },
    );
  }
});
