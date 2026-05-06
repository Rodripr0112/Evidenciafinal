# Calculadora de Triángulos

Aplicación web interactiva para la resolución completa de triángulos usando la **Ley de Senos** y la **Ley de Cosenos**.

**Evidencia Final — Tecnología de la Información II**  
Rodrigo Zapata Nivon · Grupo 404 · Profesor: Alejandro León Govea · 7 de Mayo del 2026

---

## Demo

> Abre `index.html` directamente en el navegador o despliega en GitHub Pages.

---

## Páginas

| Página | Archivo | Descripción |
|--------|---------|-------------|
| 1 — Portada | `index.html` | Datos del alumno y acceso a la app |
| 2 — Calculadora | `calculator.html` | Ingreso de datos, resultados y visualización |
| 3 — Teoría | `leyes.html` | Explicación de Ley de Senos y Ley de Cosenos |

---

## Funcionalidades

- Ingresa exactamente **3 datos** (lados y/o ángulos) y calcula los valores faltantes
- Detecta automáticamente el caso geométrico: **SSS, SAS, ASA, AAS, SSA**
- Maneja el **caso ambiguo SSA** mostrando 0, 1 ó 2 soluciones
- Muestra ángulos, lados, suma de ángulos, perímetro y área
- Dibuja el triángulo a escala en un **canvas**
- Validación estricta: solo acepta **enteros positivos**
- Bloqueo de teclado en tiempo real (sin decimales, sin letras)
- Suite de **12 pruebas automáticas** visibles en la consola del navegador

---

## Casos soportados

| Caso | Datos conocidos | Método |
|------|----------------|--------|
| SSS | 3 lados | Ley de Cosenos |
| SAS | 2 lados + ángulo incluido | Ley de Cosenos |
| ASA | 2 ángulos + lado incluido | Ley de Senos |
| AAS | 2 ángulos + lado no incluido | Ley de Senos |
| SSA | 2 lados + ángulo no incluido | Ley de Senos (caso ambiguo) |

---

## Estructura del proyecto

```
triangle-app/
├── index.html          # Página 1: portada del alumno
├── calculator.html     # Página 2: calculadora
├── leyes.html          # Página 3: teoría
├── css/
│   └── styles.css      # Estilos de las 3 páginas
├── js/
│   ├── app.js          # Flujo principal y eventos
│   ├── solver.js       # Lógica matemática (detección y resolución)
│   ├── validator.js    # Validación de inputs y bloqueo de teclado
│   └── renderer.js     # Renderizado de resultados y canvas
└── tests/
    └── testCases.js    # Suite de 12 casos de prueba
```

---

## Cómo ejecutar

### Opción A — Abrir directo en el navegador
Haz doble clic en `index.html`. No requiere servidor.

### Opción B — XAMPP
Copia la carpeta `triangle-app/` dentro de `htdocs/` y accede en:
```
http://localhost/triangle-app/
```

### Opción C — GitHub Pages
1. Sube el repositorio a GitHub
2. Ve a **Settings → Pages**
3. Selecciona la rama y la carpeta raíz (`/`)
4. Accede a la URL generada por GitHub Pages

---

## Tecnologías

- HTML5
- CSS3
- JavaScript vanilla (sin dependencias externas)

---

## Autor

**Rodrigo Zapata Nivon**  
Tecnología de la Información II — Grupo 404
