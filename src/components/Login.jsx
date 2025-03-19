import { useState } from "react";
import { auth, googleProvider, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user);
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(userCredential.user);
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Error con Google: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Sección izquierda con imagen y texto */}
      <div className="login-banner">
        <div className="banner-content">
          <div className="logo-container">
            <img src="Xpresa.svg" alt="Promexma Logo" className="company-logo-form" />
          </div>
          <h1 className="banner-title">Inicia sesión como administrador</h1>
          <p className="banner-description">
            Accede a tu sucursal y despliega tu encuesta para obtener información valiosa de tus clientes.
          </p>
        </div>
        <div className="banner-overlay"></div>
      </div>

      {/* Sección derecha con el formulario */}
      <div className="login-form-section">
        <div className="form-wrapper">
          <h2 className="form-title">Bienvenido de vuelta</h2>
          <p className="form-subtitle">Inicia sesión para acceder a tu panel</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <i className="input-icon email-icon">✉️</i>
                <input
                  id="email"
                  type="email"
                  placeholder="ejemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <div className="label-row">
                <label htmlFor="password">Contraseña</label>
                <a href="/forgot-password" className="forgot-link">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="input-wrapper">
                <i className="input-icon password-icon">🔒</i>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="visibility-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
          
          <div className="divider">
            <span>o</span>
          </div>
          
          <button 
            className="btn btn-google" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>
          
          <div className="signup-prompt">
            ¿No tienes cuenta? <a href="/signup">Regístrate ahora</a>
          </div>
        </div>
      </div>
    </div>
  );
}