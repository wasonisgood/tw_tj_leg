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

function normalizePdfName(name) {
  if (!name) return '';
  const trimmed = String(name).trim();
  if (!trimmed) return '';
  return trimmed.toLowerCase().endsWith('.pdf') ? trimmed : `${trimmed}.pdf`;
}

function extractFileName(rawPath) {
  if (!rawPath) return '';
  const normalized = String(rawPath).replace(/\\/g, '/');
  const parts = normalized.split('/');
  return parts[parts.length - 1] || '';
}

function extractBillName(fileStem) {
  if (!fileStem) return '';
  return String(fileStem).split('_')[0] || '';
}

function extractStage(fileStem) {
  if (!fileStem) return '';
  const parts = String(fileStem).split('_');
  if (parts.length >= 4) return `${parts[2]}_${parts[3]}`;
  if (parts.length >= 2) return `${parts[parts.length - 2]}_${parts[parts.length - 1]}`;
  return parts[parts.length - 1] || '';
}

function buildPdfLookup(pdfList) {
  const lookup = {};
  for (const yearData of pdfList || []) {
    const files = yearData?.pdfs || yearData?.files || [];
    for (const item of files) {
      const fileName = item?.fileName || '';
      if (!fileName) continue;
      const normalized = normalizePdfName(fileName);
      lookup[normalized] = {
        fileName,
        previewLink: item?.previewLink || '',
        downloadLink: item?.downloadLink || ''
      };
      const stem = normalized.replace(/\.pdf$/i, '');
      if (stem && !lookup[stem]) {
        lookup[stem] = lookup[normalized];
      }
    }
  }
  return lookup;
}

function main() {
  const root = process.cwd();
  const dataDir = path.join(root, 'public', 'data');

  const idMappingRaw = readJson(path.join(dataDir, 'id_mapping.json'));
  const imageMapRaw = readJson(path.join(dataDir, 'ai_output_id_pdf_page_image_map.json'));
  const imgbbMap = readJson(path.join(dataDir, 'imgbb_map.json'));
  const pdfList = readJson(path.join(dataDir, 'PDF_List_Full.json'));

  const idMapping = idMappingRaw?.by_id || idMappingRaw || {};
  const imageMap = imageMapRaw?.by_id || imageMapRaw || {};
  const pdfLookup = buildPdfLookup(pdfList);

  const yearFiles = fs
    .readdirSync(dataDir)
    .filter((name) => /^\d{4}\.json$/.test(name))
    .sort();

  const byId = {};
  const byYear = {};

  const report = {
    generated_at: new Date().toISOString(),
    years: yearFiles.map((name) => name.replace('.json', '')),
    total_year_files: yearFiles.length,
    total_speeches: 0,
    missing_metadata: 0,
    missing_image_map: 0,
    missing_image_url: 0,
    missing_pdf: 0,
    unresolved_ids: []
  };

  for (const yearFile of yearFiles) {
    const year = yearFile.replace('.json', '');
    const yearData = readJson(path.join(dataDir, yearFile));
    const speakers = yearData?.speakers_analysis || {};
    byYear[year] = [];

    for (const [id, analysis] of Object.entries(speakers)) {
      report.total_speeches += 1;

      const baseId = id.replace(/_\d+$/, '');
      const meta = idMapping[id] || idMapping[baseId] || null;
      const imageData = imageMap[id] || imageMap[baseId] || null;

      if (!meta) report.missing_metadata += 1;
      if (!imageData) report.missing_image_map += 1;

      const imagePaths = Array.isArray(imageData?.image_paths) ? imageData.image_paths : [];
      const imageFiles = imagePaths.map(extractFileName).filter(Boolean);
      const imageUrls = imageFiles
        .map((fileName) => imgbbMap[fileName] || '')
        .filter(Boolean);

      if (imageFiles.length > 0 && imageUrls.length === 0) {
        report.missing_image_url += 1;
      }

      const fileStem = meta?.file_stem || '';
      const pdfEntry = fileStem ? (pdfLookup[normalizePdfName(fileStem)] || pdfLookup[fileStem] || null) : null;
      if (!pdfEntry) report.missing_pdf += 1;

      const record = {
        id,
        year,
        speaker: analysis?.speaker || '',
        date: meta?.date || '',
        seq: Number(meta?.seq || 0),
        file_stem: fileStem,
        law_name: extractBillName(fileStem),
        stage: extractStage(fileStem),
        image_urls: imageUrls,
        pdf_file_name: pdfEntry?.fileName || '',
        pdf_preview_link: pdfEntry?.previewLink || '',
        pdf_download_link: pdfEntry?.downloadLink || '',
        source_flags: {
          has_metadata: !!meta,
          has_image_map: !!imageData,
          has_image_urls: imageUrls.length > 0,
          has_pdf_links: !!pdfEntry
        }
      };

      byId[id] = record;
      byYear[year].push(id);

      if (!meta || (!imageData && imageUrls.length === 0)) {
        report.unresolved_ids.push(id);
      }
    }
  }

  const unified = {
    generated_at: report.generated_at,
    total_records: Object.keys(byId).length,
    by_id: byId,
    by_year: byYear
  };

  const unifiedPath = path.join(dataDir, 'unified_speech_map.json');
  fs.writeFileSync(unifiedPath, `${JSON.stringify(unified)}\n`, 'utf8');

  const reportPath = path.join(root, 'unified_speech_map_report.json');
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`[build_unified_speech_map] wrote ${unifiedPath}`);
  console.log(`[build_unified_speech_map] wrote ${reportPath}`);
  console.log(`[build_unified_speech_map] total_records=${unified.total_records}`);
  console.log(`[build_unified_speech_map] missing_metadata=${report.missing_metadata}, missing_image_map=${report.missing_image_map}, missing_pdf=${report.missing_pdf}`);
}

main();
