import { normalizeForDetection } from './normalizer.js';
import { markKeywordContexts } from './keywords.js';
import { patterns } from './patterns.js';

export function detectEntities(text) {
  const normalized = normalizeForDetection(text);
  const hints = markKeywordContexts(normalized);
  const results = [];

  for (const [type, def] of Object.entries(patterns)) {
    const re = def.re;
    const matches = [
      ...text.matchAll(re),
      ...normalized.matchAll(re)
    ];
    const unique = [...new Set(matches.map(m => m[0]))];

    if (unique.length) {
      results.push({
        type,
        name: (type || '').toUpperCase(),
        count: unique.length,
        examples: unique.slice(0, 3),
        hints: hints.filter(h => h.type === type)
      });
    }
  }
  return results;
}

