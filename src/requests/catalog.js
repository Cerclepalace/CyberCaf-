import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { asArray, asId, asNumber, asString, ValidationError } from '../core/validate.js';
import { logger } from '../core/logger.js';

/**
 * Catalogue de services du parcours de demande.
 *
 * Entierement pilote par configuration. Aucun service n'est code en dur, et
 * aucun n'est invente : les services reels du Cybercafe22 ne sont pas definis
 * dans le projet. Tant que `config/services.json` est absent, le catalogue est
 * vide et l'interface affiche un etat explicite « services non definis ».
 *
 * INCONNU, a ce jour, et signale comme tel a l'interface :
 *  - la liste des services reels ;
 *  - la proposition de valeur ;
 *  - ce qui se passe apres confirmation d'une demande.
 */

export const FIELD_TYPES = ['text', 'textarea', 'email', 'tel', 'number', 'date', 'select'];

export const CATALOG_LIMITS = {
  maxServices: 30,
  maxFieldsPerService: 20,
  maxOptions: 40,
  maxTextLength: 2000,
};

function validateField(raw, where) {
  const field = {
    id: asId(raw && raw.id, `${where}.id`, { max: 40 }),
    type: asString(raw.type, `${where}.type`, { max: 20 }),
    label: asString(raw.label, `${where}.label`, { max: 120 }),
    required: raw.required === true,
    help: raw.help ? asString(raw.help, `${where}.help`, { max: 200 }) : null,
    maxLength: raw.maxLength
      ? asNumber(raw.maxLength, `${where}.maxLength`, { min: 1, max: CATALOG_LIMITS.maxTextLength, integer: true })
      : null,
    options: null,
  };

  if (!FIELD_TYPES.includes(field.type)) {
    throw new ValidationError(`${where}.type inconnu : ${field.type}`, `${where}.type`);
  }

  if (field.type === 'select') {
    const options = asArray(raw.options, `${where}.options`, { max: CATALOG_LIMITS.maxOptions });
    if (options.length === 0) throw new ValidationError(`${where}.options est vide`, `${where}.options`);
    field.options = options.map((option, index) => ({
      value: asId(option && option.value, `${where}.options[${index}].value`, { max: 40 }),
      label: asString(option.label, `${where}.options[${index}].label`, { max: 120 }),
    }));
  }

  if (field.type === 'number') {
    field.min = raw.min !== undefined ? asNumber(raw.min, `${where}.min`) : null;
    field.max = raw.max !== undefined ? asNumber(raw.max, `${where}.max`) : null;
  }

  return field;
}

/**
 * Valide un catalogue candidat.
 * Un service invalide est ecarte avec son motif ; il n'est jamais repare.
 */
export function validateCatalog(raw) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new ValidationError('catalogue invalide', 'catalog');
  }

  const rejected = [];
  const undefinedContent = [];

  const brandRaw = raw.brand && typeof raw.brand === 'object' ? raw.brand : {};
  const brand = {
    name: brandRaw.name ? asString(brandRaw.name, 'brand.name', { max: 60 }) : null,
    valueProposition: brandRaw.valueProposition
      ? asString(brandRaw.valueProposition, 'brand.valueProposition', { max: 300 })
      : null,
    howItWorks: Array.isArray(brandRaw.howItWorks)
      ? brandRaw.howItWorks.slice(0, 8).map((step, i) => asString(step, `brand.howItWorks[${i}]`, { max: 200 }))
      : [],
  };

  if (!brand.name) undefinedContent.push('brand.name');
  if (!brand.valueProposition) undefinedContent.push('brand.valueProposition');
  if (brand.howItWorks.length === 0) undefinedContent.push('brand.howItWorks');

  const nextStep = raw.nextStep ? asString(raw.nextStep, 'nextStep', { max: 300 }) : null;
  if (!nextStep) undefinedContent.push('nextStep');

  const contactFields = [];
  const contactRaw = Array.isArray(raw.contactFields) ? raw.contactFields : [];
  contactRaw.forEach((candidate, index) => {
    const where = `contactFields[${index}]`;
    try {
      contactFields.push(validateField(candidate, where));
    } catch (err) {
      rejected.push({ where, reason: err.message });
    }
  });
  if (contactFields.length === 0) undefinedContent.push('contactFields');

  const contactIds = new Set(contactFields.map((field) => field.id));
  const services = [];
  const servicesRaw = asArray(raw.services || [], 'services', { max: CATALOG_LIMITS.maxServices });
  const seenIds = new Set();

  servicesRaw.forEach((candidate, index) => {
    const where = `services[${index}]`;
    try {
      const id = asId(candidate && candidate.id, `${where}.id`, { max: 40 });
      if (seenIds.has(id)) throw new ValidationError(`identifiant de service duplique : ${id}`, `${where}.id`);
      seenIds.add(id);

      const fieldsRaw = asArray(candidate.fields || [], `${where}.fields`, {
        max: CATALOG_LIMITS.maxFieldsPerService,
      });
      const fields = fieldsRaw.map((field, position) => validateField(field, `${where}.fields[${position}]`));

      const seenFieldIds = new Set();
      for (const field of fields) {
        if (seenFieldIds.has(field.id)) {
          throw new ValidationError(`champ duplique dans ${id} : ${field.id}`, `${where}.fields`);
        }
        seenFieldIds.add(field.id);
      }

      let contact = contactFields;
      if (Array.isArray(candidate.contact)) {
        const wanted = candidate.contact.map((value, i) => asId(value, `${where}.contact[${i}]`, { max: 40 }));
        for (const id2 of wanted) {
          if (!contactIds.has(id2)) {
            throw new ValidationError(`${where}.contact reference un champ inconnu : ${id2}`, `${where}.contact`);
          }
        }
        contact = contactFields.filter((field) => wanted.includes(field.id));
      }

      services.push({
        id,
        name: asString(candidate.name, `${where}.name`, { max: 80 }),
        shortDescription: asString(candidate.shortDescription, `${where}.shortDescription`, { max: 200 }),
        info: Array.isArray(candidate.info)
          ? candidate.info.slice(0, 8).map((line, i) => asString(line, `${where}.info[${i}]`, { max: 200 }))
          : [],
        conditions: Array.isArray(candidate.conditions)
          ? candidate.conditions.slice(0, 8).map((line, i) => asString(line, `${where}.conditions[${i}]`, { max: 300 }))
          : [],
        fields,
        contact,
      });
    } catch (err) {
      rejected.push({ where, reason: err.message });
    }
  });

  return { brand, nextStep, contactFields, services, rejected, undefinedContent };
}

export function loadCatalog({ path = process.env.CYBERCAFE_SERVICES || 'config/services.json' } = {}) {
  const full = resolve(path);
  if (!existsSync(full)) {
    logger.warn('Aucun fichier de services : catalogue vide', { path: full });
    return {
      brand: { name: null, valueProposition: null, howItWorks: [] },
      nextStep: null,
      contactFields: [],
      services: [],
      rejected: [],
      undefinedContent: ['services', 'brand.name', 'brand.valueProposition', 'brand.howItWorks', 'nextStep', 'contactFields'],
      configured: false,
      path: full,
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(full, 'utf8'));
  } catch (err) {
    throw new ValidationError(`fichier de services illisible (${full}) : ${err.message}`, 'services');
  }

  const catalog = validateCatalog(parsed);
  if (catalog.rejected.length > 0) {
    logger.warn('Des services ont ete ecartes', { count: catalog.rejected.length });
  }
  return { ...catalog, configured: true, path: full };
}

export function findService(catalog, id) {
  return catalog.services.find((service) => service.id === id) || null;
}
