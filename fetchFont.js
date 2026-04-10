import https from 'https';
import fs from 'fs';

https.get('https://www.winstoneprojects.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('c:/Users/HP/winstone/winstone_html.txt', data);
    console.log('Saved to winstone_html.txt');
  });
}).on('error', (err) => console.log('Error: ', err.message));
