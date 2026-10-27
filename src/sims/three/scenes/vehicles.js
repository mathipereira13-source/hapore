// Modelos 3D reutilizables: colectivo, moto, auto, carrito y persona.
import { C, box, cylinder, sphere, torus, group, mat, THREE } from '../kit.js';

const wheel = (r, w) => {
  const tyre = cylinder(r, r, w, C.ink, undefined, 20);
  tyre.rotation.x = Math.PI / 2;
  const hub = cylinder(r * 0.45, r * 0.45, w * 1.05, C.metal, { metalness: 0.4 }, 14);
  hub.rotation.x = Math.PI / 2;
  const g = group(tyre, hub);
  // Rayo para que se note el giro.
  const spoke = box(r * 1.6, r * 0.18, w * 1.1, '#cbd5e1');
  g.add(spoke);
  return g;
};

/** Colectivo (≈ 3 × 1,2 × 1 unidades). bus.roll(distancia) gira las ruedas. */
export function bus() {
  const g = new THREE.Group();
  const body = box(3, 1.05, 1, C.white); body.position.y = 0.78;
  const stripe = box(3.02, 0.16, 1.02, C.red); stripe.position.y = 0.62;
  const roof = box(2.9, 0.08, 0.92, '#e2e8f0'); roof.position.y = 1.34;
  g.add(body, stripe, roof);
  for (let i = 0; i < 5; i += 1) {
    const win = box(0.42, 0.32, 1.03, C.glass, { roughness: 0.25, metalness: 0.1 });
    win.position.set(-1.1 + i * 0.5, 1.0, 0);
    g.add(win);
  }
  const front = box(0.04, 0.5, 0.86, C.glass, { roughness: 0.2 }); front.position.set(1.51, 0.95, 0); g.add(front);
  const sign = box(0.05, 0.14, 0.6, C.blue); sign.position.set(1.52, 1.25, 0); g.add(sign);
  const wheels = [-0.95, 0.95].flatMap(x => [-0.46, 0.46].map(z => { const w = wheel(0.27, 0.16); w.position.set(x, 0.27, z); return w; }));
  wheels.forEach(w => g.add(w));
  g.roll = distance => wheels.forEach(w => { w.rotation.z = -distance / 0.27; });
  return g;
}

/** Moto con conductor (≈ 1,5 de largo). */
export function moto(color = C.amber) {
  const g = new THREE.Group();
  const wheels = [-0.52, 0.52].map(x => { const w = new THREE.Group(); const t = torus(0.24, 0.07, C.ink); t.rotation.y = 0; w.add(t); const hub = cylinder(0.05, 0.05, 0.1, C.metal); hub.rotation.x = Math.PI / 2; w.add(hub); w.add(box(0.4, 0.04, 0.04, '#cbd5e1')); w.position.set(x, 0.31, 0); return w; });
  wheels.forEach(w => g.add(w));
  const frame = box(0.95, 0.12, 0.12, C.ink); frame.position.set(0, 0.5, 0); frame.rotation.z = 0.08; g.add(frame);
  const tank = box(0.5, 0.22, 0.3, color); tank.position.set(0.05, 0.66, 0); g.add(tank);
  const seat = box(0.42, 0.08, 0.28, C.ink); seat.position.set(-0.3, 0.72, 0); g.add(seat);
  const fork = box(0.08, 0.5, 0.08, C.steel); fork.position.set(0.45, 0.58, 0); fork.rotation.z = -0.35; g.add(fork);
  const bar = box(0.06, 0.06, 0.6, C.ink); bar.position.set(0.36, 0.86, 0); g.add(bar);
  // Conductor con casco.
  const torso = box(0.22, 0.5, 0.32, C.blue); torso.position.set(-0.2, 1.0, 0); torso.rotation.z = -0.35; g.add(torso);
  const head = sphere(0.15, C.red, undefined, 16); head.position.set(-0.08, 1.33, 0); g.add(head);
  const arm = box(0.42, 0.08, 0.08, C.blue); arm.position.set(0.12, 1.02, 0.14); arm.rotation.z = -0.4; g.add(arm);
  g.roll = distance => wheels.forEach(w => { w.rotation.z = -distance / 0.31; });
  return g;
}

/** Carrito de laboratorio (para choques y planos). */
export function cart(color = C.blue, length = 1.2) {
  const g = new THREE.Group();
  const body = box(length, 0.42, 0.62, color); body.position.y = 0.36;
  const top = box(length * 0.92, 0.05, 0.56, '#ffffff'); top.position.y = 0.6;
  g.add(body, top);
  const wheels = [-length * 0.32, length * 0.32].flatMap(x => [-0.3, 0.3].map(z => { const w = wheel(0.13, 0.08); w.position.set(x, 0.13, z); return w; }));
  wheels.forEach(w => g.add(w));
  g.roll = distance => wheels.forEach(w => { w.rotation.z = -distance / 0.13; });
  return g;
}

/** Persona sencilla (escala humana ≈ 1,7). */
export function person(shirt = C.blue, skin = '#c68b5e') {
  const g = new THREE.Group();
  const legs = box(0.28, 0.8, 0.2, C.ink); legs.position.y = 0.4;
  const body = box(0.42, 0.62, 0.24, shirt); body.position.y = 1.12;
  const head = sphere(0.15, skin, undefined, 16); head.position.y = 1.6;
  g.add(legs, body, head);
  return g;
}

export const materialOf = color => mat(color);
