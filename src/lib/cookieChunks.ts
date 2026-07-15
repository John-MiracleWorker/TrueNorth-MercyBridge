export const COOKIE_CHUNK_SIZE = 3400;
const MAX_COOKIE_CHUNKS = 32;
const CHUNK_COUNT_SUFFIX = '__chunks';
const CHUNK_VALUE_PREFIX = '__chunk_';

interface CookieOptions {
  domain?: string;
  maxAge?: number;
}

function hasDocument(): boolean {
  return typeof document !== 'undefined';
}

function cookieAttributes(options: CookieOptions): string {
  const attributes = ['path=/', 'SameSite=Lax'];
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : '';
  const normalizedDomain = options.domain?.replace(/^\./, '');

  if (
    normalizedDomain &&
    (hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`))
  ) {
    attributes.push(`domain=.${normalizedDomain}`);
  }
  if (typeof options.maxAge === 'number') {
    attributes.push(`max-age=${options.maxAge}`);
  }
  if (protocol === 'https:') {
    attributes.push('Secure');
  }

  return attributes.join('; ');
}

function readRawCookie(name: string): string | null {
  if (!hasDocument()) return null;
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(prefix));
  return cookie ? cookie.slice(prefix.length) : null;
}

function writeRawCookie(name: string, value: string, options: CookieOptions): void {
  if (!hasDocument()) return;
  document.cookie = `${name}=${value}; ${cookieAttributes(options)}`;
}

function expireCookie(name: string, options: CookieOptions): void {
  if (!hasDocument()) return;
  document.cookie = `${name}=; ${cookieAttributes(options)}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
}

export function splitCookieValue(
  value: string,
  chunkSize = COOKIE_CHUNK_SIZE,
): string[] {
  const encoded = encodeURIComponent(value);
  const chunks: string[] = [];
  for (let offset = 0; offset < encoded.length; offset += chunkSize) {
    chunks.push(encoded.slice(offset, offset + chunkSize));
  }
  return chunks.length > 0 ? chunks : [''];
}

export function joinCookieChunks(chunks: string[]): string | null {
  try {
    return decodeURIComponent(chunks.join(''));
  } catch {
    return null;
  }
}

export function removeChunkedCookie(name: string, options: CookieOptions = {}): void {
  if (!hasDocument()) return;

  const relatedNames = document.cookie
    .split(';')
    .map((entry) => entry.trim().split('=')[0])
    .filter(
      (cookieName) =>
        cookieName === name ||
        cookieName === `${name}${CHUNK_COUNT_SUFFIX}` ||
        cookieName.startsWith(`${name}${CHUNK_VALUE_PREFIX}`),
    );

  for (const cookieName of new Set([
    name,
    `${name}${CHUNK_COUNT_SUFFIX}`,
    ...relatedNames,
  ])) {
    expireCookie(cookieName, options);
  }
}

export function writeChunkedCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  if (!hasDocument()) return;

  removeChunkedCookie(name, options);
  const chunks = splitCookieValue(value);
  if (chunks.length === 1) {
    writeRawCookie(name, chunks[0], options);
    return;
  }
  if (chunks.length > MAX_COOKIE_CHUNKS) {
    throw new Error(`Cookie value for ${name} exceeds the supported chunk limit`);
  }

  writeRawCookie(`${name}${CHUNK_COUNT_SUFFIX}`, String(chunks.length), options);
  chunks.forEach((chunk, index) => {
    writeRawCookie(`${name}${CHUNK_VALUE_PREFIX}${index}`, chunk, options);
  });
}

export function readChunkedCookie(name: string): string | null {
  if (!hasDocument()) return null;

  const rawChunkCount = readRawCookie(`${name}${CHUNK_COUNT_SUFFIX}`);
  const chunkCount = rawChunkCount ? Number.parseInt(rawChunkCount, 10) : 0;
  if (chunkCount > 1 && chunkCount <= MAX_COOKIE_CHUNKS) {
    const chunks: string[] = [];
    for (let index = 0; index < chunkCount; index += 1) {
      const chunk = readRawCookie(`${name}${CHUNK_VALUE_PREFIX}${index}`);
      if (chunk === null) return null;
      chunks.push(chunk);
    }
    return joinCookieChunks(chunks);
  }

  const legacyValue = readRawCookie(name);
  return legacyValue === null ? null : joinCookieChunks([legacyValue]);
}
