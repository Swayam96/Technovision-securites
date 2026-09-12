import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

export default function InventoryDashboard() {
  const [stats, setStats] = useState({
    totalStockValue: '...',
    totalItems: '...',
    warehouses: '...',
    stockMovements: '...'
  });

  useEffect(() => {
    axios.get('/api/inventory/dashboard', { withCredentials: true })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Stock Value (Millions)',
      data: [12, 19, 15, 25, 22, 30],
      borderColor: '#4e73df',
      tension: 0.3,
      fill: true,
      backgroundColor: 'rgba(78, 115, 223, 0.05)'
    }]
  };

  const donutChartData = {
    labels: ['Main Warehouse', 'Site Warehouse', 'Transit', 'Scrap'],
    datasets: [{
      data: [55, 30, 10, 5],
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#e74a3b'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#e74a3b'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }]
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800 font-weight-bold">Inventory & Logistics Dashboard</h1>
        <Link to="/modules/inventory-logistics/reports" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <i className="fas fa-download fa-sm text-white-50"></i> Generate Report
        </Link>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2 border-0" style={{ borderLeft: '4px solid #4e73df' }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Stock Value</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">₹ {stats.totalStockValue}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-rupee-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2 border-0" style={{ borderLeft: '4px solid #1cc88a' }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total Items</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalItems}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-boxes fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2 border-0" style={{ borderLeft: '4px solid #36b9cc' }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Warehouses</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.warehouses} Active</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-warehouse fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2 border-0" style={{ borderLeft: '4px solid #f6c23e' }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Stock Movements</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.stockMovements} Today</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-truck-loading fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4 border-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
              <h6 className="m-0 font-weight-bold text-primary">Stock Value Trend (Last 6 Months)</h6>
            </div>
            <div className="card-body">
              <div className="chart-area" style={{ height: '300px' }}>
                <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4 border-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
              <h6 className="m-0 font-weight-bold text-primary">Stock by Warehouse</h6>
            </div>
            <div className="card-body">
              <div className="chart-pie pt-4 pb-2" style={{ height: '260px' }}>
                <Doughnut data={donutChartData} options={{ maintainAspectRatio: false, cutout: '70%' }} />
              </div>
              <div className="mt-4 text-center small">
                <span className="mr-2"><i className="fas fa-circle text-primary"></i> Main</span>
                <span className="mr-2"><i className="fas fa-circle text-success"></i> Site</span>
                <span className="mr-2"><i className="fas fa-circle text-info"></i> Transit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
