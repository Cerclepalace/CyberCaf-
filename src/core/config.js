import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { asEnum, asNumber, asString, ValidationError } from './validate.js';
import { logger } from './logger.js';

/**
 * Configuration de l'application.
 *
 * Tout passe par un fichier JSON et des variables d'environnement. Aucune
 * valeur liee a l'infrastructure du cybercafe n'est codee en dur : ni adresse,
 * ni format de fichier, ni equipement.
 */

export const DEFAULT_CONFIG = {
  server: { host: '127.0.0.1', port: 8080 },
  recording: { level: 'E0' },
  dataDir: 'data',
  monitoring: { maxStoredEvents: 5000, aggregationWindowMinutes: 60, rules: [] },
};

/**
 * Niveaux d'enregistrement.
 * E0 : volumes seuls, aucun montant.
 * E1 : totaux issus d'une caisse existante.
 * E2 (enregistrement d'un reglement) n'existe pas dans ce code, et ce n'est
 * pas un oubli : il releve de la gate P2, fermee.
 */
export const RECORDING_LEVELS = ['E0', 'E1'];

function merge(base, override) {
  const out = { ...base };
  for (const [key, value] of Object.entries(override || {})) {
    out[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? merge(base[key] || {}, value)
      : value;
  }
  return out;
}

export function loadConfig({ path = process.env.CYBERCAFE_CONFIG || 'config/app.config.json' } = {}) {
  let fileConfig = {};
  const full = resolve(path);
  if (existsSync(full)) {
    try {
      fileConfig = JSON.parse(readFileSync(full, 'utf8'));
    } catch (err) {
      throw new ValidationError(`Configuration illisible (${full}) : ${err.message}`, 'config');
    }
  } else {
    logger.warn('Aucun fichier de configuration, valeurs par defaut utilisees', { path: full });
  }

  const merged = merge(DEFAULT_CONFIG, fileConfig);

  const config = {
    server: {
      host: asString(process.env.HOST || merged.server.host, 'server.host', { max: 64 }),
      port: asNumber(process.env.PORT || merged.server.port, 'server.port', {
        min: 1, max: 65535, integer: true,
      }),
    },
    recording: { level: asEnum(merged.recording.level, 'recording.level', RECORDING_LEVELS) },
    dataDir: asString(merged.dataDir, 'dataDir', { max: 512 }),
    monitoring: {
      maxStoredEvents: asNumber(merged.monitoring.maxStoredEvents, 'monitoring.maxStoredEvents', {
        min: 10, max: 1000000, integer: true,
      }),
      aggregationWindowMinutes: asNumber(
        merged.monitoring.aggregationWindowMinutes,
        'monitoring.aggregationWindowMinutes',
        { min: 1, max: 10080, integer: true },
      ),
      rules: Array.isArray(merged.monitoring.rules) ? merged.monitoring.rules : [],
    },
  };

  if (config.server.host !== '127.0.0.1' && config.server.host !== 'localhost') {
    logger.warn(
      "L'interface est exposee au-dela de la machine locale. Verifier que le reseau d'administration est separe du reseau des postes clients.",
      { host: config.server.host },
    );
  }

  return config;
}
