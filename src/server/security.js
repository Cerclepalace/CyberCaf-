/**
 * En-tetes de securite.
 *
 * L'interface est servie en local et ne charge aucune ressource externe : la
 * politique peut donc etre stricte, sans compromis. Pas de script en ligne, pas
 * de CDN, pas de police distante. Une page qui ne depend de rien ne casse pas
 * quand Internet tombe, ce qui est aussi une contrainte de ce projet.
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "form-action 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cache-Control': 'no-store',
};

export function applySecurityHeaders(res) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(name, value);
}

export const MAX_BODY_BYTES = 6 * 1024 * 1024;

/**
 * Lit un corps de requete en le bornant.
 * Sans limite, un client du reseau local peut immobiliser le processus en
 * envoyant un flux sans fin.
 */
export function readBody(req, { maxBytes = MAX_BODY_BYTES } = {}) {
  return new Promise((resolvePromise, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(Object.assign(new Error('corps de requete trop volumineux'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolvePromise(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export function parseJsonBody(text) {
  if (text.trim() === '') return {};
  try {
    const parsed = JSON.parse(text);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('le corps doit etre un objet JSON');
    }
    return parsed;
  } catch (err) {
    throw Object.assign(new Error(`corps JSON invalide : ${err.message}`), { statusCode: 400 });
  }
}
