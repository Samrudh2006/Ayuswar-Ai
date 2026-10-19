import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const downloadsDir = 'C:/Users/HP/Downloads';
const files = [
  'WhatsApp Audio 2026-10-18 at 4.50.41 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.43 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.45 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.47 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.49 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.51 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.53 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.54.55 PM.mpeg'
];

for (const f of files) {
  const fullPath = path.join(downloadsDir, f);
  let dur = 'Unknown';
  let audio = 'Unknown';
  try {
    execSync(`ffmpeg -i "${fullPath}"`, { stdio: 'pipe' });
  } catch (err) {
    const out = (err.stderr || err.stdout || '').toString();
    const durMatch = out.match(/Duration: ([0-9:.]+)/);
    const audioMatch = out.match(/Audio: (.+)/);
    if (durMatch) dur = durMatch[1];
    if (audioMatch) audio = audioMatch[1];
  }
  console.log(`[FILE] ${f}\n  Duration: ${dur}\n  Audio Stream: ${audio}\n`);
}
