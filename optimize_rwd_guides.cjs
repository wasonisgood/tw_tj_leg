const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/wason/Documents/code/law_pdf_view/Legislative_Process_of_Transitional_Justice_in_the_Legislative_Yuan/AI_output/src/components/year-guides';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  { from: /text-\[15vw\]/g, to: 'text-[20vw] md:text-[15vw]' },
  { from: /text-\[12vw\]/g, to: 'text-[15vw] md:text-[12vw]' },
  { from: /text-\[10vw\]/g, to: 'text-[12vw] md:text-[10vw]' },
  { from: /text-9xl/g, to: 'text-5xl md:text-9xl' },
  { from: /text-8xl/g, to: 'text-4xl md:text-8xl' },
  { from: /text-7xl/g, to: 'text-4xl md:text-7xl' },
  { from: /text-6xl/g, to: 'text-3xl md:text-6xl' },
  { from: /text-5xl/g, to: 'text-2xl md:text-5xl' },
  { from: /\bp-20\b/g, to: 'p-6 md:p-20' },
  { from: /\bp-16\b/g, to: 'p-6 md:p-16' },
  { from: /\bp-12\b/g, to: 'p-6 md:p-12' },
  { from: /\bgap-20\b/g, to: 'gap-8 md:gap-20' },
  { from: /\bpt-32\b/g, to: 'pt-12 md:pt-32' },
  { from: /\bpl-12\b/g, to: 'pl-6 md:pl-12' },
  { from: /-top-20/g, to: '-top-10 md:-top-20' },
  { from: /-left-10/g, to: '-left-4 md:-left-10' },
  { from: /border-l-\[24px\]/g, to: 'border-l-[12px] md:border-l-[24px]' },
  { from: /border-l-\[16px\]/g, to: 'border-l-[8px] md:border-l-[16px]' },
  { from: /"grid grid-cols-1 md:grid-cols-12 gap-0/g, to: '"grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0' }, // ensure gap is explicitly handled if needed
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  replacements.forEach(r => {
    if (r.from.test(content)) {
      content = content.replace(r.from, r.to);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Optimized ' + file);
  }
});
