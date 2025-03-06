import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllFeedback } from "../services/firebaseService";
import SatisfactionChart from "./SatisfactionChart";
import RatingDistribution from "./RatingDistribution";
import TrendChart from "./TrendChart";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [dateRange, setDateRange] = useState("month");
  const navigate = useNavigate();

  // Recuperar datos desde Firebase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchAllFeedback();
        
        // Filtrar por rango de fechas
        const now = new Date();
        let startDate;
        
        if (dateRange === "week") {
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
        } else if (dateRange === "month") {
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
        } else if (dateRange === "year") {
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
        }
        
        const filteredByDate = fetchedData.filter(item => {
          const itemDate = new Date(item.timeStamp);
          return itemDate >= startDate;
        });
        
        setFeedbackData(filteredByDate);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [dateRange]);

  // Obtener todas las sucursales únicas del feedback
  const branches = ['all', ...new Set(feedbackData.map(item => item.sucursal).filter(Boolean))];
  
  // Filtrar datos según la sucursal seleccionada
  const filteredData = selectedBranch === "all" 
    ? feedbackData 
    : feedbackData.filter(item => item.sucursal === selectedBranch);

  // Calcular estadísticas
  const calculateStats = (data) => {
    if (!data.length) return { avgRating: 0, totalResponses: 0, ratingCounts: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0} };
    
    const totalRating = data.reduce((sum, item) => {
      const rating = Number(item.rating);
      return isNaN(rating) ? sum : sum + rating;
    }, 0);
    
    const avgRating = totalRating / data.length;
    
    const ratingCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    data.forEach(item => {
      const rating = Number(item.rating);
      if (!isNaN(rating) && rating >= 1 && rating <= 5) {
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
      }
    });
    
    return {
      avgRating: parseFloat(avgRating.toFixed(1)) || 0,
      totalResponses: data.length,
      ratingCounts
    };
  };

  // Procesar datos para gráficas de tendencia
  const processDataForTrend = (data) => {
    let groupingFunction;

    switch (dateRange) {
      case "week":
        groupingFunction = (date) => {
          const d = new Date(date);
          return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        };
        break;
      case "month":
        groupingFunction = (date) => {
          const d = new Date(date);
          return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        };
        break;
      case "year":
        groupingFunction = (date) => {
          const d = new Date(date);
          return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        };
        break;
      default:
        groupingFunction = (date) => {
          const d = new Date(date);
          return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        };
    }

    // Agrupar por período
    const groupedData = {};
    
    data.forEach(item => {
      try {
        if (!item.timeStamp) return;
        
        const timeKey = groupingFunction(item.timeStamp);
        const rating = Number(item.rating);
        
        if (isNaN(rating)) return;
        
        if (!groupedData[timeKey]) {
          groupedData[timeKey] = { sum: 0, count: 0 };
        }
        groupedData[timeKey].sum += rating;
        groupedData[timeKey].count += 1;
      } catch (error) {
        console.error("Error procesando item:", item, error);
      }
    });

    // Convertir a array para el gráfico
    return Object.keys(groupedData).map(key => {
      const average = groupedData[key].sum / groupedData[key].count;
      return {
        date: key,
        rating: isNaN(average) ? 0 : parseFloat(average.toFixed(1))
      };
    }).sort((a, b) => {
      // Ordenar por fecha
      if (dateRange === "year") {
        const [monthA, yearA] = a.date.split('/').map(Number);
        const [monthB, yearB] = b.date.split('/').map(Number);
        
        if (yearA !== yearB) return yearA - yearB;
        return monthA - monthB;
      } else {
        const [dayA, monthA] = a.date.split('/').map(Number);
        const [dayB, monthB] = b.date.split('/').map(Number);
        
        if (monthA !== monthB) return monthA - monthB;
        return dayA - dayB;
      }
    });
  };

  const stats = calculateStats(filteredData);
  const trendData = processDataForTrend(filteredData);
  
  // Calcular respuestas positivas de manera segura
  const positiveResponses = (stats.ratingCounts[5] || 0) + (stats.ratingCounts[4] || 0);

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard">
        <div className="dashboard-top-section">
          <div className="dashboard-header">
            <div className="header-left">
              <h1>Dashboard Xpresa</h1>
            </div>
            <div className="header-right">
              <div className="filter-container">
                <div className="filter-group modern">
                  <i className="filter-icon fa fa-building"></i>
                  <label htmlFor="branch-filter">Sucursal:</label>
                  <select 
                    id="branch-filter"
                    className="styled-select"
                    value={selectedBranch} 
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option value="all">Todas</option>
                    {branches.filter(b => b !== 'all').map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
                
                <div className="filter-group modern">
                  <i className="filter-icon fa fa-calendar"></i>
                  <label htmlFor="date-filter">Período:</label>
                  <select 
                    id="date-filter"
                    className="styled-select"
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="week">Última semana</option>
                    <option value="month">Último mes</option>
                    <option value="year">Último año</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>
              
              <button className="navigation-button" onClick={() => navigate("/")}>
                Ir a Encuesta
              </button>
            </div>
          </div>
        </div>
    
        {loading ? (
          <div className="loading-indicator">Cargando datos...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="dashboard-content">
            <div className="dashboard-main-section">
              <div className="dashboard-left-column">
                <div className="stats-cards">
                  <div className="stat-card">
                    <h3>Calificación Promedio</h3>
                    <div className="stat-value">{stats.avgRating}</div>
                    <div className="stat-rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span 
                          key={i} 
                          className={`star ${i < Math.round(stats.avgRating) ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Total de Respuestas</h3>
                    <div className="stat-value">{stats.totalResponses}</div>
                    <div className="stat-label">encuestas recibidas</div>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Nivel de Satisfacción</h3>
                    <div className="stat-value">
                      {stats.avgRating >= 4 ? '😊 Alto' : 
                       stats.avgRating >= 3 ? '😐 Medio' : '😞 Bajo'}
                    </div>
                    <div className="stat-label">
                      {positiveResponses} respuestas positivas
                    </div>
                  </div>
                </div>
                
                <div className="chart-container">
                  <h3>Distribución de Calificaciones</h3>
                  <RatingDistribution data={stats.ratingCounts} />
                </div>
              </div>
              
              <div className="dashboard-right-column">
                <div className="chart-container">
                  <h3>Satisfacción General</h3>
                  <SatisfactionChart data={stats} />
                </div>
                
                <div className="chart-container">
                  <h3>Tendencia de Satisfacción</h3>
                  {trendData.length > 0 ? (
                    <TrendChart data={trendData} />
                  ) : (
                    <div className="no-data-message">No hay datos suficientes para mostrar tendencias</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;