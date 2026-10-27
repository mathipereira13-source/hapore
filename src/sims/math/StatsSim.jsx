// Estadística con datos de ejemplo (generados, no son estadísticas oficiales):
// tablas de frecuencia con histograma, gráfico circular y ojiva; medidas de
// posición y dispersión (con un valor extremo que mueve la media pero casi no
// la mediana); y regresión lineal por mínimos cuadrados con su correlación.
import { useMemo, useState } from 'react';
import { Sim, Stage, Slider, Choice, Readouts, useTx, num, INK, COLORS } from '../SimKit.jsx';
import { Axes, planeScale, Dot } from './MathKit.jsx';
import { seededRandom } from '../../curriculum/practice.js';

const PALETTE = [COLORS.blue, COLORS.red, COLORS.amber, COLORS.green, COLORS.violet, COLORS.sky, COLORS.earth, COLORS.sun];

const DATASETS = {
  temperaturas: { es: 'Temperaturas máximas de 30 días (°C)', gn: '30 ára temperatura máxima (°C)', unit: '°C', make: rng => Array.from({ length: 30 }, () => Math.round(24 + rng() * 10 + rng() * 6)) },
  viaje: { es: 'Minutos de viaje al colegio (40 alumnos)', gn: 'Colegio peve minuto (40 temimbo’e)', unit: 'min', make: rng => Array.from({ length: 40 }, () => Math.round(5 + rng() * 25 + (rng() < 0.2 ? rng() * 25 : 0))) },
  notas: { es: 'Puntajes de una prueba sobre 50 (35 alumnos)', gn: 'Prueba puntaje 50-gui (35 temimbo’e)', unit: 'pts', make: rng => Array.from({ length: 35 }, () => Math.round(18 + rng() * 20 + rng() * 12)) },
};

const quantile = (sorted, q) => {
  const pos = (sorted.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
};

function Frequency() {
  const tx = useTx();
  const [set, setSet] = useState('temperaturas');
  const [k, setK] = useState(5);
  const [chart, setChart] = useState('histograma');
  const data = useMemo(() => DATASETS[set].make(seededRandom(set.length * 97 + 11)), [set]);
  const min = Math.min(...data), max = Math.max(...data);
  const width = Math.ceil((max - min + 1) / k);
  const classes = Array.from({ length: k }, (_, i) => {
    const lo = min + i * width, hi = lo + width;
    const f = data.filter(v => v >= lo && v < hi).length;
    return { lo, hi, f, mark: (lo + hi) / 2 };
  });
  let acc = 0;
  classes.forEach(c => { acc += c.f; c.F = acc; c.fr = c.f / data.length; });
  const maxF = Math.max(...classes.map(c => c.f), 1);
  const X0 = 60, Y0 = 300, PW = 360, PH = 230;
  const bw = PW / k;
  let angle = -Math.PI / 2;
  return <Sim
    title={tx('Tablas de frecuencia y gráficos', 'Frecuencia tabla ha gráfico')}
    subtitle={tx(DATASETS[set].es + ' — datos de ejemplo.', DATASETS[set].gn + ' — dato techapyrã.')}
    actions={<Choice options={[{ id: 'histograma', label: tx('Histograma', 'Histograma') }, { id: 'circular', label: tx('Circular', 'Circular') }, { id: 'ojiva', label: tx('Ojiva', 'Ojiva') }]} value={chart} onChange={setChart} />}
    controls={<>
      <Choice label={tx('Datos', 'Dato')} options={Object.keys(DATASETS).map(id => ({ id, label: { temperaturas: tx('Temperaturas', 'Temperatura'), viaje: tx('Viaje', 'Viaje'), notas: tx('Puntajes', 'Puntaje') }[id] }))} value={set} onChange={setSet} />
      <Slider label={tx('Cantidad de intervalos k', 'Intervalo papapy k')} value={k} min={3} max={8} step={1} onChange={setK} digits={0} />
    </>}
    readouts={<Readouts items={[
      { label: 'n', value: data.length, tone: 'blue', digits: 0 },
      { label: tx('Mínimo – máximo', 'Mínimo – máximo'), value: `${min} – ${max}`, tone: 'blue' },
      { label: tx('Tamaño del intervalo', 'Intervalo tuichakue'), value: width, tone: 'amber', digits: 0 },
      { label: tx('Clase con más datos', 'Clase hetavéva'), value: (() => { const c = classes.reduce((a, b) => (b.f > a.f ? b : a)); return `[${c.lo}, ${c.hi})`; })(), tone: 'green' },
    ]} />}
    footer={tx('f = frecuencia absoluta; fᵣ = f/n; % = fᵣ·100; F = acumulada. La marca de clase es el punto medio del intervalo.', 'f = absoluta; fᵣ = f/n; % = fᵣ·100; F = acumulada.')}
  >
    <Stage width={640} height={340} label={tx('Gráfico estadístico', 'Gráfico estadístico')}>
      {chart === 'histograma' && <>
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke={INK} strokeOpacity=".6" />
        {classes.map((c, i) => <g key={i}>
          <rect x={X0 + i * bw} y={Y0 - (c.f / maxF) * PH} width={bw - 1} height={(c.f / maxF) * PH} fill={COLORS.blue} opacity=".8" />
          <text x={X0 + i * bw + bw / 2} y={Y0 - (c.f / maxF) * PH - 6} textAnchor="middle" className="sim-label-small">{c.f}</text>
          <text x={X0 + i * bw} y={Y0 + 14} textAnchor="middle" className="sim-tick">{c.lo}</text>
        </g>)}
        <text x={X0 + PW} y={Y0 + 14} textAnchor="middle" className="sim-tick">{classes.at(-1).hi}</text>
        <polyline points={classes.map((c, i) => `${X0 + i * bw + bw / 2},${Y0 - (c.f / maxF) * PH}`).join(' ')} fill="none" stroke={COLORS.red} strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 30} textAnchor="end" className="sim-axis">{DATASETS[set].unit}</text>
      </>}
      {chart === 'circular' && classes.map((c, i) => {
        const sweep = c.fr * Math.PI * 2;
        const a0 = angle, a1 = angle + sweep; angle = a1;
        const cx = 230, cy = 170, R = 130;
        const large = sweep > Math.PI ? 1 : 0;
        const mid = (a0 + a1) / 2;
        return c.f ? <g key={i}>
          <path d={`M${cx},${cy} L${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 ${large} 1 ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} Z`} fill={PALETTE[i % PALETTE.length]} stroke="#fff" strokeWidth="2" />
          <text x={cx + R * 0.65 * Math.cos(mid)} y={cy + R * 0.65 * Math.sin(mid) + 4} textAnchor="middle" className="sim-label-small" fill="#fff">{num(c.fr * 100, 0)}%</text>
        </g> : null;
      })}
      {chart === 'ojiva' && <>
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke={INK} strokeOpacity=".6" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke={INK} strokeOpacity=".6" />
        <polyline points={[`${X0},${Y0}`, ...classes.map((c, i) => `${X0 + (i + 1) * bw},${Y0 - (c.F / data.length) * PH}`)].join(' ')} fill="none" stroke={COLORS.green} strokeWidth="3" />
        {classes.map((c, i) => <Dot key={i} x={X0 + (i + 1) * bw} y={Y0 - (c.F / data.length) * PH} color={COLORS.green} r={4} />)}
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" className="sim-tick">{data.length}</text>
      </>}
      {/* Tabla de frecuencias */}
      <g transform="translate(440 30)" style={{ font: '700 11.5px var(--font, system-ui)' }}>
        {[tx('Clase', 'Clase'), 'f', 'fᵣ', 'F'].map((h, j) => <text key={h} x={[0, 78, 108, 152][j]} y="0" className="sim-axis">{h}</text>)}
        {classes.map((c, i) => <g key={i} transform={`translate(0 ${20 + i * 20})`}>
          <rect x="-6" y="-13" width="190" height="18" rx="4" fill={i % 2 ? '#f1f5f9' : '#fff'} />
          <text x="0" y="0" fill={INK}>[{c.lo}, {c.hi})</text>
          <text x="78" y="0" fill={INK}>{c.f}</text>
          <text x="108" y="0" fill={INK}>{num(c.fr, 2)}</text>
          <text x="152" y="0" fill={INK}>{c.F}</text>
        </g>)}
      </g>
    </Stage>
  </Sim>;
}

function Measures() {
  const tx = useTx();
  const [extra, setExtra] = useState(0);
  const base = useMemo(() => [4, 5, 5, 6, 6, 6, 7, 7, 8, 8, 9, 10], []);
  const data = extra ? [...base, extra] : base;
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length, mean = data.reduce((a, b) => a + b, 0) / n;
  const median = quantile(sorted, 0.5);
  const counts = data.reduce((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {});
  const top = Math.max(...Object.values(counts));
  const mode = Object.keys(counts).filter(v => counts[v] === top).join(' ; ');
  const sd = Math.sqrt(data.reduce((a, v) => a + (v - mean) ** 2, 0) / n);
  const q1 = quantile(sorted, 0.25), q3 = quantile(sorted, 0.75);
  // La escala se ajusta a los datos (y al día extraordinario si lo hay).
  const s = planeScale({ width: 640, height: 240, xMin: 0, xMax: Math.max(14, sorted.at(-1) + 2), yMin: 0, yMax: 6 });
  const stacks = {};
  return <Sim
    title={tx('Medidas de posición y de dispersión', 'Posición ha dispersión medida')}
    subtitle={tx('Kilos de residuos reciclados por día en una escuela (datos de ejemplo). Agregá un día extraordinario y mirá qué medida cambia más.', 'Escuela residuo reciclado kilo (dato techapyrã). Emoĩ peteĩ ára iñambuéva ha ehecha mávapa okambiave.')}
    controls={<Slider label={tx('Día extraordinario (0 = sin él)', 'Ára iñambuéva (0 = ndaipóri)')} value={extra} min={0} max={38} step={1} unit="kg" onChange={setExtra} digits={0} />}
    readouts={<Readouts items={[
      { label: tx('Media x̄', 'Media x̄'), value: mean, unit: 'kg', tone: 'red' },
      { label: tx('Mediana', 'Mediana'), value: median, unit: 'kg', tone: 'green' },
      { label: tx('Moda', 'Moda'), value: mode, unit: 'kg', tone: 'amber' },
      { label: tx('Cuartiles Q₁ – Q₃', 'Cuartil Q₁ – Q₃'), value: `${num(q1)} – ${num(q3)}`, tone: 'violet' },
      { label: tx('Rango', 'Rango'), value: sorted.at(-1) - sorted[0], unit: 'kg', tone: 'blue' },
      { label: tx('Desviación típica σ', 'Desviación típica σ'), value: sd, unit: 'kg', tone: 'blue' },
    ]} />}
    footer={tx('Un valor muy alto arrastra la media pero casi no mueve la mediana: por eso para sueldos o precios se prefiere la mediana.', 'Valor yvatetereí ogueraha media, mediana katu nomýiri.')}
  >
    <Stage width={640} height={240} grid={false} label={tx('Diagrama de puntos', 'Punto diagrama')}>
      <Axes s={s} xLabel="kg" yLabel="" yStep={10} />
      {data.map((v, i) => { stacks[v] = (stacks[v] ?? 0) + 1; return <circle key={i} cx={s.sx(v)} cy={s.sy(0) - stacks[v] * 16} r="6.5" fill={v === extra && i === data.length - 1 ? COLORS.red : COLORS.blue} />; })}
      <line x1={s.sx(mean)} y1={s.sy(0)} x2={s.sx(mean)} y2={30} stroke={COLORS.red} strokeWidth="2.4" />
      <text x={s.sx(mean) + 4} y={28} className="sim-label" fill={COLORS.red}>x̄</text>
      <line x1={s.sx(median)} y1={s.sy(0)} x2={s.sx(median)} y2={44} stroke={COLORS.green} strokeWidth="2.4" strokeDasharray="5 4" />
      <text x={s.sx(median) - 4} y={42} textAnchor="end" className="sim-label" fill={COLORS.green}>Me</text>
      <rect x={s.sx(q1)} y={s.sy(0) + 8} width={Math.max(1, s.sx(q3) - s.sx(q1))} height="12" fill="rgba(112,71,235,.25)" stroke={COLORS.violet} />
    </Stage>
  </Sim>;
}

function Regression() {
  const tx = useTx();
  const [noise, setNoise] = useState(3);
  const [seed, setSeed] = useState(7);
  const [xp, setXp] = useState(5);
  const pts = useMemo(() => {
    const rng = seededRandom(seed);
    return Array.from({ length: 10 }, (_, i) => { const x = 1 + (i * 7) / 9 + rng() * 0.4; return [x, Math.min(50, Math.max(0, 14 + 4.2 * x + (rng() * 2 - 1) * noise * 2))]; });
  }, [noise, seed]);
  const n = pts.length;
  const mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n;
  const sxy = pts.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0);
  const sxx = pts.reduce((a, p) => a + (p[0] - mx) ** 2, 0), syy = pts.reduce((a, p) => a + (p[1] - my) ** 2, 0);
  const b = sxy / sxx, a = my - b * mx, r = sxy / Math.sqrt(sxx * syy);
  const s = planeScale({ width: 640, height: 380, xMin: 0, xMax: 10, yMin: 0, yMax: 60 });
  const strength = Math.abs(r) > 0.9 ? tx('muy fuerte', 'mbaretetereí') : Math.abs(r) > 0.7 ? tx('fuerte', 'mbarete') : Math.abs(r) > 0.4 ? tx('moderada', 'moderada') : tx('débil', 'kangy');
  return <Sim
    title={tx('Regresión y correlación lineal', 'Regresión ha correlación lineal')}
    subtitle={tx('Horas de estudio (x) y puntaje en una prueba sobre 60 (y) de 10 alumnos — datos de ejemplo.', 'Estudio aravo (x) ha prueba puntaje (y) — dato techapyrã.')}
    controls={<>
      <Slider label={tx('Dispersión de los datos', 'Dato dispersión')} value={noise} min={0} max={8} step={0.5} onChange={setNoise} />
      <Slider label={tx('Otra muestra', 'Ambue muestra')} value={seed} min={1} max={30} step={1} onChange={setSeed} digits={0} />
      <Slider label={tx('Estimar para x horas', 'Ejeestima x aravo-pe')} value={xp} min={0} max={10} step={0.5} unit="h" onChange={setXp} />
    </>}
    readouts={<Readouts items={[
      { label: tx('Recta de regresión', 'Regresión recta'), value: `y = ${num(a)} + ${num(b)}x`, tone: 'green' },
      { label: tx('Pendiente b', 'Pendiente b'), value: b, digits: 3, tone: 'green' },
      { label: tx('Coeficiente r', 'Coeficiente r'), value: r, digits: 3, tone: 'amber' },
      { label: tx('Relación', 'Relación'), value: strength, tone: 'amber' },
      { label: tx(`Estimación para ${num(xp)} h`, `${num(xp)} h-pe g̃uarã`), value: a + b * xp, tone: 'red' },
    ]} />}
    footer="b = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)² ; a = ȳ − b·x̄ ; r = Σ(x − x̄)(y − ȳ) / √(Σ(x − x̄)² · Σ(y − ȳ)²)"
  >
    <Stage width={640} height={380} grid={false} label={tx('Diagrama de dispersión', 'Dispersión diagrama')}>
      <Axes s={s} xLabel={tx('horas', 'aravo')} yLabel={tx('puntaje', 'puntaje')} />
      {pts.map(([x, y], i) => <line key={`e${i}`} x1={s.sx(x)} y1={s.sy(y)} x2={s.sx(x)} y2={s.sy(a + b * x)} stroke={COLORS.red} strokeOpacity=".35" />)}
      <line x1={s.sx(0)} y1={s.sy(a)} x2={s.sx(10)} y2={s.sy(a + b * 10)} stroke={COLORS.green} strokeWidth="3" />
      {pts.map(([x, y], i) => <circle key={i} cx={s.sx(x)} cy={s.sy(y)} r="6" fill={COLORS.blue} stroke="#fff" strokeWidth="1.5" />)}
      <Dot x={s.sx(mx)} y={s.sy(my)} color={COLORS.violet} label="(x̄; ȳ)" />
      <Dot x={s.sx(xp)} y={s.sy(a + b * xp)} color={COLORS.red} label={num(a + b * xp, 1)} />
    </Stage>
  </Sim>;
}

export default function StatsSim({ mode = 'frequency' }) {
  if (mode === 'measures') return <Measures />;
  if (mode === 'regression') return <Regression />;
  return <Frequency />;
}
