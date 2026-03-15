const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp'); // 請確保已安裝: npm install sharp

// API Key 來自您的要求
const API_KEY = 'd433cff852f523dc27963d505ba6c413';
const IMAGE_DIR = path.join(__dirname, 'mapped_page_images');
const MAP_FILE = path.join(__dirname, 'imgbb_map.json');
const MAX_SIZE_MB = 31; // ImgBB 限制 32MB，我們設 31MB 比較保險
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// 確保目錄存在
if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`Error: Directory not found: ${IMAGE_DIR}`);
    process.exit(1);
}

// 初始化或讀取現有的對應表
let urlMap = {};
if (fs.existsSync(MAP_FILE)) {
    try {
        urlMap = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
    } catch (e) {
        console.error("Error parsing existing map file, starting fresh.");
    }
}

async function getProcessedImage(filePath) {
    const stats = fs.statSync(filePath);
    let imageBuffer = fs.readFileSync(filePath);
    
    if (stats.size > MAX_SIZE_BYTES) {
        console.log(`[RESIZE] File is too large (${(stats.size / 1024 / 1024).toFixed(2)} MB). Compressing...`);
        
        // 初始壓縮參數
        let quality = 80;
        let compressedBuffer = await sharp(imageBuffer)
            .jpeg({ quality: quality, force: false })
            .toBuffer();

        // 如果還是太大，持續降低品質
        while (compressedBuffer.length > MAX_SIZE_BYTES && quality > 10) {
            quality -= 10;
            compressedBuffer = await sharp(imageBuffer)
                .jpeg({ quality: quality, force: false })
                .toBuffer();
            console.log(`[RESIZE] Reducing quality to ${quality}... New size: ${(compressedBuffer.length / 1024 / 1024).toFixed(2)} MB`);
        }

        return compressedBuffer;
    }
    
    return imageBuffer;
}

async function uploadImage(fileName) {
    const filePath = path.join(IMAGE_DIR, fileName);
    
    try {
        const imageContent = await getProcessedImage(filePath);
        const form = new FormData();
        // 如果是 Buffer，需要指定檔名
        form.append('image', imageContent, { filename: fileName });

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 120000 // 壓縮檔案可能較大，增加到 120 秒超時
        });

        if (response.data && response.data.data && response.data.data.url) {
            return response.data.data.url;
        }
    } catch (error) {
        if (error.response) {
            console.error(`[FAILED] ${fileName}: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`[FAILED] ${fileName}: ${error.message}`);
        }
        return null;
    }
}

async function startBatchUpload() {
    const files = fs.readdirSync(IMAGE_DIR).filter(f => 
        f.toLowerCase().endsWith('.png') || 
        f.toLowerCase().endsWith('.jpg') || 
        f.toLowerCase().endsWith('.jpeg')
    );
    
    console.log(`Found ${files.length} images in ${IMAGE_DIR}`);
    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 跳過已上傳過的
        if (urlMap[file]) {
            skipCount++;
            continue;
        }

        console.log(`[${i + 1}/${files.length}] Processing: ${file}...`);
        const remoteUrl = await uploadImage(file);

        if (remoteUrl) {
            urlMap[file] = remoteUrl;
            // 每次成功就寫入一次文件，確保進度即時保存
            fs.writeFileSync(MAP_FILE, JSON.stringify(urlMap, null, 2));
            console.log(`[SUCCESS] ${file} -> ${remoteUrl}`);
            successCount++;
        }

        // 稍微延遲避免觸發 API 頻率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n--- Upload Task Summary ---');
    console.log(`Total Files: ${files.length}`);
    console.log(`New Uploads: ${successCount}`);
    console.log(`Skipped (already exist): ${skipCount}`);
    console.log(`Map saved to: ${MAP_FILE}`);
}

startBatchUpload();
