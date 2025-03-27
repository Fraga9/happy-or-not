import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveFeedback } from "../services/firebaseService";
import { auth } from "../firebaseConfig";
import "../styles/survey.css";
import companyLogo from "/Promexma.jpeg";
import WhatsAppQR from "./WhatsAppQR";
import Alert from "./Alert";

const Survey = ({ initialBranch }) => {
  const [rating, setRating] = useState(null);
  const [sucursal, setSucursal] = useState("");
  const [showWhatsAppQR, setShowWhatsAppQR] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState("");
  const [feedbackComment, setFeedbackComment] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();
  const { sucursalName } = useParams();

  // Initialize sucursal from route param or prop
  useEffect(() => {
    const branchToUse = sucursalName || initialBranch;
    
    if (branchToUse) {
      setSucursal(branchToUse);
      localStorage.setItem("selectedBranch", branchToUse);
    } else {
      // If no branch is specified, redirect to branch selection
      navigate("/");
    }
  }, [sucursalName, initialBranch, navigate]);

  const handleRatingClick = (value) => {
    setRating(value);
    
    // Si la calificación es regular o menor (3 o menos), mostrar el formulario de feedback
    if (value <= 3) {
      setShowFeedbackForm(true);
    } else {
      setShowFeedbackForm(false);
      setFeedbackReason("");
      setFeedbackComment("");
    }
  };

  const feedbackReasons = [
    "Variedad de producto",
    "Orden y limpieza",
    "Actitud del personal",
    "Tiempos de atención",
    "Calidad del producto",
    "Precios",
    "Otro"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sucursal || !rating) {
      setAlert({
        show: true,
        message: "Por favor completa todos los campos",
        type: "warning"
      });
      return;
    }

    // Validar que se seleccione una razón si la calificación es baja
    if (rating <= 3 && !feedbackReason) {
      setAlert({
        show: true,
        message: "Por favor selecciona un motivo para tu calificación",
        type: "warning"
      });
      return;
    }

    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous";


    try {
      // Preparar datos para guardar, incluyendo el motivo y comentario
      const feedbackData = {
        sucursal,
        rating,
        userId,
        timeStamp: new Date().toISOString(),
        // Añadir campos adicionales si la calificación es baja
        ...(rating <= 3 && {
          motivoInsatisfaccion: feedbackReason,
          comentarioAdicional: feedbackComment || "No se proporcionó comentario adicional"
        })
      };

      console.log("Guardando feedback:", feedbackData);
      await saveFeedback(feedbackData);
      console.log("Feedback guardado exitosamente.");
      
      // Mostrar alerta de éxito
      setAlert({
        show: true,
        message: "¡Gracias por tu feedback!",
        type: "success"
      });
      
      // Restablecer el formulario
      setFeedbackReason("");
      setFeedbackComment("");
      setShowFeedbackForm(false);
      setRating(null);
      
      // Mostrar QR de WhatsApp para calificaciones de 3 o menos (regular, malo, muy malo)
      if (rating <= 3) {
        setShowWhatsAppQR(true);
      }
    } catch (error) {
      console.error("Error al guardar feedback:", error);
      setAlert({
        show: true,
        message: "Hubo un error al enviar tu comentario. Por favor, intenta de nuevo.",
        type: "error"
      });
    }
  };

  const handleCloseWhatsAppQR = () => {
    setShowWhatsAppQR(false);
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false });
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
          
          {/* Formulario adicional para calificaciones bajas */}
          {showFeedbackForm && (
            <div className="feedback-detail-form">
              <h4>Ayúdanos a mejorar</h4>
              <div className="feedback-reason-selector">
                <label htmlFor="feedback-reason">¿Cuál fue el motivo principal?</label>
                <select 
                  id="feedback-reason" 
                  value={feedbackReason} 
                  onChange={(e) => setFeedbackReason(e.target.value)}
                  required
                >
                  <option value="">Selecciona una opción</option>
                  {feedbackReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              
              <div className="feedback-comment-box">
                <label htmlFor="feedback-comment">Comentarios adicionales (opcional)</label>
                <textarea
                  id="feedback-comment"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Cuéntanos más sobre tu experiencia..."
                  rows={4}
                ></textarea>
              </div>
            </div>
          )}
        </div>

        <button
          className={`submit-button ${!rating ? "disabled" : ""}`}
          onClick={handleSubmit}
          disabled={!rating}
        >
          Enviar comentario
        </button>
        <button className="admin-button" onClick={() => navigate("/")}>
          Cambiar sucursal
        </button>
        
        {/* Alert Component */}
        {alert.show && (
          <Alert 
            message={alert.message} 
            type={alert.type} 
            duration={10000} 
            onClose={handleCloseAlert} 
          />
        )}
        
        {/* WhatsApp QR Component */}
        {showWhatsAppQR && <WhatsAppQR onClose={handleCloseWhatsAppQR} />}
      </div>
    </div>
  );
};

export default Survey;