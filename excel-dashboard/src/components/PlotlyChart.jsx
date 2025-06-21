import React from 'react';
import Plot from 'react-plotly.js';
import Plotly3DBarChart from './Plotly3DBarChart';

const PlotlyChart = ({ type, data, x, y, z, color, title, theme }) => {
  if (!data || data.length === 0 || !x || !y) {
    return <p className="text-gray-500">No data to display</p>;
  }

  const isDark = theme === 'dark';

  // Custom component for 3D Bar (already animated and styled)
  if (type === '3d-bar') {
    return (
      <div className={`w-full max-w-4xl h-[500px] overflow-hidden rounded-xl shadow p-4 mx-auto ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <Plotly3DBarChart data={data} x={x} y={y} z={z} color={color} title={title} theme={theme} />
      </div>
    );
  }

  const get3DData = () => {
    switch (type) {
      case '3d-scatter':
        return [{
          x: data.map(row => row[x]),
          y: data.map(row => row[y]),
          z: data.map(row => z ? row[z] : 0),
          mode: 'markers',
          type: 'scatter3d',
          marker: {
            size: 5,
            color: color || 'blue',
            opacity: 0.8
          }
        }];
      case '3d-bubble':
        return [{
          x: data.map(row => row[x]),
          y: data.map(row => row[y]),
          z: data.map(row => z ? row[z] : 0),
          mode: 'markers',
          type: 'scatter3d',
          marker: {
            size: data.map(row => z ? Math.abs(row[z]) : 10),
            color: color || 'red',
            sizemode: 'diameter',
            opacity: 0.7
          }
        }];
      default:
        return [];
    }
  };

  const layout = {
    title: {
      text: title || '',
      font: { size: 18, color: isDark ? '#ffffff' : '#000000' }
    },
    paper_bgcolor: isDark ? '#0f172a' : '#ffffff',
    plot_bgcolor: isDark ? '#0f172a' : '#ffffff',
    font: { color: isDark ? '#f1f5f9' : '#111827' },
    margin: { l: 20, r: 20, b: 20, t: 40 },
    scene: {
      bgcolor: isDark ? '#0f172a' : '#ffffff',
      xaxis: {
        title: x,
        color: isDark ? '#ffffff' : '#000000',
        gridcolor: isDark ? '#334155' : '#e5e7eb',
        zerolinecolor: isDark ? '#475569' : '#9ca3af'
      },
      yaxis: {
        title: y,
        color: isDark ? '#ffffff' : '#000000',
        gridcolor: isDark ? '#334155' : '#e5e7eb',
        zerolinecolor: isDark ? '#475569' : '#9ca3af'
      },
      zaxis: {
        title: z || 'Z',
        color: isDark ? '#ffffff' : '#000000',
        gridcolor: isDark ? '#334155' : '#e5e7eb',
        zerolinecolor: isDark ? '#475569' : '#9ca3af'
      },
    },
    autosize: true,
  };

  return (
    <div className={`w-full max-w-4xl h-[500px] overflow-hidden rounded-xl shadow p-4 mx-auto ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <Plot
        data={get3DData()}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
        config={{ responsive: true }}
      />
    </div>
  );
};

export default PlotlyChart;
