(function () {
  const links    = document.querySelectorAll('.hero__link');
  const mobLinks = document.querySelectorAll('.mobile-menu__link');
  if (!links.length) return;
 
  // Секции в том же порядке, что и ссылки в навигации
  // hero__link--active ставится по реально видимой секции через IntersectionObserver
  const sectionIds = ['hero', 'main', 'portfolio', 'certifications', 'contacts'];
 
  function setActive(id) {
    // Десктоп nav
    links.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('hero__link--active', href === id);
    });
    // Мобильное меню
    mobLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('mobile-menu__link--active', href === id);
    });
  }
 
  // IntersectionObserver — следит какая секция занимает большую часть экрана
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, {
    root: null,
    // Срабатывает когда секция занимает центральную зону viewport
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  });
 
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
 
  // Клик по ссылке — сразу ставим активной, не ждём скролл
  links.forEach(link => {
    link.addEventListener('click', function () {
      const id = this.getAttribute('href').replace('#', '');
      setActive(id);
    });
  });
 
  mobLinks.forEach(link => {
    link.addEventListener('click', function () {
      const id = this.getAttribute('href').replace('#', '');
      setActive(id);
    });
  });
})();
 
 
/* ------------------------------------------------
   2. БУРГЕР-МЕНЮ
   ------------------------------------------------ */
(function () {
  const burger = document.querySelector('.hero__burger');
  const menu   = document.getElementById('mobileMenu');
  const close  = document.getElementById('menuClose');
 
  if (!burger || !menu) return;
 
  burger.addEventListener('click', () => {
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
 
  if (close) {
    close.addEventListener('click', () => {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }
 
  menu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
})();
 
 
/* ------------------------------------------------
   3. СЛАЙДЕР ПОРТФОЛИО
   ------------------------------------------------ */
(function () {
  const slider      = document.querySelector('.team_our_portfolio_slider');
  const track       = document.querySelector('.team_our_portfolio_content');
  const cards       = document.querySelectorAll('.team_our_portfolio_card');
  const prevBtn     = document.querySelector('.slider_btn.prev');
  const nextBtn     = document.querySelector('.slider_btn.next');
  const fillBar     = document.querySelector('.slider_fill');
  const currentSpan = document.querySelector('.slider_current');
  const totalSpan   = document.querySelector('.slider_total');
 
  if (!slider || !track || !cards.length || !prevBtn || !nextBtn) return;
 
  let currentIndex = 0;
  let visibleCount = 3;
  let cardWidth    = 0;
  let gap          = 24;
 
  function updateLayout() {
    cardWidth    = cards[0].offsetWidth;
    gap          = parseFloat(getComputedStyle(track).gap) || 24;
    visibleCount = window.innerWidth <= 768 ? 1 : 3;
 
    cards.forEach((card, i) => {
      card.style.display = (visibleCount === 1 && i > 0) ? 'none' : 'flex';
    });
 
    currentIndex = Math.min(currentIndex, Math.max(0, cards.length - visibleCount));
    updateSlider();
  }
 
  function updateSlider() {
    const offset = -(cardWidth + gap) * currentIndex;
    track.style.transform = `translateX(${offset}px)`;
 
    const maxIndex    = Math.max(0, cards.length - visibleCount);
    const totalPages  = Math.ceil(cards.length / visibleCount);
    const currentPage = Math.floor(currentIndex / visibleCount) + 1;
 
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
 
    if (fillBar) {
      // Ползунок: ширина = 1/totalPages трека, двигается translateX
      const thumbW   = 100 / totalPages;
      const thumbOff = (currentPage - 1) * thumbW;
      fillBar.style.width     = `${thumbW}%`;
      fillBar.style.transform = `translateX(${thumbOff / thumbW * 100}%)`;
    }
 
    if (currentSpan) currentSpan.textContent = String(currentPage).padStart(2, '0');
    if (totalSpan)   totalSpan.textContent   = String(totalPages).padStart(2, '0');
  }
 
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex = Math.max(0, currentIndex - visibleCount);
      updateSlider();
    }
  });
 
  nextBtn.addEventListener('click', () => {
    const maxIndex = Math.max(0, cards.length - visibleCount);
    if (currentIndex < maxIndex) {
      currentIndex = Math.min(maxIndex, currentIndex + visibleCount);
      updateSlider();
    }
  });
 
  window.addEventListener('resize', updateLayout);
  updateLayout();
})();
 
 
/* ------------------------------------------------
   4. СЛАЙДЕР TRUSTED PARTNERS
   ------------------------------------------------ */
(function () {
  const track     = document.getElementById('tpTrack');
  const currentEl = document.getElementById('tpCurrent');
  const totalEl   = document.getElementById('tpTotal');
  const fillEl    = document.getElementById('tpFill');
  const prevBtn   = document.querySelector('.tp-arrow--prev');
  const nextBtn   = document.querySelector('.tp-arrow--next');
 
  if (!track || !prevBtn || !nextBtn) return;
 
  const cards = track.querySelectorAll('.tp-card');
  const total = cards.length;
  let current = 0;
 
  if (totalEl) totalEl.textContent = String(total).padStart(2, '0');
 
  function render() {
    if (window.innerWidth <= 768) return;
 
    track.style.transform = `translateX(-${current * 100}%)`;
 
    if (currentEl) currentEl.textContent = String(current + 1).padStart(2, '0');
 
    if (fillEl) {
      // Ползунок: ширина = 1/total трека, двигается translateX
      const thumbW = 100 / total;
      fillEl.style.width     = `${thumbW}%`;
      fillEl.style.transform = `translateX(${current * 100}%)`;
    }
 
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }
 
  prevBtn.addEventListener('click', () => {
    if (current > 0) { current--; render(); }
  });
 
  nextBtn.addEventListener('click', () => {
    if (current < total - 1) { current++; render(); }
  });
 
  window.addEventListener('resize', render);
  render();
})();
 
 
/* ------------------------------------------------
   5. FAQ — аккордеон
   ------------------------------------------------ */
(function () {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;
 
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        items.forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });
})();
 
 
/* ------------------------------------------------
   6. CTA — валидация телефона
   ------------------------------------------------ */
(function () {
  const input = document.getElementById('ctaPhone');
  const btn   = document.getElementById('ctaSubmit');
  const note  = document.getElementById('ctaDisclaimer');
 
  if (!input || !btn) return;
 
  const MSG_DEFAULT = '*By clicking on the button, you agree to the privacy policy and give consent to the processing of your personal data.';
  const MSG_INVALID = '⚠ Please enter a valid phone number.';
  const MSG_EMPTY   = '⚠ Please enter your phone number.';
  const MSG_SUCCESS = '✓ Thank you! We will contact you within 24 hours.';
 
  function isValid(val) {
    return /[\d\s\-\+\(\)]{7,}/.test(val);
  }
 
  function setNote(text, color) {
    if (!note) return;
    note.textContent = text;
    note.style.color = color || '';
  }
 
  function validate() {
    const val = input.value.trim();
    const ok  = isValid(val);
 
    if (!ok && val.length > 0) {
      input.classList.add('cta__input--error');
      setNote(MSG_INVALID, '#F55D6D');
      setNote(MSG_EMPTY,   '#F55D6D');
    } else {
      input.classList.remove('cta__input--error');
      setNote(MSG_DEFAULT);
    }
    return ok;
  }
 
  input.addEventListener('blur', validate);
  input.addEventListener('input', () => {
    if (input.classList.contains('cta__input--error')) validate();
  });
 
  btn.addEventListener('click', () => {
    if (!input.value.trim()) {
      input.classList.add('cta__input--error');
      setNote(MSG_EMPTY, '#e05555');
      input.focus();
      return;
    }
    if (validate()) {
      setNote(MSG_SUCCESS, '#4fc97e');
      input.value = '';
      input.classList.remove('cta__input--error');
    }
  });
})();
 
 
/* ------------------------------------------------
   7. FOOTER — валидация телефона
   ------------------------------------------------ */
(function () {
  const input = document.getElementById('footerPhone');
  const btn   = document.getElementById('footerSubmit');
 
  if (!input || !btn) return;
 
  function isValid() {
    return /[\d\s\-\+\(\)]{7,}/.test(input.value.trim());
  }
 
  input.addEventListener('blur', () => {
    if (input.value.trim() && !isValid()) {
      input.classList.add('footer__input--error');
    } else {
      input.classList.remove('footer__input--error');
    }
  });
 
  input.addEventListener('input', () => {
    if (input.classList.contains('footer__input--error') && isValid()) {
      input.classList.remove('footer__input--error');
    }
  });
 
  btn.addEventListener('click', () => {
    if (!input.value.trim() || !isValid()) {
      input.classList.add('footer__input--error');
      input.focus();
      return;
    }
    input.classList.remove('footer__input--error');
    input.value = '';
  });
})();