// Version registry and read-only KJV provider. Copyrighted text stays unavailable until this app has an approved provider.
import { allWorlds } from './worlds-registry-active-world-and-progress-keys.js';
import { state, save } from './saved-progress-and-settings-state.js';

export const BIBLE_VERSIONS = Object.freeze({
  KJV: { id: 'KJV', abbreviation: 'KJV', name: 'King James Version', available: true,
    source: 'Bible API', officialUrl: 'https://www.biblegateway.com/versions/King-James-Version-KJV-Bible/' },
  NIV: { id: 'NIV', abbreviation: 'NIV', name: 'New International Version', available: false,
    officialUrl: 'https://www.biblica.com/bible/', licenseUrl: 'https://www.biblica.com/permissions/' },
  NLT: { id: 'NLT', abbreviation: 'NLT', name: 'New Living Translation', available: false,
    officialUrl: 'https://www.tyndale.com/nlt/', licenseUrl: 'https://www.tyndale.com/permissions' },
  MSG: { id: 'MSG', abbreviation: 'MSG', name: 'The Message', available: false,
    officialUrl: 'https://messagebible.com/', licenseUrl: 'https://www.tyndale.com/permissions' },
  EASY: { id: 'EASY', abbreviation: 'EASY', name: 'EasyEnglish Bible', available: false,
    officialUrl: 'https://www.easyenglish.bible/bible/easy/', licenseUrl: 'https://www.easyenglish.bible/copyright-and-licensing/' },
});

const normalizedRef = (ref) => String(ref).toLowerCase().replace(/\s+/g, ' ').trim();
const localKjv = new Map();
for (const world of allWorlds()) for (const lesson of world.lessons) {
  localKjv.set(normalizedRef(lesson.ref), lesson.verse);
  for (const verse of lesson.support || []) localKjv.set(normalizedRef(verse.ref), verse.text);
}
const memoryCache = new Map();

export const preferredBibleVersion = () => BIBLE_VERSIONS[state.settings.bibleVersion] ? state.settings.bibleVersion : 'KJV';
export function setPreferredBibleVersion(id) {
  if (!BIBLE_VERSIONS[id]) return false;
  state.settings.bibleVersion = id;
  save();
  return true;
}
export function bibleVersionOptions(selected = preferredBibleVersion()) {
  return Object.values(BIBLE_VERSIONS).map((version) => {
    const suffix = version.available ? '' : ' · text unavailable in game';
    return `<option value="${version.id}" ${version.id === selected ? 'selected' : ''}>${version.abbreviation} · ${version.name}${suffix}</option>`;
  }).join('');
}

async function fetchKjv(ref) {
  const cacheKey = normalizedRef(ref);
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);
  const request = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=kjv`;
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || data.translation_id !== 'kjv' || typeof data.text !== 'string' || !data.text.trim()) {
        throw new Error('The KJV provider did not return the requested passage.');
      }
      return { status: 'ready', ref: data.reference || ref, text: data.text, version: 'KJV', source: 'bible-api.com' };
    } finally { clearTimeout(timeout); }
  })();
  memoryCache.set(cacheKey, request);
  try { return await request; } catch (error) { memoryCache.delete(cacheKey); throw error; }
}

/** Returns only the requested version; it never falls back to another translation. */
export async function getBiblePassage(ref, translationId) {
  const version = BIBLE_VERSIONS[translationId];
  if (!version) return { status: 'unavailable', version: translationId, ref };
  if (!version.available) return { status: 'unavailable', version: translationId, ref };
  const local = translationId === 'KJV' ? localKjv.get(normalizedRef(ref)) : null;
  if (local) return { status: 'ready', ref, text: local, version: translationId, source: 'built-in KJV lesson text' };
  try { return await fetchKjv(ref); }
  catch (error) {
    return { status: navigator.onLine === false ? 'offline' : 'error', ref, version: translationId, error: error.message };
  }
}
