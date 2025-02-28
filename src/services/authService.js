// src/services/authService.js
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const auth = getAuth();

// Iniciar sesión con email y contraseña
export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.error("Error en login:", error);
    return false;
  }
};

// Cerrar sesión
export const logout = async () => {
  await signOut(auth);
};
