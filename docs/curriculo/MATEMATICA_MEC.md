# PyFis IA · Matemática aplicada según el programa del MEC

Investigación de la malla curricular de **Matemática de la Educación Media** del
Ministerio de Educación y Ciencias (MEC) de Paraguay y cómo se incorporó a PyFis
(sección **Temas → Matemática**). Mismo criterio que Física
([IMPLEMENTACION_MEC.md](IMPLEMENTACION_MEC.md)): solo Educación Media, se citan
documento, resolución y páginas, y no se inventa nada que los documentos no digan.

## Fuentes revisadas

Se leyeron completos los tres documentos oficiales que ya usaba PyFis para
Física. Son los mismos archivos: su SHA-256 coincide con el registrado en
`src/curriculum/sources.js`.

| Doc. | Documento | Resolución | Matemática |
|---|---|---|---|
| A | Desarrollo de capacidades en la Educación Media. Bachillerato Científico con énfasis en Ciencias Básicas y Tecnología. Plan ajustado (2010-2012) | **Res. MEC N° 12.506/09 BIS** | Área "Matemática y sus Tecnologías": Matemática del Plan Común pp. 158-167 (competencia p. 158, orientaciones p. 168). Plan Específico: "Lógica Matemática y Estadística" pp. 258-261 |
| B | Priorización Curricular 2021 | No se le atribuye resolución | Matemática pp. impresas 70-71 / PDF 78-79. Plan Específico Ciencias Básicas: Lógica Matemática (1.er curso) p. 94 / PDF 102; Estadística (2.º curso) p. 95 / PDF 103 |
| C | Guía para la planificación de clases en tiempos de pandemia. Educación Media | — | Cronogramas de Matemática pp. impresas 126-138 / PDF 136-148; Lógica Matemática pp. 217-220 / PDF 227-230; Estadística pp. 221-225 / PDF 231-235 |

**Búsqueda en línea.** Aparece una *Actualización curricular del Bachillerato
Científico* de 2014 (MEC, aprobada por Res. N° 681/14 según fuentes secundarias).
El archivo que se pudo abrir (mec.gov.py/cms_v2/adjuntos/9656) corresponde al
área de **Ciencias Básicas** (Física y Química), no a Matemática. Un informe de
CONACYT indica que el área "Matemática y sus Tecnologías" **se mantuvo sin
modificaciones** en esa actualización. No se pudo descargar el volumen completo
para confirmarlo, por eso PyFis sigue citando la Res. 12.506/09 BIS. Pendiente:
que el equipo verifique el documento de 2014 (y el de Física, que sí cambió de
archivo en 2014) con el docente.

## Competencias (textuales, doc. A)

- **Matemática (Plan Común, p. 158):** "Formula y resuelve situaciones
  problemáticas que involucren la utilización de conceptos, operaciones,
  teoremas y propiedades matemáticas de la Trigonometría, la Geometría Analítica
  y el Cálculo, aplicadas a la modelización de situaciones de la vida real."
- **Lógica Matemática y Estadística (Plan Específico, p. 258):** "Aplica el
  razonamiento lógico en el proceso de elaboración de inferencias estadísticas y
  en la organización, explicación y resolución de problemas de la naturaleza, a
  partir de informaciones recopiladas del medio ambiente."

La orientación del doc. A (p. 168) pide una "Matemática útil, práctica,
aplicable en nuestro quehacer diario", problemas de contextos reales y el uso de
programas informáticos. Por eso cada tema de PyFis tiene un bloque
**Matemática aplicada** (dónde se usa en la vida real) y ejercicios con
situaciones de Paraguay: tarifas, cooperativas, chipa y cocido en la cantina,
lapachos, antenas, rotondas, etc.

## Cursos

| Curso en PyFis | Programa (doc. A) | Priorización 2021 (doc. B) | Guía 2021 (doc. C) | Temas |
|---|---|---|---|---|
| 1.er curso · Plan Común | pp. 158-161 | capacidades 1-7 | sem. 1-22 | Funciones, ángulos, trigonometría, seno y coseno, geometría analítica, la recta, combinatoria |
| 2.º curso · Plan Común | pp. 162-164 | capacidades 1-5 | sem. 1-22 | Identidades trigonométricas, exponenciales y logaritmos, matrices, determinantes y Cramer, cónicas |
| 3.er curso · Plan Común | pp. 165-167 | capacidades 1-6 | sem. 1-22 | Progresiones, límites, derivadas, optimización |
| 2.º curso · Plan Específico (Lógica y Estadística) | pp. 258-261 | Lógica L1-L3, Estadística E1-E7 | Lógica 1.º, Estadística 2.º | Proposiciones, tablas de verdad, inferencia, muestreo, frecuencias, medidas, regresión |

**Cómo se numeran.** El doc. A no numera las capacidades: PyFis usa el orden en
que aparecen (n.º 1, 2…). La Priorización numera aparte; en el Plan Específico
separa Lógica (L) y Estadística (E), y así se muestra.

**Discrepancias conservadas tal cual:**

- El doc. A pone "Lógica Matemática y Estadística" juntas en 2.º curso. El doc. B
  las separa: Lógica Matemática en 1.º y Estadística en 2.º. La app lo advierte en
  el curso.
- La Guía 2021 de 2.º curso vuelve a trabajar la ecuación de la recta (programa
  de 1.º) antes de las cónicas.
- La Guía 2021 de 3.º trabaja la regla de la cadena, aunque la Priorización no
  lista las reglas de derivación como capacidad aparte.

**No priorizados en 2021** (siguen en el programa completo): análisis
combinatorio y binomio; clasificación de funciones; función inversa; análisis
gráfico de exponenciales y logaritmos; clasificación de matrices; Sarrus y
Laplace (como capacidad aparte); reglas de derivación, L'Hôpital y optimización;
tablas de verdad; regresión y correlación.

## Qué se agregó a la app

- **23 temas** (`src/curriculum/topics/matematica.js`): resumen, fórmulas,
  ejemplo, error común, **Matemática aplicada** y preguntas, en castellano y
  Jopara.
- **Unos 70 generadores de ejercicios** (`src/curriculum/mathPractice.js`):
  problemas aplicados con datos al azar, corrección automática y resolución paso
  a paso. En lógica la respuesta es 1 (V) o 0 (F).
- **10 simuladores** (`src/sims/math/`): funciones (familias, fórmulas
  trigonométricas, interés compuesto), trigonometría (circunferencia unitaria,
  altura de un árbol con su sombra, teoremas del seno y del coseno), geometría
  analítica (puntos, rectas, sistemas por Cramer), cónicas (con los rayos de una
  antena parabólica), matrices (en una cantina), progresiones (plan de ahorro),
  cálculo (límite 0/0, secante → tangente, la caja de mayor volumen),
  estadística (frecuencias, medidas con valor extremo, regresión), lógica
  (tablas de verdad, reglas de inferencia) y combinatoria (con el triángulo de
  Pascal). Los datos estadísticos son de ejemplo y se rotulan así: no son
  estadísticas oficiales.
- **Temas → Física / Matemática**, y lo mismo en el **Plan MEC** del docente.
- **Tutor sin internet:** reconoce los temas de Matemática, cita al MEC, agrega
  la aplicación y propone ejercicios que corrige. "Parábola" con foco, directriz
  o antena va a Cónicas; sin esas palabras sigue yendo al tiro parabólico.
- **Pruebas:** datos del programa, priorización, autocorrección de todos los
  generadores (40 semillas cada uno), casos conocidos (interés compuesto,
  combinaciones, teorema del coseno, caja óptima) y tutor.

## Trazabilidad tema por tema

Tabla generada desde `src/curriculum/` (los mismos datos que muestra la app).

| Tema | Dónde figura en el MEC | Priorización 2021 | Guía 2021 | Simulador |
|---|---|---|---|---|
| Funciones y sus gráficos | 1.er curso Plan Común, cap. 1 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161)<br>1.er curso Plan Común, cap. 2 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161)<br>2.º curso Plan Común, cap. 1 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 2 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>3.er curso Plan Común, cap. 4 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167) | 1.er curso Plan Común: n.º 1 | Matemática, 1.er curso: sem. 1-2<br>Matemática, 2.º curso: sem. C-D<br>Matemática, 3.er curso: sem. C-E | function (families) |
| Medida de ángulos y reducción | 1.er curso Plan Común, cap. 3 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161)<br>1.er curso Plan Común, cap. 6 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161) | 1.er curso Plan Común: n.º 2<br>1.er curso Plan Común: n.º 3 | Matemática, 1.er curso: sem. 3, 8 | triangle (circle) |
| Trigonometría del triángulo rectángulo | 1.er curso Plan Común, cap. 4 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161)<br>1.er curso Plan Común, cap. 5 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161) | 1.er curso Plan Común: n.º 3 | Matemática, 1.er curso: sem. D, 4-7<br>Matemática, 2.º curso: sem. C-D | triangle (right) |
| Teoremas del seno y del coseno | 1.er curso Plan Común, cap. 7 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161) | 1.er curso Plan Común: n.º 4 | Matemática, 1.er curso: sem. 9-10 | triangle (oblique) |
| Distancia, punto medio y pendiente | 1.er curso Plan Común, cap. 8 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161)<br>1.er curso Plan Común, cap. 13 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161) | 1.er curso Plan Común: n.º 5<br>1.er curso Plan Común: n.º 7 | Matemática, 1.er curso: sem. 11-12, 19-22 | analytic (points) |
| La línea recta | 1.er curso Plan Común, cap. 9 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161)<br>1.er curso Plan Común, cap. 10 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161)<br>1.er curso Plan Común, cap. 11 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161)<br>1.er curso Plan Común, cap. 12 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161)<br>1.er curso Plan Común, cap. 13 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161) | 1.er curso Plan Común: n.º 6<br>1.er curso Plan Común: n.º 5<br>1.er curso Plan Común: n.º 7 | Matemática, 1.er curso: sem. 13-14, 15-18, 19-22<br>Matemática, 2.º curso: sem. 13 | analytic (lines) |
| Análisis combinatorio y binomio | 1.er curso Plan Común, cap. 14 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161)<br>1.er curso Plan Común, cap. 15 (Res. MEC N° 12.506/09 BIS, doc. A pp. 158-161) | no figura | — | counting |
| Fórmulas, identidades y ecuaciones trigonométricas | 2.º curso Plan Común, cap. 3 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 4 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164) | 2.º curso Plan Común: n.º 1<br>2.º curso Plan Común: n.º 2 | Matemática, 2.º curso: sem. 1-2, 3 | function (trig) |
| Funciones exponenciales y logaritmos | 2.º curso Plan Común, cap. 1 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 4 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 5 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 6 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164) | 2.º curso Plan Común: n.º 2 | Matemática, 2.º curso: sem. 4-6 | function (growth) |
| Matrices | 2.º curso Plan Común, cap. 7 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 8 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 9 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164) | 2.º curso Plan Común: n.º 3 | Matemática, 2.º curso: sem. 7-10 | matrix (ops) |
| Determinantes y regla de Cramer | 2.º curso Plan Común, cap. 10 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 11 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 12 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164) | 2.º curso Plan Común: n.º 4 | Matemática, 2.º curso: sem. 11-12 | analytic (system) |
| Secciones cónicas | 2.º curso Plan Común, cap. 13 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 14 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164)<br>2.º curso Plan Común, cap. 15 (Res. MEC N° 12.506/09 BIS, doc. A pp. 162-164) | 2.º curso Plan Común: n.º 5 | Matemática, 2.º curso: sem. 14-16, 17-18, 19-22 | conic |
| Sucesiones y progresiones | 3.er curso Plan Común, cap. 1 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167)<br>3.er curso Plan Común, cap. 2 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167)<br>3.er curso Plan Común, cap. 3 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167) | 3.er curso Plan Común: n.º 1 | Matemática, 3.er curso: sem. 14-16, 17-22 | sequence |
| Límites y continuidad | 3.er curso Plan Común, cap. 5 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167)<br>3.er curso Plan Común, cap. 6 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167)<br>3.er curso Plan Común, cap. 7 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167)<br>3.er curso Plan Común, cap. 10 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167) | 3.er curso Plan Común: n.º 2<br>3.er curso Plan Común: n.º 3<br>3.er curso Plan Común: n.º 4 | Matemática, 3.er curso: sem. 1-5, 6-7 | calculus (limit) |
| Derivadas | 3.er curso Plan Común, cap. 8 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167)<br>3.er curso Plan Común, cap. 9 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167)<br>3.er curso Plan Común, cap. 10 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167) | 3.er curso Plan Común: n.º 5 | Matemática, 3.er curso: sem. 8-10 | calculus (tangent) |
| Aplicaciones de la derivada: optimización | 3.er curso Plan Común, cap. 11 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167)<br>3.er curso Plan Común, cap. 12 (Res. MEC N° 12.506/09 BIS, doc. A pp. 165-167) | 3.er curso Plan Común: n.º 6 | Matemática, 3.er curso: sem. 11-13 | calculus (optimize) |
| Proposiciones y conectivos lógicos | 2.º curso Plan Específico · Lógica y Estadística, cap. 1 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261)<br>2.º curso Plan Específico · Lógica y Estadística, cap. 2 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261)<br>2.º curso Plan Específico · Lógica y Estadística, cap. 3 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261) | 2.º curso Plan Específico · Lógica y Estadística: L1<br>2.º curso Plan Específico · Lógica y Estadística: L2 | Plan Específico: Lógica Matemática (1.º) y Estadística (2.º): sem. L1-7, L8-9 | logic (table) |
| Tablas de verdad, tautologías y contradicciones | 2.º curso Plan Específico · Lógica y Estadística, cap. 4 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261)<br>2.º curso Plan Específico · Lógica y Estadística, cap. 5 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261) | no figura | Plan Específico: Lógica Matemática (1.º) y Estadística (2.º): sem. L1-7 | logic (table) |
| Reglas de inferencia | 2.º curso Plan Específico · Lógica y Estadística, cap. 6 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261)<br>2.º curso Plan Específico · Lógica y Estadística, cap. 7 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261) | 2.º curso Plan Específico · Lógica y Estadística: L3 | Plan Específico: Lógica Matemática (1.º) y Estadística (2.º): sem. L10-18 | logic (inference) |
| Población, muestra y variables | 2.º curso Plan Específico · Lógica y Estadística, cap. 8 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261)<br>2.º curso Plan Específico · Lógica y Estadística, cap. 9 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261) | 2.º curso Plan Específico · Lógica y Estadística: E1<br>2.º curso Plan Específico · Lógica y Estadística: E2 | Plan Específico: Lógica Matemática (1.º) y Estadística (2.º): sem. E1-2 | stats (frequency) |
| Tablas de frecuencias y gráficos | 2.º curso Plan Específico · Lógica y Estadística, cap. 10 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261)<br>2.º curso Plan Específico · Lógica y Estadística, cap. 11 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261)<br>2.º curso Plan Específico · Lógica y Estadística, cap. 12 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261) | 2.º curso Plan Específico · Lógica y Estadística: E3<br>2.º curso Plan Específico · Lógica y Estadística: E4<br>2.º curso Plan Específico · Lógica y Estadística: E5 | Plan Específico: Lógica Matemática (1.º) y Estadística (2.º): sem. E·C-E, E3-10 | stats (frequency) |
| Medidas de posición y de dispersión | 2.º curso Plan Específico · Lógica y Estadística, cap. 13 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261) | 2.º curso Plan Específico · Lógica y Estadística: E7 | Plan Específico: Lógica Matemática (1.º) y Estadística (2.º): sem. E11-22 | stats (measures) |
| Regresión y correlación lineal | 2.º curso Plan Específico · Lógica y Estadística, cap. 14 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261)<br>2.º curso Plan Específico · Lógica y Estadística, cap. 15 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261)<br>2.º curso Plan Específico · Lógica y Estadística, cap. 16 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261)<br>2.º curso Plan Específico · Lógica y Estadística, cap. 17 (Res. MEC N° 12.506/09 BIS, doc. A pp. 258-261) | no figura | — | stats (regression) |
