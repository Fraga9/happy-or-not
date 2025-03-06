import React from "react";
import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const RatingDistribution = ({ data }) => {
  const chartData = {
    labels: ["Muy malo", "Malo", "Regular", "Bueno", "Excelente"],
    datasets: [
      {
        label: "Número de respuestas",
        data: [
          data[1] || 0,
          data[2] || 0,
          data[3] || 0,
          data[4] || 0,
          data[5] || 0
        ],
        backgroundColor: [
          "rgba(165,165,165,0.9)",
          "rgba(121,121,121,0.9)",
          "rgba(77, 77, 79, 0.9)",
          "rgba(240, 33, 47, 0.9)",
          "rgba(209, 13, 27, 0.9)"
        ],
        borderColor: [
          "rgb(165, 165, 165)",
          "rgb(121, 121, 121)",
          "rgb(77, 77, 77)",
          "rgb(240, 33, 47)",
          "rgb(209, 13, 27)"
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
        display: false,
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div style={{ height: "300px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RatingDistribution;