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

export class DataManager {
  private static idMapping: any = null;
  private static imageMap: any = null;
  private static imgbbMap: { [fileName: string]: string } = {};
  private static pdfList: YearPDFs[] = [];
  private static yearDataCache: { [year: string]: YearData } = {};

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
          this.idMapping = await resp.json();
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
          this.imageMap = await resp.json();
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

  static getPDFLink(fileName: string): PDFLink | null {
    if (!this.pdfList) return null;
    for (const yearData of this.pdfList) {
      const found = yearData.pdfs.find(p => p.fileName === fileName);
      if (found) return found;
    }
    return null;
  }

  static async getYearData(year: string): Promise<YearData | null> {
    if (this.yearDataCache[year]) return this.yearDataCache[year];
    try {
      const resp = await fetch(`${this.getBasePath()}${year}.json`); // 使用相對路徑
      const data = await resp.json();
      this.yearDataCache[year] = data;
      return data;
    } catch (e) {
      return null;
    }
  }

  private static parseId(id: string) {
    const parts = id.split('_');
    return {
      lawName: parts[0] || '未知法案',
      action: parts[1] || '',
      date: parts[2] || '',
      stage: parts[3] || '一般會議'
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
      const cleanId = id.replace('spk-', '');
      const meta = this.idMapping[cleanId] as SpeechMetadata;
      
      let imagePaths: string[] = [];
      if (this.imageMap[cleanId]) {
        const paths = this.imageMap[cleanId] as string[];
        imagePaths = paths.map(p => {
          const parts = p.split('/');
          return parts[parts.length - 1];
        });
      }
      
      if (imagePaths.length === 0) {
        imagePaths = [`${cleanId}.png`];
      }

      const info = this.parseId(cleanId);
      
      speeches.push({
        ...analysis,
        identity: analysis.identity,
        id: cleanId,
        metadata: meta,
        imagePaths,
        lawName: info.lawName,
        stage: info.stage,
        date: info.date
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
}
