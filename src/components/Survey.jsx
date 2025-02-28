import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveFeedback } from "../services/firebaseService";
import { auth } from "../firebaseConfig";
import "../styles/survey.css";

const Survey = () => {
  const [rating, setRating] = useState(null);
  const [sucursal, setSucursal] = useState("");
  const navigate = useNavigate();

  // Cargar la sucursal del localStorage al iniciar
  useEffect(() => {
    const savedBranch = localStorage.getItem("selectedBranch");
    if (savedBranch) {
      setSucursal(savedBranch);
    } else {
      // Si no hay sucursal seleccionada, redirigir a la selección
      navigate("/select-branch");
    }
  }, [navigate]);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!sucursal || !rating) {
      alert("Completa todos los campos");
      return;
    }
  
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
      console.error("❌ No se encontró un usuario autenticado.");
      alert("Error: Debes estar autenticado para enviar feedback.");
      return;
    }
    console.log("Usuario actual:", userId);
  
    console.log("Enviando calificación:", rating);
  
    try {
      console.log("Intentando guardar en Firestore:", {
        sucursal,
        rating,
        userId,
        timeStamp: new Date().toISOString()
      });
  
      await saveFeedback({
        sucursal,
        rating,
        userId,
        timeStamp: new Date().toISOString()
      });
  
      console.log("Feedback guardado exitosamente.");
      alert("¡Gracias por tu feedback!");
      setRating(null); // Resetear el formulario
    } catch (error) {
      console.error("Error detallado:", error);
      alert("Hubo un error al enviar tu feedback. Por favor, intenta de nuevo.");
    }
  };
  
  // Definimos las opciones de calificación del 1 al 5
  const ratingOptions = [
    { value: 1, emoji: "😞", label: "Muy malo" },
    { value: 2, emoji: "😕", label: "Malo" },
    { value: 3, emoji: "😐", label: "Regular" },
    { value: 4, emoji: "🙂", label: "Bueno" },
    { value: 5, emoji: "😊", label: "Excelente" }
  ];

  return (
    <div className="survey-container">
      <div className="survey-content">
        <div className="survey-header">
          <h2>Encuesta de Satisfacción</h2>
          <p>Sucursal seleccionada: <strong>{sucursal}</strong></p>
          <button 
          className="sucursal-button" onClick={() => navigate("/select-branch")}
          >
            Cambiar sucursal
          </button>
        </div>
        <div className="feedback-section">
          <h3>¿Cómo calificarías tu experiencia hoy?</h3>
          
          <div className="feedback-buttons">
            {ratingOptions.map((option) => (
              <button 
                key={option.value}
                className={`feedback-button ${rating === option.value ? 'selected' : ''}`}
                onClick={() => handleRatingClick(option.value)}
              >
                {option.emoji}
                <span>{option.label}</span>
                <div className="rating-number">{option.value}</div>
              </button>
            ))}
          </div>
        </div>
        
        <button 
          className={`submit-button ${!rating ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={!rating}
        >
          Enviar Feedback
        </button>
      </div>
    </div>
  );
};

export default Survey;