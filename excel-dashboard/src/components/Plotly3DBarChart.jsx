import Plot from 'react-plotly.js';

export default function Plotly3DBarChart({ data, x, y, z, color, title }) {
  const plotData = data.map((row, index) => ({
    type: 'scatter3d',
    mode: 'lines',
    x: [row[x], row[x]],
    y: [row[y], row[y]],
    z: [0, row[z]],
    line: {
      color: color || 'blue',
      width: 10,
    },
    name: `Bar ${index + 1}`
  }));

  const layout = {
    title,
    scene: {
      xaxis: { title: x },
      yaxis: { title: y },
      zaxis: { title: z }
    },
    height: 300,
    margin: { l: 0, r: 0, b: 0, t: 50 }
  };

  return <Plot data={plotData} layout={layout} config={{ responsive: true }} />;
}
