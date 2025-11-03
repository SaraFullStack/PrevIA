// transformer.js
import { patterns } from './patterns.js';
import { activeProtections } from './utils.js';

const PRIORITY = ['url','email','iban','dni','id','exp','date','address','phone','names'];

function applyWithPriority(text, cb) {
  const act = activeProtections();
  let out = text;
  for (const key of PRIORITY) {
    const def = patterns[key];
    if (!def || !act.has(key)) continue;
    out = cb(out, key, def.re, def.token);
  }
  return out;
}

export function pseudonymize(text) {
  let idx = 1;
  return applyWithPriority(text, (t, key, re, token) =>
    t.replace(re, _ => key === 'names' ? token.replace('$', idx++) : token)
  );
}

export function generalize(text) {
  const map = {
    names: 'una persona', dni: 'un documento de identidad', phone: 'un número de teléfono',
    email: 'una dirección de correo', iban: 'una cuenta bancaria', url: 'una dirección web',
    address: 'una dirección', exp: 'un expediente', id: 'un identificador'
  };
  return applyWithPriority(text, (t, key, re) => {
    if (key === 'date') {
  return t.replace(re, (match, d, m, y) => {
    if (!d || !m || !y) return match;  // ← evita undefined
    const meses = ['enero','febrero','marzo','abril','mayo','junio',
                   'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const mi = Math.max(1, Math.min(12, parseInt(m))) - 1;
    const yy = (y.length === 2 ? '20' + y : y);
    return `${meses[mi]} de ${yy}`;
  });
}
    return t.replace(re, map[key] || '[TOKEN]');
  });
}
