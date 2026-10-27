// Más escenas de mecánica: pista en U (energía), riel de aire (choques),
// vectores en el plano con su producto cruz, unidades y órbitas de Kepler.
import { C, THREE, box, cylinder, sphere, labFloor, landscape, tree, label, arrow, line, ownMat } from '../kit.js';
import { cart, person, bus } from './vehicles.js';

/* ---------- Energía en la pista en U ---------- */
const X_HALF = 6, H_TRACK = 5;
const trackY = x => H_TRACK * (x / X_HALF) ** 2;
const slope = x => (2 * H_TRACK * x) / (X_HALF * X_HALF);

export function energy({ scene }) {
  scene.add(landscape({ size: 30 }));
  // Pista: perfil en U extruido a lo ancho (z).
  const shape = new THREE.Shape();
  shape.moveTo(-X_HALF - 0.4, -0.3);
  for (let i = 0; i <= 60; i += 1) { const x = -X_HALF + (i / 60) * 2 * X_HALF; shape.lineTo(x, trackY(x)); }
  shape.lineTo(X_HALF + 0.4, H_TRACK); shape.lineTo(X_HALF + 0.4, -0.3); shape.lineTo(-X_HALF - 0.4, -0.3);
  const ramp = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 2.4, bevelEnabled: false, curveSegments: 60 }), ownMat('#e9dcc4'));
  ramp.position.z = -1.2; ramp.castShadow = ramp.receiveShadow = true; scene.add(ramp);
  const curve = z => Array.from({ length: 61 }, (_, i) => { const x = -X_HALF + (i / 60) * 2 * X_HALF; return [x, trackY(x) + 0.02, z]; });
  scene.add(line(curve(1.21), C.ink), line(curve(-1.21), C.ink, { opacity: 0.5 }));
  [-1, 1].forEach(side => { const deck = box(1.2, 0.12, 2.4, C.wood); deck.position.set(side * (X_HALF + 0.9), H_TRACK - 0.06, 0); scene.add(deck); });
  for (let h = 1; h <= 5; h += 1) {
    const tick = line([[-X_HALF - 0.4, h, 1.22], [-X_HALF - 0.75, h, 1.22]], C.ink);
    const l = label(`${h} m`, { size: 10, weight: 650, color: '#475569' }); l.position.set(-X_HALF - 1.05, h, 1.22);
    scene.add(tick, l);
  }
  [[-9, -5, 1], [10.5, -6, 0], [-11, 3, 0]].forEach(([x, z, lap], i) => { const t = tree({ height: 4, lapacho: Boolean(lap), seed: i + 2 }); t.position.set(x, 0, z); scene.add(t); });
  const skater = new THREE.Group();
  const board = box(0.9, 0.06, 0.3, C.red); board.position.y = 0.16; skater.add(board);
  [-0.3, 0.3].forEach(x => { const w = cylinder(0.07, 0.07, 0.28, C.ink, undefined, 12); w.rotation.x = Math.PI / 2; w.position.set(x, 0.07, 0); skater.add(w); });
  const rider = person(C.blue); rider.scale.setScalar(0.85); rider.position.y = 0.19; skater.add(rider);
  scene.add(skater);
  const vArrow = arrow(C.v, { radius: 0.06, head: 0.3 });
  const startLine = line([[0, 0, 0], [0, 0, 0]], C.amber, { dashed: true });
  const startTag = label('', { color: '#92400e', size: 11, className: 'is-chip' });
  scene.add(vArrow, startLine, startTag);
  // Columnas de energía al costado de la pista.
  const COLS = X_HALF + 2.8;
  const bars = [['Ep', C.blue], ['Ec', C.green], ['', C.red]].map(([name, color], i) => {
    const x = COLS + i * 0.9;
    const holder = box(0.6, 4, 0.6, ownMat('#f1f5f9', { transparent: true, opacity: 0.45 })); holder.position.set(x, 2, -0.6); holder.castShadow = false;
    const fill = box(0.54, 1, 0.54, ownMat(color)); fill.position.set(x, 0, -0.6);
    const tag = label(name, { size: 11, color, className: 'is-chip' }); tag.position.set(x, -0.35, -0.2);
    scene.add(holder, fill, tag);
    return { fill, tag };
  });
  const total = label('', { size: 11, className: 'is-chip' }); total.position.set(COLS + 0.9, 4.5, -0.6); scene.add(total);
  return {
    camera: { position: [2.5, 6.5, 15], target: [1.4, 2.4, 0] },
    shadow: 11,
    update(s) {
      const y = trackY(s.x);
      const phi = Math.atan(slope(s.x));
      skater.position.set(s.x, y, 0);
      skater.rotation.z = phi;
      vArrow.set([s.x, y + 2.0, 0], [s.v * Math.cos(phi) * 0.3, s.v * Math.sin(phi) * 0.3, 0]);
      startLine.setPoints([[s.x0, s.h0, 1.25], [-s.x0, s.h0, 1.25]]);
      startTag.position.set(-s.x0 + 0.4, s.h0 + 0.35, 1.25); startTag.setText(s.startText);
      [s.Ep, s.Ec, s.heat].forEach((value, i) => {
        const h = Math.max(0.001, Math.min(4, (value / s.E0) * 4));
        bars[i].fill.scale.y = h; bars[i].fill.position.y = h / 2;
      });
      bars[2].tag.setText(s.heatText);
      total.setText(s.totalText);
    },
  };
}

/* ---------- Choques en el riel de aire ---------- */
export function collision({ scene }) {
  scene.add(labFloor({ size: 26, cells: 26 }));
  const table = box(12, 0.8, 2.4, C.wood); table.position.set(5, 0.4, 0); scene.add(table);
  const rail = box(10.6, 0.22, 0.5, '#cbd5e1', { metalness: 0.35, roughness: 0.4 }); rail.position.set(5, 0.91, 0); scene.add(rail);
  [-0.4, 10.4].forEach(x => { const stop = box(0.12, 0.5, 0.7, C.ink); stop.position.set(x, 1.1, 0); scene.add(stop); });
  for (let i = 0; i < 38; i += 1) { const hole = cylinder(0.03, 0.03, 0.01, '#64748b', undefined, 8); hole.position.set(0.05 + i * 0.27, 1.025, (i % 2 ? 0.1 : -0.1)); hole.castShadow = false; scene.add(hole); }
  for (let m = 0; m <= 10; m += 1) {
    scene.add(line([[m, 0.81, 1.2], [m, 0.81, 1.32]], C.ink));
    const l = label(`${m} m`, { size: 10, weight: 650, color: '#475569' }); l.position.set(m, 0.62, 1.32); scene.add(l);
  }
  const carts = [cart('#fbbf24', 0.7), cart('#93c5fd', 0.7)];
  const arrows = [arrow(C.v, { radius: 0.05 }), arrow(C.v, { radius: 0.05 })];
  const tags = [label('', { color: C.v, size: 11 }), label('', { color: C.v, size: 11 })];
  const masses = [label('', { size: 11, className: 'is-chip' }), label('', { size: 11, className: 'is-chip' })];
  const stuck = label('', { color: C.red, size: 13, className: 'is-chip' });
  scene.add(...carts, ...arrows, ...tags, ...masses, stuck);
  return {
    camera: { position: [5, 4.4, 10], target: [5, 1, 0] },
    shadow: 8,
    update(s) {
      [[s.a, s.va, s.m1], [s.b, s.vb, s.m2]].forEach(([x, v, m], i) => {
        const cx = x + 0.35;
        const k = 0.8 + m * 0.08;
        carts[i].position.set(cx, 1.02, 0);
        carts[i].scale.set(1, k, k);
        carts[i].roll(x);
        arrows[i].set([cx, 1.95, 0], [v * 0.35, 0, 0]);
        tags[i].visible = Math.abs(v) > 0.05;
        tags[i].position.set(cx + v * 0.35 + (v > 0 ? 0.5 : -0.5), 2.2, 0); tags[i].setText(`${s.fmt(v)} m/s`);
        masses[i].position.set(cx, 1.55, 0.55); masses[i].setText(`${s.fmt(m)} kg`);
      });
      stuck.visible = Boolean(s.stuckText);
      stuck.setText(s.stuckText); stuck.position.set(s.a + 0.7, 2.75, 0);
    },
  };
}

/* ---------- Vectores (en el piso) y producto cruz ---------- */
export function vectors({ scene }) {
  scene.add(labFloor({ size: 26, cells: 26 }));
  scene.add(line([[-11, 0.01, 0], [11, 0.01, 0]], C.ink, { opacity: 0.6 }), line([[0, 0.01, -11], [0, 0.01, 11]], C.ink, { opacity: 0.6 }));
  const xTag = label('x', { size: 13 }); xTag.position.set(11.4, 0.05, 0);
  const yTag = label('y', { size: 13 }); yTag.position.set(0, 0.05, -11.4);
  scene.add(xTag, yTag);
  // Eje z (sale del plano): ahí apunta el producto vectorial A × B.
  const zAxis = line([[0, -0.01, 0], [0, 7, 0]], C.accel, { dashed: true, opacity: 0.6 });
  const zTag = label('z', { size: 13, color: C.accel }); zTag.position.set(0, 7.4, 0);
  scene.add(zAxis, zTag);
  const A = arrow(C.blue, { radius: 0.09, head: 0.42 }), B = arrow(C.amber, { radius: 0.09, head: 0.42 }), R = arrow(C.v, { radius: 0.11, head: 0.5 });
  const Bfrom0 = arrow(C.amber, { radius: 0.04, head: 0.3 });
  const cross = arrow(C.accel, { radius: 0.08, head: 0.4 });
  const rx = line([[0, 0, 0], [0, 0, 0]], C.vx, { dashed: true }), ry = line([[0, 0, 0], [0, 0, 0]], C.vy, { dashed: true });
  const para = line([[0, 0, 0], [0, 0, 0]], C.blue, { dashed: true, opacity: 0.7 });
  const area = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: C.accel, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }));
  const tags = { A: label('A', { color: C.blue }), B: label('B', { color: '#b45309' }), R: label('R', { color: C.v }), X: label('', { color: C.accel, size: 12, className: 'is-chip' }) };
  scene.add(A, B, R, Bfrom0, cross, rx, ry, para, area, ...Object.values(tags));
  // El plano (x, y) del dibujo 2D va sobre el piso: la y del dibujo es −z.
  const H = 0.12;
  const flat = v => [v.x, 0, -v.y];
  return {
    camera: { position: [7, 11, 14], target: [0.5, 1.4, -1] },
    shadow: 12,
    update(s) {
      A.set([0, H, 0], flat(s.A));
      B.set([s.A.x, H, -s.A.y], flat(s.B));
      R.set([0, H + 0.02, 0], flat(s.R));
      Bfrom0.set([0, H, 0], flat(s.B));
      Bfrom0.visible = Bfrom0.visible && s.parallelogram;
      para.visible = s.parallelogram;
      para.setPoints([[s.B.x, H, -s.B.y], [s.R.x, H, -s.R.y]]);
      // El paralelogramo sombreado mide |A × B|.
      area.geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0.02, 0, s.A.x, 0.02, -s.A.y, s.R.x, 0.02, -s.R.y, 0, 0.02, 0, s.R.x, 0.02, -s.R.y, s.B.x, 0.02, -s.B.y], 3));
      area.visible = s.parallelogram;
      rx.setPoints([[0, 0.05, 0], [s.R.x, 0.05, 0]]);
      ry.setPoints([[s.R.x, 0.05, 0], [s.R.x, 0.05, -s.R.y]]);
      const zLen = Math.max(-6.5, Math.min(6.5, s.cross * 0.1));
      cross.set([0, H, 0], [0, zLen, 0]);
      tags.A.position.set(s.A.x * 0.55, 0.55, -s.A.y * 0.55);
      tags.B.position.set(s.A.x + s.B.x * 0.55, 0.55, -(s.A.y + s.B.y * 0.55));
      tags.R.position.set(s.R.x * 0.5, 0.75, -s.R.y * 0.5);
      tags.X.visible = Math.abs(zLen) > 0.05;
      tags.X.position.set(0.5, H + zLen + (zLen >= 0 ? 0.55 : -0.55), 0); tags.X.setText(s.crossText);
    },
  };
}

/* ---------- Unidades ---------- */
export function units(ctx, { mode }) {
  if (mode === 'length') return lengthLadder(ctx);
  const { scene } = ctx;
  // Velocidad: el colectivo marca dónde está cada segundo (m/s = metros por segundo).
  scene.add(landscape({ size: 70, center: [22, 0, 0] }));
  const road = box(64, 0.08, 4, C.asphalt, { roughness: 0.95 }); road.position.set(22, 0.04, 0); road.castShadow = false; scene.add(road);
  for (let m = 0; m <= 50; m += 5) {
    const mark = box(0.1, 0.02, 4, m % 10 ? '#94a3b8' : C.white); mark.position.set(m, 0.09, 0); mark.castShadow = false;
    scene.add(mark);
    if (m % 10 === 0) { const tag = label(`${m} m`, { size: 10, className: 'is-chip' }); tag.position.set(m, 0.4, 2.6); scene.add(tag); }
  }
  [[4, -5, 1], [16, -6.5, 0], [28, -5, 1], [40, -6.5, 0], [10, 6, 0], [34, 6.5, 1]].forEach(([x, z, lap], i) => { const t = tree({ height: 3.6, lapacho: Boolean(lap), seed: i + 1 }); t.position.set(x, 0, z); scene.add(t); });
  const car = bus(); scene.add(car);
  const ticks = Array.from({ length: 50 }, () => { const g = cylinder(0.2, 0.2, 0.04, C.force, undefined, 18); g.castShadow = false; scene.add(g); return g; });
  const tickTags = Array.from({ length: 50 }, () => { const l = label('', { size: 10, color: C.force, weight: 750 }); scene.add(l); return l; });
  const speed = label('', { size: 13, className: 'is-chip' }); scene.add(speed);
  let x = 0;
  return {
    camera: { position: [12, 10, 21], target: [18, 0.6, 0] },
    shadow: 22,
    update(s, dt) {
      // Recorre de 0 a 50 m a la velocidad elegida y vuelve a empezar.
      x += s.ms * dt;
      if (x > 52 || s.ms <= 0) x = 0;
      car.position.set(x - 1.5, 0.08, -0.9); car.roll(x);
      ticks.forEach((g, i) => {
        const p = s.ms * (i + 1);
        g.visible = tickTags[i].visible = s.ms > 0 && p <= 50 && (s.ms >= 2 || (i + 1) % 5 === 0);
        g.position.set(p, 0.1, 0.9);
        tickTags[i].position.set(p, 0.45, 1.35); tickTags[i].setText(`${i + 1} s`);
      });
      speed.position.set(x - 1.5, 2.2, -0.9); speed.setText(s.speedText);
    },
  };
}

/** Escalera de potencias de diez: cada escalón multiplica por 10. */
function lengthLadder({ scene, frame }) {
  scene.add(landscape({ size: 40, center: [8, 0, 0] }));
  const steps = [], tags = [];
  const kid = person(C.red); scene.add(kid);
  const info = label('', { size: 13, className: 'is-chip' }); scene.add(info);
  let built = '';
  return {
    camera: { position: [4, 7, 15], target: [7, 2.5, 0] },
    shadow: 14,
    update(s) {
      if (built !== s.steps.join('|')) {
        built = s.steps.join('|');
        s.steps.forEach((text, i) => {
          const h = 0.55 * (i + 1);
          const step = box(1.8, h, 3, ownMat('#f8fafc'));
          step.position.set(i * 1.8, h / 2, 0);
          const tag = label(text, { size: 11, weight: 750, color: '#334155' });
          tag.position.set(i * 1.8, h - 0.25, 1.55);
          scene.add(step, tag); steps.push(step); tags.push(tag);
        });
      }
      steps.forEach((step, i) => {
        const active = i === s.index;
        step.material.color.set(active ? '#dbe7fb' : i % 2 ? '#f1ece2' : '#f8fafc');
        tags[i].setColor(active ? C.blue : '#334155');
      });
      const h = 0.55 * (s.index + 1);
      kid.position.set(s.index * 1.8, h, 0);
      info.position.set(s.index * 1.8, h + 2.3, 0); info.setText(s.title);
      frame({ target: [s.index * 1.8, h + 0.6, 0], distance: 13, key: `step-${s.index}` });
    },
  };
}

/* ---------- Órbita (Kepler) ---------- */
export function orbit({ scene }) {
  // Estrellas lejanas (siempre las mismas).
  const positions = new Float32Array(700 * 3);
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 700; i += 1) {
    const u = rand() * 2 - 1, phi = rand() * Math.PI * 2, r = 70 + rand() * 40;
    positions[i * 3] = r * Math.sqrt(1 - u * u) * Math.cos(phi); positions[i * 3 + 1] = r * u; positions[i * 3 + 2] = r * Math.sqrt(1 - u * u) * Math.sin(phi);
  }
  const stars = new THREE.BufferGeometry();
  stars.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: '#cbd5e1', size: 0.3, sizeAttenuation: true })));
  const A = 7;
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.95, 40, 30), new THREE.MeshBasicMaterial({ color: '#f59e0b' }));
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.15, 40, 30), new THREE.MeshBasicMaterial({ color: '#fde68a', transparent: true, opacity: 0.25, depthWrite: false }));
  const sunLight = new THREE.PointLight('#fff4e0', 40, 0, 1.2);
  sun.add(sunLight, halo);
  const planet = sphere(0.42, '#60a5fa', { roughness: 0.6 }, 32);
  const ring = line([[0, 0, 0], [0, 0, 0]], '#e2e8f0', { dashed: true, opacity: 0.8 });
  const empty = sphere(0.09, '#94a3b8');
  const radius = line([[0, 0, 0], [0, 0, 0]], '#e2e8f0', { opacity: 0.55 });
  const F = arrow('#fb7185', { radius: 0.06, head: 0.32 });
  const V = arrow('#34d399', { radius: 0.05, head: 0.28 });
  const fTag = label('F', { color: '#fecdd3' }), vTag = label('v', { color: '#a7f3d0' });
  const sunTag = label('', { color: '#fde68a', size: 12 }), emptyTag = label('', { color: '#94a3b8', size: 11 });
  const sectors = new THREE.Group();
  scene.add(sun, planet, ring, empty, radius, F, V, fTag, vTag, sunTag, emptyTag, sectors);
  let key = null;
  return {
    background: '#0f1a33',
    camera: { position: [0, 10.5, 13], target: [0, 0, 0] },
    shadow: 10,
    update(s) {
      const b = A * Math.sqrt(1 - s.e * s.e), c = A * s.e;
      const at = p => [A * p.cx, 0, -b * p.sy];
      if (key !== `${s.e}|${s.areas}`) {
        key = `${s.e}|${s.areas}`;
        ring.setPoints(Array.from({ length: 129 }, (_, i) => { const a = (i / 128) * Math.PI * 2; return [A * Math.cos(a), 0, -b * Math.sin(a)]; }));
        sectors.children.forEach(mesh => { mesh.geometry.dispose(); mesh.material.dispose(); });
        sectors.clear();
        if (s.areas) {
          for (let k = 0; k < 12; k += 1) {
            const verts = [];
            let prev = at(s.posAt((k * 2 * Math.PI) / 12));
            for (let j = 1; j <= 12; j += 1) {
              const next = at(s.posAt(((k + j / 12) * 2 * Math.PI) / 12));
              verts.push(c, -0.01, 0, ...prev, ...next);
              prev = next;
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
            sectors.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: k % 2 ? '#f59e0b' : '#3b82f6', transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false })));
          }
        }
      }
      sun.position.set(c, 0, 0);
      sunTag.position.set(c, -1.5, 0.6); sunTag.setText(s.sunText);
      empty.visible = emptyTag.visible = s.e > 0.02;
      empty.position.set(-c, 0, 0); emptyTag.position.set(-c, -0.5, 0.3); emptyTag.setText(s.emptyText);
      const p = at(s.planet);
      planet.position.set(...p);
      radius.setPoints([[c, 0, 0], p]);
      const d = [c - p[0], 0, -p[2]];
      const len = Math.hypot(d[0], d[2]) || 1;
      const f = Math.min(3.2, 1.1 * s.forceRel);
      F.set(p, [(d[0] / len) * f, 0, (d[2] / len) * f]);
      fTag.position.set(p[0] + (d[0] / len) * (f + 0.4), 0.3, p[2] + (d[2] / len) * (f + 0.4));
      // Velocidad: tangente a la elipse (derivada respecto de E), con la rapidez de la vis-viva.
      const t = [-A * s.planet.sy, 0, -b * s.planet.cx];
      const tl = Math.hypot(t[0], t[2]) || 1;
      const sv = 1.3 * s.speedRel;
      V.set(p, [(t[0] / tl) * sv, 0, (t[2] / tl) * sv]);
      vTag.position.set(p[0] + (t[0] / tl) * (sv + 0.35), 0.3, p[2] + (t[2] / tl) * (sv + 0.35));
    },
  };
}
