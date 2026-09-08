import { asNumber, asString, asIsoDay, ValidationError } from '../core/validate.js';

/**
 * Construction d'une demande.
 *
 * Une demande n'accepte que les champs declares par le service choisi. Toute
 * cle inconnue est refusee plutot qu'ignoree : c'est une regle de minimisation,
 * pas une precaution de forme. Ce parcours collecte des coordonnees, donc des
 * donnees personnelles ; il ne doit en collecter aucune autre.
 *
 * INCONNU : la duree de conservation de ces demandes n'est pas definie dans le
 * projet. Elle doit l'etre avant toute utilisation reelle.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[0-9+][0-9 .()+-]{5,24}$/;

function validateAnswer(field, rawValue) {
  const provided = rawValue !== undefined && rawValue !== null && String(rawValue).trim() !== '';

  if (!provided) {
    if (field.required) throw new ValidationError(`« ${field.label} » est obligatoire`, field.id);
    return null;
  }

  try {
    return validateByType(field, rawValue);
  } catch (err) {
    // Les validateurs de bas niveau nomment le champ par son libelle. L'interface
    // a besoin de l'identifiant pour surligner le bon controle : on renormalise
    // ici plutot que de laisser un surlignage echouer en silence.
    throw new ValidationError(err.message, field.id);
  }
}

function validateByType(field, rawValue) {
  const max = field.maxLength || 500;

  switch (field.type) {
    case 'text':
    case 'textarea':
      return asString(rawValue, field.label, { max });

    case 'email': {
      const value = asString(rawValue, field.label, { max });
      if (!EMAIL.test(value)) {
        throw new ValidationError(`« ${field.label} » : cette adresse e-mail n'est pas valide`, field.id);
      }
      return value;
    }

    case 'tel': {
      const value = asString(rawValue, field.label, { max });
      if (!PHONE.test(value)) {
        throw new ValidationError(`« ${field.label} » : ce numéro de téléphone n'est pas valide`, field.id);
      }
      return value;
    }

    case 'number':
      return asNumber(rawValue, field.label, {
        min: field.min ?? -1000000,
        max: field.max ?? 1000000,
      });

    case 'date':
      return asIsoDay(rawValue, field.label);

    case 'select': {
      const allowed = field.options.map((option) => option.value);
      if (!allowed.includes(String(rawValue))) {
        throw new ValidationError(`« ${field.label} » : choisissez une des réponses proposées`, field.id);
      }
      return String(rawValue);
    }

    default:
      throw new ValidationError(`« ${field.label} » : type de champ non pris en charge`, field.id);
  }
}

/**
 * @param {{service: object, answers: object, contact: object, reference: string, now?: Date}} input
 */
export function buildRequest({ service, answers = {}, contact = {}, reference, now = new Date() }) {
  if (!service) throw new ValidationError('service inconnu', 'service');

  const declared = new Set([
    ...service.fields.map((field) => field.id),
    ...service.contact.map((field) => field.id),
  ]);

  for (const key of [...Object.keys(answers), ...Object.keys(contact)]) {
    if (!declared.has(key)) {
      throw new ValidationError(`champ non prévu pour ce service : ${key}`, key);
    }
  }

  const requestAnswers = {};
  for (const field of service.fields) {
    const value = validateAnswer(field, answers[field.id]);
    if (value !== null) requestAnswers[field.id] = value;
  }

  const contactAnswers = {};
  for (const field of service.contact) {
    const value = validateAnswer(field, contact[field.id]);
    if (value !== null) contactAnswers[field.id] = value;
  }

  return {
    reference,
    serviceId: service.id,
    serviceName: service.name,
    answers: requestAnswers,
    contact: contactAnswers,
    createdAt: now.toISOString(),
    status: 'received',
  };
}

/** Rendu lisible pour le récapitulatif, dans l'ordre des champs du service. */
export function summarize(service, request) {
  const line = (field, source) => ({
    id: field.id,
    label: field.label,
    value: source[field.id] === undefined ? null : formatValue(field, source[field.id]),
  });
  return {
    service: { id: service.id, name: service.name, conditions: service.conditions },
    demande: service.fields.map((field) => line(field, request.answers)),
    coordonnees: service.contact.map((field) => line(field, request.contact)),
  };
}

function formatValue(field, value) {
  if (field.type === 'select') {
    const option = field.options.find((candidate) => candidate.value === value);
    return option ? option.label : String(value);
  }
  return String(value);
}
