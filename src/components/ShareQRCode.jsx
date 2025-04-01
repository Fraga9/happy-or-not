import React, { useRef, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "../styles/shareQRCode.css";

const ShareQRCode = ({ url, sucursal, onClose }) => {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [printing, setPrinting] = useState(false);

  // Función para copiar el enlace
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Función para imprimir el QR en formato vertical
  const handlePrint = () => {
    setPrinting(true);
    
    // Crear una nueva ventana para la impresión
    const printWindow = window.open('', '_blank');
    
    // Contenido HTML para la ventana de impresión
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Sucursal ${sucursal}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
            
            body {
              margin: 0;
              padding: 0;
              font-family: 'Poppins', sans-serif;
              background-color: #f5f7fa;
            }
    
            .print-container {
              width: 100%;
              max-width: 100vw;
              height: 100vh;
              margin: 0 auto;
              padding: 50px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 30px;
              position: relative;
              overflow: hidden;
            }
            
            /* Elementos decorativos inspirados en el proyecto de referencia */
            .print-container::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 200px;
              height: 200px;
              background-color: rgba(240, 33, 47, 0.08);
              clip-path: polygon(0% 0%, 100% 0%, 0% 100%);
              z-index: -1;
            }
            
            .print-container::after {
              content: "";
              position: absolute;
              bottom: 0;
              left: 0;
              width: 300px;
              height: 300px;
              background-color: #f0212f;
              background-image: linear-gradient(45deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.05) 15%, rgba(0,0,0,0.1) 15%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.05) 30%, transparent 40%);
              clip-path: polygon(0% 30%, 100% 100%, 0% 100%);
              z-index: -1;
            }
      


    
            .logo {
              width: 100%;
              max-width: 350px;
              display: block;
              filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
              z-index: 2;
            }
    
            .qr-container {
              background: white;
              border: 12px solid #f0212f;
              border-radius: 20px;
              padding: 25px;
              width: 530px;
              height: 530px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 10px 25px rgba(240,33,47,0.15);
              z-index: 2;
            }
    
            .qr-branch-label {
              position: absolute;
              bottom: -15px;
              left: 50%;
              transform: translateX(-50%);
              background-color: #f0212f;
              color: white;
              font-size: 22px;
              font-weight: 700;
              padding: 8px 25px;
              border-radius: 25px;
              white-space: nowrap;
              box-shadow: 0 4px 15px rgba(240,33,47,0.3);
              z-index: 3;
            }
    
            .instruction-container {
              background: #f0212f;
              border-radius: 15px;
              padding: 15px 30px;
              display: flex;
              align-items: center;
              gap: 15px;
              box-shadow: 0 4px 15px rgba(240,33,47,0.2);
              width: 100%;
              max-width: 400px;
              position: relative; 
              z-index: 2;
            }
    
            .instruction-icon {
              font-size: 28px;
              color: white;
            }
    
            .instruction-text {
              font-size: 28px;
              font-weight: 600;
              color: white;
            }
    
            .footer-logo {
              width: 160px;
              z-index: 2;
            }
            
            
    
            @media print {
              @page {
                size: portrait;
                margin: 0;
              }
              
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
    
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="side-bar"></div>
            <img src="/Promexma.jpeg" alt="Promexma" class="logo" />
            
            <div class="qr-container">
              <svg width="600" height="600" viewBox="0 0 200 200">
                ${document.getElementById('qr-code-svg').querySelector('svg').outerHTML}
              </svg>
              <div class="qr-branch-label">${sucursal}</div>
            </div>
            
            <div class="instruction-container">
              <div class="instruction-icon">📱</div>
              <div class="instruction-text">Califica tu experiencia</div>
            </div>
            
            <img src="/Xpresa.svg" alt="Xpresa" class="footer-logo" />
            
            <button class="no-print" onclick="window.print(); window.close();" 
              style="position: fixed; top: 20px; right: 20px; padding: 12px 24px; background: #f0212f; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: 'Poppins', sans-serif; font-weight: 600; z-index: 10;">
              Imprimir
            </button>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `;
  
    
    // Escribir el contenido en la nueva ventana
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Manejar el evento de cierre de la ventana de impresión
    printWindow.onafterprint = function() {
      printWindow.close();
      setPrinting(false);
    };
    
    setTimeout(() => {
      setPrinting(false);
    }, 3000);
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
            className={`print-button ${printing ? 'loading' : ''}`}
            onClick={handlePrint}
            disabled={printing}
          >
            {printing ? 'Preparando impresión...' : 'Imprimir flyer'}
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