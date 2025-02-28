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

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user); // Guardar en Firestore
      navigate("/select-branch"); 
    } catch (error) {
      alert("Error al registrarse: " + error.message);
    }
  };
  
  return (
    <div className="signup-page-container">
      {/* Sección izquierda con imagen y texto */}
      <div className="signup-left-section">
        <div className="left-content">
          <h1 className="left-title">Crea tu cuenta de administrador</h1>
          <p className="left-description">
            Regístrate para gestionar tu sucursal y aplicar encuestas de satisfacción a tus clientes.
          </p>
        </div>
      </div>

      {/* Sección derecha con el formulario */}
      <div className="signup-right-section">
        <div className="signup-form-container">
          <h2 className="welcome-text">Crear cuenta</h2>

          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              className="input-field"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
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
            <label htmlFor="password">Contraseña</label>
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
          
          <button className="signup-button" onClick={handleSignup}>
            Registrarse
          </button>
          
          <div className="login-option">
            ¿Ya tienes cuenta? <a href="/">Iniciar sesión</a>
          </div>
        </div>
      </div>
    </div>
  );
}