(function () {
  'use strict';

  // Accessibility: ensure only non-disabled days are focusable
  function updateDayTabIndex(root) {
    const days = root.querySelectorAll('.day');
    days.forEach(d => {
      if (d.classList.contains('disabled')) {
        d.setAttribute('tabindex', '-1');
        d.setAttribute('aria-disabled', 'true');
      } else {
        d.setAttribute('tabindex', '0');
      }
    });
  }

  // Initialize both calendars
  const app = document.getElementById('app');
  if (app) updateDayTabIndex(app);

  // Button placeholders (prev/next/month/year) – no-op but prevent form submit
  document.querySelectorAll('.nav-btn, .button-lite, .button-dark').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
    });
  });

  // Keyboard support for grid navigation (left/right/up/down) basic within row
  function handleKeyNav(e) {
    const key = e.key;
    const current = e.target;
    if (!current.classList.contains('day')) return;
    const week = current.closest('.week');
    if (!week) return;
    const cells = Array.from(week.querySelectorAll('.day:not(.disabled)'));
    const idx = cells.indexOf(current);
    if (idx === -1) return;

    if (key === 'ArrowRight' && idx < cells.length - 1) {
      cells[idx + 1].focus();
      e.preventDefault();
    } else if (key === 'ArrowLeft' && idx > 0) {
      cells[idx - 1].focus();
      e.preventDefault();
    }
    // Simple up/down: move across weeks in same column if present
    else if (key === 'ArrowDown' || key === 'ArrowUp') {
      const weeks = Array.from(week.parentElement.querySelectorAll('.week'));
      const col = Array.from(week.querySelectorAll('.day')).indexOf(current);
      const rowIndex = weeks.indexOf(week);
      const targetRow = key === 'ArrowDown' ? rowIndex + 1 : rowIndex - 1;
      if (targetRow >= 0 && targetRow < weeks.length) {
        const targetWeek = weeks[targetRow];
        const targetCells = targetWeek.querySelectorAll('.day');
        const target = targetCells[col];
        if (target && !target.classList.contains('disabled')) {
          target.focus();
          e.preventDefault();
        }
      }
    }
  }

  document.addEventListener('keydown', handleKeyNav);
})();
