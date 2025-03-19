// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZ83MbG0Xmkt62mzrhIXfK2vk6oOtjHKE",
  authDomain: "xpresa3.firebaseapp.com",
  projectId: "xpresa3",
  storageBucket: "xpresa3.firebasestorage.app",
  messagingSenderId: "411867889667",
  appId: "1:411867889667:web:7075f8b2337fcf98ef0e36",
  measurementId: "G-G50SE6KZLP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
