const fs = require('fs');
const html = fs.readFileSync('pitch.html', 'utf8');
const match = html.match(/<img[^>]+src="([^"]+)"/);
if (match) {
  const src = match[1];
  console.log('Prefix:', src.slice(0, 30));
  console.log('Char codes from 20 to 25:');
  for (let i = 20; i <= 25; i++) {
    console.log(i, src.charAt(i), src.charCodeAt(i).toString(16));
  }
} else {
  console.log('No img found');
}

