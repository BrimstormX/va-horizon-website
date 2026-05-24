const arvInput = document.getElementById('arv');
const repairsInput = document.getElementById('repairs');
const assignmentInput = document.getElementById('assignment');
const ruleSlider = document.getElementById('rule');
const ruleDisplay = document.getElementById('rule-display');
const resultBox = document.getElementById('result');
const warningBox = document.getElementById('warning');
const placeholder = document.getElementById('placeholder-msg');

function fmt(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function calc() {
  const arv = parseFloat(arvInput.value) || 0;
  const repairs = parseFloat(repairsInput.value) || 0;
  const assignment = parseFloat(assignmentInput.value) || 0;
  const rule = parseFloat(ruleSlider.value) / 100;

  if (arv === 0) {
    resultBox.style.display = 'none';
    warningBox.style.display = 'none';
    placeholder.style.display = 'block';
    return;
  }

  const adjARV = arv * rule;
  const mao = adjARV - repairs - assignment;
  const buyerMargin = arv - repairs - assignment - mao;
  placeholder.style.display = 'none';

  if (mao <= 0) {
    warningBox.style.display = 'block';
    resultBox.style.display = 'none';
    return;
  }

  warningBox.style.display = 'none';
  resultBox.style.display = 'block';

  document.getElementById('mao-result').textContent = fmt(mao);
  document.getElementById('mao-formula-display').textContent =
    '(' + fmt(arv) + ' x ' + (rule * 100).toFixed(0) + '%) - ' + fmt(repairs) + ' repairs - ' + fmt(assignment) + ' fee';
  document.getElementById('r-arv-adj').textContent = fmt(adjARV);
  document.getElementById('r-repairs').textContent = '-' + fmt(repairs);
  document.getElementById('r-assignment').textContent = '-' + fmt(assignment);
  document.getElementById('r-margin').textContent = fmt(buyerMargin);
}

function updateSlider() {
  const pct = ((ruleSlider.value - 55) / (85 - 55)) * 100;
  ruleSlider.style.setProperty('--pct', pct + '%');
  ruleDisplay.textContent = ruleSlider.value + '%';
  calc();
}

[arvInput, repairsInput, assignmentInput].forEach(el => el.addEventListener('input', calc));
ruleSlider.addEventListener('input', updateSlider);
updateSlider();
