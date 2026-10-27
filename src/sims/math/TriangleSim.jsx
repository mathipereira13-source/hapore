// Trigonometría: circunferencia unitaria (grados, radianes, cuadrantes y
// reducción al primer cuadrante), triángulo rectángulo aplicado a medir la
// altura de un árbol con su sombra, y triángulos oblicuángulos (teoremas del
// seno y del coseno) aplicados a un terreno.
import { useState } from 'react';
import { Sim, Stage, Slider, Readouts, Toggle, useTx, num, INK, COLORS } from '../SimKit.jsx';

const DEG = Math.PI / 180;
const fracPi = deg => {
  const g = (a, b) => (b ? g(b, a % b) : a);
  const d = g(deg, 180);
  const top = deg / d, bottom = 180 / d;
  if (deg === 0) return '0';
  return `${top === 1 ? '' : top}π${bottom === 1 ? '' : `/${bottom}`}`;
};

function UnitCircle() {
  const tx = useTx();
  const [deg, setDeg] = useState(150);
  const CX = 230, CY = 200, R = 150;
  const c = Math.cos(deg * DEG), s = Math.sin(deg * DEG);
  const q = deg % 360 === 0 ? 0 : deg < 90 ? 1 : deg < 180 ? 2 : deg < 270 ? 3 : 4;
  const ref = q === 1 ? deg : q === 2 ? 180 - deg : q === 3 ? deg - 180 : q === 4 ? 360 - deg : 0;
  const px = CX + R * c, py = CY - R * s;
  const arc = `M${CX + 34},${CY} A34,34 0 ${deg > 180 ? 1 : 0} 0 ${CX + 34 * c},${CY - 34 * s}`;
  const sign = v => (Math.abs(v) < 1e-9 ? '0' : v > 0 ? '+' : '−');
  return <Sim
    title={tx('Circunferencia trigonométrica', 'Circunferencia trigonométrica')}
    subtitle={tx('El punto (cos α, sen α) recorre una circunferencia de radio 1. El signo depende del cuadrante.', 'Punto (cos α, sen α) ojere circunferencia radio 1-pe. Signo odepende cuadrante-gui.')}
    controls={<Slider label={tx('Ángulo α', 'Ángulo α')} value={deg} min={0} max={360} step={5} unit="°" onChange={setDeg} digits={0} />}
    readouts={<Readouts items={[
      { label: tx('En radianes', 'Radián-pe'), value: `${fracPi(deg)} ≈ ${num(deg * DEG, 3)}`, tone: 'violet' },
      { label: tx('Cuadrante', 'Cuadrante'), value: q ? `${q}.º` : tx('sobre un eje', 'eje ári'), tone: 'amber' },
      { label: 'sen α', value: s, digits: 3, tone: 'blue' },
      { label: 'cos α', value: c, digits: 3, tone: 'red' },
      { label: 'tan α', value: Math.abs(c) < 1e-9 ? tx('no existe', 'ndaipóri') : s / c, digits: 3, tone: 'green' },
      { label: tx('Ángulo de referencia', 'Ángulo de referencia'), value: ref, unit: '°', tone: 'amber', digits: 0 },
      { label: tx('Signos (sen, cos, tan)', 'Signo (sen, cos, tan)'), value: `${sign(s)} ${sign(c)} ${Math.abs(c) < 1e-9 ? '∄' : sign(s / c)}`, tone: 'violet' },
    ]} />}
    footer={tx('Reducción: 2.º cuadrante 180° − α; 3.º α − 180°; 4.º 360° − α. Los valores coinciden con los del ángulo de referencia, cambiando solo el signo.', 'Reducción: 2.º 180° − α; 3.º α − 180°; 4.º 360° − α.')}
  >
    <Stage width={640} height={400} label={tx('Circunferencia unitaria', 'Circunferencia unitaria')}>
      <line x1={CX - R - 30} y1={CY} x2={CX + R + 30} y2={CY} stroke={INK} strokeOpacity=".5" />
      <line x1={CX} y1={CY - R - 30} x2={CX} y2={CY + R + 30} stroke={INK} strokeOpacity=".5" />
      {[['I', 1, -1], ['II', -1, -1], ['III', -1, 1], ['IV', 1, 1]].map(([label, dx, dy], i) => <text key={label} x={CX + dx * (R + 8)} y={CY + dy * (R + 8)} textAnchor="middle" className="sim-axis" fill={q === i + 1 ? COLORS.amber : '#94a3b8'}>{label}</text>)}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={INK} strokeOpacity=".35" strokeWidth="2" />
      <path d={arc} fill="none" stroke={COLORS.amber} strokeWidth="3" />
      <line x1={CX} y1={CY} x2={px} y2={py} stroke={INK} strokeWidth="2.6" />
      <line x1={px} y1={CY} x2={px} y2={py} stroke={COLORS.blue} strokeWidth="3.4" />
      <line x1={CX} y1={CY} x2={px} y2={CY} stroke={COLORS.red} strokeWidth="3.4" />
      <circle cx={px} cy={py} r="7" fill={COLORS.amber} stroke="#fff" strokeWidth="2" />
      <text x={px + (c >= 0 ? 10 : -10)} y={py - 10} textAnchor={c >= 0 ? 'start' : 'end'} className="sim-label">({num(c, 2)}; {num(s, 2)})</text>
      <text x={px + (c >= 0 ? 8 : -8)} y={(CY + py) / 2} textAnchor={c >= 0 ? 'start' : 'end'} className="sim-label" fill={COLORS.blue}>sen α</text>
      <text x={(CX + px) / 2} y={CY + (s >= 0 ? 18 : -8)} textAnchor="middle" className="sim-label" fill={COLORS.red}>cos α</text>
      <g transform="translate(430 70)">
        <text className="sim-axis" y="0">{tx('Equivalencias', 'Equivalencia')}</text>
        {[[30, 'π/6'], [45, 'π/4'], [60, 'π/3'], [90, 'π/2'], [180, 'π'], [270, '3π/2'], [360, '2π']].map(([g, r], i) => <text key={g} y={26 + i * 22} className="sim-label" fill={g === deg ? COLORS.amber : INK}>{g}° = {r}</text>)}
      </g>
    </Stage>
  </Sim>;
}

function RightTriangle() {
  const tx = useTx();
  const [angle, setAngle] = useState(40);
  const [shadow, setShadow] = useState(12);
  const height = shadow * Math.tan(angle * DEG);
  const hyp = Math.hypot(height, shadow);
  const scale = Math.min(26, 280 / Math.max(height, 1), 420 / shadow);
  const baseY = 330, treeX = 120;
  const tipX = treeX + shadow * scale, topY = baseY - height * scale;
  return <Sim
    title={tx('Medir la altura de un árbol con su sombra', 'Ñamedi yvyra yvatekue ikuarahy’ã reheve')}
    subtitle={tx('Altura y sombra son los catetos; el rayo de sol es la hipotenusa: h = sombra · tan α.', 'Yvatekue ha kuarahy’ã ha’e cateto; kuarahy rayo ha’e hipotenusa: h = sombra · tan α.')}
    controls={<>
      <Slider label={tx('Altura del sol α', 'Kuarahy yvatekue α')} value={angle} min={10} max={75} step={1} unit="°" onChange={setAngle} digits={0} />
      <Slider label={tx('Largo de la sombra', 'Kuarahy’ã pukukue')} value={shadow} min={3} max={20} step={0.5} unit="m" onChange={setShadow} digits={1} />
    </>}
    readouts={<Readouts items={[
      { label: tx('Altura del árbol h', 'Yvyra yvatekue h'), value: height, unit: 'm', tone: 'green' },
      { label: tx('Rayo (hipotenusa)', 'Rayo (hipotenusa)'), value: hyp, unit: 'm', tone: 'amber' },
      { label: 'sen α', value: Math.sin(angle * DEG), digits: 3, tone: 'blue' },
      { label: 'cos α', value: Math.cos(angle * DEG), digits: 3, tone: 'blue' },
      { label: 'tan α', value: Math.tan(angle * DEG), digits: 3, tone: 'violet' },
      { label: tx('Comprobación sen² + cos²', 'sen² + cos²'), value: Math.sin(angle * DEG) ** 2 + Math.cos(angle * DEG) ** 2, digits: 3, tone: 'violet' },
    ]} />}
    footer="sen α = opuesto / hipotenusa ; cos α = adyacente / hipotenusa ; tan α = opuesto / adyacente"
  >
    <Stage width={640} height={380} label={tx('Árbol, sombra y rayo de sol', 'Yvyra, kuarahy’ã ha kuarahy rayo')}>
      <rect x="0" y={baseY} width="640" height="50" fill="#e9dfc8" />
      <line x1="0" y1={baseY} x2="640" y2={baseY} stroke="#a94424" strokeWidth="3" />
      <rect x={treeX} y={baseY - 4} width={shadow * scale} height="8" fill="#1b2a41" opacity=".22" />
      <rect x={treeX - 5} y={topY} width="10" height={baseY - topY} fill="#7c4a2d" />
      <circle cx={treeX} cy={topY} r={Math.max(16, Math.min(46, height * scale * 0.25))} fill="#e86aa8" opacity=".85" />
      <circle cx={treeX - 14} cy={topY + 10} r={Math.max(10, Math.min(30, height * scale * 0.17))} fill="#d94f93" opacity=".8" />
      <line x1={treeX} y1={topY} x2={tipX} y2={baseY} stroke={COLORS.amber} strokeWidth="3" strokeDasharray="7 5" />
      <path d={`M${tipX - 42},${baseY} A42,42 0 0 1 ${tipX - 42 * Math.cos(angle * DEG)},${baseY - 42 * Math.sin(angle * DEG)}`} fill="none" stroke={COLORS.amber} strokeWidth="2.4" />
      <text x={tipX - 56} y={baseY - 10} textAnchor="end" className="sim-label" fill={COLORS.amber}>α = {angle}°</text>
      <path d={`M${treeX + 14},${baseY} v-14 h-14`} fill="none" stroke={INK} strokeWidth="1.6" />
      <text x={treeX - 14} y={(topY + baseY) / 2} textAnchor="end" className="sim-label" fill={COLORS.green}>h = {num(height, 1)} m</text>
      <text x={(treeX + tipX) / 2} y={baseY + 22} textAnchor="middle" className="sim-label">{tx('sombra', 'kuarahy’ã')} = {num(shadow, 1)} m</text>
      <circle cx="590" cy="50" r="22" fill="#f4b942" />
    </Stage>
  </Sim>;
}

function Oblique() {
  const tx = useTx();
  const [a, setA] = useState(300);
  const [b, setB] = useState(500);
  const [C, setC] = useState(60);
  const [showSine, setShowSine] = useState(true);
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * DEG));
  const A = Math.asin(Math.min(1, (a * Math.sin(C * DEG)) / c)) / DEG;
  const Acorr = a * a > b * b + c * c ? 180 - A : A; // ángulo obtuso
  const B = 180 - C - Acorr;
  const area = 0.5 * a * b * Math.sin(C * DEG);
  // Dibujo: vértice C en el origen, lado b sobre el eje x, lado a con ángulo C.
  const xs = [0, b, a * Math.cos(C * DEG)];
  const minX = Math.min(...xs), spanX = Math.max(...xs) - minX;
  const scale = Math.min(400 / Math.max(spanX, 1), 250 / Math.max(a * Math.sin(C * DEG), 1));
  const P = { x: 120 - minX * scale, y: 320 };
  const PB = { x: P.x + b * scale, y: P.y };
  const PA = { x: P.x + a * Math.cos(C * DEG) * scale, y: P.y - a * Math.sin(C * DEG) * scale };
  return <Sim
    title={tx('Teoremas del seno y del coseno', 'Seno ha coseno teorema')}
    subtitle={tx('Dos caminos salen de una plaza (vértice C). ¿Qué distancia hay entre sus extremos?', 'Mokõi tape osẽ plaza-gui (vértice C). ¿Mboy distancia ipaha pa’ũme?')}
    controls={<>
      <Slider label={tx('Camino a', 'Tape a')} value={a} min={100} max={600} step={10} unit="m" onChange={setA} digits={0} />
      <Slider label={tx('Camino b', 'Tape b')} value={b} min={100} max={600} step={10} unit="m" onChange={setB} digits={0} />
      <Slider label={tx('Ángulo C entre ellos', 'Ángulo C')} value={C} min={20} max={160} step={1} unit="°" onChange={setC} digits={0} />
      <Toggle label={tx('Mostrar teorema del seno', 'Ehechauka seno teorema')} checked={showSine} onChange={setShowSine} />
    </>}
    readouts={<Readouts items={[
      { label: tx('Distancia c (coseno)', 'Distancia c (coseno)'), value: c, unit: 'm', tone: 'green', digits: 1 },
      showSine && { label: tx('Ángulo A (seno)', 'Ángulo A (seno)'), value: Acorr, unit: '°', tone: 'blue', digits: 1 },
      showSine && { label: tx('Ángulo B', 'Ángulo B'), value: B, unit: '°', tone: 'blue', digits: 1 },
      { label: tx('Área del terreno', 'Terreno área'), value: area, unit: 'm²', tone: 'amber', digits: 0 },
      showSine && { label: 'a / sen A = c / sen C', value: `${num(a / Math.sin(Acorr * DEG), 1)} = ${num(c / Math.sin(C * DEG), 1)}`, tone: 'violet' },
    ]} />}
    footer="c² = a² + b² − 2ab · cos C ; a / sen A = b / sen B = c / sen C ; Área = ½ · a · b · sen C"
  >
    <Stage width={640} height={380} label={tx('Triángulo del terreno', 'Terreno triángulo')}>
      <polygon points={`${P.x},${P.y} ${PB.x},${PB.y} ${PA.x},${PA.y}`} fill="rgba(106,166,111,.18)" stroke={INK} strokeWidth="2" />
      <line x1={P.x} y1={P.y} x2={PA.x} y2={PA.y} stroke={COLORS.blue} strokeWidth="4" />
      <line x1={P.x} y1={P.y} x2={PB.x} y2={PB.y} stroke={COLORS.red} strokeWidth="4" />
      <line x1={PA.x} y1={PA.y} x2={PB.x} y2={PB.y} stroke={COLORS.green} strokeWidth="4" strokeDasharray="8 6" />
      <path d={`M${P.x + 38},${P.y} A38,38 0 0 0 ${P.x + 38 * Math.cos(C * DEG)},${P.y - 38 * Math.sin(C * DEG)}`} fill="none" stroke={COLORS.amber} strokeWidth="2.6" />
      <text x={P.x - 22} y={P.y + 6} textAnchor="end" className="sim-label">C = {C}°</text>
      <text x={PB.x + 8} y={PB.y + 18} className="sim-label">{showSine ? `B = ${num(B, 0)}°` : 'B'}</text>
      <text x={PA.x} y={PA.y - 12} textAnchor="middle" className="sim-label">{showSine ? `A = ${num(Acorr, 0)}°` : 'A'}</text>
      <text x={(P.x + PA.x) / 2 - 12} y={(P.y + PA.y) / 2} textAnchor="end" className="sim-label" fill={COLORS.blue}>a = {a} m</text>
      <text x={(P.x + PB.x) / 2} y={P.y + 22} textAnchor="middle" className="sim-label" fill={COLORS.red}>b = {b} m</text>
      <text x={(PA.x + PB.x) / 2 + 10} y={(PA.y + PB.y) / 2} className="sim-label" fill={COLORS.green}>c = {num(c, 0)} m</text>
      <rect x={P.x - 16} y={P.y - 16} width="32" height="32" rx="6" fill="#fff" stroke={INK} />
      <text x={P.x} y={P.y + 5} textAnchor="middle" className="sim-label-small">{tx('plaza', 'plaza')}</text>
    </Stage>
  </Sim>;
}

export default function TriangleSim({ mode = 'right' }) {
  if (mode === 'circle') return <UnitCircle />;
  if (mode === 'oblique') return <Oblique />;
  return <RightTriangle />;
}
