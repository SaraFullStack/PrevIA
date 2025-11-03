const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const input = $('#inputText');
const output = $('#outputText');
const findingsList = $('#findings');
const riskBadge = $('#riskBadge');

function activeProtections() {
    return new Set($$('.protect').filter(c => c.checked).map(c => c.value));
}

function normalizeText(text) {
    if (!text) return '';

    let t = text;

    t = t.replace(/\bc\/\s*/gi, 'calle ');
    t = t.replace(/\bavda\.?\s*/gi, 'avenida ');
    t = t.replace(/\bav\.\s*/gi, 'avenida ');
    t = t.replace(/\bplz\.?\s*/gi, 'plaza ');
    t = t.replace(/\burb\.?\s*/gi, 'urbanización ');
    t = t.replace(/\bpº\s*/gi, 'paseo ');

    t = t.replace(/\b(www\.[\w.-]+\.[a-z]{2,}(?:\/\S*)?)/gi, 'https://$1');

    t = t.replace(/[ \t]+/g, ' ');
    t = t.replace(/\n{2,}/g, '\n');
    t = t.trim();

    return t;
}

const patterns = {
    names: {
        re: /\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+(?:de|del|la|las|los|y|e)?\s*[A-ZÁÉÍÓÚÑ]?[a-záéíóúñ]*){0,3}\b/g,
        token: '[NOMBRE_$]'
    },
    dni: {
        re: /\b(?:\d{8}[A-HJ-NP-TV-Z]|[XYZ]\d{7}[A-HJ-NP-TV-Z])\b/gi,
        token: '[DNI]'
    },
    phone: {
        re: /\b(?:\+?\d{1,3}[\s-]?)?(?:\d[\s-]?){9}\b/g,
        token: '[TEL]'
    },
    email: {
        re: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        token: '[EMAIL]'
    },
    iban: {
        re: /\b[A-Z]{2}\d{2}(?:\s?\d{4}){3,7}\b/gi,
        token: '[IBAN]'
    },
    url: {
        re: /\bhttps?:\/\/[A-Z0-9.-]+\.[A-Z]{2,}(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?\b/gi,
        token: '[URL]'
    },
    address: {
        re: /\b(?:calle|avenida|plaza|paseo|carretera|camino|barrio|urbanización)\s+[A-ZÁÉÍÓÚÑa-záéíóúñ0-9 .ºª,-]{3,}\b/gi,
        token: '[DIRECCIÓN]'
    },
    date: {
        re: /\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/g,
        token: '[FECHA]'
    },
    exp: {
        re: /\b(?:EXP[-:\/]?[A-Z0-9\/-]+|REF[-:\/]?[A-Z0-9\/-]+|\d{3,}\/\d{4})\b/gi,
        token: '[EXPEDIENTE]'
    },
    id: {
        re: /\b[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}\b/gi,
        token: '[ID]'
    }
};


function analyze(text) {
    const act = activeProtections();
    const hits = [];
    for (const key of Object.keys(patterns)) {
        if (!act.has(key)) continue;
        const re = new RegExp(patterns[key].re);
        const m = text.match(re);
        if (m && m.length) hits.push({ name: key.toUpperCase(), count: m.length });
    }
    return hits;
}

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
    if (!hits.length) { findingsList.innerHTML = '<li>Sin hallazgos aparentes.</li>'; return; }
    hits.forEach(h => {
        const li = document.createElement('li');
        li.textContent = `${h.name}: ${h.count}`;
        findingsList.appendChild(li);
    });
}

function pseudonymize(text) {
    const act = activeProtections();
    let t = text;
    let nameIdx = 1;
    for (const key of Object.keys(patterns)) {
        if (!act.has(key)) continue;
        const def = patterns[key];
        if (key === 'names') {
            t = t.replace(def.re, _ => def.token.replace('$', nameIdx++));
        } else {
            t = t.replace(def.re, def.token);
        }
    }
    return t;
}

function generalize(text) {
    const act = activeProtections();
    let t = text;

    if (act.has('names')) {
        t = t.replace(patterns.names.re, 'una persona');
    }
    if (act.has('dni')) {
        t = t.replace(patterns.dni.re, 'un documento de identidad');
    }
    if (act.has('phone')) {
        t = t.replace(patterns.phone.re, 'un número de teléfono');
    }
    if (act.has('email')) {
        t = t.replace(patterns.email.re, 'una dirección de correo');
    }
    if (act.has('iban')) {
        t = t.replace(patterns.iban.re, 'una cuenta bancaria');
    }
    if (act.has('url')) {
        t = t.replace(patterns.url.re, 'una dirección web');
    }
    if (act.has('address')) {
        t = t.replace(patterns.address.re, 'una dirección');
    }
    if (act.has('exp')) {
        t = t.replace(patterns.exp.re, 'un expediente');
    }
    if (act.has('id')) {
        t = t.replace(patterns.id.re, 'un identificador');
    }

    if (act.has('date')) {
        t = t.replace(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g, (_, d, m, y) => {
            const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            const mi = Math.max(1, Math.min(12, parseInt(m))) - 1;
            const yy = (y.length === 2 ? ('20' + y) : y);
            return `${meses[mi]} de ${yy}`;
        });
    }

    return t;
}

function insertNotice() {
    const sel = $('#noticeSelect');
    const val = sel.value.trim();
    if (!val) return;
    const current = output.value.trim();
    output.value = (val + (current ? '\n\n' + current : ''));
}

$('#btnAnalyze').addEventListener('click', () => {
    const text = (output.value || input.value || '').toString();
    const hits = analyze(text);
    updateRisk(hits); renderFindings(hits);
    if (!output.value) output.value = text;
});

$('#btnPseudonym').addEventListener('click', () => {
    const base = normalizeText(input.value.toString());
    const result = pseudonymize(base);
    output.value = result;
    output.value = t;
    const hits = analyze(t); updateRisk(hits); renderFindings(hits);
});

$('#btnGeneralize').addEventListener('click', () => {
    const base = input.value.toString();
    const t = generalize(base);
    output.value = t;
    const hits = analyze(t); updateRisk(hits); renderFindings(hits);
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
    input.value = ''; output.value = ''; findingsList.innerHTML = '';
    riskBadge.textContent = 'BAJO'; riskBadge.className = 'risk-badge risk-low';
});

document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') $('#btnAnalyze').click(); });

document.getElementById('btnLinkedIn')?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.linkedin.com/in/sara-cubero-garc%C3%ADa-conde-471143165/' });
});
