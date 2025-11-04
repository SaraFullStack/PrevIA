import { patterns } from './patterns.js';
import { activeProtections } from './utils.js';

const PRIORITY = ['url','email','iban','dni','id','exp','date','address','phone','names'];

function applyWithPriority(text, hits, cb) {
  const act = activeProtections();
  const allowedTypes = hits ? new Set(hits.map(h => h.type)) : null;

  let out = text;
  for (const key of PRIORITY) {
    const def = patterns[key];
    if (!def || !act.has(key)) continue;
    if (allowedTypes && !allowedTypes.has(key)) continue;
    out = cb(out, key, def.re, def.token);
  }
  return out;
}

export function pseudonymize(text, hits = null) {
  let nameIndex = 1;
  return applyWithPriority(text, hits, (t, key, re, token) => {
    if (!(re instanceof RegExp)) return t;
    if (key === 'names') {
      return t.replace(re, () => token.replace('$', nameIndex++)); 
    }
    return t.replace(re, token);
  });
}

export function generalize(text, hits = null) {
  const map = {
    names: '(una persona)',
    dni: '(un documento de identidad)',
    phone: '(un número de teléfono)',
    email: '(una dirección de correo electrónico)',
    iban: '(una cuenta bancaria)',
    url: '(una dirección web)',
    address: '(una dirección postal)',
    exp: '(un expediente)',
    id: '(un identificador único)',
    date: '(una fecha)'
  };

  return applyWithPriority(text, hits, (t, key, re) => {
    if (!(re instanceof RegExp)) return t;
    const repl = map[key] || '(un dato)';
    return t.replace(re, repl);
  });
}
