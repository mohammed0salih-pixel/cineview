const fs = require('fs');
const content = fs.readFileSync('app/assistant/page.tsx', 'utf8');

// The issue is on lines 294-295 with extra closing divs
const lines = content.split('\n');

// Remove the two extra </div> tags at lines 293 and 294 (0-indexed as 292, 293)
// They appear after the closing )} of the conditional
const fixed = lines
  .map((line, i) => {
    // Lines 293-294 (0-indexed) have extra </div> that shouldn't be there
    if (i === 293 || i === 294) {
      if (line.trim() === '</div>') {
        return ''; // Remove these lines
      }
    }
    return line;
  })
  .join('\n');

fs.writeFileSync('app/assistant/page.tsx', fixed);
if (process.env.NODE_ENV !== 'production') {
  console.info('Fixed extra closing divs');
}
