import fs from 'fs';

const filePath = './ai_output_id_pdf_page_image_map.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 定義要移除的冗餘前綴（包含空格的版本）
const prefixToRemove = "Legislative Process of Transitional Justice in the Legislative Yuan/AI_output/";

function fixPath(p) {
  if (typeof p !== 'string') return p;
  
  // 1. 移除冗餘前綴
  let newPath = p;
  if (p.includes(prefixToRemove)) {
    newPath = p.split(prefixToRemove)[1];
  } else if (p.includes("mapped_page_images/")) {
    // 如果已經是相對路徑，確保只留下 mapped_page_images 之後的部分或保持相對
    newPath = p.substring(p.indexOf("mapped_page_images/"));
  }

  // 2. 將空格改為底線
  newPath = newPath.replace(/ /g, '_');

  // 3. 由於前端 SpeechDetail.tsx 會自己加上 /mapped_page_images/
  // 我們在這裡只保留檔案名稱，讓對應更乾淨
  if (newPath.includes("mapped_page_images/")) {
    newPath = newPath.replace("mapped_page_images/", "");
  }

  return newPath;
}

// 修復 sources 列表中的路徑
if (data.sources && Array.isArray(data.sources)) {
  data.sources.forEach(source => {
    if (source.image_path) source.image_path = fixPath(source.image_path);
  });
}

// 如果有單獨的映射表，也進行修復
if (data.materialized_id_images && typeof data.materialized_id_images === 'object') {
  const newMap = {};
  for (const [id, path] of Object.entries(data.materialized_id_images)) {
    newMap[id] = fixPath(path);
  }
  data.materialized_id_images = newMap;
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ JSON 路徑修復完成！所有空格已轉為底線，且路徑已簡化為相對檔名。');
