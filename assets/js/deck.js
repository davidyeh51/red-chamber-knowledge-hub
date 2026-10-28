/**
 * 16:9 麥肯錫結構化簡報互動控制器 (Deck Controller)
 * 支援鍵盤導航 (←/→/Space/N/G/F/P/Esc)、講稿抽屜、投影片總覽網格
 */

let allSlides = [];
let currentIndex = 0;
let isNotesOpen = false;
let isOverviewOpen = false;

async function initDeck() {
  try {
    const res = await fetch('data/courses.json');
    const data = await res.json();
    
    // Flatten lessons into slides
    allSlides = [];
    data.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        allSlides.push({
          ...lesson,
          module_title: mod.title,
          module_badge: mod.badge
        });
      });
    });

    setupDeckUI();
    setupKeyboardListeners();
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
  } catch (err) {
    console.error("Failed to initialize deck:", err);
  }
}

function handleHashChange() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#slide-')) {
    const num = parseInt(hash.replace('#slide-', ''), 10);
    if (!isNaN(num) && num >= 1 && num <= allSlides.length) {
      goToSlide(num - 1);
      return;
    }
  }
  goToSlide(0);
}

function setupDeckUI() {
  // Populate Module Selector
  const moduleSelect = document.getElementById('deckModuleSelect');
  if (moduleSelect) {
    const moduleMap = {};
    allSlides.forEach((slide, idx) => {
      if (!moduleMap[slide.module_title]) {
        moduleMap[slide.module_title] = idx;
      }
    });

    moduleSelect.innerHTML = Object.keys(moduleMap).map(mTitle => {
      return `<option value="${moduleMap[mTitle]}">${mTitle}</option>`;
    }).join('');

    moduleSelect.addEventListener('change', (e) => {
      goToSlide(parseInt(e.target.value, 10));
    });
  }

  // Populate Grid Overview
  const gridContainer = document.getElementById('overviewGrid');
  if (gridContainer) {
    gridContainer.innerHTML = allSlides.map((slide, idx) => `
      <div class="overview-thumb" onclick="jumpFromGrid(${idx})" id="thumb-${idx}">
        <span class="thumb-num">SLIDE #${String(idx + 1).padStart(2, '0')} · ${slide.module_badge}</span>
        <span class="thumb-title">${escapeHtml(slide.short_title || slide.title)}</span>
      </div>
    `).join('');
  }

  // Navigation button listeners
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Notes drawer toggle button
  const notesToggleBtn = document.getElementById('toggleNotesBtn');
  if (notesToggleBtn) notesToggleBtn.addEventListener('click', toggleNotes);

  // Overview toggle button
  const overviewToggleBtn = document.getElementById('toggleOverviewBtn');
  if (overviewToggleBtn) overviewToggleBtn.addEventListener('click', toggleOverview);

  // Fullscreen button
  const fullscreenBtn = document.getElementById('toggleFullscreenBtn');
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Print button
  const printBtn = document.getElementById('printDeckBtn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());
}

function setupKeyboardListeners() {
  window.addEventListener('keydown', (e) => {
    // If overview is open, Escape closes it
    if (isOverviewOpen) {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'g') {
        toggleOverview();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'Space':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'Backspace':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'n':
      case 'N':
        e.preventDefault();
        toggleNotes();
        break;
      case 'g':
      case 'G':
        e.preventDefault();
        toggleOverview();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'p':
      case 'P':
        if (e.ctrlKey) return; // allow normal ctrl+p
        e.preventDefault();
        window.print();
        break;
      case 'Escape':
        if (isNotesOpen) toggleNotes();
        break;
    }
  });
}

function renderSlide(index) {
  if (index < 0 || index >= allSlides.length) return;
  const slide = allSlides[index];

  // Update Topbar / Counter
  const counterSpan = document.getElementById('slideCounter');
  if (counterSpan) {
    counterSpan.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span> / ${allSlides.length}`;
  }

  // Update Module Selector Sync
  const moduleSelect = document.getElementById('deckModuleSelect');
  if (moduleSelect) {
    // find option matching current module
    for (let opt of moduleSelect.options) {
      if (slide.module_title.includes(opt.text) || opt.text.includes(slide.module_title)) {
        opt.selected = true;
        break;
      }
    }
  }

  // Update URL hash without scroll jumps
  history.replaceState(null, null, `#slide-${String(index + 1).padStart(2, '0')}`);

  // Render Slide Frame
  const frame = document.getElementById('slideFrame');
  if (!frame) return;

  const charactersHtml = slide.characters.map(c => `<span class="char-pill">${escapeHtml(c)}</span>`).join('');
  const insightsHtml = slide.key_insights.map(ki => `<li>${escapeHtml(ki)}</li>`).join('');
  const applicationsHtml = slide.modern_application.map(ma => `<li>${escapeHtml(ma)}</li>`).join('');

  frame.innerHTML = `
    <!-- Slide Header: Action Title -->
    <div class="slide-header">
      <div class="slide-category-bar">
        <div class="slide-badge-group">
          <span class="slide-cat-badge">${escapeHtml(slide.module_badge)} · ${escapeHtml(slide.module_title)}</span>
          <span class="slide-order-badge">SLIDE #${String(index + 1).padStart(2, '0')}</span>
        </div>
        <div class="slide-characters">${charactersHtml}</div>
      </div>
      <h1 class="slide-action-title">${escapeHtml(slide.action_title)}</h1>
    </div>

    <!-- Slide Body: McKinsey 2-Column Split -->
    <div class="slide-content-body">
      <!-- Left Column: Core Problem & Analytical Insights -->
      <div class="slide-col">
        <div class="col-panel panel-primary">
          <div class="panel-header panel-header-primary">
            <span>🏛️</span> 紅樓經典解碼與核心矛盾
          </div>
          <div class="problem-box">
            <strong>📌 核心人生難題：</strong>${escapeHtml(slide.core_problem)}
          </div>
          <ul class="insight-list">
            ${insightsHtml}
          </ul>
        </div>
      </div>

      <!-- Right Column: Humanities Cultivation & Life Application -->
      <div class="slide-col">
        <div class="col-panel panel-highlight">
          <div class="panel-header panel-header-gold">
            <span>🌿</span> 人文素養修煉 ✕ 現代生活落地
          </div>
          <div class="problem-box" style="border-left-color: var(--deck-gold); background: #fdfaf5;">
            <strong>🌿 人文素養昇華：</strong>${escapeHtml(slide.humanities_cultivation)}
          </div>
          <ul class="action-list">
            ${applicationsHtml}
          </ul>
        </div>
      </div>
    </div>

    <!-- Slide Footer: Golden Quote -->
    <div class="slide-footer-banner">
      <div class="slide-quote">${escapeHtml(slide.golden_quote)}</div>
      <div style="font-size: 0.78rem; color: #868e96;">董梅講透紅樓夢 ✕ 麥肯錫結構化簡報</div>
    </div>
  `;

  // Render Speaker Notes Drawer
  renderSpeakerNotes(slide);

  // Update Overview Active State
  document.querySelectorAll('.overview-thumb').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}

function renderSpeakerNotes(slide) {
  const notesBody = document.getElementById('notesDrawerBody');
  if (!notesBody) return;

  const notes = slide.speaker_notes || {
    opening: "破題背景：導入本講核心主題與現代人生活共鳴點。",
    evidence: "核心論據：結合文本細節與結構分析，拆解關鍵因果邏輯。",
    takeaway: "生活實踐：總結金句，提供具體可落地的行動心法指引。"
  };

  notesBody.innerHTML = `
    <div class="note-sec-box">
      <div class="note-sec-title">1. 破題與背景 (Opening Hook)</div>
      <div>${escapeHtml(notes.opening)}</div>
    </div>
    <div class="note-sec-box">
      <div class="note-sec-title">2. 核心論據與對比 (Core Evidence)</div>
      <div>${escapeHtml(notes.evidence)}</div>
    </div>
    <div class="note-sec-box">
      <div class="note-sec-title">3. 生活落地與金句 (Action & Closing)</div>
      <div>${escapeHtml(notes.takeaway)}</div>
    </div>
  `;
}

function nextSlide() {
  if (currentIndex < allSlides.length - 1) {
    goToSlide(currentIndex + 1);
  }
}

function prevSlide() {
  if (currentIndex > 0) {
    goToSlide(currentIndex - 1);
  }
}

function goToSlide(index) {
  currentIndex = index;
  renderSlide(currentIndex);
}

function toggleNotes() {
  isNotesOpen = !isNotesOpen;
  const drawer = document.getElementById('notesDrawer');
  if (drawer) {
    drawer.classList.toggle('open', isNotesOpen);
  }
}

function toggleOverview() {
  isOverviewOpen = !isOverviewOpen;
  const modal = document.getElementById('overviewModal');
  if (modal) {
    modal.classList.toggle('open', isOverviewOpen);
    if (isOverviewOpen) {
      // scroll active thumbnail into view
      const activeThumb = document.getElementById(`thumb-${currentIndex}`);
      if (activeThumb) activeThumb.scrollIntoView({ block: 'center' });
    }
  }
}

window.jumpFromGrid = function(index) {
  toggleOverview();
  goToSlide(index);
};

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => console.log(err));
  } else {
    document.exitFullscreen().catch(err => console.log(err));
  }
}

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(string).replace(/[&<>"']/g, function (s) {
    return entityMap[s];
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDeck();
});
