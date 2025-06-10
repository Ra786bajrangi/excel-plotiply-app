import React from 'react';
import Plot from 'react-plotly.js';
import Plotly3DBarChart from './Plotly3DBarChart';

const PlotlyChart = ({ type, data, x, y, z, color, title }) => {
  if (!data || data.length === 0 || !x || !y) {
    return <p className="text-gray-500">No data to display</p>;
  }

  // Custom component for 3D Bar
  if (type === '3d-bar') {
    return (
      <div className="w-full max-w-4xl h-[500px] overflow-hidden rounded-xl shadow bg-white p-4 mx-auto">
        <Plotly3DBarChart data={data} x={x} y={y} z={z} color={color} title={title} />
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
    title: { text: title || '', font: { size: 18 } },
    margin: { l: 20, r: 20, b: 20, t: 40 },
    scene: {
      xaxis: { title: x },
      yaxis: { title: y },
      zaxis: { title: z || 'Z' },
    },
    autosize: true,
  };

  return (
    <div className="w-full max-w-4xl h-[500px] overflow-hidden rounded-xl shadow bg-white p-4 mx-auto">
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
