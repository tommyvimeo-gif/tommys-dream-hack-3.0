// Mobile nav toggle
document.querySelectorAll('.nav-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const links = btn.closest('.nav-inner').querySelector('.nav-links');
    links.classList.toggle('open');
  });
});

// Smooth reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .gallery img, .content-block, .video-wrapper').forEach(el => {
  observer.observe(el);
});

// Optional: change background image slowly
const bgEl = document.querySelector('.bg-image');
if (bgEl && !document.querySelector('.bg-ps')) {
  const pageBgs = (bgEl.dataset.cycle || '')
    .split('|')
    .map(s => s.trim())
    .filter(Boolean);
  if (pageBgs.length > 1) {
    let bgIndex = 0;
    setInterval(() => {
      bgIndex = (bgIndex + 1) % pageBgs.length;
      bgEl.style.opacity = '0';
      setTimeout(() => {
        bgEl.style.backgroundImage = `url('${pageBgs[bgIndex]}')`;
        bgEl.style.opacity = '0.55';
      }, 700);
    }, 14000);
  }
}

// Lightbox — click any image to zoom
(function () {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `
    <button class="lightbox-close" aria-label="Zapri">×</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Prejšnja">‹</button>
    <button class="lightbox-nav lightbox-next" aria-label="Naslednja">›</button>
    <img alt="">
    <p class="lightbox-caption"></p>
  `;
  document.body.appendChild(box);

  const view = box.querySelector('img');
  const caption = box.querySelector('.lightbox-caption');
  let list = [];
  let index = 0;

  function hiRes(src) {
    if (!src) return src;
    if (src.includes('images.unsplash.com')) {
      return src.replace(/([?&])w=\d+/, '$1w=1600').replace(/&q=\d+/, '&q=85');
    }
    return src;
  }

  function collect() {
    return Array.from(document.querySelectorAll('img')).filter(img => !box.contains(img) && img.src);
  }

  function show(i) {
    if (!list.length) return;
    index = (i + list.length) % list.length;
    const img = list[index];
    view.src = hiRes(img.currentSrc || img.src);
    view.alt = img.alt || '';
    caption.textContent = img.alt || '';
  }

  function open(img) {
    list = collect();
    index = Math.max(0, list.indexOf(img));
    show(index);
    box.classList.add('open');
    document.body.classList.add('lightbox-open');
  }

  function close() {
    box.classList.remove('open');
    document.body.classList.remove('lightbox-open');
  }

  document.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img || box.contains(img)) return;
    e.preventDefault();
    e.stopPropagation();
    open(img);
  }, true);

  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); show(index - 1); });
  box.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); show(index + 1); });
  box.addEventListener('click', (e) => { if (e.target === box) close(); });

  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();