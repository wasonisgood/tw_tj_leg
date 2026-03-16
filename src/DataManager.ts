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
  id: string;
  speaker: string;
  date: string;
  seq: number;
  file_stem?: string;
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
  pdfs: PDFLink[];
}

export interface LawLegislationVersion {
  label: string;
  version_date: string;
  publication_date?: string;
  url?: string;
  is_current?: boolean;
}

export interface LawHistoryRevision {
  date: string;
  year?: number;
  month?: number;
  day?: number;
  action_type: string;
  content: string[];
  reason?: string[];
  revision_index?: number;
  is_current?: boolean;
}

export interface LawArticleHistory {
  article_no: string;
  total_revisions: number;
  revisions: LawHistoryRevision[];
}

export interface LawHistoryData {
  metadata: {
    law_name: string;
    law_id?: string;
    current_version_date?: string;
    total_articles?: number;
    total_revisions?: number;
    legislation_versions_count?: number;
    source_url?: string;
    filters_applied?: {
      filter_nth?: number;
    };
    target_date?: string;
  };
  legislation_versions?: LawLegislationVersion[];
  table_of_contents?: Array<{ part_id: string; article_no: string }>;
  current_text?: Array<{ part_id: string; article_no: string; content: string[] }>;
  article_history?: LawArticleHistory[];
}

export interface LYLegislatorTerm {
  時間: string;
  名單: Record<string, string>;
}

export type LYHistoryData = Record<string, LYLegislatorTerm>;

export class DataManager {
  private static idMapping: any = null;
  private static imageMap: any = null;
  private static imgbbMap: { [fileName: string]: string } = {};
  private static pdfList: YearPDFs[] = [];
  private static yearDataCache: { [year: string]: YearData } = {};
  private static lawHistoryCache: Record<string, LawHistoryData> = {};
  private static lyHistoryCache: LYHistoryData | null = null;
  private static lawHistoryLoaded = false;
  private static readonly lawHistoryFiles = [
    '二二八事件處理及賠償條例.json',
    '促進轉型正義條例.json',
    '公職人員年資併社團專職人員年資計發退離給與處理條例.json',
    '戒嚴時期人民受損權利回復條例.json',
    '戒嚴時期不當叛亂暨匪諜審判案件補償條例.json',
    '威權統治時期國家不法行為被害者權利回復條例.json',
    '政治檔案條例.json',
    '政黨及其附隨組織不當取得財產處理條例.json',
    '國家安全法_制定.json'
  ];

  private static getBasePath(): string {
    // 使用 window.location.pathname 來動態取得 base 路徑
    const pathname = window.location.pathname;
    if (pathname.includes('/tw_tj_leg/')) {
      return '/tw_tj_leg/';
    }
    return '/';
  }

  static async init() {
    if (!this.idMapping) {
      try {
        const resp = await fetch(`${this.getBasePath()}id_mapping.json`);
        if (resp.ok) {
          const data = await resp.json();
          // id_mapping.json 的結構中有 "by_id" 對象
          this.idMapping = data.by_id || data;
          console.log(`[DataManager.init] idMapping loaded, keys count:`, Object.keys(this.idMapping).length);
          console.log(`[DataManager.init] idMapping has spk-1987-e08e01c5e6c563b2:`, !!this.idMapping['spk-1987-e08e01c5e6c563b2']);
        } else {
          console.error("Failed to load id_mapping.json");
          this.idMapping = {};
        }
      } catch (e) {
        console.error("Error loading id_mapping.json:", e);
        this.idMapping = {};
      }
    }
    if (!this.imageMap) {
      try {
        const resp = await fetch(`${this.getBasePath()}ai_output_id_pdf_page_image_map.json`);
        if (resp.ok) {
          const data = await resp.json();
          // 如果有 by_id 結構則使用，否則使用整個響應
          this.imageMap = data.by_id || data;
          console.log(`[DataManager.init] imageMap loaded, keys count:`, Object.keys(this.imageMap).length);
          console.log(`[DataManager.init] imageMap has spk-1987-e08e01c5e6c563b2:`, !!this.imageMap['spk-1987-e08e01c5e6c563b2']);
        } else {
          console.error("Failed to load ai_output_id_pdf_page_image_map.json");
          this.imageMap = {};
        }
      } catch (e) {
        console.error("Error loading ai_output_id_pdf_page_image_map.json:", e);
        this.imageMap = {};
      }
    }
    // 載入 ImgBB 對應表 (如果存在)
    if (Object.keys(this.imgbbMap).length === 0) {
      try {
        const resp = await fetch(`${this.getBasePath()}imgbb_map.json`);
        if (resp.ok) {
          this.imgbbMap = await resp.json();
        } else {
          this.imgbbMap = {};
        }
      } catch (e) {
        this.imgbbMap = {}; 
      }
    }
    if (this.pdfList.length === 0) {
      try {
        const resp = await fetch(`${this.getBasePath()}PDF_List_Full.json`);
        this.pdfList = await resp.json();
      } catch (e) {
        console.error("Failed to load PDF_List_Full.json", e);
      }
    }
  }

  static getImageUrl(fileName: string): string {
    // 僅從 ImgBB 對應表中查找，移除本地備援邏輯
    return this.imgbbMap[fileName] || '';
  }

  // 從 file_stem 提取會議階段（包含日期以區分不同場次）
  static extractStage(fileStem: string): string {
    if (!fileStem) return '未知階段';
    
    // 根據 file_stem 結構化格式：法案名稱_修正狀態_日期_階段
    // 例如：國家安全法_制定_19870309_委員會審查
    const parts = fileStem.split('_');
    
    // 如果格式符合預期（至少有四部分），結合日期（index 2）與階段（index 3）
    // 這樣可以確保不同日期的「委員會審查」不會被混在一起
    if (parts.length >= 4) {
      return `${parts[2]}_${parts[3]}`;
    }
    
    // 如果不符合標準格式，則取最後兩部分或最後一部分
    if (parts.length >= 2) {
      return `${parts[parts.length - 2]}_${parts[parts.length - 1]}`;
    }
    
    return parts[parts.length - 1] || '一般會議';
  }

  // 從 file_stem 提取修正狀態和會議階段組合（例如：制定_委員會審查）
  static extractBillDetails(fileStem: string): string {
    if (!fileStem) return '未知';
    
    // file_stem 格式: 法案名稱_修正狀態_日期_階段
    // 例如: 國家安全法_制定_19870309_委員會審查
    const parts = fileStem.split('_');
    
    if (parts.length < 4) {
      // 如果格式不正確，就只返回最後一個部分
      return parts[parts.length - 1];
    }
    
    // 提取修正狀態（第2個部分）和階段（最後一個部分）
    const status = parts[1]; // 修正狀態（如：制定、第1次修正）
    const stage = parts[parts.length - 1]; // 階段（如：委員會審查）
    
    return `${status}_${stage}`;
  }

  // 從 file_stem 提取法案名稱（底線前的部分）
  static extractBillName(fileStem: string): string {
    if (!fileStem) return '未知法案';
    return fileStem.split('_')[0]; // 取第一個底線之前的部分
  }

  static getPDFLink(fileName: string): PDFLink | null {
    console.log(`[getPDFLink] Searching for: ${fileName}`);
    if (!this.pdfList || this.pdfList.length === 0) {
      console.log(`[getPDFLink] pdfList is empty`);
      return null;
    }

    // 標準化搜尋名稱：如果沒有 .pdf 則補上，方便比對
    const searchName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;

    for (const yearData of this.pdfList) {
      // PDF_List_Full.json 中使用 "pdfs" 或 "files"
      const files = yearData.pdfs || (yearData as any).files;
      if (!files || !Array.isArray(files)) continue;

      const found = files.find(p => {
        // 進行不區分大小寫且包含副檔名的比對
        const currentFileName = p.fileName || '';
        const currentFileLower = currentFileName.toLowerCase();
        const searchLower = searchName.toLowerCase();
        
        return currentFileLower === searchLower || 
               currentFileLower === fileName.toLowerCase() ||
               currentFileLower.replace('.pdf', '') === fileName.toLowerCase();
      });

      if (found) {
        console.log(`[getPDFLink] Found PDF match: ${found.fileName}`);
        return found;
      }
    }
    console.log(`[getPDFLink] No PDF found for ${fileName}`);
    return null;
  }

  static async getYearData(year: string): Promise<YearData | null> {
    if (this.yearDataCache[year]) return this.yearDataCache[year];
    try {
      const resp = await fetch(`${this.getBasePath()}${year}.json`); // 使用相對路徑
      if (!resp.ok) {
        console.error(`[getYearData] Failed to fetch ${year}.json, status: ${resp.status}`);
        return null;
      }
      const data = await resp.json();
      this.yearDataCache[year] = data;
      return data;
    } catch (e) {
      console.error(`[getYearData] Error loading ${year}.json:`, e);
      return null;
    }
  }

  static async getProcessedYearData(year: string): Promise<{ 
    speeches: ProcessedSpeech[], 
    sessionInfo?: SessionInfo,
    intelligence?: IntelligenceLayer 
  }> {
    await this.init();
    const rawData = await this.getYearData(year);
    const speeches: ProcessedSpeech[] = [];

    console.log(`[getProcessedYearData] Processing year: ${year}`);
    console.log(`[getProcessedYearData] rawData exists: ${!!rawData}`);
    console.log(`[getProcessedYearData] rawData.speakers_analysis exists: ${!!rawData?.speakers_analysis}`);
    console.log(`[getProcessedYearData] this.idMapping keys sample:`, Object.keys(this.idMapping).slice(0, 5));
    console.log(`[getProcessedYearData] this.imageMap keys sample:`, Object.keys(this.imageMap).slice(0, 5));

    if (!rawData || !rawData.speakers_analysis) {
      console.warn(`No speakers_analysis found for year ${year}`);
      return { speeches: [], sessionInfo: rawData?.session_info, intelligence: rawData?.intelligence_layer };
    }

    for (const [id, analysis] of Object.entries(rawData.speakers_analysis)) {
      // id 已經是完整的 ID（例如 "spk-1987-0d7e3ee6b90ef827"）
      // 保持使用完整的 ID，不要提取 cleanId，以避免在查詢時出現不匹配
      const meta = this.idMapping[id] as SpeechMetadata;
      console.log(`[getProcessedYearData] Processing ID: ${id}, meta exists: ${!!meta}`);
      
      let imagePaths: string[] = [];
      // imageMap 中的鍵是完整的 ID（例如 "spk-1987-0d7e3ee6b90ef827"）
      const imageData = this.imageMap[id] as { image_paths: string[] };
      if (imageData?.image_paths && Array.isArray(imageData.image_paths)) {
        imagePaths = imageData.image_paths.map(p => {
          // 從完整路徑提取文件名
          const parts = p.split('/');
          const fileName = parts[parts.length - 1];
          return fileName;
        });
      }
      
      // 如果沒有圖像，添加默認的文件名以供後續查詢
      if (imagePaths.length === 0) {
        // 從完整 ID 中提取 hash 部分用於文件名
        const hashPart = id.split('-').slice(2).join('-');
        imagePaths = [`spk-${hashPart}.png`];
      }

      // 使用 file_stem 作為 lawName（法案名稱），來自 id_mapping
      // 但只取底線前面的部分（實際法案名稱）
      const fullFileStem = meta?.file_stem || '';
      const lawName = this.extractBillName(fullFileStem);
      const stage = this.extractStage(fullFileStem); // 從 file_stem 提取包含日期的會議階段
      const speechDate = meta?.date || '';
      
      speeches.push({
        ...analysis,
        identity: analysis.identity,
        id: id, // 使用完整的 ID
        metadata: meta,
        imagePaths,
        lawName: lawName,
        stage: stage, // 使用提取的會議階段 (含日期)
        date: speechDate
      });
    }

    const sortedSpeeches = [...speeches].sort((a, b) => {
      const dateA = a.date || (a.metadata?.date || '');
      const dateB = b.date || (b.metadata?.date || '');
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      return (a.metadata?.seq || 0) - (b.metadata?.seq || 0);
    });

    return { 
      speeches: sortedSpeeches, 
      sessionInfo: rawData.session_info,
      intelligence: rawData.intelligence_layer
    };
  }

  static async loadLawHistoryData(): Promise<Record<string, LawHistoryData>> {
    if (this.lawHistoryLoaded) {
      return this.lawHistoryCache;
    }

    const basePath = this.getBasePath();
    const results = await Promise.all(
      this.lawHistoryFiles.map(async (fileName) => {
        try {
          const resp = await fetch(`${basePath}law_history/${encodeURIComponent(fileName)}`);
          if (!resp.ok) return null;
          const data = await resp.json() as LawHistoryData;
          const lawName = data?.metadata?.law_name;
          if (!lawName) return null;
          return { lawName, data };
        } catch (e) {
          console.warn(`[DataManager.loadLawHistoryData] skip ${fileName}:`, e);
          return null;
        }
      })
    );

    results.forEach((entry) => {
      if (!entry) return;
      this.lawHistoryCache[entry.lawName] = entry.data;
    });

    this.lawHistoryLoaded = true;
    return this.lawHistoryCache;
  }

  static async getLawHistoryByName(lawName: string): Promise<LawHistoryData | null> {
    const map = await this.loadLawHistoryData();

    if (map[lawName]) return map[lawName];

    const normalizeLawName = (input: string): string =>
      (input || '')
        .replace(/（.*?）|\(.*?\)/g, '')
        .replace(/草案/g, '')
        .replace(/_制定$/, '')
        .replace(/\s+/g, '')
        .trim();

    const aliasMap: Record<string, string> = {
      '228條例': '二二八事件處理及賠償條例',
      '不當審判條例': '戒嚴時期不當叛亂暨匪諜審判案件補償條例',
      '促轉條例': '促進轉型正義條例',
      '回復條例': '戒嚴時期人民受損權利回復條例',
      '威權時期回復條例': '威權統治時期國家不法行為被害者權利回復條例',
      '年資處理條例': '公職人員年資併社團專職人員年資計發退離給與處理條例',
      '黨產條例': '政黨及其附隨組織不當取得財產處理條例',
      '國家安全法': '國家安全法'
    };

    const normalized = normalizeLawName(lawName);
    const aliased = aliasMap[normalized] || normalized;
    if (map[aliased]) return map[aliased];

    const matchedKey = Object.keys(map).find((key) => {
      const nk = normalizeLawName(key);
      return nk === aliased || nk.includes(aliased) || aliased.includes(nk);
    });

    return matchedKey ? map[matchedKey] : null;
  }

  static async getAllLawHistory(): Promise<Record<string, LawHistoryData>> {
    return this.loadLawHistoryData();
  }

  static async loadLYHistoryData(): Promise<LYHistoryData> {
    if (this.lyHistoryCache) {
      return this.lyHistoryCache;
    }

    try {
      const resp = await fetch(`${this.getBasePath()}ly_history_data.json`);
      if (!resp.ok) {
        this.lyHistoryCache = {};
        return this.lyHistoryCache;
      }

      this.lyHistoryCache = await resp.json() as LYHistoryData;
      return this.lyHistoryCache;
    } catch (e) {
      console.warn('[DataManager.loadLYHistoryData] failed:', e);
      this.lyHistoryCache = {};
      return this.lyHistoryCache;
    }
  }

  static async getLYHistoryData(): Promise<LYHistoryData> {
    return this.loadLYHistoryData();
  }
}
