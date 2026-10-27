// Matrices 2 × 2 aplicadas a una cantina: A = cantidades vendidas, B =
// precios o ventas de otra semana. Suma, resta, producto por escalar,
// producto (fila por columna, con la fila y la columna resaltadas) y
// determinante.
import { useState } from 'react';
import { Sim, Stage, Slider, Choice, Readouts, useTx, num, INK, COLORS } from '../SimKit.jsx';

const OPS = ['sum', 'sub', 'scalar', 'product', 'det'];

function MatrixBox({ x, y, m, label, color = INK, highlightRow = null, highlightCol = null, cell = 54 }) {
  const w = cell * m[0].length, h = cell * m.length;
  return <g transform={`translate(${x} ${y})`}>
    <text x={w / 2} y={-12} textAnchor="middle" className="sim-label" fill={color}>{label}</text>
    {highlightRow !== null && <rect x="2" y={highlightRow * cell + 4} width={w - 4} height={cell - 8} rx="10" fill={COLORS.amber} opacity=".22" />}
    {highlightCol !== null && <rect x={highlightCol * cell + 4} y="2" width={cell - 8} height={h - 4} rx="10" fill={COLORS.sky} opacity=".2" />}
    <path d={`M10,0 H0 V${h} H10 M${w - 10},0 H${w} V${h} H${w - 10}`} fill="none" stroke={color} strokeWidth="2.6" />
    {m.map((row, i) => row.map((value, j) => <text key={`${i}${j}`} x={j * cell + cell / 2} y={i * cell + cell / 2 + 6} textAnchor="middle" style={{ font: '800 19px var(--font, system-ui)' }} fill={INK}>{num(value)}</text>))}
  </g>;
}

export default function MatrixSim() {
  const tx = useTx();
  const [op, setOp] = useState('product');
  const [A, setA] = useState([[12, 8], [5, 10]]);
  const [B, setB] = useState([[3, 2], [4, 1]]);
  const [k, setK] = useState(2);
  const [cell, setCell] = useState([0, 0]);
  const set = (M, setM, i, j) => value => setM(M.map((row, r) => row.map((v, c) => (r === i && c === j ? value : v))));
  const sum = A.map((row, i) => row.map((v, j) => v + B[i][j]));
  const sub = A.map((row, i) => row.map((v, j) => v - B[i][j]));
  const scalar = A.map(row => row.map(v => k * v));
  const product = A.map((row, i) => [0, 1].map(j => row[0] * B[0][j] + row[1] * B[1][j]));
  const det = M => M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const result = { sum, sub, scalar, product }[op];
  const [ci, cj] = cell;
  const explain = op === 'product'
    ? `c${ci + 1}${cj + 1} = ${A[ci][0]} · ${B[0][cj]} + ${A[ci][1]} · ${B[1][cj]} = ${product[ci][cj]}`
    : op === 'det' ? `det A = ${A[0][0]} · ${A[1][1]} − ${A[0][1]} · ${A[1][0]} = ${det(A)}` : '';
  const symbol = { sum: '+', sub: '−', scalar: '·', product: '·' }[op];
  return <Sim
    title={tx('Matrices en una cantina', 'Matriz peteĩ cantina-pe')}
    subtitle={tx('A: docenas de chipa (fila 1) y vasos de cocido (fila 2) vendidos en el 1.er y 2.º recreo. B: otra semana o precios.', 'A: chipa docena (fila 1) ha cocido vaso (fila 2) ojevendéva 1.º ha 2.º recreo-pe. B: ambue semana térã precio.')}
    actions={<Choice options={OPS.map(id => ({ id, label: { sum: 'A + B', sub: 'A − B', scalar: 'k · A', product: 'A · B', det: 'det A' }[id] }))} value={op} onChange={setOp} />}
    controls={<>
      {[0, 1].map(i => [0, 1].map(j => <Slider key={`a${i}${j}`} label={`a${i + 1}${j + 1}`} value={A[i][j]} min={-5} max={20} step={1} onChange={set(A, setA, i, j)} digits={0} />))}
      {op === 'scalar' ? <Slider label="k" value={k} min={-3} max={5} step={0.5} onChange={setK} /> : op !== 'det' && [0, 1].map(i => [0, 1].map(j => <Slider key={`b${i}${j}`} label={`b${i + 1}${j + 1}`} value={B[i][j]} min={-5} max={10} step={1} onChange={set(B, setB, i, j)} digits={0} />))}
      {op === 'product' && <Choice label={tx('Elemento a explicar', 'Elemento ñemyesakã')} options={[[0, 0], [0, 1], [1, 0], [1, 1]].map(([i, j]) => ({ id: `${i}${j}`, label: `c${i + 1}${j + 1}` }))} value={`${ci}${cj}`} onChange={id => setCell([Number(id[0]), Number(id[1])])} />}
    </>}
    readouts={<Readouts items={[
      { label: tx('Orden', 'Orden'), value: '2 × 2', tone: 'blue' },
      { label: 'det A', value: det(A), tone: 'violet' },
      op === 'product' && { label: tx('¿A·B = B·A?', '¿A·B = B·A?'), value: JSON.stringify(product) === JSON.stringify(B.map((row, i) => [0, 1].map(j => row[0] * A[0][j] + row[1] * A[1][j]))) ? tx('sí (caso especial)', 'héẽ') : tx('no: el producto no es conmutativo', 'nahániri: ndaha’éi conmutativo'), tone: 'amber' },
      explain && { label: tx('Cálculo', 'Cálculo'), value: explain, tone: 'green' },
    ]} />}
    footer={tx('Producto: cada elemento es una fila de A por una columna de B. Si A son cantidades y B precios, A·B da lo recaudado.', 'Producto: káda elemento ha’e A fila B columna rehe.')}
  >
    <Stage width={640} height={260} label={tx('Operación con matrices', 'Matriz operación')}>
      {op === 'det' ? <>
        <MatrixBox x={180} y={80} m={A} label="A" color={COLORS.blue} />
        <line x1={180 + 10} y1={88} x2={180 + 98} y2={176} stroke={COLORS.green} strokeWidth="2.4" />
        <line x1={180 + 98} y1={88} x2={180 + 10} y2={176} stroke={COLORS.red} strokeWidth="2.4" />
        <text x={330} y={140} className="sim-label" style={{ fontSize: 22 }}>= {num(det(A))}</text>
      </> : <>
        {op === 'scalar' ? <text x={60} y={140} className="sim-label" style={{ fontSize: 22 }}>{num(k)}</text> : null}
        <MatrixBox x={op === 'scalar' ? 100 : 40} y={80} m={A} label="A" color={COLORS.blue} highlightRow={op === 'product' ? ci : null} />
        <text x={op === 'scalar' ? 80 : 170} y={140} className="sim-label" style={{ fontSize: 22 }}>{op === 'scalar' ? '·' : symbol}</text>
        {op !== 'scalar' && <MatrixBox x={200} y={80} m={B} label="B" color={COLORS.red} highlightCol={op === 'product' ? cj : null} />}
        <text x={op === 'scalar' ? 240 : 330} y={140} className="sim-label" style={{ fontSize: 22 }}>=</text>
        <MatrixBox x={op === 'scalar' ? 280 : 370} y={80} m={result} label={tx('Resultado', 'Resultado')} color={COLORS.green} highlightRow={op === 'product' ? ci : null} highlightCol={op === 'product' ? cj : null} />
      </>}
    </Stage>
  </Sim>;
}
