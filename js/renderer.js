const CASE_LABELS = {
  SSS: 'SSS — Tres lados conocidos (Ley de Cosenos)',
  SAS: 'SAS — Dos lados y ángulo incluido (Ley de Cosenos)',
  ASA: 'ASA — Dos ángulos y lado incluido (Ley de Senos)',
  AAS: 'AAS — Dos ángulos y lado no incluido (Ley de Senos)',
  SSA: 'SSA — Dos lados y ángulo no incluido (Caso Ambiguo)',
};

function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return parseFloat(n.toFixed(4)).toString();
}

function calcArea(sol) {
  const s = (sol.a + sol.b + sol.c) / 2;
  return Math.round(Math.sqrt(s*(s-sol.a)*(s-sol.b)*(s-sol.c)) * 10000) / 10000;
}

function renderError(message) {
  const section = document.getElementById('results-section');
  const container = document.getElementById('results-container');
  section.classList.remove('hidden');
  container.innerHTML = `<div class="error-box">${message}</div>`;
  clearCanvas();
}

function renderResults(solutions, caseType) {
  const section = document.getElementById('results-section');
  const container = document.getElementById('results-container');
  section.classList.remove('hidden');
  container.innerHTML = '';

  if (solutions.length === 1 && solutions[0].error) {
    container.innerHTML = `<div class="error-box">${solutions[0].error}</div>`;
    clearCanvas();
    return;
  }

  // Case badge
  const caseDiv = document.createElement('div');
  caseDiv.className = 'case-label';
  caseDiv.innerHTML = `<strong>Caso detectado:</strong>&nbsp;${CASE_LABELS[caseType] || caseType}`;
  if (caseType === 'SSA') {
    const badge = document.createElement('span');
    badge.className = 'ssa-badge';
    badge.textContent = `${solutions.length} solución(es)`;
    caseDiv.appendChild(badge);
  }
  container.appendChild(caseDiv);

  // One card per solution
  solutions.forEach((sol, idx) => {
    if (sol.error) {
      container.innerHTML += `<div class="error-box">${sol.error}</div>`;
      return;
    }

    const sumAngles = Math.round((sol.A + sol.B + sol.C) * 100) / 100;
    const boxClass  = solutions.length > 1 ? `solution-${idx + 1}` : '';

    const div = document.createElement('div');
    div.className = `solution-box ${boxClass}`;
    div.innerHTML = `
      <h3>${solutions.length > 1 ? `Solución ${idx + 1}` : 'Resultado'}</h3>
      <div class="results-grid">
        <div class="result-group">
          <h4>Lados</h4>
          <p>a = <strong>${fmt(sol.a)}</strong></p>
          <p>b = <strong>${fmt(sol.b)}</strong></p>
          <p>c = <strong>${fmt(sol.c)}</strong></p>
        </div>
        <div class="result-group">
          <h4>Ángulos</h4>
          <p>A = <strong>${fmt(sol.A)}°</strong></p>
          <p>B = <strong>${fmt(sol.B)}°</strong></p>
          <p>C = <strong>${fmt(sol.C)}°</strong></p>
        </div>
        <div class="result-group verification">
          <h4>Verificación</h4>
          <p>A+B+C = <strong>${sumAngles}°</strong></p>
          <p>Perímetro = <strong>${fmt(sol.a + sol.b + sol.c)}</strong></p>
          <p>Área = <strong>${fmt(calcArea(sol))}</strong></p>
        </div>
      </div>`;
    container.appendChild(div);
  });

  // Draw first valid solution
  const first = solutions.find(s => !s.error);
  if (first) drawTriangle(first);
  else clearCanvas();
}

// ── Canvas ───────────────────────────────────────────────────────────────────
function clearCanvas() {
  const canvas = document.getElementById('triangle-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTriangle(sol) {
  const canvas = document.getElementById('triangle-canvas');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const PAD = 70;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);

  // Compute vertices in math space (Y up)
  const Ar = sol.A * DEG;
  const ax = 0,       ay = 0;
  const bx = sol.c,   by = 0;
  const cx = sol.b * Math.cos(Ar);
  const cy = sol.b * Math.sin(Ar);

  // Bounding box → scale → canvas transform (flip Y)
  const minX = Math.min(ax, bx, cx), maxX = Math.max(ax, bx, cx);
  const minY = Math.min(ay, by, cy), maxY = Math.max(ay, by, cy);
  const scale = Math.min((W - 2*PAD) / (maxX - minX || 1),
                         (H - 2*PAD) / (maxY - minY || 1));

  const tx = x => PAD + (x - minX) * scale;
  const ty = y => H - PAD - (y - minY) * scale;

  const pA = { x: tx(ax), y: ty(ay) };
  const pB = { x: tx(bx), y: ty(by) };
  const pC = { x: tx(cx), y: ty(cy) };

  // Filled triangle
  ctx.beginPath();
  ctx.moveTo(pA.x, pA.y);
  ctx.lineTo(pB.x, pB.y);
  ctx.lineTo(pC.x, pC.y);
  ctx.closePath();
  ctx.fillStyle   = 'rgba(37, 99, 235, 0.08)';
  ctx.fill();
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth   = 2.5;
  ctx.stroke();

  // Vertex dots
  [pA, pB, pC].forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2*Math.PI);
    ctx.fillStyle = '#2563eb';
    ctx.fill();
  });

  // Centroid for outward label offsets
  const cg = { x: (pA.x+pB.x+pC.x)/3, y: (pA.y+pB.y+pC.y)/3 };
  function outward(p, dist) {
    const dx = p.x - cg.x, dy = p.y - cg.y;
    const len = Math.sqrt(dx*dx+dy*dy) || 1;
    return { x: p.x + dx/len*dist, y: p.y + dy/len*dist };
  }

  // Vertex labels
  ctx.font      = 'bold 15px "Segoe UI", sans-serif';
  ctx.fillStyle = '#1e3a8a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const lA = outward(pA, 22); ctx.fillText('A', lA.x, lA.y);
  const lB = outward(pB, 22); ctx.fillText('B', lB.x, lB.y);
  const lC = outward(pC, 22); ctx.fillText('C', lC.x, lC.y);

  // Side labels (midpoint, offset perpendicular outward from centroid)
  ctx.font      = '13px "Segoe UI", sans-serif';
  ctx.fillStyle = '#dc2626';

  function midLabel(p1, p2, text) {
    const mid = { x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2 };
    const off = outward(mid, 18);
    ctx.fillText(text, off.x, off.y);
  }

  midLabel(pB, pC, `a = ${fmt(sol.a)}`);
  midLabel(pA, pC, `b = ${fmt(sol.b)}`);
  midLabel(pA, pB, `c = ${fmt(sol.c)}`);

  // Angle labels (inward from each vertex)
  ctx.font      = '12px "Segoe UI", sans-serif';
  ctx.fillStyle = '#065f46';

  function inward(p, dist) {
    const dx = cg.x - p.x, dy = cg.y - p.y;
    const len = Math.sqrt(dx*dx+dy*dy) || 1;
    return { x: p.x + dx/len*dist, y: p.y + dy/len*dist };
  }

  const iA = inward(pA, 28); ctx.fillText(`${fmt(sol.A)}°`, iA.x, iA.y);
  const iB = inward(pB, 28); ctx.fillText(`${fmt(sol.B)}°`, iB.x, iB.y);
  const iC = inward(pC, 28); ctx.fillText(`${fmt(sol.C)}°`, iC.x, iC.y);
}

// ── Reference diagram (static) ───────────────────────────────────────────────
function drawReferenceTriangle() {
  const canvas = document.getElementById('ref-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pad = 30;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);

  const pA = { x: pad,     y: H - pad };
  const pB = { x: W - pad, y: H - pad };
  const pC = { x: W * 0.38, y: pad };

  ctx.beginPath();
  ctx.moveTo(pA.x, pA.y);
  ctx.lineTo(pB.x, pB.y);
  ctx.lineTo(pC.x, pC.y);
  ctx.closePath();
  ctx.fillStyle   = 'rgba(37, 99, 235, 0.08)';
  ctx.fill();
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth   = 1.8;
  ctx.stroke();

  ctx.font      = 'bold 13px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#1e3a8a';
  ctx.fillText('A', pA.x - 14, pA.y);
  ctx.fillText('B', pB.x + 14, pB.y);
  ctx.fillText('C', pC.x, pC.y - 14);

  ctx.font      = 'italic 12px "Segoe UI", sans-serif';
  ctx.fillStyle = '#dc2626';
  ctx.fillText('a', (pB.x+pC.x)/2 + 10, (pB.y+pC.y)/2);
  ctx.fillText('b', (pA.x+pC.x)/2 - 10, (pA.y+pC.y)/2);
  ctx.fillText('c', (pA.x+pB.x)/2,       pA.y + 14);
}
