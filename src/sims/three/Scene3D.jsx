// Visor 3D de los simuladores (se carga aparte, solo al elegir "3D").
// Crea la escena de three.js, la cámara orbital, las luces y el bucle de
// dibujo; la escena concreta (scenes/) se arma una vez por tipo y modo, y en
// cada cuadro se actualiza con el estado actual del simulador (los mismos
// controles mueven la vista 2D y la 3D).
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import * as kit from './kit.js';
import { SCENES } from './scenes/index.js';
import { useTx } from '../SimKit.jsx';

const SKY_FOG = '#e6f3fa';

export default function Scene3D({ kind, mode = '', state }) {
  const tx = useTx();
  const host = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const resetRef = useRef(null);
  const [status, setStatus] = useState('ok');
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const element = host.current;
    const build = SCENES[kind];
    if (!element || !build) { setStatus('missing'); return undefined; }
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      setStatus('nowebgl');
      return undefined;
    }
    renderer.setPixelRatio(Math.min(1.75, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'sim3d-canvas';
    element.appendChild(renderer.domElement);
    const labels = new CSS2DRenderer();
    labels.domElement.className = 'sim3d-labels';
    element.appendChild(labels.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(SKY_FOG, 60, 180);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 1000);
    const hemi = new THREE.HemisphereLight('#eef6fb', '#c9b48f', 1.35);
    const sun = new THREE.DirectionalLight('#fff4e0', 2.1);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1536, 1536);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    scene.add(hemi, sun, sun.target);

    const controls = new OrbitControls(camera, labels.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minPolarAngle = 0.08;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.addEventListener('start', () => setHint(false));

    // Encuadre: la escena puede pedir un objetivo y una distancia (por
    // ejemplo, cuando cambia el alcance de un tiro); la cámara se acomoda
    // suavemente manteniendo el ángulo desde el que mira el alumno.
    const goal = { target: new THREE.Vector3(), distance: 10, key: null, t: 1 };
    const fromTarget = new THREE.Vector3();
    let fromDistance = 10;
    let shadowSize = 12;
    const frame = ({ target, distance, key = `${target}|${distance}`, shadow }) => {
      if (shadow) shadowSize = shadow;
      if (goal.key === key) return;
      goal.key = key;
      fromTarget.copy(controls.target);
      fromDistance = camera.position.distanceTo(controls.target);
      goal.target.set(target[0], target[1], target[2]);
      goal.distance = distance;
      goal.t = 0;
      controls.minDistance = distance * 0.25;
      controls.maxDistance = distance * 3.2;
      if (scene.fog) { scene.fog.near = distance * 1.6; scene.fog.far = distance * 5; }
    };

    const ctx = { THREE, scene, camera, kit, frame, renderer };
    const api = build(ctx, { mode, state: stateRef.current, tx });
    // Escenas del espacio: fondo oscuro propio y sin niebla.
    if (api.background) {
      scene.background = new THREE.Color(api.background);
      scene.fog = null;
      element.classList.add('is-dark');
    }
    const start = api.camera ?? { position: [8, 6, 10], target: [0, 1, 0] };
    camera.position.set(...start.position);
    controls.target.set(...start.target);
    goal.target.set(...start.target);
    goal.distance = camera.position.distanceTo(controls.target);
    goal.key = 'start';
    fromTarget.copy(controls.target); fromDistance = goal.distance;
    controls.minDistance = goal.distance * 0.25;
    controls.maxDistance = goal.distance * 3.2;
    if (scene.fog) { scene.fog.near = goal.distance * 1.6; scene.fog.far = goal.distance * 5; }
    if (api.shadow) shadowSize = api.shadow;
    const home = { position: camera.position.clone(), target: controls.target.clone() };
    resetRef.current = () => { camera.position.copy(home.position); controls.target.copy(home.target); goal.key = null; };

    const resize = () => {
      const width = element.clientWidth || 600;
      const height = Math.round(Math.min(560, Math.max(300, width * 0.62)));
      element.style.height = `${height}px`;
      renderer.setSize(width, height);
      labels.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);

    let visible = true;
    const io = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); });
    io.observe(element);

    let raf = 0, last = performance.now(), elapsed = 0;
    const offset = new THREE.Vector3();
    const loop = now => {
      raf = requestAnimationFrame(loop);
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      if (!visible || document.hidden) return;
      elapsed += dt;
      try {
        api.update?.(stateRef.current, dt, elapsed);
      } catch (error) {
        console.error('Escena 3D', kind, error);
        cancelAnimationFrame(raf);
        setStatus('error');
        return;
      }
      if (goal.t < 1) {
        goal.t = Math.min(1, goal.t + dt / 0.7);
        const e = 1 - (1 - goal.t) ** 3;
        offset.copy(camera.position).sub(controls.target).normalize();
        controls.target.lerpVectors(fromTarget, goal.target, e);
        const distance = fromDistance + (goal.distance - fromDistance) * e;
        camera.position.copy(controls.target).addScaledVector(offset, distance);
      }
      controls.update();
      // La luz del sol sigue a lo que se mira, con sombras nítidas alrededor.
      sun.position.copy(controls.target).add(offset.set(shadowSize * 0.7, shadowSize * 1.4, shadowSize * 0.5));
      sun.target.position.copy(controls.target);
      const cam = sun.shadow.camera;
      if (cam.right !== shadowSize) {
        cam.left = cam.bottom = -shadowSize; cam.right = cam.top = shadowSize;
        cam.near = 0.5; cam.far = shadowSize * 6;
        cam.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      labels.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      io.disconnect();
      controls.dispose();
      api.dispose?.();
      kit.disposeTree(scene);
      renderer.dispose();
      renderer.forceContextLoss?.();
      renderer.domElement.remove();
      labels.domElement.remove();
      element.classList.remove('is-dark');
    };
  }, [kind, mode, tx]);

  if (status !== 'ok') {
    return <div className="sim3d-fallback" role="status">
      {status === 'nowebgl'
        ? tx('Este dispositivo no puede mostrar 3D. Usá la vista 2D.', 'Ko dispositivo ndaikatúi ohechauka 3D. Eipuru 2D.')
        : tx('No se pudo dibujar la vista 3D. Usá la vista 2D.', 'Ndaikatúi ojehai 3D. Eipuru 2D.')}
    </div>;
  }
  return <div className="sim3d" ref={host}>
    <button type="button" className="sim3d-reset" onClick={() => resetRef.current?.()} title={tx('Volver a la vista inicial', 'Jevy ñepyrũháme')} aria-label={tx('Volver a la vista inicial', 'Jevy ñepyrũháme')}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.1-5M5 4.5V9h4.5" /></svg>
    </button>
    {hint && <p className="sim3d-hint">{tx('Arrastrá para girar · rueda o pellizco para acercar', 'Emongu’e rejere hag̃ua · rueda térã pellizco remoag̃ui hag̃ua')}</p>}
  </div>;
}
