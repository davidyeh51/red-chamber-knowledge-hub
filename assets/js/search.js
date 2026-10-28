/**
 * 全域即時關鍵字檢索引擎 (Instant Keyword Search Engine)
 * 支援模糊比對、標籤快篩、關鍵字動態高亮 <mark> 與快捷鍵 Ctrl+K
 */

let searchIndex = [];
let allCoursesData = null;

async function initSearchEngine() {
  try {
    const res = await fetch('data/search-index.json');
    searchIndex = await res.json();
    
    const coursesRes = await fetch('data/courses.json');
    allCoursesData = await coursesRes.json();
    
    setupSearchListeners();
  } catch (err) {
    console.error("Failed to load search index:", err);
  }
}

function setupSearchListeners() {
  const searchInput = document.getElementById('globalSearchInput');
  const tagBtns = document.querySelectorAll('.tag-btn');
  const resultsSec = document.getElementById('searchResultsSection');
  
  if (!searchInput) return;

  // Real-time input search
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
      performSearch(query);
    } else {
      resultsSec.classList.remove('active');
    }
  });

  // Global hotkeys: Ctrl+K or '/' to focus search input
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement !== searchInput)) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      resultsSec.classList.remove('active');
      searchInput.blur();
    }
  });

  // Category tags
  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      searchInput.value = tag;
      performSearch(tag);
      tagBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function performSearch(query) {
  const resultsSec = document.getElementById('searchResultsSection');
  const resultsContainer = document.getElementById('searchResultsContainer');
  const queryBadge = document.getElementById('searchQueryBadge');
  const countBadge = document.getElementById('searchResultCount');

  if (!resultsSec || !resultsContainer) return;

  const qLower = query.toLowerCase();
  const matched = searchIndex.filter(item => {
    return item.title.toLowerCase().includes(qLower) ||
           item.action_title.toLowerCase().includes(qLower) ||
           item.core_problem.toLowerCase().includes(qLower) ||
           item.key_insights.toLowerCase().includes(qLower) ||
           item.humanities_cultivation.toLowerCase().includes(qLower) ||
           item.modern_application.toLowerCase().includes(qLower) ||
           item.golden_quote.toLowerCase().includes(qLower) ||
           item.characters.toLowerCase().includes(qLower) ||
           item.keywords.toLowerCase().includes(qLower) ||
           item.questions.toLowerCase().includes(qLower);
  });

  resultsSec.classList.add('active');
  queryBadge.textContent = `關鍵字：「${query}」`;
  countBadge.textContent = `找到 ${matched.length} 篇相關課程與簡報`;

  if (matched.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 2.5rem; background: #fff; border-radius: 8px; border: 1px dashed #dee2e6;">
        <p style="font-size: 1.1rem; color: #6c757d; margin-bottom: 0.5rem;">未找到包含「${escapeHtml(query)}」的內容</p>
        <p style="font-size: 0.85rem; color: #adb5bd;">建議嘗試其他關鍵字：如「王熙鳳」、「管理」、「飲食」、「正邪兩賦」、「大觀園」</p>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = matched.map(item => {
    const highlightedAction = highlightText(item.action_title, query);
    const highlightedProblem = highlightText(item.core_problem, query);
    const highlightedTakeaway = highlightText(item.humanities_cultivation, query);

    return `
      <div class="result-card">
        <div class="result-header">
          <span class="result-title">${escapeHtml(item.title)}</span>
          <span class="module-badge">Slide #${String(item.order).padStart(2, '0')}</span>
        </div>
        <div class="result-action-title">${highlightedAction}</div>
        <div class="result-insights">
          <strong>📌 人生核心難題：</strong>${highlightedProblem}<br>
          <strong>🌿 人文素養心法：</strong>${highlightedTakeaway}
        </div>
        <div class="result-footer">
          <div>人物角色：<span style="color: var(--primary-red); font-weight: 600;">${escapeHtml(item.characters)}</span></div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-outline" style="padding: 0.25rem 0.65rem; font-size: 0.8rem;" onclick="openLessonModal('${item.id}')">📖 詳閱筆記</button>
            <a href="presentation.html#slide-${String(item.order).padStart(2, '0')}" class="btn btn-primary" style="padding: 0.25rem 0.65rem; font-size: 0.8rem;">🖥 直達簡報</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Smooth scroll to results
  resultsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function highlightText(text, query) {
  if (!text || !query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
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

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Global modal reader trigger
window.openLessonModal = function(lessonId) {
  if (!allCoursesData) return;
  
  let targetLesson = null;
  for (const mod of allCoursesData.modules) {
    const found = mod.lessons.find(l => l.id === lessonId);
    if (found) {
      targetLesson = found;
      break;
    }
  }

  if (!targetLesson) return;

  const modalBackdrop = document.getElementById('lessonModalBackdrop');
  const modalTitle = document.getElementById('modalLessonTitle');
  const modalBody = document.getElementById('modalLessonBody');

  modalTitle.textContent = targetLesson.title;

  let sectionsHtml = targetLesson.sections.map(sec => `
    <div style="margin-bottom: 1.25rem;">
      <h4 style="color: var(--primary-red); font-size: 1rem; margin-bottom: 0.4rem; font-weight: 700;">${escapeHtml(sec.question)}</h4>
      <div style="font-size: 0.9rem; color: #495057; line-height: 1.6; white-space: pre-line;">${escapeHtml(sec.content)}</div>
    </div>
  `).join('');

  modalBody.innerHTML = `
    <div class="modal-mckinsey-box">
      <div style="font-size: 0.78rem; font-weight: 700; color: var(--accent-gold); text-transform: uppercase; margin-bottom: 0.35rem;">麥肯錫行動結論標題 (Action Title)</div>
      <div style="font-size: 1.05rem; font-weight: 800; color: var(--primary-red); line-height: 1.4; margin-bottom: 0.75rem;">${escapeHtml(targetLesson.action_title)}</div>
      
      <div style="margin-bottom: 0.75rem; font-size: 0.88rem;">
        <strong>📌 本課解決的核心人生問題：</strong>${escapeHtml(targetLesson.core_problem)}
      </div>

      <div style="margin-bottom: 0.75rem; font-size: 0.88rem;">
        <strong>💡 三大關鍵洞察：</strong>
        <ul style="margin-left: 1.25rem; margin-top: 0.35rem;">
          ${targetLesson.key_insights.map(ki => `<li style="margin-bottom: 0.25rem;">${escapeHtml(ki)}</li>`).join('')}
        </ul>
      </div>

      <div style="font-size: 0.88rem;">
        <strong>🎯 現代生活與職場落地指南：</strong>
        <ul style="margin-left: 1.25rem; margin-top: 0.35rem;">
          ${targetLesson.modern_application.map(ma => `<li style="margin-bottom: 0.25rem;">${escapeHtml(ma)}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="modal-quote-box">
      “ ${escapeHtml(targetLesson.golden_quote)} ”
    </div>

    <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--dark-slate); margin: 1.5rem 0 1rem; border-bottom: 2px solid var(--border-light); padding-bottom: 0.4rem;">
      📚 得到筆記精華摘要
    </h3>
    ${sectionsHtml}

    <div style="margin-top: 1.75rem; padding-top: 1rem; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
      <a href="presentation.html#slide-${String(targetLesson.order).padStart(2, '0')}" class="btn btn-primary">
        🖥 打開 16:9 簡報閱讀本課
      </a>
      ${targetLesson.source_url ? `<a href="${targetLesson.source_url}" target="_blank" class="btn btn-outline" style="font-size: 0.82rem;">🔗 原始得到課程連結</a>` : ''}
    </div>
  `;

  modalBackdrop.classList.add('active');
};

window.closeLessonModal = function() {
  const modalBackdrop = document.getElementById('lessonModalBackdrop');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('active');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initSearchEngine();
  
  const modalBackdrop = document.getElementById('lessonModalBackdrop');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeLessonModal();
      }
    });
  }
});
