const fs = require('fs');
const path = require('path');
const vm = require('vm');

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  try {
    return JSON.parse(raw);
  } catch {
    return vm.runInNewContext(`(${raw})`);
  }
}

function main() {
  const root = process.cwd();
  const dataDir = path.join(root, 'public', 'data');

  const unifiedPath = path.join(dataDir, 'unified_speech_map.json');
  if (!fs.existsSync(unifiedPath)) {
    throw new Error(`Missing ${unifiedPath}. Run build:unified-map first.`);
  }

  const unified = readJson(unifiedPath);
  const byId = unified?.by_id || {};
  const idKeys = new Set(Object.keys(byId));

  const imgbbMap = readJson(path.join(dataDir, 'imgbb_map.json'));
  const imgbbUrlSet = new Set(Object.values(imgbbMap));

  const yearFiles = fs
    .readdirSync(dataDir)
    .filter((name) => /^\d{4}\.json$/.test(name))
    .sort();

  const result = {
    checked_at: new Date().toISOString(),
    total_year_files: yearFiles.length,
    total_speech_ids: 0,
    missing_in_unified: [],
    missing_image_url_entries: [],
    records_without_pdf: [],
    ok: true
  };

  for (const yearFile of yearFiles) {
    const yearData = readJson(path.join(dataDir, yearFile));
    const speakers = yearData?.speakers_analysis || {};

    for (const id of Object.keys(speakers)) {
      result.total_speech_ids += 1;
      if (!idKeys.has(id)) {
        result.missing_in_unified.push(id);
        continue;
      }

      const record = byId[id] || {};
      const imageUrls = Array.isArray(record.image_urls) ? record.image_urls : [];
      for (const imageUrl of imageUrls) {
        const normalized = typeof imageUrl === 'string' ? imageUrl.trim() : '';
        if (!normalized || !imgbbUrlSet.has(normalized)) {
          result.missing_image_url_entries.push({ id, imageUrl: normalized });
        }
      }

      if (!record.pdf_preview_link || !record.pdf_download_link) {
        result.records_without_pdf.push(id);
      }
    }
  }

  if (result.missing_in_unified.length > 0 || result.missing_image_url_entries.length > 0) {
    result.ok = false;
  }

  const outputPath = path.join(root, 'unified_speech_map_validation.json');
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

  console.log(`[validate_unified_speech_map] wrote ${outputPath}`);
  console.log(`[validate_unified_speech_map] total_speech_ids=${result.total_speech_ids}`);
  console.log(`[validate_unified_speech_map] missing_in_unified=${result.missing_in_unified.length}`);
  console.log(`[validate_unified_speech_map] missing_image_url_entries=${result.missing_image_url_entries.length}`);
  console.log(`[validate_unified_speech_map] records_without_pdf=${result.records_without_pdf.length}`);

  if (!result.ok) {
    process.exitCode = 1;
  }
}

main();
