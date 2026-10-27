// Kit 3D de los simuladores (three.js): materiales mate con la paleta de
// PyFis, flechas de vectores con sus colores fijos, etiquetas, suelo de
// tierra colorada y pasto, árboles, trazos y reglas. Cada escena (scenes/)
// arma su dibujo con estas piezas y se actualiza con el estado del simulador.
// Estética: docs/ESTETICA_PYFIS_IA.txt (fondo claro, sin brillos ni neones).
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const C = {
  blue: '#1d5bd8', blueDeep: '#123ea1', red: '#e11d48', amber: '#f59e0b', sun: '#eba431', green: '#0e7c66', violet: '#7047eb',
  sky: '#2f80c1', earth: '#c8552f', earthDark: '#a94424', grass: '#6aa66f', grassDark: '#5b9a63', ink: '#1b2a41', paper: '#fbfcfe',
  water: '#3b9ad9', wood: '#9a6b43', woodDark: '#7c4a2d', metal: '#9aa5b4', steel: '#6b7785', glass: '#bfe3f2', white: '#f8fafc',
  asphalt: '#4b5563', lapacho: '#e86aa8', concrete: '#d9d2c3', copper: '#c27a3a',
  // Vectores físicos (siempre estos colores).
  v: '#0e7c66', vx: '#e4572e', vy: '#2f80c1', force: '#e11d48', accel: '#7047eb',
};

const MATERIALS = new Map();
/** Material mate (cacheado por color y opciones). */
export function mat(color, opts = {}) {
  const key = `${color}|${JSON.stringify(opts)}`;
  if (!MATERIALS.has(key)) MATERIALS.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.04, ...opts }));
  return MATERIALS.get(key);
}
/** Material propio (no compartido): para objetos que cambian de color u opacidad. */
export const ownMat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.04, ...opts });

const shadowed = (mesh, cast = true, receive = true) => { mesh.castShadow = cast; mesh.receiveShadow = receive; return mesh; };

export const box = (w, h, d, color, opts) => shadowed(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof color === 'string' ? mat(color, opts) : color));
export const sphere = (r, color, opts, segments = 32) => shadowed(new THREE.Mesh(new THREE.SphereGeometry(r, segments, Math.round(segments * 0.75)), typeof color === 'string' ? mat(color, opts) : color));
export const cylinder = (rTop, rBottom, h, color, opts, segments = 28) => shadowed(new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), typeof color === 'string' ? mat(color, opts) : color));
export const cone = (r, h, color, opts, segments = 24) => shadowed(new THREE.Mesh(new THREE.ConeGeometry(r, h, segments), typeof color === 'string' ? mat(color, opts) : color));
export const torus = (r, tube, color, opts, arc = Math.PI * 2) => shadowed(new THREE.Mesh(new THREE.TorusGeometry(r, tube, 16, 64, arc), typeof color === 'string' ? mat(color, opts) : color));
export const group = (...children) => { const g = new THREE.Group(); children.forEach(child => child && g.add(child)); return g; };
export const at = (object, x = 0, y = 0, z = 0) => { object.position.set(x, y, z); return object; };

const UP = new THREE.Vector3(0, 1, 0);
/**
 * Flecha de vector (cilindro + cono). arrow.set(origen, componentes) la
 * orienta; si el vector es casi cero, se oculta.
 */
export function arrow(color, { radius = 0.06, head = 0.24 } = {}) {
  const g = new THREE.Group();
  const shaft = cylinder(radius, radius, 1, color, undefined, 14);
  const tip = cone(radius * 2.6, head, color, undefined, 18);
  shaft.castShadow = false; tip.castShadow = false;
  g.add(shaft, tip);
  const dir = new THREE.Vector3();
  g.set = (from, vec) => {
    dir.set(vec[0], vec[1], vec[2]);
    const length = dir.length();
    g.visible = length > 1e-3;
    if (!g.visible) return g;
    const headLen = Math.min(head, length * 0.45);
    const body = Math.max(1e-3, length - headLen);
    g.position.set(from[0], from[1], from[2]);
    g.quaternion.setFromUnitVectors(UP, dir.normalize());
    shaft.scale.set(1, body, 1); shaft.position.set(0, body / 2, 0);
    tip.scale.set(1, headLen / head, 1); tip.position.set(0, body + headLen / 2, 0);
    return g;
  };
  return g;
}

/** Etiqueta HTML que sigue a un punto 3D. label.setText(texto). */
export function label(text = '', { color = C.ink, size = 13, weight = 800, className = '' } = {}) {
  const div = document.createElement('div');
  div.className = `sim3d-label ${className}`.trim();
  div.style.color = color;
  div.style.fontSize = `${size}px`;
  div.style.fontWeight = weight;
  // "v_x" se muestra con subíndice (vₓ), como en el resto de la app.
  let current = null;
  const write = value => {
    const text = String(value ?? '');
    if (text === current) return;
    current = text;
    if (!text.includes('_')) { div.textContent = text; return; }
    div.textContent = '';
    text.split(/(_\{[^}]*\}|_[\p{L}\d]+)/u).forEach(part => {
      if (!part) return;
      if (part.startsWith('_')) { const sub = document.createElement('sub'); sub.textContent = part.replace(/^_\{?|\}$/g, ''); div.appendChild(sub); }
      else div.appendChild(document.createTextNode(part));
    });
  };
  write(text);
  const object = new CSS2DObject(div);
  object.setText = value => { write(value); return object; };
  object.setColor = value => { div.style.color = value; return object; };
  return object;
}

/** Línea (o polilínea) que se puede actualizar con line.setPoints([[x,y,z],…]). */
export function line(points = [[0, 0, 0], [0, 0, 0]], color = C.ink, { dashed = false, width = 1, opacity = 1, dash = 0.3, gap = 0.22 } = {}) {
  const geometry = new THREE.BufferGeometry();
  const material = dashed
    ? new THREE.LineDashedMaterial({ color, dashSize: dash, gapSize: gap, transparent: opacity < 1, opacity, linewidth: width })
    : new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity, linewidth: width });
  const object = new THREE.Line(geometry, material);
  object.setPoints = list => {
    const flat = new Float32Array(Math.max(2, list.length) * 3);
    list.forEach((p, i) => { flat[i * 3] = p[0]; flat[i * 3 + 1] = p[1]; flat[i * 3 + 2] = p[2]; });
    if (list.length === 1) flat.set(flat.subarray(0, 3), 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(flat, 3));
    geometry.setDrawRange(0, Math.max(2, list.length));
    geometry.computeBoundingSphere();
    if (dashed) object.computeLineDistances();
    return object;
  };
  object.setPoints(points);
  return object;
}

/** Tubo grueso a lo largo de puntos (trayectorias, cables, resortes). */
export function tube(points, radius, color, opts) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
  return shadowed(new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(16, points.length * 3), radius, 10, false), typeof color === 'string' ? mat(color, opts) : color), true, false);
}

/** Textura de hoja cuadriculada (cuaderno) para pisos y pizarras. */
export function gridTexture({ background = '#fbfcfe', lineColor = 'rgba(29,91,216,0.16)', cells = 8, size = 512, repeat = 1 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background; ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = lineColor; ctx.lineWidth = 2;
  for (let i = 0; i <= cells; i += 1) {
    const p = (i / cells) * size;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Suelo del paisaje: pasto con borde de tierra colorada (como la portada). */
export function landscape({ size = 80, center = [0, 0, 0], grass = C.grass } = {}) {
  const g = new THREE.Group();
  const field = new THREE.Mesh(new THREE.CircleGeometry(size, 64), mat(grass, { roughness: 0.95 }));
  field.rotation.x = -Math.PI / 2; field.receiveShadow = true;
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(size, size * 1.02, 1.2, 64, 1, true), mat(C.earth, { roughness: 0.95, side: THREE.DoubleSide }));
  rim.position.y = -0.6;
  const under = new THREE.Mesh(new THREE.CircleGeometry(size * 1.02, 64), mat(C.earthDark));
  under.rotation.x = Math.PI / 2; under.position.y = -1.2;
  g.add(field, rim, under);
  g.position.set(center[0], center[1], center[2]);
  return g;
}

/** Piso de cuaderno (laboratorio): plano cuadriculado. */
export function labFloor({ size = 20, cells = 20, center = [0, 0, 0] } = {}) {
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ map: gridTexture({ cells: 8, repeat: cells / 8 }), roughness: 0.95 }));
  plane.rotation.x = -Math.PI / 2; plane.receiveShadow = true;
  plane.position.set(center[0], center[1], center[2]);
  return plane;
}

/** Árbol: lapacho (flores rosadas) o árbol verde. */
export function tree({ height = 4, lapacho = false, seed = 1 } = {}) {
  const g = new THREE.Group();
  const trunk = cylinder(height * 0.04, height * 0.07, height * 0.55, C.woodDark, undefined, 10);
  trunk.position.y = height * 0.275;
  g.add(trunk);
  const crown = lapacho ? [C.lapacho, '#d94f93', '#f3a6c8'] : [C.grass, C.grassDark, '#7bb57f'];
  for (let i = 0; i < 5; i += 1) {
    const angle = seed * 1.7 + i * 1.26;
    const r = height * (0.2 + ((seed * 7 + i * 3) % 5) * 0.025);
    const blob = sphere(r, crown[i % crown.length], undefined, 14);
    blob.position.set(Math.cos(angle) * height * 0.16 * (i ? 1 : 0), height * (0.62 + (i % 2) * 0.1), Math.sin(angle) * height * 0.16 * (i ? 1 : 0));
    g.add(blob);
  }
  return g;
}

/** Regla vertical u horizontal con marcas y números (etiquetas). */
export function ruler({ from = [0, 0, 0], axis = 'y', length = 10, step = 1, labelEvery = 5, unit = 'm', color = C.ink, size = 0.06 } = {}) {
  const g = new THREE.Group();
  const dir = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }[axis];
  const side = axis === 'y' ? [1, 0, 0] : [0, 0, 1];
  g.add(line([from, [from[0] + dir[0] * length, from[1] + dir[1] * length, from[2] + dir[2] * length]], color));
  for (let v = 0; v <= length + 1e-9; v += step) {
    const p = [from[0] + dir[0] * v, from[1] + dir[1] * v, from[2] + dir[2] * v];
    const major = Math.abs(v / labelEvery - Math.round(v / labelEvery)) < 1e-6;
    const tick = (major ? 4 : 2) * size;
    g.add(line([p, [p[0] + side[0] * tick, p[1] + side[1] * tick, p[2] + side[2] * tick]], color));
    if (major) {
      const l = label(`${Math.round(v * 100) / 100}${v === 0 ? ` ${unit}` : ''}`, { size: 11, weight: 650, color: '#475569' });
      l.position.set(p[0] - side[0] * 0.35, p[1] - side[1] * 0.35, p[2] - side[2] * 0.35);
      g.add(l);
    }
  }
  return g;
}

/** Rastro de puntos (estroboscopio): marks.set([[x,y,z],…]). */
export function marks(color, radius = 0.12, max = 40, opacity = 0.35) {
  const g = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color, transparent: true, opacity, roughness: 0.9 });
  const geometry = new THREE.SphereGeometry(radius, 12, 9);
  const items = Array.from({ length: max }, () => { const m = new THREE.Mesh(geometry, material); m.visible = false; g.add(m); return m; });
  g.set = points => { items.forEach((m, i) => { const p = points[i]; m.visible = Boolean(p); if (p) m.position.set(p[0], p[1], p[2]); }); return g; };
  return g;
}

/** Libera geometrías, materiales propios y texturas de un objeto. */
export function disposeTree(root) {
  root.traverse(object => {
    object.geometry?.dispose?.();
    const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
    materials.forEach(material => {
      if ([...MATERIALS.values()].includes(material)) return;
      material.map?.dispose?.();
      material.dispose?.();
    });
    if (object.element?.remove) object.element.remove();
  });
}

export { THREE };
