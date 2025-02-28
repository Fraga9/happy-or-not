import { useState } from "react";
import { auth, googleProvider, db } from "../firebaseConfig"; // Asegúrate de importar db
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Función para guardar el usuario en Firestore
  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid); // Referencia al documento del usuario
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "",
        email: user.email || "",
        userId: user.uid, 
        createdAt: new Date().toISOString()
      });
      console.log("Usuario guardado en Firestore.");
    } else {
      console.log("Usuario ya existe en Firestore.");
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user);
      navigate("/select-branch");
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(userCredential.user);
      navigate("/select-branch");
    } catch (error) {
      alert("Error con Google: " + error.message);
    }
  };

  return (
    <div className="login-page-container">
      {/* Sección izquierda con imagen y texto */}
      <div className="login-left-section">
        <div className="left-content">
          <h1 className="left-title">Inicia sesión como administrador</h1>
          <p className="left-description">
            Accede a tu sucursal y despliega tu encuesta para obtener información valiosa de tus clientes.
          </p>
        </div>
      </div>

      {/* Sección derecha con el formulario */}
      <div className="login-right-section">
        <div className="login-form-container">
          <h2 className="welcome-text">Bienvenido de vuelta</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          
          <div className="forgot-password">
            <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
          <div className="button-group">
          <button className="login-button" onClick={handleLogin}>
            Iniciar sesión
          </button>
          <button className="google-login-button" onClick={handleGoogleLogin}>
            Iniciar sesión con Google
          </button>
          </div>
          
          <div className="signup-option">
            ¿No tienes cuenta? <a href="/signup">¡Registrate!</a>
          </div>
        </div>
      </div>
    </div>
  );
}