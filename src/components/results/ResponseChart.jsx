import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'; // Importing necessary components from Recharts

// ResponseChart component that takes 'data' as a prop and renders a bar chart
const ResponseChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}> {/* Makes the chart responsive */}
      <BarChart
        data={data} // Data for the chart
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }} // Margin around the chart
      >
        <CartesianGrid strokeDasharray="3 3" /> {/* Adds a grid to the chart with dashed lines */}
        
        <XAxis dataKey="answer" /> {/* X-axis represents the 'answer' key in the data */}
        
        <YAxis /> {/* Y-axis for the count */}
        
        {/* Tooltip styling when hovering over bars */}
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff', // White background for the tooltip
            border: '1px solid #6c63ff', // Border with a color to match the theme
            borderRadius: '8px', // Rounded corners for the tooltip
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          }}
        />
        
        <Legend /> {/* Adds a legend to the chart */}
        
        {/* Bar component to show data as bars */}
        <Bar
          dataKey="count" // Bar represents the 'count' from the data
          fill="#6c63ff" // Fill color for the bars
          radius={[4, 4, 0, 0]} // Rounded corners for the top of the bars
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResponseChart;
