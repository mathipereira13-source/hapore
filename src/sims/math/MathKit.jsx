// Piezas comunes de los simuladores de Matemática: plano cartesiano con
// cuadrícula, ejes numerados y trazado de curvas (cortando en las
// discontinuidades). Usa la misma tinta y paleta que el resto (SimKit).
import { INK, num } from '../SimKit.jsx';

export const niceStep = span => {
  const raw = span / 8;
  const power = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map(m => m * power).find(step => step >= raw) ?? power * 10;
};

/** Escalas de un plano: de coordenadas matemáticas a píxeles. */
export function planeScale({ width, height, xMin, xMax, yMin, yMax, pad = 28 }) {
  const sx = x => pad + ((x - xMin) / (xMax - xMin)) * (width - 2 * pad);
  const sy = y => height - pad - ((y - yMin) / (yMax - yMin)) * (height - 2 * pad);
  return { sx, sy, xMin, xMax, yMin, yMax, width, height, pad };
}

/** Cuadrícula, ejes y números. `s` viene de planeScale. */
export function Axes({ s, xLabel = 'x', yLabel = 'y', xStep, yStep }) {
  const xs = xStep ?? niceStep(s.xMax - s.xMin), ys = yStep ?? niceStep(s.yMax - s.yMin);
  const xTicks = [], yTicks = [];
  for (let v = Math.ceil(s.xMin / xs) * xs; v <= s.xMax + 1e-9; v += xs) xTicks.push(Number(v.toFixed(6)));
  for (let v = Math.ceil(s.yMin / ys) * ys; v <= s.yMax + 1e-9; v += ys) yTicks.push(Number(v.toFixed(6)));
  const x0 = Math.min(Math.max(0, s.xMin), s.xMax), y0 = Math.min(Math.max(0, s.yMin), s.yMax);
  return <g className="math-axes">
    {xTicks.map(v => <line key={`gx${v}`} x1={s.sx(v)} y1={s.sy(s.yMin)} x2={s.sx(v)} y2={s.sy(s.yMax)} stroke="rgba(29,91,216,.09)" />)}
    {yTicks.map(v => <line key={`gy${v}`} x1={s.sx(s.xMin)} y1={s.sy(v)} x2={s.sx(s.xMax)} y2={s.sy(v)} stroke="rgba(29,91,216,.09)" />)}
    <line x1={s.sx(s.xMin)} y1={s.sy(y0)} x2={s.sx(s.xMax)} y2={s.sy(y0)} stroke={INK} strokeOpacity=".55" strokeWidth="1.4" />
    <line x1={s.sx(x0)} y1={s.sy(s.yMin)} x2={s.sx(x0)} y2={s.sy(s.yMax)} stroke={INK} strokeOpacity=".55" strokeWidth="1.4" />
    {xTicks.filter(v => Math.abs(v) > 1e-9).map(v => <text key={`tx${v}`} x={s.sx(v)} y={s.sy(y0) + 14} textAnchor="middle" className="sim-tick">{num(v)}</text>)}
    {yTicks.filter(v => Math.abs(v) > 1e-9).map(v => <text key={`ty${v}`} x={s.sx(x0) - 5} y={s.sy(v) + 3.5} textAnchor="end" className="sim-tick">{num(v)}</text>)}
    <text x={s.sx(s.xMax) - 2} y={s.sy(y0) - 6} textAnchor="end" className="sim-axis">{xLabel}</text>
    <text x={s.sx(x0) + 6} y={s.sy(s.yMax) + 12} className="sim-axis">{yLabel}</text>
  </g>;
}

/** Trazo de y = f(x); corta el camino donde la función no existe o salta. */
export function curvePath(fn, s, { from = s.xMin, to = s.xMax, steps = 360 } = {}) {
  let d = '', pen = false, lastY = null;
  const span = s.yMax - s.yMin;
  for (let i = 0; i <= steps; i += 1) {
    const x = from + ((to - from) * i) / steps;
    const y = fn(x);
    const ok = Number.isFinite(y) && y > s.yMin - span && y < s.yMax + span && (lastY === null || Math.abs(y - lastY) < span * 0.8);
    if (!ok) { pen = false; lastY = Number.isFinite(y) ? y : null; continue; }
    d += `${pen ? 'L' : 'M'}${s.sx(x).toFixed(1)},${s.sy(Math.min(s.yMax + span * 0.2, Math.max(s.yMin - span * 0.2, y))).toFixed(1)} `;
    pen = true; lastY = y;
  }
  return d;
}

/** Recorte del plano para que las curvas no se salgan del recuadro. */
export function PlaneClip({ id, s }) {
  return <defs><clipPath id={id}><rect x={s.pad} y={s.pad} width={s.width - 2 * s.pad} height={s.height - 2 * s.pad} /></clipPath></defs>;
}

export const Dot = ({ x, y, color = INK, r = 5, label, dx = 8, dy = -8 }) => <g>
  <circle cx={x} cy={y} r={r} fill={color} stroke="#fff" strokeWidth="1.6" />
  {label && <text x={x + dx} y={y + dy} className="sim-label" fill={color}>{label}</text>}
</g>;
