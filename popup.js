// === popup.js (versión pulida) ===

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const input = $('#inputText');
const output = $('#outputText');
const findingsList = $('#findings');
const riskBadge = $('#riskBadge');

// === Configuración y patrones ===
// === Patrones mejorados con palabras clave ===
const patterns = {
    names: {
        re: /\b(?:nombre(?:s)?[:\s-]*|sr\.?|sra\.?|don|doña)\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,3}\b|\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\b/g,
        token: '[NOMBRE_$]'
    },
    dni: {
        re: /\b(?:dni|nie|n\.?º?\s*id(?:entidad)?|identificador)[:\s-]*([0-9XYZ][0-9]{6,7}[A-Z])\b/gi,
        token: '[DNI]'
    },
    phone: {
        re: /\b(?:tel(?:éf(?:ono)?)?|móvil|celular|contacto)[:\s-]*\+?\d[\d\s-]{6,}\b/g,
        token: '[TEL]'
    },
    email: {
        re: /\b(?:correo(?:\s*electr[oó]nico)?|mail)[:\s-]*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        token: '[EMAIL]'
    },
    iban: {
        re: /\b(?:iban|cuenta|cta\.?|banco)[:\s-]*[A-Z]{2}\d{2}(?:\s?\d{4}){3,7}\b/gi,
        token: '[IBAN]'
    },
    url: {
        re: /\b(?:(?:https?:\/\/|www\.|\/\/)[^\s]+|(?:enlace|link|url)[:\s-]*[^\s]+)\b/gi,
        token: '[URL]'
    },
    address: {
        re: /\b(?:calle|avenida|plaza|paseo|camino|carretera|urbanización|ronda|dirección)[:\s-]*[A-ZÁÉÍÓÚÑa-záéíóúñ0-9 .ºª,-]{3,}\b/gi,
        token: '[DIRECCIÓN]'
    },
    date: {
        re: /\b(?:fecha)[:\s-]*(0?[1-9]|[12][0-9]|3[01])[\/\-.](0?[1-9]|1[0-2])[\/\-.](\d{2,4})\b/g,
        token: '[FECHA]'
    },
    exp: {
        re: /\b(?:exp(?:ediente)?|ref(?:erencia)?)[:\s-]*[A-Z0-9\/-]{3,}\b/gi,
        token: '[EXPEDIENTE]'
    },
    id: {
        re: /\b(?:uuid|id|identificador)[:\s-]*[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}\b/gi,
        token: '[ID]'
    }
};

// === Análisis contextual: mezcla patrón + palabra clave ===
function analyze(text) {
    const act = activeProtections();
    const hits = [];

    for (const [key, { re }] of Object.entries(patterns)) {
        if (!act.has(key)) continue;

        const matches = [...text.matchAll(re)];
        if (matches.length) {
            const ejemplos = matches.slice(0, 3).map(m => m[0]);
            hits.push({
                name: key.toUpperCase(),
                count: matches.length,
                examples: ejemplos
            });
        }
    }

    return hits;
}

// === Utilidades ===
function activeProtections() {
    return new Set($$('.protect').filter(c => c.checked).map(c => c.value));
}

function normalizeText(text) {
    return (text || '')
        .normalize('NFC')
        .replace(/\bc\/\s*/gi, 'calle ')
        .replace(/\bavda\.?\s*/gi, 'avenida ')
        .replace(/\bav\.\s*/gi, 'avenida ')
        .replace(/\bplz\.?\s*/gi, 'plaza ')
        .replace(/\burb\.?\s*/gi, 'urbanización ')
        .replace(/\bpº\s*/gi, 'paseo ')
        .replace(/\b(www\.)/gi, 'https://$1')
        .replace(/\s+/g, ' ')
        .replace(/\s*([.,;:!?])\s*/g, '$1 ')
        .trim();
}


function applyPatterns(text, callback) {
    const act = activeProtections();
    let result = text;
    for (const [key, { re, token }] of Object.entries(patterns)) {
        if (!act.has(key)) continue;
        result = callback(result, key, re, token);
    }
    return result;
}

function pseudonymize(text) {
    let idx = 1;
    return applyPatterns(text, (t, key, re, token) => {
        return t.replace(re, _ => key === 'names' ? token.replace('$', idx++) : token);
    });
}

function generalize(text) {
    return applyPatterns(text, (t, key, re) => {
        const map = {
            names: 'una persona',
            dni: 'un documento de identidad',
            phone: 'un número de teléfono',
            email: 'una dirección de correo',
            iban: 'una cuenta bancaria',
            url: 'una dirección web',
            address: 'una dirección',
            exp: 'un expediente',
            id: 'un identificador',
            date: null
        };
        if (key === 'date') {
            return t.replace(re, (_, d, m, y) => {
                const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
                const mi = Math.max(1, Math.min(12, parseInt(m))) - 1;
                const yy = (y.length === 2 ? '20' + y : y);
                return `${meses[mi]} de ${yy}`;
            });
        }
        return t.replace(re, map[key] || token);
    });
}

// === Visualización ===
function updateRisk(hits) {
    const total = hits.reduce((a, b) => a + b.count, 0);
    let label = 'BAJO', cls = 'risk-low';
    if (total >= 6) { label = 'ALTO'; cls = 'risk-high'; }
    else if (total >= 3) { label = 'MEDIO'; cls = 'risk-med'; }
    riskBadge.textContent = label;
    riskBadge.className = `risk-badge ${cls}`;
}

function renderFindings(hits) {
    findingsList.innerHTML = '';
    if (!hits.length) {
        findingsList.innerHTML = '<li>Sin hallazgos aparentes.</li>';
        return;
    }
    hits.forEach(h => {
        const li = document.createElement('li');
        li.textContent = `${h.name}: ${h.count}` + (h.examples?.length ? ` → ${h.examples.join(', ')}` : '');
        findingsList.appendChild(li);
    });
}

// === Acciones principales ===
function insertNotice() {
    const sel = $('#noticeSelect');
    const val = sel.value.trim();
    if (!val) return;
    const current = output.value.trim();
    output.value = val + (current ? '\n\n' + current : '');
}

// === Botones y eventos ===
$('#btnAnalyze').addEventListener('click', () => {
    const text = (output.value || input.value || '').toString();
    const hits = analyze(text);
    updateRisk(hits);
    renderFindings(hits);
    if (!output.value) output.value = text;
});

$('#btnPseudonym').addEventListener('click', () => {
    const base = normalizeText(input.value.toString());
    const t = pseudonymize(base);
    output.value = t;
    const hits = analyze(t);
    updateRisk(hits);
    renderFindings(hits);
});

$('#btnGeneralize').addEventListener('click', () => {
    const base = input.value.toString();
    const t = generalize(base);
    output.value = t;
    const hits = analyze(t);
    updateRisk(hits);
    renderFindings(hits);
});

$('#btnInsertNotice').addEventListener('click', insertNotice);

$('#btnCopy').addEventListener('click', async () => {
    const text = output.value.trim();
    if (!text) return showAppAlert('Nada que copiar todavía.');
    try {
        await navigator.clipboard.writeText(text);
        showAppAlert('Copiado al portapapeles');
    } catch {
        showAppAlert('No se pudo copiar automáticamente.');
    }
});

$('#btnDownload').addEventListener('click', () => {
    const text = output.value.trim();
    if (!text) return showAppAlert('Nada que descargar.');
    const now = new Date();
    const fechaISO = now.toISOString().split('T')[0];
    const fechaLocal = now.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
    const contenidoFinal = `${text}\n\n---\n📅 Fecha de exportación: ${fechaLocal}\n🔐 Generado automáticamente con PrevIA\n`;
    const nombreArchivo = `texto_securizado_${fechaISO}.txt`;
    const blob = new Blob([contenidoFinal], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);
});

function showAppAlert(message, duration = 2000) {
    const container = document.getElementById('appAlertContainer');
    if (!container) return;
    const alertEl = document.createElement('div');
    alertEl.className = 'alert fade show';
    alertEl.setAttribute('role', 'alert');
    alertEl.textContent = message;
    container.innerHTML = '';
    container.appendChild(alertEl);
    setTimeout(() => {
        alertEl.classList.remove('show');
        alertEl.addEventListener('transitionend', () => alertEl.remove());
    }, duration);
}

$('#btnClear').addEventListener('click', () => {
    input.value = '';
    output.value = '';
    findingsList.innerHTML = '';
    riskBadge.textContent = 'BAJO';
    riskBadge.className = 'risk-badge risk-low';
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') $('#btnAnalyze').click();
});

document.getElementById('btnLinkedIn')?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.linkedin.com/in/sara-cubero-garc%C3%ADa-conde-471143165/' });
});
