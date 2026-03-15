import fs from 'fs';

const filePath = './ai_output_id_pdf_page_image_map.json';
const content = fs.readFileSync(filePath, 'utf8');

// 1. 先用正則表達式清理 JSON 字串中所有出現在引號內的「換行 + 空格」
// 針對 ID 部分進行修復
let fixedContent = content.replace(/"(spk-[0-9]+-[a-z0-9]+)\s+([a-z0-9]+)"/g, '"$1$2"');

// 針對 image_path 裡面的換行修復
fixedContent = fixedContent.replace(/\.png"\s*\n\s*/g, '.png"'); // 移除 png 後面的意外換行
fixedContent = fixedContent.replace(/([a-z0-9]+)\s+([a-z0-9]+)\.png/g, '$1$2.png'); // 移除檔名中間的空格

const data = JSON.parse(fixedContent);

const prefixToRemove = "Legislative Process of Transitional Justice in the Legislative Yuan/AI_output/";

function superCleanPath(p) {
    if (typeof p !== 'string') return p;
    // 移除所有換行和多餘空格
    let cleaned = p.replace(/[\n\r]/g, '').trim();
    if (cleaned.includes(prefixToRemove)) {
        cleaned = cleaned.split(prefixToRemove)[1];
    }
    if (cleaned.includes("mapped_page_images/")) {
        cleaned = cleaned.replace("mapped_page_images/", "");
    }
    // 再次確保空格轉底線，並移除所有可能的雙底線
    return cleaned.replace(/ /g, '_').replace(/__/g, '_');
}

// 重新生成映射表
const idImageMap = {};

// 修復 pages 陣列
if (data.pages && Array.isArray(data.pages)) {
    data.pages.forEach(page => {
        const img = superCleanPath(page.image_path);
        if (page.ids && Array.isArray(page.ids)) {
            page.ids = page.ids.map(id => id.replace(/[\s\n\r]/g, '')); // 清理 ID 內的換行
            page.ids.forEach(id => {
                idImageMap[id] = img;
            });
        }
    });
}

// 存入映射表
data.materialized_id_images = idImageMap;

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ 終極修復完成！已清除 JSON 內所有隱形的換行符號與 ID 壞點。');
