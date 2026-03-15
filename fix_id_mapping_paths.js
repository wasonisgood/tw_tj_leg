import fs from 'fs';

const filePath = './id_mapping.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const prefixToRemove = "Legislative Process of Transitional Justice in the Legislative Yuan/AI_output/mapped_page_images/";

function cleanPath(p) {
    if (typeof p !== 'string') return p;
    let newPath = p;
    // 移除長路徑
    if (p.includes(prefixToRemove)) {
        newPath = p.replace(prefixToRemove, "");
    } else if (p.includes("mapped_page_images/")) {
        newPath = p.split("mapped_page_images/")[1];
    }
    // 空格轉底線
    return newPath.replace(/ /g, '_');
}

// 遍歷 id_mapping.json 的結構 (by_id 物件)
if (data.by_id) {
    for (const id in data.by_id) {
        const entry = data.by_id[id];
        if (entry.image_paths && Array.isArray(entry.image_paths)) {
            entry.image_paths = entry.image_paths.map(p => cleanPath(p));
        }
    }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ id_mapping.json 路徑修復完成！所有長路徑已簡化為純檔名，空格已轉為底線。');
