import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';

/**
 * Service de fichiers statiques.
 *
 * Trois protections, parce qu'une seule ne suffit jamais :
 *  - refus des octets nuls, qui servent a tronquer un chemin ;
 *  - liste blanche d'extensions, donc aucun fichier de configuration ou de
 *    donnees ne peut sortir meme s'il se retrouve dans le dossier public ;
 *  - resolution du chemin puis verification qu'il reste sous la racine, ce qui
 *    ferme les remontees de repertoire, encodees ou non.
 */
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const NUL = String.fromCharCode(0);

export function resolveStaticPath(root, urlPath) {
  const rootDir = resolve(root);

  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (decoded.includes(NUL)) return null;

  const relative = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const candidate = resolve(join(rootDir, relative));

  if (candidate !== rootDir && !candidate.startsWith(rootDir + sep)) return null;
  if (!CONTENT_TYPES[extname(candidate)]) return null;
  if (!existsSync(candidate) || !statSync(candidate).isFile()) return null;

  return candidate;
}

export function serveStatic(res, filePath) {
  res.writeHead(200, { 'Content-Type': CONTENT_TYPES[extname(filePath)] });
  createReadStream(filePath).pipe(res);
}

export { CONTENT_TYPES };
