// Análisis combinatorio: permutaciones, variaciones y combinaciones con un
// ejemplo de aula (elegir una comisión o repartir cargos), las primeras
// agrupaciones dibujadas como fichas, y el triángulo de Pascal con el número
// combinatorio resaltado (coeficientes del binomio de Newton).
import { useState } from 'react';
import { Sim, Stage, Slider, Choice, Readouts, useTx, num, COLORS } from '../SimKit.jsx';

const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
const sup = n => String(n).replace(/\d/g, digit => '⁰¹²³⁴⁵⁶⁷⁸⁹'[digit]);
const NAMES = ['Ana', 'Beto', 'Caro', 'Dani', 'Eli', 'Fer', 'Gabi', 'Hugo', 'Iris', 'Juan'];
const CHIP = [COLORS.blue, COLORS.red, COLORS.amber, COLORS.green, COLORS.violet, COLORS.sky, COLORS.earth, COLORS.sun, '#e86aa8', '#64748b'];

function groups(n, k, ordered, limit = 12) {
  const out = [];
  const walk = (chosen, start) => {
    if (out.length >= limit) return;
    if (chosen.length === k) { out.push(chosen); return; }
    for (let i = ordered ? 0 : start; i < n; i += 1) if (!chosen.includes(i)) walk([...chosen, i], i + 1);
  };
  walk([], 0);
  return out;
}

export default function CountingSim() {
  const tx = useTx();
  const [kind, setKind] = useState('comb');
  const [n, setN] = useState(6);
  const [k, setK] = useState(3);
  const kk = kind === 'perm' ? n : Math.min(k, n);
  const total = kind === 'comb' ? fact(n) / (fact(kk) * fact(n - kk)) : fact(n) / fact(n - kk);
  const colW = kk * 26 + 18;
  const cols = Math.max(1, Math.min(3, Math.floor(400 / colW)));
  const sample = groups(n, kk, kind !== 'comb', cols * 6);
  const formula = kind === 'perm' ? `P = ${n}! = ${num(total, 0)}` : kind === 'var' ? `V(${n}, ${kk}) = ${n}! / ${n - kk}! = ${num(total, 0)}` : `C(${n}, ${kk}) = ${n}! / (${kk}! · ${n - kk}!) = ${num(total, 0)}`;
  const story = kind === 'perm' ? tx(`Ordenar a ${n} compañeros en una fila para la foto.`, `${n} irũ ñemohenda fila-pe foto-pe g̃uarã.`)
    : kind === 'var' ? tx(`Elegir presidente, secretario${kk > 2 ? ' y tesorero' : ''}… entre ${n} (importa el orden: ${kk} cargos).`, `Ñaiporavo ${kk} cargo ${n} apytégui (orden iñimportante).`)
      : tx(`Elegir una comisión de ${kk} entre ${n} compañeros (no importa el orden).`, `Comisión ${kk} ${n} irũ apytégui (orden ndaiñimportantéi).`);
  const pascal = Array.from({ length: Math.min(n, 10) + 1 }, (_, row) => Array.from({ length: row + 1 }, (_, c) => fact(row) / (fact(c) * fact(row - c))));
  return <Sim
    title={tx('Análisis combinatorio', 'Análisis combinatorio')}
    subtitle={story}
    actions={<Choice options={[{ id: 'perm', label: tx('Permutaciones', 'Permutación') }, { id: 'var', label: tx('Variaciones', 'Variación') }, { id: 'comb', label: tx('Combinaciones', 'Combinación') }]} value={kind} onChange={setKind} />}
    controls={<>
      <Slider label={tx('Personas n', 'Tapicha n')} value={n} min={2} max={10} step={1} onChange={value => { setN(value); setK(c => Math.min(c, value)); }} digits={0} />
      {kind !== 'perm' && <Slider label={tx('Se eligen k', 'Ojeiporavo k')} value={kk} min={1} max={n} step={1} onChange={setK} digits={0} />}
    </>}
    readouts={<Readouts items={[
      { label: tx('Cantidad de formas', 'Forma papapy'), value: total, tone: 'green', digits: 0 },
      { label: tx('Fórmula', 'Fórmula'), value: formula, tone: 'violet' },
      kind === 'var' && { label: tx('Si no importara el orden', 'Orden ndaiñimportantéiramo'), value: total / fact(kk), tone: 'blue', digits: 0 },
      kind === 'comb' && { label: tx('Coeficiente en (a + b)ⁿ', '(a + b)ⁿ coeficiente'), value: `a${sup(n - kk)}·b${sup(kk)} → ${num(total, 0)}`, tone: 'amber' },
    ]} />}
    footer={tx('¿Importa el orden? Sí → variaciones (o permutaciones si se usan todos). No → combinaciones. El triángulo de Pascal da los C(n, k).', '¿Orden iñimportante? Héẽ → variación. Nahániri → combinación.')}
  >
    <Stage width={640} height={340} label={tx('Agrupaciones y triángulo de Pascal', 'Agrupación ha Pascal triángulo')}>
      <text x="20" y="28" className="sim-axis">{tx(`Primeras agrupaciones (de ${num(total, 0)})`, `Ñepyrũrã agrupación (${num(total, 0)}-gui)`)}</text>
      {sample.map((g, i) => <g key={i} transform={`translate(${20 + (i % cols) * colW} ${44 + Math.floor(i / cols) * 46})`}>
        {g.map((p, j) => <g key={j} transform={`translate(${j * 26} 0)`}><circle cx="11" cy="11" r="11" fill={CHIP[p]} /><text x="11" y="15" textAnchor="middle" style={{ font: '800 10px var(--font, system-ui)' }} fill="#fff">{NAMES[p][0]}</text></g>)}
      </g>)}
      <g transform="translate(470 30)">
        <text x="0" y="0" textAnchor="middle" className="sim-axis">{tx('Triángulo de Pascal', 'Pascal triángulo')}</text>
        {pascal.map((row, i) => row.map((value, j) => {
          const hit = i === n && j === kk && kind === 'comb';
          return <text key={`${i}-${j}`} x={(j - i / 2) * 30} y={22 + i * 28} textAnchor="middle" style={{ font: `${hit ? 900 : 650} ${hit ? 15 : 11.5}px var(--font, system-ui)` }} fill={hit ? COLORS.red : i === n ? COLORS.blue : '#64748b'}>{value}</text>;
        }))}
      </g>
    </Stage>
  </Sim>;
}
