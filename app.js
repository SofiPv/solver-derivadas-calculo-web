const expressionInput = document.getElementById("expressionInput");
const solveInputBtn = document.getElementById("solveInputBtn");
const exerciseSelect = document.getElementById("exerciseSelect");
const solveBtn = document.getElementById("solveBtn");
const copyStepsBtn = document.getElementById("copyStepsBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const exerciseTitle = document.getElementById("exerciseTitle");
const ruleBadge = document.getElementById("ruleBadge");
const originalFormula = document.getElementById("originalFormula");
const derivativeFormula = document.getElementById("derivativeFormula");

const stepIndex = document.getElementById("stepIndex");
const stepDetail = document.getElementById("stepDetail");
const prevStepBtn = document.getElementById("prevStepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");

const explicitInputs = document.getElementById("explicitInputs");
const implicitInputs = document.getElementById("implicitInputs");
const xValue = document.getElementById("xValue");
const implicitXValue = document.getElementById("implicitXValue");
const implicitYValue = document.getElementById("implicitYValue");
const evaluateBtn = document.getElementById("evaluateBtn");
const evaluationResult = document.getElementById("evaluationResult");

const graphCanvas = document.getElementById("graphCanvas");
const ctx = graphCanvas.getContext("2d");

const historyList = document.getElementById("historyList");
const quizArea = document.getElementById("quizArea");
const gradeQuizBtn = document.getElementById("gradeQuizBtn");
const quizFeedback = document.getElementById("quizFeedback");

const storageKey = "solverDerivadasCalculoHistoryV1";
const margin = 58;

let activeExercise = null;
let activeStep = 0;
let evaluatedPoint = null;
let history = loadHistory();
let copiedText = "";

const exercises = [
  {
    id: "sqrt-chain",
    title: "Regla de la cadena con raíz",
    badge: "Cadena",
    aliases: ["sqrt(3-x^2)", "raiz(3-x^2)", "√(3-x^2)", "sqrt(3 - x^2)"],
    inputText: "sqrt(3-x^2)",
    original: "\\[f(x)=\\sqrt{3-x^2}\\]",
    derivative: "\\[f'(x)=\\frac{-x}{\\sqrt{3-x^2}}\\]",
    description: "Derivada de una función compuesta con radical.",
    mode: "explicit",
    bounds: { xMin: -2.1, xMax: 2.1, yMin: -6, yMax: 3 },
    domain: x => 3 - x * x >= 0,
    derivativeDomain: x => 3 - x * x > 0,
    f: x => Math.sqrt(3 - x * x),
    fp: x => -x / Math.sqrt(3 - x * x),
    steps: [
      {
        short: "Identificar composición",
        tag: "u interno",
        title: "Identificar la función interna",
        text: "La raíz contiene una expresión interna, por eso se aplica regla de la cadena.",
        formula: "\\[u=3-x^2,\\qquad f(x)=\\sqrt{u}=u^{1/2}\\]",
        values: [["u", "3-x²"], ["Regla", "cadena"]]
      },
      {
        short: "Derivar potencia",
        tag: "u^(1/2)",
        title: "Derivar la potencia externa",
        text: "La derivada de u elevado a un medio conserva la derivada interna multiplicando.",
        formula: "\\[\\frac{d}{dx}u^{1/2}=\\frac{1}{2}u^{-1/2}\\cdot u'\\]",
        values: [["Exponente", "1/2"], ["u'", "-2x"]]
      },
      {
        short: "Sustituir",
        tag: "simplificar",
        title: "Sustituir y simplificar",
        text: "Se sustituye u y se cancela el factor 2.",
        formula: "\\[f'(x)=\\frac{1}{2\\sqrt{3-x^2}}(-2x)=\\frac{-x}{\\sqrt{3-x^2}}\\]",
        values: [["Resultado", "-x/√(3-x²)"]]
      }
    ]
  },
  {
    id: "log-sqrt",
    title: "Logaritmo natural con raíz",
    badge: "ln(u)",
    aliases: ["ln(sqrt(3-x^2))", "log(sqrt(3-x^2))", "ln(√(3-x^2))"],
    inputText: "ln(sqrt(3-x^2))",
    original: "\\[f(x)=\\ln\\left(\\sqrt{3-x^2}\\right)\\]",
    derivative: "\\[f'(x)=\\frac{-x}{3-x^2}\\]",
    description: "Derivada de logaritmo natural con función compuesta.",
    mode: "explicit",
    bounds: { xMin: -2.1, xMax: 2.1, yMin: -8, yMax: 4 },
    domain: x => 3 - x * x > 0,
    derivativeDomain: x => 3 - x * x > 0,
    f: x => Math.log(Math.sqrt(3 - x * x)),
    fp: x => -x / (3 - x * x),
    steps: [
      {
        short: "Identificar ln(u)",
        tag: "logaritmo",
        title: "Aplicar la forma de la derivada logarítmica",
        text: "Cuando la función es ln(u), la derivada es u'/u.",
        formula: "\\[\\frac{d}{dx}\\ln(u)=\\frac{u'}{u}\\]",
        values: [["u", "√(3-x²)"]]
      },
      {
        short: "Derivar u",
        tag: "cadena",
        title: "Derivar la raíz interna",
        text: "La expresión interna vuelve a usar regla de la cadena.",
        formula: "\\[u'=\\frac{-x}{\\sqrt{3-x^2}}\\]",
        values: [["u'", "-x/√(3-x²)"]]
      },
      {
        short: "Dividir",
        tag: "u'/u",
        title: "Sustituir en u'/u",
        text: "Se divide la derivada de la raíz entre la raíz original.",
        formula: "\\[f'(x)=\\frac{\\frac{-x}{\\sqrt{3-x^2}}}{\\sqrt{3-x^2}}=\\frac{-x}{3-x^2}\\]",
        values: [["Resultado", "-x/(3-x²)"]]
      }
    ]
  },
  {
    id: "implicit",
    title: "Derivación implícita y pendiente",
    badge: "Implícita",
    aliases: ["y^3+y^2-5y-x^2=-4", "y3+y2-5y-x2=-4", "implicit"],
    inputText: "y^3+y^2-5y-x^2=-4",
    original: "\\[y^3+y^2-5y-x^2=-4\\]",
    derivative: "\\[\\frac{dy}{dx}=\\frac{2x}{3y^2+2y-5}\\]",
    description: "Pendiente de una curva mediante derivación implícita.",
    mode: "implicit",
    bounds: { xMin: -5, xMax: 5, yMin: -4, yMax: 4 },
    implicitF: (x, y) => y ** 3 + y ** 2 - 5 * y - x ** 2 + 4,
    slope: (x, y) => (2 * x) / (3 * y ** 2 + 2 * y - 5),
    steps: [
      {
        short: "Derivar ambos lados",
        tag: "respecto a x",
        title: "Derivar cada término respecto a x",
        text: "Como y depende de x, cada derivada de y debe multiplicarse por dy/dx.",
        formula: "\\[\\frac{d}{dx}(y^3+y^2-5y-x^2)=\\frac{d}{dx}(-4)\\]",
        values: [["Variable", "y=y(x)"]]
      },
      {
        short: "Aplicar implícita",
        tag: "dy/dx",
        title: "Aplicar derivación implícita",
        text: "Se derivan las potencias de y y el término de x.",
        formula: "\\[3y^2\\frac{dy}{dx}+2y\\frac{dy}{dx}-5\\frac{dy}{dx}-2x=0\\]",
        values: [["d(y³)/dx", "3y² dy/dx"], ["d(x²)/dx", "2x"]]
      },
      {
        short: "Agrupar",
        tag: "factor común",
        title: "Agrupar los términos con dy/dx",
        text: "Se factoriza dy/dx para poder despejarlo.",
        formula: "\\[(3y^2+2y-5)\\frac{dy}{dx}=2x\\]",
        values: [["Factor", "3y²+2y-5"]]
      },
      {
        short: "Despejar",
        tag: "pendiente",
        title: "Despejar la pendiente",
        text: "La pendiente de la curva se obtiene dividiendo entre el factor de dy/dx.",
        formula: "\\[\\frac{dy}{dx}=\\frac{2x}{3y^2+2y-5}\\]",
        values: [["Resultado", "2x/(3y²+2y-5)"]]
      }
    ]
  },
  {
    id: "arccot",
    title: "Derivada de arc cot",
    badge: "arc cot(u)",
    aliases: ["arccot((1+x)/(1-x))", "arc cot((1+x)/(1-x))", "cot^-1((1+x)/(1-x))"],
    inputText: "arccot((1+x)/(1-x))",
    original: "\\[f(x)=\\operatorname{arccot}\\left(\\frac{1+x}{1-x}\\right)\\]",
    derivative: "\\[f'(x)=\\frac{-1}{1+x^2}\\]",
    description: "Derivada de arccot con regla del cociente y simplificación.",
    mode: "explicit",
    bounds: { xMin: -5, xMax: 5, yMin: -4, yMax: 4 },
    domain: x => Math.abs(1 - x) > 0.05,
    derivativeDomain: () => true,
    f: x => Math.PI / 2 - Math.atan((1 + x) / (1 - x)),
    fp: x => -1 / (1 + x * x),
    steps: [
      {
        short: "Variable interna",
        tag: "u",
        title: "Identificar la variable interna",
        text: "La función arc cot recibe una fracción como argumento.",
        formula: "\\[u=\\frac{1+x}{1-x}\\]",
        values: [["u", "(1+x)/(1-x)"]]
      },
      {
        short: "Derivar u",
        tag: "cociente",
        title: "Derivar la fracción interna",
        text: "Se aplica regla del cociente.",
        formula: "\\[u'=\\frac{(1-x)(1)-(1+x)(-1)}{(1-x)^2}=\\frac{2}{(1-x)^2}\\]",
        values: [["u'", "2/(1-x)²"]]
      },
      {
        short: "Aplicar arccot",
        tag: "-u'/(1+u²)",
        title: "Aplicar la derivada de arc cot",
        text: "La derivada de arccot(u) cambia de signo.",
        formula: "\\[\\frac{d}{dx}\\operatorname{arccot}(u)=\\frac{-u'}{1+u^2}\\]",
        values: [["Regla", "-u'/(1+u²)"]]
      },
      {
        short: "Simplificar",
        tag: "resultado",
        title: "Simplificar la expresión",
        text: "Al sustituir y simplificar se cancela el factor común.",
        formula: "\\[f'(x)=\\frac{-\\frac{2}{(1-x)^2}}{1+\\left(\\frac{1+x}{1-x}\\right)^2}=\\frac{-1}{1+x^2}\\]",
        values: [["Resultado", "-1/(1+x²)"]]
      }
    ]
  },
  {
    id: "arctan",
    title: "Derivada de arc tan",
    badge: "arc tan(u)",
    aliases: ["arctan(3x^2)", "arc tan(3x^2)", "atan(3x^2)"],
    inputText: "arctan(3x^2)",
    original: "\\[f(x)=\\arctan(3x^2)\\]",
    derivative: "\\[f'(x)=\\frac{6x}{1+9x^4}\\]",
    description: "Derivada de arctan usando regla de la cadena.",
    mode: "explicit",
    bounds: { xMin: -4, xMax: 4, yMin: -3, yMax: 3 },
    domain: () => true,
    derivativeDomain: () => true,
    f: x => Math.atan(3 * x * x),
    fp: x => (6 * x) / (1 + 9 * x ** 4),
    steps: [
      {
        short: "Variable interna",
        tag: "u",
        title: "Identificar u",
        text: "La función arc tan tiene una expresión interna.",
        formula: "\\[u=3x^2\\]",
        values: [["u", "3x²"]]
      },
      {
        short: "Derivar u",
        tag: "potencia",
        title: "Derivar la variable interna",
        text: "Se aplica regla de la potencia.",
        formula: "\\[u'=6x\\]",
        values: [["u'", "6x"]]
      },
      {
        short: "Aplicar arctan",
        tag: "u'/(1+u²)",
        title: "Aplicar la derivada de arc tan",
        text: "La derivada de arctan(u) es u' dividido entre 1+u².",
        formula: "\\[\\frac{d}{dx}\\arctan(u)=\\frac{u'}{1+u^2}\\]",
        values: [["Regla", "u'/(1+u²)"]]
      },
      {
        short: "Sustituir",
        tag: "resultado",
        title: "Sustituir y simplificar",
        text: "Se sustituye u=3x² y u'=6x.",
        formula: "\\[f'(x)=\\frac{6x}{1+(3x^2)^2}=\\frac{6x}{1+9x^4}\\]",
        values: [["Resultado", "6x/(1+9x⁴)"]]
      }
    ]
  },
  {
    id: "polynomial",
    title: "Reglas básicas de derivación",
    badge: "Potencia",
    aliases: ["x^3-4x", "x3-4x", "polynomial"],
    inputText: "x^3-4x",
    original: "\\[f(x)=x^3-4x\\]",
    derivative: "\\[f'(x)=3x^2-4\\]",
    description: "Derivada por regla de la potencia y linealidad.",
    mode: "explicit",
    bounds: { xMin: -4, xMax: 4, yMin: -10, yMax: 10 },
    domain: () => true,
    derivativeDomain: () => true,
    f: x => x ** 3 - 4 * x,
    fp: x => 3 * x ** 2 - 4,
    steps: [
      {
        short: "Separar términos",
        tag: "linealidad",
        title: "Usar linealidad de la derivada",
        text: "La derivada de una resta se calcula derivando cada término.",
        formula: "\\[\\frac{d}{dx}(x^3-4x)=\\frac{d}{dx}(x^3)-\\frac{d}{dx}(4x)\\]",
        values: [["Términos", "x³ y -4x"]]
      },
      {
        short: "Potencia",
        tag: "x³",
        title: "Derivar la potencia",
        text: "La regla de la potencia baja el exponente y lo reduce en uno.",
        formula: "\\[\\frac{d}{dx}(x^3)=3x^2\\]",
        values: [["d(x³)/dx", "3x²"]]
      },
      {
        short: "Lineal",
        tag: "-4x",
        title: "Derivar el término lineal",
        text: "La derivada de -4x es -4.",
        formula: "\\[\\frac{d}{dx}(-4x)=-4\\]",
        values: [["d(-4x)/dx", "-4"]]
      },
      {
        short: "Resultado",
        tag: "f'(x)",
        title: "Unir resultados",
        text: "Se juntan las derivadas parciales.",
        formula: "\\[f'(x)=3x^2-4\\]",
        values: [["Resultado", "3x²-4"]]
      }
    ]
  }
];

const quizQuestions = [
  {
    prompt: "¿Qué regla se usa principalmente en f(x)=√(3-x²)?",
    options: ["Regla de la cadena", "Producto", "Derivada implícita"],
    correct: "Regla de la cadena",
    explanation: "La raíz contiene una función interna."
  },
  {
    prompt: "¿Cuál es la derivada de arctan(u)?",
    options: ["-u'/(1+u²)", "u'/(1+u²)", "u'/u"],
    correct: "u'/(1+u²)",
    explanation: "arctan(u) deriva como u'/(1+u²)."
  },
  {
    prompt: "En derivación implícita, d(y³)/dx es:",
    options: ["3y²", "3y² dy/dx", "y² dx/dy"],
    correct: "3y² dy/dx",
    explanation: "Porque y depende de x."
  },
  {
    prompt: "Si f(x)=ln(u), entonces f'(x) es:",
    options: ["u'/u", "u/u'", "ln(u')"],
    correct: "u'/u",
    explanation: "La derivada de ln(u) es u'/u."
  }
];

function init() {
  exercises.forEach(exercise => {
    const option = document.createElement("option");
    option.value = exercise.id;
    option.textContent = exercise.title;
    exerciseSelect.appendChild(option);
  });

  activeExercise = exercises[0];

  solveInputBtn.addEventListener("click", solveFromInput);
  solveBtn.addEventListener("click", () => setExerciseById(exerciseSelect.value));
  prevStepBtn.addEventListener("click", () => setStep(activeStep - 1));
  nextStepBtn.addEventListener("click", () => setStep(activeStep + 1));
  evaluateBtn.addEventListener("click", evaluateSlope);
  downloadBtn.addEventListener("click", downloadGraph);
  copyStepsBtn.addEventListener("click", copySteps);
  clearHistoryBtn.addEventListener("click", clearHistory);
  gradeQuizBtn.addEventListener("click", gradeQuiz);

  renderQuiz();
  renderHistory();
  updateView();
}

function solveFromInput() {
  const match = findExerciseByInput(expressionInput.value);

  if (!match) {
    evaluationResult.className = "feedback warning";
    evaluationResult.textContent = "Entrada no reconocida. Usa uno de los ejemplos admitidos o selecciona un ejercicio guiado.";
    return;
  }

  setExerciseById(match.id);
}

function findExerciseByInput(text) {
  const normalized = normalizeExpression(text);

  return exercises.find(exercise =>
    exercise.aliases.some(alias => normalizeExpression(alias) === normalized)
  );
}

function normalizeExpression(text) {
  return text
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("\\", "")
    .replaceAll("√", "sqrt")
    .replaceAll("raiz", "sqrt")
    .replaceAll("sen", "sin")
    .replaceAll("arcot", "arccot")
    .replaceAll("arccotg", "arccot");
}

function setExerciseById(id) {
  const next = exercises.find(exercise => exercise.id === id);

  if (!next) return;

  activeExercise = next;
  exerciseSelect.value = next.id;
  expressionInput.value = next.inputText;
  activeStep = 0;
  evaluatedPoint = null;
  addHistory(next);
  updateView();
}

function updateView() {
  exerciseTitle.textContent = activeExercise.title;
  ruleBadge.textContent = activeExercise.badge;
  originalFormula.innerHTML = activeExercise.original;
  derivativeFormula.innerHTML = activeExercise.derivative;

  if (activeExercise.mode === "implicit") {
    explicitInputs.classList.add("hidden");
    implicitInputs.classList.remove("hidden");
  } else {
    explicitInputs.classList.remove("hidden");
    implicitInputs.classList.add("hidden");
  }

  evaluationResult.className = "feedback";
  evaluationResult.textContent = "Evalúa un punto para visualizar la pendiente y la tangente.";

  renderSteps();
  drawGraph();

  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function renderSteps() {
  stepIndex.innerHTML = "";
  activeExercise.steps.forEach((step, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "step-tab";
    button.innerHTML = `${index + 1}. ${step.short}<small>${step.tag}</small>`;
    button.addEventListener("click", () => setStep(index));

    if (index === activeStep) button.classList.add("active");

    stepIndex.appendChild(button);
  });

  renderStepDetail();
}

function setStep(index) {
  activeStep = Math.max(0, Math.min(activeExercise.steps.length - 1, index));
  renderSteps();
}

function renderStepDetail() {
  const step = activeExercise.steps[activeStep];

  const values = step.values.map(([label, value]) => `
    <div class="value-pill">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");

  stepDetail.innerHTML = `
    <h3>${activeStep + 1}. ${step.title}</h3>
    <p>${step.text}</p>
    <div class="formula-line">${step.formula}</div>
    <div class="value-grid">${values}</div>
  `;

  if (window.MathJax) {
    MathJax.typesetPromise([stepDetail]);
  }
}

function evaluateSlope() {
  if (activeExercise.mode === "implicit") {
    const x = Number(implicitXValue.value);
    const y = Number(implicitYValue.value);
    const denom = 3 * y ** 2 + 2 * y - 5;

    if (Math.abs(denom) < 0.000001) {
      evaluationResult.className = "feedback error";
      evaluationResult.textContent = "La pendiente no se puede evaluar porque el denominador es 0.";
      evaluatedPoint = null;
      drawGraph();
      return;
    }

    const slope = activeExercise.slope(x, y);
    const curveCheck = activeExercise.implicitF(x, y);

    evaluatedPoint = { x, y, slope };
    evaluationResult.className = Math.abs(curveCheck) < 0.1 ? "feedback success" : "feedback warning";
    evaluationResult.innerHTML = `
      Pendiente en (${format(x)}, ${format(y)}): <strong>${format(slope)}</strong><br>
      Comprobación de la curva: F(x,y) = ${format(curveCheck)}.
    `;
    drawGraph();
    return;
  }

  const x = Number(xValue.value);

  if (!activeExercise.domain(x) || !activeExercise.derivativeDomain(x)) {
    evaluationResult.className = "feedback error";
    evaluationResult.textContent = "La función o la derivada no está definida en ese valor.";
    evaluatedPoint = null;
    drawGraph();
    return;
  }

  const y = activeExercise.f(x);
  const slope = activeExercise.fp(x);

  if (!Number.isFinite(y) || !Number.isFinite(slope)) {
    evaluationResult.className = "feedback error";
    evaluationResult.textContent = "No se puede evaluar ese punto.";
    evaluatedPoint = null;
    drawGraph();
    return;
  }

  evaluatedPoint = { x, y, slope };
  evaluationResult.className = "feedback success";
  evaluationResult.innerHTML = `
    f(${format(x)}) = <strong>${format(y)}</strong><br>
    f'(${format(x)}) = <strong>${format(slope)}</strong><br>
    La pendiente de la recta tangente en x=${format(x)} es ${format(slope)}.
  `;
  drawGraph();
}

function drawGraph() {
  const width = graphCanvas.width;
  const height = graphCanvas.height;
  const bounds = activeExercise.bounds;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  drawGrid(bounds, width, height);
  drawAxes(bounds, width, height);

  if (activeExercise.mode === "implicit") {
    drawImplicitCurve(bounds, width, height);
  } else {
    drawExplicitFunction(activeExercise.f, activeExercise.domain, bounds, width, height, "#2563eb", 3);
    drawExplicitFunction(activeExercise.fp, x => activeExercise.derivativeDomain(x), bounds, width, height, "#dc2626", 2);
  }

  drawEvaluatedPoint(bounds, width, height);
  drawGraphLegend();
}

function drawGrid(bounds, width, height) {
  ctx.save();
  ctx.strokeStyle = "#ece7f7";
  ctx.lineWidth = 1;

  const xStep = chooseStep(bounds.xMin, bounds.xMax);
  const yStep = chooseStep(bounds.yMin, bounds.yMax);

  for (let x = Math.ceil(bounds.xMin / xStep) * xStep; x <= bounds.xMax; x += xStep) {
    const sx = toScreenX(x, bounds, width);
    ctx.beginPath();
    ctx.moveTo(sx, margin);
    ctx.lineTo(sx, height - margin);
    ctx.stroke();
  }

  for (let y = Math.ceil(bounds.yMin / yStep) * yStep; y <= bounds.yMax; y += yStep) {
    const sy = toScreenY(y, bounds, height);
    ctx.beginPath();
    ctx.moveTo(margin, sy);
    ctx.lineTo(width - margin, sy);
    ctx.stroke();
  }

  ctx.restore();
}

function drawAxes(bounds, width, height) {
  ctx.save();
  ctx.strokeStyle = "#241a38";
  ctx.fillStyle = "#241a38";
  ctx.lineWidth = 2;
  ctx.font = "13px Segoe UI";

  const xAxis = toScreenY(0, bounds, height);
  const yAxis = toScreenX(0, bounds, width);

  ctx.beginPath();
  ctx.moveTo(margin, xAxis);
  ctx.lineTo(width - margin, xAxis);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(yAxis, margin);
  ctx.lineTo(yAxis, height - margin);
  ctx.stroke();

  const xStep = chooseStep(bounds.xMin, bounds.xMax);
  const yStep = chooseStep(bounds.yMin, bounds.yMax);

  for (let x = Math.ceil(bounds.xMin / xStep) * xStep; x <= bounds.xMax; x += xStep) {
    const sx = toScreenX(x, bounds, width);
    ctx.beginPath();
    ctx.moveTo(sx, xAxis - 4);
    ctx.lineTo(sx, xAxis + 4);
    ctx.stroke();

    if (Math.abs(x) > 0.001) ctx.fillText(format(x), sx - 10, xAxis + 20);
  }

  for (let y = Math.ceil(bounds.yMin / yStep) * yStep; y <= bounds.yMax; y += yStep) {
    const sy = toScreenY(y, bounds, height);
    ctx.beginPath();
    ctx.moveTo(yAxis - 4, sy);
    ctx.lineTo(yAxis + 4, sy);
    ctx.stroke();

    if (Math.abs(y) > 0.001) ctx.fillText(format(y), yAxis + 8, sy + 4);
  }

  ctx.fillText("x", width - margin + 12, xAxis + 5);
  ctx.fillText("y", yAxis + 8, margin - 12);

  ctx.restore();
}

function drawExplicitFunction(fn, domain, bounds, width, height, color, lineWidth) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  const samples = 1800;
  let started = false;
  let previousY = null;

  for (let i = 0; i <= samples; i++) {
    const x = bounds.xMin + ((bounds.xMax - bounds.xMin) * i) / samples;

    if (!domain(x)) {
      started = false;
      previousY = null;
      continue;
    }

    const y = fn(x);

    if (!Number.isFinite(y) || y < bounds.yMin - 20 || y > bounds.yMax + 20) {
      started = false;
      previousY = null;
      continue;
    }

    if (previousY !== null && Math.abs(y - previousY) > (bounds.yMax - bounds.yMin) * 0.45) {
      started = false;
    }

    const sx = toScreenX(x, bounds, width);
    const sy = toScreenY(y, bounds, height);

    if (!started) {
      ctx.moveTo(sx, sy);
      started = true;
    } else {
      ctx.lineTo(sx, sy);
    }

    previousY = y;
  }

  ctx.stroke();
  ctx.restore();
}

function drawImplicitCurve(bounds, width, height) {
  ctx.save();
  ctx.fillStyle = "#2563eb";

  const xSamples = 560;
  const ySamples = 420;
  const dx = (bounds.xMax - bounds.xMin) / xSamples;
  const dy = (bounds.yMax - bounds.yMin) / ySamples;
  const tolerance = 0.055;

  for (let i = 0; i <= xSamples; i++) {
    const x = bounds.xMin + i * dx;

    for (let j = 0; j <= ySamples; j++) {
      const y = bounds.yMin + j * dy;
      const value = activeExercise.implicitF(x, y);

      if (Math.abs(value) < tolerance) {
        ctx.fillRect(toScreenX(x, bounds, width), toScreenY(y, bounds, height), 2, 2);
      }
    }
  }

  ctx.restore();
}

function drawEvaluatedPoint(bounds, width, height) {
  if (!evaluatedPoint) return;

  const { x, y, slope } = evaluatedPoint;

  if (x < bounds.xMin || x > bounds.xMax || y < bounds.yMin || y > bounds.yMax) return;

  const sx = toScreenX(x, bounds, width);
  const sy = toScreenY(y, bounds, height);

  ctx.save();
  ctx.fillStyle = "#f97316";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(sx, sy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawTangent(x, y, slope, bounds, width, height);

  ctx.fillStyle = "#241a38";
  ctx.font = "13px Segoe UI";
  ctx.fillText(`(${format(x)}, ${format(y)})`, sx + 10, sy - 10);
  ctx.restore();
}

function drawTangent(x, y, slope, bounds, width, height) {
  if (!Number.isFinite(slope)) return;

  const delta = (bounds.xMax - bounds.xMin) * 0.15;
  const x1 = x - delta;
  const y1 = y - slope * delta;
  const x2 = x + delta;
  const y2 = y + slope * delta;

  ctx.save();
  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(toScreenX(x1, bounds, width), toScreenY(y1, bounds, height));
  ctx.lineTo(toScreenX(x2, bounds, width), toScreenY(y2, bounds, height));
  ctx.stroke();
  ctx.restore();
}

function drawGraphLegend() {
  ctx.save();
  ctx.fillStyle = "#241a38";
  ctx.font = "bold 18px Segoe UI";
  ctx.fillText(activeExercise.title, 22, 34);

  ctx.font = "13px Segoe UI";
  ctx.fillStyle = "#2563eb";
  ctx.fillText(activeExercise.mode === "implicit" ? "Curva implícita" : "Función original", 22, 58);
  ctx.fillStyle = "#dc2626";
  ctx.fillText(activeExercise.mode === "implicit" ? "Pendiente dy/dx" : "Derivada", 22, 78);
  ctx.fillStyle = "#f97316";
  ctx.fillText("Punto evaluado / tangente", 22, 98);
  ctx.restore();
}

function renderQuiz() {
  quizArea.innerHTML = "";

  quizQuestions.forEach((question, index) => {
    const article = document.createElement("article");
    article.className = "quiz-question";

    const options = question.options.map(option => `
      <label>
        <input type="radio" name="quiz-${index}" value="${escapeHtml(option)}">
        <span>${option}</span>
      </label>
    `).join("");

    article.innerHTML = `
      <h3>Pregunta ${index + 1}</h3>
      <p>${question.prompt}</p>
      <div class="quiz-options">${options}</div>
    `;

    quizArea.appendChild(article);
  });

  quizFeedback.className = "feedback";
  quizFeedback.textContent = "Resuelve el modo examen y califica tus respuestas.";
}

function gradeQuiz() {
  let score = 0;
  const details = [];

  quizQuestions.forEach((question, index) => {
    const selected = document.querySelector(`input[name="quiz-${index}"]:checked`);
    const answer = selected ? selected.value : "";
    const correct = answer === question.correct;

    if (correct) score++;

    details.push(`${correct ? "✅" : "❌"} Pregunta ${index + 1}: ${correct ? "correcta" : `respuesta correcta: ${question.correct}`}. ${question.explanation}`);
  });

  const percentage = Math.round((score / quizQuestions.length) * 100);
  quizFeedback.className = percentage >= 70 ? "feedback success" : "feedback warning";
  quizFeedback.innerHTML = `Puntaje: <strong>${score}/${quizQuestions.length}</strong> (${percentage}%).<br><br>${details.join("<br>")}`;
}

function addHistory(exercise) {
  history = history.filter(item => item.id !== exercise.id);
  history.unshift({
    id: exercise.id,
    title: exercise.title,
    inputText: exercise.inputText,
    date: new Date().toLocaleString("es-MX")
  });

  history = history.slice(0, 8);
  saveHistory();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<p>No hay ejercicios recientes.</p>";
    return;
  }

  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `<strong>${item.title}</strong><span>${item.inputText}</span><span>${item.date}</span>`;
    div.addEventListener("click", () => setExerciseById(item.id));
    historyList.appendChild(div);
  });
}

function clearHistory() {
  history = [];
  saveHistory();
  renderHistory();
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (error) {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem(storageKey, JSON.stringify(history));
}

async function copySteps() {
  const lines = [];
  lines.push(activeExercise.title);
  lines.push("");
  lines.push("Función original:");
  lines.push(stripLatex(activeExercise.original));
  lines.push("");
  lines.push("Derivada final:");
  lines.push(stripLatex(activeExercise.derivative));
  lines.push("");
  lines.push("Procedimiento:");

  activeExercise.steps.forEach((step, index) => {
    lines.push(`${index + 1}. ${step.title}`);
    lines.push(step.text);
    lines.push(stripLatex(step.formula));
    lines.push("");
  });

  copiedText = lines.join("\n");
  await navigator.clipboard.writeText(copiedText);
  copyStepsBtn.textContent = "Copiado";
  setTimeout(() => copyStepsBtn.textContent = "Copiar pasos", 1200);
}

function stripLatex(text) {
  return text
    .replaceAll("\\[", "")
    .replaceAll("\\]", "")
    .replaceAll("\\(", "")
    .replaceAll("\\)", "")
    .replaceAll("\\frac", "frac")
    .replaceAll("\\sqrt", "sqrt")
    .replaceAll("\\operatorname", "")
    .replaceAll("{", "")
    .replaceAll("}", "");
}

function downloadGraph() {
  const link = document.createElement("a");
  link.download = "grafica_derivada.png";
  link.href = graphCanvas.toDataURL("image/png");
  link.click();
}

function toScreenX(x, bounds, width) {
  const ratio = (x - bounds.xMin) / (bounds.xMax - bounds.xMin);
  return margin + ratio * (width - 2 * margin);
}

function toScreenY(y, bounds, height) {
  const ratio = (y - bounds.yMin) / (bounds.yMax - bounds.yMin);
  return height - margin - ratio * (height - 2 * margin);
}

function chooseStep(min, max) {
  const range = max - min;

  if (range <= 5) return 0.5;
  if (range <= 12) return 1;
  if (range <= 25) return 2;
  return 5;
}

function format(value) {
  if (!Number.isFinite(value)) return "No definido";
  const rounded = Math.round(value * 1000) / 1000;
  if (Object.is(rounded, -0)) return "0";
  return String(rounded);
}

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

init();
