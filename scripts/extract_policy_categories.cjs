const fs = require('fs');
const path = require('path');
const vm = require('vm');

const YEARS = [
  '1987', '1992', '1993', '1994', '1995', '1997', '1998', '1999', '2000', '2001',
  '2002', '2003', '2006', '2009', '2013', '2016', '2017', '2019', '2022', '2023', '2024'
];

function parseLooseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    // Some source files are JSON-like but not strict JSON.
    return vm.runInNewContext(`(${text})`);
  }
}

function extractUniqueOrientations() {
  const unique = new Set();
  const perYearCounts = {};

  for (const year of YEARS) {
    const filePath = path.join(process.cwd(), 'public', `${year}.json`);
    if (!fs.existsSync(filePath)) continue;

    const raw = fs.readFileSync(filePath, 'utf8');
    const data = parseLooseJson(raw);
    const speakers = data?.speakers_analysis || {};

    perYearCounts[year] = 0;
    for (const speaker of Object.values(speakers)) {
      const orientation = (speaker?.political_orientation || '').trim();
      if (!orientation) continue;
      unique.add(orientation);
      perYearCounts[year] += 1;
    }
  }

  const uniqueList = [...unique].sort((a, b) => a.localeCompare(b, 'zh-Hant'));

  const outputPath = path.join(process.cwd(), 'policy_orientation_unique.json');
  fs.writeFileSync(outputPath, `${JSON.stringify(uniqueList, null, 2)}\n`, 'utf8');

  console.log(`Unique orientations: ${uniqueList.length}`);
  console.log('Per-year orientation records:', perYearCounts);
  console.log(`Written: ${outputPath}`);
}

extractUniqueOrientations();
