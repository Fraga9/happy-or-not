import React from "react";
import "../styles/whatsappQR.css"; // Importa los estilos CSS
import qrCodeImage from "../assets/whatsapp-qr.jpeg"; // Importa la imagen del código QR

const WhatsAppQR = ({ onClose }) => {
  return (
    <div className="whatsapp-qr-overlay">
      <div className="whatsapp-qr-container">
        <h3>Contáctanos por WhatsApp</h3>
        <p>Escanea el código QR o haz click en la imagen para hablar con un representante de servicio al cliente.</p>
        <a href="https://wa.me/qr/GHHARRPFMQDTE1" target="_blank" rel="noopener noreferrer">
          <img src={qrCodeImage} alt="Código QR de WhatsApp" className="whatsapp-qr-image" />
        </a>
        <button className="close-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default WhatsAppQR;