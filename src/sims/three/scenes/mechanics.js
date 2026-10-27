// Escenas de cinemática: caída libre desde una torre, calesita (movimiento
// circular) y tiro parabólico con vectores vx, vy y v.
import { C, THREE, box, cylinder, cone, sphere, landscape, tree, label, arrow, marks, line, group, mat, ownMat } from '../kit.js';
import { person } from './vehicles.js';

/** Edificio con ventanas (altura en unidades). */
function building(height, width = 2.6, depth = 2.6, color = C.concrete) {
  const g = new THREE.Group();
  const body = box(width, height, depth, color); body.position.y = height / 2;
  g.add(body);
  const rows = Math.max(1, Math.floor(height / 0.9));
  for (let r = 0; r < rows; r += 1) {
    for (const x of [-width * 0.25, width * 0.25]) {
      const win = box(width * 0.28, 0.42, 0.04, C.glass, { roughness: 0.25 });
      win.position.set(x, 0.55 + r * 0.9, depth / 2 + 0.01);
      win.castShadow = false;
      if (win.position.y < height - 0.2) g.add(win);
    }
  }
  const roof = box(width + 0.2, 0.12, depth + 0.2, C.ink); roof.position.y = height + 0.06; g.add(roof);
  return g;
}

/* ---------- Caída libre / tiro vertical ---------- */
export function freefall({ scene, frame }, { state }) {
  const H = 12; // altura de la escena en unidades
  scene.add(landscape({ size: 40 }));
  const ballX = 1.8;
  let tower = null, towerKey = '';
  const rulerGroup = new THREE.Group(); scene.add(rulerGroup);
  const ball = sphere(0.32, C.amber); scene.add(ball);
  const v = arrow(C.v, { radius: 0.06, head: 0.3 });
  const g = arrow(C.accel, { radius: 0.045, head: 0.22 });
  const vTag = label('v', { color: C.v }), gTag = label('g', { color: C.accel });
  const strobe = marks(C.amber, 0.3, 40, 0.28);
  const maxLine = line([[0, 0, 0], [0, 0, 0]], C.amber, { dashed: true });
  const maxTag = label('', { color: '#92400e', size: 12, className: 'is-chip' });
  const feather = group(box(0.5, 0.03, 0.18, '#ffffff'), box(0.55, 0.02, 0.02, C.ink));
  scene.add(v, g, vTag, gTag, strobe, maxLine, maxTag, feather);
  [[-6, -5, 1], [6, -6, 0], [-8, 3, 0], [8, 2, 1]].forEach(([x, z, lap], i) => { const t = tree({ height: 3.4, lapacho: Boolean(lap), seed: i + 2 }); t.position.set(x, 0, z); scene.add(t); });
  return {
    camera: { position: [9, 7.5, 13], target: [0.5, 5, 0] },
    shadow: 14,
    update(s) {
      const k = H / s.scaleTop;
      const key = `${s.h0}|${s.scaleTop}`;
      if (key !== towerKey) {
        towerKey = key;
        if (tower) scene.remove(tower);
        tower = s.h0 > 0 ? building(s.h0 * k) : null;
        if (tower) { tower.position.set(-0.2, 0, 0); scene.add(tower); }
        rulerGroup.clear();
        const step = s.scaleTop > 50 ? 10 : 5;
        rulerGroup.add(line([[-2.6, 0, 1.6], [-2.6, s.scaleTop * k, 1.6]], C.ink));
        for (let h = 0; h <= s.scaleTop; h += step) {
          rulerGroup.add(line([[-2.6, h * k, 1.6], [-2.3, h * k, 1.6]], C.ink));
          const l = label(`${h} m`, { size: 11, weight: 650, color: '#475569' }); l.position.set(-3.2, h * k, 1.6); rulerGroup.add(l);
        }
      }
      const y = Math.max(0, s.y) * k + 0.32;
      ball.position.set(ballX, y, 0);
      v.set([ballX + 0.6, y, 0], [0, s.v * 0.09, 0]);
      vTag.position.set(ballX + 0.9, y + s.v * 0.09, 0); vTag.visible = Math.abs(s.v) > 0.3;
      g.set([ballX - 0.6, y, 0], [0, -0.9, 0]);
      gTag.position.set(ballX - 0.95, y - 0.6, 0);
      strobe.set(s.strobe.map(h => [ballX, Math.max(0, h) * k + 0.32, -0.7]));
      maxLine.visible = maxTag.visible = s.mode === 'up';
      maxLine.setPoints([[-1.6, s.hMax * k + 0.32, 0], [ballX + 3, s.hMax * k + 0.32, 0]]);
      maxTag.position.set(ballX + 3.4, s.hMax * k + 0.32, 0); maxTag.setText(`H máx = ${s.hMaxText}`);
      feather.visible = s.featherY !== null;
      if (feather.visible) { feather.position.set(ballX + 1.8, Math.max(0, s.featherY) * k + 0.25, 0.4); feather.rotation.z = Math.sin(performance.now() / 300) * 0.4; }
      frame({ target: [0.5, H * 0.45, 0], distance: 17, shadow: 14, key: 'tower' });
    },
  };
}

/* ---------- Calesita (movimiento circular) ---------- */
export function circular({ scene }, { state }) {
  scene.add(landscape({ size: 30 }));
  const base = cylinder(5, 5.2, 0.25, C.concrete, undefined, 48); base.position.y = 0.12; scene.add(base);
  const platform = new THREE.Group(); platform.position.y = 0.3; scene.add(platform);
  const wedges = new THREE.Group(); platform.add(wedges);
  let radiusKey = null;
  const pole = cylinder(0.14, 0.14, 3.2, C.ink, undefined, 12); pole.position.y = 1.85; scene.add(pole);
  const roof = cone(1.3, 0.8, C.red, undefined, 12); roof.position.y = 3.7; scene.add(roof);
  const rider = new THREE.Group();
  const kid = person(C.amber); kid.scale.setScalar(0.7); rider.add(kid);
  scene.add(rider);
  const rope = line([[0, 0.5, 0], [0, 0.5, 0]], C.ink, { dashed: true, opacity: 0.6 });
  const path = line([[0, 0, 0], [0, 0, 0]], C.v, { dashed: true });
  const v = arrow(C.v, { radius: 0.06, head: 0.3 }), ac = arrow(C.accel, { radius: 0.06, head: 0.3 });
  const vTag = label('v', { color: C.v }), aTag = label('a_c', { color: C.accel });
  const rTag = label('', { size: 12, className: 'is-chip' });
  scene.add(rope, path, v, ac, vTag, aTag, rTag);
  [[-8, -6, 1], [8, -7, 0], [-9, 5, 0], [9, 6, 1]].forEach(([x, z, lap], i) => { const t = tree({ height: 3.6, lapacho: Boolean(lap), seed: i + 3 }); t.position.set(x, 0, z); scene.add(t); });
  return {
    camera: { position: [4.6, 4.8, 6.6], target: [0, 0.9, 0] },
    shadow: 10,
    update(s) {
      if (radiusKey !== s.r) {
        radiusKey = s.r;
        wedges.clear();
        for (let i = 0; i < 12; i += 1) {
          const piece = new THREE.Mesh(new THREE.CylinderGeometry(s.r + 0.5, s.r + 0.5, 0.12, 8, 1, false, (i * Math.PI) / 6, Math.PI / 6), mat(i % 2 ? '#fde2e7' : '#dbe7fb'));
          piece.receiveShadow = true; wedges.add(piece);
        }
        const rim = new THREE.Mesh(new THREE.TorusGeometry(s.r + 0.5, 0.05, 8, 64), mat(C.ink)); rim.rotation.x = Math.PI / 2; rim.position.y = 0.07; wedges.add(rim);
      }
      platform.rotation.y = s.angle;
      rider.position.set(s.ball.x, 0.36, s.ball.z);
      rider.rotation.y = s.angle;
      rope.visible = !s.flying;
      rope.setPoints([[0, 0.6, 0], [s.ball.x, 0.6, s.ball.z]]);
      path.visible = s.flying;
      if (s.flying) path.setPoints([[s.releasePoint.x, 0.4, s.releasePoint.z], [s.ball.x, 0.4, s.ball.z]]);
      const show = !s.flying;
      v.visible = ac.visible = vTag.visible = aTag.visible = show;
      if (show) {
        const vs = Math.min(2.4, 0.35 * s.v), as = Math.min(2.4, 0.3 * s.ac);
        v.set([s.ball.x, 1.5, s.ball.z], [s.tangent.x * vs, 0, s.tangent.z * vs]);
        ac.set([s.ball.x, 1.5, s.ball.z], [-s.ball.x / s.r * as, 0, -s.ball.z / s.r * as]);
        vTag.position.set(s.ball.x + s.tangent.x * vs * 1.1, 1.75, s.ball.z + s.tangent.z * vs * 1.1);
        aTag.position.set(s.ball.x - s.ball.x / s.r * as * 1.1, 1.75, s.ball.z - s.ball.z / s.r * as * 1.1);
      }
      rTag.setText(`r = ${s.rText}`); rTag.position.set(s.ball.x / 2, 0.55, s.ball.z / 2);
      rTag.visible = !s.flying;
    },
  };
}

/* ---------- Tiro parabólico ---------- */
const GROUND = { tierra: C.grass, luna: '#9ca3af', marte: '#c2703d' };
export function projectile({ scene, frame }, { state }) {
  const field = landscape({ size: 60, grass: GROUND[state.planet] ?? C.grass });
  scene.add(field);
  const pathMain = line([[0, 0, 0], [0, 0, 0]], C.ink, { dashed: true, opacity: 0.7 });
  const pathOther = line([[0, 0, 0], [0, 0, 0]], C.violet, { dashed: true });
  const ball = sphere(0.36, C.amber), other = sphere(0.3, C.violet);
  const vx = arrow(C.vx), vy = arrow(C.vy), v = arrow(C.v, { radius: 0.07 });
  const vxT = label('v_x', { color: C.vx }), vyT = label('v_y', { color: C.vy }), vT = label('v', { color: C.v });
  const strobe = marks(C.blue, 0.22, 12, 0.3);
  const flag = group(cylinder(0.04, 0.04, 1.6, C.ink, undefined, 8), box(0.6, 0.36, 0.03, C.red));
  flag.children[0].position.y = 0.8; flag.children[1].position.set(0.32, 1.42, 0);
  const rangeTag = label('', { color: C.red, size: 12, className: 'is-chip' });
  const hLine = line([[0, 0, 0], [0, 0, 0]], C.amber, { dashed: true });
  const hTag = label('', { color: '#92400e', size: 12, className: 'is-chip' });
  scene.add(pathMain, pathOther, ball, other, vx, vy, v, vxT, vyT, vT, strobe, flag, rangeTag, hLine, hTag);
  let launcher = null, launcherKey = null;
  const thrower = person(C.blue); thrower.position.set(-0.7, 0, 0.9); scene.add(thrower);
  [[-5, -7, 1], [10, -9, 0], [24, -8, 1], [-6, 6, 0], [30, 7, 0]].forEach(([x, z, lap], i) => { const t = tree({ height: 3.2, lapacho: Boolean(lap), seed: i + 5 }); t.position.set(x, 0, z); t.visible = state.planet === 'tierra'; field.add(t); });
  return {
    camera: { position: [12, 9, 24], target: [12, 4, 0] },
    shadow: 22,
    update(s) {
      // Escala: el vuelo completo entra en unas 26 unidades de ancho.
      const k = Math.min(26 / s.xSpan, 13 / s.ySpan);
      const P = p => [p[0] * k, Math.max(0, p[1]) * k + 0.36, 0];
      pathMain.setPoints(s.path.map(P));
      pathOther.visible = other.visible = s.compare;
      if (s.compare) { pathOther.setPoints(s.pathOther.map(P)); other.position.set(...P([s.nowOther.x, s.nowOther.y])); }
      const p = P([s.now.x, s.now.y]);
      ball.position.set(...p);
      const flying = s.flying;
      [vx, vy, v, vxT, vyT, vT].forEach(o => { o.visible = flying; });
      if (flying) {
        const q = Math.min(0.24, 5.5 / Math.max(s.v0, 1));
        vx.set(p, [s.now.vx * q, 0, 0]); vy.set(p, [0, s.now.vy * q, 0]); v.set(p, [s.now.vx * q, s.now.vy * q, 0]);
        vxT.position.set(p[0] + s.now.vx * q + 0.3, p[1] - 0.3, 0); vyT.position.set(p[0] - 0.4, p[1] + s.now.vy * q, 0); vT.position.set(p[0] + s.now.vx * q + 0.3, p[1] + s.now.vy * q + 0.2, 0);
      }
      strobe.set(s.strobe.map(P).map(q => [q[0], q[1], 0]));
      flag.position.set(s.range * k, 0, 0.6);
      rangeTag.position.set(s.range * k, 2.1, 0.6); rangeTag.setText(s.rangeText);
      hLine.setPoints([[0, s.hMax * k + 0.36, 0], [s.xAtMax * k, s.hMax * k + 0.36, 0]]);
      hTag.position.set(Math.max(1.2, s.xAtMax * k * 0.5), s.hMax * k + 0.9, 0); hTag.setText(s.hText);
      const key = `${s.h0}|${k.toFixed(3)}`;
      if (key !== launcherKey) {
        launcherKey = key;
        if (launcher) scene.remove(launcher);
        launcher = s.h0 > 0 ? building(s.h0 * k, 1.4, 1.6) : null;
        if (launcher) { launcher.position.set(-0.7, 0, 0); scene.add(launcher); }
        thrower.position.set(-0.7, s.h0 * k, s.h0 > 0 ? 0 : 0.9);
      }
      frame({ target: [13, 4, 0], distance: 21, shadow: 22, key: 'field' });
    },
  };
}

export { ownMat };
