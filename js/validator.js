// Checks that a value is a positive integer
function isValidInteger(value) {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}

// Blocks non-digit keys in real time
function restrictInput(e) {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
  if (allowedKeys.includes(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
}

// Full validation; returns { valid, error, inputs }
function validateInputs(raw) {
  const fields = [
    { name: 'a', type: 'side',  val: raw.a },
    { name: 'b', type: 'side',  val: raw.b },
    { name: 'c', type: 'side',  val: raw.c },
    { name: 'A', type: 'angle', val: raw.A },
    { name: 'B', type: 'angle', val: raw.B },
    { name: 'C', type: 'angle', val: raw.C },
  ];

  const provided = fields.filter(f => f.val !== '');

  if (provided.length !== 3) {
    return {
      valid: false,
      error: `Debes ingresar exactamente 3 datos (ingresaste ${provided.length})`
    };
  }

  for (const f of provided) {
    if (!isValidInteger(f.val)) {
      return {
        valid: false,
        error: 'Solo se permiten números enteros positivos (sin letras ni decimales)'
      };
    }
  }

  const sides  = provided.filter(f => f.type === 'side');
  const angles = provided.filter(f => f.type === 'angle');

  if (sides.length === 0) {
    return { valid: false, error: 'Debes ingresar al menos un lado' };
  }

  const nums = {};
  for (const f of provided) nums[f.name] = Number(f.val);

  for (const f of angles) {
    if (nums[f.name] >= 180) {
      return { valid: false, error: `El ángulo ${f.name} debe ser menor a 180°` };
    }
  }

  if (angles.length === 2) {
    const sum = angles.reduce((s, f) => s + nums[f.name], 0);
    if (sum >= 180) {
      return {
        valid: false,
        error: `La suma de los ángulos ingresados (${sum}°) debe ser menor a 180°`
      };
    }
  }

  if (angles.length === 3) {
    const sum = angles.reduce((s, f) => s + nums[f.name], 0);
    if (Math.abs(sum - 180) > 0.001) {
      return {
        valid: false,
        error: `La suma de los tres ángulos debe ser exactamente 180° (suma actual: ${sum}°)`
      };
    }
  }

  if (sides.length === 3) {
    const sa = nums['a'], sb = nums['b'], sc = nums['c'];
    if (sa + sb <= sc || sa + sc <= sb || sb + sc <= sa) {
      return {
        valid: false,
        error: 'Los lados no forman un triángulo válido (desigualdad triangular)'
      };
    }
  }

  const inputs = {
    a: raw.a !== '' ? Number(raw.a) : null,
    b: raw.b !== '' ? Number(raw.b) : null,
    c: raw.c !== '' ? Number(raw.c) : null,
    A: raw.A !== '' ? Number(raw.A) : null,
    B: raw.B !== '' ? Number(raw.B) : null,
    C: raw.C !== '' ? Number(raw.C) : null,
  };

  return { valid: true, error: null, inputs };
}
