/**
 * Journal applicatif.
 *
 * Une ligne JSON par evenement, sur la sortie standard. Le socle n'ecrit aucun
 * fichier de journal : la rotation et la duree de retention dependent de la
 * machine sur laquelle l'application tournera, qui n'est pas connue.
 * TODO TERRAIN.
 *
 * Ne jamais journaliser de donnee personnelle : ni contenu de fichier importe,
 * ni URL consultee par un client, ni identifiant.
 */
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

function currentLevel() {
  const raw = String(process.env.LOG_LEVEL || 'info').toLowerCase();
  return LEVELS[raw] ?? LEVELS.info;
}

function emit(level, message, fields) {
  if (LEVELS[level] < currentLevel()) return;
  const line = { ts: new Date().toISOString(), level, message, ...fields };
  const stream = level === 'error' || level === 'warn' ? process.stderr : process.stdout;
  stream.write(`${JSON.stringify(line)}\n`);
}

export const logger = {
  debug: (message, fields = {}) => emit('debug', message, fields),
  info: (message, fields = {}) => emit('info', message, fields),
  warn: (message, fields = {}) => emit('warn', message, fields),
  error: (message, fields = {}) => emit('error', message, fields),
};
