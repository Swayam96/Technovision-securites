import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement
);

export default function MISDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: '...',
    totalOrders: '...',
    projectsInProgress: '...',
    serviceContracts: '...',
    totalPurchaseValue: '...',
    inventoryValue: '...',
    outstandingReceivables: '...',
    netProfit: '...'
  });

  useEffect(() => {
    axios.get('/api/mis/dashboard', { withCredentials: true })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        type: 'bar',
        label: 'Revenue',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
        backgroundColor: '#4e73df',
      },
      {
        type: 'line',
        label: 'Net Profit',
        data: [5, 8, 6, 10, 9, 12, 11, 15, 13, 18, 16, 20],
        borderColor: '#1cc88a',
        backgroundColor: '#1cc88a',
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  const donutChartData = {
    labels: ['CCTV & Surveillance', 'Networking', 'Access Control', 'Video Intercom', 'Fire & Safety', 'AMC & Service', 'Others'],
    datasets: [{
      data: [28, 20, 15, 12, 10, 8, 7],
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#be2617', '#717384', '#4e4f57'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }]
  };
  
  const mixChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        type: 'bar',
        label: 'Project Value',
        data: [10, 20, 15, 25, 30, 22],
        backgroundColor: '#36b9cc',
      },
      {
        type: 'line',
        label: 'Profit Margin %',
        data: [15, 18, 16, 20, 22, 19],
        borderColor: '#1cc88a',
        backgroundColor: '#1cc88a',
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800 font-weight-bold">MIS Dashboard</h1>
        <div className="text-muted small">01 Aug 2026 - 31 Aug 2026</div>
      </div>

      <div className="row mb-4">
        {/* Row 1 KPIs */}
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-left-success shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total Revenue</div>
              <div className="h4 mb-0 font-weight-bold">{stats.totalRevenue} <small className="text-success text-xs"><i className="fas fa-arrow-up"></i> 18%</small></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-left-primary shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Orders</div>
              <div className="h4 mb-0 font-weight-bold">{stats.totalOrders} <small className="text-success text-xs"><i className="fas fa-arrow-up"></i> 12%</small></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-left-warning shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Projects in Progress</div>
              <div className="h4 mb-0 font-weight-bold">{stats.projectsInProgress} <small className="text-success text-xs"><i className="fas fa-arrow-up"></i> 9%</small></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-left-info shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Service Contracts</div>
              <div className="h4 mb-0 font-weight-bold">{stats.serviceContracts} <small className="text-success text-xs"><i className="fas fa-arrow-up"></i> 15%</small></div>
            </div>
          </div>
        </div>
        
        {/* Row 2 KPIs */}
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-left-danger shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">Total Purchase Value</div>
              <div className="h4 mb-0 font-weight-bold">{stats.totalPurchaseValue} <small className="text-success text-xs"><i className="fas fa-arrow-up"></i> 11%</small></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-left-secondary shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">Inventory Value</div>
              <div className="h4 mb-0 font-weight-bold">{stats.inventoryValue} <small className="text-success text-xs"><i className="fas fa-arrow-up"></i> 6%</small></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-left-warning shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Outstanding Receivables</div>
              <div className="h4 mb-0 font-weight-bold">{stats.outstandingReceivables} <small className="text-danger text-xs"><i className="fas fa-arrow-down"></i> 8%</small></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-left-success shadow h-100 py-2 border-0 rounded">
            <div className="card-body py-1 px-3">
              <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Net Profit (YTD)</div>
              <div className="h4 mb-0 font-weight-bold">{stats.netProfit} <small className="text-success text-xs"><i className="fas fa-arrow-up"></i> 22%</small></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-4 col-lg-5 mb-4">
          <div className="card shadow h-100 border-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white border-0">
              <h6 className="m-0 font-weight-bold text-primary">Sales by Product Category</h6>
            </div>
            <div className="card-body">
              <div className="chart-pie pt-4 pb-2" style={{ height: '300px' }}>
                <Doughnut data={donutChartData} options={{ maintainAspectRatio: false, cutout: '75%' }} />
                <div style={{position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                  <h3 className="mb-0 font-weight-bold">{stats.totalRevenue}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-7 mb-4">
          <div className="card shadow h-100 border-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white border-0">
              <h6 className="m-0 font-weight-bold text-primary">Revenue Trend (Last 12 Months)</h6>
            </div>
            <div className="card-body">
              <div className="chart-area" style={{ height: '300px' }}>
                <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-4 col-lg-12 mb-4">
          <div className="card shadow h-100 border-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white border-0">
              <h6 className="m-0 font-weight-bold text-primary">Project Profitability</h6>
            </div>
            <div className="card-body">
              <div className="chart-area" style={{ height: '300px' }}>
                <Bar data={mixChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
