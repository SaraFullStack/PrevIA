// Palabras clave por tipo de dato
export const keywordHints = {
  names: ['nombre', 'apellidos', 'persona', 'sr', 'sra', 'don', 'dona'],
  dni: ['dni', 'nie', 'documento', 'identificador'],
  phone: ['telefono', 'movil', 'celular', 'contacto', 'tlf'],
  email: ['correo', 'mail', 'email'],
  iban: ['iban', 'cuenta', 'banco', 'entidad'],
  url: ['http', 'https', 'www', 'enlace', 'link', 'url', 'sitio'],
  address: ['calle', 'avenida', 'plaza', 'paseo', 'carretera', 'direccion', 'urbanizacion', 'cp'],
  date: ['fecha', 'dia', 'mes', 'ano'],
  exp: ['expediente', 'ref', 'numero', 'nº'],
  id: ['uuid', 'identificador', 'id']
};

// Busca las palabras clave en el texto normalizado
export function markKeywordContexts(text) {
  const found = [];
  for (const [type, words] of Object.entries(keywordHints)) {
    for (const word of words) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text))) {
        found.push({ type, word, index: match.index });
      }
    }
  }
  return found;
}
