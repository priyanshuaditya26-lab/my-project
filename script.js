/* js/script.js
   - Handles carousel (used on index) and populates news lists
   - Handles contact form client-side behavior
*/

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  populateIndexNews();
  populateNewsPage();
  setupContactForm();
});

/* ---------- Carousel ---------- */
function initCarousel(){
  const viewport = document.getElementById('carouselViewport');
  if (!viewport) return;

  const slides = Array.from(viewport.querySelectorAll('.slide'));
  if (slides.length === 0) return;

  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsBar = document.getElementById('carouselDots');

  slides.forEach((s, i) => {
    s.dataset.index = i;
    s.id = `slide-${i}`;
    s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
  });

  // build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.index = i;
    b.className = i === 0 ? 'dot active' : 'dot';
    b.setAttribute('aria-label', `Go to slide ${i+1}`);
    b.addEventListener('click', () => goToSlide(i));
    dotsBar.appendChild(b);
  });

  let current = 0;
  let interval = setInterval(() => nextSlide(), 4500);
  let paused = false;

  function show(index){
    slides.forEach((s, i) => {
      s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    // dots
    Array.from(dotsBar.children).forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    current = index;
  }

  function nextSlide(){
    const nxt = (current + 1) % slides.length;
    show(nxt);
  }
  function prevSlide(){
    const prev = (current - 1 + slides.length) % slides.length;
    show(prev);
  }
  function goToSlide(i){
    show(i % slides.length);
    restartInterval();
  }
  function restartInterval(){
    clearInterval(interval);
    interval = setInterval(() => { if (!paused) nextSlide(); }, 4500);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); restartInterval(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); restartInterval(); });

  // pause on hover/focus
  const carouselRoot = document.querySelector('.carousel');
  if (carouselRoot){
    carouselRoot.addEventListener('mouseenter', () => paused = true);
    carouselRoot.addEventListener('mouseleave', () => paused = false);
    carouselRoot.addEventListener('focusin', () => paused = true);
    carouselRoot.addEventListener('focusout', () => paused = false);
  }

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextSlide(); restartInterval(); }
    if (e.key === 'ArrowLeft') { prevSlide(); restartInterval(); }
  });
}

/* ---------- News population (used on index and news pages) ---------- */
function getSampleNews(){
  return [
    { id:1, title:'NHREC releases new ethics guideline', date:'2025-10-01', summary:'Summary of the guideline and its scope.' },
    { id:2, title:'Call for research proposals on public health ethics', date:'2025-09-12', summary:'Open call for proposals and funding opportunities.' },
    { id:3, title:'Committee meeting minutes published', date:'2025-08-25', summary:'Minutes of the last NHREC meeting are now available.' }
  ];
}

function populateIndexNews(){
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  const news = getSampleNews();
  news.slice(0,3).forEach(n => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<h4>${escapeHtml(n.title)}</h4><p><small>${escapeHtml(n.date)}</small></p><p>${escapeHtml(n.summary)}</p><p><a href="news.html">Read more</a></p>`;
    grid.appendChild(div);
  });
}

function populateNewsPage(){
  const list = document.getElementById('newsList');
  if (!list) return;
  const news = getSampleNews();
  news.forEach(n => {
    const d = document.createElement('article');
    d.className = 'card';
    d.innerHTML = `<h3>${escapeHtml(n.title)}</h3><small>${escapeHtml(n.date)}</small><p>${escapeHtml(n.summary)}</p><p><a href="#">Read full article</a></p>`;
    list.appendChild(d);
  });
}

/* ---------- Contact form ---------- */
function setupContactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const result = document.getElementById('contactResult');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // In production send to backend API; here we simulate success
    if (result) result.textContent = 'Thank you — your message has been sent.';
    form.reset();
  });
}

/* ---------- Utilities ---------- */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
