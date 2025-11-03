import { $, normalizeText, showAppAlert } from './utils.js';
import { analyze } from './analyzer.js';
import { pseudonymize, generalize } from './transformer.js';
import { updateRisk, renderFindings } from './ui.js';

export function bindEvents() {
    const input = $('#inputText');
    const output = $('#outputText');
    const findings = $('#findings');
    const badge = $('#riskBadge');

    $('#btnAnalyze').addEventListener('click', () => {
        const text = (output.value || input.value || '').toString();
        const hits = analyze(text);
        updateRisk(hits, badge);
        renderFindings(hits, findings);
        if (!output.value) output.value = text;
    });

    $('#btnPseudonym').addEventListener('click', () => {
        const base = normalizeText(input.value.toString());
        const t = pseudonymize(base);
        output.value = t;
        const hits = analyze(t);
        updateRisk(hits, badge);
        renderFindings(hits, findings);
    });

    $('#btnGeneralize').addEventListener('click', () => {
        const base = input.value.toString();
        const t = generalize(base);
        output.value = t;
        const hits = analyze(t);
        updateRisk(hits, badge);
        renderFindings(hits, findings);
    });

    $('#btnCopy').addEventListener('click', async () => {
        const text = output.value.trim();
        if (!text) return showAppAlert('Nada que copiar todavía.');
        await navigator.clipboard.writeText(text);
        showAppAlert('Copiado al portapapeles');
    });

    $('#btnClear').addEventListener('click', () => {
        input.value = ''; output.value = ''; findings.innerHTML = '';
        badge.textContent = 'BAJO'; badge.className = 'risk-badge risk-low';
    });
}
