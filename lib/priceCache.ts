/* In-memory cache shared across components in the same browser session */
let _cache: Record<string, Record<string, number>> = {};
let _ts = 0;
const TTL = 90_000; // 90 seconds

export function getPriceCache() {
  if (Date.now() - _ts < TTL && Object.keys(_cache).length > 0) return _cache;
  return null;
}

export function setPriceCache(data: Record<string, Record<string, number>>) {
  _cache = data;
  _ts    = Date.now();
}
