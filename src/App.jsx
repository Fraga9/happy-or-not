import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SelectBranch from "./components/SelectBranch";
import Survey from "./components/Survey";
import { auth } from "./firebaseConfig";
import AdminDashboard from "./components/AdminDashboard";
import "./styles/styles.css";

// Wrapper component to handle branch-specific survey routing
const SurveyWrapper = () => {
  const { sucursalName } = useParams();
  return <Survey initialBranch={sucursalName} />;
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log("Estado de autenticación cambiado:", user);
      setLoggedIn(!!user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <Login onLogin={() => setLoggedIn(true)} />} />
      <Route path="/signup" element={loggedIn ? <Navigate to="/" /> : <Signup />} />
      <Route path="/" element={<SelectBranch />} />
      <Route path="/admin" element={loggedIn ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/survey/:sucursalName" element={<SurveyWrapper />} />
    </Routes>
  );
}