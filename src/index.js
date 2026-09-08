import { loadConfig } from './core/config.js';
import { logger } from './core/logger.js';
import { createApp } from './server/app.js';

/**
 * Point d'entree.
 *
 * Local d'abord : l'application ecoute sur 127.0.0.1 par defaut et ne joint
 * aucun service externe. Elle fonctionne integralement sans Internet.
 */
const config = loadConfig();
const { server } = createApp({ config });

server.listen(config.server.port, config.server.host, () => {
  logger.info('Socle demarre', {
    url: `http://${config.server.host}:${config.server.port}/`,
    recordingLevel: config.recording.level,
  });
});

const shutdown = (signal) => {
  logger.info('Arret demande', { signal });
  server.close(() => process.exit(0));
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
