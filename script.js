// 스마트워크톤 - 로컬 전용 (서버/DB 없음)
lucide.createIcons();

function removeEmptyLines(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .join('\n');
}

function resizeAutoTextarea(el) {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

function initAutoTextareas() {
  document.querySelectorAll('.auto-textarea').forEach((el) => {
    resizeAutoTextarea(el);
    el.addEventListener('input', () => resizeAutoTextarea(el));

    el.addEventListener('copy', (e) => {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = start === end ? el.value : el.value.slice(start, end);
      e.preventDefault();
      e.clipboardData.setData('text/plain', removeEmptyLines(selected));
    });

    el.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const cleaned = removeEmptyLines(pasted);
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const value = el.value;
      el.value = value.slice(0, start) + cleaned + value.slice(end);
      const caret = start + cleaned.length;
      el.selectionStart = caret;
      el.selectionEnd = caret;
      resizeAutoTextarea(el);
      el.dispatchEvent(new Event('input'));
    });
  });
}

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const wrap = btn.closest('.textarea-with-copy');
      const textarea = wrap?.querySelector('.auto-textarea');
      if (!textarea) return;

      const text = removeEmptyLines(textarea.value);

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const original = textarea.value;
        textarea.value = text;
        textarea.select();
        document.execCommand('copy');
        textarea.value = original;
        resizeAutoTextarea(textarea);
      }

      btn.classList.add('copied');
      btn.setAttribute('aria-label', '복사됨');
      btn.innerHTML = '<i data-lucide="check" class="h-4 w-4"></i><span>복사됨</span>';
      lucide.createIcons();

      setTimeout(() => {
        btn.classList.remove('copied');
        btn.setAttribute('aria-label', '복사');
        btn.innerHTML = '<i data-lucide="copy" class="h-4 w-4"></i><span>복사</span>';
        lucide.createIcons();
      }, 1500);
    });
  });
}

function initCancelButtons() {
  document.querySelectorAll('.cancel-btn').forEach((btn) => {
    const wrap = btn.closest('.textarea-with-copy');
    const textarea = wrap?.querySelector('.auto-textarea');
    if (!textarea) return;

    const original = textarea.value;

    btn.addEventListener('click', () => {
      textarea.value = original;
      resizeAutoTextarea(textarea);
      textarea.focus();
    });
  });
}

initAutoTextareas();
initCopyButtons();
initCancelButtons();
window.addEventListener('resize', initAutoTextareas);
