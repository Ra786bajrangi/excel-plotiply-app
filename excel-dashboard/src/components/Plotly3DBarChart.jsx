import Plot from 'react-plotly.js';

export default function Plotly3DBarChart({ data, x, y, z, color, title, theme }) {
  const isDark = theme === 'dark';

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
    title: {
      text: title,
      font: { color: isDark ? '#ffffff' : '#000000' },
    },
    paper_bgcolor: isDark ? '#0f172a' : '#ffffff',
    plot_bgcolor: isDark ? '#0f172a' : '#ffffff',
    font: { color: isDark ? '#f3f4f6' : '#111827' },
    scene: {
      bgcolor: isDark ? '#0f172a' : '#ffffff',
      xaxis: {
        title: x,
        color: isDark ? '#ffffff' : '#000000',
        gridcolor: isDark ? '#334155' : '#e5e7eb',
        zerolinecolor: isDark ? '#475569' : '#9ca3af',
      },
      yaxis: {
        title: y,
        color: isDark ? '#ffffff' : '#000000',
        gridcolor: isDark ? '#334155' : '#e5e7eb',
        zerolinecolor: isDark ? '#475569' : '#9ca3af',
      },
      zaxis: {
        title: z,
        color: isDark ? '#ffffff' : '#000000',
        gridcolor: isDark ? '#334155' : '#e5e7eb',
        zerolinecolor: isDark ? '#475569' : '#9ca3af',
      }
    },
    height: 300,
    margin: { l: 0, r: 0, b: 0, t: 50 }
  };

  return <Plot data={plotData} layout={layout} config={{ responsive: true }} />;
}
