// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAkQR42ARRFOcyx2km_LEHjzqfsUfE5aEw",
    authDomain: "happy-or-not-88f28.firebaseapp.com",
    projectId: "happy-or-not-88f28",
    storageBucket: "happy-or-not-88f28.firebasestorage.app",
    messagingSenderId: "1053743740960",
    appId: "1:1053743740960:web:3bea612481964cff13e445",    
    measurementId: "G-Z6E2T9ZV7M"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
