import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
);

export default function AssetDashboard() {
  const [stats, setStats] = useState({
    totalAssets: '...',
    activeAssets: '...',
    underWarranty: '...',
    amcCovered: '...',
    dueForService: '...',
    endOfLife: '...',
    totalAssetValue: '...',
    avgAssetAge: '...'
  });

  useEffect(() => {
    axios.get('/api/assets/dashboard', { withCredentials: true })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Added',
        data: [15, 20, 18, 30, 25, 40, 35, 50, 45, 60, 55, 70],
        borderColor: '#1cc88a',
        backgroundColor: '#1cc88a',
        tension: 0.3
      },
      {
        label: 'Disposed',
        data: [2, 1, 4, 2, 5, 3, 2, 6, 4, 3, 5, 2],
        borderColor: '#e74a3b',
        backgroundColor: '#e74a3b',
        tension: 0.3
      }
    ]
  };

  const donutChartData = {
    labels: ['Active', 'In Service', 'Under AMC', 'Under Warranty', 'End of Life', 'Disposed'],
    datasets: [{
      data: [1102, 86, 612, 436, 54, 6],
      backgroundColor: ['#1cc88a', '#36b9cc', '#4e73df', '#f6c23e', '#e74a3b', '#858796'],
      hoverBackgroundColor: ['#17a673', '#2c9faf', '#2e59d9', '#dda20a', '#be2617', '#717384'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }]
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800 font-weight-bold">Asset & Installed Base</h1>
      </div>

      <div className="row mb-4">
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card bg-success text-white shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-uppercase mb-1">Total Assets</div>
              <div className="h4 mb-0 font-weight-bold">{stats.totalAssets}</div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card bg-primary text-white shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-uppercase mb-1">Active Assets</div>
              <div className="h4 mb-0 font-weight-bold">{stats.activeAssets}</div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card bg-warning text-white shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-uppercase mb-1">Under Warranty</div>
              <div className="h4 mb-0 font-weight-bold">{stats.underWarranty}</div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card bg-info text-white shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-uppercase mb-1">AMC Covered</div>
              <div className="h4 mb-0 font-weight-bold">{stats.amcCovered}</div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card bg-danger text-white shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-uppercase mb-1">Due for Service</div>
              <div className="h4 mb-0 font-weight-bold">{stats.dueForService}</div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card bg-secondary text-white shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-uppercase mb-1">End of Life (EOL)</div>
              <div className="h4 mb-0 font-weight-bold">{stats.endOfLife}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-5 col-lg-6">
          <div className="card shadow mb-4 border-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
              <h6 className="m-0 font-weight-bold text-primary">Asset Lifecycle Status</h6>
            </div>
            <div className="card-body">
              <div className="chart-pie pt-4 pb-2" style={{ height: '320px' }}>
                <Doughnut data={donutChartData} options={{ maintainAspectRatio: false, cutout: '75%' }} />
                <div style={{position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                  <h3 className="mb-0 font-weight-bold">{stats.totalAssets}</h3>
                  <small className="text-muted">Assets</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-7 col-lg-6">
          <div className="card shadow mb-4 border-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
              <h6 className="m-0 font-weight-bold text-primary">Assets Added vs Disposed</h6>
            </div>
            <div className="card-body">
              <div className="chart-area" style={{ height: '320px' }}>
                <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
