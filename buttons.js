// Adds interactive behaviors for buttons and FAQs

document.addEventListener('DOMContentLoaded', () => {
  // Map button labels to the sections they should scroll to
  const scrollMap = {
    'Services': '#services',
    'Process': '#how-it-works',
    'Pricing': '#pricing',
    'Pilot': '#promo-packages',
    'FAQ': '#faq',
    'Contact': '#contact',
    'Book 15-min Audit': '#contact',
    'Book Your Strategy Call Now': '#contact',
    'Get Started': '#contact',
    'Contact Us': '#contact',
    'Reserve Now': '#contact',
    'Learn More': '#contact'
  };

  // Attach scroll behavior to known buttons
  document.querySelectorAll('button').forEach(btn => {
    const label = btn.textContent.trim();
    const target = scrollMap[label];
    if (target) {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });

  // Basic accordion toggle for FAQ section
  document.querySelectorAll('button[data-slot="accordion-trigger"]').forEach(btn => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (panel) {
      btn.addEventListener('click', () => {
        panel.toggleAttribute('hidden');
      });
    }
  });

  // Simple dialog toggle for "Learn More" buttons
  document.querySelectorAll('button[data-slot="dialog-trigger"]').forEach(btn => {
    const dialog = document.getElementById(btn.getAttribute('aria-controls'));
    if (dialog) {
      btn.addEventListener('click', () => {
        dialog.toggleAttribute('hidden');
      });
    }
  });
});

