const fs = require('fs');
const path = require('path');

const colorMap = {
  '#091A2F': 'var(--bg-app)',
  '#081728': 'var(--bg-app)',
  '#0a1628': 'var(--bg-sidebar)',
  '#0B1F34': 'var(--bg-sidebar)',
  '#0E2740': 'var(--bg-card)',
  '#122A42': 'var(--bg-card)',
  '#0D2137': 'var(--bg-input)',
  '#1A3A5A': 'var(--border-color)',
  '#163654': 'var(--border-color)',
  '#1E4C72': 'var(--border-color)',
  '#fff': 'var(--text-primary)',
  '#ffffff': 'var(--text-primary)',
  '#FFFFFF': 'var(--text-primary)',
  '#F7FAFC': 'var(--text-primary)',
  'white': 'var(--text-primary)',
  '#A0B0C4': 'var(--text-secondary)',
  '#64748b': 'var(--text-secondary)',
  '#88A0BA': 'var(--text-secondary)',
  '#7892AE': 'var(--text-secondary)',
  '#A7BAD1': 'var(--text-secondary)',
  '#FFC107': 'var(--accent-color)',
  '#f5c400': 'var(--accent-color)',
  '#F9D341': 'var(--accent-color)',
  '#f87171': 'var(--danger-color)',
  '#ef4444': 'var(--danger-color)',
  '#4ade80': 'var(--success-color)',
  '#2A1A0A': 'var(--badge-bg)',
  '#2A1F0F': 'var(--badge-bg)',
  '#1A1010': 'var(--danger-bg)',
  '#3A1010': 'var(--danger-border)',
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('c:/Users/USER/Upeksha0721-it3030-paf-2026-smart-campus-group_WE_315_2.2/frontend/src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const [hex, cssVar] of Object.entries(colorMap)) {
      // Create a regex to match the hex color case insensitively
      // Use word boundaries or quotes to avoid partial matches
      const regex = new RegExp(`['"]?${hex}['"]?`, 'gi');
      
      content = content.replace(regex, (match) => {
        // If it's matching 'white' make sure it's surrounded by quotes to not replace English words
        if (hex === 'white' && !match.match(/['"]white['"]/i)) {
          return match;
        }
        
        // We always wrap the cssVar in quotes because inline styles require it.
        // Wait, if it's inside a template literal or string like `1px solid #fff`, we shouldn't add extra quotes!
        // If the match starts with a quote, it's safe to output a quoted string: `'var(--x)'`
        // If the match does NOT start with a quote, it means it's inside an existing string: e.g. `'1px solid #fff'`
        
        if (match.startsWith("'") || match.startsWith('"')) {
          return `'${cssVar}'`;
        } else {
          return cssVar;
        }
      });
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
