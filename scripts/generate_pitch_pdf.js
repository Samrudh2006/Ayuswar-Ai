import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(p => fs.existsSync(p));

if (!CHROME_PATH) {
  console.error('Error: No Chrome or Edge executable found to render PDF.');
  process.exit(1);
}

const htmlPath = path.resolve(process.cwd(), 'pitch.html');
if (!fs.existsSync(htmlPath)) {
  console.error(`Error: pitch.html not found at ${htmlPath}`);
  process.exit(1);
}

const localPdfPath = path.resolve(process.cwd(), 'AyuSwar_AI_Solution_Pitch.pdf');
const userDownloadsDir = 'C:\\Users\\HP\\Downloads';
const downloadsPdfPath = path.join(userDownloadsDir, 'AyuSwar_AI_Solution_Pitch.pdf');
const tempProfileDir = path.resolve(process.cwd(), '.puppeteer_pdf_profile');

async function generatePdf() {
  console.log(`Using browser: ${CHROME_PATH}`);
  if (!fs.existsSync(tempProfileDir)) {
    fs.mkdirSync(tempProfileDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tempProfileDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check'
    ]
  });

  try {
    const page = await browser.newPage();
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    console.log('Rendering PDF from pitch.html...');
    await page.pdf({
      path: localPdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });

    console.log(`✓ Local PDF created: ${localPdfPath} (${fs.statSync(localPdfPath).size} bytes)`);

    if (fs.existsSync(userDownloadsDir)) {
      fs.copyFileSync(localPdfPath, downloadsPdfPath);
      console.log(`✓ PDF successfully saved to Downloads: ${downloadsPdfPath} (${fs.statSync(downloadsPdfPath).size} bytes)`);
    } else {
      console.warn(`Downloads folder not found at ${userDownloadsDir}, local copy saved.`);
    }
  } finally {
    await browser.close();
  }
}

generatePdf().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
