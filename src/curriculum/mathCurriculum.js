// Mapa curricular de Matemática de la Educación Media (MEC, Paraguay), con el
// mismo formato que el de Física (curriculum.js). Transcripto de:
// - doc A (Res. MEC N° 12.506/09 BIS): Matemática del Plan Común, pp. 158-167,
//   y "Lógica Matemática y Estadística" del Plan Específico, pp. 258-261.
// - doc B (Priorización Curricular 2021): Matemática pp. impresas 70-71 /
//   PDF 78-79; Lógica Matemática p. 94 / PDF 102; Estadística p. 95 / PDF 103.
// - doc C (Guía de planificación 2021): Matemática pp. impresas 126-138 /
//   PDF 136-148; Lógica Matemática y Estadística pp. 217-225 / PDF 227-235.
// El doc A no numera las capacidades: "n" es el orden en que aparecen.
// "prio" es el número en la Priorización 2021 (null si no figura). En el Plan
// Específico la Priorización numera aparte Lógica (L) y Estadística (E).

export const MATH_COURSES = [
  {
    id: 'm1', subject: 'matematica', grade: 1, plan: 'comun',
    name: { es: '1.er curso', gn: '1.er curso' },
    planName: { es: 'Plan Común', gn: 'Plan Común' },
    competency: 'matematica',
    base: { source: 'A', pages: 'pp. 158-161' },
    prio: { source: 'B', pages: 'pp. impresas 70-71 / PDF 78-79' },
    scope: {
      es: 'Funciones y sus gráficos, trigonometría, la línea recta y análisis combinatorio.',
      gn: 'Función ha igráfico, trigonometría, línea recta ha análisis combinatorio.',
    },
    units: [
      {
        id: 'm1-funciones', name: { es: 'Funciones. Gráficos. Características', gn: 'Función. Gráfico. Característica' },
        capacities: [
          { n: 1, text: 'Clasifica una función a partir de su expresión analítica.', topics: ['funciones'], prio: null },
          { n: 2, text: 'Interpreta las principales características de una función a partir de su gráfico.', topics: ['funciones'], prio: 1 },
        ],
      },
      {
        id: 'm1-trigonometria', name: { es: 'Trigonometría', gn: 'Trigonometría' },
        capacities: [
          { n: 3, text: 'Utiliza la relación existente entre los sistemas de medidas de ángulos en conversiones entre los mismos.', topics: ['angulos'], prio: 2 },
          { n: 4, text: 'Formula y resuelve problemas referidos a situaciones de la vida real, en los que se utilicen funciones trigonométricas o relaciones entre las mismas en el triángulo rectángulo.', topics: ['trigonometria'], prio: 3 },
          { n: 5, text: 'Utiliza los valores de las funciones trigonométricas de ángulos notables en la obtención de resultados más precisos.', topics: ['trigonometria'], prio: 3 },
          { n: 6, text: 'Deduce y aplica las relaciones entre los valores y signos de las funciones trigonométricas en la reducción de ángulos al primer cuadrante.', topics: ['angulos'], prio: 3 },
          { n: 7, text: 'Formula y resuelve problemas que involucren la utilización de triángulos oblicuángulos (teorema del seno y del coseno).', topics: ['triangulos-oblicuangulos'], prio: 4 },
          { n: 8, text: 'Formula y resuelve problemas referidos a situaciones de la vida real, que impliquen el cálculo de distancia entre dos puntos, punto medio de un segmento y pendiente.', topics: ['geometria-analitica'], prio: 5 },
        ],
      },
      {
        id: 'm1-recta', name: { es: 'La línea recta', gn: 'Línea recta' },
        capacities: [
          { n: 9, text: 'Reconoce las formas de la ecuación de una recta por medio de su expresión analítica (general, explícita y segmentaria).', topics: ['recta'], prio: 6 },
          { n: 10, text: 'Determina la ecuación de una recta de la cual se conocen su pendiente y un punto por el que pasa, y dos puntos por los que pasa.', topics: ['recta'], prio: 6 },
          { n: 11, text: 'Determina el paralelismo o perpendicularidad de dos o más rectas a través del cálculo de su pendiente.', topics: ['recta'], prio: 5 },
          { n: 12, text: 'Identifica características de una recta a partir de su ecuación y su representación gráfica.', topics: ['recta'], prio: 6 },
          { n: 13, text: 'Formula y resuelve situaciones problemáticas en las que se determinan: ángulo entre dos rectas, distancia de un punto a una recta, área de un polígono a partir de las coordenadas de sus vértices.', topics: ['recta', 'geometria-analitica'], prio: 7 },
        ],
      },
      {
        id: 'm1-combinatoria', name: { es: 'Análisis combinatorio', gn: 'Análisis combinatorio' },
        capacities: [
          { n: 14, text: 'Resuelve situaciones problemáticas utilizando los principios del Análisis Combinatorio (factorial, variaciones, permutaciones, combinaciones).', topics: ['combinatoria'], prio: null },
          { n: 15, text: 'Utiliza el Teorema de Newton en el desarrollo de potencias de binomios.', topics: ['combinatoria'], prio: null },
        ],
      },
    ],
    prioNote: { es: 'La Priorización 2021 no incluye el análisis combinatorio ni la clasificación de funciones por su expresión: siguen en el programa completo.', gn: 'Priorización 2021 nombohéri análisis combinatorio ni función clasificación: oĩ gueteri programa completo-pe.' },
  },
  {
    id: 'm2', subject: 'matematica', grade: 2, plan: 'comun',
    name: { es: '2.º curso', gn: '2.º curso' },
    planName: { es: 'Plan Común', gn: 'Plan Común' },
    competency: 'matematica',
    base: { source: 'A', pages: 'pp. 162-164' },
    prio: { source: 'B', pages: 'pp. impresas 70-71 / PDF 78-79' },
    scope: {
      es: 'Identidades y ecuaciones trigonométricas, exponenciales y logaritmos, matrices, determinantes y secciones cónicas.',
      gn: 'Identidad ha ecuación trigonométrica, exponencial ha logaritmo, matriz, determinante ha sección cónica.',
    },
    units: [
      {
        id: 'm2-funciones', name: { es: 'Funciones y ecuaciones', gn: 'Función ha ecuación' },
        capacities: [
          { n: 1, text: 'Analiza funciones a través de su representación gráfica, considerando dominio, rango o recorrido, extremos y variación (logarítmica, exponencial y trigonométricas).', topics: ['exponencial-logaritmo', 'funciones'], prio: null },
          { n: 2, text: 'Determina la inversa de una función, en caso de que ésta exista.', topics: ['funciones'], prio: null },
          { n: 3, text: 'Aplica fórmulas trigonométricas en el cálculo de funciones trigonométricas de distintos valores de ángulos.', topics: ['identidades-trigonometricas'], prio: 1 },
          { n: 4, text: 'Formula y resuelve situaciones problemáticas en las que intervienen identidades y ecuaciones (trigonométricas, exponenciales y logarítmicas).', topics: ['identidades-trigonometricas', 'exponencial-logaritmo'], prio: 2 },
          { n: 5, text: 'Determina logaritmo y antilogaritmo a partir de ecuaciones exponenciales.', topics: ['exponencial-logaritmo'], prio: null },
          { n: 6, text: 'Aplica las propiedades de los logaritmos en la resolución de situaciones problemáticas.', topics: ['exponencial-logaritmo'], prio: 2 },
        ],
      },
      {
        id: 'm2-matrices', name: { es: 'Matrices y determinantes', gn: 'Matriz ha determinante' },
        capacities: [
          { n: 7, text: 'Determina las características de una matriz: notación, orden, elementos.', topics: ['matrices'], prio: null },
          { n: 8, text: 'Clasifica matrices según sus características.', topics: ['matrices'], prio: null },
          { n: 9, text: 'Formula y resuelve situaciones problemáticas aplicando las operaciones entre matrices.', topics: ['matrices'], prio: 3 },
          { n: 10, text: 'Aplica las propiedades de los determinantes en la resolución de situaciones problemáticas.', topics: ['sistemas-ecuaciones'], prio: null },
          { n: 11, text: 'Utiliza distintos métodos en el cálculo del determinante de matrices cuadradas de segundo y tercer orden (Sarrus, Laplace).', topics: ['sistemas-ecuaciones'], prio: null },
          { n: 12, text: 'Formula y resuelve situaciones problemáticas donde intervengan sistemas de ecuaciones con dos o más incógnitas, aplicando la regla de Cramer.', topics: ['sistemas-ecuaciones'], prio: 4 },
        ],
      },
      {
        id: 'm2-conicas', name: { es: 'Secciones cónicas', gn: 'Sección cónica' },
        capacities: [
          { n: 13, text: 'Identifica las secciones cónicas como lugares geométricos y como cortes de una superficie cónica con planos de distinta inclinación.', topics: ['conicas'], prio: 5 },
          { n: 14, text: 'Resuelve situaciones problemáticas en las que intervengan secciones cónicas (circunferencia, parábola y elipse).', topics: ['conicas'], prio: 5 },
          { n: 15, text: 'Formula y resuelve problemas que involucren la determinación de la intersección de las cónicas con una recta.', topics: ['conicas'], prio: 5 },
        ],
      },
    ],
    prioNote: { es: 'La Priorización 2021 no lista por separado el análisis gráfico de funciones, la función inversa, la clasificación de matrices ni los métodos de Sarrus y Laplace (la Guía 2021 los trabaja junto con Cramer).', gn: 'Priorización 2021 nombohérai función gráfico, función inversa, matriz clasificación ni Sarrus ha Laplace (Guía 2021 ombo’e Cramer ndive).' },
  },
  {
    id: 'm3', subject: 'matematica', grade: 3, plan: 'comun',
    name: { es: '3.er curso', gn: '3.er curso' },
    planName: { es: 'Plan Común', gn: 'Plan Común' },
    competency: 'matematica',
    base: { source: 'A', pages: 'pp. 165-167' },
    prio: { source: 'B', pages: 'pp. impresas 70-71 / PDF 78-79' },
    scope: {
      es: 'Sucesiones y progresiones, límites, continuidad y derivadas con sus aplicaciones.',
      gn: 'Sucesión ha progresión, límite, continuidad ha derivada iaplicación reheve.',
    },
    units: [
      {
        id: 'm3-progresiones', name: { es: 'Sucesiones y progresiones', gn: 'Sucesión ha progresión' },
        capacities: [
          { n: 1, text: 'Analiza sucesiones presentes en conjuntos estudiados.', topics: ['progresiones'], prio: null },
          { n: 2, text: 'Formula y resuelve situaciones problemáticas donde se apliquen conceptos de progresiones aritméticas y geométricas.', topics: ['progresiones'], prio: 1 },
          { n: 3, text: 'Determina la suma de los “n” primeros términos de progresiones aritméticas y geométricas.', topics: ['progresiones'], prio: 1 },
        ],
      },
      {
        id: 'm3-limites', name: { es: 'Límite de funciones', gn: 'Función límite' },
        capacities: [
          { n: 4, text: 'Determina las principales características de una función a través de su representación gráfica y de su expresión analítica.', topics: ['funciones'], prio: null },
          { n: 5, text: 'Determina el límite de funciones en un punto y en el infinito.', topics: ['limites'], prio: 2 },
          { n: 6, text: 'Resuelve límites indeterminados.', topics: ['limites'], prio: 3 },
          { n: 7, text: 'Aplica el cálculo de límite de funciones en la determinación de características de las mismas (continuidad, asíntotas, recta tangente).', topics: ['limites'], prio: 4 },
        ],
      },
      {
        id: 'm3-derivadas', name: { es: 'Derivada de funciones', gn: 'Función derivada' },
        capacities: [
          { n: 8, text: 'Formula y resuelve situaciones problemáticas en las cuales se interprete el concepto de derivada.', topics: ['derivadas'], prio: 5 },
          { n: 9, text: 'Determina la derivada de distintos órdenes de funciones algebraicas, trigonométricas, exponenciales y logarítmicas.', topics: ['derivadas'], prio: null },
          { n: 10, text: 'Formula y resuelve situaciones problemáticas en las que se precise del cálculo de límites (regla de L’Hopital; recta tangente y normal).', topics: ['derivadas', 'limites'], prio: null },
          { n: 11, text: 'Determina las características de una función usando derivadas.', topics: ['aplicaciones-derivada'], prio: 6 },
          { n: 12, text: 'Formula y resuelve problemas de optimización empleando derivadas de funciones.', topics: ['aplicaciones-derivada'], prio: null },
        ],
      },
    ],
    prioNote: { es: 'La Priorización 2021 no lista las reglas de derivación como capacidad aparte, ni la regla de L’Hopital ni la optimización: siguen en el programa completo.', gn: 'Priorización 2021 nombohérai derivación regla, L’Hopital ni optimización: oĩ gueteri programa completo-pe.' },
  },
  {
    id: 'mpe', subject: 'matematica', grade: 2, plan: 'especifico',
    name: { es: '2.º curso', gn: '2.º curso' },
    planName: { es: 'Plan Específico · Lógica y Estadística', gn: 'Plan Específico · Lógica ha Estadística' },
    competency: 'logica',
    base: { source: 'A', pages: 'pp. 258-261' },
    prio: { source: 'B', pages: 'Lógica Matemática p. impresa 94 / PDF 102 · Estadística p. impresa 95 / PDF 103' },
    scope: {
      es: 'Lógica proposicional, tablas de verdad, reglas de inferencia, estadística descriptiva, regresión y correlación.',
      gn: 'Lógica proposicional, tabla de verdad, inferencia regla, estadística descriptiva, regresión ha correlación.',
    },
    note: {
      es: 'Bachillerato Científico con énfasis en Ciencias Básicas. El programa base pone “Lógica Matemática y Estadística” en 2.º curso; la Priorización 2021 las separa: Lógica Matemática en 1.er curso y Estadística en 2.º. Se muestran tal como las publicó el MEC.',
      gn: 'Bachillerato Científico Ciencias Básicas. Programa base omoĩ “Lógica Matemática y Estadística” 2.º curso-pe; Priorización 2021 omboja’o: Lógica 1.er curso-pe ha Estadística 2.º-pe. Ojehechauka MEC omoherakuãháicha.',
    },
    units: [
      {
        id: 'mpe-proposiciones', name: { es: 'Proposiciones y términos de enlace', gn: 'Proposición ha término de enlace' },
        capacities: [
          { n: 1, text: 'Formula y simboliza proposiciones atómicas referidas a situaciones del medio natural.', topics: ['proposiciones'], prio: null },
          { n: 2, text: 'Utiliza proposiciones atómicas y términos de enlace en la formulación y simbolización de proposiciones moleculares.', topics: ['proposiciones'], prio: 'L1' },
          { n: 3, text: 'Utiliza signos de agrupación en la simbolización de proposiciones moleculares con dos o más términos de enlace.', topics: ['proposiciones'], prio: 'L2' },
        ],
      },
      {
        id: 'mpe-tablas', name: { es: 'Tablas de verdad. Tautología y contradicción', gn: 'Tabla de verdad. Tautología ha contradicción' },
        capacities: [
          { n: 4, text: 'Construye e interpreta tablas de verdad de proposiciones lógicas.', topics: ['tablas-verdad'], prio: null },
          { n: 5, text: 'Reconoce proposiciones tautológicas y contradictorias a través de su tabla de verdad.', topics: ['tablas-verdad'], prio: null },
        ],
      },
      {
        id: 'mpe-inferencia', name: { es: 'Reglas de inferencia lógica', gn: 'Inferencia lógica regla' },
        capacities: [
          { n: 6, text: 'Comprende las condiciones de aplicación de las reglas de inferencia lógica en el proceso de obtención de razonamientos válidos.', topics: ['inferencia'], prio: null },
          { n: 7, text: 'Aplica reglas de inferencia lógica en la obtención de conclusiones válidas.', topics: ['inferencia'], prio: 'L3' },
        ],
      },
      {
        id: 'mpe-muestreo', name: { es: 'Muestreo y escala', gn: 'Muestreo ha escala' },
        capacities: [
          { n: 8, text: 'Determina la relación existente entre los distintos componentes de una investigación estadística.', topics: ['estadistica-datos'], prio: 'E1' },
          { n: 9, text: 'Utiliza escalas de medición en la distribución y clasificación de datos.', topics: ['estadistica-datos'], prio: 'E2' },
        ],
      },
      {
        id: 'mpe-frecuencias', name: { es: 'Distribución de frecuencias. Medidas de posición y de dispersión', gn: 'Frecuencia distribución. Posición ha dispersión medida' },
        capacities: [
          { n: 10, text: 'Determina la distribución de frecuencia de conjuntos de datos.', topics: ['frecuencias'], prio: 'E3' },
          { n: 11, text: 'Resuelve situaciones problemáticas mediante tablas de distribución de frecuencias, con datos agrupados y no agrupados.', topics: ['frecuencias'], prio: 'E4' },
          { n: 12, text: 'Construye e interpreta gráficos estadísticos para datos agrupados y no agrupados.', topics: ['frecuencias'], prio: 'E5' },
          { n: 13, text: 'Analiza características de una población objeto de estudio a través del cálculo de medidas de posición y de dispersión de datos agrupados y no agrupados.', topics: ['medidas-estadisticas'], prio: 'E7' },
        ],
      },
      {
        id: 'mpe-regresion', name: { es: 'Análisis de regresión y correlación lineal', gn: 'Regresión ha correlación lineal' },
        capacities: [
          { n: 14, text: 'Aplica el método de mínimos cuadrados en el ajuste de una recta a un conjunto de datos.', topics: ['regresion'], prio: null },
          { n: 15, text: 'Representa gráficamente la ecuación de regresión lineal.', topics: ['regresion'], prio: null },
          { n: 16, text: 'Utiliza la recta de regresión en proyecciones y estimaciones de resultados a partir de datos simples.', topics: ['regresion'], prio: null },
          { n: 17, text: 'Utiliza el coeficiente de correlación lineal en la determinación del grado de relación entre variables.', topics: ['regresion'], prio: null },
        ],
      },
    ],
    prioNote: { es: 'La Priorización 2021 no incluye las tablas de verdad como capacidad aparte ni la regresión y correlación lineal.', gn: 'Priorización 2021 nombohéri tabla de verdad ni regresión ha correlación lineal.' },
  },
];

const week = (kind, code, dates, text, topics = []) => ({ kind, code, dates, text, topics });
const REPASO_1 = week('etapa', '—', '14 junio-6 agosto', 'Repaso, evaluaciones de la primera etapa y retroalimentación.');
const REPASO_2 = week('etapa', '—', '1-30 noviembre', 'Repaso y evaluaciones de la segunda etapa.');

export const MATH_GUIDE_SCHEDULES = {
  m1: {
    label: { es: 'Guía 2021 · Matemática, 1.er curso', gn: 'Guía 2021 · Matemática, 1.er curso' },
    pages: 'pp. impresas 126-129 / PDF 136-139',
    weeks: [
      week('nivelacion', 'C', '15-19 marzo', 'Nivelación: ecuaciones cuadráticas (capacidad de 9.º grado).'),
      week('nivelacion', 'D', '22-26 marzo', 'Nivelación: triángulos y teorema de Pitágoras (capacidad de 7.º grado).', ['trigonometria']),
      week('capacidad', '1-2', '5-16 abril', 'Concepto de función y sus características: dominio, rango, crecimiento, extremos, paridad, continuidad (se sugiere GeoGebra).', ['funciones']),
      week('capacidad', '3', '19-23 abril', 'Sistemas de medida de ángulos: sexagesimal y radián.', ['angulos']),
      week('capacidad', '4-7', '26 abril-21 mayo', 'Funciones trigonométricas en el triángulo rectángulo, fórmulas fundamentales y ángulos notables (30°, 45°, 60°).', ['trigonometria']),
      week('capacidad', '8', '24-28 mayo', 'Signos de las funciones trigonométricas y reducción al primer cuadrante.', ['angulos']),
      week('capacidad', '9-10', '31 mayo-11 junio', 'Teorema del seno y teorema del coseno en problemas de la vida cotidiana.', ['triangulos-oblicuangulos']),
      REPASO_1,
      week('capacidad', '11-12', '9-20 agosto', 'Distancia entre dos puntos, punto medio, pendiente y ángulo de inclinación.', ['geometria-analitica']),
      week('capacidad', '13-14', '23 agosto-3 septiembre', 'Paralelismo y perpendicularidad de rectas; situaciones problemáticas.', ['recta']),
      week('capacidad', '15-18', '6 septiembre-1 octubre', 'Ecuaciones de la recta (general, explícita, segmentaria, punto-pendiente), gráfica e intersección con los ejes.', ['recta']),
      week('capacidad', '19-22', '4-29 octubre', 'Ángulo entre dos rectas, distancia de un punto a una recta y área de un polígono por coordenadas.', ['recta', 'geometria-analitica']),
      REPASO_2,
    ],
  },
  m2: {
    label: { es: 'Guía 2021 · Matemática, 2.º curso', gn: 'Guía 2021 · Matemática, 2.º curso' },
    pages: 'pp. impresas 130-134 / PDF 140-144',
    weeks: [
      week('nivelacion', 'C-D', '15-26 marzo', 'Nivelación: funciones polinómicas y trigonométricas; trigonometría del triángulo rectángulo.', ['funciones', 'trigonometria']),
      week('capacidad', '1-2', '5-16 abril', 'Seno, coseno y tangente de la suma y diferencia, del doble y de la mitad de un ángulo.', ['identidades-trigonometricas']),
      week('capacidad', '3', '19-23 abril', 'Identidades y ecuaciones trigonométricas.', ['identidades-trigonometricas']),
      week('capacidad', '4-6', '26 abril-13 mayo', 'Ecuaciones exponenciales, propiedades de los logaritmos y ecuaciones logarítmicas.', ['exponencial-logaritmo']),
      week('capacidad', '7-10', '17 mayo-11 junio', 'Matrices: concepto, tipos, suma, resta, producto por un escalar y producto entre matrices.', ['matrices']),
      REPASO_1,
      week('capacidad', '11-12', '9-20 agosto', 'Determinantes (Sarrus y Laplace) y regla de Cramer en situaciones problemáticas.', ['sistemas-ecuaciones']),
      week('capacidad', '13', '23-27 agosto', 'Ecuaciones de la recta y su gráfica (base para las cónicas).', ['recta']),
      week('capacidad', '14-16', '30 agosto-17 septiembre', 'Circunferencia: ecuación con centro en el origen y desplazado, radio, gráfica e intersección con una recta.', ['conicas']),
      week('capacidad', '17-18', '20 septiembre-1 octubre', 'Parábola: ecuación con vértice en el origen, gráfica e intersección con una recta.', ['conicas']),
      week('capacidad', '19-22', '4-29 octubre', 'Elipse: ecuación, vértices, focos, excentricidad, gráfica y situaciones problemáticas.', ['conicas']),
      REPASO_2,
    ],
  },
  m3: {
    label: { es: 'Guía 2021 · Matemática, 3.er curso', gn: 'Guía 2021 · Matemática, 3.er curso' },
    pages: 'pp. impresas 135-138 / PDF 145-148',
    weeks: [
      week('nivelacion', 'C-E', '15-30 marzo', 'Nivelación: funciones, factorización de polinomios e identidades trigonométricas.', ['funciones']),
      week('capacidad', '1-5', '5 abril-7 mayo', 'Límites en un punto y en el infinito; indeterminaciones 0/0 (factorización), ∞/∞ y trigonométricas.', ['limites']),
      week('capacidad', '6-7', '10-21 mayo', 'Límite y continuidad de funciones.', ['limites']),
      week('capacidad', '8-10', '24 mayo-11 junio', 'Concepto de derivada y regla de la cadena.', ['derivadas']),
      REPASO_1,
      week('capacidad', '11-13', '9-27 agosto', 'Características de una función con derivadas: criterios de la primera y la segunda derivada.', ['aplicaciones-derivada']),
      week('capacidad', '14-16', '30 agosto-17 septiembre', 'Progresión aritmética: razón, interpolación y suma de términos.', ['progresiones']),
      week('capacidad', '17-22', '20 septiembre-29 octubre', 'Progresión geométrica: término general, suma, interpolación y problemas de matemática financiera.', ['progresiones']),
      REPASO_2,
    ],
  },
  mpe: {
    label: { es: 'Guía 2021 · Plan Específico: Lógica Matemática (1.º) y Estadística (2.º)', gn: 'Guía 2021 · Plan Específico: Lógica Matemática (1.º) ha Estadística (2.º)' },
    pages: 'Lógica pp. impresas 217-220 / PDF 227-230 · Estadística pp. impresas 221-225 / PDF 231-235',
    weeks: [
      week('nivelacion', 'L·C', '15-19 marzo', 'Lógica · Nivelación: tipos de oraciones y sus elementos.'),
      week('capacidad', 'L1-7', '22 marzo-21 mayo', 'Lógica · Proposiciones atómicas y términos de enlace: conjunción, disyunción, negación, condicional y bicondicional.', ['proposiciones', 'tablas-verdad']),
      week('capacidad', 'L8-9', '7-18 junio', 'Lógica · Signos de agrupación y término de enlace dominante.', ['proposiciones']),
      week('capacidad', 'L10-18', '9 agosto-22 octubre', 'Lógica · Reglas de inferencia: Ponendo Ponens, Tollendo Tollens, Tollendo Ponens, simplificación y adjunción, conmutativa, De Morgan y silogismo.', ['inferencia']),
      week('nivelacion', 'E·C-E', '15-30 marzo', 'Estadística · Nivelación: tablas de frecuencia, medidas de tendencia central, histograma y polígono de frecuencias.', ['frecuencias']),
      week('capacidad', 'E1-2', '5-16 abril', 'Estadística · Población, muestra, variables y escalas de medición.', ['estadistica-datos']),
      week('capacidad', 'E3-10', '19 abril-11 junio', 'Estadística · Tablas de distribución de frecuencias y gráficos: barras, líneas, circular, histograma, polígono y ojiva.', ['frecuencias']),
      week('capacidad', 'E11-22', '9 agosto-29 octubre', 'Estadística · Tendencia central, deciles, cuartiles, percentiles, varianza y desviación típica.', ['medidas-estadisticas']),
    ],
  },
};
