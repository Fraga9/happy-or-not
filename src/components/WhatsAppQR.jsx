import React from "react";
import "../styles/whatsappQR.css";
import qrCodeImage from "../assets/whatsapp-qr.jpeg";

const WhatsAppQR = ({ onClose }) => {
  return (
    <div className="whatsapp-qr-overlay">
      <div className="whatsapp-qr-container">
        <div className="qr-header">
          <h3>Contáctanos por WhatsApp</h3>
          <p className="representative-name">Asistencia de Servicio al Cliente</p>
        </div>
        
        <p className="scan-instructions">
          <strong>ESCANEA EL CÓDIGO QR O HAZ CLICK EN LA IMAGEN</strong>
        </p>
        
        <div className="qr-image-container">
          <a href="https://wa.me/qr/GHHARRPFMQDTE1" target="_blank" rel="noopener noreferrer" className="qr-link">
            <img src={qrCodeImage} alt="Código QR de WhatsApp" className="whatsapp-qr-image" />
          </a>
        </div>
        
        <p className="appreciation-note">
          Valoramos tu opinión y queremos mejorar tu experiencia.
        </p>
        
        <button className="close-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default WhatsAppQR;