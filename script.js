
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navLinksContainer = document.getElementById('navLinks');
  const hamburger = document.getElementById('navHamburger');
  const sections = document.querySelectorAll('section[id]');


  window.addEventListener('scroll', () => {
 
    navbar.classList.toggle('scrolled', window.scrollY > 80);

   
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });


  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });

 
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });



  document.querySelectorAll('.marquee-track').forEach(track => {
    const cards = track.querySelectorAll('.cuisine-card');
  
    cards.forEach(card => {
      track.appendChild(card.cloneNode(true));
    });
  });


  const floatVariants = ['float-left', 'float-right', 'float-scale', 'float-rotate'];
  const cardSelectors = [
    '.dest-card.reveal',
    '.spi-card.reveal',
    '.wildlife-card.reveal',
    '.gi-card.reveal',
    '.heritage-card.reveal'
  ];

  cardSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((card, i) => {
    
      const variant = floatVariants[i % floatVariants.length];
      card.classList.add(variant);

     
      card.style.setProperty('--float-seed', (Math.random() * 3).toFixed(2));
    });
  });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (i % 5 === 0) el.classList.add('parallax-slow');
    if (i % 7 === 0) el.classList.add('parallax-fast');
  });

  
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));


  let ticking = false;
  const parallaxCards = document.querySelectorAll(
    '.dest-card.reveal.visible, .cuisine-card.reveal.visible, ' +
    '.spi-card.reveal.visible, .wildlife-card.reveal.visible, ' +
    '.gi-card.reveal.visible'
  );

  function updateParallax() {
    const scrollY = window.scrollY;
    const visibleCards = document.querySelectorAll(
      '.dest-card.reveal.visible, .cuisine-card.reveal.visible, ' +
      '.spi-card.reveal.visible, .wildlife-card.reveal.visible, ' +
      '.gi-card.reveal.visible, .heritage-card.reveal.visible'
    );

    visibleCards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const viewH = window.innerHeight;

     
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const depth = ((i % 3) + 1) * 0.5; // 0.5, 1.0, or 1.5
        const offsetY = (progress - 0.5) * depth * -12;
        card.style.setProperty('--parallax-y', `${offsetY.toFixed(2)}px`);
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });



  function showTab(name) {
    document.querySelectorAll('.spiritual-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.spi-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
    event.currentTarget.classList.add('active');

   
    const panel = document.getElementById('tab-' + name);
    panel.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
  
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          revealObserver.observe(el);
        });
      });
    });
  }


  (function initReviewsSlider() {
    const track      = document.getElementById('reviewsTrack');
    const outer      = document.getElementById('reviewsTrackOuter');
    const dotsWrap   = document.getElementById('reviewsDots');
    const btnPrev    = document.getElementById('reviewPrev');
    const btnNext    = document.getElementById('reviewNext');

    if (!track) return;

    let currentIndex = 0;
    let autoTimer    = null;
    const AUTO_DELAY = 3000;

    
    function getVisible() {
      const w = window.innerWidth;
      if (w <= 720) return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    function getCards() {
      return Array.from(track.querySelectorAll('.review-card'));
    }

   
    function buildDots() {
      dotsWrap.innerHTML = '';
      const cards   = getCards();
      const visible = getVisible();
      const steps   = Math.max(1, cards.length - visible + 1);
      for (let i = 0; i < steps; i++) {
        const btn = document.createElement('button');
        btn.className = 'reviews-dot' + (i === currentIndex ? ' active' : '');
        btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
        btn.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(btn);
      }
    }

    function updateDots() {
      dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function getOffset(index) {
      const cards   = getCards();
      if (!cards.length) return 0;
      const gap     = 28;
      let cardW     = cards[0].offsetWidth;
      if (!cardW && outer) {
   
        cardW = (outer.offsetWidth - (gap * (getVisible() - 1))) / getVisible();
      }
      return index * (cardW + gap);
    }

    function goTo(index) {
      const cards   = getCards();
      const visible = getVisible();
      const maxIdx  = Math.max(0, cards.length - visible);
      currentIndex  = Math.min(Math.max(index, 0), maxIdx);

      track.style.transform = `translateX(-${getOffset(currentIndex)}px)`;
      updateDots();
      updateArrows();
    }

    function updateArrows() {
      const cards   = getCards();
      const visible = getVisible();
      const maxIdx  = Math.max(0, cards.length - visible);
      btnPrev.disabled = currentIndex === 0;
      btnNext.disabled = currentIndex >= maxIdx;
    }

    function next() {
      const cards   = getCards();
      const visible = getVisible();
      const maxIdx  = Math.max(0, cards.length - visible);
      goTo(currentIndex < maxIdx ? currentIndex + 1 : 0);
    }

    function prev() {
      const cards   = getCards();
      const visible = getVisible();
      const maxIdx  = Math.max(0, cards.length - visible);
      goTo(currentIndex > 0 ? currentIndex - 1 : maxIdx);
    }

  
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, AUTO_DELAY);
    }

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

   
    outer.addEventListener('mouseenter', stopAuto);
    outer.addEventListener('mouseleave', startAuto);


    btnPrev.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    btnNext.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

   
    let touchStartX = 0;
    outer.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    outer.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { stopAuto(); dx < 0 ? next() : prev(); startAuto(); }
    }, { passive: true });

    
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        currentIndex = 0;
        buildDots();
        goTo(0);
        startAuto();
      }, 200);
    });


    buildDots();
    goTo(0);
    startAuto();

    window._reviewsSlider = { addCard, buildDots, getCards, getVisible };

    function addCard(name, location, rating, text) {
      const initials = name.trim().charAt(0).toUpperCase();
      const colors   = [
        'linear-gradient(135deg,#E8B84B,#C0392B)',
        'linear-gradient(135deg,#2D5016,#A8D870)',
        'linear-gradient(135deg,#1A4A6B,#4ECDC4)',
        'linear-gradient(135deg,#7B3A10,#E8B84B)',
        'linear-gradient(135deg,#4A2C1A,#D4A017)',
      ];
      const bg       = colors[Math.floor(Math.random() * colors.length)];
      const stars    = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      const month    = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });

      const card = document.createElement('div');
      card.className = 'review-card';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9) translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.innerHTML = `
        <div class="review-quote-icon">"</div>
        <div class="review-stars">${stars}</div>
        <p class="review-text">${text}</p>
        <div class="review-author">
          <div class="review-avatar" style="background:${bg};">${initials}</div>
          <div class="review-author-info">
            <span class="review-name">${name}</span>
            <span class="review-location">${location ? '📍 ' + location : ''}</span>
          </div>
          <span class="review-date">${month}</span>
        </div>`;

      track.appendChild(card);

      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1) translateY(0)';
        });
      });

      buildDots();
      const cards   = getCards();
      const visible = getVisible();
      goTo(Math.max(0, cards.length - visible));
    }
  })();


  (function initReviewForm() {
    const form        = document.getElementById('reviewForm');
    const starBtns    = document.querySelectorAll('.star-btn');
    const successMsg  = document.getElementById('reviewFormSuccess');

    if (!form) return;

    let selectedRating = 0;

   
    starBtns.forEach(btn => {
      const val = parseInt(btn.dataset.val, 10);

      btn.addEventListener('mouseenter', () => {
        starBtns.forEach(b => b.classList.toggle('hovered', parseInt(b.dataset.val, 10) <= val));
      });

      btn.addEventListener('mouseleave', () => {
        starBtns.forEach(b => b.classList.remove('hovered'));
      });

      btn.addEventListener('click', () => {
        selectedRating = val;
        starBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.val, 10) <= val));
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();

      const name     = document.getElementById('reviewerName').value.trim();
      const location = document.getElementById('reviewerLocation').value.trim();
      const text     = document.getElementById('reviewText').value.trim();

      if (!name || !text || !selectedRating) {
      
        if (!name) shakeFocus(document.getElementById('reviewerName'));
        if (!text) shakeFocus(document.getElementById('reviewText'));
        if (!selectedRating) {
          const sr = document.getElementById('starRating');
          sr.style.animation = 'none';
          requestAnimationFrame(() => {
            sr.style.animation = 'shakeInput 0.4s ease';
          });
        }
        return;
      }

     
      if (window._reviewsSlider) {
        window._reviewsSlider.addCard(name, location, selectedRating, text);
      }

    
      successMsg.classList.add('visible');
      form.reset();
      selectedRating = 0;
      starBtns.forEach(b => b.classList.remove('active', 'hovered'));

      setTimeout(() => successMsg.classList.remove('visible'), 2000);
    });

    function shakeFocus(el) {
      el.style.animation = 'none';
      el.focus();
      requestAnimationFrame(() => {
        el.style.animation = 'shakeInput 0.4s ease';
      });
    }
  })();
