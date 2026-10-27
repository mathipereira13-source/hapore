// Lógica proposicional: tabla de verdad completa de una expresión (con la
// fila actual elegida con interruptores) y su clasificación; y reglas de
// inferencia verificadas con la tabla: en todas las filas donde las premisas
// son V, la conclusión también debe ser V.
import { useState } from 'react';
import { Sim, Stage, Choice, Readouts, Toggle, Verdict, useTx, INK, COLORS } from '../SimKit.jsx';

const imp = (a, b) => !a || b;
const EXPRESSIONS = [
  { id: 'and', text: 'p ∧ q', vars: 2, f: (p, q) => p && q },
  { id: 'or', text: 'p ∨ q', vars: 2, f: (p, q) => p || q },
  { id: 'imp', text: 'p → q', vars: 2, f: (p, q) => imp(p, q) },
  { id: 'iff', text: 'p ↔ q', vars: 2, f: (p, q) => p === q },
  { id: 'demorgan', text: '¬(p ∧ q) ↔ (¬p ∨ ¬q)', vars: 2, f: (p, q) => !(p && q) === (!p || !q) },
  { id: 'contra', text: 'p ∧ ¬p', vars: 1, f: p => p && !p },
  { id: 'taut', text: 'p ∨ ¬p', vars: 1, f: p => p || !p },
  { id: 'three', text: '(p ∨ q) → r', vars: 3, f: (p, q, r) => imp(p || q, r) },
];

const RULES = [
  { id: 'pp', name: 'Ponendo Ponens', premises: [['p → q', (p, q) => imp(p, q)], ['p', p => p]], conclusion: ['q', (p, q) => q], valid: true, example: { es: 'Si llueve, se suspende el partido. Llueve. → Se suspende el partido.', gn: 'Okýramo, partido ojesuspende. Oky. → Partido ojesuspende.' } },
  { id: 'tt', name: 'Tollendo Tollens', premises: [['p → q', (p, q) => imp(p, q)], ['¬q', (p, q) => !q]], conclusion: ['¬p', p => !p], valid: true, example: { es: 'Si el río sube más de 7 m, se evacúa la costanera. No se evacuó. → El río no subió más de 7 m.', gn: 'Ysyry ojupíramo 7 m-gui, ojeevacua costanera. Ndojeevacuái. → Ysyry ndojupíri.' } },
  { id: 'tp', name: 'Tollendo Ponens', premises: [['p ∨ q', (p, q) => p || q], ['¬p', p => !p]], conclusion: ['q', (p, q) => q], valid: true, example: { es: 'Viajo en colectivo o en moto. No viajo en colectivo. → Viajo en moto.', gn: 'Aha colectivo-pe térã moto-pe. Ndahái colectivo-pe. → Aha moto-pe.' } },
  { id: 'silo', name: tx => tx('Silogismo hipotético', 'Silogismo hipotético'), premises: [['p → q', (p, q) => imp(p, q)], ['q → r', (p, q, r) => imp(q, r)]], conclusion: ['p → r', (p, q, r) => imp(p, r)], valid: true, vars: 3, example: { es: 'Si estudio, apruebo. Si apruebo, paso de curso. → Si estudio, paso de curso.', gn: 'Astudiáramo, ahasa. Ahasáramo, ahasa curso. → Astudiáramo, ahasa curso.' } },
  { id: 'falacia', name: tx => tx('Falacia: afirmar el consecuente', 'Falacia: consecuente'), premises: [['p → q', (p, q) => imp(p, q)], ['q', (p, q) => q]], conclusion: ['p', p => p], valid: false, example: { es: 'Si llueve, el patio se moja. El patio está mojado. → ¿Llovió? No necesariamente: pudieron regarlo.', gn: 'Okýramo, korapy hykue. Korapy hykue. → ¿Oky? Ndaha’éi katuete.' } },
];

const rows = n => Array.from({ length: 2 ** n }, (_, i) => Array.from({ length: n }, (_, j) => !((i >> (n - 1 - j)) & 1)));
const cell = v => (v ? 'V' : 'F');

function Table() {
  const tx = useTx();
  const [id, setId] = useState('imp');
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);
  const [r, setR] = useState(true);
  const expr = EXPRESSIONS.find(item => item.id === id);
  const all = rows(expr.vars);
  const results = all.map(values => expr.f(...values));
  const trueCount = results.filter(Boolean).length;
  const kind = trueCount === results.length ? tx('Tautología', 'Tautología') : trueCount === 0 ? tx('Contradicción', 'Contradicción') : tx('Contingencia', 'Contingencia');
  const current = [p, q, r].slice(0, expr.vars);
  const currentIndex = all.findIndex(values => values.every((v, i) => v === current[i]));
  const names = ['p', 'q', 'r'].slice(0, expr.vars);
  return <Sim
    title={tx('Tablas de verdad', 'Tabla de verdad')}
    subtitle={`${expr.text} — ${tx(`${all.length} filas (2^${expr.vars})`, `${all.length} fila (2^${expr.vars})`)}`}
    actions={<Choice options={EXPRESSIONS.map(item => ({ id: item.id, label: item.text }))} value={id} onChange={setId} />}
    controls={<>
      <Toggle label={tx('p es verdadera', 'p añetegua')} checked={p} onChange={setP} />
      {expr.vars > 1 && <Toggle label={tx('q es verdadera', 'q añetegua')} checked={q} onChange={setQ} />}
      {expr.vars > 2 && <Toggle label={tx('r es verdadera', 'r añetegua')} checked={r} onChange={setR} />}
    </>}
    readouts={<Readouts items={[
      { label: tx('Valor en la fila elegida', 'Fila ojeiporavóva valor'), value: cell(results[currentIndex]), tone: results[currentIndex] ? 'green' : 'red' },
      { label: tx('Filas verdaderas', 'Fila añetegua'), value: `${trueCount} / ${results.length}`, tone: 'blue' },
      { label: tx('Clasificación', 'Clasificación'), value: kind, tone: 'violet' },
    ]} />}
    footer={tx('p ∧ q: V solo si ambas son V. p ∨ q: F solo si ambas son F. p → q: F solo si p es V y q es F. p ↔ q: V si tienen el mismo valor.', 'p ∧ q: V mokõive V ramo. p ∨ q: F mokõive F ramo. p → q: F año V → F. p ↔ q: V peteĩchagua ramo.')}
  >
    <Stage width={640} height={Math.max(160, 60 + all.length * 30)} label={tx('Tabla de verdad', 'Tabla de verdad')}>
      {[...names, expr.text].map((h, j) => <text key={h} x={j < names.length ? 80 + j * 80 : 80 + names.length * 80 + 110} y="36" textAnchor="middle" className="sim-axis">{h}</text>)}
      {all.map((values, i) => <g key={i} transform={`translate(0 ${50 + i * 30})`}>
        <rect x="30" y="0" width="580" height="26" rx="6" fill={i === currentIndex ? 'rgba(245,158,11,.22)' : i % 2 ? '#f8fafc' : '#fff'} stroke={i === currentIndex ? COLORS.amber : 'transparent'} />
        {values.map((v, j) => <text key={j} x={80 + j * 80} y="18" textAnchor="middle" style={{ font: '800 14px var(--font, system-ui)' }} fill={v ? COLORS.green : COLORS.red}>{cell(v)}</text>)}
        <text x={80 + names.length * 80 + 110} y="18" textAnchor="middle" style={{ font: '900 15px var(--font, system-ui)' }} fill={results[i] ? COLORS.green : COLORS.red}>{cell(results[i])}</text>
      </g>)}
    </Stage>
  </Sim>;
}

function Inference() {
  const tx = useTx();
  const [id, setId] = useState('pp');
  const rule = RULES.find(item => item.id === id);
  const n = rule.vars ?? 2;
  const all = rows(n);
  const checked = all.map(values => ({ values, premises: rule.premises.map(([, f]) => f(...values)), conclusion: rule.conclusion[1](...values) }));
  const relevant = checked.filter(row => row.premises.every(Boolean));
  const valid = relevant.every(row => row.conclusion);
  const name = typeof rule.name === 'function' ? rule.name(tx) : rule.name;
  const names = ['p', 'q', 'r'].slice(0, n);
  const cols = [...names, ...rule.premises.map(([t]) => t), rule.conclusion[0]];
  const colX = j => 70 + j * (540 / (cols.length - 1 || 1)) * 0.92;
  return <Sim
    title={tx('Reglas de inferencia', 'Inferencia regla')}
    subtitle={`${name}: ${rule.premises.map(([t]) => t).join(' ; ')} ⊢ ${rule.conclusion[0]}`}
    actions={<Choice options={RULES.map(item => ({ id: item.id, label: typeof item.name === 'function' ? item.name(tx) : item.name }))} value={id} onChange={setId} />}
    readouts={<Readouts items={[
      { label: tx('Filas con premisas verdaderas', 'Fila premisa añetegua'), value: relevant.length, tone: 'blue', digits: 0 },
      { label: tx('¿La conclusión es V en todas?', '¿Conclusión V opavavépe?'), value: valid ? tx('Sí: razonamiento válido', 'Héẽ: válido') : tx('No: no es válido', 'Nahániri: ndaha’éi válido'), tone: valid ? 'green' : 'red' },
    ]} />}
    footer={tx('Un razonamiento es válido si nunca pasa que las premisas sean verdaderas y la conclusión falsa.', 'Razonamiento válido ndojehúiramo premisa añetegua ha conclusión japu.')}
  >
    <Verdict tone={valid ? 'good' : 'bad'}>{tx(rule.example.es, rule.example.gn)}</Verdict>
    <Stage width={640} height={60 + all.length * 30} label={tx('Comprobación con la tabla', 'Tabla reheve ñahecha')}>
      {cols.map((h, j) => <text key={h + j} x={colX(j)} y="34" textAnchor="middle" className="sim-axis" fill={j === cols.length - 1 ? COLORS.violet : INK}>{h}</text>)}
      {checked.map((row, i) => {
        const on = row.premises.every(Boolean);
        const bad = on && !row.conclusion;
        return <g key={i} transform={`translate(0 ${46 + i * 30})`}>
          <rect x="24" y="0" width="592" height="26" rx="6" fill={bad ? 'rgba(225,29,72,.16)' : on ? 'rgba(14,124,102,.14)' : i % 2 ? '#f8fafc' : '#fff'} />
          {[...row.values, ...row.premises, row.conclusion].map((v, j) => <text key={j} x={colX(j)} y="18" textAnchor="middle" style={{ font: '800 14px var(--font, system-ui)' }} fill={v ? COLORS.green : COLORS.red}>{cell(v)}</text>)}
        </g>;
      })}
    </Stage>
  </Sim>;
}

export default function LogicSim({ mode = 'table' }) {
  if (mode === 'inference') return <Inference />;
  return <Table />;
}
