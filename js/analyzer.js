import { detectEntities } from './detector.js';
import { activeProtections } from './utils.js';

export function analyze(text) {
  const act = activeProtections();
  const all = detectEntities(text);
  return all.filter(r => act.has(r.type));
}
