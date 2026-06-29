/* VA Horizon conversion event tracking (Plausible custom events).
   Loaded sitewide (injected by scripts/build-site.mjs). CSP-safe: external 'self' script,
   no inline handlers. Define Goals in the Plausible dashboard to see these as conversions:
   BookCall, CheckoutClick, FormSubmit, Purchase. */
(function () {
  // Plausible custom-event stub (queues until plausible.js loads).
  window.plausible = window.plausible || function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };

  function send(name, props) {
    try {
      window.plausible(name, props ? { props: props } : undefined);
    } catch (e) { /* no-op */ }
  }

  // Purchase confirmation (Stripe success lands on /thank-you/).
  if (/\/thank-you(\/|$)/.test(location.pathname)) {
    send('Purchase', { path: location.pathname });
  }

  // Delegated click tracking for primary CTAs.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/calendly\.com/i.test(href)) {
      send('BookCall', { path: location.pathname });
    } else if (/buy\.stripe\.com/i.test(href)) {
      send('CheckoutClick', { path: location.pathname });
    }
  }, true);

  // Form submissions (hero form, /apply/, lead magnet).
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.tagName === 'FORM') {
      var id = f.getAttribute('id') || f.getAttribute('name') || 'form';
      send('FormSubmit', { form: id, path: location.pathname });
    }
  }, true);
})();
