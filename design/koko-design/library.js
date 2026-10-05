(() => {
  // Pick one approved Style A character favicon once per document load.
  const faviconHeads = ['koko', 'gohanko', 'bear', 'rabbit', 'yauyau', 'tree'];
  const selectedFavicon = faviconHeads[Math.floor(Math.random() * faviconHeads.length)];
  const scriptBase = document.currentScript?.src || new URL('library.js', document.baseURI).href;
  const faviconLink = document.querySelector('link[rel~="icon"]') || document.head.appendChild(document.createElement('link'));
  faviconLink.rel = 'icon';
  faviconLink.type = 'image/png';
  faviconLink.setAttribute('sizes', '64x64');
  faviconLink.dataset.character = selectedFavicon;
  faviconLink.href = new URL(`logo-collection/favicons/favicon-${selectedFavicon}.png`, scriptBase).href;

  // Standalone review and helper pages use only the shared favicon behavior.
  const search = document.querySelector('#search');
  const grid = document.querySelector('.masonry');
  if (!search || !grid) return;

  let selected = 'All';
  const pins = [...document.querySelectorAll('.pin')];
  const count = document.querySelector('#count');
  const empty = document.querySelector('.empty');

  function filter() {
    let visibleCount = 0;
    const query = search.value.trim().toLowerCase();
    for (const pin of pins) {
      const show = (selected === 'All' || pin.dataset.category === selected)
        && pin.textContent.toLowerCase().includes(query);
      pin.hidden = !show;
      if (show) visibleCount += 1;
    }
    if (count) count.textContent = `${visibleCount} items in this collection`;
    if (empty) empty.hidden = visibleCount !== 0;
  }

  search.addEventListener('input', filter);
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    filter();
  }));

  const modal = document.querySelector('dialog');
  if (modal) {
    const previewImage = modal.querySelector('img');
    const previewTitle = modal.querySelector('h2');
    const previewLink = modal.querySelector('a');

    document.querySelectorAll('.pin-media').forEach(button => button.addEventListener('click', () => {
      previewImage.src = button.dataset.src;
      previewImage.alt = button.dataset.title;
      previewTitle.textContent = button.dataset.title;

      if (button.dataset.asset) {
        previewLink.href = button.dataset.asset;
        previewLink.setAttribute('download', '');
        previewLink.textContent = 'Download asset ↗';
      } else {
        previewLink.href = button.dataset.drive || 'https://drive.google.com/drive/folders/1O-DoyQILHphHDRthStbN0SGrFFkLFman';
        previewLink.removeAttribute('download');
        previewLink.textContent = 'Open in Google Drive ↗';
      }

      modal.showModal();
    }));

    modal.querySelector('button')?.addEventListener('click', () => modal.close());
    modal.addEventListener('click', event => {
      if (event.target !== modal) return;
      const bounds = modal.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom) modal.close();
    });
  }

  filter();

  // Preserve masonry packing while allowing guideline cards to span two columns.
  function layoutCards() {
    const styles = getComputedStyle(grid);
    const gap = parseFloat(styles.rowGap);
    const row = parseFloat(styles.gridAutoRows);
    for (const pin of pins) {
      if (!pin.hidden) {
        pin.style.gridRowEnd = `span ${Math.ceil((pin.getBoundingClientRect().height + gap) / (row + gap))}`;
      }
    }
  }

  const observer = new ResizeObserver(() => requestAnimationFrame(layoutCards));
  pins.forEach(pin => observer.observe(pin));
  window.addEventListener('resize', layoutCards);
  search.addEventListener('input', () => requestAnimationFrame(layoutCards));
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => requestAnimationFrame(layoutCards)));
  document.querySelectorAll('img').forEach(image => image.addEventListener('load', layoutCards));
  layoutCards();
})();
