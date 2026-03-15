import fs from 'fs';

const filePath = './ai_output_id_pdf_page_image_map.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const prefixToRemove = "Legislative Process of Transitional Justice in the Legislative Yuan/AI_output/";

function fixPath(p) {
  if (typeof p !== 'string') return p;
  let newPath = p;
  if (p.includes(prefixToRemove)) {
    newPath = p.split(prefixToRemove)[1];
  } else if (p.includes("mapped_page_images/")) {
    newPath = p.substring(p.indexOf("mapped_page_images/"));
  }
  newPath = newPath.replace(/ /g, '_');
  if (newPath.includes("mapped_page_images/")) {
    newPath = newPath.replace("mapped_page_images/", "");
  }
  return newPath;
}

// 建立 ID 到圖片的映射表
const idImageMap = {};

if (data.pages && Array.isArray(data.pages)) {
  data.pages.forEach(page => {
    const fixedImgPath = fixPath(page.image_path);
    if (page.ids && Array.isArray(page.ids)) {
      page.ids.forEach(id => {
        idImageMap[id] = fixedImgPath;
      });
    }
  });
}

// 將產生的映射表存回 JSON
data.materialized_id_images = idImageMap;

// 同時修復 pages 裡面的路徑
if (data.pages && Array.isArray(data.pages)) {
  data.pages.forEach(page => {
    page.image_path = fixPath(page.image_path);
  });
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ 映射表已生成並存入 JSON！現在 DataManager 應該可以讀取到圖片了。');
