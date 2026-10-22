const fs = require('fs');
const path = require('path');
const nr = 'node_modules/@fontsource/newsreader/files';
const hk = 'node_modules/@fontsource/hanken-grotesk/files';
const b64 = p => fs.readFileSync(p).toString('base64');
const faces = [
  ['Newsreader', 400, `${nr}/newsreader-latin-400-normal.woff2`],
  ['Newsreader', 500, `${nr}/newsreader-latin-500-normal.woff2`],
  ['Newsreader', 600, `${nr}/newsreader-latin-600-normal.woff2`],
  ['Hanken Grotesk', 400, `${hk}/hanken-grotesk-latin-400-normal.woff2`],
  ['Hanken Grotesk', 600, `${hk}/hanken-grotesk-latin-600-normal.woff2`],
  ['Hanken Grotesk', 700, `${hk}/hanken-grotesk-latin-700-normal.woff2`],
];
const css = faces.map(([fam,w,p]) =>
`@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64(p)}) format('woff2');}`
).join('\n');
fs.writeFileSync(path.join(process.argv[2],'fonts.css'), css);
console.log('wrote fonts.css', css.length, 'bytes');
