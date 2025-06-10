 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

import PlotlyChart from './PlotlyChart';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Scatter,
  Bubble
} from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';
import AIInsightData from './AiInsightData';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

export default function AnalyticsDashboard() {
  const { theme } = useTheme();
 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('2d');
  const [chartType, setChartType] = useState('bar');
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedX, setSelectedX] = useState('');
  const [selectedY, setSelectedY] = useState('');
  const [selectedZ, setSelectedZ] = useState('');
  const [chartTitle, setChartTitle] = useState('My Chart');
  const [chartColor, setChartColor] = useState('#3b82f6');
 

  const twoDCharts = [
    { id: 'bar', name: 'Bar Chart' },
    { id: 'line', name: 'Line Chart' },
    { id: 'pie', name: 'Pie Chart' },
    { id: 'doughnut', name: 'Doughnut Chart' },
    { id: 'scatter', name: 'Scatter Plot' },
    { id: 'bubble', name: 'Bubble Chart' }
  ];

  const threeDCharts = [
    { id: '3d-bar', name: '3D Bar Chart' },
    { id: '3d-scatter', name: '3D Scatter Plot' },
    { id: '3d-bubble', name: '3D Bubble Chart' }
  ];

  useEffect(() => {
    const storedData = localStorage.getItem('excelData');
    const storedColumns = localStorage.getItem('columns');

    if (storedData && storedColumns) {
      try {
        setExcelData(JSON.parse(storedData));
        const parsedColumns = JSON.parse(storedColumns);
        setColumns(parsedColumns);

        if (parsedColumns.length > 0) {
          setSelectedX(parsedColumns[0]);
          if (parsedColumns.length > 1) setSelectedY(parsedColumns[1]);
          if (parsedColumns.length > 2) setSelectedZ(parsedColumns[2]);
        }
      } catch (error) {
        console.error('Error parsing stored data:', error);
        navigate('/excel-dashboard');
      }
    } else {
      navigate('/excel-dashboard');
    }
  }, [navigate]);

  const prepareChartData = () => {
    if (!selectedX || !selectedY || excelData.length === 0) return { labels: [], datasets: [] };

    const labels = excelData.map(row => row[selectedX]);

    if (chartType === 'pie' || chartType === 'doughnut') {
      return {
        labels,
        datasets: [{
          label: selectedY,
          data: excelData.map(row => Number(row[selectedY])),
          backgroundColor: labels.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`),
          borderWidth: 1
        }]
      };
    }

    if (chartType.includes('bubble')) {
      return {
        datasets: [{
          label: `${selectedY} vs ${selectedX}`,
          data: excelData.map(row => ({
            x: Number(row[selectedX]),
            y: Number(row[selectedY]),
            r: selectedZ ? Math.abs(Number(row[selectedZ])) / 10 : 10
          })),
          backgroundColor: chartColor
        }]
      };
    }

    if (chartType.includes('scatter')) {
      return {
        datasets: [{
          label: `${selectedY} vs ${selectedX}`,
          data: excelData.map(row => ({
            x: Number(row[selectedX]),
            y: Number(row[selectedY])
          })),
          backgroundColor: chartColor
        }]
      };
    }

    return {
      labels,
      datasets: [{
        label: selectedY,
        data: excelData.map(row => Number(row[selectedY])),
        backgroundColor: chartColor,
        borderColor: chartColor,
        borderWidth: 1
      }]
    };
  };

  const getChartOptions = () => {
    const textColor = theme === 'dark' ? '#f3f4f6' : '#111827';
    const gridColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
    
    return {
      responsive: true,
      plugins: {
        legend: { position: 'top',labels: { color: textColor } },
        title: { display: true, text: chartTitle,color: textColor }
      },
      scales: {
        x: { title: { display: true, text: selectedX,color: textColor },
      grid: { color: gridColor },
          ticks: { color: textColor } },
        y: { title: { display: true, text: selectedY, color: textColor },
      grid: { color: gridColor },
          ticks: { color: textColor } }
      }
    };
  };

  const renderChart = () => {
    if (chartType.startsWith('3d')) {
      return (
        
<div className="w-full h-[500px]">
 

        <PlotlyChart
          type={chartType}
          data={excelData}
          x={selectedX}
          y={selectedY}
          z={selectedZ}
          color={chartColor}
          title={chartTitle}
        />
        </div>
      );
    }

    const data = prepareChartData();
    const options = getChartOptions();

    switch (chartType) {
      case 'bar': return <Bar data={data} options={options} />;
      case 'line': return <Line data={data} options={options} />;
      case 'pie': return <Pie data={data} options={options} />;
      case 'doughnut': return <Doughnut data={data} options={options} />;
      case 'scatter': return <Scatter data={data} options={options} />;
      case 'bubble': return <Bubble data={data} options={options} />;
      default: return <Bar data={data} options={options} />;
    }
  };




 

  const downloadAsPNG = async () => {
    const chartElement = document.querySelector('canvas');
    if (chartElement) {
      const image = chartElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${chartTitle || 'chart'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAsPDF = async () => {
    const chartElement = document.querySelector('canvas');
    if (!chartElement) return;

    try {
      const image = chartElement.toDataURL('image/png');
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      
      const imageBytes = await fetch(image).then(res => res.arrayBuffer());
      const pdfImage = await pdfDoc.embedPng(imageBytes);
      
      const { width, height } = pdfImage.scale(0.5);
      page.drawImage(pdfImage, {
        x: 50,
        y: page.getHeight() - height - 50,
        width,
        height,
      });
      
      page.drawText(chartTitle, {
        x: 50,
        y: page.getHeight() - 30,
        size: 18,
        color: rgb(0, 0, 0),
      });
      
      const pdfBytes = await pdfDoc.save();
      saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), `${chartTitle || 'chart'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
  
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Data Visualization Dashboard</h1>
          <div className="flex items-center space-x-4">
           <ThemeToggle />
       
          <button 
            onClick={() => navigate('/upload')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition"
          >
            Back to Upload
          </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium ${activeTab === '2d' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setActiveTab('2d');
                setChartType('bar');
              }}
            >
              2D Charts
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === '3d' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setActiveTab('3d');
                setChartType('3d-bar');
              }}
            >
              3D Charts
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Chart Type</h3>
                <div className="space-y-2">
                  {(activeTab === '2d' ? twoDCharts : threeDCharts).map((chart) => (
                    <div key={chart.id} className="flex items-center">
                      <input
                        id={`chart-${chart.id}`}
                        name="chart-type"
                        type="radio"
                        checked={chartType === chart.id}
                        onChange={() => setChartType(chart.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`chart-${chart.id}`} className="ml-2 text-gray-700">
                        {chart.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Chart Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="chart-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Chart Title
                    </label>
                    <input
                      type="text"
                      id="chart-title"
                      value={chartTitle}
                      onChange={(e) => setChartTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="chart-color" className="block text-sm font-medium text-gray-700 mb-1">
                      Chart Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        id="chart-color"
                        value={chartColor}
                        onChange={(e) => setChartColor(e.target.value)}
                        className="h-10 w-10 cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700">{chartColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Data Axes</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="x-axis" className="block text-sm font-medium text-gray-700 mb-1">
                      X Axis
                    </label>
                    <select
                      id="x-axis"
                      value={selectedX}
                      onChange={(e) => setSelectedX(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {columns.map((column) => (
                        <option key={`x-${column}`} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="y-axis" className="block text-sm font-medium text-gray-700 mb-1">
                      Y Axis
                    </label>
                    <select
                      id="y-axis"
                      value={selectedY}
                      onChange={(e) => setSelectedY(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {columns.map((column) => (
                        <option key={`y-${column}`} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(chartType === '3d-scatter' || chartType === '3d-bubble' || chartType === '3d-surface') && (
                    <div>
                      <label htmlFor="z-axis" className="block text-sm font-medium text-gray-700 mb-1">
                        Z Axis
                      </label>
                      <select
                        id="z-axis"
                        value={selectedZ}
                        onChange={(e) => setSelectedZ(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {columns.map((column) => (
                          <option key={`z-${column}`} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Export Chart</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={downloadAsPNG}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  >
                    PNG
                  </button>
                  <button
                    onClick={downloadAsPDF}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                  >
                    PDF
                  </button>
                </div>
              </div>
            </div>


            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
                <div className="h-[500px] w-full flex items-center justify-center">
                  {excelData.length > 0 && selectedX && selectedY ? (
                    <>
                    {console.log('Rendering 3D chart with:', chartType, selectedX, selectedY, selectedZ, excelData)}

                   { renderChart()}
                   </> 

                  ) : (
                    <div className="text-gray-500 text-center">
                      <p>No data available or axes not selected</p>
                      <p>Please configure your chart settings</p>
                    </div>
                  )}
                </div>
              </div>
               
   
            </div>
           <div className="mt-6">
      <AIInsightData 
        data={excelData} 
        className="hover:shadow-lg transition-shadow duration-300"
      />
    </div>
        

          </div>
        </div>
      </div>
    </div>
  );
}