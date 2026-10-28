import os
import sys
import json
import html

sys.stdout.reconfigure(encoding='utf-8')

HUB_DIR = r"G:\我的雲端硬碟\0_AI Agent\Obsidian\DavidCloud\大衛人生\B2. 閱讀生活\B2.2 閱讀型態\B2.2.2 文學\B2.2.2.1 中國文學史\紅樓夢\red-chamber-knowledge-hub"

courses_path = os.path.join(HUB_DIR, "data", "courses.json")
with open(courses_path, 'r', encoding='utf-8') as fp:
    data = json.load(fp)

modules = data["modules"]
stats = data["stats"]

# Generate Module Cards HTML for index.html
modules_html = ""
for m in modules:
    lessons_list_html = ""
    for l in m["lessons"]:
        lessons_list_html += f"""
          <div class="module-lesson-item" onclick="openLessonModal('{l['id']}')">
            <span><strong>#{str(l['order']).zfill(2)}</strong> {html.escape(l['short_title'])}</span>
            <span style="font-size: 0.75rem; color: #868e96;">📖 閱讀</span>
          </div>
        """
    first_slide_num = str(m["lessons"][0]["order"]).zfill(2)
    modules_html += f"""
      <div class="module-card">
        <div class="module-header">
          <span class="module-badge" style="background: {m['color']}15; color: {m['color']};">{html.escape(m['badge'])}</span>
          <span style="font-size: 0.8rem; color: #868e96;">共 {m['lesson_count']} 講</span>
        </div>
        <h3 class="module-title">{html.escape(m['title'])}</h3>
        <p class="module-desc">{html.escape(m['desc'])}</p>
        <div class="module-lessons-list">
          {lessons_list_html}
        </div>
        <div class="module-footer">
          <span style="font-size: 0.8rem; color: #868e96;">模組 #{m['num']}</span>
          <a href="presentation.html#slide-{first_slide_num}" class="btn btn-primary" style="padding: 0.3rem 0.75rem; font-size: 0.82rem;">
            🖥 進入本模組簡報
          </a>
        </div>
      </div>
    """

# 1. Write index.html
index_html_content = f"""<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>紅樓夢生活人文智庫 ✕ 麥肯錫結構化簡報系統</title>
  <meta name="description" content="借紅樓照見人生，化經典為生活智慧。專為想將紅樓夢角色洞察應用於生活、提升人文素養與高情商領導力者設計的麥肯錫結構化知識庫。">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

  <!-- Top Navigation Bar -->
  <nav class="navbar">
    <div class="nav-container">
      <div class="brand">
        <span class="brand-seal">紅</span>
        <span>紅樓夢生活人文智庫</span>
      </div>
      <div class="nav-actions">
        <a href="#modulesSection" class="btn btn-outline">📚 瀏覽模組</a>
        <a href="#lifeApplicationSection" class="btn btn-outline">🌿 生活應用</a>
        <a href="presentation.html#slide-01" class="btn btn-primary">
          🖥 打開 16:9 簡報系統
        </a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="hero">
    <div class="hero-inner">
      <div class="hero-badge">
        <span>🏛️ 得到 App 董梅講透紅樓夢 ✕ 麥肯錫顧問結構化智庫</span>
      </div>
      <h1 class="hero-title">借紅樓照見人生，化經典為生活智慧</h1>
      <p class="hero-subtitle">
        專為「想讓紅樓夢的角色、觀察應用於生活，增加人文素質」的現代人打造。
        運用麥肯錫金字塔原理，重構 34 講精粹內容，提煉出兼具深情、靈性與悲憫的高情商生活實踐指南。
      </p>

      <!-- Key Statistics Dashboard -->
      <div class="hero-stats">
        <div class="stat-card">
          <div class="stat-num">34</div>
          <div class="stat-label">篇權威經典精講 (全收錄)</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">6</div>
          <div class="stat-label">大麥肯錫結構模組</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">136+</div>
          <div class="stat-label">項人生難題解答與洞察</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">100%</div>
          <div class="stat-label">行動結論先行 (Pyramid Deck)</div>
        </div>
      </div>
    </div>
  </header>

  <!-- Real-time Global Search & Filter Bar -->
  <div class="search-bar-wrap">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input type="text" id="globalSearchInput" class="search-input" placeholder="輸入關鍵字查找：如「王熙鳳」、「管理」、「飲食」、「正邪兩賦」、「大觀園」..." autocomplete="off">
      <span class="search-hotkey">Ctrl + K</span>
    </div>
    <div class="search-tags">
      <span style="font-size: 0.8rem; color: #6c757d; align-self: center; margin-right: 0.25rem;">熱門標籤：</span>
      <button class="tag-btn" data-tag="生活美學">生活美學</button>
      <button class="tag-btn" data-tag="管理">管理領導</button>
      <button class="tag-btn" data-tag="正邪兩賦">正邪兩賦</button>
      <button class="tag-btn" data-tag="王熙鳳">王熙鳳</button>
      <button class="tag-btn" data-tag="探春">探春</button>
      <button class="tag-btn" data-tag="林黛玉">林黛玉</button>
      <button class="tag-btn" data-tag="薛寶釵">薛寶釵</button>
      <button class="tag-btn" data-tag="飲食">飲食文化</button>
      <button class="tag-btn" data-tag="儒道釋">儒道釋價值觀</button>
    </div>
  </div>

  <main class="container">

    <!-- Search Results Section (Dynamically displayed when searching) -->
    <section id="searchResultsSection" class="search-results-section">
      <div class="section-head">
        <div>
          <h2 class="section-title">🔍 檢索結果</h2>
          <span id="searchQueryBadge" class="section-subtitle"></span>
        </div>
        <span id="searchResultCount" style="font-size: 0.88rem; font-weight: 700; color: var(--primary-red);"></span>
      </div>
      <div id="searchResultsContainer"></div>
    </section>

    <!-- Four Life Pillars Matrix -->
    <section id="lifeApplicationSection" style="margin-bottom: 4rem;">
      <div class="section-head">
        <div>
          <h2 class="section-title">🌿 紅樓人文素養 ✕ 現代生活四大支柱</h2>
          <span class="section-subtitle">將曹雪芹筆下的人性觀察轉化為現代人的生命修養與處世心法</span>
        </div>
      </div>

      <div class="pillar-grid">
        <div class="pillar-card">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">💼</div>
          <h3 class="pillar-title">職場領導與變革管理</h3>
          <p class="pillar-desc">
            對照王熙鳳的威權微觀監控與探春的承包造血制度；審視賈府現金流崩塌警鐘，學習在組織中如何破除既得利益阻力推動制度革新。
          </p>
          <div style="margin-top: 0.75rem; font-size: 0.8rem; color: var(--primary-red); font-weight: 600;">
            代表課程：#25 破產審計 · #26 探春理家 · #27 關係高手
          </div>
        </div>

        <div class="pillar-card">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🤝</div>
          <h3 class="pillar-title">人際關係與情商修煉</h3>
          <p class="pillar-desc">
            以「正邪兩賦論」破除道德非黑即白的苛責，學會「見人之長、諒人之短」；看懂他人刺蝟外殼下的生命創傷，建立深度同理心。
          </p>
          <div style="margin-top: 0.75rem; font-size: 0.8rem; color: var(--primary-red); font-weight: 600;">
            代表課程：#21 正邪兩賦 · #12 襲人體制困境 · 直播大課①
          </div>
        </div>

        <div class="pillar-card">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🍵</div>
          <h3 class="pillar-title">日常美學與生活儀式感</h3>
          <p class="pillar-desc">
            融會王熙鳳的物質本事、賈母的審美品位與林黛玉的天然詩性；透過四時節令、飲食正念、家居借景與器物雅玩，在快節奏中找回生活質感。
          </p>
          <div style="margin-top: 0.75rem; font-size: 0.8rem; color: var(--primary-red); font-weight: 600;">
            代表課程：#03 第一流生活家 · #05 飲食境界 · #08 歲時節令
          </div>
        </div>

        <div class="pillar-card">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🧘</div>
          <h3 class="pillar-title">心靈覺察與生命悲憫</h3>
          <p class="pillar-desc">
            體悟「因空見色，自色悟空」的深層智慧：知曉世事無常終將歸空，依然選擇深情以赴；融通儒之深情、道之靈性與佛之悲憫。
          </p>
          <div style="margin-top: 0.75rem; font-size: 0.8rem; color: var(--primary-red); font-weight: 600;">
            代表課程：#15 紅樓之夢 · #18 風月寶鑑 · 直播大課②
          </div>
        </div>
      </div>
    </section>

    <!-- Six Knowledge Modules Section -->
    <section id="modulesSection">
      <div class="section-head">
        <div>
          <h2 class="section-title">📚 麥肯錫六大結構化知識模組</h2>
          <span class="section-subtitle">點擊各單元可即時預覽精華筆記，或一鍵直達 16:9 簡報進行演講與研讀</span>
        </div>
        <a href="presentation.html#slide-01" class="btn btn-outline" style="font-size: 0.85rem;">
          🖥 總覽全套 34 頁簡報
        </a>
      </div>

      <div class="module-grid">
        {modules_html}
      </div>
    </section>

    <!-- Extensible Architecture Guide -->
    <section style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 2rem; margin-top: 2rem; box-shadow: var(--shadow-sm);">
      <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-slate); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
        <span>🛠️</span> 預留擴充架構說明 (Extensible Architecture)
      </h3>
      <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem;">
        本智庫採用標準化<strong>數據驅動 (Data-Driven) 模組化架構</strong>，完全解耦資料與表現層。未來無論新增專題簡報、角色分析卡片或延伸影音筆記，只需遵循三步驟 SOP：
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; font-size: 0.85rem;">
        <div style="background: #f8f9fa; padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--primary-red);">
          <strong>1. 結構化資料庫 (data/courses.json)</strong><br>
          在對應模組中追加章節中繼資料、麥肯錫行動結論標題、三項洞察與講稿備忘錄。
        </div>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent-gold);">
          <strong>2. 全域搜尋索引 (data/search-index.json)</strong><br>
          新增反向檢索標籤與人物關鍵字，前端即時檢索引擎即刻自動支援模糊搜尋與高亮。
        </div>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid #0a9396;">
          <strong>3. 簡報自動渲染 (presentation.html)</strong><br>
          簡報引擎動態讀取 JSON 渲染 16:9 頁面，無縫支援鍵盤切換、講稿抽屜與列印匯出。
        </div>
      </div>
      <div style="margin-top: 1.25rem; text-align: right;">
        <a href="docs/EXPANSION.md" target="_blank" style="font-size: 0.85rem; font-weight: 600;">📖 詳閱 docs/EXPANSION.md 擴充手冊 →</a>
      </div>
    </section>

  </main>

  <!-- Modal Reader (Fast reading drawer) -->
  <div id="lessonModalBackdrop" class="modal-backdrop">
    <div class="modal-dialog">
      <div class="modal-head">
        <h3 id="modalLessonTitle" class="modal-title">課程詳情</h3>
        <button class="modal-close" onclick="closeLessonModal()">&times;</button>
      </div>
      <div id="modalLessonBody" class="modal-body">
        <!-- Content injected dynamically -->
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          紅樓夢生活人文智庫 ✕ 麥肯錫結構化簡報系統
        </div>
        <div>
          <a href="presentation.html#slide-01" class="btn btn-primary" style="font-size: 0.85rem;">🖥 啟動 16:9 簡報演示</a>
        </div>
      </div>
      <div class="footer-bottom">
        <div>
          經典來源：得到 App 董梅講透紅樓夢（中央美院人文學院古典文學學者）<br>
          架構設計：麥肯錫顧問風格結構化工程智庫 (Pyramid Principle)
        </div>
        <div>
          託管維護：GitHub Pages 靜態安全託管 · 2026
        </div>
      </div>
    </div>
  </footer>

  <script src="assets/js/search.js"></script>
</body>
</html>
"""

index_path = os.path.join(HUB_DIR, "index.html")
with open(index_path, 'w', encoding='utf-8') as fp:
    fp.write(index_html_content)
print(f"Saved: {index_path}")

# 2. Write presentation.html
presentation_html_content = """<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>紅樓夢生活人文智庫 ✕ 16:9 麥肯錫結構化簡報系統</title>
  <meta name="description" content="16:9 麥肯錫顧問風格互動簡報，支援鍵盤導航、講者備忘錄抽屜 (N)、投影片總覽網格 (G) 與一鍵列印 PDF (P)">
  <link rel="stylesheet" href="assets/css/deck.css">
</head>
<body class="deck-body">

  <!-- Top Header & Control Bar -->
  <header class="deck-topbar">
    <div class="deck-title-area">
      <span class="deck-seal">紅</span>
      <span>紅樓夢生活人文智庫</span>
      <select id="deckModuleSelect" class="deck-module-select">
        <!-- populated dynamically -->
      </select>
    </div>

    <div class="deck-top-actions">
      <button id="toggleNotesBtn" class="deck-btn" title="呼出/隱藏講稿備忘錄 (快捷鍵 N)">
        📝 講稿備忘錄 <kbd style="font-size: 0.7rem; background: #30363d; padding: 1px 4px; border-radius: 3px;">N</kbd>
      </button>
      <button id="toggleOverviewBtn" class="deck-btn" title="投影片總覽網格 (快捷鍵 G)">
        🗂️ 總覽網格 <kbd style="font-size: 0.7rem; background: #30363d; padding: 1px 4px; border-radius: 3px;">G</kbd>
      </button>
      <button id="toggleFullscreenBtn" class="deck-btn" title="切換全螢幕模式 (快捷鍵 F)">
        ⛶ 全螢幕 <kbd style="font-size: 0.7rem; background: #30363d; padding: 1px 4px; border-radius: 3px;">F</kbd>
      </button>
      <button id="printDeckBtn" class="deck-btn" title="一鍵列印/匯出 16:9 顧問 PDF (快捷鍵 P)">
        🖨️ 匯出 PDF <kbd style="font-size: 0.7rem; background: #30363d; padding: 1px 4px; border-radius: 3px;">P</kbd>
      </button>
      <a href="index.html" class="deck-btn deck-btn-primary">
        🏠 回智庫首頁
      </a>
    </div>
  </header>

  <!-- Presentation Stage (16:9 Viewport) -->
  <main class="deck-stage">
    <div id="slideFrame" class="slide-frame">
      <!-- Injected dynamically by deck.js -->
    </div>
  </main>

  <!-- Bottom Navigation Control Bar -->
  <footer class="deck-bottombar">
    <div class="deck-nav-controls">
      <button id="prevSlideBtn" class="deck-arrow-btn" title="上一頁 (←)">‹</button>
      <div id="slideCounter" class="deck-slide-counter">
        <span>01</span> / 34
      </div>
      <button id="nextSlideBtn" class="deck-arrow-btn" title="下一頁 (→ 或 空白鍵)">›</button>
    </div>

    <div class="deck-shortcuts-hint">
      <span>導航：<kbd>→</kbd> <kbd>←</kbd> <kbd>Space</kbd></span>
      <span>講稿抽屜：<kbd>N</kbd></span>
      <span>總覽：<kbd>G</kbd></span>
      <span>全螢幕：<kbd>F</kbd></span>
      <span>匯出 PDF：<kbd>P</kbd></span>
      <span>離開：<kbd>Esc</kbd></span>
    </div>
  </footer>

  <!-- Speaker Notes Drawer (Press N) -->
  <div id="notesDrawer" class="notes-drawer">
    <div class="notes-head">
      <span>🎙️ 麥肯錫三段式講稿備忘錄 (Speaker Notes)</span>
      <button onclick="toggleNotes()" style="background: none; border: none; color: #8b949e; cursor: pointer; font-size: 1.1rem;">&times;</button>
    </div>
    <div id="notesDrawerBody" class="notes-body">
      <!-- Injected dynamically -->
    </div>
  </div>

  <!-- Overview Grid Modal (Press G) -->
  <div id="overviewModal" class="overview-modal">
    <div class="overview-header">
      <h2 class="overview-title">🗂️ 全 34 頁麥肯錫顧問簡報總覽導航</h2>
      <button onclick="toggleOverview()" class="deck-btn" style="font-size: 1rem; padding: 0.4rem 1rem;">
        關閉總覽 <kbd>Esc</kbd>
      </button>
    </div>
    <div id="overviewGrid" class="overview-grid">
      <!-- Injected dynamically -->
    </div>
  </div>

  <script src="assets/js/deck.js"></script>
</body>
</html>
"""

presentation_path = os.path.join(HUB_DIR, "presentation.html")
with open(presentation_path, 'w', encoding='utf-8') as fp:
    fp.write(presentation_html_content)
print(f"Saved: {presentation_path}")
