// ---- wheel scrolling ----
// Lets a normal mouse wheel scroll the horizontal image row.
// Touch users on mobile can already swipe left/right natively.
function enableWheelScroll(row) {
  row.addEventListener(
    'wheel',
    (e) => {
      // Only hijack the wheel when the scroll is mostly vertical,
      // so trackpads that already scroll sideways still work normally.
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        row.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );
}

// ---- config-driven collage ----
// Reads config/<category>_config.txt, then loads each listed file from
// images/<category>/ into the page as a collage tile.
async function loadCollage(category, row) {
  let files = [];

  try {
    const res = await fetch(`config/${category}_config.txt`);
    if (!res.ok) throw new Error('config file not found');
    const text = await res.text();
    files = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
  } catch (err) {
    row.innerHTML = `<p class="empty-msg">Couldn't load config/${category}_config.txt — make sure the config folder uploaded correctly.</p>`;
    return;
  }

  if (files.length === 0) {
    row.innerHTML = `<p class="empty-msg">No images yet. Add file names to config/${category}_config.txt and drop the matching files in images/${category}/.</p>`;
    return;
  }

  row.innerHTML = '';
  files.forEach((filename, i) => {
    const img = document.createElement('img');
    img.className = 'collage-item';
    img.style.setProperty('--i', i);
    img.loading = 'lazy';
    img.alt = filename;
    img.src = `images/${category}/${filename}`;
    img.addEventListener('error', () => {
      img.remove();
    });
    row.appendChild(img);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const row = document.querySelector('.scroll-row');
  if (!row) return;

  enableWheelScroll(row);

  const category = document.body.dataset.category;
  if (category) {
    loadCollage(category, row);
  }
});
