const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/wason/Documents/code/law_pdf_view/Legislative_Process_of_Transitional_Justice_in_the_Legislative_Yuan/AI_output/src/components/year-guides';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const patterns = [
  /<p className="text-xl serif text-gray-(?:600|400) leading-relaxed[^"]*">\s*「(應設計一個|設計一個|高亮顯示|應高亮顯示).*?」\s*<\/p>/gs,
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  patterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Cleaned ' + file);
  }
});
