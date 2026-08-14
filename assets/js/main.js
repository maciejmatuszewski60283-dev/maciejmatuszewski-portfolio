// Bezpieczne uruchomienie skryptu po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================================
     1. THEME SWITCHER (DARK / LIGHT MODE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  if (themeToggleBtn) {
    // Odczyt zapisanego motywu
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
     2. HAMBURGER MENU (MOBILE DRAWER)
     ========================================================================== */
  const menuToggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggleBtn && mobileMenu) {
    menuToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      mobileMenu.classList.toggle('active');
    });

    // Zamykanie menu po kliknięciu w dowolny link
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     3. ACCORDION (USŁUGI)
     ========================================================================== */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(function (item) {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (header && content) {
      header.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Zamknij wszystkie inne
        accordionItems.forEach(function (otherItem) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.maxHeight = null;
          }
        });

        // Otwórz kliknięty element
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  });

  /* ==========================================================================
     4. WIELOETAPOWY FORMULARZ KONTAKTOWY
     ========================================================================== */
  const formSteps = document.querySelectorAll('.form-step');
  const stepDots = document.querySelectorAll('.step-dot');
  const btnNextList = document.querySelectorAll('.btn-next');
  const btnPrevList = document.querySelectorAll('.btn-prev');
  const contactForm = document.getElementById('contact-form');
  const formStatusMsg = document.getElementById('form-status-message');

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

    // Wypełnianie podsumowania
    if (step === 4) {
      const nameVal = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
      const emailVal = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
      const msgVal = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
      const selectedType = document.querySelector('input[name="project_type"]:checked');

      if (document.getElementById('sum-name')) document.getElementById('sum-name').textContent = nameVal || 'Nie podano';
      if (document.getElementById('sum-email')) document.getElementById('sum-email').textContent = emailVal || 'Nie podano';
      if (document.getElementById('sum-type')) document.getElementById('sum-type').textContent = selectedType ? selectedType.value : 'Strona internetowa';
      if (document.getElementById('sum-message')) document.getElementById('sum-message').textContent = msgVal || 'Nie podano';
    }
  }

  btnNextList.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (currentStep === 1) {
        const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
        const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
        if (!name || !email) {
          alert('Proszę wypełnić imię oraz adres e-mail.');
          return;
        }
      } else if (currentStep === 2) {
        const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
        if (!message) {
          alert('Proszę wpisać opis projektu.');
          return;
        }
      } else if (currentStep === 3) {
        const consent = document.getElementById('consent') ? document.getElementById('consent').checked : false;
        if (!consent) {
          alert('Proszę wyrazić zgodę na kontakt.');
          return;
        }
      }

      if (currentStep < 4) {
        currentStep++;
        updateFormStep(currentStep);
      }
    });
  });

  btnPrevList.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (currentStep > 1) {
        currentStep--;
        updateFormStep(currentStep);
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (formStatusMsg) {
        formStatusMsg.className = 'status-msg success';
        formStatusMsg.textContent = 'Dziękuję! Wiadomość zostanie wysłana na kontakt@maciejmatuszewski.pl.';
      }
    });
  }

});
/* ==========================================================================
   MACIEJ MATUSZEWSKI PORTFOLIO — CORE SCRIPT
   Logika UI, motywu oraz sceny Three.js 3D znajduje się bezpośrednio w index.html.
   ========================================================================== */

console.log('Maciej Matuszewski Portfolio — System Gotowy!');
// --- BACK TO TOP & COPY EMAIL TOAST ---
document.addEventListener('DOMContentLoaded', () => {
  const backToTopBtn = document.getElementById('back-to-top');
  const toast = document.getElementById('toast');

  // 1. Pokazywanie/ukrywanie przycisku "Powrót na górę" przy przewijaniu
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('show');
    } else {
      backToTopBtn?.classList.remove('show');
    }
  });

  // Gładki scroll na samą górę po kliknięciu
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 2. Funkcja kopiowania maila i pokazywania powiadomienia Toast
  const copyMailElements = document.querySelectorAll('a[href^="mailto:"]');

  copyMailElements.forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const email = element.getAttribute('href').replace('mailto:', '');

      navigator.clipboard.writeText(email).then(() => {
        // Pokaż powiadomienie toast
        toast?.classList.add('show');
        setTimeout(() => {
          toast?.classList.remove('show');
        }, 3000);
      }).catch(err => {
        console.error('Błąd kopiowania maila: ', err);
      });
    });
  });
});
// --- SZKLANY BACK TO TOP Z AUTO-UKRYWANIEM PO ZATRZYMANIU ---
document.addEventListener('DOMContentLoaded', () => {
  const backToTopBtn = document.getElementById('back-to-top');
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    // 1. Pokaż przycisk tylko jeśli przewijamy poniżej 400px
    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('show');

      // 2. Czyszczenie poprzedniego licznika
      clearTimeout(scrollTimeout);

      // 3. Ukryj przycisk po 2 sekundach (2000 ms) braku ruchu
      scrollTimeout = setTimeout(() => {
        backToTopBtn?.classList.remove('show');
      }, 2000);
    } else {
      backToTopBtn?.classList.remove('show');
    }
  });

  // Zapobiegaj ukrywaniu, gdy kursor znajduje się na przycisku (na PC)
  backToTopBtn?.addEventListener('mouseenter', () => {
    clearTimeout(scrollTimeout);
  });

  backToTopBtn?.addEventListener('mouseleave', () => {
    if (window.scrollY > 400) {
      scrollTimeout = setTimeout(() => {
        backToTopBtn?.classList.remove('show');
      }, 2000);
    }
  });

  // Płynny scroll na górę po kliknięciu
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
// --- BOTTOM DOCK OVERLAY LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
  const bottomDockBtn = document.getElementById('bottom-back-to-top');
  let dockTimeout;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      bottomDockBtn?.classList.add('show');

      clearTimeout(dockTimeout);

      // Znika po 2 sekundach (2000 ms) od zatrzymania przewijania
      dockTimeout = setTimeout(() => {
        bottomDockBtn?.classList.remove('show');
      }, 2000);
    } else {
      bottomDockBtn?.classList.remove('show');
    }
  });

  // Zapobiegaj ukrywaniu, gdy kursor znajduje się na pasku (PC)
  bottomDockBtn?.addEventListener('mouseenter', () => {
    clearTimeout(dockTimeout);
  });

  bottomDockBtn?.addEventListener('mouseleave', () => {
    if (window.scrollY > 400) {
      dockTimeout = setTimeout(() => {
        bottomDockBtn?.classList.remove('show');
      }, 2000);
    }
  });

  // Płynny scroll na samą górę
  bottomDockBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
// --- PŁYNNA OBSŁUGA ROZWIJANIA USŁUG (AKORDEON) ---
document.addEventListener('DOMContentLoaded', () => {
  const serviceHeaders = document.querySelectorAll('.accordion-header, .service-header');

  serviceHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.closest('.accordion-item, .service-card');
      
      if (!parent) return;

      // Zamyka pozostałe otwarte usługi, gdy otwierasz nową
      document.querySelectorAll('.accordion-item, .service-card').forEach(item => {
        if (item !== parent) {
          item.classList.remove('active');
        }
      });

      // Otwiera lub zamyka klikniętą usługę
      parent.classList.toggle('active');
    });
  });
});
// ==========================================================================
// 1. DŹWIĘKI UI (WEB AUDIO API - GŁOŚNE I NIEZAWODNE)
// ==========================================================================
const SoundUI = (() => {
  let ctx = null;

  // Odblokowanie audio przy pierwszym kontakcie użytkownika
  const initAudio = () => {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  };

  // Czysty, nowoczesny dźwięk "klik / blip"
  const playClick = () => {
    try {
      initAudio();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Wyraźniejsza częstotliwość i dłuższy impuls (0.08s)
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

      // Zwiększona głośność (0.35)
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  };

  // Dźwięk rozwinięcia usługi (subtelny sweep)
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
    } catch (e) {
      console.warn('Audio error:', e);
    }
  };

  return { initAudio, playClick, playExpand };
})();

// Globalne przechwytywanie kliknięć
window.addEventListener('pointerdown', (e) => {
  SoundUI.initAudio();

  // Sprawdzamy, czy kliknięto w przycisk, link, menu lub kafelek usługi
  const target = e.target.closest('button, a, .service-header, .accordion-header, .bottom-dock-overlay, [role="button"]');
  if (!target) return;

  if (target.closest('.service-header, .accordion-header')) {
    SoundUI.playExpand();
  } else {
    SoundUI.playClick();
  }
}, { passive: true });


// ==========================================================================
// 2. LOGIKA CUSTOMOWEGO KURSORA
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Kropka podąża natychmiast
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  // Płynna animacja podążania zewnętrznego pierścienia (lerp)
  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Efekt powiększenia po najechaniu na klikalny element
  const hoverTargets = document.querySelectorAll('a, button, [role="button"], input, textarea, .service-header, .accordion-header');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    target.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });
});
// ==========================================================================
// AWWWARDS INTERACTIONS: PROGRESS BAR, SPOTLIGHT, SCROLL REVEAL
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Pasek postępu przewijania
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // 2. Spotlight Card Glow (Światło podążające za ruchem myszy)
  const spotlightCards = document.querySelectorAll(
    '.service-card, .service-item, .project-card, .about-card, .stat-card, .bento-card'
  );

  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--spotlight-opacity', '1');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--spotlight-opacity', '0');
    });
  });

  // 3. Scroll Reveal z efektem Blur-to-Focus
  const revealTargets = document.querySelectorAll(
    'section > div, .service-card, .service-item, .project-card, .section-title, .stat-card'
  );

  revealTargets.forEach(el => el.classList.add('reveal-element'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Delikatny stagger (opóźnienie kaskadowe)
        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, index * 40);
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  revealTargets.forEach(el => revealObserver.observe(el));
});
document.addEventListener('DOMContentLoaded', () => {
    // --- OBSŁUGA KROKÓW FORMULARZA ---
    const steps = document.querySelectorAll('.form-step');
    const stepDots = document.querySelectorAll('.step-dot');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const contactForm = document.getElementById('contact-form');
    let currentStep = 0;

    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle('active', i === index);
        });
        stepDots.forEach((dot, i) => {
            dot.classList.toggle('active', i <= index);
        });
        currentStep = index;
    }

    // Przejście Dalej
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentInputs = steps[currentStep].querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            currentInputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    isValid = false;
                }
            });

            if (isValid && currentStep < steps.length - 1) {
                showStep(currentStep + 1);
            }
        });
    });

    // Powrót Wstecz
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    // Reset formularza po sukcesie
    const resetBtn = document.getElementById('btn-reset-form');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            contactForm.reset();
            showStep(0);
        });
    }

    // --- WYSYŁKA FORMULARZA (WEB3FORMS + KONFETTI) ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Wysyłanie...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    // Pokaż krok sukcesu
                    const successStepIndex = steps.length - 1;
                    showStep(successStepIndex);

                    // Odpal konfetti jeśli biblioteka jest załadowana
                    if (typeof confetti === 'function') {
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                    }
                } else {
                    alert('Wystąpił błąd podczas wysyłania: ' + data.message);
                }
            } catch (err) {
                alert('Błąd połączenia. Spróbuj ponownie później.');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
