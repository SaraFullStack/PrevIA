export function updateRisk(hits, badge) {
    const total = hits.reduce((a, b) => a + b.count, 0);
    let label = 'BAJO', cls = 'risk-low';
    if (total >= 6) { label = 'ALTO'; cls = 'risk-high'; }
    else if (total >= 3) { label = 'MEDIO'; cls = 'risk-med'; }
    badge.textContent = label;
    badge.className = `risk-badge ${cls}`;
}

const LABELS = {
  names: 'Nombres', dni: 'DNI/NIE', phone: 'Teléfonos', email: 'Emails',
  iban: 'IBAN', url: 'URLs', address: 'Direcciones', date: 'Fechas',
  exp: 'Expedientes', id: 'Identificadores'
};

export function renderFindings(hits, container) {
  container.innerHTML = '';
  if (!hits.length) {
    container.innerHTML = '<li>Sin hallazgos aparentes.</li>';
    return;
  }
  hits.forEach(h => {
    const label = h.name || LABELS[h.type] || h.type.toUpperCase();
    const li = document.createElement('li');
    li.textContent = `${label}: ${h.count}` + (h.examples?.length ? ` → ${h.examples.join(', ')}` : '');
    container.appendChild(li);
  });
}
