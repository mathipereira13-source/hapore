// Registro de escenas 3D: el `kind` que pasa cada simulador en scene3d.
import motion from './motion.js';
import { freefall, circular, projectile } from './mechanics.js';
import { incline, lever, spring } from './forces.js';
import { energy, collision, vectors, units, orbit } from './mechanics2.js';

export const SCENES = {
  motion,
  freefall,
  circular,
  projectile,
  incline,
  lever,
  spring,
  energy,
  collision,
  vectors,
  units,
  orbit,
};
