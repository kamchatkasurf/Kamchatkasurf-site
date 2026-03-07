(function () {
  'use strict';

  // ----- Smooth scroll for all internal links -----
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href && href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var headerOffset = 70;
          var elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          var offsetPosition = elementPosition - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  // ----- Social proof: count-up + scroll animation -----
  var countEl = document.querySelector('.social-proof-number[data-count]');
  if (countEl) {
    var countTo = parseInt(countEl.getAttribute('data-count'), 10) || 10000;
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function animateCount(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 2);
      var current = Math.floor(easeOut * countTo);
      countEl.textContent = current.toLocaleString('ru-RU');
      if (progress < 1) requestAnimationFrame(animateCount);
      else countEl.textContent = countTo.toLocaleString('ru-RU');
    }

    var observerCount = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          requestAnimationFrame(animateCount);
          observerCount.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observerCount.observe(countEl.parentElement);
  }

  // ----- Social proof cards: fade in on scroll -----
  document.querySelectorAll('.social-proof-card[data-animate]').forEach(function (card, i) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, i * 80);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(card);
  });

  // ----- Philosophy carousel -----
  var philosophyCarousel = document.querySelector('[data-carousel="philosophy"]');
  if (philosophyCarousel) {
    var track = philosophyCarousel.querySelector('.carousel-track');
    var slides = philosophyCarousel.querySelectorAll('.carousel-slide');
    var prevBtn = philosophyCarousel.querySelector('.carousel-btn-prev');
    var nextBtn = philosophyCarousel.querySelector('.carousel-btn-next');
    var current = 0;
    var total = slides.length;
    var autoplayInterval = 8000;
    var timer = null;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
    }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(function () {
        goTo(current + 1);
      }, autoplayInterval);
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startAutoplay(); });
    philosophyCarousel.addEventListener('mouseenter', stopAutoplay);
    philosophyCarousel.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  // ----- Reviews carousel -----
  var reviewsCarousel = document.querySelector('[data-carousel="reviews"]');
  if (reviewsCarousel) {
    var reviewsTrack = reviewsCarousel.querySelector('.reviews-track');
    var reviewCards = reviewsCarousel.querySelectorAll('.review-card');
    var revPrev = reviewsCarousel.querySelector('.carousel-btn-prev');
    var revNext = reviewsCarousel.querySelector('.carousel-btn-next');
    var dotsContainer = reviewsCarousel.querySelector('.reviews-dots');
    var revCurrentPage = 0;
    var revTotal = reviewCards.length;
    var perView = window.innerWidth >= 768 ? 2 : 1;

    function getTotalPages() {
      return Math.ceil(revTotal / perView);
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      var totalPages = getTotalPages();
      for (var d = 0; d < totalPages; d++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'reviews-dot' + (d === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Страница ' + (d + 1));
        dot.addEventListener('click', function (e) {
          var idx = Array.prototype.indexOf.call(dotsContainer.children, e.target);
          if (idx >= 0) revGoTo(idx);
        });
        dotsContainer.appendChild(dot);
      }
    }

    function revGoTo(pageIndex) {
      var totalPages = getTotalPages();
      revCurrentPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
      var cardWidth = 100 / revTotal;
      var offset = revCurrentPage * perView * cardWidth;
      reviewsTrack.style.transform = 'translateX(-' + offset + '%)';
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.reviews-dot').forEach(function (d, i) {
          d.classList.toggle('active', i === revCurrentPage);
        });
      }
    }

    if (revPrev) revPrev.addEventListener('click', function () { revGoTo(revCurrentPage - 1); });
    if (revNext) revNext.addEventListener('click', function () { revGoTo(revCurrentPage + 1); });

    buildDots();
    revGoTo(0);

    window.addEventListener('resize', function () {
      perView = window.innerWidth >= 768 ? 2 : 1;
      buildDots();
      revGoTo(0);
    });
  }

  // ----- Program popup -----
  var programData = {
    group: {
      title: 'Групповой урок серфинга',
      price: '7500 ₽',
      desc: 'Тренировка проходит в группе до 7 чел. на одного инструктора. Подходит для первого знакомства с серфингом и базовой практики.',
      suit: ['новичкам', 'тем, кто хочет попробовать серфинг', 'тем, кто хочет продолжить практику'],
      include: ['инструктаж по безопасности', 'разминка перед тренировкой', 'занятие в океане с инструктором', 'доска для серфинга', 'гидрокостюм']
    },
    indiv: {
      title: 'Индивидуальный урок серфинга',
      price: '15000 ₽',
      desc: 'Персональная тренировка с полной концентрацией на технике. Формат позволяет быстрее разобраться в базовых элементах серфинга.',
      suit: ['новичкам', 'продолжающим серферам', 'тем, кто хочет ускорить прогресс'],
      include: ['индивидуальная работа с инструктором', 'разбор техники', 'практика в океане', 'доска для серфинга', 'гидрокостюм']
    },
    '5days': {
      title: '5-дневная спортивная программа',
      price: '35000 ₽',
      desc: 'Серия тренировок, которая помогает постепенно освоить базовые навыки и почувствовать уверенность в океане.',
      suit: ['новичкам', 'тем, кто хочет системную практику'],
      include: ['тренировки с инструктором', 'последовательная программа обучения', 'оборудование для серфинга', 'поддержка инструкторов']
    },
    camp: {
      title: '7-дневный тренировочный сбор',
      price: '150000 ₽',
      desc: 'Интенсивная программа тренировок с глубоким погружением в серфинг. Неделя регулярной практики помогает значительно улучшить навыки.',
      suit: ['мотивированным новичкам', 'продолжающим серферам'],
      include: ['5 уроков серфинга', 'видеоразбор после каждого урока', 'оборудование для серфинга', 'размещение в серф-лагере 6 ночей', 'питание – полный пансион']
    }
  };

  var popup = document.getElementById('program-popup');
  var popupContent = document.getElementById('popup-content');
  var popupClose = document.getElementById('popup-close');

  function openPopup(key) {
    var data = programData[key];
    if (!data || !popup || !popupContent) return;
    popupContent.innerHTML =
      '<h3 id="popup-title">' + escapeHtml(data.title) + '</h3>' +
      '<p class="popup-price">' + escapeHtml(data.price) + '</p>' +
      '<div class="popup-desc">' + escapeHtml(data.desc) + '</div>' +
      '<div class="popup-suit"><h4>Кому подходит</h4><ul><li>' + data.suit.map(escapeHtml).join('</li><li>') + '</li></ul></div>' +
      '<div class="popup-include"><h4>Что включено</h4><ul><li>' + data.include.map(escapeHtml).join('</li><li>') + '</li></ul></div>' +
      '<a href="#form-section" class="cta-floating">Хочу в серф-лагерь</a>';
    popup.setAttribute('aria-hidden', 'false');
    popup.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    popupContent.querySelector('a[href="#form-section"]').addEventListener('click', function (e) {
      e.preventDefault();
      popup.classList.remove('is-open');
      document.body.style.overflow = '';
      document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  if (popupClose) popupClose.addEventListener('click', closePopup);
  if (popup) {
    popup.addEventListener('click', function (e) {
      if (e.target === popup) closePopup();
    });
  }

  document.querySelectorAll('.program-card').forEach(function (card) {
    var key = card.getAttribute('data-program');
    card.addEventListener('click', function () { openPopup(key); });
  });

  // ----- Gallery lightbox -----
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-image');
  var lightboxClose = lightbox && lightbox.querySelector('.lightbox-close');
  var lightboxPrev = lightbox && lightbox.querySelector('.lightbox-prev');
  var lightboxNext = lightbox && lightbox.querySelector('.lightbox-next');
  var galleryUrls = Array.prototype.map.call(galleryItems, function (el) {
    var bg = el.style.backgroundImage;
    if (bg && bg !== 'none') return bg.replace(/url\(['"]?([^'")]+)['"]?\)/, '$1');
    return '';
  });
  var lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = (index + galleryUrls.length) % galleryUrls.length;
    if (lightboxImg && galleryUrls[lightboxIndex]) {
      lightboxImg.src = galleryUrls[lightboxIndex];
      lightboxImg.alt = 'Фото ' + (lightboxIndex + 1);
    }
    if (lightbox) {
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function lightboxPrevNext(delta) {
    lightboxIndex = (lightboxIndex + delta + galleryUrls.length) % galleryUrls.length;
    if (lightboxImg && galleryUrls[lightboxIndex]) {
      lightboxImg.src = galleryUrls[lightboxIndex];
      lightboxImg.alt = 'Фото ' + (lightboxIndex + 1);
    }
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { lightboxPrevNext(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { lightboxPrevNext(1); });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrevNext(-1);
    if (e.key === 'ArrowRight') lightboxPrevNext(1);
  });

  // ----- Form -----
  var form = document.getElementById('lead-form');
  var formSuccess = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var phone = (form.querySelector('[name="phone"]') || {}).value || '';
      var email = (form.querySelector('[name="email"]') || {}).value || '';
      var offer = form.querySelector('[name="accept_offer"]');
      var privacy = form.querySelector('[name="accept_privacy"]');
      var personal = form.querySelector('[name="accept_personal_data"]');
      if (!name.trim() || !phone.trim() || !email.trim()) {
        return;
      }
      if (!offer || !offer.checked || !privacy || !privacy.checked || !personal || !personal.checked) {
        return;
      }
      var data = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim()
      };
      var submitBtn = form.querySelector('.form-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
      }
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        return r.json().then(function (json) {
          if (!r.ok) throw new Error(json.error || 'Ошибка отправки');
          return json;
        });
      }).then(function () {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Хочу в серф-лагерь';
        }
        if (formSuccess) {
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }).catch(function (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Хочу в серф-лагерь';
        }
        alert('Не удалось отправить заявку. Попробуйте позже или свяжитесь с нами по телефону.');
      });
    });
  }

  // ----- Hide floating CTA when form is visible -----
  var floatingCta = document.getElementById('cta-floating');
  var formSection = document.getElementById('form-section');
  if (floatingCta && formSection) {
    var ctaObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          floatingCta.classList.add('is-hidden');
        } else {
          floatingCta.classList.remove('is-hidden');
        }
      });
    }, { threshold: 0.3 });
    ctaObserver.observe(formSection);
  }
})();
