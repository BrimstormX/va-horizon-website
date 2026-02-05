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


    const getRoot = () => {
      const script = document.querySelector('script[src*="buttons.js"]');
      if (script) {
        const src = script.getAttribute('src');
        return src.replace('buttons.js', '');
      }
      return '';
    };

    const rootPath = getRoot();

    const internalLinks = {
      'get started': rootPath + 'industries/real-estate/',
      'see the crm': rootPath + 'crm/',
      'get the crm': rootPath + 'crm/',
      'apply now': rootPath + 'apply/',
      'book a call today': calendlyURL,
      'book a call': calendlyURL,
      'book a 15-min audit': calendlyURL,
      'book 15-min audit': calendlyURL,
      'book your strategy call now': calendlyURL,
      'book your strategy call': calendlyURL,
      'book a call now': calendlyURL
    };

    const enhanceButtons = root => {
      root.querySelectorAll('button, a').forEach(el => {
        if (el.closest('#faq')) return;
        el.classList.add('va-btn');
        const label = el.textContent.trim().toLowerCase();
        if (internalLinks[label]) {
          el.addEventListener('click', e => {
            e.preventDefault();
            window.location.href = internalLinks[label];
          });
        } else if (scrollMap[label]) {
          el.addEventListener('click', e => {
            const target = document.querySelector(scrollMap[label]);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth' });
            }
            // If target doesn't exist (e.g., we are on a subpage), allow default <a> behavior
            // which should be href="../#pricing" etc.
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

    // FAQ answers and structure fixes

    // FAQ answers and structure fixes
    const faqAnswers = [
      "Most clients go live in 48–72 hours after we confirm your needs. That includes matching, onboarding, and training on your script + process.",
      "Cold calling, appointment setting, skip tracing/list pulling, lead management, follow-up (SMS/email), dispo support, comps, CRM buildouts, and admin ops—built for wholesaling workflows.",
      "No long-term contracts. Cancel anytime with 30 days’ written notice (per our Refund Policy).",
      "Setup fee + first month are paid upfront. Monthly billing after that. Setup fees are non-refundable once onboarding starts. See Refund Policy for details.",
      "If you’re not satisfied within the first 5 business days, we replace the VA at no extra placement cost. You get a replacement—not a cash refund."
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

    // Pricing toggle

    // Pricing toggle
    const leadGenBtn = document.querySelector('#pricing .relative.inline-flex button:first-child');
    const managersBtn = document.querySelector('#pricing .relative.inline-flex button:nth-child(2)');
    const toggleWrapper = leadGenBtn && managersBtn ? leadGenBtn.parentElement : null;

    if (toggleWrapper) {
      // Setup dynamic indicator
      const existingIndicator = toggleWrapper.querySelector('.toggle-indicator');
      if (existingIndicator) existingIndicator.remove();

      const indicator = document.createElement('span');
      // Use absolute positioning with explicit properties
      indicator.className = 'absolute bg-va-gold rounded-full shadow-md transition-all duration-300 ease-in-out toggle-indicator';
      indicator.style.backgroundColor = '#D4A02F'; // Exact site gold
      indicator.style.zIndex = '1';
      indicator.style.boxShadow = '0 0 15px rgba(212, 160, 47, 0.6)';
      toggleWrapper.insertBefore(indicator, toggleWrapper.firstChild);

      // Add a subtle glow behind the switch container itself
      toggleWrapper.style.boxShadow = '0 0 20px rgba(212, 160, 47, 0.15)';
      toggleWrapper.style.transition = 'box-shadow 0.3s ease';

      // Reset button styles
      [leadGenBtn, managersBtn].forEach(btn => {
        btn.style.position = 'relative';
        btn.style.zIndex = '10';
        btn.style.backgroundColor = 'transparent';
        btn.style.boxShadow = 'none';
        btn.style.border = 'none';

        btn.classList.remove('bg-va-gold', 'bg-white', 'shadow-md', 'transform', 'scale-105');
        btn.classList.add('transition-colors', 'duration-300');
      });

      const updateSwitch = (isLeadGen) => {
        const activeBtn = isLeadGen ? leadGenBtn : managersBtn;
        const inactiveBtn = isLeadGen ? managersBtn : leadGenBtn;

        // Use offset props (safe for relative positioning inside parent)
        indicator.style.left = `${activeBtn.offsetLeft}px`;
        indicator.style.top = `${activeBtn.offsetTop}px`;
        indicator.style.width = `${activeBtn.offsetWidth}px`;
        indicator.style.height = `${activeBtn.offsetHeight}px`;

        activeBtn.classList.remove('text-va-dark', 'hover:text-va-navy');
        activeBtn.classList.add('text-white');

        inactiveBtn.classList.add('text-va-dark', 'hover:text-va-navy');
        inactiveBtn.classList.remove('text-white');
      };

      const setInitial = () => requestAnimationFrame(() => updateSwitch(true));

      if (document.readyState === 'complete') {
        setInitial();
      } else {
        window.addEventListener('load', setInitial);
      }
      window.addEventListener('resize', () => {
        const isLeadGen = !toggleWrapper.classList.contains('managers-mode');
        requestAnimationFrame(() => updateSwitch(isLeadGen));
      });
      toggleWrapper._updateSwitch = updateSwitch;
    }

    const pricingData = {
      leadGenerators: [
        {
          title: 'Cold Calling VA',
          price: '1160',
          rate: '$6/hr',
          subtext: '+ $200 Dialer Cost',
          features: [
            'Wholesaling cold calling (openers + objections)',
            'Accent-neutral, US-ready English',
            'Lead qualification + clean tagging',
            'Appointment setting + confirmations',
            'Weekly KPI reporting',
            'Swap/add/adjust VAs as you scale'
          ]
        },
        {
          title: 'Cold Calling VAs',
          price: '1000',
          rate: '$5/hr',
          subtext: '+ $200 Dialer Cost',
          features: [
            'Multi-caller outbound team (3+ seats)',
            'No-Accent, US-ready English',
            'Lead qualification + call scoring',
            'Skip tracing + list pulling included',
            'Dedicated account support',
            'Weekly reporting + optimization'
          ]
        },
        {
          title: 'Add-Ons',
          price: 'Custom',
          rate: 'One-time & monthly',
          subtext: 'As needed',
          features: [
            'CRM & Dialer Setup - Free',
            'High Quality Lists - $100 USD/month',
            'Additional training hours',
            'Custom integrations',
            'Priority placement'
          ]
        }
      ],
      managers: [
        {
          title: 'Lead Manager',
          price: '1120',
          rate: '$7/hr',
          subtext: '',
          features: [
            'Team Ops Coordination',
            'KPI Tracking & Deep Dives',
            'Daily Performance Audits',
            'Script & Rebuttal Optimization',
            'SOP Implementation',
            'Weekly Strategy Sessions'
          ]
        },
        {
          title: 'Acquisition Manager',
          price: '1440',
          rate: '$9/hr',
          subtext: '',
          features: [
            'Deep Lead Scrubbing',
            'Aggressive Negotiation',
            'Contract Management',
            'Dedicated Follow-Up',
            'CRM Pipeline Hygiene',
            'Locked In Revenue Focus',
            'Due Diligence Support',
            'Closing Coordination'
          ]
        },
        {
          title: 'Dispositions Manager',
          price: '1440',
          rate: '$9/hr',
          subtext: '',
          features: [
            'Buyer Relations',
            'Marketing Deals',
            'Negotiating Sales',
            'Closing Coordination',
            'Network Growth',
            'Profit Maximization'
          ]
        }
      ]
    };

    const planCards = Array.from(document.querySelectorAll('#pricing [data-slot="card"]')).slice(0, 3);
    const cardElements = planCards.map(card => {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease';
      card.style.boxShadow = '0 10px 30px -10px rgba(8, 37, 65, 0.1), 0 0 20px rgba(212, 160, 47, 0.05)';

      return {
        card: card,
        titleEl: card.querySelector('[data-slot="card-title"]'),
        priceEl: card.querySelector('.text-4xl'),
        rateEl: card.querySelector('.space-y-1 p:first-child'),
        subtextEl: card.querySelector('.space-y-1 p:nth-child(3)'),
        featuresEl: card.querySelector('ul'),
        badgeEl: card.querySelector('[data-slot="badge"]') // Select the '3+ Callers' badge
      };
    });

    let currentMode = 'leadGenerators';

    const renderPricing = async () => {
      // Fade out
      cardElements.forEach(els => {
        els.card.style.opacity = '0';
        els.card.style.transform = 'translateY(10px)';
      });
      await new Promise(r => setTimeout(r, 300));

      const data = pricingData[currentMode];
      cardElements.forEach((els, index) => {
        if (data[index]) {
          if (els.titleEl) els.titleEl.textContent = data[index].title;

          if (els.priceEl) {
            // Handle "Custom" price for Add-Ons restoration
            if (data[index].price === 'Custom') {
              els.priceEl.textContent = 'Custom';
            } else {
              els.priceEl.textContent = `$${data[index].price}`;
            }
          }

          if (els.rateEl) els.rateEl.textContent = data[index].rate;
          if (els.subtextEl) els.subtextEl.textContent = data[index].subtext;

          if (els.featuresEl && data[index].features) {
            // Rebuild feature list
            // We use a check icon SVG for list items. 
            // Ideally we clone an existing LI to keep the SVG, or we just reconstruct the innerHTML structure.
            // Structure is: <li class="flex items-start"><svg ...></svg><span class="text-va-dark text-sm">Text</span></li>
            // I will use a simple string template with the SVG path I know works or try to clone.
            // Best approach: clear list, map features to new LIs.
            // To get the SVG, I'll grab it from the first child if it exists, otherwise I'll hardcode it. 
            // The view_file output showed standard checks.

            // Let's rely on innerHTML replacement for simplicity and safety if we use the standard check icon.
            const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-va-gold shrink-0 mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

            els.featuresEl.innerHTML = data[index].features.map(feat =>
              `<li class="flex items-start">${checkIcon}<span class="text-va-dark text-sm">${feat}</span></li>`
            ).join('');
          }

          if (els.badgeEl) {
            // Hide badge in managers mode, show otherwise
            els.badgeEl.style.display = currentMode === 'managers' ? 'none' : '';
          }
        }
      });

      // Fade In
      cardElements.forEach(els => {
        els.card.style.opacity = '1';
        els.card.style.transform = 'translateY(0)';
      });
    };

    if (leadGenBtn && managersBtn) {
      const updateUI = (newMode) => {
        if (currentMode !== newMode) {
          currentMode = newMode;
          toggleWrapper.classList.toggle('managers-mode', currentMode === 'managers');

          if (toggleWrapper._updateSwitch) {
            toggleWrapper._updateSwitch(currentMode === 'leadGenerators');
          }
          renderPricing();
        }
      };

      leadGenBtn.addEventListener('click', () => updateUI('leadGenerators'));
      managersBtn.addEventListener('click', () => updateUI('managers'));
    }


    // Learn More expansion for services
    const serviceDetails = [
      'Elite No-Accent callers trained in pattern interrupts and objection handling. They handle the cold, you handle the close.',
      'PropStream & Batch specialists who pull the niche, motivated lists your competitors are too lazy to find.',
      'Full GoHighLevel build-out. Automatic SMS blasts, Zapier triggers, and zero-leak pipeline management.',
      'Aggressive buyer outreach. We vet offers and clear your inventory before the contract expiration clock hits zero.',
      'Multi-channel follow-up sequences that squeeze every bit of juice out of old or "dead" leads.',
      'Daily KPI telemetry and live call QC. We manage the humans while you focus on scaling the revenue.'
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

    // Lead capture form submission & validation
    const configureLeadForm = (formId, statusId, fieldMap) => {
      const form = document.getElementById(formId);
      if (!form) return;

      form.action = 'https://formsubmit.co/youssef@vahorizon.site';
      form.method = 'POST';
      form.setAttribute('accept-charset', 'UTF-8');
      form.setAttribute('enctype', 'application/x-www-form-urlencoded');

      const statusEl = statusId ? document.getElementById(statusId) : null;
      const defaultStatusClass = statusEl ? (statusEl.className || 'text-sm mt-2') : 'text-sm mt-2';
      const messageFieldName = Object.values(fieldMap || {}).find(name => name === 'message');

      Object.entries(fieldMap || {}).forEach(([selector, name]) => {
        const field = form.querySelector(selector);
        if (!field) return;
        field.name = name;
        if (field.hasAttribute('required')) {
          const err = document.createElement('p');
          err.className = 'text-red-600 text-sm mt-1 hidden error-msg';
          field.insertAdjacentElement('afterend', err);
          const clearError = () => {
            err.textContent = '';
            err.classList.add('hidden');
          };
          field.addEventListener('input', clearError);
          field.addEventListener('change', clearError);
        }
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (statusEl) {
          statusEl.textContent = '';
          statusEl.className = defaultStatusClass;
        }

        let valid = true;
        form.querySelectorAll('[required]').forEach(field => {
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

        const formData = new FormData(form);
        if (formData.get('website')) {
          return; // spam via honeypot
        }

        if (messageFieldName) {
          const msg = formData.get(messageFieldName) || '';
          if (/https?:\/\//i.test(msg)) {
            if (statusEl) {
              statusEl.textContent = 'Links are not allowed in the message.';
              statusEl.classList.add('text-red-600');
            }
            return;
          }
        }

        try {
          const res = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            form.reset();
            if (statusEl) {
              statusEl.textContent = "Thanks! We'll be in touch soon.";
              statusEl.classList.add('text-green-600');
            }
          } else {
            let errorMsg = `Server error: ${res.status}`;
            try {
              const data = await res.json();
              errorMsg = data.error || data.message || errorMsg;
            } catch {
              // ignore JSON parsing errors
            }
            if (statusEl) {
              statusEl.textContent = errorMsg;
              statusEl.classList.add('text-red-600');
            }
          }
        } catch (err) {
          if (!navigator.onLine) {
            if (statusEl) {
              statusEl.textContent = "Message queued. We'll send it when you're back online.";
              statusEl.classList.add('text-yellow-600');
            }
          } else {
            if (statusEl) {
              statusEl.textContent = "Something went wrong. Please try again later.";
              statusEl.classList.add('text-red-600');
            }
            console.error(err);
          }
        }
      });
    };

    configureLeadForm('contact-form', 'form-status', {
      '#contact-name': 'name',
      '#contact-email': 'email',
      '#contact-company': 'company',
      '#contact-interest': 'interest',
      '#contact-message': 'message'
    });

    configureLeadForm('hero-contact-form', 'hero-form-status', {
      '#hero-name': 'name',
      '#hero-company': 'company',
      '#hero-email': 'email',
      '#hero-phone': 'phone',
      '#hero-interest': 'va_count',
      '#hero-team': 'lead_handling'
    });
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(init);
  } else {
    setTimeout(init, 0);
  }
});
