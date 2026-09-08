import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { applySecurityHeaders, readBody, parseJsonBody } from './security.js';
import { resolveStaticPath, serveStatic } from './static.js';
import { logger } from '../core/logger.js';
import { ValidationError, asEnum, asId, asIsoDay, asString } from '../core/validate.js';
import { ActivityStore } from '../dashboard/store.js';
import { EventStore } from '../monitoring/store.js';
import { getAdapter, listAdapters } from '../dashboard/adapters/index.js';
import { AdapterNotConfiguredError } from '../dashboard/adapters/pending.js';
import { normalize, DEFAULT_MAPPING } from '../dashboard/normalizer.js';
import { computeKpis, addDays } from '../dashboard/kpi.js';
import { CATEGORY_LABELS, UNIT_LABELS } from '../dashboard/model.js';
import { aggregate } from '../monitoring/aggregator.js';
import { evaluate } from '../monitoring/alerts.js';
import {
  STATUSES, SEVERITY_LABELS, CONFIDENCE_LABELS, STATUS_LABELS, EVENT_KIND_LABELS,
} from '../monitoring/event.js';
import { loadCatalog } from '../widget/catalog.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(HERE, '..', '..', 'public');

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Assemble l'application.
 *
 * Les magasins sont injectes pour que les tests puissent tourner sur un
 * repertoire temporaire, sans toucher aux donnees reelles.
 */
export function createApp({ config, activityStore, eventStore, catalogLoader = loadCatalog } = {}) {
  const activity = activityStore || new ActivityStore({ dataDir: config.dataDir });
  const events = eventStore || new EventStore({
    dataDir: config.dataDir,
    maxEvents: config.monitoring.maxStoredEvents,
  });

  const routes = [
    ['GET', '/api/health', async () => ({
      status: 200,
      body: { ok: true, recordingLevel: config.recording.level },
    })],

    ['GET', '/api/dashboard/meta', async () => ({
      status: 200,
      body: {
        recordingLevel: config.recording.level,
        adapters: listAdapters(),
        categoryLabels: CATEGORY_LABELS,
        unitLabels: UNIT_LABELS,
        lastImport: activity.summary(),
      },
    })],

    ['GET', '/api/dashboard/kpis', async (req, url) => {
      const to = url.searchParams.has('to') ? asIsoDay(url.searchParams.get('to'), 'to') : today();
      const from = url.searchParams.has('from')
        ? asIsoDay(url.searchParams.get('from'), 'from')
        : addDays(to, -29);
      if (from > to) throw new ValidationError('la date de debut est posterieure a la date de fin', 'from');
      return {
        status: 200,
        body: {
          ...computeKpis(activity.list(), { from, to }),
          recordingLevel: config.recording.level,
          lastImport: activity.summary(),
        },
      };
    }],

    ['POST', '/api/dashboard/import', async (req) => {
      const body = parseJsonBody(await readBody(req));
      const adapterName = asEnum(body.adapter ?? 'sample', 'adapter', ['sample', 'csv', 'json', 'api', 'pos']);
      const adapter = getAdapter(adapterName);

      let rawRows;
      try {
        rawRows = await adapter.read(body.options || { content: body.content });
      } catch (err) {
        if (err instanceof AdapterNotConfiguredError) {
          return {
            status: 501,
            body: {
              error: err.message,
              adapter: err.adapter,
              missing: err.missing,
              hint: 'Cet adaptateur attend les informations de la visite terrain.',
            },
          };
        }
        throw err;
      }

      const mapping = body.mapping
        ? { ...DEFAULT_MAPPING, ...body.mapping }
        : (adapterName === 'sample' ? DEFAULT_MAPPING : DEFAULT_MAPPING);

      const result = normalize(rawRows, {
        mapping,
        recordingLevel: config.recording.level,
        source: adapterName,
      });

      const summary = {
        at: new Date().toISOString(),
        adapter: adapterName,
        readRows: rawRows.length,
        accepted: result.records.length,
        rejected: result.rejected.length,
        rejectedSample: result.rejected.slice(0, 20),
        unmappedCategories: result.unmappedCategories,
        recordingLevel: config.recording.level,
      };

      activity.replace(result.records, summary);
      logger.info('Import termine', {
        adapter: adapterName, accepted: summary.accepted, rejected: summary.rejected,
      });
      return { status: 200, body: summary };
    }],

    ['GET', '/api/monitoring/events', async (req, url) => {
      const limit = Number(url.searchParams.get('limit') || 200);
      return {
        status: 200,
        body: {
          events: events.list({ limit: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 1000) : 200 }),
          labels: {
            severity: SEVERITY_LABELS,
            confidence: CONFIDENCE_LABELS,
            status: STATUS_LABELS,
            kind: EVENT_KIND_LABELS,
          },
        },
      };
    }],

    ['POST', '/api/monitoring/events', async (req) => {
      const body = parseJsonBody(await readBody(req));
      const stored = events.append(body);
      return { status: 201, body: stored };
    }],

    ['POST', '/api/monitoring/status', async (req) => {
      const body = parseJsonBody(await readBody(req));
      const id = asId(body.id, 'id', { max: 80 });
      const status = asEnum(body.status, 'status', STATUSES);
      const updated = events.setStatus(id, status);
      if (!updated) return { status: 404, body: { error: 'evenement introuvable' } };
      return { status: 200, body: updated };
    }],

    ['GET', '/api/monitoring/overview', async () => {
      const recent = events.list({ limit: 1000 });
      const groups = aggregate(recent, { windowMinutes: config.monitoring.aggregationWindowMinutes });
      const { alerts, invalidRules } = evaluate(groups, config.monitoring.rules);
      if (invalidRules.length > 0) logger.warn('Regles d alerte invalides ignorees', { invalidRules });
      return {
        status: 200,
        body: {
          windowMinutes: config.monitoring.aggregationWindowMinutes,
          groups,
          alerts,
          invalidRules,
          isEmpty: recent.length === 0,
          labels: {
            severity: SEVERITY_LABELS,
            confidence: CONFIDENCE_LABELS,
            status: STATUS_LABELS,
            kind: EVENT_KIND_LABELS,
          },
        },
      };
    }],

    ['GET', '/api/widget/catalog', async () => {
      const catalog = catalogLoader();
      return {
        status: 200,
        body: {
          categories: catalog.categories,
          configured: catalog.configured,
          rejected: catalog.rejected,
        },
      };
    }],
  ];

  async function handle(req, res) {
    applySecurityHeaders(res);

    let url;
    try {
      url = new URL(req.url, 'http://localhost');
    } catch {
      sendJson(res, 400, { error: 'requete invalide' });
      return;
    }

    const route = routes.find(([method, path]) => method === req.method && path === url.pathname);
    if (route) {
      try {
        const { status, body } = await route[2](req, url);
        sendJson(res, status, body);
      } catch (err) {
        const status = err.statusCode || (err instanceof ValidationError ? 400 : 500);
        if (status >= 500) {
          logger.error('Erreur non geree', { path: url.pathname, reason: err.message });
        }
        // Le detail technique reste dans le journal ; le client recoit un
        // message utilisable, jamais une trace d'execution.
        sendJson(res, status, {
          error: status >= 500 ? 'erreur interne' : err.message,
          field: err.field || null,
        });
      }
      return;
    }

    if (req.method !== 'GET') {
      sendJson(res, 405, { error: 'methode non autorisee' });
      return;
    }

    const pathname = url.pathname === '/' ? '/dashboard/index.html'
      : (url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname);
    const filePath = resolveStaticPath(PUBLIC_DIR, pathname);
    if (!filePath) {
      sendJson(res, 404, { error: 'introuvable' });
      return;
    }
    serveStatic(res, filePath);
  }

  return { handle, server: createServer(handle), activity, events };
}

export { PUBLIC_DIR, asString };
