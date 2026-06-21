// Adds interactive behaviors for buttons, pricing switch, and content tweaks

document.addEventListener('DOMContentLoaded', () => {
  const init = () => {
    const calendlyURL = 'https://calendly.com/youssef-vahorizon/30min';

    // Hover and menu styles have been extracted to va-custom.css

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

    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', Array.from(rel).join(' '));
    });

    const internalLinks = {
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
      const helperText = document.createElement('p');
      helperText.className = 'text-va-dark text-sm';
      helperText.textContent = 'We respond within a few business hours.';
      emailPara.insertAdjacentElement('afterend', helperText);
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

    // Fallback FAQ answers for legacy pages whose accordion panels are empty.
    const faqAnswers = [
      "Most clients go live in 48–72 hours after we confirm your needs. That includes matching, onboarding, and training on your script + process.",
      "Cold calling, appointment setting, skip tracing/list pulling, lead management, follow-up (SMS/email), dispo support, comps, CRM buildouts, and admin ops, built for wholesaling workflows.",
      "No long-term contracts. Cancel anytime with 30 days’ written notice (per our Refund Policy).",
      "Setup fee + first month are paid upfront. Monthly billing after that. Setup fees are non-refundable once onboarding starts. See Refund Policy for details.",
      "If you’re not satisfied within the first 5 business days, we replace the VA at no extra placement cost. You get a replacement, not a cash refund."
    ];
    const faqPanels = document.querySelectorAll('#faq [data-slot="accordion-content"]');
    faqPanels.forEach((panel, i) => {
      if (!panel.textContent.trim()) {
        panel.textContent = faqAnswers[i] || '';
      }
    });
    // Ensure the last FAQ item has a bottom border
    const faqItems = document.querySelectorAll('#faq [data-slot="accordion-item"]');
    if (faqItems.length) {
      faqItems[faqItems.length - 1].classList.remove('last:border-b-0');
    }

    document.querySelectorAll('.accordion-btn').forEach(btn => {
      if (btn.dataset.vaAccordionBound === 'true') return;
      btn.dataset.vaAccordionBound = 'true';
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        const body = btn.nextElementSibling;
        const icon = btn.querySelector('.accordion-icon');
        if (!body) return;
        const isOpen = body.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        if (icon) icon.classList.toggle('open', isOpen);
      });
    });

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
          price: '1,160',
          rate: '$6/hr',
          subtext: 'Readymode dialer seat included',
          buttonText: 'Get Started',
          buttonHref: 'https://buy.stripe.com/4gMfZafNHgMIfn4dn1aMU04',
          buttonNewTab: false,
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
          price: '1,000',
          rate: '$5/hr',
          subtext: 'Readymode dialer seat included',
          buttonText: 'Get Started',
          buttonHref: 'https://buy.stripe.com/4gMfZafNHgMIfn4dn1aMU04',
          buttonNewTab: false,
          features: [
            'Multi-caller outbound team (3+ seats)',
            'Accent-neutral, US-ready English',
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
          buttonText: 'Contact Us',
          buttonHref: calendlyURL,
          buttonNewTab: true,
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
          price: '1,120',
          rate: '$7/hr',
          subtext: '',
          buttonText: 'Get Started',
          buttonHref: 'https://buy.stripe.com/7sY14g1WRfIEb6Oer5aMU05',
          buttonNewTab: false,
          features: [
            'Lead re-qualification & scoring',
            'Follow-up that keeps sellers warm',
            'Warm hand-offs to your closer',
            'CRM tagging & pipeline hygiene',
            'Daily lead status reporting',
            'Ideal at 50+ qualified leads/month'
          ]
        },
        {
          title: 'Acquisition Manager',
          price: '1,440',
          rate: '$9/hr',
          subtext: '',
          buttonText: 'Get Started',
          buttonHref: 'https://buy.stripe.com/28EaEQgRL5404Iq2InaMU06',
          buttonNewTab: false,
          features: [
            'Deep Lead Scrubbing',
            'Comps, Offers & Negotiation',
            'Contract Management',
            'Dedicated Follow-Up',
            'CRM Pipeline Hygiene',
            'Vetted: 2+ Closed Deals on Record',
            'Due Diligence Support',
            'Closing Coordination'
          ]
        },
        {
          title: 'Dispositions Manager',
          price: '1,440',
          rate: '$9/hr',
          subtext: '',
          buttonText: 'Get Started',
          buttonHref: 'https://buy.stripe.com/7sY7sE6d7eEA1weciXaMU07',
          buttonNewTab: false,
          features: [
            'Buyer Relations',
            'Marketing Deals',
            'Negotiating Sales',
            'Closing Coordination',
            'Buyer Network Growth',
            'Buyer Pricing Intel for Your AM'
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
        badgeEl: card.querySelector('[data-slot="badge"]'), // Select the '3+ Callers' badge
        buttonEl: card.querySelector('[data-slot="button"]')
      };
    });

    let currentMode = 'leadGenerators';

    const renderPricing = () => {
      // Fade out
      cardElements.forEach(els => {
        els.card.style.opacity = '0';
        els.card.style.transform = 'translateY(10px)';
      });

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
            els.featuresEl.replaceChildren();
            data[index].features.forEach(feat => {
              const item = document.createElement('li');
              item.className = 'flex items-start';

              const checkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              checkIcon.setAttribute('width', '24');
              checkIcon.setAttribute('height', '24');
              checkIcon.setAttribute('viewBox', '0 0 24 24');
              checkIcon.setAttribute('fill', 'none');
              checkIcon.setAttribute('stroke', 'currentColor');
              checkIcon.setAttribute('stroke-width', '2');
              checkIcon.setAttribute('stroke-linecap', 'round');
              checkIcon.setAttribute('stroke-linejoin', 'round');
              checkIcon.classList.add('w-5', 'h-5', 'text-va-gold', 'shrink-0', 'mr-2');

              const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
              polyline.setAttribute('points', '20 6 9 17 4 12');
              checkIcon.appendChild(polyline);

              const label = document.createElement('span');
              label.className = 'text-va-dark text-sm';
              label.textContent = feat;

              item.append(checkIcon, label);
              els.featuresEl.appendChild(item);
            });
          }

          if (els.badgeEl) {
            // Hide badge in managers mode, show otherwise
            els.badgeEl.style.display = currentMode === 'managers' ? 'none' : '';
          }

          if (els.buttonEl && data[index].buttonHref) {
            els.buttonEl.href = data[index].buttonHref;
            els.buttonEl.textContent = data[index].buttonText || 'Get Started';
            if (data[index].buttonNewTab) {
              els.buttonEl.setAttribute('target', '_blank');
              els.buttonEl.setAttribute('rel', 'noopener noreferrer');
            } else {
              els.buttonEl.removeAttribute('target');
              els.buttonEl.removeAttribute('rel');
            }
          }
        }
      });

      // Fade In
      requestAnimationFrame(() => {
        cardElements.forEach(els => {
          els.card.style.opacity = '1';
          els.card.style.transform = 'translateY(0)';
        });
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
      'Real estate cold calling VAs trained on motivated seller outreach, objection handling, and clean lead qualification.',
      'PropStream and BatchLeads support for list pulling, skip tracing, and cleaner seller data before the dialer starts.',
      'HighLevel CRM setup with A2P SMS campaigns, Zapier connections, pipeline stages, and follow-up workflows.',
      'Buyer outreach, offer vetting, and deal follow-up so contracts do not sit idle near expiration.',
      'Multi-channel follow-up for old leads, no-answers, and sellers who need more than one touch before replying.',
      'Daily KPI tracking, call review, QA scorecards, CRM tagging checks, and coaching notes.'
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
      navMenu.childNodes.forEach(node => {
        mobileMenu.appendChild(node.cloneNode(true));
      });
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

    const pageMenuBtn = document.getElementById('mobile-menu-btn');
    const pageMobileMenu = document.getElementById('mobile-menu');
    if (pageMenuBtn && pageMobileMenu && pageMenuBtn.dataset.vaMenuBound !== 'true') {
      pageMenuBtn.dataset.vaMenuBound = 'true';
      pageMenuBtn.setAttribute('aria-expanded', String(!pageMobileMenu.classList.contains('hidden')));
      pageMenuBtn.addEventListener('click', () => {
        pageMobileMenu.classList.toggle('hidden');
        pageMenuBtn.setAttribute('aria-expanded', String(!pageMobileMenu.classList.contains('hidden')));
      });
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

    document.querySelectorAll('[data-notify-form]').forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        const status = form.querySelector('[data-notify-status]') || document.createElement('p');
        if (!status.isConnected) {
          status.setAttribute('data-notify-status', '');
          status.className = 'text-sm text-va-gold mt-2';
          form.appendChild(status);
        }
        status.textContent = 'Thanks. We will email you at launch.';
        form.reset();
      });
    });
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(init);
  } else {
    setTimeout(init, 0);
  }
});
