import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SelectBranch from "./components/SelectBranch";
import Survey from "./components/Survey";
import { auth } from "./firebaseConfig";
import AdminDashboard from "./components/AdminDashboard";
import "./styles/styles.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(true); // Estado de carga añadido

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log("Estado de autenticación cambiado:", user);
      setLoggedIn(!!user);
      setLoading(false); // Finalizar carga cuando tengamos la información de autenticación
    });

    return unsubscribe;
  }, []);

  // Mostrar un indicador de carga mientras verificamos la autenticación
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={loggedIn ? <Navigate to="/select-branch" /> : <Login onLogin={() => setLoggedIn(true)} />} />
      <Route path="/signup" element={loggedIn ? <Navigate to="/select-branch" /> : <Signup />} />
      <Route path="/select-branch" element={loggedIn ? <SelectBranch onSelect={setBranch} /> : <Navigate to="/" />} />
      <Route path="/admin" element={loggedIn ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="/survey" element={loggedIn && branch ? <Survey branch={branch} /> : <Navigate to="/select-branch" />} />
    </Routes>
  );
}