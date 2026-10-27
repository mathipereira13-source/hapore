// Progresiones aritméticas y geométricas aplicadas al ahorro: barras con cada
// término (lo que se ahorra cada semana) y la suma acumulada.
import { useState } from 'react';
import { Sim, Stage, Slider, Choice, Readouts, Graph, useTx, COLORS } from '../SimKit.jsx';

// Guaraníes con todos los dígitos (sin notación científica).
const gs = value => new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).formatToParts(value).map(part => (part.type === 'group' ? ' ' : part.value)).join('');

export default function SequenceSim() {
  const tx = useTx();
  const [kind, setKind] = useState('aritmetica');
  const [a1, setA1] = useState(10000);
  const [d, setD] = useState(2000);
  const [r, setR] = useState(1.2);
  const [n, setN] = useState(12);
  const term = i => (kind === 'aritmetica' ? a1 + (i - 1) * d : a1 * r ** (i - 1));
  const terms = Array.from({ length: n }, (_, i) => term(i + 1));
  const sums = terms.reduce((acc, value) => [...acc, (acc.at(-1) ?? 0) + value], []);
  const an = terms.at(-1), Sn = sums.at(-1);
  const max = Math.max(...terms, 1);
  const barW = Math.min(40, 560 / n - 4);
  return <Sim
    title={tx('Sucesiones y progresiones: un plan de ahorro', 'Sucesión ha progresión: ahorro plan')}
    subtitle={kind === 'aritmetica' ? tx('Cada semana ahorrás d guaraníes más que la anterior (progresión aritmética).', 'Káda semana reñongatu d guaraní hetave (progresión aritmética).') : tx('Cada semana ahorrás r veces lo de la anterior (progresión geométrica).', 'Káda semana reñongatu r jey ipykuegua (progresión geométrica).')}
    actions={<Choice options={[{ id: 'aritmetica', label: tx('Aritmética', 'Aritmética') }, { id: 'geometrica', label: tx('Geométrica', 'Geométrica') }]} value={kind} onChange={setKind} />}
    controls={<>
      <Slider label={tx('Primer ahorro a₁', 'Ñepyrũrã a₁')} value={a1} min={1000} max={50000} step={1000} unit="Gs" onChange={setA1} digits={0} />
      {kind === 'aritmetica' ? <Slider label={tx('Diferencia d', 'Diferencia d')} value={d} min={-2000} max={10000} step={500} unit="Gs" onChange={setD} digits={0} /> : <Slider label={tx('Razón r', 'Razón r')} value={r} min={0.5} max={2} step={0.05} onChange={setR} />}
      <Slider label={tx('Semanas n', 'Semana n')} value={n} min={2} max={30} step={1} onChange={setN} digits={0} />
    </>}
    readouts={<Readouts items={[
      { label: tx(`Ahorro de la semana ${n} (aₙ)`, `Semana ${n} (aₙ)`), value: gs(an), unit: 'Gs', tone: 'blue' },
      { label: tx('Total juntado (Sₙ)', 'Opaite (Sₙ)'), value: gs(Sn), unit: 'Gs', tone: 'green' },
      { label: tx('Fórmula del término', 'Término fórmula'), value: kind === 'aritmetica' ? 'aₙ = a₁ + (n − 1)·d' : 'aₙ = a₁ · rⁿ⁻¹', tone: 'violet' },
      { label: tx('Fórmula de la suma', 'Suma fórmula'), value: kind === 'aritmetica' ? 'Sₙ = n(a₁ + aₙ)/2' : 'Sₙ = a₁(rⁿ − 1)/(r − 1)', tone: 'violet' },
    ]} />}
    graphs={<Graph title={tx('Total acumulado (Gs)', 'Opaite (Gs)')} xLabel={tx('semana', 'semana')} yLabel="Gs" xMin={1} xMax={n} series={[{ points: sums.map((v, i) => [i + 1, v]), color: COLORS.green, label: 'Sₙ' }]} marker={[n, Sn]} markerColor={COLORS.green} />}
    footer={tx('En la geométrica con r > 1 el ahorro crece cada vez más rápido; con r < 1 se achica (como la depreciación de un vehículo).', 'Geométrica r > 1 ramo okakuaa pya’eve; r < 1 ramo oñemomichĩ.')}
  >
    <Stage width={640} height={300} label={tx('Ahorro de cada semana', 'Káda semana ahorro')}>
      <line x1="40" y1="260" x2="620" y2="260" stroke="#1b2a41" strokeOpacity=".5" />
      {terms.map((value, i) => {
        const h = Math.max(0, (value / max) * 210);
        const x = 50 + i * (560 / n);
        return <g key={i}>
          <rect x={x} y={260 - h} width={barW} height={h} rx="5" fill={i === n - 1 ? COLORS.blue : '#93b4f0'} />
          {n <= 15 && <text x={x + barW / 2} y={275} textAnchor="middle" className="sim-tick">{i + 1}</text>}
        </g>;
      })}
      <text x="40" y="30" className="sim-label">a₁ = {gs(a1)} Gs</text>
      <text x="620" y="30" textAnchor="end" className="sim-label" fill={COLORS.blue}>aₙ = {gs(an)} Gs (n = {n})</text>
    </Stage>
  </Sim>;
}
