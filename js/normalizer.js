export function normalizeForDetection(text) {
  if (!text) return '';

  let t = text.normalize('NFC').toLowerCase();

  const map = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n' };
  t = t.replace(/[áéíóúüñ]/g, m => map[m] || m);

  t = t
    .replace(/\bc\/\s*/g, 'calle ')
    .replace(/\bavda\.?\s*/g, 'avenida ')
    .replace(/\bav\.\s*/g, 'avenida ')
    .replace(/\bplz\.?\s*/g, 'plaza ')
    .replace(/\burb\.?\s*/g, 'urbanizacion ')
    .replace(/\bpº\s*/g, 'paseo ')
    .replace(/\bnº\b/g, 'numero ');

  t = t
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*([.,;:!?])\s*/g, '$1 ')
    .replace(/\n{2,}/g, '\n')
    .trim();

  return t;
}
