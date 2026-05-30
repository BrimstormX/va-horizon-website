'use strict';

const CHECKS = {
  c1:  { severity: 'critical', label: 'Brand not registered with TCR' },
  c2:  { severity: 'critical', label: 'Campaign not registered' },
  c3:  { severity: 'critical', label: 'Using a shared short code' },
  c4:  { severity: 'high',     label: 'Toll-free number unverified' },
  c5:  { severity: 'critical', label: 'No opt-out language in messages' },
  c6:  { severity: 'high',     label: 'High-pressure / urgency language' },
  c7:  { severity: 'high',     label: 'Financially promotional language' },
  c8:  { severity: 'medium',   label: 'Excessive capitalization / punctuation' },
  c9:  { severity: 'critical', label: 'Using blocked URL shorteners' },
  c10: { severity: 'medium',   label: 'No business identification in first message' },
  c11: { severity: 'high',     label: 'No prior express consent documented' },
  c12: { severity: 'high',     label: 'Sending outside permitted hours (8 AM–9 PM)' },
  c13: { severity: 'critical', label: 'Not honoring opt-outs' },
  c14: { severity: 'high',     label: 'List not scrubbed against DNC registry' },
  c15: { severity: 'high',     label: 'Exceeding volume limits on unregistered numbers' },
  c16: { severity: 'medium',   label: 'Burst sending without throttling' },
  c17: { severity: 'high',     label: 'Using number rotation to evade limits' },
};

function el(tag, attrs, text) {
  const node = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') node.className = v;
    else if (k === 'style') node.style.cssText = v;
    else node.setAttribute(k, v);
  });
  if (text !== undefined) node.textContent = text;
  return node;
}

function analyzeCompliance() {
  const issues = [];
  let critCount = 0, highCount = 0, medCount = 0;

  Object.entries(CHECKS).forEach(function([id, check]) {
    const checkbox = document.getElementById(id);
    if (checkbox && checkbox.checked) {
      issues.push(check);
      if (check.severity === 'critical') critCount++;
      else if (check.severity === 'high') highCount++;
      else medCount++;
    }
  });

  let cls, title, summary;
  if (critCount > 0) {
    cls = 'fail';
    title = critCount + ' Critical Issue' + (critCount > 1 ? 's' : '') + ' Found';
    summary = 'Your campaign has ' + critCount + ' critical compliance violation' +
      (critCount > 1 ? 's' : '') + ' that will result in blocked or filtered messages' +
      (highCount > 0 ? ', plus ' + highCount + ' high-severity issue' + (highCount > 1 ? 's' : '') : '') +
      '. Do not send until these are resolved.';
  } else if (highCount > 0) {
    cls = 'warn';
    title = highCount + ' High-Risk Issue' + (highCount > 1 ? 's' : '') + ' Flagged';
    summary = 'No critical violations, but ' + highCount + ' high-severity issue' +
      (highCount > 1 ? 's' : '') + ' could lead to poor delivery rates, carrier filtering, or TCPA exposure.';
  } else if (medCount > 0) {
    cls = 'warn';
    title = medCount + ' Medium-Risk Item' + (medCount > 1 ? 's' : '') + ' to Review';
    summary = 'No critical or high-severity violations. ' + medCount + ' medium-risk item' +
      (medCount > 1 ? 's' : '') + ' could improve your deliverability and professionalism.';
  } else {
    cls = 'pass';
    title = 'No Red Flags Detected';
    summary = "Your campaign didn't trigger any of the common compliance red flags. " +
      'Continue following best practices: monitor opt-out rates, keep sending within permitted hours, ' +
      'and re-verify your A2P registration periodically.';
  }

  const panel = document.getElementById('result-panel');
  panel.className = 'result-panel ' + cls;
  panel.style.display = 'block';

  // Clear and rebuild panel content with DOM methods (no innerHTML)
  while (panel.firstChild) panel.removeChild(panel.firstChild);

  panel.appendChild(el('div', { className: 'result-title ' + cls }, title));
  panel.appendChild(el('p', { className: 'text-sm mt-2', style: 'color:inherit;opacity:0.85;' }, summary));

  if (issues.length > 0) {
    const wrap = el('div', { className: 'mt-4' });
    wrap.appendChild(el('p', { className: 'font-bold text-sm mb-2' }, 'Issues Identified:'));

    issues.forEach(function(issue) {
      const dotColor = issue.severity === 'critical' ? 'red' : issue.severity === 'high' ? 'yellow' : 'green';
      const badgeColor = issue.severity === 'critical' ? '#B91C1C' : issue.severity === 'high' ? '#B45309' : '#6B7280';

      const row = el('div', { className: 'flag-item' });
      row.appendChild(el('div', { className: 'flag-dot ' + dotColor }));
      row.appendChild(el('span', { style: 'color:' + badgeColor + ';font-weight:700;font-size:0.75rem;text-transform:uppercase;margin-right:8px;' }, issue.severity));
      row.appendChild(el('span', { className: 'text-sm text-va-dark' }, issue.label));
      wrap.appendChild(row);
    });

    panel.appendChild(wrap);
  }

  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('analyze-btn');
  if (btn) btn.addEventListener('click', analyzeCompliance);
});
