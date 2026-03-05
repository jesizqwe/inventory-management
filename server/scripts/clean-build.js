const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const files = fs.readdirSync(rootDir);

files.forEach(file => {
  if (file.endsWith('.tsbuildinfo')) {
    try {
      fs.unlinkSync(path.join(rootDir, file));
      console.log(`Deleted: ${file}`);
    } catch (e) {
      // Ignore if file doesn't exist or can't be deleted
    }
  }
});
