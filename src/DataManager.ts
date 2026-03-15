export interface Stance {
  topic: string;
  position: string;
  note: string;
}

export interface SpeakerAnalysis {
  speaker: string;
  identity: string;
  political_orientation: string;
  discourse_logic: string;
  stances: Stance[];
  key_action?: string;
}

export interface SessionInfo {
  year: string;
  meeting_type: string;
  analyzed_topics: string[];
}

export interface IntelligenceLayer {
  summary_for_ai_voice?: string;
  frontend_action_required?: string;
}

export interface YearData {
  session_info: SessionInfo;
  intelligence_layer?: IntelligenceLayer;
  speakers_analysis: { [id: string]: SpeakerAnalysis };
}

export interface SpeechMetadata {
  year: string;
  file_stem: string;
  date: string;
  seq: number;
  page_start: number;
  page_end: number;
  pages: number[];
}

export interface ProcessedSpeech extends SpeakerAnalysis {
  id: string;
  metadata?: SpeechMetadata;
  imagePaths?: string[];
  lawName: string;
  stage: string;
  date: string;
}

export interface PDFLink {
  fileName: string;
  previewLink: string;
  downloadLink: string;
}

export interface YearPDFs {
  year: string;
  files: PDFLink[];
}

export class DataManager {
  private static idMapping: any = null;
  private static imageMap: any = null;
  private static imgbbMap: { [fileName: string]: string } = {};
  private static pdfList: YearPDFs[] = [];
  private static yearDataCache: { [year: string]: YearData } = {};

  static async init() {
    if (!this.idMapping) {
      const resp = await fetch('/id_mapping.json');
      this.idMapping = await resp.json();
    }
    if (!this.imageMap) {
      const resp = await fetch('/ai_output_id_pdf_page_image_map.json');
      this.imageMap = await resp.json();
    }
    // 載入 ImgBB 對應表 (如果存在)
    if (Object.keys(this.imgbbMap).length === 0) {
      try {
        const resp = await fetch('/imgbb_map.json');
        if (resp.ok) {
          this.imgbbMap = await resp.json();
        } else {
          // 檔案不存在時給予空物件，避免重複 fetch
          this.imgbbMap = {};
        }
      } catch (e) {
        this.imgbbMap = {}; // 靜默處理錯誤
      }
    }
    if (this.pdfList.length === 0) {
      try {
        const resp = await fetch('/PDF_List_Full.json');
        this.pdfList = await resp.json();
      } catch (e) {
        console.error("Failed to load PDF_List_Full.json", e);
      }
    }
  }

  static getImageUrl(fileName: string): string {
    // 優先從 ImgBB 對應表中查找
    if (this.imgbbMap && this.imgbbMap[fileName]) {
      return this.imgbbMap[fileName];
    }
    // 若無則使用本地路徑
    return `/mapped_page_images/${fileName}`;
  }

  static getPDFLink(fileName: string): PDFLink | null {
    for (const yearData of this.pdfList) {
      const found = yearData.files.find(f => f.fileName === fileName || f.fileName === fileName + '.pdf');
      if (found) return found;
    }
    return null;
  }

  static async getYearData(year: string): Promise<YearData> {
    if (this.yearDataCache[year]) return this.yearDataCache[year];
    const resp = await fetch(`/${year}.json`);
    const data = await resp.json();
    this.yearDataCache[year] = data;
    return data;
  }

  static parseFileStem(stem: string) {
    // 解析法案名稱與具體階段 (例如: 委員會審查、二讀、三讀)
    const parts = stem.split('_');
    return {
      lawName: parts[0] || '未知法案',
      action: parts[1] || '',
      date: parts[2] || '',
      stage: parts[3] || '一般會議'
    };
  }

  static async getGlobalStats() {
    await this.init();
    const allIds = Object.keys(this.idMapping.by_id);
    const years = new Set(allIds.map(id => id.split('-')[1]));
    const laws = new Set(Object.values(this.idMapping.by_id).map((m: any) => m.file_stem.split('_')[0]));
    
    return {
      totalSpeakers: allIds.length,
      totalYears: years.size,
      totalLaws: laws.size,
      timespan: "1987 — 2024"
    };
  }

  static async getProcessedYearData(year: string): Promise<{ 
    speeches: ProcessedSpeech[], 
    sessionInfo?: SessionInfo,
    intelligence?: IntelligenceLayer 
  }> {
    await this.init();
    const rawData = await this.getYearData(year);
    const speeches: ProcessedSpeech[] = [];

    if (!rawData || !rawData.speakers_analysis) {
      console.warn(`No speakers_analysis found for year ${year}`);
      return { speeches: [], sessionInfo: rawData?.session_info, intelligence: rawData?.intelligence_layer };
    }

    for (const [id, analysis] of Object.entries(rawData.speakers_analysis)) {
      const meta = this.idMapping.by_id[id];
      const { lawName, stage } = meta ? this.parseFileStem(meta.file_stem) : { lawName: '未知', stage: '未知' };
      
      const cleanId = id.trim().replace(/[\n\r\s]/g, '');
      
      // 改從 imageMap.by_id 獲取 image_paths 陣列
      let imagePaths: string[] = [];
      const imageMapEntry = this.imageMap.by_id?.[cleanId];
      
      if (imageMapEntry && imageMapEntry.image_paths && Array.isArray(imageMapEntry.image_paths)) {
        imagePaths = imageMapEntry.image_paths.map((p: string) => {
          // 提取檔名
          const parts = p.split('/');
          return parts[parts.length - 1];
        });
      }
      
      if (imagePaths.length === 0) {
        // 如果找不到，嘗試回退到 ID.png
        imagePaths = [`${cleanId}.png`];
      }

      // 修正身分標籤邏輯: 如果是政府官員，我們在過濾時可以歸類，但顯示時應保留原始職稱
      let displayIdentity = analysis.identity;
      
      speeches.push({
        ...analysis,
        identity: displayIdentity, // 保留原始職稱 (如：內政部長、政務次長等)
        id: cleanId,
        metadata: meta,
        imagePaths: imagePaths,
        lawName,
        stage, // 這裡存儲具體階段
        date: meta?.date || '未知日期'
      });
    }

    const sortedSpeeches = speeches.sort((a, b) => {
      const dateA = a.metadata?.date || '0';
      const dateB = b.metadata?.date || '0';
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      return (a.metadata?.seq || 0) - (b.metadata?.seq || 0);
    });

    return { 
      speeches: sortedSpeeches, 
      sessionInfo: rawData.session_info,
      intelligence: rawData.intelligence_layer
    };
  }
}
