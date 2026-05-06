const DEG = Math.PI / 180;

function r(n, d = 4) {
  return Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
}

// ── Case detection ──────────────────────────────────────────────────────────
function detectCase(inputs) {
  const { a, b, c, A, B, C } = inputs;
  const sides  = [a, b, c].filter(v => v !== null).length;
  const angles = [A, B, C].filter(v => v !== null).length;

  if (sides === 3) return 'SSS';

  if (sides === 2 && angles === 1) {
    // Included angle → SAS; non-included → SSA
    if (a !== null && b !== null && C !== null) return 'SAS';
    if (a !== null && c !== null && B !== null) return 'SAS';
    if (b !== null && c !== null && A !== null) return 'SAS';
    return 'SSA';
  }

  if (sides === 1 && angles === 2) {
    // Side between the two angles → ASA; otherwise → AAS
    if (A !== null && B !== null && c !== null) return 'ASA';
    if (A !== null && C !== null && b !== null) return 'ASA';
    if (B !== null && C !== null && a !== null) return 'ASA';
    return 'AAS';
  }

  return 'UNKNOWN';
}

// ── Solvers ─────────────────────────────────────────────────────────────────
function solveSSS({ a, b, c }) {
  const cosA = (b*b + c*c - a*a) / (2*b*c);
  const cosB = (a*a + c*c - b*b) / (2*a*c);
  if (cosA < -1 || cosA > 1 || cosB < -1 || cosB > 1) {
    return { error: 'Los lados no forman un triángulo válido (ley de cosenos)' };
  }
  const A = r(Math.acos(cosA) / DEG);
  const B = r(Math.acos(cosB) / DEG);
  const C = r(180 - A - B);
  return { a, b, c, A, B, C, caseType: 'SSS' };
}

function solveSAS({ a, b, c, A, B, C }) {
  if (a !== null && b !== null && C !== null) {
    const newC = r(Math.sqrt(a*a + b*b - 2*a*b*Math.cos(C*DEG)));
    const sinA = a * Math.sin(C*DEG) / newC;
    if (Math.abs(sinA) > 1) return { error: 'No forma un triángulo válido' };
    const newA = r(Math.asin(Math.min(1, sinA)) / DEG);
    const newB = r(180 - newA - C);
    return { a, b, c: newC, A: newA, B: newB, C, caseType: 'SAS' };
  }
  if (a !== null && c !== null && B !== null) {
    const newB = r(Math.sqrt(a*a + c*c - 2*a*c*Math.cos(B*DEG)));
    const sinA = a * Math.sin(B*DEG) / newB;
    if (Math.abs(sinA) > 1) return { error: 'No forma un triángulo válido' };
    const newA = r(Math.asin(Math.min(1, sinA)) / DEG);
    const newC = r(180 - newA - B);
    return { a, b: newB, c, A: newA, B, C: newC, caseType: 'SAS' };
  }
  if (b !== null && c !== null && A !== null) {
    const newA = r(Math.sqrt(b*b + c*c - 2*b*c*Math.cos(A*DEG)));
    const sinB = b * Math.sin(A*DEG) / newA;
    if (Math.abs(sinB) > 1) return { error: 'No forma un triángulo válido' };
    const newB = r(Math.asin(Math.min(1, sinB)) / DEG);
    const newC = r(180 - A - newB);
    return { a: newA, b, c, A, B: newB, C: newC, caseType: 'SAS' };
  }
  return { error: 'Error interno en SAS' };
}

function solveASA({ a, b, c, A, B, C }) {
  if (A !== null && B !== null && c !== null) {
    const newC = r(180 - A - B);
    if (newC <= 0) return { error: 'Los ángulos no forman un triángulo válido' };
    return {
      a: r(c * Math.sin(A*DEG) / Math.sin(newC*DEG)),
      b: r(c * Math.sin(B*DEG) / Math.sin(newC*DEG)),
      c, A, B, C: newC, caseType: 'ASA'
    };
  }
  if (A !== null && C !== null && b !== null) {
    const newB = r(180 - A - C);
    if (newB <= 0) return { error: 'Los ángulos no forman un triángulo válido' };
    return {
      a: r(b * Math.sin(A*DEG) / Math.sin(newB*DEG)),
      b, c: r(b * Math.sin(C*DEG) / Math.sin(newB*DEG)),
      A, B: newB, C, caseType: 'ASA'
    };
  }
  if (B !== null && C !== null && a !== null) {
    const newA = r(180 - B - C);
    if (newA <= 0) return { error: 'Los ángulos no forman un triángulo válido' };
    return {
      a, b: r(a * Math.sin(B*DEG) / Math.sin(newA*DEG)),
      c: r(a * Math.sin(C*DEG) / Math.sin(newA*DEG)),
      A: newA, B, C, caseType: 'ASA'
    };
  }
  return { error: 'Error interno en ASA' };
}

function solveAAS({ a, b, c, A, B, C }) {
  if (A !== null && B !== null) {
    const newC = r(180 - A - B);
    if (newC <= 0) return { error: 'Los ángulos no forman un triángulo válido' };
    if (a !== null) return { a, b: r(a*Math.sin(B*DEG)/Math.sin(A*DEG)), c: r(a*Math.sin(newC*DEG)/Math.sin(A*DEG)), A, B, C: newC, caseType: 'AAS' };
    if (b !== null) return { a: r(b*Math.sin(A*DEG)/Math.sin(B*DEG)), b, c: r(b*Math.sin(newC*DEG)/Math.sin(B*DEG)), A, B, C: newC, caseType: 'AAS' };
  }
  if (A !== null && C !== null) {
    const newB = r(180 - A - C);
    if (newB <= 0) return { error: 'Los ángulos no forman un triángulo válido' };
    if (a !== null) return { a, b: r(a*Math.sin(newB*DEG)/Math.sin(A*DEG)), c: r(a*Math.sin(C*DEG)/Math.sin(A*DEG)), A, B: newB, C, caseType: 'AAS' };
    if (c !== null) return { a: r(c*Math.sin(A*DEG)/Math.sin(C*DEG)), b: r(c*Math.sin(newB*DEG)/Math.sin(C*DEG)), c, A, B: newB, C, caseType: 'AAS' };
  }
  if (B !== null && C !== null) {
    const newA = r(180 - B - C);
    if (newA <= 0) return { error: 'Los ángulos no forman un triángulo válido' };
    if (b !== null) return { a: r(b*Math.sin(newA*DEG)/Math.sin(B*DEG)), b, c: r(b*Math.sin(C*DEG)/Math.sin(B*DEG)), A: newA, B, C, caseType: 'AAS' };
    if (c !== null) return { a: r(c*Math.sin(newA*DEG)/Math.sin(C*DEG)), b: r(c*Math.sin(B*DEG)/Math.sin(C*DEG)), c, A: newA, B, C, caseType: 'AAS' };
  }
  return { error: 'Error interno en AAS' };
}

// SSA — ambiguous case; may return 0, 1 or 2 solutions
function solveSSA(inputs) {
  const { a, b, c, A, B, C } = inputs;
  // Map to generic form: s1 opposite ang1, s2 is other known side
  if (a !== null && b !== null && A !== null) return _ssa(a, b, A, 'a','b','c','A','B','C');
  if (a !== null && b !== null && B !== null) return _ssa(b, a, B, 'b','a','c','B','A','C');
  if (a !== null && c !== null && A !== null) return _ssa(a, c, A, 'a','c','b','A','C','B');
  if (a !== null && c !== null && C !== null) return _ssa(c, a, C, 'c','a','b','C','A','B');
  if (b !== null && c !== null && B !== null) return _ssa(b, c, B, 'b','c','a','B','C','A');
  if (b !== null && c !== null && C !== null) return _ssa(c, b, C, 'c','b','a','C','B','A');
  return [{ error: 'Error interno en SSA' }];
}

function _ssa(s1, s2, ang1, ns1, ns2, ns3, nA1, nA2, nA3) {
  // sin(ang2) = s2 * sin(ang1) / s1
  const sinA2 = (s2 * Math.sin(ang1 * DEG)) / s1;

  if (sinA2 > 1 + 1e-9) {
    return [{ error: 'Sin solución: los valores dados no forman ningún triángulo' }];
  }

  const sinA2c = Math.min(1, sinA2);
  const a2_1   = r(Math.asin(sinA2c) / DEG);      // first possibility
  const a2_2   = r(180 - a2_1);                    // supplementary angle

  const solutions = [];

  // Solution 1
  const a3_1 = r(180 - ang1 - a2_1);
  if (a3_1 > 1e-6 && a2_1 > 1e-6) {
    const s3 = r(s1 * Math.sin(a3_1 * DEG) / Math.sin(ang1 * DEG));
    solutions.push({ [ns1]:s1, [ns2]:s2, [ns3]:s3, [nA1]:ang1, [nA2]:a2_1, [nA3]:a3_1, caseType:'SSA' });
  }

  // Solution 2 (only when sinA2 < 1 and the second angle is geometrically valid)
  if (sinA2 < 1 - 1e-9) {
    const a3_2 = r(180 - ang1 - a2_2);
    if (a3_2 > 1e-6 && a2_2 > 1e-6) {
      const s3 = r(s1 * Math.sin(a3_2 * DEG) / Math.sin(ang1 * DEG));
      solutions.push({ [ns1]:s1, [ns2]:s2, [ns3]:s3, [nA1]:ang1, [nA2]:a2_2, [nA3]:a3_2, caseType:'SSA' });
    }
  }

  if (solutions.length === 0) {
    return [{ error: 'Sin solución: los valores dados no forman ningún triángulo' }];
  }
  return solutions;
}

// ── Main entry ───────────────────────────────────────────────────────────────
function solveTriangle(inputs) {
  const caseType = detectCase(inputs);
  if (caseType === 'UNKNOWN') return [{ error: 'Combinación de datos no reconocida' }];
  if (caseType === 'SSS') return [solveSSS(inputs)];
  if (caseType === 'SAS') return [solveSAS(inputs)];
  if (caseType === 'ASA') return [solveASA(inputs)];
  if (caseType === 'AAS') return [solveAAS(inputs)];
  if (caseType === 'SSA') return solveSSA(inputs);
  return [{ error: 'Error desconocido' }];
}
