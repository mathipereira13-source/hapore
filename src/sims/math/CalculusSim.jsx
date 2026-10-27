// Cálculo: límite con indeterminación 0/0 (la función tiene un "agujero"),
// derivada como límite de rectas secantes que se vuelven tangente, y
// optimización aplicada: la caja de mayor volumen hecha con una chapa.
import { useState } from 'react';
import { Sim, Stage, Slider, Choice, Readouts, Graph, Toggle, useTx, num, INK, COLORS } from '../SimKit.jsx';
import { Axes, planeScale, curvePath, PlaneClip, Dot } from './MathKit.jsx';

const W = 640, H = 400;

function Limit() {
  const tx = useTx();
  const [a, setA] = useState(3);
  const [dist, setDist] = useState(1);
  const [side, setSide] = useState('izq');
  const f = x => (x * x - a * a) / (x - a);
  const x = side === 'izq' ? a - dist : a + dist;
  const s = planeScale({ width: W, height: H, xMin: -2, xMax: 9, yMin: -2, yMax: 16 });
  const table = [1, 0.1, 0.01, 0.001].map(h => [a - h, a + h]);
  return <Sim
    title={tx('Límite de una función: indeterminación 0/0', 'Función límite: indeterminación 0/0')}
    subtitle={tx(`f(x) = (x² − ${a * a}) / (x − ${a}) no existe en x = ${a}, pero se acerca a un valor.`, `f(x) = (x² − ${a * a}) / (x − ${a}) ndaipóri x = ${a}-pe, oñemboja katu peteĩ valor-pe.`)}
    controls={<>
      <Slider label="a" value={a} min={1} max={6} step={1} onChange={setA} digits={0} />
      <Slider label={tx('Distancia a a', 'Distancia a-gui')} value={dist} min={0.01} max={3} step={0.01} onChange={setDist} />
      <Choice options={[{ id: 'izq', label: tx('Por la izquierda', 'Asu gotyo') }, { id: 'der', label: tx('Por la derecha', 'Akatúa gotyo') }]} value={side} onChange={setSide} />
    </>}
    readouts={<Readouts items={[
      { label: 'x', value: x, digits: 3, tone: 'blue' },
      { label: 'f(x)', value: f(x), digits: 4, tone: 'red' },
      { label: tx(`f(${a})`, `f(${a})`), value: tx('no existe (0/0)', 'ndaipóri (0/0)'), tone: 'amber' },
      { label: tx('Límite', 'Límite'), value: 2 * a, tone: 'green' },
      ...table.slice(1).map(([l, r]) => ({ label: `f(${num(l, 3)}) | f(${num(r, 3)})`, value: `${num(f(l), 3)} | ${num(f(r), 3)}`, tone: 'violet' })),
    ]} />}
    footer={tx(`Factorizando: (x − ${a})(x + ${a}) / (x − ${a}) = x + ${a} → ${2 * a}. Los límites laterales coinciden, el límite existe.`, `Factorizando: x + ${a} → ${2 * a}.`)}
  >
    <Stage width={W} height={H} grid={false} label="f(x)">
      <PlaneClip id="lim-clip" s={s} />
      <Axes s={s} />
      <path d={curvePath(f, s, { steps: 400 })} stroke={COLORS.blue} strokeWidth="3.2" fill="none" clipPath="url(#lim-clip)" />
      <circle cx={s.sx(a)} cy={s.sy(2 * a)} r="7" fill="#fff" stroke={COLORS.blue} strokeWidth="3" />
      <line x1={s.sx(x)} y1={s.sy(0)} x2={s.sx(x)} y2={s.sy(f(x))} stroke={COLORS.red} strokeDasharray="4 4" />
      <line x1={s.sx(-2)} y1={s.sy(2 * a)} x2={s.sx(a)} y2={s.sy(2 * a)} stroke={COLORS.green} strokeDasharray="4 4" />
      <Dot x={s.sx(x)} y={s.sy(f(x))} color={COLORS.red} label={`f(x) = ${num(f(x), 3)}`} />
      <text x={s.sx(a) + 10} y={s.sy(2 * a) + 22} className="sim-label" fill={COLORS.green}>{tx('agujero', 'kuára')}: ({a}; {2 * a})</text>
    </Stage>
  </Sim>;
}

const CURVES = {
  cuadratica: { f: x => 0.5 * x * x - 1, d: x => x, label: 'f(x) = ½x² − 1' },
  cubica: { f: x => (x ** 3) / 6 - x, d: x => (x * x) / 2 - 1, label: 'f(x) = x³/6 − x' },
  seno: { f: x => 2 * Math.sin(x), d: x => 2 * Math.cos(x), label: 'f(x) = 2 sen x' },
};

function Tangent() {
  const tx = useTx();
  const [curve, setCurve] = useState('cubica');
  const [x0, setX0] = useState(1);
  const [h, setH] = useState(1.5);
  const [secant, setSecant] = useState(true);
  const { f, d, label } = CURVES[curve];
  const m = d(x0), y0 = f(x0);
  const ms = (f(x0 + h) - y0) / h;
  const s = planeScale({ width: W, height: H, xMin: -5, xMax: 5, yMin: -5, yMax: 5 });
  return <Sim
    title={tx('La derivada: de la secante a la tangente', 'Derivada: secante guive tangente peve')}
    subtitle={tx('Achicá h: la recta secante se convierte en la tangente y su pendiente en f′(x₀).', 'Emomichĩ h: secante oiko tangente ha ipendiente f′(x₀).')}
    actions={<Choice options={Object.keys(CURVES).map(id => ({ id, label: CURVES[id].label }))} value={curve} onChange={setCurve} />}
    controls={<>
      <Slider label="x₀" value={x0} min={-4} max={4} step={0.1} onChange={setX0} digits={1} />
      <Slider label="h" value={h} min={0.01} max={3} step={0.01} onChange={setH} />
      <Toggle label={tx('Mostrar secante', 'Ehechauka secante')} checked={secant} onChange={setSecant} />
    </>}
    readouts={<Readouts items={[
      { label: 'f(x₀)', value: y0, tone: 'blue' },
      { label: tx('Pendiente secante', 'Secante pendiente'), value: ms, digits: 4, tone: 'amber' },
      { label: "f′(x₀)", value: m, digits: 4, tone: 'green' },
      { label: tx('Recta tangente', 'Recta tangente'), value: `y = ${num(m)}x ${y0 - m * x0 < 0 ? '−' : '+'} ${num(Math.abs(y0 - m * x0))}`, tone: 'green' },
      { label: tx('La función en x₀', 'Función x₀-pe'), value: Math.abs(m) < 0.05 ? tx('tangente horizontal (punto crítico)', 'tangente horizontal') : m > 0 ? tx('crece', 'okakuaa') : tx('decrece', 'oguejy'), tone: 'violet' },
    ]} />}
    footer="f′(x₀) = lím (f(x₀ + h) − f(x₀)) / h (h → 0) ; tangente: y = f(x₀) + f′(x₀)(x − x₀)"
  >
    <Stage width={W} height={H} grid={false} label={label}>
      <PlaneClip id="tan-clip" s={s} />
      <Axes s={s} />
      <g clipPath="url(#tan-clip)">
        <path d={curvePath(f, s)} stroke={COLORS.blue} strokeWidth="3.2" fill="none" />
        <path d={curvePath(x => y0 + m * (x - x0), s, { steps: 200 })} stroke={COLORS.green} strokeWidth="2.4" fill="none" />
        {secant && <path d={curvePath(x => y0 + ms * (x - x0), s, { steps: 200 })} stroke={COLORS.amber} strokeWidth="2" strokeDasharray="6 5" fill="none" />}
      </g>
      <Dot x={s.sx(x0)} y={s.sy(y0)} color={COLORS.green} label="P" />
      {secant && Math.abs(f(x0 + h)) < 5 && <Dot x={s.sx(x0 + h)} y={s.sy(f(x0 + h))} color={COLORS.amber} label="Q" />}
    </Stage>
  </Sim>;
}

function Optimize() {
  const tx = useTx();
  const [L, setL] = useState(60);
  const [x, setX] = useState(6);
  const V = cut => cut * (L - 2 * cut) ** 2;
  const best = L / 6;
  const pts = Array.from({ length: 121 }, (_, i) => { const c = (i / 120) * (L / 2); return [c, V(c)]; });
  const scale = 240 / L, X0 = 70, Y0 = 50;
  const inner = (L - 2 * x) * scale;
  return <Sim
    title={tx('Optimización: la caja de mayor volumen', 'Optimización: caja volumen tuichavéva')}
    subtitle={tx('De una chapa cuadrada se cortan cuadrados de lado x en las esquinas y se doblan los bordes. ¿Qué x da el mayor volumen?', 'Chapa cuadrada-gui ojekytĩ cuadrado x esquina-pe. ¿Mba’e x ome’ẽ volumen tuichavéva?')}
    controls={<>
      <Slider label={tx('Lado de la chapa L', 'Chapa lado L')} value={L} min={20} max={80} step={2} unit="cm" onChange={value => { setL(value); setX(c => Math.min(c, value / 2 - 0.5)); }} digits={0} />
      <Slider label={tx('Corte x', 'Corte x')} value={x} min={0.5} max={L / 2 - 0.5} step={0.5} unit="cm" onChange={setX} digits={1} />
    </>}
    readouts={<Readouts items={[
      { label: tx('Volumen V(x)', 'Volumen V(x)'), value: V(x), unit: 'cm³', tone: 'blue', digits: 0 },
      { label: tx('Mejor corte x* = L/6', 'Corte iporãvéva x* = L/6'), value: best, unit: 'cm', tone: 'green', digits: 2 },
      { label: tx('Volumen máximo', 'Volumen máximo'), value: V(best), unit: 'cm³', tone: 'green', digits: 0 },
      { label: "V′(x)", value: (L - 2 * x) * (L - 6 * x), tone: 'violet', digits: 0 },
    ]} />}
    graphs={<Graph title={tx('Volumen según el corte', 'Volumen corte rupi')} xLabel="x (cm)" yLabel="V (cm³)" xMin={0} xMax={L / 2} series={[{ points: pts, color: COLORS.blue }]} marker={[x, V(x)]} />}
    footer="V(x) = x(L − 2x)² ; V′(x) = (L − 2x)(L − 6x) = 0 → x = L/6"
  >
    <Stage width={W} height={330} label={tx('Chapa con las esquinas cortadas', 'Chapa esquina ojekytĩva')}>
      <rect x={X0} y={Y0} width={L * scale} height={L * scale} fill="#cbd5e1" stroke={INK} strokeWidth="2" />
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([i, j]) => <rect key={`${i}${j}`} x={X0 + i * (L - x) * scale} y={Y0 + j * (L - x) * scale} width={x * scale} height={x * scale} fill="#fff" stroke={COLORS.red} strokeDasharray="4 3" />)}
      <rect x={X0 + x * scale} y={Y0 + x * scale} width={inner} height={inner} fill="rgba(29,91,216,.18)" stroke={COLORS.blue} />
      <text x={X0 + (x * scale) / 2} y={Y0 - 6} textAnchor="middle" className="sim-label" fill={COLORS.red}>x</text>
      <text x={X0 + (L * scale) / 2} y={Y0 + L * scale + 20} textAnchor="middle" className="sim-label">L = {L} cm</text>
      {/* Caja armada en perspectiva */}
      {(() => {
        const bw = Math.max(20, inner * 0.9), bh = Math.max(6, x * scale * 1.2), bx = 420, by = 210;
        return <g>
          <polygon points={`${bx},${by} ${bx + bw},${by} ${bx + bw + 40},${by - 30} ${bx + 40},${by - 30}`} fill="rgba(29,91,216,.12)" stroke={COLORS.blue} />
          <rect x={bx} y={by} width={bw} height={bh} fill="rgba(29,91,216,.28)" stroke={COLORS.blue} />
          <polygon points={`${bx + bw},${by} ${bx + bw + 40},${by - 30} ${bx + bw + 40},${by - 30 + bh} ${bx + bw},${by + bh}`} fill="rgba(29,91,216,.2)" stroke={COLORS.blue} />
          <text x={bx + bw / 2} y={by + bh + 22} textAnchor="middle" className="sim-label">{tx('caja', 'caja')}: {num(V(x), 0)} cm³</text>
        </g>;
      })()}
    </Stage>
  </Sim>;
}

export default function CalculusSim({ mode = 'tangent' }) {
  if (mode === 'limit') return <Limit />;
  if (mode === 'optimize') return <Optimize />;
  return <Tangent />;
}
