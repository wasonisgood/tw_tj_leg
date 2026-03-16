"""
立法院法律系統 - 法規完整歷史爬蟲  v2.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【單筆模式】
  python lis_crawler.py "二二八事件處理及賠償條例"
  python lis_crawler.py "刑法" -o penal_code.json

【批次模式 - 外部 JSON】
  python lis_crawler.py --batch laws.json
  laws.json 格式：["刑法", "民法"] 或 [{"name":"刑法"}, {"name":"民法"}]

【過濾條件（可組合）】
  --filter-date  2007-03-08          只要該日期的版本（西元 YYYY-MM-DD）
  --filter-nth   3                   只要第 N 次修正（制定算第1次）
  --filter-current                   只要現行（最後一個）版本
  --filter-articles 第一條 第二條    只要指定條文

【模式】
  --simple   只輸出條文內容，不含修正理由和技術欄位

【其他】
  -v / --verbose    顯示 DEBUG log
  -o / --output     指定輸出檔名
  --delay 1.5       請求間隔秒數（預設 1.2）
  --workers 3       批次並行數（預設 3，最大 5）
"""

import sys
import re
import json
import time
import argparse
import logging
import concurrent.futures
from copy import deepcopy
from pathlib import Path
from datetime import datetime

import urllib3
import requests
from bs4 import BeautifulSoup

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ══════════════════════════════════════════════
# 設定
# ══════════════════════════════════════════════

BASE_URL      = "https://lis.ly.gov.tw"
HOME_URL      = f"{BASE_URL}/lglawc/lglawkm"
SEARCH_PATH   = "/lglawc/lglawkm"
LAW_PATH      = "/lglawc/lawsingle"
REQUEST_DELAY = 1.2

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
log = logging.getLogger(__name__)


# ══════════════════════════════════════════════
# 工具函式
# ══════════════════════════════════════════════

def clean(text: str) -> str:
    if not text:
        return ""
    return re.sub(r"[ \t]+", " ", text.replace("\xa0", " ")).strip()


def parse_roc_date(raw: str) -> dict | None:
    """
    解析民國或西元日期，統一輸出西元格式。
    支援：
      - 7碼民國：0840323  → 1995-03-23
      - 中文民國：中華民國84年3月23日
      - 西元：20070308 / 2007-03-08
    回傳 { date, year, month, day } 或 None
    """
    s = re.sub(r"[\s　]", "", raw)

    # 7碼民國：0840323
    m = re.match(r"^(\d{3})(\d{2})(\d{2})$", s)
    if m:
        yr, mo, dy = int(m.group(1)) + 1911, int(m.group(2)), int(m.group(3))
        return {"date": f"{yr:04d}-{mo:02d}-{dy:02d}", "year": yr, "month": mo, "day": dy}

    # 中文民國：...84年3月23日 或 民國84年3月23日
    m = re.search(r"(\d+)年(\d+)月(\d+)日", s)
    if m:
        raw_yr = int(m.group(1))
        yr = raw_yr + 1911 if raw_yr < 1000 else raw_yr
        mo, dy = int(m.group(2)), int(m.group(3))
        return {"date": f"{yr:04d}-{mo:02d}-{dy:02d}", "year": yr, "month": mo, "day": dy}

    # 西元數字：20070308 or 2007-03-08
    s2 = s.replace("-", "")
    m = re.match(r"^(\d{4})(\d{2})(\d{2})$", s2)
    if m:
        yr, mo, dy = int(m.group(1)), int(m.group(2)), int(m.group(3))
        return {"date": f"{yr:04d}-{mo:02d}-{dy:02d}", "year": yr, "month": mo, "day": dy}

    return None


def multiline(td) -> list[str]:
    for br in td.find_all("br"):
        br.replace_with("\n")
    return [clean(l) for l in td.get_text().split("\n") if clean(l)]


def normalize_art(s: str) -> str:
    """統一條文號格式供比對（去空白）。"""
    return re.sub(r"\s+", "", s.strip())


# ══════════════════════════════════════════════
# HTTP Session
# ══════════════════════════════════════════════

class LISSession:
    def __init__(self, delay: float = REQUEST_DELAY):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self._last_req = 0.0
        self.delay = delay

    def _throttle(self):
        elapsed = time.time() - self._last_req
        if elapsed < self.delay:
            time.sleep(self.delay - elapsed)
        self._last_req = time.time()

    def get(self, url: str, **kw) -> requests.Response:
        self._throttle()
        if not url.startswith("http"):
            url = BASE_URL + url
        log.debug(f"GET {url[:120]}")
        r = self.session.get(url, timeout=30, verify=False, **kw)
        r.raise_for_status()
        r.encoding = "utf-8"
        return r

    def post(self, url: str, data: dict, **kw) -> requests.Response:
        self._throttle()
        if not url.startswith("http"):
            url = BASE_URL + url
        log.debug(f"POST {url[:120]}")
        r = self.session.post(url, data=data, timeout=30, verify=False, **kw)
        r.raise_for_status()
        r.encoding = "utf-8"
        return r

    def init_session(self) -> tuple[str, str]:
        log.info("初始化 session...")
        r = self.get(HOME_URL)
        soup = BeautifulSoup(r.text, "lxml")
        form = soup.find("form", attrs={"name": "KM"})
        action = form["action"] if form else ""
        info = soup.find("input", attrs={"name": "INFO"})
        info_val = info["value"] if info else ""
        m = re.search(r"\?\@\@(\d+)", action)
        token = m.group(1) if m else ""
        log.info(f"Session token={token}")
        return token, info_val


# ══════════════════════════════════════════════
# Step 1 ── 搜尋
# ══════════════════════════════════════════════

def search_law(sess: LISSession, law_name: str) -> list[dict]:
    log.info(f"搜尋：{law_name}")
    token, info_val = sess.init_session()
    data = {
        "INFO": info_val,
        "@_1_6_T": "T_LN/LW",
        "_1_6_T":  law_name,
        "@_1_5_T": "T_LW/AL/AX/AZ/AW/AY/AV/AN",
        "_1_5_T":  "",
        "@_1_7_r": "r6_",
        "_1_7_r_1": "0",
        "_1_7_r_6": "AD",
        "_1_7_r_0_3": "",
        "_1_7_r_3_2": "",
        "_1_7_r_5_2": "",
        "_1_7_r_7_3": "",
        "_1_7_r_10_2": "",
        "_1_7_r_12_2": "",
        "_IMG_檢索.x": "35",
        "_IMG_檢索.y": "17",
    }
    r = sess.post(f"{SEARCH_PATH}?@@{token}", data=data)
    results = _parse_search_results(r.text, law_name)
    if not results:
        raise ValueError(f"找不到法規「{law_name}」，請確認名稱是否正確。")
    log.info(f"找到 {len(results)} 筆")
    return results


def _parse_search_results(html: str, target_name: str) -> list[dict]:
    soup = BeautifulSoup(html, "lxml")
    results = []
    sumtab = soup.find("table", class_="sumtab")
    if not sumtab:
        return results
    for tr in sumtab.find_all("tr", class_=re.compile(r"sumtr")):
        ti_td = tr.find("td", class_="sumtd2_TI")
        if not ti_td:
            continue
        a = ti_td.find("a")
        if not a or clean(a.get_text()) != target_name:
            continue
        pd_td = tr.find("td", class_="sumtd2_PD")
        ad_td = tr.find("td", class_="sumtd2_AD")
        pr_td = tr.find("td", class_="sumtd2_PR")
        pdf_url = ""
        if pr_td:
            pa = pr_td.find("a")
            if pa:
                pdf_url = pa["href"]
        results.append({
            "law_name":     target_name,
            "law_url":      a["href"],
            "pass_date":    parse_roc_date(clean(pd_td.get_text())) if pd_td else None,
            "pub_date":     parse_roc_date(clean(ad_td.get_text())) if ad_td else None,
            "annex_pdf_url": pdf_url,
        })
    return results


# ══════════════════════════════════════════════
# Step 2 ── 法規全文頁
# ══════════════════════════════════════════════

def get_article_page(sess: LISSession, law_url: str) -> tuple[str, str]:
    log.info("取得法規全文頁...")
    r = sess.get(law_url)
    html = r.text
    # 法條沿革 URL（含 032 功能碼）
    m = re.search(
        r'lawsingle\?(003600[A-Fa-f0-9]+0000000000000000032[A-Fa-f0-9]+'
        r'\^[^\s"\'<>]+)',
        html, re.IGNORECASE
    )
    if m:
        return html, f"{LAW_PATH}?{m.group(1)}"
    # 備用：L_tab 中的「法條沿革」連結
    soup = BeautifulSoup(html, "lxml")
    tab_td = soup.find("td", class_="L_tab")
    if tab_td:
        for a in tab_td.find_all("a"):
            if "法條沿革" in a.get_text():
                pm = re.search(r'lawsingle\?(.+)', a["href"])
                if pm:
                    return html, f"{LAW_PATH}?{pm.group(1)}"
    raise ValueError("找不到「法條沿革」連結，頁面結構可能已變更。")


def parse_article_page(html: str) -> dict:
    soup = BeautifulSoup(html, "lxml")

    # 法律名稱 & ID
    law_na = soup.find("td", class_="law_NA")
    law_name, law_id = "", ""
    if law_na:
        span = law_na.find("span", style=re.compile(r"display\s*:\s*none"))
        if span:
            law_id = clean(span.get_text()).strip("()")
            span.decompose()
        law_name = clean(law_na.get_text())

    # 現行版本日期（轉西元 ISO）
    date_td = soup.find("td", class_="date")
    raw_date = clean(date_td.get_text()) if date_td else ""
    d = parse_roc_date(raw_date)
    current_version_date = d["date"] if d else ""

    # 版本清單（左側面板）
    versions = []
    l_box = soup.find("div", class_="L_box")
    if l_box:
        for sub in l_box.find_all("table"):
            v0 = sub.find("td", class_="version_0")
            if not v0:
                continue
            a = v0.find("a")
            if not a:
                continue
            v1 = sub.find("td", class_="version_1")
            label = clean(a.get_text())
            vd = parse_roc_date(label)
            pd_raw = clean(v1.get_text()) if v1 else ""
            pd = parse_roc_date(pd_raw)
            outer_td = v0.find_parent("td", class_=re.compile(r"vs_stay"))
            v_item = {
                "label":            label,
                "version_date":     vd["date"] if vd else "",
                "publication_date": pd["date"] if pd else "",
                "url":              a["href"],
                "is_current":       outer_td is not None,
            }
            if not any(v["label"] == v_item["label"] and v["version_date"] == v_item["version_date"] for v in versions):
                versions.append(v_item)

    # 條次目錄
    toc = []
    r_box = soup.find("div", class_="R_box")
    if r_box:
        for li in r_box.find_all("li", class_="ly01"):
            gm = re.search(r"godiv\((\d+)\)", li.get("onclick", ""))
            toc.append({
                "part_id":    f"part{gm.group(1)}" if gm else None,
                "article_no": clean(li.get_text()),
            })

    # 現行條文
    current_text = []
    c_box = soup.find("div", id="C_box")
    if c_box:
        cp = c_box.find("td", class_="cp")
        if cp:
            for tr in cp.find_all("tr"):
                td = tr.find("td")
                if not td or not td.get("id", "").startswith("part"):
                    continue
                ant = td.find("font", color="C000FF")
                art_no = clean(ant.get_text()) if ant else ""
                if ant:
                    ant.decompose()
                for img_a in td.find_all("a"):
                    if img_a.find("img"):
                        img_a.decompose()
                for br in td.find_all("br"):
                    br.replace_with("\n")
                content = [clean(l) for l in td.get_text().split("\n") if clean(l)]
                current_text.append({
                    "part_id":    td["id"],
                    "article_no": art_no,
                    "content":    content,
                })

    return {
        "law_name":             law_name,
        "law_id":               law_id,
        "current_version_date": current_version_date,
        "legislation_versions": versions,
        "table_of_contents":    toc,
        "current_text":         current_text,
    }


# ══════════════════════════════════════════════
# Step 3 ── 法條歷次沿革頁
# ══════════════════════════════════════════════

def get_target_page(sess: LISSession, target_url: str) -> str:
    log.info("取得法條歷次沿革頁...")
    r = sess.get(target_url)
    return r.text


def parse_target_page(html: str) -> list[dict]:
    """
    回傳：
    [
      {
        "article_no": "第一條",
        "total_revisions": 3,
        "revisions": [
          {
            "revision_index": 1,       # 第幾次（含制定）
            "date": "1995-03-23",      # 西元 ISO
            "year": 1995,
            "month": 3,
            "day": 23,
            "action_type": "制定",
            "is_current": false,
            "content": ["條文..."],
            "reason":  ["理由..."]
          }
        ]
      }
    ]
    """
    soup = BeautifulSoup(html, "lxml")
    articles = []

    for row_td in soup.find_all("td", class_=re.compile(r"^row[01]$")):
        inner = row_td.find("table")
        if not inner:
            continue
        ant = row_td.find("font", class_="artino")
        if not ant:
            continue
        article_no = clean(ant.get_text())

        revisions = []
        cur = None

        for tr in inner.find_all("tr", recursive=False):
            # 日期行
            upd = tr.find("font", class_="upddate")
            if upd:
                raw = re.sub(r"[（()）]", "", clean(upd.get_text())).strip()
                dm = re.match(r"(\d{7})", raw)
                am = re.search(r"[\u4e00-\u9fff]+$", raw)
                if cur:
                    revisions.append(cur)
                parsed = parse_roc_date(dm.group(1)) if dm else None
                cur = {
                    "date":        parsed["date"]  if parsed else "",
                    "year":        parsed["year"]  if parsed else None,
                    "month":       parsed["month"] if parsed else None,
                    "day":         parsed["day"]   if parsed else None,
                    "action_type": am.group(0) if am else "",
                    "content":     None,
                    "reason":      None,
                }
                continue
            # 條文行
            if tr.find("td", class_="artiupd_TH_1") and cur:
                th2 = tr.find("td", class_="artiupd_TH_2")
                if th2:
                    cur["content"] = multiline(th2)
                continue
            # 理由行
            if tr.find("td", class_="artiupd_RS_1") and cur:
                rs2 = tr.find("td", class_="artiupd_RS_2")
                if rs2:
                    cur["reason"] = multiline(rs2)
                continue

        if cur:
            revisions.append(cur)

        # 標記序號與是否現行
        for i, rev in enumerate(revisions):
            rev["revision_index"] = i + 1
            rev["is_current"]     = (i == len(revisions) - 1)

        articles.append({
            "article_no":      article_no,
            "total_revisions": len(revisions),
            "revisions":       revisions,
        })

    return articles


# ══════════════════════════════════════════════
# 過濾邏輯
# ══════════════════════════════════════════════

class FilterConfig:
    def __init__(
        self,
        date:     str | None       = None,
        nth:      int | None       = None,
        current:  bool             = False,
        articles: list[str] | None = None,
        simple:   bool             = False,
    ):
        self.date     = date
        self.nth      = nth
        self.current  = current
        self.articles = [normalize_art(a) for a in articles] if articles else None
        self.simple   = simple

    @property
    def has_revision_filter(self) -> bool:
        return bool(self.date or self.nth or self.current)


def apply_filter(raw: dict, fc: FilterConfig) -> dict:
    out = deepcopy(raw)

    # ── 1. 條文過濾 ──
    if fc.articles:
        targets = set(fc.articles)
        out["article_history"] = [
            a for a in out["article_history"]
            if normalize_art(a["article_no"]) in targets
        ]
        out["current_text"] = [
            a for a in out.get("current_text", [])
            if normalize_art(a["article_no"]) in targets
        ]
        out["table_of_contents"] = [
            t for t in out.get("table_of_contents", [])
            if normalize_art(t["article_no"]) in targets
        ]

    # ── 2. 版本過濾 ──
    if fc.has_revision_filter:
        target_date = None
        if fc.date:
            target_date = fc.date
        elif fc.nth is not None:
            # 取得不重複的立法版本日期（依時間序）
            unique_versions = []
            seen_dates = set()
            for v in out.get("legislation_versions", []):
                d = v.get("version_date")
                if d and d not in seen_dates:
                    unique_versions.append(v)
                    seen_dates.add(d)
            if 0 < fc.nth <= len(unique_versions):
                target_date = unique_versions[fc.nth - 1]["version_date"]
            else:
                log.warning(f"指定修正次數 {fc.nth} 超過範圍 (1-{len(unique_versions)})")
        elif fc.current:
            target_date = out["metadata"]["current_version_date"]

        if target_date:
            log.info(f"過濾目標日期: {target_date}")
            new_history = []
            for art in out["article_history"]:
                # 尋找該日期或之前最後一次修訂
                match = None
                for rev in art["revisions"]:
                    if rev["date"] <= target_date:
                        if not match or rev["date"] >= match["date"]:
                            match = rev
                
                if match:
                    # 如果該條文在目標日期時的狀態是「刪除」，則不納入
                    if match.get("action_type") == "刪除":
                        continue
                    
                    # 複製符合的版本並更新為單一版本
                    filtered_art = deepcopy(art)
                    filtered_art["revisions"] = [deepcopy(match)]
                    filtered_art["total_revisions"] = 1
                    # 標註是否為現行（相對於目標日期）
                    filtered_art["revisions"][0]["is_current"] = (target_date == out["metadata"]["current_version_date"])
                    new_history.append(filtered_art)
            
            out["article_history"] = new_history
        else:
            # 若無法解析目標日期且有設定過濾，清空歷史
            out["article_history"] = []

    # ── 3. 簡易輸出 ──
    if fc.simple:
        out = _to_simple(out)

    # ── 4. 更新 metadata ──
    out["metadata"]["total_articles"]  = len(out["article_history"])
    out["metadata"]["total_revisions"] = sum(
        len(a["revisions"]) for a in out["article_history"]
    )
    desc = {}
    if fc.date:
        desc["filter_date"] = fc.date
    if fc.nth:
        desc["filter_nth"] = fc.nth
    if fc.current:
        desc["filter_current"] = True
    if fc.articles:
        desc["filter_articles"] = fc.articles
    if fc.simple:
        desc["simple"] = True
    if desc:
        out["metadata"]["filters_applied"] = desc
        if "target_date" not in out["metadata"]:
             out["metadata"]["target_date"] = target_date

    return out


def _to_simple(out: dict) -> dict:
    """簡易模式：條文只留 article_no / date / action_type / content 純文字。"""
    simple_hist = []
    for art in out["article_history"]:
        simple_hist.append({
            "article_no": art["article_no"],
            "revisions": [
                {
                    "revision_index": rev.get("revision_index"),
                    "date":           rev["date"],
                    "action_type":    rev["action_type"],
                    "content":        "\n".join(rev["content"]) if rev["content"] else "",
                }
                for rev in art["revisions"]
            ],
        })

    simple_cur = [
        {
            "article_no": a["article_no"],
            "content":    "\n".join(a["content"]),
        }
        for a in out.get("current_text", [])
    ]

    # 從 metadata 取所需欄位（保留 filters_applied 若已存在）
    m = out["metadata"]
    new_meta = {
        "law_name":             m["law_name"],
        "law_id":               m["law_id"],
        "current_version_date": m["current_version_date"],
        "total_articles":       m["total_articles"],
        "total_revisions":      m["total_revisions"],
        "crawled_at":           m["crawled_at"],
    }
    if "filters_applied" in m:
        new_meta["filters_applied"] = m["filters_applied"]

    return {
        "metadata":       new_meta,
        "current_text":   simple_cur,
        "article_history": simple_hist,
    }


# ══════════════════════════════════════════════
# 核心爬蟲
# ══════════════════════════════════════════════

def crawl(law_name: str, delay: float = REQUEST_DELAY) -> dict:
    """爬取並回傳原始（未過濾）完整資料。"""
    sess = LISSession(delay=delay)

    results = search_law(sess, law_name)
    entry   = results[0]
    log.info(f"使用版本：通過日期 {entry['pass_date']['date'] if entry['pass_date'] else '-'}")

    article_html, target_url = get_article_page(sess, entry["law_url"])
    meta = parse_article_page(article_html)
    log.info(f"法律ID：{meta['law_id']}，立法版本：{len(meta['legislation_versions'])} 筆")

    target_html = get_target_page(sess, target_url)
    articles = parse_target_page(target_html)
    log.info(f"解析完成：{len(articles)} 條，{sum(a['total_revisions'] for a in articles)} 個歷次版本")

    return {
        "metadata": {
            "law_name":                   meta["law_name"],
            "law_id":                     meta["law_id"],
            "current_version_date":       meta["current_version_date"],
            "total_articles":             len(articles),
            "total_revisions":            sum(a["total_revisions"] for a in articles),
            "legislation_versions_count": len(meta["legislation_versions"]),
            "crawled_at":                 datetime.now().isoformat(),
            "source_url": (
                BASE_URL + target_url
                if not target_url.startswith("http")
                else target_url
            ),
        },
        "legislation_versions": meta["legislation_versions"],
        "table_of_contents":    meta["table_of_contents"],
        "current_text":         meta["current_text"],
        "article_history":      articles,
    }


def crawl_one(
    law_name: str,
    out_dir:  Path,
    fc:       FilterConfig,
    delay:    float = REQUEST_DELAY,
) -> dict | None:
    """單部法規：爬取 → 過濾 → 存檔。回傳結果 dict，失敗回傳 None。"""
    try:
        raw    = crawl(law_name, delay=delay)
        result = apply_filter(raw, fc)
        safe   = re.sub(r'[\\/:*?"<>|]', "_", law_name)
        path   = out_dir / f"{safe}.json"
        path.write_text(
            json.dumps(result, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
        _print_summary(result, path)
        return result
    except ValueError as e:
        log.error(f"[{law_name}] {e}")
        return None
    except requests.RequestException as e:
        log.error(f"[{law_name}] 網路錯誤：{e}")
        return None


def _print_summary(result: dict, path: Path):
    m = result["metadata"]
    print(f"\n{'─'*52}")
    print(f"📄  {m['law_name']}  (ID: {m['law_id']})")
    print(f"📅  現行版本日期      : {m['current_version_date']}")
    if "legislation_versions_count" in m:
        print(f"📜  立法版本數        : {m['legislation_versions_count']}")
    print(f"📝  條文數            : {m['total_articles']}")
    print(f"🔄  歷次版本總計      : {m['total_revisions']}")
    if "filters_applied" in m:
        print(f"🔍  套用過濾          : {m['filters_applied']}")
    print(f"💾  輸出              : {path}")


# ══════════════════════════════════════════════
# CLI
# ══════════════════════════════════════════════

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="lis_crawler",
        description="立法院法規完整歷史爬蟲 v2.0",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )

    src = p.add_mutually_exclusive_group()
    src.add_argument("law_name", nargs="?",
                     help="法規完整名稱（精確匹配）")
    src.add_argument("--batch", "-b", metavar="FILE",
                     help='批次 JSON 檔，格式：["法規A","法規B"] 或 [{"name":"法規A"},...]')

    p.add_argument("--output", "-o", metavar="FILE",
                   help="輸出 JSON 檔名（單筆模式，預設：[法規名].json）")
    p.add_argument("--out-dir", metavar="DIR", default=".",
                   help="批次模式輸出目錄（預設：目前目錄）")

    flt = p.add_argument_group("過濾條件（--filter-date / --filter-nth / --filter-current 三選一）")
    rev = flt.add_mutually_exclusive_group()
    rev.add_argument("--filter-date", metavar="YYYY-MM-DD",
                     help="只輸出指定西元日期的版本")
    rev.add_argument("--filter-nth", metavar="N", type=int,
                     help="只輸出第 N 次修正（制定算第1次）")
    rev.add_argument("--filter-current", action="store_true",
                     help="只輸出現行（最後一個）版本")
    flt.add_argument("--filter-articles", nargs="+", metavar="條文號",
                     help="只輸出指定條文，例：第一條 第二條")

    p.add_argument("--simple", "-s", action="store_true",
                   help="簡易輸出：只保留條文內容，不含修正理由和技術欄位")
    p.add_argument("--delay", type=float, default=REQUEST_DELAY, metavar="SEC",
                   help=f"請求間隔秒數（預設 {REQUEST_DELAY}）")
    p.add_argument("--workers", type=int, default=3, metavar="N",
                   help="批次並行數（預設 3，最大 5）")
    p.add_argument("--verbose", "-v", action="store_true",
                   help="顯示 DEBUG log")
    return p


def main():
    parser = build_parser()
    args   = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if not args.law_name and not args.batch:
        parser.print_help()
        sys.exit(1)

    fc = FilterConfig(
        date     = args.filter_date,
        nth      = args.filter_nth,
        current  = args.filter_current,
        articles = args.filter_articles,
        simple   = args.simple,
    )

    # ── 單筆模式 ──
    if args.law_name:
        out_dir  = Path(args.output).parent if args.output else Path(".")
        out_dir.mkdir(parents=True, exist_ok=True)
        result = crawl_one(args.law_name, out_dir, fc, delay=args.delay)
        if result and args.output:
            # crawl_one 用 [法規名].json，若有 --output 則重命名
            default = out_dir / f"{re.sub(r'[\\/:*?\"<>|]', '_', args.law_name)}.json"
            target  = Path(args.output)
            if default.resolve() != target.resolve():
                default.rename(target)
        sys.exit(0 if result else 1)

    # ── 批次模式 ──
    batch_path = Path(args.batch)
    if not batch_path.exists():
        log.error(f"批次檔案不存在：{batch_path}")
        sys.exit(1)

    raw_list   = json.loads(batch_path.read_text(encoding="utf-8"))
    law_names  = []
    for item in raw_list:
        if isinstance(item, str):
            law_names.append(item.strip())
        elif isinstance(item, dict):
            n = (item.get("name") or item.get("law_name")
                 or item.get("title") or "").strip()
            if n:
                law_names.append(n)
    law_names = [n for n in law_names if n]

    log.info(f"批次模式：{len(law_names)} 部法規，並行 {args.workers} 個 worker")
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    workers = min(args.workers, 5)
    success, failed = 0, []

    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
        fmap = {
            pool.submit(crawl_one, name, out_dir, fc, args.delay): name
            for name in law_names
        }
        for fut in concurrent.futures.as_completed(fmap):
            name = fmap[fut]
            if fut.result():
                success += 1
            else:
                failed.append(name)

    print(f"\n{'═'*52}")
    print(f"批次完成：成功 {success} / {len(law_names)} 部")
    if failed:
        print(f"失敗清單：{failed}")
    print(f"輸出目錄：{out_dir.resolve()}")
    sys.exit(0 if not failed else 1)


if __name__ == "__main__":
    main()