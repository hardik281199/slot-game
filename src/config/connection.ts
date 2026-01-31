export interface CouchbaseGetResult {
  content: Record<string, unknown>;
  value?: Record<string, unknown>;
}

let cluster: unknown = null;
let coll: unknown = null;
let useMemoryStore = false;

const memoryStore = new Map<string, Record<string, unknown>>();

function getConnection(): { coll: { get: Function; upsert: Function }; cluster: { query: Function } } {
  if (useMemoryStore) {
    return getMemoryConnection();
  }
  if (coll != null && cluster != null) {
    return { coll: coll as { get: Function; upsert: Function }, cluster: cluster as { query: Function } };
  }
  try {
    const couchbase = require('couchbase');
    cluster = new couchbase.Cluster('couchbase://localhost', {
      username: process.env.COUCHBASE_USERNAME,
      password: process.env.COUCHBASE_PASSWORD,
    });
    const bucket = (cluster as { bucket: (n: string) => { defaultCollection: () => unknown } }).bucket('slot-game');
    coll = bucket.defaultCollection();
    return { coll: coll as { get: Function; upsert: Function }, cluster: cluster as { query: Function } };
  } catch (err) {
    console.warn(
      'Couchbase native bindings not available (install Xcode CLT and run "npm rebuild couchbase", or use Node LTS). Using in-memory store.'
    );
    useMemoryStore = true;
    return getMemoryConnection();
  }
}

function getMemoryConnection(): { coll: { get: Function; upsert: Function }; cluster: { query: Function } } {
  const collMem = {
    get(key: string, cb: (err: Error | null, res?: CouchbaseGetResult) => void) {
      const doc = memoryStore.get(key);
      if (doc === undefined) {
        const e = new Error('key not found') as Error & { code?: number };
        e.code = 13;
        return cb(e);
      }
      cb(null, { content: doc, value: doc });
    },
    upsert(key: string, data: Record<string, unknown>, cb: (err: Error | null, res?: unknown) => void) {
      memoryStore.set(key, { ...data });
      cb(null, {});
    },
  };
  const clusterMem = {
    query(queryData: string | { query: string }, cb: (err: Error | null, res: { rows: unknown[] }) => void) {
      const query = typeof queryData === 'string' ? queryData : queryData.query;
      const rows: unknown[] = [];
      const lower = query.toLowerCase();
      if (lower.includes('count(')) {
        const docTypeMatch = query.match(/docType\s*=\s*['"]?(\w+)['"]?/i);
        const docType = docTypeMatch ? docTypeMatch[1] : 'game';
        let total = 0;
        for (const doc of memoryStore.values()) {
          if (doc.docType === docType && (doc.deletedAt === 0 || doc.deletedAt == null)) total++;
        }
        if (query.includes('gameName')) {
          const likeMatch = query.match(/like\s+lower\s*\(\s*['"]%([^'"]*)%['"]\s*\)/i);
          if (likeMatch) {
            const pattern = likeMatch[1].toLowerCase();
            total = 0;
            for (const doc of memoryStore.values()) {
              if (doc.docType === docType && (doc.deletedAt === 0 || doc.deletedAt == null)) {
                const name = String((doc as { gameName?: string }).gameName ?? '').toLowerCase();
                if (name.includes(pattern)) total++;
              }
            }
          }
        }
        rows.push({ totalGame: total });
      } else {
        const limitMatch = query.match(/limit\s+(\d+)\s+offset\s+(\d+)/i) || query.match(/limit\s+(\d+)/i);
        const limit = limitMatch ? parseInt(limitMatch[1], 10) : 100;
        const offset = limitMatch && limitMatch[2] ? parseInt(limitMatch[2], 10) : 0;
        const docTypeMatch = query.match(/docType\s*=\s*['"]?(\w+)['"]?/i);
        const docType = docTypeMatch ? docTypeMatch[1] : 'game';
        let gameNamePattern: string | null = null;
        const likeMatch = query.match(/like\s+lower\s*\(\s*['"]%([^'"]*)%['"]\s*\)/i);
        if (likeMatch) gameNamePattern = likeMatch[1].toLowerCase();
        const filtered: { games: Record<string, unknown> }[] = [];
        for (const [, doc] of memoryStore) {
          if (doc.docType !== docType) continue;
          if (doc.deletedAt !== 0 && doc.deletedAt != null) continue;
          if (gameNamePattern) {
            const name = String((doc as { gameName?: string }).gameName ?? '').toLowerCase();
            if (!name.includes(gameNamePattern)) continue;
          }
          filtered.push({ games: doc as Record<string, unknown> });
        }
        const slice = filtered.slice(offset, offset + limit);
        for (const item of slice) rows.push(item);
      }
      cb(null, { rows });
    },
  };
  return { coll: collMem, cluster: clusterMem };
}

export const getObject = (key: string): Promise<CouchbaseGetResult> => {
  const { coll: collection } = getConnection();
  return new Promise((resolve, reject) => {
    collection.get(key, (err: Error | null, res: CouchbaseGetResult) => {
      if (err) return reject(err);
      return resolve(res!);
    });
  });
};

export const getObjectOrNull = (key: string): Promise<CouchbaseGetResult | null> =>
  getObject(key).catch(() => null);

export const upsertObject = (
  key: string,
  data: Record<string, unknown>
): Promise<unknown> => {
  const { coll: collection } = getConnection();
  return new Promise((resolve, reject) => {
    collection.upsert(key, data, (err: Error | null, res: unknown) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
};

export const couchbaseN1QLCollection = (
  queryData: string | { query: string }
): Promise<{ rows: unknown[] }> => {
  const { cluster: c } = getConnection();
  return new Promise((resolve, reject) => {
    c.query(queryData, (err: Error | null, res: { rows: unknown[] }) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
};

