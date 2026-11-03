const fs = require('fs');

let html = fs.readFileSync('pitch.html', 'utf8');

const oldStyleRegex = /<style>[\s\S]*?<\/style>/;
const newStyle = `<style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Georgia', 'Cambria', 'Times New Roman', serif;
      color: #111111;
      background: #FFFFFF;
      font-size: 8.8pt;
      line-height: 1.33;
      -webkit-font-smoothing: antialiased;
      display: flex;
      justify-content: center;
      padding: 0;
    }
    .sheet {
      width: 100%;
      max-width: 794px;
      height: 100%;
      border: 1.5px solid #222222;
      padding: 18px 26px 14px 26px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #FFFFFF;
    }
    .header {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 4px;
    }
    .header-logo {
      width: 50px;
      height: 50px;
      object-fit: contain;
      position: absolute;
      left: 6px;
      top: 50%;
      transform: translateY(-50%);
    }
    .header-text {
      width: 100%;
      text-align: center;
    }
    .title {
      font-size: 20pt;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: #05161c;
      margin-bottom: 1px;
    }
    .subtitle {
      font-size: 9.2pt;
      font-style: italic;
      color: #2b3b42;
      margin-bottom: 2px;
    }
    .pitch-meta {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 8pt;
      color: #444444;
      margin-bottom: 2px;
    }
    .links {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 8pt;
      color: #111111;
    }
    .links a {
      color: #0b3d4a;
      text-decoration: underline;
    }
    hr.divider {
      border: none;
      border-top: 1px solid #333333;
      margin: 6px 0 7px 0;
    }
    .section {
      margin-bottom: 6px;
    }
    .section-title {
      font-family: 'Georgia', 'Cambria', serif;
      font-size: 9.3pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #05161c;
      margin-bottom: 2px;
    }
    p.lead-text {
      text-align: justify;
      color: #1a1a1a;
      font-size: 8.6pt;
      line-height: 1.33;
    }
    ul.feature-list {
      list-style-type: none;
      padding-left: 0;
    }
    ul.feature-list li {
      position: relative;
      padding-left: 13px;
      margin-bottom: 4px;
      font-size: 8.4pt;
      line-height: 1.30;
      text-align: justify;
      color: #1a1a1a;
    }
    ul.feature-list li::before {
      content: '•';
      position: absolute;
      left: 0;
      top: -1px;
      font-size: 11pt;
      color: #222222;
    }
    ul.feature-list li strong {
      font-weight: 700;
      color: #05161c;
    }
    ul.feature-list li em {
      font-style: italic;
      color: #333333;
    }
    .callout-box {
      border: 1px solid #333333;
      padding: 5px 9px;
      margin: 6px 0 7px 0;
      background: #fafafa;
      font-size: 8pt;
      line-height: 1.30;
      text-align: justify;
    }
    .callout-box strong {
      color: #05161c;
    }
    .footer {
      margin-top: 3px;
    }
    .footer hr {
      border: none;
      border-top: 1px solid #333333;
      margin-bottom: 4px;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 7.8pt;
      color: #333333;
    }
    @media print {
      html, body {
        width: 100%;
        height: 100%;
        margin: 0 !important;
        padding: 0 !important;
        background: none;
      }
      .sheet {
        border: 1.5px solid #222222 !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        padding: 16px 22px 12px 22px !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
    }
  </style>`;

html = html.replace(oldStyleRegex, newStyle);
fs.writeFileSync('pitch.html', html, 'utf8');
fs.writeFileSync('public/pitch.html', html, 'utf8');
console.log('Successfully updated pitch.html and public/pitch.html');

