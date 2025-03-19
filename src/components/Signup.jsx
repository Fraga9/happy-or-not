import { useState } from "react";
import { auth, db } from "../firebaseConfig"; // Importar Firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Agregar un campo para el nombre
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Función para guardar el usuario en Firestore
  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name: name || "",  // Guardar el nombre ingresado
      email: user.email,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
    console.log("Usuario registrado y guardado en Firestore.");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user); // Guardar en Firestore
      navigate("/admin"); 
    } catch (error) {
      console.error(error);
      alert("Error al registrarse: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="signup-container">
      {/* Sección izquierda con imagen y texto */}
      <div className="signup-banner">
        <div className="banner-content">
          <div className="logo-container">
            <img src="Xpresa.svg" alt="Promexma Logo" className="company-logo-form" />
          </div>
          <h1 className="banner-title">Crea tu cuenta de administrador</h1>
          <p className="banner-description">
            Regístrate para gestionar tu sucursal y aplicar encuestas de satisfacción a tus clientes.
          </p>
        </div>
        <div className="banner-overlay"></div>
      </div>

      {/* Sección derecha con el formulario */}
      <div className="signup-form-section">
        <div className="form-wrapper">
          <h2 className="form-title">Crear cuenta</h2>
          <p className="form-subtitle">Regístrate para acceder a tu panel</p>
          
          <form onSubmit={handleSignup} className="signup-form">
            <div className="input-group">
              <label htmlFor="name">Nombre</label>
              <div className="input-wrapper">
                <i className="input-icon name-icon">👤</i>
                <input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            
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
              <label htmlFor="password">Contraseña</label>
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
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          
          <div className="login-prompt">
            ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
          </div>
        </div>
      </div>
    </div>
  );
}