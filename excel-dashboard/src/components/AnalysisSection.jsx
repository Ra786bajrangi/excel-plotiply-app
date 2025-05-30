import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Plot from 'react-plotly.js';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const BAR_FILL = 'url(#barGradient)';
const LINE_STROKE = '#FF6B6B';

export default function AnalysisComponent() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const chartRef = useRef();

  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [zAxis, setZAxis] = useState('');
  const [chartType, setChartType] = useState('Bar');

  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [aiInsight, setAiInsight] = useState('');

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('excelData');
      const storedColumns = localStorage.getItem('columns');

      if (storedData && storedColumns) {
        setExcelData(JSON.parse(storedData));
        setColumns(JSON.parse(storedColumns));
      } else {
        console.warn('No data found in localStorage. Please upload an Excel file.');
      }
    } catch (error) {
      console.error('Error parsing stored data:', error);
    }
  }, []);

  const getChartData = () => {
    if (!xAxis || !yAxis || !excelData.length) return [];

    return excelData
      .filter(row => row[xAxis] !== undefined && row[yAxis] !== undefined)
      .map(row => ({
        [xAxis]: row[xAxis],
        [yAxis]: isNaN(row[yAxis]) ? 0 : Number(row[yAxis]),
        ...(zAxis && { [zAxis]: isNaN(row[zAxis]) ? 0 : Number(row[zAxis]) })
      }));
  };

  const handleDownload = async (type) => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const dataUrl = canvas.toDataURL('image/png');

    if (type === 'png') {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = dataUrl;
      link.click();
    } else if (type === 'pdf') {
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, 'PNG', 10, 10, 180, 100);
      pdf.save('chart.pdf');
    }
  };
  
  const generateInsight = (data) => {
    if (!data.length || !xAxis || !yAxis) return '';

    const values = data.map(item => item[yAxis]);
    const total = values.reduce((sum, val) => sum + val, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    const maxItem = data.find(item => item[yAxis] === max);
    const minItem = data.find(item => item[yAxis] === min);

    if (chartType === 'Pie') {
      return `The pie chart shows the contribution of each ${xAxis} to the total ${yAxis}. The highest contribution is from "${maxItem?.[xAxis]}" (${max}), while the lowest is "${minItem?.[xAxis]}" (${min}).`;
    }

    if (chartType === 'Line') {
      return `The line chart shows trends in ${yAxis} across ${xAxis}. The average value is ${avg.toFixed(2)}. The peak is at "${maxItem?.[xAxis]}" with ${max}, and the lowest at "${minItem?.[xAxis]}" with ${min}.`;
    }

    if (chartType === '3D Bar') {
      return `The 3D bar chart visualizes ${yAxis} and ${zAxis} grouped by ${xAxis}. The highest value is ${max} (${maxItem?.[xAxis]}), the lowest is ${min} (${minItem?.[xAxis]}), and the average is ${avg.toFixed(2)}.`;
    }

    if (chartType === '3D Scatter') {
      return `The 3D scatter plot shows the relationship between ${xAxis}, ${yAxis}, and ${zAxis}. The data points are distributed across these three dimensions.`;
    }

    // Default (Bar)
    return `The bar chart visualizes ${yAxis} grouped by ${xAxis}. The highest value is ${max} (${maxItem?.[xAxis]}), the lowest is ${min} (${minItem?.[xAxis]}), and the average is ${avg.toFixed(2)}.`;
  };

  useEffect(() => {
    const data = getChartData();
    const insight = generateInsight(data);
    setAiInsight(insight);
  }, [xAxis, yAxis, zAxis, chartType, excelData]);

  const renderChart = () => {
    const data = getChartData();
    if (!data.length) return <p className="text-gray-500 text-center py-20">No valid data for chart</p>;

    switch (chartType) {
      case 'Line':
        return (
          <LineChart data={data}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="100%" stopColor="#4ECDC4" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey={xAxis} tick={{ fill: '#4A5568' }} />
            <YAxis tick={{ fill: '#4A5568' }} />
            <Tooltip contentStyle={{ backgroundColor: '#2D3748', borderRadius: '8px', color: '#F7FAFC' }} />
            <Legend />
            <Line
              type="monotone"
              dataKey={yAxis}
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={{ fill: '#FF6B6B', r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );

      case 'Pie':
        return (
          <PieChart>
            <Tooltip contentStyle={{ backgroundColor: '#2D3748', borderRadius: '8px', color: '#F7FAFC' }} />
            <Legend />
            <Pie
              data={data}
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={60}
              paddingAngle={5}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );

      case '3D Bar':
        return (
          <Plot
            data={[
              {
                type: 'bar3d',
                x: data.map(item => item[xAxis]),
                y: data.map(item => item[yAxis]),
                z: data.map(item => item[zAxis]),
                colorscale: 'Viridis',
                opacity: 0.8
              }
            ]}
            layout={{
              title: `${xAxis} vs ${yAxis} vs ${zAxis}`,
              scene: {
                xaxis: { title: xAxis },
                yaxis: { title: yAxis },
                zaxis: { title: zAxis }
              },
              margin: { l: 0, r: 0, b: 0, t: 30 }
            }}
            style={{ width: '100%', height: '100%' }}
          />
        );

      case '3D Scatter':
        return (
          <Plot
            data={[
              {
                type: 'scatter3d',
                mode: 'markers',
                x: data.map(item => item[xAxis]),
                y: data.map(item => item[yAxis]),
                z: data.map(item => item[zAxis]),
                marker: {
                  size: 5,
                  color: data.map(item => item[yAxis]),
                  colorscale: 'Viridis',
                  opacity: 0.8
                }
              }
            ]}
            layout={{
              title: `${xAxis} vs ${yAxis} vs ${zAxis}`,
              scene: {
                xaxis: { title: xAxis },
                yaxis: { title: yAxis },
                zaxis: { title: zAxis }
              },
              margin: { l: 0, r: 0, b: 0, t: 30 }
            }}
            style={{ width: '100%', height: '100%' }}
          />
        );

      case 'Bar':
      default:
        return (
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey={xAxis} tick={{ fill: '#4A5568' }} />
            <YAxis tick={{ fill: '#4A5568' }} />
            <Tooltip contentStyle={{ backgroundColor: '#2D3748', borderRadius: '8px', color: '#F7FAFC' }} />
            <Legend />
            <Bar dataKey={yAxis} fill={BAR_FILL} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Chart Controls</h2>
        <div className="space-y-4">
          {/* Chart Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['Bar', 'Line', 'Pie', '3D Bar', '3D Scatter'].map(type => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`py-2 px-3 rounded-md transition ${chartType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* X-Axis Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">X-Axis</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={xAxis}
              onChange={e => setXAxis(e.target.value)}
            >
              {columns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>

          {/* Y-Axis Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Y-Axis</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={yAxis}
              onChange={e => setYAxis(e.target.value)}
            >
              {columns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>

          {/* Z-Axis Selector (only for 3D charts) */}
          {(chartType === '3D Bar' || chartType === '3D Scatter') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Z-Axis</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={zAxis}
                onChange={e => setZAxis(e.target.value)}
              >
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>
          )}

          {/* Download Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => handleDownload('png')} className="bg-green-600 text-white py-2 rounded-md">Download PNG</button>
            <button onClick={() => handleDownload('pdf')} className="bg-purple-600 text-white py-2 rounded-md">Download PDF</button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Data Visualization</h2>
          <div className="text-sm text-gray-500">
            {chartType} Chart: {xAxis} vs {yAxis} 
            {(chartType === '3D Bar' || chartType === '3D Scatter') && ` vs ${zAxis}`}
          </div>
        </div>
        <div ref={chartRef} className="w-full h-96">
          {chartType.startsWith('3D') ? (
            renderChart()
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      {/* ai insight*/}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">📊 AI Insight</h2>
        <p className="text-gray-700 text-base">{aiInsight || 'Please select X and Y axes to view insights.'}</p>
      </div>
    </div>
  );
}