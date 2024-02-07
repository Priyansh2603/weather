import React, { useContext, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Appstate } from './App';
import { Chart, registerables } from 'chart.js'; // Import Chart.js and registerables
import 'chartjs-adapter-date-fns'; // Import date-fns adapter for Chart.js

// Register necessary Chart.js components
Chart.register(...registerables);

const WeatherChart = () => {
  // Extracting hourly data
  const { weatherData } = useContext(Appstate);
  console.log("Here Weather", weatherData);
  const hourlyData = weatherData.hourly;

  // Create a ref for the chart canvas element
  const chartRef = useRef(null);

  // Create and destroy the chart on component mount and unmount
  useEffect(() => {
    if (chartRef.current) {
      const newChart = new Chart(chartRef.current, {
        type: 'bubble',
        data: {
          labels: hourlyData.time.map(timestamp => new Date(timestamp)),
          datasets: [
            {
              label: 'Temperature (°C)',
              data: hourlyData.temperature_2m,
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Temperature (°C)',
              },
            },
          },
        },
      });

      return () => {
        newChart.destroy(); // Ensure the chart is destroyed when component unmounts
      };
    }
  }, [hourlyData]);

  return (
    <div>
      <h2>Hourly Temperature</h2>
      <canvas ref={chartRef} /> {/* Render the chart canvas */}
    </div>
  );
};

export default WeatherChart;
