const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const cssVars = [
  'var(--bg-app)',
  'var(--bg-sidebar)',
  'var(--bg-card)',
  'var(--bg-input)',
  'var(--border-color)',
  'var(--text-primary)',
  'var(--text-secondary)',
  'var(--accent-color)',
  'var(--danger-color)',
  'var(--success-color)',
  'var(--badge-bg)',
  'var(--danger-bg)',
  'var(--danger-border)'
];

walkDir('c:/Users/USER/Upeksha0721-it3030-paf-2026-smart-campus-group_WE_315_2.2/frontend/src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix missing closing quotes for strings that contain our css vars and are followed immediately by `,` or ` }` or `)` or `\n`
    cssVars.forEach(v => {
      // Look for: property: 'some text var(--xxx),
      // We'll use a regex that looks for an opening quote, some text, the variable, and then no closing quote before a comma or brace.
      
      // Regex explanation:
      // (['"])           - Match opening quote (single or double)
      // ([^'"]*?)        - Match anything up to the variable
      // (var\(--[a-z-]+\)) - Match the variable
      // (\s*[,}\n])      - Match the trailing comma, brace, or newline
      // But only if there's no closing quote!
      
      const regex = new RegExp(`(['"])([^'"]*?${v.replace('(', '\\(').replace(')', '\\)')})(\\s*[,}\n])`, 'g');
      
      content = content.replace(regex, (match, openQuote, innerText, trailing) => {
        return `${openQuote}${innerText}${openQuote}${trailing}`;
      });
      
      // Also fix cases where the user tried to fix it but got `var(--border-color),`
      // e.g. border: '1px solid var(--border-color), borderRadius: 10
      // We can just find var(--border-color), and if it's inside a style object, replace it.
      const regex2 = new RegExp(`(${v.replace('(', '\\(').replace(')', '\\)')}),\\s*([a-zA-Z]+):`, 'g');
      content = content.replace(regex2, (match, variable, nextProp) => {
        return `${variable}', ${nextProp}:`;
      });
      
      // Fix var(--border-color) }
      const regex3 = new RegExp(`(${v.replace('(', '\\(').replace(')', '\\)')})\\s*}`, 'g');
      content = content.replace(regex3, (match, variable) => {
        // Only if missing quote before it
        return `${variable}' }`;
      });
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed ${filePath}`);
    }
  }
});
