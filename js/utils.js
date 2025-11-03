export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => Array.from(document.querySelectorAll(sel));

export function activeProtections() {
    return new Set($$('.protect').filter(c => c.checked).map(c => c.value));
}

export function normalizeText(text) {
    return (text || '')
        .normalize('NFC')
        .replace(/\bc\/\s*/gi, 'calle ')
        .replace(/\bavda\.?\s*/gi, 'avenida ')
        .replace(/\bplz\.?\s*/gi, 'plaza ')
        .replace(/\burb\.?\s*/gi, 'urbanización ')
        .replace(/\bpº\s*/gi, 'paseo ')
        .replace(/\b(www\.)/gi, 'https://$1')
        .replace(/\s+/g, ' ')
        .replace(/\s*([.,;:!?])\s*/g, '$1 ')
        .trim();
}

export function showAppAlert(message, duration = 2000) {
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
