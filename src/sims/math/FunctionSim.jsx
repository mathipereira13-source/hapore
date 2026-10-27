// Funciones: familias (lineal, cuadrática, exponencial, logarítmica, seno,
// módulo, parte entera) con sus características; fórmulas trigonométricas
// (suma y ángulo doble sobre las gráficas de seno y coseno); y crecimiento
// exponencial aplicado al interés compuesto frente al interés simple.
import { useState } from 'react';
import { Sim, Stage, Slider, Choice, Readouts, Graph, useTx, num, COLORS } from '../SimKit.jsx';
import { Axes, planeScale, curvePath, PlaneClip, Dot } from './MathKit.jsx';

const DEG = Math.PI / 180;
// Guaraníes siempre con todos los dígitos (1 276 281), nunca en notación científica.
const gs = value => new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).formatToParts(value).map(part => (part.type === 'group' ? ' ' : part.value)).join('');

// Coeficiente delante de x: "x" en vez de "1x" y "−x" en vez de "−1x".
const k = a => (a === 1 ? '' : a === -1 ? '−' : num(a));
const FAMILIES = {
  lineal: { f: (x, a, b) => a * x + b, eq: (a, b) => `f(x) = ${k(a)}x ${b < 0 ? '−' : '+'} ${num(Math.abs(b))}` },
  cuadratica: { f: (x, a, b, c) => a * x * x + b * x + c, eq: (a, b, c) => `f(x) = ${k(a)}x² ${b < 0 ? '−' : '+'} ${k(Math.abs(b)) || ''}x ${c < 0 ? '−' : '+'} ${num(Math.abs(c))}` },
  exponencial: { f: (x, a, b) => a * b ** x, eq: (a, b) => `f(x) = ${num(a)} · ${num(b)}ˣ` },
  logaritmica: { f: (x, a, b) => (x > 0 ? a * Math.log(x) / Math.log(b) : NaN), eq: (a, b) => `f(x) = ${num(a)} · log_${num(b)}(x)` },
  seno: { f: (x, a, b, c) => a * Math.sin(b * x) + c, eq: (a, b, c) => `f(x) = ${num(a)} · sen(${num(b)}x) ${c < 0 ? '−' : '+'} ${num(Math.abs(c))}` },
  modulo: { f: (x, a, b) => a * Math.abs(x - b), eq: (a, b) => `f(x) = ${num(a)} · |x ${b < 0 ? '+' : '−'} ${num(Math.abs(b))}|` },
  entera: { f: (x, a) => a * Math.floor(x), eq: a => `f(x) = ${num(a)} · ⌊x⌋` },
};

function Families() {
  const tx = useTx();
  const [kind, setKind] = useState('cuadratica');
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const [x0, setX0] = useState(1);
  const fam = FAMILIES[kind];
  const params = kind === 'exponencial' ? [a, Math.max(0.2, Math.abs(b) || 2)] : kind === 'logaritmica' ? [a, Math.abs(b) > 1.05 ? Math.abs(b) : 2] : [a, b, c];
  const f = x => fam.f(x, ...params);
  const s = planeScale({ width: 640, height: 380, xMin: -6, xMax: 6, yMin: -8, yMax: 8 });
  const y0 = f(x0);
  // Características que el MEC pide leer en el gráfico.
  let vertex = null, zeros = '—', domain = 'ℝ', range = 'ℝ', growth = '';
  if (kind === 'lineal') { zeros = a ? num(-b / a) : (b ? tx('ninguno', 'mavave') : 'ℝ'); range = a ? 'ℝ' : `{${num(b)}}`; growth = a > 0 ? tx('creciente', 'okakuaáva') : a < 0 ? tx('decreciente', 'oguejyva') : tx('constante', 'constante'); }
  if (kind === 'cuadratica') {
    const xv = -b / (2 * a), yv = f(xv); vertex = [xv, yv];
    const disc = b * b - 4 * a * c;
    zeros = disc < 0 ? tx('no corta al eje x', 'ndokytĩri eje x') : disc === 0 ? num(xv) : `${num((-b - Math.sqrt(disc)) / (2 * a))} ; ${num((-b + Math.sqrt(disc)) / (2 * a))}`;
    range = a > 0 ? `[${num(yv)}, +∞)` : `(−∞, ${num(yv)}]`;
    growth = a > 0 ? tx(`decrece hasta x = ${num(xv)} y después crece`, `oguejy x = ${num(xv)} peve ha upéi okakuaa`) : tx(`crece hasta x = ${num(xv)} y después decrece`, `okakuaa x = ${num(xv)} peve ha upéi oguejy`);
  }
  if (kind === 'exponencial') { range = a > 0 ? '(0, +∞)' : '(−∞, 0)'; zeros = tx('ninguno (asíntota y = 0)', 'mavave (asíntota y = 0)'); growth = (params[1] > 1) === (a > 0) ? tx('creciente', 'okakuaáva') : tx('decreciente', 'oguejyva'); }
  if (kind === 'logaritmica') { domain = '(0, +∞)'; zeros = '1'; growth = a > 0 ? tx('creciente', 'okakuaáva') : tx('decreciente', 'oguejyva'); }
  if (kind === 'seno') { range = `[${num(c - Math.abs(a))}, ${num(c + Math.abs(a))}]`; growth = tx(`periódica, período ${num((2 * Math.PI) / Math.abs(b || 1))}`, `periódica, período ${num((2 * Math.PI) / Math.abs(b || 1))}`); }
  if (kind === 'modulo') { vertex = [b, 0]; range = a > 0 ? '[0, +∞)' : '(−∞, 0]'; zeros = num(b); }
  if (kind === 'entera') { range = tx('múltiplos enteros de a', 'a múltiplo entero'); growth = tx('escalonada (discontinua en cada entero)', 'escalonada'); }
  const parity = [1, 2, 3].every(t => Math.abs(f(t) - f(-t)) < 1e-9) ? tx('par', 'par') : [1, 2, 3].every(t => Math.abs(f(t) + f(-t)) < 1e-9) ? tx('impar', 'impar') : tx('ni par ni impar', 'ndaha’éi par ni impar');
  const usesC = kind === 'cuadratica' || kind === 'seno';
  const bLabel = { lineal: tx('b (ordenada al origen)', 'b (ordenada al origen)'), cuadratica: 'b', exponencial: tx('base', 'base'), logaritmica: tx('base', 'base'), seno: tx('b (frecuencia)', 'b (frecuencia)'), modulo: tx('desplazamiento', 'desplazamiento') }[kind];
  return <Sim
    title={tx('Funciones y sus gráficos', 'Función ha igráfico')}
    subtitle={fam.eq(...params)}
    actions={<Choice options={[['lineal', tx('Lineal', 'Lineal')], ['cuadratica', tx('Cuadrática', 'Cuadrática')], ['exponencial', 'Exp.'], ['logaritmica', 'Log'], ['seno', tx('Seno', 'Seno')], ['modulo', tx('Módulo', 'Módulo')], ['entera', tx('Parte entera', 'Parte entera')]].map(([id, label]) => ({ id, label }))} value={kind} onChange={setKind} />}
    controls={<>
      <Slider label="a" value={a} min={-3} max={3} step={0.25} onChange={value => setA(value || 0.25)} />
      {kind !== 'entera' && <Slider label={bLabel} value={b} min={-5} max={5} step={0.5} onChange={setB} />}
      {usesC && <Slider label="c" value={c} min={-5} max={5} step={0.5} onChange={setC} />}
      <Slider label={tx('Punto x₀', 'Punto x₀')} value={x0} min={-5.5} max={5.5} step={0.1} onChange={setX0} digits={1} />
    </>}
    readouts={<Readouts items={[
      { label: `f(${num(x0, 1)})`, value: Number.isFinite(y0) ? y0 : tx('no existe', 'ndaipóri'), tone: 'red' },
      { label: tx('Dominio', 'Dominio'), value: domain, tone: 'blue' },
      { label: tx('Rango', 'Rango'), value: range, tone: 'blue' },
      { label: tx('Ceros', 'Cero'), value: zeros, tone: 'green' },
      vertex && { label: tx('Vértice', 'Vértice'), value: `(${num(vertex[0])}, ${num(vertex[1])})`, tone: 'violet' },
      { label: tx('Paridad', 'Paridad'), value: parity, tone: 'amber' },
      growth && { label: tx('Variación', 'Variación'), value: growth, tone: 'amber' },
    ]} />}
    footer={tx('Mové a, b y c y mirá cómo cambian el dominio, el rango, los ceros y el vértice. El punto rojo es (x₀, f(x₀)).', 'Emongu’e a, b ha c ha ehecha mba’éichapa okambia dominio, rango, cero ha vértice.')}
  >
    <Stage width={640} height={380} grid={false} label={fam.eq(...params)}>
      <PlaneClip id="fn-clip" s={s} />
      <Axes s={s} />
      <path d={curvePath(f, s, { steps: kind === 'entera' ? 1200 : 480 })} fill="none" stroke={COLORS.blue} strokeWidth="3" clipPath="url(#fn-clip)" />
      {vertex && Number.isFinite(vertex[1]) && Math.abs(vertex[1]) < 8 && <Dot x={s.sx(vertex[0])} y={s.sy(vertex[1])} color={COLORS.violet} label="V" />}
      {Number.isFinite(y0) && Math.abs(y0) < 8 && <>
        <line x1={s.sx(x0)} y1={s.sy(0)} x2={s.sx(x0)} y2={s.sy(y0)} stroke={COLORS.red} strokeDasharray="4 4" />
        <Dot x={s.sx(x0)} y={s.sy(y0)} color={COLORS.red} label={`(${num(x0, 1)}; ${num(y0, 1)})`} />
      </>}
    </Stage>
  </Sim>;
}

function TrigFormulas() {
  const tx = useTx();
  const [a, setA] = useState(45);
  const [b, setB] = useState(30);
  const sa = Math.sin(a * DEG), ca = Math.cos(a * DEG), sb = Math.sin(b * DEG), cb = Math.cos(b * DEG);
  const formula = sa * cb + ca * sb;
  const wrong = sa + sb;
  const points = fn => Array.from({ length: 181 }, (_, i) => [i * 2, fn(i * 2 * DEG)]);
  return <Sim
    title={tx('Fórmulas trigonométricas', 'Trigonometría fórmula')}
    subtitle={tx('sen(a + b) = sen a · cos b + cos a · sen b. Ojo: no es sen a + sen b.', 'sen(a + b) = sen a · cos b + cos a · sen b. Ndaha’éi sen a + sen b.')}
    controls={<>
      <Slider label="a" value={a} min={0} max={180} step={5} unit="°" onChange={setA} digits={0} />
      <Slider label="b" value={b} min={0} max={180} step={5} unit="°" onChange={setB} digits={0} />
    </>}
    readouts={<Readouts items={[
      { label: 'sen a', value: sa, digits: 4, tone: 'blue' },
      { label: 'cos b', value: cb, digits: 4, tone: 'blue' },
      { label: tx('sen(a + b) por fórmula', 'sen(a + b) fórmula'), value: formula, digits: 4, tone: 'green' },
      { label: tx('sen(a + b) directo', 'sen(a + b) directo'), value: Math.sin((a + b) * DEG), digits: 4, tone: 'green' },
      { label: tx('sen a + sen b (¡error común!)', 'sen a + sen b (javy)'), value: wrong, digits: 4, tone: 'red' },
      { label: 'sen 2a = 2 sen a cos a', value: 2 * sa * ca, digits: 4, tone: 'violet' },
    ]} />}
    graphs={<Graph title={tx('Seno y coseno de 0° a 360°', 'Seno ha coseno 0° guive 360° peve')} xLabel="x (°)" yLabel="y" xMin={0} xMax={360} yMin={-1.2} yMax={1.2}
      series={[{ points: points(Math.sin), color: COLORS.blue, label: 'sen x' }, { points: points(Math.cos), color: COLORS.amber, label: 'cos x', dashed: true }]}
      marker={[Math.min(360, a + b), Math.sin((a + b) * DEG)]} />}
    footer="sen(a ± b) = sen a cos b ± cos a sen b ; cos(a ± b) = cos a cos b ∓ sen a sen b ; sen 2a = 2 sen a cos a"
  >
    <Stage width={640} height={260} grid={false} label={tx('Comparación de valores', 'Valor ñembojoja')}>
      {[[tx('fórmula', 'fórmula'), formula, COLORS.green], [tx('directo', 'directo'), Math.sin((a + b) * DEG), COLORS.green], ['sen a + sen b', wrong, COLORS.red]].map(([label, value, color], i) => {
        const x = 120 + i * 180, base = 150, h = value * 60;
        return <g key={label}>
          <rect x={x - 32} y={h >= 0 ? base - h : base} width="64" height={Math.abs(h)} rx="8" fill={color} opacity={i === 2 ? 0.75 : 0.9} />
          <text x={x} y={base + (h >= 0 ? 22 : -Math.abs(h) - 10 + 0)} textAnchor="middle" className="sim-label">{label}</text>
          <text x={x} y={h >= 0 ? base - h - 8 : base + Math.abs(h) + 18} textAnchor="middle" className="sim-label" fill={color}>{num(value, 3)}</text>
        </g>;
      })}
      <line x1="40" y1="150" x2="600" y2="150" stroke="#1b2a41" strokeOpacity=".5" />
      <line x1="40" y1="90" x2="600" y2="90" stroke="#1b2a41" strokeOpacity=".2" strokeDasharray="4 4" />
      <text x="600" y="86" textAnchor="end" className="sim-tick">y = 1</text>
    </Stage>
  </Sim>;
}

function Growth() {
  const tx = useTx();
  const [capital, setCapital] = useState(500000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const i = rate / 100;
  const compound = t => capital * (1 + i) ** t;
  const simple = t => capital * (1 + i * t);
  const series = fn => Array.from({ length: years * 4 + 1 }, (_, k) => [k / 4, fn(k / 4)]);
  const doubling = Math.log(2) / Math.log(1 + i);
  return <Sim
    title={tx('Interés compuesto y logaritmos', 'Interés compuesto ha logaritmo')}
    subtitle={tx('El dinero crece en forma exponencial: M = C · (1 + i)ⁿ. El logaritmo dice cuánto tiempo hace falta.', 'Pirapire okakuaa exponencial-icha: M = C · (1 + i)ⁿ. Logaritmo he’i mboy tiempo tekotevẽ.')}
    controls={<>
      <Slider label={tx('Capital inicial', 'Capital inicial')} value={capital} min={100000} max={2000000} step={50000} unit="Gs" onChange={setCapital} digits={0} />
      <Slider label={tx('Tasa anual', 'Tasa anual')} value={rate} min={1} max={20} step={0.5} unit="%" onChange={setRate} digits={1} />
      <Slider label={tx('Años', 'Ary')} value={years} min={1} max={30} step={1} onChange={setYears} digits={0} />
    </>}
    readouts={<Readouts items={[
      { label: tx('Monto con interés compuesto', 'Monto interés compuesto'), value: gs(compound(years)), unit: 'Gs', tone: 'green' },
      { label: tx('Monto con interés simple', 'Monto interés simple'), value: gs(simple(years)), unit: 'Gs', tone: 'blue' },
      { label: tx('Diferencia', 'Diferencia'), value: gs(compound(years) - simple(years)), unit: 'Gs', tone: 'violet' },
      { label: tx('Años para duplicar', 'Ary oñemokõi hag̃ua'), value: doubling, unit: tx('años', 'ary'), tone: 'amber', digits: 1 },
    ]} />}
    footer={tx('Años para duplicar: n = log 2 / log(1 + i). Por ejemplo, al 8 % anual el dinero se duplica en unos 9 años.', 'Ary oñemokõi hag̃ua: n = log 2 / log(1 + i).')}
  >
    <Graph title={tx('Monto (Gs) a lo largo de los años', 'Monto (Gs) ary ha ary')} xLabel={tx('años', 'ary')} yLabel="Gs" xMin={0} xMax={years} height={300}
      series={[{ points: series(compound), color: COLORS.green, label: tx('compuesto', 'compuesto') }, { points: series(simple), color: COLORS.blue, label: tx('simple', 'simple'), dashed: true }]}
      marker={[years, compound(years)]} markerColor={COLORS.green} />
  </Sim>;
}

export default function FunctionSim({ mode = 'families' }) {
  if (mode === 'trig') return <TrigFormulas />;
  if (mode === 'growth') return <Growth />;
  return <Families />;
}
