import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/selectBranch.css";
// Asumiendo que tienes un logo de la empresa en la carpeta de assets
import companyLogo from "/Promexma.jpeg";

const regions = {
  "Centro": [
    "Tula", "Tezoyuca", "Querétaro", "Purúandiro", "Pachuca", "Ometepec", "Ixtapa Zihuatanejo", "Acapulco 2"
  ],
  "Chiapas": [
    "Tuxtla", "Tonalá", "Tapachula", "San Cristobal", "Palenque", "Ocosingo", "Comitán"
  ],
  "Metro": [
    "Tultitlán", "Tlalmanalco", "Texcoco", "Recursos Hidráulicos", "Nicolas Romero", "Milpa Alta", "Izcalli", "Ixtapaluca", "Chimalhuacan", "Atizapan"
  ],
  "Noreste": [
    "Torreón", "San Luis Potosí", "San Luis de la Paz", "Salvatierra", "Salinas", "Monterrey", "Mante", "León", "Irapuato", "Aguascalientes S-XXI"
  ],
  "Oaxaca Norte": [
    "Viguera", "Tlaxcala", "Tlacolula 2", "San Martín", "Oaxaca", "Miahuatlán 2", "Juchitán", "Chipilo"
  ],
  "Pacifico": [
    "Vallarta", "Tuxpan", "Tlajomulco", "San Juan de Los Lagos", "San José del Cabo", "Morelos", "Mazatlán", "Américas"
  ],
  "Península": [
    "Playa del Carmen", "Mérida 2", "Mérida", "Chetumal", "Cd. Del Carmen", "Cancún", "Campeche"
  ],
  "Veracruz-Tabasco": [
    "Xalapa", "Villahermosa", "Veracruz", "Orizaba"
  ]
};

export default function SelectBranch() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedBranch = localStorage.getItem("selectedBranch");
    const savedRegion = localStorage.getItem("selectedRegion");
    if (savedBranch) setSelectedBranch(savedBranch);
    if (savedRegion) setSelectedRegion(savedRegion);
  }, []);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedBranch(""); // Reiniciar sucursal al cambiar región
    localStorage.setItem("selectedRegion", region);
  };

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    localStorage.setItem("selectedBranch", branch);
  };

  const handleContinue = () => {
    if (!selectedBranch) {
      alert("Por favor, selecciona una sucursal.");
      return;
    }
    // Navigate to survey with branch name in the URL
    navigate(`/survey/${encodeURIComponent(selectedBranch)}`);
  };

  const handleAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="select-branch-container">
      <div className="select-branch-content">
        <div className="company-branding">
          <img src={companyLogo} alt="Logo de la empresa" className="company-logo" />
        </div>

        <div className="branch-header">
          <h2>Selecciona tu sucursal</h2>
          <p>Elige la sucursal para la que deseas iniciar la encuesta de satisfacción</p>
        </div>

        <div className="branch-selector">
          <label htmlFor="region-select">Región</label>
          <div className="select-wrapper">
            <select 
              id="region-select"
              className="branch-select-field" 
              onChange={handleRegionChange} 
              value={selectedRegion}
            >
              <option value="">Elige una región</option>
              {Object.keys(regions).map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="branch-selector">
          <label htmlFor="branch-select">Sucursal</label>
          <div className="select-wrapper">
            <select 
              id="branch-select"
              className="branch-select-field" 
              onChange={handleBranchChange} 
              value={selectedBranch} 
              disabled={!selectedRegion} // Deshabilitar si no se ha seleccionado una región
            >
              <option value="">Elige una sucursal</option>
              {selectedRegion && regions[selectedRegion].map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          className={`continue-button ${!selectedBranch ? 'disabled' : ''}`}
          onClick={handleContinue} 
          disabled={!selectedBranch}
        >
          Continuar
        </button>
        
        <div className="admin-link">
          <button onClick={handleAdmin} className="admin-button">
            Acceso Administrador
          </button>
        </div>
      </div>
    </div>
  );
}