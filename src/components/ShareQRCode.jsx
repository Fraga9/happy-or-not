import React, { useRef, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "../styles/shareQRCode.css";

const ShareQRCode = ({ url, sucursal, onClose }) => {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Función para descargar el QR
  const handleDownload = () => {
    setDownloading(true);
    
    // Obtener el elemento SVG
    const svgElement = document.getElementById('qr-code-svg').querySelector('svg');
    if (!svgElement) {
      setDownloading(false);
      return;
    }
    
    // Crear un canvas temporal
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Establecer dimensiones del canvas con un borde extra
    canvas.width = 240;
    canvas.height = 240;
    
    // Crear una imagen basada en el SVG
    const img = new Image();
    
    // Convertir SVG a string y codificarlo en base64
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Cuando la imagen cargue, dibujarla en el canvas y crear la descarga
    img.onload = function() {
      // Dibujar fondo con degradado
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f9f9f9');
      gradient.addColorStop(1, '#ffffff');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar borde estilizado
      context.strokeStyle = '#f0212f';
      context.lineWidth = 8;
      context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
      
      // Dibujar la imagen del QR centrada
      context.drawImage(img, 20, 20, canvas.width - 40, canvas.height - 40);
      
      // Añadir texto de la sucursal
      context.font = 'bold 14px Arial';
      context.textAlign = 'center';
      context.fillStyle = '#000000';
      context.fillText(`Sucursal ${sucursal}`, canvas.width / 2, canvas.height - 12);
      
      // Convertir canvas a PNG
      const pngUrl = canvas.toDataURL('image/png');
      
      // Crear enlace de descarga
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_Sucursal_${sucursal}.png`;
      
      // Simular clic para iniciar descarga
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Liberar el objeto URL
      URL.revokeObjectURL(svgUrl);
      setDownloading(false);
    };
    
    // Asignar la fuente de la imagen al URL del SVG
    img.src = svgUrl;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="qr-overlay">
      <div className="qr-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="qr-header">
          <h3>Comparte esta sucursal</h3>
          <p>Escanea este código QR con tu cámara para acceder a la encuesta</p>
        </div>
        
        <div className="qr-container">
          <div className="qr-code-wrapper" id="qr-code-svg">
            <div className="qr-scanner-animation"></div>
            <QRCodeSVG 
              value={url}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={true}
              imageSettings={{
                src: "/Xpresa.svg",
                x: undefined,
                y: undefined,
                height: 45,
                width: 55,
                excavate: true,
              }}
            />
            <div className="qr-branch-label">{sucursal}</div>
          </div>
        </div>
        
        <div className="qr-instructions">
          <div className="instruction">
            <div className="instruction-icon">📱</div>
            <div className="instruction-text">
              <strong>Escanea</strong>
              <span>Usa la cámara de tu celular</span>
            </div>
          </div>
          <div className="instruction">
            <div className="instruction-icon">📝</div>
            <div className="instruction-text">
              <strong>Califica</strong>
              <span>Comparte tu experiencia</span>
            </div>
          </div>
        </div>
        
        <div className="qr-actions">
          <button 
            className={`download-button ${downloading ? 'loading' : ''}`}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Descargando...' : 'Descargar QR'}
          </button>
          <button 
            className={`share-button ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied ? '¡Enlace copiado!' : 'Copiar enlace'}
          </button>
        </div>
        
        <div className="qr-footer">
          <p>Ayúdanos a mejorar nuestro servicio compartiendo esta encuesta</p>
        </div>
      </div>
    </div>
  );
};

export default ShareQRCode;