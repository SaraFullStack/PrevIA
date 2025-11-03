// patterns.js
export const patterns = {
  names:   { re: /\b[a-z]+(?:\s+(?:de|del|la|los|las|y|e)?\s*[a-z]+){1,3}\b/g,                     token: '[NOMBRE_$]' },
  dni:     { re: /\b[xyz]?\d{7,8}[a-z]\b/g,                                                         token: '[DNI]' },
  phone:   { re: /\b(\+?\d{1,3}[\s-]?)?(?:\d[\s-]?){9}\b/g,                                         token: '[TEL]' },
  email:   { re: /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/g,                                      token: '[EMAIL]' },
  iban:    { re: /\b[a-z]{2}\d{2}(?:\s?\d{4}){3,7}\b/g,                                             token: '[IBAN]' },
  url:     { re: /\b(?:https?:\/\/|www\.)[^\s]+/g,                                                  token: '[URL]' },
  address: { re: /\b(?:calle|avenida|plaza|paseo|camino|carretera|urbanizacion|ronda)\s+[a-z0-9 .ºª,-]{3,}\b/g, token: '[DIRECCIÓN]' },
  date:    { re: /\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/g,                                        token: '[FECHA]' },
  exp:     { re: /\b(?:exp[-:\/]?[a-z0-9\/-]+|ref[-:\/]?[a-z0-9\/-]+|\d{3,}\/\d{4})\b/g,            token: '[EXPEDIENTE]' },
  id:      { re: /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/g,               token: '[ID]' }
};
