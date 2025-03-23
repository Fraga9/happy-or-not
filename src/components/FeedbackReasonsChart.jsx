import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LabelList 
} from "recharts";

const FeedbackReasonsChart = ({ data }) => {
  // Process data to count occurrences of each reason
  const processDataForReasons = (feedbackData) => {
    const reasonCounts = {
      "Variedad de producto": 0,
      "Orden y limpieza": 0,
      "Actitud del personal": 0,
      "Tiempos de atención": 0,
      "Calidad del producto": 0,
      "Precios": 0,
      "Otro": 0
    };
    
    // Count occurrences of each reason in feedback data
    feedbackData.forEach(item => {
      if (item.motivoInsatisfaccion && reasonCounts.hasOwnProperty(item.motivoInsatisfaccion)) {
        reasonCounts[item.motivoInsatisfaccion] += 1;
      }
    });
    
    // Convert to array format for Recharts
    return Object.keys(reasonCounts).map(reason => ({
      name: reason,
      count: reasonCounts[reason]
    }));
  };

  // Process the data
  const chartData = processDataForReasons(data);
  
  // Sort data by count in descending order to highlight main issues
  chartData.sort((a, b) => b.count - a.count);

  // Custom tooltip to improve readability
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <p className="tooltip-label" style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{label}</p>
          <p className="tooltip-value" style={{ margin: 0 }}>
            <span style={{ color: '#D10D1B' }}>■</span> {payload[0].value} quejas
          </p>
        </div>
      );
    }
    return null;
  };

  // Format x-axis labels to be more readable
  const renderCustomAxisTick = ({ x, y, payload }) => {
    // Truncate long names
    let name = payload.value;
    if (name.length > 12) {
      name = name.slice(0, 10) + '...';
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="middle" 
          fill="#666"
          fontSize={12}
        >
          {name}
        </text>
      </g>
    );
  };

  return (
    <div className="feedback-reasons-chart">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{
            top: 3,
            right: 3,
            left: 3,
            bottom: 60
          }}
          barSize={50}
        >
          <CartesianGrid strokeDasharray="4 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={renderCustomAxisTick}
            tickLine={false}
            axisLine={{ stroke: '#E0E0E0' }}
          />
          <YAxis 
            tickFormatter={(value) => value.toFixed(0)}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={30}
            formatter={(value) => <span style={{ color: '#333', fontSize: '14px', fontWeight: 'bold' }}>{value}</span>}
          />
          <Bar 
            dataKey="count" 
            name="Cantidad de quejas" 
            fill="rgba(240, 33, 47, 0.9)" 
            radius={[4, 4, 0, 0]}
          >
            <LabelList 
              dataKey="count" 
              position="top"
              style={{ 
                fill: '#333',
                fontSize: '12px',
                fontWeight: 'bold'
              }} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Add a caption/description below the chart */}
      <div className="chart-caption" style={{ 
        fontSize: '12px', 
        color: '#666', 
        textAlign: 'center',
        marginTop: '10px'
      }}>
        * Basado en encuestas con calificación de 3 estrellas o menos
      </div>
    </div>
  );
};

export default FeedbackReasonsChart;