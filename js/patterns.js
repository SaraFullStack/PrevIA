export const patterns = {
  names: {
    re: /\b(?!El\b|La\b|Los\b|Las\b|Sr\.?|Sra\.?|Don\b|Doña\b)([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+(?:de|del|la|los|las|y|e)?\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,3})\b/g,
    token: '[NOMBRE_$]'
  },
  dni: {
    re: /\b(?:[XYZxyz]-?\s*)?\d{7,8}\s*[-]?\s*[A-Za-z]\b/g,
    token: '[DNI]'
  },
  phone: {
    re: /\b(?:\+?34[\s-]?)?(?:\d{3}[\s-]?\d{2,3}[\s-]?\d{2,3})\b/g,
    token: '[TEL]'
  },
  email: {
    re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    token: '[EMAIL]'
  },
  iban: {
    re: /\b[A-Z]{2}\d{2}(?:\s?\d{4}){3,7}\b/g,
    token: '[IBAN]'
  },
  url: {
    re: /\b(?:https?:\/\/|www\.)[^\s"']+[^\s.,;:!?)]/g,
    token: '[URL]'
  },
  address: {
    re: /\b(?:c\/|calle|avda\.?|avenida|plz\.?|plaza|paseo|camino|carretera|urb\.?|urbanizacion|ronda)\s+[A-Za-z0-9 .ºª,-]{3,}(?=(?:\.\s|\n|$))/gi,
    token: '[DIRECCIÓN]'
  },
  date: {
    re: /\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|\d{1,2}\s+de\s+[A-Za-záéíóúñ]+\s+de\s+\d{4})\b/g,
    token: '[FECHA]'
  },
  exp: {
    re: /\b(?:exp[-:\/]?[A-Za-z0-9\/-]+|ref[-:\/]?[A-Za-z0-9\/-]+|\d{3,}\/\d{4})\b/gi,
    token: '[EXPEDIENTE]'
  },
  id: {
    re: /\b[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\b/g,
    token: '[ID]'
  }
};
