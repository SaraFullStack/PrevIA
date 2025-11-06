import { $, showAppAlert } from './utils.js';
import { analyze } from './analyzer.js';
import { pseudonymize, generalize } from './transformer.js';
import { updateRisk, renderFindings } from './ui.js';

export function bindEvents() {
  const input = $('#inputText');
  const output = $('#outputText');
  const findings = $('#findings');
  const badge = $('#riskBadge');
  const noticeSelect = $('#noticeSelect');
  const btnInsertNotice = $('#btnInsertNotice');
  const btnDownload = $('#btnDownload');
  const btnLinkedIn = $('#btnLinkedIn');
  const btnManualAnon = $('#btnManualAnon');

  function maskSelection(textarea, mask = '***') {
    const { selectionStart, selectionEnd, value } = textarea;
    if (!selectionStart && selectionStart !== 0) return false;
    if (selectionStart === selectionEnd) return false;
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    textarea.value = before + mask + after;
    const pos = before.length + mask.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
    textarea.focus();
    return true;
  }

  function insertAtSelection(textarea, text) {
    const { selectionStart, selectionEnd, value } = textarea;
    const start = selectionStart ?? value.length;
    const end = selectionEnd ?? start;
    const before = value.slice(0, start);
    const after = value.slice(end);
    textarea.value = before + text + after;
    const pos = before.length + text.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
    textarea.focus();
  }

  $('#btnAnalyze').addEventListener('click', () => {
    const base = input.value.toString();
    const hits = analyze(base);

    updateRisk(hits, badge);
    renderFindings(hits, findings);

    if (!output.value) output.value = base;
  });

  $('#btnPseudonym').addEventListener('click', () => {
    const base = input.value.toString();
    const hits = analyze(base);
    const t = pseudonymize(base, hits);
    output.value = t;

    updateRisk(hits, badge);
    renderFindings(hits, findings);
  });

  $('#btnGeneralize').addEventListener('click', () => {
    const base = input.value.toString();
    const hits = analyze(base);
    const t = generalize(base, hits);
    output.value = t;

    updateRisk(hits, badge);
    renderFindings(hits, findings);
  });

  $('#btnCopy').addEventListener('click', async () => {
    const text = output.value.trim();
    if (!text) return showAppAlert('Nada que copiar todavía.');
    await navigator.clipboard.writeText(text);
    showAppAlert('Copiado al portapapeles');
  });

  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const text = output.value;
      if (!text.trim()) return showAppAlert('Nada que descargar todavía.');

      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      const day = pad(now.getDate());
      const month = pad(now.getMonth() + 1);
      const year = now.getFullYear();
      const hour = pad(now.getHours());
      const min = pad(now.getMinutes());
      const fileName = `previa_${day}-${month}-${year}_${hour}-${min}.txt`;

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  $('#btnClear').addEventListener('click', () => {
    input.value = '';
    output.value = '';
    findings.innerHTML = '';
    badge.textContent = 'BAJO';
    badge.className = 'risk-badge risk-low';
  });

  if (btnInsertNotice && noticeSelect) {
    btnInsertNotice.addEventListener('click', () => {
      const value = noticeSelect.value;
      if (!value) return;
      const snippet = `\n-------------\n${value}\n-------------\n`;
      insertAtSelection(output, snippet);
    });
  }

  if (btnLinkedIn) {
    btnLinkedIn.addEventListener('click', () => {
      window.open('https://github.com/SaraFullStack/PrevIA', '_blank');
      window.open('https://sarafullstack.github.io/', '_blank');
    });
  }

  let manualAnonMode = false;

  function handleAnonSelection(textarea) {
    if (!manualAnonMode) return;
    maskSelection(textarea, '***');
  }

  if (btnManualAnon) {
    btnManualAnon.addEventListener('click', () => {
      manualAnonMode = !manualAnonMode;
      btnManualAnon.classList.toggle('btn-warning', manualAnonMode);
      btnManualAnon.classList.toggle('btn-outline-warning', !manualAnonMode);
    });

    ['mouseup', 'keyup'].forEach(evt => {
      input.addEventListener(evt, () => handleAnonSelection(input));
      output.addEventListener(evt, () => handleAnonSelection(output));
    });
  }

  const paneInput = document.getElementById('paneInput');
  const paneOutput = document.getElementById('paneOutput');

  if (paneInput && paneOutput) {
    const collapseInput = new bootstrap.Collapse(paneInput, { toggle: false });
    const collapseOutput = new bootstrap.Collapse(paneOutput, { toggle: false });

    paneInput.addEventListener('show.bs.collapse', () => {
      collapseOutput.show();
    });
    paneOutput.addEventListener('show.bs.collapse', () => {
      collapseInput.show();
    });

    paneInput.addEventListener('hide.bs.collapse', () => {
      collapseOutput.hide();
    });
    paneOutput.addEventListener('hide.bs.collapse', () => {
      collapseInput.hide();
    });
  }
}
