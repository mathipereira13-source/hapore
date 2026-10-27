// Escenas de dinámica: plano inclinado con diagrama de cuerpo libre, máquina
// de Atwood, subibaja (momento de una fuerza) y resorte (ley de Hooke).
import { C, THREE, box, cylinder, sphere, labFloor, landscape, label, arrow, line, group, mat, tube } from '../kit.js';
import { person } from './vehicles.js';

/** Prisma triangular (cuña) con base b, altura h y profundidad d. */
function wedge(b, h, d, color) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); shape.lineTo(b, 0); shape.lineTo(0, h); shape.lineTo(0, 0);
  const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false }), mat(color));
  mesh.position.z = -d / 2; mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}

/** Caja con etiqueta de masa. */
function massBox(size, color, text) {
  const g = new THREE.Group();
  const b = box(size, size, size, color); g.add(b);
  const tag = label(text, { size: 12, className: 'is-chip' }); tag.position.set(0, size * 0.75, 0); g.add(tag);
  g.tag = tag;
  return g;
}

/* ---------- Plano inclinado y Atwood ---------- */
export function incline({ scene }, { mode, state }) {
  scene.add(labFloor({ size: 24, cells: 24 }));
  if (mode === 'atwood') return atwood(scene, state);
  const L = 5;
  let ramp = null, rampKey = null;
  const block = massBox(0.6, '#fbbf24', ''); scene.add(block);
  const arrows = { P: arrow(C.force), N: arrow(C.blue), f: arrow(C.amber), Px: arrow(C.force, { radius: 0.035 }), Py: arrow(C.force, { radius: 0.035 }) };
  const tags = { P: label('P', { color: C.force }), N: label('N', { color: C.blue }), f: label('f_r', { color: '#92400e' }), Px: label('P_x', { color: C.force, size: 11 }), Py: label('P_y', { color: C.force, size: 11 }) };
  Object.values(arrows).forEach(a => scene.add(a)); Object.values(tags).forEach(t => scene.add(t));
  const thetaTag = label('', { size: 12, className: 'is-chip' }); scene.add(thetaTag);
  return {
    camera: { position: [2.5, 3.2, 7.5], target: [2.2, 1.4, 0] },
    shadow: 7,
    update(s) {
      const rad = (s.theta * Math.PI) / 180;
      const b = L * Math.cos(rad), h = L * Math.sin(rad);
      if (rampKey !== s.theta) {
        rampKey = s.theta;
        if (ramp) scene.remove(ramp);
        ramp = group(wedge(b, h, 1.6, '#e9dcc4'), line([[0, h + 0.002, 0.81], [b, 0.002, 0.81]], C.ink));
        scene.add(ramp);
        thetaTag.position.set(b - 0.9, 0.18, 0.9); thetaTag.setText(`θ = ${s.theta}°`);
      }
      const size = 0.42 + s.m * 0.018;
      block.children[0].scale.setScalar(size / 0.6);
      block.tag.setText(`${s.m} kg`); block.tag.position.set(0, size * 0.85, 0);
      const along = [Math.cos(rad), -Math.sin(rad)], normal = [Math.sin(rad), Math.cos(rad)];
      const base = [along[0] * s.s, h + along[1] * s.s];
      const c = [base[0] + normal[0] * size / 2, base[1] + normal[1] * size / 2, 0];
      block.position.set(...c); block.rotation.z = -rad;
      const k = 1.6 / Math.max(s.P, 1);
      const front = [c[0], c[1], 0.9];
      const set = (name, vec) => { arrows[name].set(front, [vec[0], vec[1], 0]); tags[name].position.set(c[0] + vec[0] * 1.12, c[1] + vec[1] * 1.12, 0.9); };
      set('P', [0, -s.P * k]);
      set('N', [normal[0] * s.N * k, normal[1] * s.N * k]);
      arrows.f.visible = tags.f.visible = s.fr > 0.01;
      tags.f.setText(s.slides ? 'f_r' : 'f_e');
      set('f', [-along[0] * s.fr * k, -along[1] * s.fr * k]);
      arrows.Px.visible = arrows.Py.visible = tags.Px.visible = tags.Py.visible = s.showParts;
      const Px = s.P * Math.sin(rad) * k, Py = s.N * k;
      set('Px', [along[0] * Px, along[1] * Px]);
      set('Py', [-normal[0] * Py, -normal[1] * Py]);
    },
  };
}

function atwood(scene, state) {
  const top = 3.6, R = 0.35;
  const posts = [-1.4, 1.4].map(x => { const p = cylinder(0.07, 0.07, top + 0.4, C.steel, { metalness: 0.3 }, 10); p.position.set(x, (top + 0.4) / 2, -0.4); scene.add(p); return p; });
  const beam = box(3.2, 0.14, 0.14, C.steel, { metalness: 0.3 }); beam.position.set(0, top + 0.4, -0.4); scene.add(beam);
  const axle = box(0.06, 0.4, 0.06, C.ink); axle.position.set(0, top + 0.2, -0.2); scene.add(axle);
  const wheel = new THREE.Group(); wheel.position.set(0, top, 0); scene.add(wheel);
  const disc = cylinder(R, R, 0.12, '#ffffff', undefined, 32); disc.rotation.x = Math.PI / 2; wheel.add(disc);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.035, 8, 40), mat(C.ink)); wheel.add(rim);
  [0, Math.PI / 2].forEach(a => { const spoke = box(R * 1.8, 0.03, 0.14, C.ink); spoke.rotation.z = a; wheel.add(spoke); });
  const left = massBox(0.5, '#fbbf24', ''), right = massBox(0.5, '#93c5fd', '');
  const ropes = [line([[0, 0, 0], [0, 0, 0]], C.ink), line([[0, 0, 0], [0, 0, 0]], C.ink), line([[0, 0, 0], [0, 0, 0]], C.ink)];
  const T1 = arrow(C.blue, { radius: 0.04 }), T2 = arrow(C.blue, { radius: 0.04 }), W1 = arrow(C.force, { radius: 0.04 }), W2 = arrow(C.force, { radius: 0.04 });
  const aTag = label('', { color: C.violet, size: 12, className: 'is-chip' });
  scene.add(left, right, ...ropes, T1, T2, W1, W2, aTag);
  return {
    camera: { position: [2.2, 2.6, 6.5], target: [0, 1.9, 0] },
    shadow: 5,
    update(s) {
      const sizeOf = m => 0.32 + m * 0.022;
      const y1 = 1.8 - s.disp, y2 = 1.8 + s.disp;
      const s1 = sizeOf(s.m1), s2 = sizeOf(s.m2);
      left.children[0].scale.setScalar(s1 / 0.5); right.children[0].scale.setScalar(s2 / 0.5);
      left.position.set(-R, y1, 0); right.position.set(R, y2, 0);
      left.tag.setText(`${s.m1} kg`); right.tag.setText(`${s.m2} kg`);
      left.tag.position.set(-s1 * 0.5 - 0.35, 0, 0); right.tag.position.set(s2 * 0.5 + 0.35, 0, 0);
      ropes[0].setPoints([[-R, top, 0], [-R, y1 + s1 / 2, 0]]);
      ropes[1].setPoints([[R, top, 0], [R, y2 + s2 / 2, 0]]);
      ropes[2].setPoints(Array.from({ length: 13 }, (_, i) => { const a = Math.PI - (i / 12) * Math.PI; return [R * Math.cos(a), top + R * Math.sin(a), 0]; }));
      wheel.rotation.z = -s.disp / R;
      const k = 0.9 / Math.max(s.m1 * 9.8, s.m2 * 9.8, s.T, 1);
      T1.set([-R - 0.05, y1 + s1 / 2, 0.3], [0, s.T * k, 0]); T2.set([R + 0.05, y2 + s2 / 2, 0.3], [0, s.T * k, 0]);
      W1.set([-R, y1 - s1 / 2, 0.3], [0, -s.m1 * 9.8 * k, 0]); W2.set([R, y2 - s2 / 2, 0.3], [0, -s.m2 * 9.8 * k, 0]);
      aTag.setText(s.aText); aTag.position.set(0, top + 0.95, 0);
    },
  };
}

/* ---------- Subibaja ---------- */
export function lever({ scene }) {
  scene.add(landscape({ size: 18 }));
  const sand = cylinder(3.2, 3.3, 0.06, '#e9dcc4', undefined, 40); sand.position.y = 0.03; scene.add(sand);
  const shape = new THREE.Shape(); shape.moveTo(-0.45, 0); shape.lineTo(0.45, 0); shape.lineTo(0, 0.95); shape.lineTo(-0.45, 0);
  const fulcrum = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false }), mat('#94a3b8'));
  fulcrum.position.set(0, 0.06, -0.25); fulcrum.castShadow = true; scene.add(fulcrum);
  const pivot = new THREE.Group(); pivot.position.set(0, 1.03, 0); scene.add(pivot);
  const plank = box(4.3, 0.12, 0.5, '#c08a52'); pivot.add(plank);
  for (let d = -2; d <= 2; d += 0.5) {
    const tick = box(0.02, 0.005, 0.5, C.ink); tick.position.set(d, 0.063, 0); tick.castShadow = false; pivot.add(tick);
    if (d && Number.isInteger(d)) { const l = label(`${Math.abs(d)} m`, { size: 10, weight: 700, color: '#475569' }); l.position.set(d, -0.2, 0.32); pivot.add(l); }
  }
  [-2.1, 2.1].forEach(x => { const handle = cylinder(0.03, 0.03, 0.5, C.ink, undefined, 8); handle.rotation.x = Math.PI / 2; handle.position.set(x * 0.92, 0.35, 0); pivot.add(handle); });
  const kids = [person(C.red, '#f2c7a5'), person(C.blue, '#c68b5e')];
  kids.forEach(kid => pivot.add(kid));
  const weights = [arrow(C.force), arrow(C.force)];
  const tags = [label('', { color: C.force, size: 12 }), label('', { color: C.force, size: 12 })];
  scene.add(...weights, ...tags);
  const verdict = label('', { size: 12, className: 'is-chip' }); verdict.position.set(0, 3.1, 0); scene.add(verdict);
  return {
    camera: { position: [1.2, 3, 6.4], target: [0, 1.2, 0] },
    shadow: 4,
    update(s) {
      const rad = (-s.angle * Math.PI) / 180;
      pivot.rotation.z = rad;
      [[-s.d1, s.m1], [s.d2, s.m2]].forEach(([d, m], i) => {
        const kid = kids[i];
        kid.scale.setScalar(0.55 + m / 220);
        kid.position.set(d, 0.06, 0);
        kid.rotation.z = -rad;
        const world = [d * Math.cos(rad), 1.03 + d * Math.sin(rad), 0.42];
        weights[i].set(world, [0, -(m / 90) * 1.1, 0]);
        tags[i].position.set(world[0] + 0.35, world[1] - 0.6, 0.42); tags[i].setText(s.weights[i]);
      });
      verdict.setText(s.verdict);
    },
  };
}

/* ---------- Resorte ---------- */
export function spring({ scene }) {
  scene.add(labFloor({ size: 14, cells: 14 }));
  const support = box(2.4, 0.18, 1, C.metal, { metalness: 0.3 }); support.position.set(0, 6.4, 0); scene.add(support);
  const post = cylinder(0.08, 0.08, 6.5, C.steel, { metalness: 0.3 }, 10); post.position.set(-1.1, 3.25, -0.4); scene.add(post);
  const foot = box(1.2, 0.08, 1, C.steel); foot.position.set(-1.1, 0.04, -0.4); scene.add(foot);
  // Hélice que se rehace con el largo real (así el alambre no se deforma).
  const coils = 10;
  let helix = null, helixLen = -1;
  const makeHelix = len => {
    if (helix) { scene.remove(helix); helix.geometry.dispose(); }
    const pts = [[0, 0, 0], [0, -0.12, 0]];
    for (let i = 0; i <= coils * 16; i += 1) { const a = (i / 16) * Math.PI * 2; pts.push([Math.cos(a) * 0.2, -0.12 - (i / (coils * 16)) * Math.max(0.2, len - 0.24), Math.sin(a) * 0.2]); }
    pts.push([0, -len, 0]);
    helix = tube(pts, 0.022, C.ink); scene.add(helix);
    helixLen = len;
  };
  const mass = massBox(0.6, '#94a3b8', ''); scene.add(mass);
  const F = arrow(C.force), P = arrow(C.earth);
  const fTag = label('F', { color: C.force }), pTag = label('P', { color: C.earth });
  const natural = line([[0, 0, 0], [0, 0, 0]], C.green, { dashed: true });
  const natTag = label('', { color: C.green, size: 11 });
  const ruler = new THREE.Group();
  scene.add(F, P, fTag, pTag, natural, natTag, ruler);
  let rulerKey = null;
  return {
    camera: { position: [3.4, 5.2, 7.6], target: [0, 4.1, 0] },
    shadow: 5,
    update(s) {
      // Escala: 1 unidad = 10 cm, salvo estiramientos muy grandes.
      const u = Math.min(0.1, 4.4 / Math.max(20 + s.xMax, 1));
      const top = 6.3, nat = 20 * u, len = nat + s.x * u;
      if (Math.abs(len - helixLen) > 0.01) makeHelix(len);
      helix.position.set(0, top, 0);
      const size = 0.42 + s.m * 0.12;
      mass.children[0].scale.setScalar(size / 0.6);
      mass.position.set(0, top - len - size / 2, 0);
      mass.tag.setText(`${s.mText}`); mass.tag.position.set(0, 0, size / 2 + 0.25);
      const cy = top - len - size / 2;
      F.set([-size / 2 - 0.25, cy, 0], [0, Math.min(1.6, s.F * 0.12), 0]); fTag.position.set(-size / 2 - 0.55, cy + Math.min(1.6, s.F * 0.12), 0);
      P.set([-size / 2 - 0.55, cy, 0], [0, -Math.min(1.6, s.m * 9.8 * 0.12), 0]); pTag.position.set(-size / 2 - 0.85, cy - Math.min(1.6, s.m * 9.8 * 0.12), 0);
      natural.setPoints([[-0.9, top - nat, 0], [0.9, top - nat, 0]]); natTag.position.set(-1.25, top - nat, 0); natTag.setText(s.naturalText);
      const key = u.toFixed(4);
      if (key !== rulerKey) {
        rulerKey = key;
        ruler.clear();
        const maxCm = Math.ceil((top - nat - 0.4) / u / 5) * 5;
        ruler.add(line([[0.9, top - nat, 0.3], [0.9, top - nat - Math.min(maxCm * u, top - nat - 0.4), 0.3]], C.ink));
        for (let cm = 0; cm * u <= top - nat - 0.4; cm += 5) {
          ruler.add(line([[0.9, top - nat - cm * u, 0.3], [1.05, top - nat - cm * u, 0.3]], C.ink));
          if (cm % 10 === 0) { const l = label(`${cm} cm`, { size: 10, weight: 650, color: '#475569' }); l.position.set(1.45, top - nat - cm * u, 0.3); ruler.add(l); }
        }
      }
    },
  };
}

export { sphere };
