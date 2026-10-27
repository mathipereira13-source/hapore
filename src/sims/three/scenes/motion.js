// MRU, MRUV y encuentro: una ruta con colectivo y moto, marcas de cada
// segundo (estroboscopio), carteles de distancia y el punto de encuentro.
import { C, box, cylinder, landscape, tree, label, arrow, marks, line, group } from '../kit.js';
import { bus, moto } from './vehicles.js';

const S = 0.25; // unidades por metro a lo largo de la ruta

export default function motionScene({ scene, frame }, { state }) {
  const road = state.road ?? 200;
  const L = road * S;
  scene.add(landscape({ size: 70, center: [L / 2, 0, 0] }));
  const asphalt = box(L + 8, 0.08, 4.4, C.asphalt, { roughness: 0.95 }); asphalt.position.set(L / 2, 0.04, 0); asphalt.castShadow = false;
  const shoulder = box(L + 8, 0.06, 1.2, C.earth); shoulder.position.set(L / 2, 0.03, 2.8); shoulder.castShadow = false;
  scene.add(asphalt, shoulder);
  for (let x = -2; x < L + 4; x += 2.4) { const dash = box(1.3, 0.02, 0.12, C.white); dash.position.set(x, 0.09, 0); dash.castShadow = false; scene.add(dash); }
  [-2.2, 2.2].forEach(z => { const edge = box(L + 8, 0.02, 0.08, '#f8fafc'); edge.position.set(L / 2, 0.09, z); edge.castShadow = false; scene.add(edge); });
  // Carteles de distancia cada 20 m.
  for (let m = 0; m <= road; m += 20) {
    const post = cylinder(0.05, 0.05, 1.1, C.ink, undefined, 8); post.position.set(m * S, 0.55, 2.7);
    const plate = box(0.06, 0.34, 0.7, '#ffffff'); plate.position.set(m * S, 1.15, 2.7);
    const tag = label(`${m} m`, { size: 11, className: 'is-chip' }); tag.position.set(m * S, 1.55, 2.7);
    scene.add(post, plate, tag);
  }
  // Lapachos y árboles al costado.
  [[-4, -5, 1], [8, -6, 0], [20, -5.5, 1], [33, -6.5, 0], [44, -5, 1], [56, -6, 0], [14, 6.5, 0], [38, 7, 1]].forEach(([x, z, lapacho], i) => {
    const t = tree({ height: 3.2 + (i % 3) * 0.6, lapacho: Boolean(lapacho), seed: i + 1 });
    t.position.set(x, 0, z); scene.add(t);
  });
  // Parada de colectivo.
  const stop = group(cylinder(0.05, 0.05, 2, C.ink, undefined, 8), box(0.06, 0.4, 0.6, C.blue));
  stop.children[0].position.y = 1; stop.children[1].position.y = 1.9;
  stop.position.set(131 * S, 0, -2.8); scene.add(stop);

  const vehicles = new Map();
  const make = mover => {
    const model = mover.kind === 'bus' ? bus() : moto(C.amber);
    const v = arrow(C.v, { radius: 0.06, head: 0.3 });
    const tag = label(mover.kind === 'bus' ? 'A' : (state.movers.length > 1 ? 'B' : ''), { size: 12, className: 'is-chip' });
    const strobe = marks(mover.color ?? C.red, 0.14, 25, 0.5);
    scene.add(model, v, tag, strobe);
    return { model, v, tag, strobe };
  };
  const meet = group(cylinder(0.05, 0.05, 3, C.green, undefined, 8));
  meet.children[0].position.y = 1.5;
  const meetTag = label('', { color: C.green, size: 12, className: 'is-chip' }); meetTag.position.y = 3.3; meet.add(meetTag);
  scene.add(meet);
  const ground = line([[0, 0.12, 0], [0, 0.12, 0]], C.green, { dashed: true });
  scene.add(ground);

  return {
    camera: { position: [2, 9, 15], target: [8, 0.6, 0] },
    shadow: 18,
    update(s) {
      s.movers.forEach((mover, index) => {
        if (!vehicles.has(mover.id)) vehicles.set(mover.id, make(mover));
        const item = vehicles.get(mover.id);
        const x = Math.max(-2, Math.min(road + 6, mover.x)) * S;
        const lane = s.movers.length > 1 ? (index ? 1.1 : -1.1) : (mover.kind === 'bus' ? -1.1 : 1.1);
        item.model.position.set(x, 0.08, lane);
        item.model.roll(mover.x * S);
        item.v.set([x, mover.kind === 'bus' ? 1.9 : 1.75, lane], [Math.max(0, mover.v) * 0.12, 0, 0]);
        item.tag.position.set(x, mover.kind === 'bus' ? 2.3 : 2.0, lane);
        item.strobe.set((s.strobe?.[index] ?? []).filter(m => m <= road + 5).map(m => [m * S, 0.16, lane + (index ? 0.95 : -0.95)]));
      });
      meet.visible = s.meetX !== null && s.meetX !== undefined && s.meetX <= road;
      if (meet.visible) {
        meet.position.set(s.meetX * S, 0, 0);
        meetTag.setText(s.meetLabel ?? '');
        ground.setPoints([[s.meetX * S, 0.12, -2.2], [s.meetX * S, 0.12, 2.2]]);
      }
      ground.visible = meet.visible;
      // La cámara acompaña a los vehículos (de a pasos de 4 m, sin sacudirse).
      const lead = Math.max(...s.movers.map(mover => Math.min(road, Math.max(0, mover.x))));
      const center = Math.min(L - 6, Math.max(7, (lead * S + Math.min(...s.movers.map(mover => Math.max(0, mover.x) * S))) / 2 + 2));
      frame({ target: [center, 0.6, 0], distance: 17, shadow: 18, key: `road-${Math.round(center)}` });
    },
  };
}
