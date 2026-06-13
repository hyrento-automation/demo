const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /#1b2d4f/gi, replacement: '#1F3E42' },
  { regex: /#1B2D4F/g, replacement: '#1F3E42' },
  { regex: /#C9A84C/gi, replacement: '#0D8566' },
  { regex: /#c9a84c/g, replacement: '#0D8566' },
  { regex: /#0D9B84/gi, replacement: '#0D8566' },
  { regex: /#0d9b84/g, replacement: '#0D8566' },
];

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walkDir('./src');
let changedFileCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  replacements.forEach(({ regex, replacement }) => {
    newContent = newContent.replace(regex, replacement);
  });
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFileCount++;
  }
});

console.log(`Replaced hex colors globally in ${changedFileCount} files.`);
