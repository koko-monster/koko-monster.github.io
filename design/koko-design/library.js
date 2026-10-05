(() => {
  // Pick one approved Style A character favicon once per document load.
  const faviconHeads = ['koko', 'gohanko', 'bear', 'rabbit', 'yauyau', 'tree'];
  const selectedFavicon = faviconHeads[Math.floor(Math.random() * faviconHeads.length)];
  const scriptBase = document.currentScript?.src || new URL('library.js', document.baseURI).href;
  const latestLogo = new URL('logo-collection/LOGO-004-six-heads-kokomonster.gif', scriptBase).href;
  document.querySelectorAll('.official-logo').forEach(image => {
    image.src = latestLogo;
  });
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

  const newsScenes = [
    ['KM-SCN-NEWS-001', 'royal-status-letter', 'Royal status letter', 'Easy News · Koko and Gohanko', '1MTxObGJMsTDrZhLW9IH0FVHz_41McKw9'],
    ['KM-SCN-NEWS-002', 'sumo-yokozuna-promotion', 'Yokozuna promotion', 'Easy News · Bear', '16_bbY6vzobqUSMFrStGfIWQXfnF3noJp'],
    ['KM-SCN-NEWS-003', 'suica-mascot-public-vote', 'Suica mascot public vote', 'Easy News · Ensemble', '1A08y0WYK9Y_RDJAuY7tlgs9zm5xJ0GSq'],
    ['KM-SCN-NEWS-004', 'aomori-earthquake-preparedness', 'Aomori earthquake preparedness', 'Easy News · Koko and Tree', '19hX6zWMc3sisqcwYGAfr7wVlDNscU97v'],
    ['KM-SCN-NEWS-005', 'un-world-map-adoption', 'New world map', 'Easy News · Ensemble', '1FHK468XYlEz2As5qJ86-RpE1r9_shrnZ'],
    ['KM-SCN-NEWS-006', 'nepal-china-landslide-response', 'Nepal–China landslide response', 'Easy News · Tree and Yauyau', '1xszVlErkvn_v4LgWk5g0uxM10ZzDrYed'],
    ['KM-SCN-NEWS-007', 'ukraine-emergency-radio-briefing', 'Ukraine emergency radio briefing', 'Easy News · Bear and Yauyau', '1jdmBwgGfWnFGpGseeGi4veh_DzcutzN4'],
    ['KM-SCN-NEWS-008', 'nepal-tibet-landslide-coordination', 'Nepal–Tibet landslide coordination', 'Easy News · Bear and Rabbit', '18SBNpbg-V-rwWNFqXVlX6HRmOWpn_nk6'],
    ['KM-SCN-NEWS-009', 'nepal-china-flash-flood-monitoring', 'Nepal–China flash-flood monitoring', 'Easy News · Koko and Gohanko', '1ZVzraSCzTfsCI4gYdOTyB8e-f_vVEcWQ'],
    ['KM-SCN-NEWS-010', 'royal-return-to-britain', 'Return to Britain', 'Easy News · Koko and Gohanko', '1GEQyyEGQKDiEkNkrVjwz051JtQWqb1xO'],
    ['KM-SCN-NEWS-011', 'iran-womens-choice', 'Women’s choice in Iran', 'Easy News · Rabbit and Gohanko', '1kmJhQjxTAzPqr7zTfSUUBSKVZ4qZFEDP'],
    ['KM-SCN-NEWS-012', 'canada-us-trade-talks', 'Canada–US trade talks', 'Easy News · Ensemble', '1jU4ySifJyT_HVvBOSYmyaEsXe_PZDv7h'],
    ['KM-SCN-NEWS-013', 'west-bank-housing-planning', 'West Bank housing planning', 'Easy News · Gohanko and Tree', '15eimZ3bEUziy7QyuSBg-37JRL-5N1R8a'],
    ['KM-SCN-NEWS-014', 'malacca-aircraft-carrier', 'Malacca Strait carrier passage', 'Easy News · Yauyau and Rabbit', '1kfYo5khX8OJRqz76BDAPMG1lQ-Uxe4kN']
  ];

  if (location.pathname.endsWith('/asset/index.html')) {
    const filterBar = document.querySelector('.filters');
    if (filterBar && !filterBar.querySelector('[data-filter="News scenes"]')) {
      const filterButton = document.createElement('button');
      filterButton.type = 'button';
      filterButton.dataset.filter = 'News scenes';
      filterButton.setAttribute('aria-pressed', 'false');
      filterButton.textContent = 'News scenes';
      filterBar.querySelector('[data-filter="Style A"]')?.after(filterButton);
    }

    const originalRoot = new URL('asset/news-scenes/', scriptBase).href;
    const thumbnailRoot = new URL('thumbs/asset/news-scenes/', scriptBase).href;
    const newsCards = document.createDocumentFragment();
    for (const [id, slug, title, description, driveId] of newsScenes) {
      const card = document.createElement('article');
      const thumbnail = `${thumbnailRoot}${id}-${slug}.jpg`;
      const original = `${originalRoot}${id}-${slug}.png`;
      const drive = `https://drive.google.com/file/d/${driveId}/view?usp=drivesdk`;
      card.className = 'pin';
      card.dataset.category = 'News scenes';
      card.innerHTML = `<button class="pin-media" data-src="${thumbnail}" data-drive="${drive}" data-title="${title}" aria-label="Preview ${title}"><img src="${thumbnail}" alt="${title}" loading="lazy" decoding="async"></button><div class="pin-body"><span class="tag">News scenes · ${id}</span><h2>${title}</h2><p>${description}</p><a href="${drive}" target="_blank" rel="noopener">Open original in Google Drive ↗</a><a class="asset-fallback" href="${original}" download>Download local original ↗</a></div>`;
      newsCards.append(card);
    }
    grid.prepend(newsCards);
  }

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
