// ==========================================================================
// MACIEJ MATUSZEWSKI PORTFOLIO — PEŁNY I KOMPLETNY GŁÓWNY SKRYPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================================
     1. PRZEŁĄCZNIK MOTYWU (DARK / LIGHT MODE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  if (themeToggleBtn) {
    const savedTheme = localStorage.getItem('mm_theme') || 'dark';
    if (savedTheme === 'light') {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
    } else {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
    }

    themeToggleBtn.addEventListener('click', function () {
      if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        htmlElement.classList.add('light');
        localStorage.setItem('mm_theme', 'light');
      } else {
        htmlElement.classList.remove('light');
        htmlElement.classList.add('dark');
        localStorage.setItem('mm_theme', 'dark');
      }
    });
  }

  /* ==========================================================================
     2. MENU MOBILNE (HAMBURGER)
     ========================================================================== */
  const menuToggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggleBtn && mobileMenu) {
    menuToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     3. AKORDEON (USŁUGI)
     ========================================================================== */
  const accordionHeaders = document.querySelectorAll('.accordion-header, .service-header');

  accordionHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      const parent = header.closest('.accordion-item, .service-card');
      if (!parent) return;

      document.querySelectorAll('.accordion-item, .service-card').forEach(function (item) {
        if (item !== parent) {
          item.classList.remove('active');
          const content = item.querySelector('.accordion-content');
          if (content) content.style.maxHeight = null;
        }
      });

      parent.classList.toggle('active');
      const currentContent = parent.querySelector('.accordion-content');
      if (currentContent) {
        if (parent.classList.contains('active')) {
          currentContent.style.maxHeight = currentContent.scrollHeight + 'px';
        } else {
          currentContent.style.maxHeight = null;
        }
      }
    });
  });

  /* ==========================================================================
     4. WIELOETAPOWY FORMULARZ KONTAKTOWY (WEB3FORMS)
     ========================================================================== */
  const formSteps = document.querySelectorAll('.form-step');
  const stepDots = document.querySelectorAll('.step-dot');
  const btnNextList = document.querySelectorAll('.btn-next');
  const btnPrevList = document.querySelectorAll('.btn-prev');
  const contactForm = document.getElementById('contact-form');
  const resetBtn = document.getElementById('btn-reset-form');

  let currentStep = 1;

  function updateFormStep(step) {
    formSteps.forEach(function (s) { s.classList.remove('active'); });
    stepDots.forEach(function (d) { d.classList.remove('active'); });

    const activeStepEl = document.querySelector('.form-step.step-' + step);
    if (activeStepEl) activeStepEl.classList.add('active');

    stepDots.forEach(function (d) {
      if (parseInt(d.getAttribute('data-step')) <= step) {
        d.classList.add('active');
      }
    });

    // Uzupełnienie podsumowania na Kroku 4
    if (step === 4) {
      const nameVal = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
      const emailVal = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
      const phoneVal = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
      const companyVal = document.getElementById('company') ? document.getElementById('company').value.trim() : '';
      const msgVal = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
      const selectedType = document.querySelector('input[name="project_type"]:checked');

      if (document.getElementById('sum-name')) document.getElementById('sum-name').textContent = nameVal || 'Nie podano';
      if (document.getElementById('sum-email')) document.getElementById('sum-email').textContent = emailVal || 'Nie podano';
      if (document.getElementById('sum-phone')) document.getElementById('sum-phone').textContent = phoneVal || 'Nie podano';
      if (document.getElementById('sum-company')) document.getElementById('sum-company').textContent = companyVal || 'Brak';
      if (document.getElementById('sum-type')) document.getElementById('sum-type').textContent = selectedType ? selectedType.value : 'Strona internetowa';
      if (document.getElementById('sum-message')) document.getElementById('sum-message').textContent = msgVal || 'Nie podano';
    }
  }

  // Przycisk "DALEJ"
  btnNextList.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const currentStepEl = document.querySelector('.form-step.step-' + currentStep);
      if (currentStepEl) {
        const requiredInputs = currentStepEl.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        requiredInputs.forEach(function (input) {
          if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
          }
        });

        if (!isValid) return;
      }

      if (currentStep < 4) {
        currentStep++;
        updateFormStep(currentStep);
      }
    });
  });

  // Przycisk "WSTECZ"
  btnPrevList.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (currentStep > 1) {
        currentStep--;
        updateFormStep(currentStep);
      }
    });
  });

  // Przycisk "Powrót do strony" po wysłaniu
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (contactForm) contactForm.reset();
      currentStep = 1;
      updateFormStep(1);
    });
  }

  // Wysyłka formularza do Web3Forms
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'WYŚLIJ';

      if (submitBtn) {
        submitBtn.innerText = 'Wysyłanie...';
        submitBtn.disabled = true;
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          // Pokazanie ekranu sukcesu
          formSteps.forEach(function (s) { s.classList.remove('active'); });
          const successStep = document.querySelector('.form-step.step-success') || formSteps[formSteps.length - 1];
          if (successStep) successStep.classList.add('active');

          stepDots.forEach(function (d) { d.classList.add('active'); });

          if (typeof confetti === 'function') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        } else {
          alert('Błąd wysyłania: ' + (data.message || 'Niepoprawny klucz Web3Forms'));
        }
      } catch (err) {
        alert('Błąd połączenia. Upewnij się, że masz połączenie z internetem.');
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }

  /* ==========================================================================
     5. POWRÓT NA GÓRĘ & DOCK OVERLAY
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  const bottomDockBtn = document.getElementById('bottom-back-to-top');
  let scrollTimeout;

  window.addEventListener('scroll', function () {
    const isScrolled = window.scrollY > 400;

    if (backToTopBtn) backToTopBtn.classList.toggle('show', isScrolled);
    if (bottomDockBtn) bottomDockBtn.classList.toggle('show', isScrolled);

    if (isScrolled) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        if (backToTopBtn) backToTopBtn.classList.remove('show');
        if (bottomDockBtn) bottomDockBtn.classList.remove('show');
      }, 2500);
    }
  }, { passive: true });

  const scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (backToTopBtn) backToTopBtn.addEventListener('click', scrollToTop);
  if (bottomDockBtn) bottomDockBtn.addEventListener('click', scrollToTop);

  /* ==========================================================================
     6. KOPIOWANIE ADRESU EMAIL I TOAST
     ========================================================================== */
  const toast = document.getElementById('toast');
  const copyMailElements = document.querySelectorAll('a[href^="mailto:"]');

  copyMailElements.forEach(function (element) {
    element.addEventListener('click', function (e) {
      const email = element.getAttribute('href').replace('mailto:', '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(function () {
          if (toast) {
            toast.classList.add('show');
            setTimeout(function () {
              toast.classList.remove('show');
            }, 3000);
          }
        }).catch(function (err) {
          console.error('Błąd kopiowania: ', err);
        });
      }
    });
  });

  /* ==========================================================================
     7. PASEK POSTĘPU SCROLLA & SPOTLIGHT CARDS
     ========================================================================== */
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  const spotlightCards = document.querySelectorAll('.service-card, .service-item, .project-card, .about-card, .stat-card, .bento-card');
  spotlightCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
      card.style.setProperty('--spotlight-opacity', '1');
    });

    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--spotlight-opacity', '0');
    });
  });

  /* ==========================================================================
     8. KURSOR KUSTOMOWY
     ========================================================================== */
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring && !window.matchMedia('(hover: none)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = 'translate3d(' + mouseX + 'px, ' + mouseY + 'px, 0) translate(-50%, -50%)';
    });

    const renderCursor = function () {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = 'translate3d(' + ringX + 'px, ' + ringY + 'px, 0) translate(-50%, -50%)';
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    const hoverTargets = document.querySelectorAll('a, button, [role="button"], input, textarea, .service-header, .accordion-header');
    hoverTargets.forEach(function (target) {
      target.addEventListener('mouseenter', function () { ring.classList.add('cursor-hover'); });
      target.addEventListener('mouseleave', function () { ring.classList.remove('cursor-hover'); });
    });
  }

});

/* ==========================================================================
   9. DŹWIĘKI UI (WEB AUDIO API)
   ========================================================================== */
const SoundUI = (() => {
  let ctx = null;

  const initAudio = () => {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  };

  const playClick = () => {
    try {
      initAudio();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };

  const playExpand = () => {
    try {
      initAudio();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  return { initAudio, playClick, playExpand };
})();

window.addEventListener('pointerdown', (e) => {
  SoundUI.initAudio();
  const target = e.target.closest('button, a, .service-header, .accordion-header, .bottom-dock-overlay, [role="button"]');
  if (!target) return;

  if (target.closest('.service-header, .accordion-header')) {
    SoundUI.playExpand();
  } else {
    SoundUI.playClick();
  }
}, { passive: true });
