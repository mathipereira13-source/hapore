// Geometría analítica: distancia, punto medio y pendiente entre dos puntos;
// rectas (paralelas, perpendiculares, ángulo entre ellas y distancia de un
// punto a una recta); y sistemas 2 × 2 resueltos por la regla de Cramer.
import { useState } from 'react';
import { Sim, Stage, Slider, Readouts, Toggle, Verdict, useTx, num, COLORS } from '../SimKit.jsx';
import { Axes, planeScale, curvePath, PlaneClip, Dot } from './MathKit.jsx';

const DEG = Math.PI / 180;
const W = 640, H = 420;
const plane = () => planeScale({ width: W, height: H, xMin: -8, xMax: 8, yMin: -6, yMax: 6 });
const lineEq = (m, b) => `y = ${num(m)}x ${b < 0 ? '−' : '+'} ${num(Math.abs(b))}`;

function Points() {
  const tx = useTx();
  const [x1, setX1] = useState(-4);
  const [y1, setY1] = useState(-2);
  const [x2, setX2] = useState(4);
  const [y2, setY2] = useState(4);
  const [x3, setX3] = useState(5);
  const [y3, setY3] = useState(-3);
  const [triangle, setTriangle] = useState(false);
  const s = plane();
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const slope = x2 === x1 ? null : (y2 - y1) / (x2 - x1);
  const incl = slope === null ? 90 : ((Math.atan(slope) / DEG) + 180) % 180;
  const area = Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
  return <Sim
    title={tx('Distancia, punto medio y pendiente', 'Distancia, punto medio ha pendiente')}
    subtitle={tx('Un plano del barrio: 1 unidad = 100 m. Mové A y B (y C para un terreno triangular).', 'Barrio plano: 1 unidad = 100 m. Emongu’e A ha B (ha C terreno triangular-pe).')}
    controls={<>
      <Slider label="A: x₁" value={x1} min={-7} max={7} step={1} onChange={setX1} digits={0} />
      <Slider label="A: y₁" value={y1} min={-5} max={5} step={1} onChange={setY1} digits={0} />
      <Slider label="B: x₂" value={x2} min={-7} max={7} step={1} onChange={setX2} digits={0} />
      <Slider label="B: y₂" value={y2} min={-5} max={5} step={1} onChange={setY2} digits={0} />
      <Toggle label={tx('Agregar C (área de un triángulo)', 'Emoĩ C (triángulo área)')} checked={triangle} onChange={setTriangle} />
      {triangle && <>
        <Slider label="C: x₃" value={x3} min={-7} max={7} step={1} onChange={setX3} digits={0} />
        <Slider label="C: y₃" value={y3} min={-5} max={5} step={1} onChange={setY3} digits={0} />
      </>}
    </>}
    readouts={<Readouts items={[
      { label: tx('Distancia AB', 'Distancia AB'), value: `${num(dist)} u = ${num(dist * 100, 0)} m`, tone: 'green' },
      { label: tx('Punto medio M', 'Punto medio M'), value: `(${num(mx)}; ${num(my)})`, tone: 'violet' },
      { label: tx('Pendiente m', 'Pendiente m'), value: slope === null ? tx('vertical (no existe)', 'vertical (ndaipóri)') : slope, tone: 'blue' },
      { label: tx('Ángulo de inclinación', 'Ángulo de inclinación'), value: incl, unit: '°', tone: 'amber', digits: 1 },
      triangle && { label: tx('Área ABC', 'Área ABC'), value: `${num(area)} u² = ${num(area * 10000, 0)} m²`, tone: 'red' },
    ]} />}
    footer="d = √((x₂ − x₁)² + (y₂ − y₁)²) ; M = ((x₁ + x₂)/2, (y₁ + y₂)/2) ; m = (y₂ − y₁)/(x₂ − x₁)"
  >
    <Stage width={W} height={H} grid={false} label={tx('Plano cartesiano', 'Plano cartesiano')}>
      <Axes s={s} />
      {triangle && <polygon points={`${s.sx(x1)},${s.sy(y1)} ${s.sx(x2)},${s.sy(y2)} ${s.sx(x3)},${s.sy(y3)}`} fill="rgba(225,29,72,.12)" stroke={COLORS.red} strokeWidth="1.6" />}
      <line x1={s.sx(x1)} y1={s.sy(y1)} x2={s.sx(x2)} y2={s.sy(y1)} stroke={COLORS.red} strokeDasharray="5 4" strokeWidth="2" />
      <line x1={s.sx(x2)} y1={s.sy(y1)} x2={s.sx(x2)} y2={s.sy(y2)} stroke={COLORS.blue} strokeDasharray="5 4" strokeWidth="2" />
      <text x={(s.sx(x1) + s.sx(x2)) / 2} y={s.sy(y1) + (y2 >= y1 ? 16 : -8)} textAnchor="middle" className="sim-label" fill={COLORS.red}>Δx = {x2 - x1}</text>
      <text x={s.sx(x2) + 6} y={(s.sy(y1) + s.sy(y2)) / 2} className="sim-label" fill={COLORS.blue}>Δy = {y2 - y1}</text>
      <line x1={s.sx(x1)} y1={s.sy(y1)} x2={s.sx(x2)} y2={s.sy(y2)} stroke={COLORS.green} strokeWidth="3.4" />
      <Dot x={s.sx(x1)} y={s.sy(y1)} color={COLORS.green} label={`A(${x1}; ${y1})`} dx={-10} dy={18} />
      <Dot x={s.sx(x2)} y={s.sy(y2)} color={COLORS.green} label={`B(${x2}; ${y2})`} />
      <Dot x={s.sx(mx)} y={s.sy(my)} color={COLORS.violet} label="M" r={4.5} />
      {triangle && <Dot x={s.sx(x3)} y={s.sy(y3)} color={COLORS.red} label={`C(${x3}; ${y3})`} />}
    </Stage>
  </Sim>;
}

function Lines() {
  const tx = useTx();
  const [m1, setM1] = useState(0.5);
  const [b1, setB1] = useState(1);
  const [m2, setM2] = useState(-2);
  const [b2, setB2] = useState(3);
  const [px, setPx] = useState(4);
  const [py, setPy] = useState(-3);
  const s = plane();
  const parallel = Math.abs(m1 - m2) < 1e-9;
  const perpendicular = Math.abs(m1 * m2 + 1) < 1e-9;
  const xi = parallel ? null : (b2 - b1) / (m1 - m2);
  const yi = xi === null ? null : m1 * xi + b1;
  const angle = perpendicular ? 90 : parallel ? 0 : Math.atan(Math.abs((m2 - m1) / (1 + m1 * m2))) / DEG;
  // Distancia de P a la recta 1 escrita como m1·x − y + b1 = 0.
  const dist = Math.abs(m1 * px - py + b1) / Math.hypot(m1, 1);
  const footX = (px + m1 * py - m1 * b1) / (1 + m1 * m1), footY = m1 * footX + b1;
  return <Sim
    title={tx('La línea recta', 'Línea recta')}
    subtitle={tx('Dos planes de telefonía, dos calles o dos caños: compará pendientes, cortes y distancias.', 'Mokõi telefonía plan, mokõi tape térã mokõi caño: embojoja pendiente, ñekytĩ ha distancia.')}
    controls={<>
      <Slider label={tx('Recta 1: pendiente m₁', 'Recta 1: m₁')} value={m1} min={-4} max={4} step={0.25} onChange={setM1} />
      <Slider label={tx('Recta 1: ordenada b₁', 'Recta 1: b₁')} value={b1} min={-5} max={5} step={0.5} onChange={setB1} />
      <Slider label={tx('Recta 2: pendiente m₂', 'Recta 2: m₂')} value={m2} min={-4} max={4} step={0.25} onChange={setM2} />
      <Slider label={tx('Recta 2: ordenada b₂', 'Recta 2: b₂')} value={b2} min={-5} max={5} step={0.5} onChange={setB2} />
      <Slider label={tx('Punto P: x', 'Punto P: x')} value={px} min={-7} max={7} step={0.5} onChange={setPx} />
      <Slider label={tx('Punto P: y', 'Punto P: y')} value={py} min={-5} max={5} step={0.5} onChange={setPy} />
    </>}
    readouts={<Readouts items={[
      { label: tx('Recta 1', 'Recta 1'), value: lineEq(m1, b1), tone: 'blue' },
      { label: tx('Recta 2', 'Recta 2'), value: lineEq(m2, b2), tone: 'red' },
      { label: tx('Se cortan en', 'Oñokytĩ'), value: xi === null ? tx('no se cortan', 'noñokytĩri') : `(${num(xi)}; ${num(yi)})`, tone: 'green' },
      { label: tx('Ángulo entre ellas', 'Ángulo pa’ũme'), value: angle, unit: '°', digits: 1, tone: 'amber' },
      { label: tx('Distancia de P a la recta 1', 'P guive recta 1 peve'), value: dist, tone: 'violet' },
      { label: tx('Corte de la recta 1 con el eje x', 'Recta 1 ñekytĩ eje x'), value: Math.abs(m1) < 1e-9 ? '—' : -b1 / m1, tone: 'blue' },
    ]} />}
    footer="y − y₁ = m(x − x₁) ; paralelas: m₁ = m₂ ; perpendiculares: m₁ · m₂ = −1 ; d = |Ax₀ + By₀ + C| / √(A² + B²)"
  >
    <Stage width={W} height={H} grid={false} label={tx('Dos rectas', 'Mokõi recta')}>
      <PlaneClip id="lines-clip" s={s} />
      <Axes s={s} />
      <g clipPath="url(#lines-clip)">
        <path d={curvePath(x => m1 * x + b1, s, { steps: 240 })} stroke={COLORS.blue} strokeWidth="3.2" fill="none" />
        <path d={curvePath(x => m2 * x + b2, s, { steps: 240 })} stroke={COLORS.red} strokeWidth="3.2" fill="none" />
        <line x1={s.sx(px)} y1={s.sy(py)} x2={s.sx(footX)} y2={s.sy(footY)} stroke={COLORS.violet} strokeWidth="2" strokeDasharray="5 4" />
      </g>
      {xi !== null && Math.abs(xi) < 8 && Math.abs(yi) < 6 && <Dot x={s.sx(xi)} y={s.sy(yi)} color={COLORS.green} label={tx('corte', 'ñekytĩ')} />}
      <Dot x={s.sx(px)} y={s.sy(py)} color={COLORS.violet} label="P" />
    </Stage>
    {(parallel || perpendicular) && <Verdict tone="good">{parallel ? tx('Son paralelas: tienen la misma pendiente y nunca se cortan.', 'Paralela: pendiente peteĩchagua ha noñokytĩri.') : tx('Son perpendiculares: m₁ · m₂ = −1, forman 90°.', 'Perpendicular: m₁ · m₂ = −1, 90°.')}</Verdict>}
  </Sim>;
}

function System() {
  const tx = useTx();
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(1);
  const [c1, setC1] = useState(5);
  const [a2, setA2] = useState(2);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(1);
  const s = plane();
  const D = a1 * b2 - a2 * b1, Dx = c1 * b2 - c2 * b1, Dy = a1 * c2 - a2 * c1;
  const x = D ? Dx / D : null, y = D ? Dy / D : null;
  const fy = (a, b, c) => xv => (b ? (c - a * xv) / b : NaN);
  const vertical = (a, b, c) => (!b && a ? c / a : null);
  const eq = (a, b, c) => `${num(a)}x ${b < 0 ? '−' : '+'} ${num(Math.abs(b))}y = ${num(c)}`;
  return <Sim
    title={tx('Sistemas de ecuaciones y regla de Cramer', 'Sistema ecuación ha Cramer regla')}
    subtitle={tx('Cada ecuación es una recta; la solución es donde se cortan. Δ = 0: no hay solución única.', 'Káda ecuación ha’e recta; solución oñokytĩhápe. Δ = 0: ndaipóri solución peteĩnte.')}
    controls={<>
      {[[tx('Ec. 1: a₁', 'Ec. 1: a₁'), a1, setA1], ['b₁', b1, setB1], ['c₁', c1, setC1], [tx('Ec. 2: a₂', 'Ec. 2: a₂'), a2, setA2], ['b₂', b2, setB2], ['c₂', c2, setC2]].map(([label, value, set]) => <Slider key={label} label={label} value={value} min={-6} max={6} step={1} onChange={set} digits={0} />)}
    </>}
    readouts={<Readouts items={[
      { label: tx('Ecuación 1', 'Ecuación 1'), value: eq(a1, b1, c1), tone: 'blue' },
      { label: tx('Ecuación 2', 'Ecuación 2'), value: eq(a2, b2, c2), tone: 'red' },
      { label: 'Δ = a₁b₂ − a₂b₁', value: D, tone: 'amber' },
      { label: 'Δx = c₁b₂ − c₂b₁', value: Dx, tone: 'amber' },
      { label: 'Δy = a₁c₂ − a₂c₁', value: Dy, tone: 'amber' },
      { label: tx('Solución (x; y)', 'Solución (x; y)'), value: D ? `(${num(x)}; ${num(y)})` : tx('sin solución única', 'ndaipóri solución peteĩnte'), tone: 'green' },
    ]} />}
    footer="x = Δx / Δ ; y = Δy / Δ"
  >
    <Stage width={W} height={H} grid={false} label={tx('Dos rectas del sistema', 'Sistema mokõi recta')}>
      <PlaneClip id="sys-clip" s={s} />
      <Axes s={s} />
      <g clipPath="url(#sys-clip)">
        {vertical(a1, b1, c1) !== null ? <line x1={s.sx(vertical(a1, b1, c1))} y1={s.sy(-6)} x2={s.sx(vertical(a1, b1, c1))} y2={s.sy(6)} stroke={COLORS.blue} strokeWidth="3.2" /> : <path d={curvePath(fy(a1, b1, c1), s, { steps: 240 })} stroke={COLORS.blue} strokeWidth="3.2" fill="none" />}
        {vertical(a2, b2, c2) !== null ? <line x1={s.sx(vertical(a2, b2, c2))} y1={s.sy(-6)} x2={s.sx(vertical(a2, b2, c2))} y2={s.sy(6)} stroke={COLORS.red} strokeWidth="3.2" /> : <path d={curvePath(fy(a2, b2, c2), s, { steps: 240 })} stroke={COLORS.red} strokeWidth="3.2" fill="none" />}
      </g>
      {D !== 0 && Math.abs(x) < 8 && Math.abs(y) < 6 && <Dot x={s.sx(x)} y={s.sy(y)} color={COLORS.green} label={`(${num(x)}; ${num(y)})`} r={6} />}
    </Stage>
    {D === 0 && <Verdict tone="warn">{tx('Δ = 0: las rectas son paralelas (sin solución) o son la misma (infinitas soluciones).', 'Δ = 0: recta paralela térã peteĩchagua.')}</Verdict>}
  </Sim>;
}

export default function AnalyticSim({ mode = 'points' }) {
  if (mode === 'lines') return <Lines />;
  if (mode === 'system') return <System />;
  return <Points />;
}
