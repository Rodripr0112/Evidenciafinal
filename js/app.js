document.addEventListener('DOMContentLoaded', () => {
  // Keyboard restriction on all inputs
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', restrictInput);

    // Block paste of non-integer content
    input.addEventListener('paste', e => {
      e.preventDefault();
      const text = e.clipboardData.getData('text').trim();
      if (/^\d+$/.test(text) && Number(text) > 0) {
        e.target.value = text;
      }
    });
  });

  document.getElementById('btn-calculate').addEventListener('click', calculate);
  document.getElementById('btn-reset').addEventListener('click', reset);

  clearCanvas();
  drawReferenceTriangle();
});

function getRaw() {
  return {
    a: document.getElementById('side-a').value.trim(),
    b: document.getElementById('side-b').value.trim(),
    c: document.getElementById('side-c').value.trim(),
    A: document.getElementById('angle-A').value.trim(),
    B: document.getElementById('angle-B').value.trim(),
    C: document.getElementById('angle-C').value.trim(),
  };
}

function calculate() {
  // Clear any previous error highlights
  document.querySelectorAll('input').forEach(i => i.classList.remove('input-error'));

  const raw = getRaw();

  // Step 1 — validate
  const validation = validateInputs(raw);
  if (!validation.valid) {
    renderError(validation.error);
    return;
  }

  const inputs = validation.inputs;

  // Step 2 — detect case
  const caseType = detectCase(inputs);

  // Step 3 — solve
  const solutions = solveTriangle(inputs);

  // Step 4 — render + draw
  renderResults(solutions, caseType);
}

function reset() {
  document.querySelectorAll('input').forEach(i => {
    i.value = '';
    i.classList.remove('input-error');
  });
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('results-container').innerHTML = '';
  clearCanvas();
}
