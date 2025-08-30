// Adds interactive behaviors for buttons, pricing switch, and content tweaks

document.addEventListener('DOMContentLoaded', () => {
  const init = () => {
  const calendlyURL = 'https://calendly.com/youssef-vahorizon/30min';

  // Inject hover animation styles for interactive elements
  const hoverStyle = document.createElement('style');
  hoverStyle.textContent = `
    .va-btn {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .va-btn:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 8px 15px rgba(0,0,0,0.15);
    }
    /* Pricing toggle indicator and smooth transitions */
    .pricing-toggle {
      position: relative;
      overflow: hidden;
      border-radius: 9999px;
    }
    .pricing-toggle button {
      position: relative;
      z-index: 1;
      transition: background-color 0.3s ease, color 0.3s ease,
                  transform 0.3s ease, box-shadow 0.3s ease;
    }
    .pricing-toggle .toggle-indicator {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      transition: transform 0.3s ease;
      border-radius: inherit;
      z-index: 0;
    }
    .pricing-toggle.full .toggle-indicator {
      transform: translateX(100%);
    }
  `;
  document.head.appendChild(hoverStyle);

  const menuStyle = document.createElement('style');
  menuStyle.textContent = `
    #mobile-menu {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background-color: var(--va-navy, #0a224e);
      color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      flex-direction: column;
      gap: 0.75rem;
      z-index: 50;
    }
    #mobile-menu.show { display: flex; }
    #mobile-menu button {
      color: white;
      text-align: left;
    }
    #mobile-menu button:hover {
      color: var(--va-gold, #eab308);
    }
  `;
  document.head.appendChild(menuStyle);

  const scrollMap = {
    'services': '#services',
    'process': '#how-it-works',
    'pricing': '#pricing',
    'pilot': '#promo-packages',
    'faq': '#faq',
    'contact': '#contact',
    'view pricing': '#pricing'
  };

  const calendlyLabels = [
    'book 15-min audit',
    'book your strategy call now',
    'get started',
    'contact us',
    'reserve now',
    'book a call',
    'book your strategy call',
    'book a call now'
  ];

  const enhanceButtons = root => {
    root.querySelectorAll('button, a').forEach(el => {
      if (el.closest('#faq')) return;
      el.classList.add('va-btn');
      const label = el.textContent.trim().toLowerCase();
      if (calendlyLabels.includes(label)) {
        el.addEventListener('click', e => {
          e.preventDefault();
          window.location.href = calendlyURL;
        });
      } else if (scrollMap[label]) {
        el.addEventListener('click', e => {
          e.preventDefault();
          const target = document.querySelector(scrollMap[label]);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });
  };

  enhanceButtons(document);

  // Update email addresses and helper text
  const newEmail = 'Youssef@vahorizon.site';
  document.querySelectorAll('a[href^="mailto"], p').forEach(el => {
    if (el.textContent && el.textContent.includes('hello@vahorizon.com')) {
      el.textContent = newEmail;
      if (el.tagName.toLowerCase() === 'a') el.href = `mailto:${newEmail}`;
    }
  });
  const emailPara = Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes(newEmail));
  if (emailPara) {
    emailPara.id = 'contact-email';
    emailPara.insertAdjacentHTML('afterend', '<p class="text-va-dark text-sm">We respond within a few business hours.</p>');
  }
  const emailLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Email us directly'));
  if (emailLink) {
    emailLink.removeAttribute('href');
    emailLink.style.cursor = 'pointer';
    emailLink.addEventListener('click', e => {
      e.preventDefault();
      const el = document.getElementById('contact-email');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Why Choose section tweak
  const whyHeading = Array.from(document.querySelectorAll('h4')).find(h => h.textContent.includes('Why Choose VA Horizon'));
  if (whyHeading) {
    const boxes = whyHeading.nextElementSibling.querySelectorAll('.text-center');
    if (boxes[1]) {
      const num = boxes[1].querySelector('.text-2xl');
      const lbl = boxes[1].querySelector('.text-va-dark');
      if (num) num.textContent = '5 Day';
      if (lbl) lbl.textContent = 'Replacement guarantee anytime during the subscription time';
    }
  }

  // Replace stat texts
  document.querySelectorAll('.text-3xl').forEach(el => {
    if (el.textContent.includes('200+')) el.textContent = '300+';
    if (el.textContent.includes('87%')) el.textContent = '95%';
  });
  document.querySelectorAll('.text-sm').forEach(el => {
    if (el.textContent.includes('Successful Placements')) el.textContent = 'Happy Clients';
    if (el.textContent.includes('Pilot Success Rate')) el.textContent = 'Client Satisfaction';
  });

  // FAQ answers and structure fixes
  const faqAnswers = [
    'Most VAs start within 48 hours after onboarding.',
    'We will replace your VA anytime during your subscription.',
    'We can work with the systems you already use or tailor a system just for you if you don\'t already have one.',
    '<p>Our founder trains your VA on your exact processes.</p><ul class="list-disc ml-4"><li>Role play using your scenarios</li><li>Workflow setup matching your CRM and dialer</li><li>Custom scripts tailored to your market</li><li>Daily performance reviews during onboarding</li><li>Ongoing check-ins to refine performance</li></ul>',
    'You can add more VAs whenever you need.',
    'Subscriptions are billed monthly with no long-term contracts.',
    'Yes, we support multiple real estate niches.',
    'VAs work in your preferred time zone.'
  ];
  const faqPanels = document.querySelectorAll('#faq [data-slot="accordion-content"]');
  faqPanels.forEach((panel, i) => {
    panel.innerHTML = faqAnswers[i] || '';
  });
  // Ensure the last FAQ item has a bottom border
  const faqItems = document.querySelectorAll('#faq [data-slot="accordion-item"]');
  if (faqItems.length) {
    faqItems[faqItems.length - 1].classList.remove('last:border-b-0');
  }

  // Reviews adjustments
  const quotes = document.querySelectorAll('blockquote');
  if (quotes[0]) quotes[0].textContent = 'VA Horizon matched me with a VA who quickly became part of my team. We close more deals without extra stress.';
  if (quotes[1]) quotes[1].textContent = 'Our VA keeps our pipeline organized and follow-ups on time. I finally have breathing room.';
  const badges = document.querySelectorAll('.border-t .inline-block');
  if (badges[0]) badges[0].textContent = 'Reliable support every week';
  if (badges[1]) badges[1].textContent = 'Smooth operations and steady leads';

  // Pricing toggle
  const partBtn = document.querySelector('#pricing .relative.inline-flex button:first-child');
  const fullBtn = document.querySelector('#pricing .relative.inline-flex button:nth-child(2)');
  const toggleWrapper = partBtn && fullBtn ? partBtn.parentElement : null;
  if (toggleWrapper) {
    toggleWrapper.classList.add('pricing-toggle', 'full');
    const indicator = document.createElement('span');
    indicator.className = 'toggle-indicator bg-va-gold';
    toggleWrapper.insertBefore(indicator, toggleWrapper.firstChild);
  }
  const planCards = Array.from(document.querySelectorAll('#pricing [data-slot="card"]')).slice(0, 2);
  const planData = planCards.map(card => {
    const priceEl = card.querySelector('.text-4xl');
    const hoursEl = Array.from(card.querySelectorAll('p')).find(p => p.textContent.includes('hours/month'));
    const fullPrice = parseInt(priceEl.textContent.replace(/[^0-9]/g, ''), 10);
    const fullHours = parseInt(hoursEl.textContent.replace(/[^0-9]/g, ''), 10);
    return { priceEl, hoursEl, fullPrice, fullHours };
  });
  let fullTime = true;
  const renderPricing = () => {
    planData.forEach(plan => {
      const price = fullTime ? plan.fullPrice : plan.fullPrice / 2;
      const hours = fullTime ? plan.fullHours : plan.fullHours / 2;
      plan.priceEl.textContent = `$${price}`;
      plan.hoursEl.textContent = `${hours} hours/month`;
    });
  };
  if (partBtn && fullBtn) {
    partBtn.addEventListener('click', () => {
      if (fullTime) {
        fullTime = false;
        toggleWrapper.classList.remove('full');
        partBtn.classList.add('bg-va-gold', 'text-white', 'shadow-md', 'transform', 'scale-105');
        fullBtn.classList.remove('bg-va-gold', 'text-white', 'shadow-md', 'transform', 'scale-105');
        renderPricing();
      }
    });
    fullBtn.addEventListener('click', () => {
      if (!fullTime) {
        fullTime = true;
        toggleWrapper.classList.add('full');
        fullBtn.classList.add('bg-va-gold', 'text-white', 'shadow-md', 'transform', 'scale-105');
        partBtn.classList.remove('bg-va-gold', 'text-white', 'shadow-md', 'transform', 'scale-105');
        renderPricing();
      }
    });
  }

  // Learn More expansion for services
  const serviceDetails = [
    'Detailed scripts and live call coaching ensure quality conversations.',
    'Pulls niche lists and verifies data before delivery.',
    'Automation setup tailored to your workflow.',
    'We contact buyers and update comp sheets.',
    'Inbox management and follow-up sequences.',
    'Dedicated ops manager tracking KPIs.'
  ];
  document.querySelectorAll('button[data-slot="dialog-trigger"]').forEach((btn, idx) => {
    const content = btn.parentElement;
    let extra = document.createElement('p');
    extra.className = 'text-va-dark mb-4 hidden extra-info';
    extra.textContent = serviceDetails[idx] || '';
    content.insertBefore(extra, btn);
    btn.addEventListener('click', () => {
      extra.classList.toggle('hidden');
      btn.textContent = extra.classList.contains('hidden') ? 'Learn More' : 'Show Less';
    });
  });

  // FAQ accordion functionality
  const faqSection = document.getElementById('faq');
  if (faqSection) {
      const items = faqSection.querySelectorAll('[data-slot="accordion-item"]');
      items.forEach((item, index) => {
        const trigger = item.querySelector('[data-slot="accordion-trigger"]');
        const content = item.querySelector('[data-slot="accordion-content"]');
        if (!trigger || !content) return;
        content.style.maxHeight = '0px';
        content.hidden = false;
        trigger.addEventListener('click', () => {
          const open = item.getAttribute('data-state') === 'open';
          items.forEach(other => {
            const otherTrigger = other.querySelector('[data-slot="accordion-trigger"]');
            const otherContent = other.querySelector('[data-slot="accordion-content"]');
            if (!otherTrigger || !otherContent) return;
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherTrigger.setAttribute('data-state', 'closed');
            other.setAttribute('data-state', 'closed');
            otherContent.style.maxHeight = '0px';
          });
          if (!open) {
            trigger.setAttribute('aria-expanded', 'true');
            trigger.setAttribute('data-state', 'open');
            item.setAttribute('data-state', 'open');
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('data-state', 'closed');
            item.setAttribute('data-state', 'closed');
            content.style.maxHeight = '0px';
          }
        });

        trigger.addEventListener('keydown', e => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = items[(index + 1) % items.length].querySelector('[data-slot="accordion-trigger"]');
            next.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = items[(index - 1 + items.length) % items.length].querySelector('[data-slot="accordion-trigger"]');
            prev.focus();
          }
        });
      });
  }
  // Mobile menu toggle
  const initMenu = () => {
    const menuBtn = document.querySelector('header div.md\\:hidden > button') ||
                     document.querySelector('header .md\\:hidden button') ||
                     document.querySelector('header button');
    const navMenu = document.querySelector('header nav');
    if (!menuBtn || !navMenu) return false;

    const parent = menuBtn.parentNode;
    parent.style.position = 'relative';
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.innerHTML = navMenu.innerHTML;
    enhanceButtons(mobileMenu);
    parent.appendChild(mobileMenu);

    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('show');
      const expanded = mobileMenu.classList.contains('show');
      menuBtn.setAttribute('aria-expanded', expanded);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        mobileMenu.classList.remove('show');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    return true;
  };
  if (!initMenu()) {
    const observer = new MutationObserver(() => {
      if (initMenu()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Contact form submission & validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const status = document.getElementById('form-status');
    const fieldMap = {
      '#contact-name': 'name',
      '#contact-email': 'email',
      '#contact-company': 'company',
      'select': 'interest',
      '#contact-message': 'message'
    };
    Object.entries(fieldMap).forEach(([selector, name]) => {
      const field = contactForm.querySelector(selector);
      if (field) {
        field.name = name;
        if (field.hasAttribute('required')) {
          const err = document.createElement('p');
          err.className = 'text-red-600 text-sm mt-1 hidden error-msg';
          field.insertAdjacentElement('afterend', err);
          field.addEventListener('input', () => {
            err.textContent = '';
            err.classList.add('hidden');
          });
        }
      }
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.className = 'text-sm mt-2';

      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        const err = field.nextElementSibling;
        if (!field.checkValidity()) {
          valid = false;
          if (err && err.classList.contains('error-msg')) {
            err.textContent = field.validationMessage;
            err.classList.remove('hidden');
          }
        }
      });
      if (!valid) return;

      const formData = new FormData(contactForm);
      if (formData.get('website')) {
        return; // spam via honeypot
      }
      const msg = formData.get('message') || '';
      if (/https?:\/\//i.test(msg)) {
        status.textContent = 'Links are not allowed in the message.';
        status.classList.add('text-red-600');
        return;
      }
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          contactForm.reset();
          status.textContent = "Thanks! We'll be in touch soon.";
          status.classList.add('text-green-600');
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (err) {
        status.textContent = "Message queued. We'll send it when you're back online.";
        status.classList.add('text-yellow-600');
      }
    });
  }
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(init);
  } else {
    setTimeout(init, 0);
  }
});
