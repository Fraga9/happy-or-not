import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: "Calificación Promedio",
        data: data.map(item => item.rating),
        fill: false,
        backgroundColor: "rgba(240, 33, 47, 0.9)",
        borderColor: "rgb(240, 33, 47)",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top"
      }
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        title: {
          display: true,
          text: "Calificación"
        }
      },
      x: {
        title: {
          display: true,
          text: "Fecha"
        }
      }
    }
  };

  return (
    <div style={{ height: "300px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;