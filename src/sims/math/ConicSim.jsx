// Secciones cónicas: circunferencia (centro y radio), parábola con su foco y
// directriz (y los rayos de una antena que se reflejan hacia el foco) y
// elipse con focos y excentricidad (la suma de distancias a los focos es 2a).
import { useState } from 'react';
import { Sim, Stage, Slider, Choice, Readouts, Toggle, useTx, num, COLORS } from '../SimKit.jsx';
import { Axes, planeScale, PlaneClip, Dot } from './MathKit.jsx';

const W = 640, H = 420;
const sgn = (v, letter) => (v === 0 ? letter : `(${letter} ${v < 0 ? '+' : '−'} ${num(Math.abs(v))})`);

export default function ConicSim() {
  const tx = useTx();
  const [kind, setKind] = useState('parabola');
  const [h, setH] = useState(0);
  const [k, setK] = useState(-2);
  const [r, setR] = useState(3);
  const [p, setP] = useState(1.5);
  const [a, setA] = useState(5);
  const [b, setB] = useState(3);
  const [rays, setRays] = useState(true);
  const [t, setT] = useState(40);
  const s = planeScale({ width: W, height: H, xMin: -8, xMax: 8, yMin: -6, yMax: 6 });
  const bb = Math.min(b, a);
  const c = Math.sqrt(Math.max(0, a * a - bb * bb));
  const pathOf = fn => Array.from({ length: 361 }, (_, i) => fn((i * Math.PI) / 180)).map(([x, y], i) => `${i ? 'L' : 'M'}${s.sx(x).toFixed(1)},${s.sy(y).toFixed(1)}`).join(' ');
  // Punto sobre la elipse para mostrar d₁ + d₂ = 2a.
  const ex = h + a * Math.cos((t * Math.PI) / 180), ey = k + bb * Math.sin((t * Math.PI) / 180);
  let equation = '', items = [];
  if (kind === 'circulo') {
    equation = `${sgn(h, 'x')}² + ${sgn(k, 'y')}² = ${num(r * r)}`;
    items = [
      { label: tx('Centro', 'Centro'), value: `(${num(h)}; ${num(k)})`, tone: 'violet' },
      { label: tx('Radio', 'Radio'), value: r, tone: 'blue' },
      { label: tx('Perímetro', 'Perímetro'), value: 2 * Math.PI * r, tone: 'green' },
      { label: tx('Área', 'Área'), value: Math.PI * r * r, tone: 'green' },
    ];
  } else if (kind === 'parabola') {
    equation = `${sgn(h, 'x')}² = ${num(4 * p)} · ${sgn(k, 'y')}`;
    items = [
      { label: tx('Vértice', 'Vértice'), value: `(${num(h)}; ${num(k)})`, tone: 'violet' },
      { label: tx('Foco', 'Foco'), value: `(${num(h)}; ${num(k + p)})`, tone: 'red' },
      { label: tx('Directriz', 'Directriz'), value: `y = ${num(k - p)}`, tone: 'amber' },
      { label: tx('Lado recto', 'Lado recto'), value: Math.abs(4 * p), tone: 'blue' },
    ];
  } else {
    equation = `${sgn(h, 'x')}²/${num(a * a)} + ${sgn(k, 'y')}²/${num(bb * bb)} = 1`;
    const d1 = Math.hypot(ex - (h - c), ey - k), d2 = Math.hypot(ex - (h + c), ey - k);
    items = [
      { label: tx('Focos', 'Foco-kuéra'), value: `(${num(h - c)}; ${num(k)}) y (${num(h + c)}; ${num(k)})`, tone: 'red' },
      { label: 'c = √(a² − b²)', value: c, tone: 'blue' },
      { label: tx('Excentricidad e = c/a', 'Excentricidad e = c/a'), value: c / a, digits: 3, tone: 'amber' },
      { label: 'd₁ + d₂', value: `${num(d1)} + ${num(d2)} = ${num(d1 + d2)}`, tone: 'green' },
      { label: '2a', value: 2 * a, tone: 'green' },
    ];
  }
  const parabolaY = x => k + ((x - h) ** 2) / (4 * p);
  const focus = { x: h, y: k + p };
  return <Sim
    title={tx('Secciones cónicas', 'Sección cónica')}
    subtitle={equation}
    actions={<Choice options={[{ id: 'circulo', label: tx('Circunferencia', 'Circunferencia') }, { id: 'parabola', label: tx('Parábola', 'Parábola') }, { id: 'elipse', label: tx('Elipse', 'Elipse') }]} value={kind} onChange={setKind} />}
    controls={<>
      <Slider label={tx('Centro / vértice h', 'Centro / vértice h')} value={h} min={-4} max={4} step={0.5} onChange={setH} />
      <Slider label="k" value={k} min={-4} max={4} step={0.5} onChange={setK} />
      {kind === 'circulo' && <Slider label={tx('Radio r', 'Radio r')} value={r} min={0.5} max={5} step={0.5} onChange={setR} />}
      {kind === 'parabola' && <>
        <Slider label={tx('Distancia focal p', 'Distancia focal p')} value={p} min={-3} max={3} step={0.25} onChange={value => setP(value || 0.25)} />
        <Toggle label={tx('Rayos de una antena', 'Antena rayo')} checked={rays} onChange={setRays} />
      </>}
      {kind === 'elipse' && <>
        <Slider label={tx('Semieje mayor a', 'Semieje mayor a')} value={a} min={1} max={7} step={0.5} onChange={setA} />
        <Slider label={tx('Semieje menor b', 'Semieje menor b')} value={bb} min={0.5} max={a} step={0.5} onChange={setB} />
        <Slider label={tx('Punto sobre la elipse', 'Punto elipse ári')} value={t} min={0} max={360} step={5} unit="°" onChange={setT} digits={0} />
      </>}
    </>}
    readouts={<Readouts items={items} />}
    footer={kind === 'parabola' ? tx('Toda señal que llega paralela al eje se refleja hacia el foco: por eso el receptor de una antena va en el foco.', 'Opa señal og̃uahẽva eje-icha oñerefleja foco gotyo: upévare receptor oĩ foco-pe.') : kind === 'elipse' ? tx('En la elipse, la suma de las distancias de cualquier punto a los dos focos es siempre 2a. Las órbitas de los planetas son elipses.', 'Elipse-pe, opa punto guive mokõi foco peve distancia suma akóinte 2a.') : tx('Una rotonda o una rueda: todos sus puntos están a la misma distancia r del centro.', 'Rotonda térã rueda: opa ipunto oĩ peteĩchagua distancia r centro-gui.')}
  >
    <Stage width={W} height={H} grid={false} label={equation}>
      <PlaneClip id="conic-clip" s={s} />
      <Axes s={s} />
      <g clipPath="url(#conic-clip)">
        {kind === 'circulo' && <>
          <path d={pathOf(th => [h + r * Math.cos(th), k + r * Math.sin(th)])} fill="rgba(29,91,216,.08)" stroke={COLORS.blue} strokeWidth="3.2" />
          <line x1={s.sx(h)} y1={s.sy(k)} x2={s.sx(h + r)} y2={s.sy(k)} stroke={COLORS.red} strokeWidth="2.4" />
          <text x={s.sx(h + r / 2)} y={s.sy(k) - 8} textAnchor="middle" className="sim-label" fill={COLORS.red}>r = {num(r)}</text>
        </>}
        {kind === 'parabola' && <>
          <path d={Array.from({ length: 241 }, (_, i) => -8 + i * (16 / 240)).map((x, i) => `${i ? 'L' : 'M'}${s.sx(x).toFixed(1)},${s.sy(parabolaY(x)).toFixed(1)}`).join(' ')} fill="none" stroke={COLORS.blue} strokeWidth="3.4" />
          <line x1={s.sx(-8)} y1={s.sy(k - p)} x2={s.sx(8)} y2={s.sy(k - p)} stroke={COLORS.amber} strokeWidth="2" strokeDasharray="7 5" />
          {rays && [-3, -2, -1, 1, 2, 3].map(dx => {
            const x = h + dx * Math.abs(p) * 0.9;
            const y = parabolaY(x);
            const from = p > 0 ? 6 : -6;
            return <g key={dx}>
              <line x1={s.sx(x)} y1={s.sy(from)} x2={s.sx(x)} y2={s.sy(y)} stroke={COLORS.red} strokeWidth="1.6" opacity=".7" />
              <line x1={s.sx(x)} y1={s.sy(y)} x2={s.sx(focus.x)} y2={s.sy(focus.y)} stroke={COLORS.red} strokeWidth="1.6" opacity=".7" />
            </g>;
          })}
        </>}
        {kind === 'elipse' && <>
          <path d={pathOf(th => [h + a * Math.cos(th), k + bb * Math.sin(th)])} fill="rgba(29,91,216,.08)" stroke={COLORS.blue} strokeWidth="3.2" />
          <line x1={s.sx(h - c)} y1={s.sy(k)} x2={s.sx(ex)} y2={s.sy(ey)} stroke={COLORS.green} strokeWidth="2.2" />
          <line x1={s.sx(h + c)} y1={s.sy(k)} x2={s.sx(ex)} y2={s.sy(ey)} stroke={COLORS.green} strokeWidth="2.2" />
        </>}
      </g>
      {kind === 'circulo' && <Dot x={s.sx(h)} y={s.sy(k)} color={COLORS.violet} label={tx('centro', 'centro')} />}
      {kind === 'parabola' && <>
        <Dot x={s.sx(h)} y={s.sy(k)} color={COLORS.violet} label="V" />
        <Dot x={s.sx(focus.x)} y={s.sy(focus.y)} color={COLORS.red} label={tx('foco', 'foco')} />
        <text x={s.sx(7.6)} y={s.sy(k - p) - 6} textAnchor="end" className="sim-label" fill={COLORS.amber}>{tx('directriz', 'directriz')}</text>
      </>}
      {kind === 'elipse' && <>
        <Dot x={s.sx(h - c)} y={s.sy(k)} color={COLORS.red} label="F₁" />
        <Dot x={s.sx(h + c)} y={s.sy(k)} color={COLORS.red} label="F₂" />
        <Dot x={s.sx(ex)} y={s.sy(ey)} color={COLORS.green} label="P" />
      </>}
    </Stage>
  </Sim>;
}
