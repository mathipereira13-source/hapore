// Modo demo (solo el proyecto de pruebas demo-pyfis lo activa con
// VITE_DEMO_MODE=true): sin página publicitaria y con dos cuentas públicas de
// prueba, una de docente y otra de alumno, que viven en la nube de la demo y
// guardan sus datos. La página oficial no define estas variables.
import { login, register } from './localAccounts.js';

// Cuentas de prueba compartidas: la clave es pública a propósito (la conoce
// cualquiera que use la demo), por eso no se permite cambiarla. Llega solo por
// la variable de Vercel del proyecto de pruebas, nunca desde el repositorio.
const DEMO_PASSWORD = import.meta.env?.VITE_DEMO_PASSWORD ?? '';
export const DEMO_MODE = import.meta.env?.VITE_DEMO_MODE === 'true' && DEMO_PASSWORD.length >= 8;
export const DEMO_ACCOUNTS = {
  maestro: { username: 'demo.profesor', name: 'Profe Demo', role: 'maestro', phone: '0981 000 001', email: 'profesor@demo.pyfis.invalid' },
  alumno: { username: 'demo.alumno', name: 'Alumno Demo', role: 'alumno', phone: '0981 000 002', email: 'alumno@demo.pyfis.invalid' },
};

export const isDemoUsername = username => Object.values(DEMO_ACCOUNTS).some(item => item.username === String(username ?? '').trim().toLowerCase());

/** Entra a la cuenta de prueba; la primera vez (base nueva) la crea. */
export async function demoLogin(role) {
  const account = DEMO_ACCOUNTS[role];
  if (!account) throw new Error('Cuenta de prueba desconocida.');
  try {
    return await login({ username: account.username, password: DEMO_PASSWORD });
  } catch (failure) {
    try {
      return await register({ ...account, password: DEMO_PASSWORD });
    } catch {
      throw failure;
    }
  }
}
