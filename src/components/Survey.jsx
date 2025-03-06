import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveFeedback } from "../services/firebaseService";
import { auth } from "../firebaseConfig";
import "../styles/survey.css";
import companyLogo from "../assets/Promexma.jpeg";
import WhatsAppQR from "./WhatsAppQR"; // Importa el nuevo componente

const Survey = () => {
  const [rating, setRating] = useState(null);
  const [sucursal, setSucursal] = useState("");
  const [showWhatsAppQR, setShowWhatsAppQR] = useState(false); // Estado para mostrar el componente QR
  const [ratingBeforeSubmit, setRatingBeforeSubmit] = useState(null);
  const navigate = useNavigate();

  // Cargar la sucursal del localStorage al iniciar
  useEffect(() => {
    const savedBranch = localStorage.getItem("selectedBranch");
    if (savedBranch) {
      setSucursal(savedBranch);
    } else {
      // Si no hay sucursal seleccionada, redirigir a la selección
      navigate("/");
    }
  }, [navigate]);

  const handleRatingClick = (value) => {
    setRating(value);
    setRatingBeforeSubmit(value);
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
        timeStamp: new Date().toISOString(),
      });

      await saveFeedback({
        sucursal,
        rating,
        userId,
        timeStamp: new Date().toISOString(),
      });

      console.log("Feedback guardado exitosamente.");
      setRating(null); // Resetear el formulario
      if (ratingBeforeSubmit <= 2) {
        setShowWhatsAppQR(true); // Mostrar el componente QR si la calificación es 1 o 2
      } else {
        alert("¡Gracias por tu feedback!");
      }
    } catch (error) {
      console.error("Error detallado:", error);
      alert("Hubo un error al enviar tu feedback. Por favor, intenta de nuevo.");
    }
  };

  const handleCloseWhatsAppQR = () => {
    setShowWhatsAppQR(false);
    alert("¡Gracias por tu feedback!");
  };

  // Definimos las opciones de calificación del 1 al 5
  const ratingOptions = [
    { value: 1, emoji: "😞", label: "Muy malo" },
    { value: 2, emoji: "😕", label: "Malo" },
    { value: 3, emoji: "😐", label: "Regular" },
    { value: 4, emoji: "🙂", label: "Bueno" },
    { value: 5, emoji: "😊", label: "Excelente" },
  ];

  return (
    <div className="survey-container">
      <div className="survey-content">
        <div className="company-branding">
          <img src={companyLogo} alt="Logo de la empresa" className="company-logo" />
        </div>
        <div className="survey-header">
          <h2>Encuesta de Satisfacción</h2>
          <p>Sucursal seleccionada: <strong>{sucursal}</strong></p>
        </div>
        <div className="feedback-section">
          <h3>¿Cómo calificarías tu experiencia hoy?</h3>

          <div className="feedback-buttons">
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                className={`feedback-button ${rating === option.value ? "selected" : ""}`}
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
          className={`submit-button ${!rating ? "disabled" : ""}`}
          onClick={handleSubmit}
          disabled={!rating}
        >
          Enviar Feedback
        </button>
        <button className="admin-button" onClick={() => navigate("/")}>
          Cambiar sucursal
        </button>
        {showWhatsAppQR && <WhatsAppQR onClose={handleCloseWhatsAppQR} />}
      </div>
    </div>
  );
};

export default Survey;