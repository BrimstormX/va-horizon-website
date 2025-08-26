// Adds interactive behaviors for buttons, pricing switch, and content tweaks

document.addEventListener('DOMContentLoaded', () => {
  const calendlyURL = 'https://calendly.com/youssef-vahorizon/30min';

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

  document.querySelectorAll('button, a').forEach(el => {
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

  // FAQ answers and toggle
  const faqAnswers = [
    'Most VAs start within 48 hours after onboarding.',
    'We will replace your VA anytime during your subscription.',
    'We can provide tools or work with the systems you already use.',
    'Training covers scripts, tools and real-world role play.',
    'You can add more VAs whenever you need.',
    'Subscriptions are billed monthly with no long-term contracts.',
    'Yes, we support multiple real estate niches.',
    'VAs work in your preferred time zone.'
  ];
  document.querySelectorAll('#faq [data-slot="accordion-content"]').forEach((panel, i) => {
    panel.textContent = faqAnswers[i] || '';
    panel.hidden = true;
  });
  document.querySelectorAll('button[data-slot="accordion-trigger"]').forEach(btn => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (panel) {
      btn.addEventListener('click', () => {
        panel.hidden = !panel.hidden;
      });
    }
  });

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
        partBtn.classList.add('bg-va-gold', 'text-white', 'shadow-md', 'transform', 'scale-105');
        fullBtn.classList.remove('bg-va-gold', 'text-white', 'shadow-md', 'transform', 'scale-105');
        renderPricing();
      }
    });
    fullBtn.addEventListener('click', () => {
      if (!fullTime) {
        fullTime = true;
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

  // VA dashboard name and metrics
  const vaNames = ['Ahmed Hassan','Nader Ali','Junel Farouk','Youssef Samir','Hadi Omar','Salim Mansour','Kareem Fawzi','Layla Nabil','Samir Khaled','Omar Yasin'];
  const nameSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Your VA:'));
  if (nameSpan) {
    const name = vaNames[Math.floor(Math.random() * vaNames.length)];
    nameSpan.textContent = `Your VA: ${name}`;
  }
  const metrics = { 'cold-calls': 0, appointments: 0, lists: 0 };
  setInterval(() => {
    Object.keys(metrics).forEach(key => {
      metrics[key] += Math.floor(Math.random() * 3);
      const el = document.querySelector(`[data-metric="${key}"]`);
      if (el) el.textContent = metrics[key];
    });
  }, 5000);

  // Mobile menu toggle
  const menuBtn = document.querySelector('header .md\\:hidden button');
  const navMenu = document.querySelector('header nav');
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const opening = navMenu.classList.contains('hidden');
      if (opening) {
        navMenu.classList.remove('hidden');
        navMenu.classList.add('flex', 'flex-col', 'space-y-4', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-va-nav', 'p-4');
      } else {
        navMenu.classList.add('hidden');
        navMenu.classList.remove('flex', 'flex-col', 'space-y-4', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-va-nav', 'p-4');
      }
    });
  }

  // Contact form submission
  const contactForm = document.querySelector('#contact form');
  if (contactForm) {
    contactForm.action = 'https://formsubmit.co/Youssef@VAHorizon.site';
    contactForm.method = 'POST';
    const nameInput = contactForm.querySelector('#contact-name');
    if (nameInput) nameInput.name = 'name';
    const emailInput = contactForm.querySelector('#contact-email');
    if (emailInput) emailInput.name = 'email';
    const companyInput = contactForm.querySelector('#contact-company');
    if (companyInput) companyInput.name = 'company';
    const messageInput = contactForm.querySelector('#contact-message');
    if (messageInput) messageInput.name = 'message';
  }
});
