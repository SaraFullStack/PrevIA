import { normalizeForDetection } from './normalizer.js';
import { markKeywordContexts } from './keywords.js';
import { patterns } from './patterns.js';

// detector.js
export function detectEntities(text) {
  const normalized = normalizeForDetection(text);
  const hints = markKeywordContexts(normalized);
  const results = [];

  for (const [type, def] of Object.entries(patterns)) {   // ← def es { re, token }
    const re = def.re;                                     // ← usa la RegExp real
    const matches = [...normalized.matchAll(re)];
    if (matches.length) {
      results.push({
        type,
        name: (type || '').toUpperCase(),
        count: matches.length,
        examples: matches.slice(0, 3).map(m => m[0]),
        hints: hints.filter(h => h.type === type)
      });
    }
  }
  return results;
}

