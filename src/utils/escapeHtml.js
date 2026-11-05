/**
 * AyuSwar AI — Secure HTML Entity Escaper for Print Windows and Export Views
 * Prevents XSS when interpolating record fields into document.write or innerHTML.
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default escapeHtml;

