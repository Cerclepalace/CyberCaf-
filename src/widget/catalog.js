import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { asArray, asHttpUrl, asId, asString, ValidationError } from '../core/validate.js';
import { logger } from '../core/logger.js';

/**
 * Catalogue de raccourcis.
 *
 * Une liste de liens, rangee par categorie, lue depuis un fichier de
 * configuration. C'est tout, et c'est voulu.
 *
 * Ce module ne fait pas et ne fera pas : navigateur, moteur de session,
 * authentification, gestionnaire de mots de passe, paiement, historique de
 * navigation, comptage de clics par site. Un compteur de clics par site
 * produirait de la donnee d'usage sur des personnes ; il n'y en aura pas.
 *
 * TODO TERRAIN : la liste reelle des sites utilises n'est pas connue. Le
 * fichier d'exemple ne sert qu'a montrer la forme attendue.
 */

export const CATALOG_LIMITS = { maxCategories: 20, maxShortcutsPerCategory: 40 };

/** Valide un catalogue candidat. Un lien invalide est ecarte, pas corrige. */
export function validateCatalog(raw) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new ValidationError('catalogue invalide', 'catalog');
  }

  const categories = asArray(raw.categories, 'categories', { max: CATALOG_LIMITS.maxCategories });
  const rejected = [];
  const seenShortcutIds = new Set();

  const clean = categories.map((category, index) => {
    const id = asId(category && category.id, `categories[${index}].id`);
    const label = asString(category && category.label, `categories[${index}].label`, { max: 80 });
    const shortcuts = asArray(category.shortcuts, `categories[${index}].shortcuts`, {
      max: CATALOG_LIMITS.maxShortcutsPerCategory,
    });

    const validShortcuts = [];
    shortcuts.forEach((shortcut, position) => {
      const where = `categories[${index}].shortcuts[${position}]`;
      try {
        const shortcutId = asId(shortcut && shortcut.id, `${where}.id`);
        if (seenShortcutIds.has(shortcutId)) {
          throw new ValidationError(`identifiant de raccourci duplique : ${shortcutId}`, `${where}.id`);
        }
        seenShortcutIds.add(shortcutId);
        validShortcuts.push({
          id: shortcutId,
          label: asString(shortcut.label, `${where}.label`, { max: 60 }),
          url: asHttpUrl(shortcut.url, `${where}.url`),
          description: shortcut.description
            ? asString(shortcut.description, `${where}.description`, { max: 140 })
            : null,
        });
      } catch (err) {
        rejected.push({ where, reason: err.message });
      }
    });

    return { id, label, shortcuts: validShortcuts };
  });

  return { categories: clean, rejected };
}

export function loadCatalog({ path = process.env.CYBERCAFE_SHORTCUTS || 'config/shortcuts.json' } = {}) {
  const full = resolve(path);
  if (!existsSync(full)) {
    logger.warn('Aucun fichier de raccourcis : catalogue vide', { path: full });
    return { categories: [], rejected: [], configured: false, path: full };
  }

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(full, 'utf8'));
  } catch (err) {
    throw new ValidationError(`fichier de raccourcis illisible (${full}) : ${err.message}`, 'shortcuts');
  }

  const result = validateCatalog(parsed);
  if (result.rejected.length > 0) {
    logger.warn('Des raccourcis ont ete ecartes', { count: result.rejected.length });
  }
  return { ...result, configured: true, path: full };
}
