import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const SatisfactionChart = ({ data }) => {
  // Calcular porcentajes de satisfacción
  const total = data.totalResponses || 0;
  const positive = (data.ratingCounts[4] || 0) + (data.ratingCounts[5] || 0);
  const neutral = data.ratingCounts[3] || 0;
  const negative = (data.ratingCounts[1] || 0) + (data.ratingCounts[2] || 0);
  
  const chartData = {
    labels: ["Positivo", "Neutral", "Negativo"],
    datasets: [
      {
        data: [
          total ? (positive / total) * 100 : 0,
          total ? (neutral / total) * 100 : 0,
          total ? (negative / total) * 100 : 0
        ],
        backgroundColor: [
          "rgba(240, 33, 47, 0.9)",
          "rgba(165,165,165,0.9)" ,
          "rgba(77, 77, 79, 0.9)"
          
        ],
        borderColor: [
          "rgba(240, 33, 47, 1)",
          "rgba(165,165,165,1)",
          "rgba(77, 77, 79, 1)"
          
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw.toFixed(1);
            return `${context.label}: ${value}%`;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: "300px" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default SatisfactionChart;