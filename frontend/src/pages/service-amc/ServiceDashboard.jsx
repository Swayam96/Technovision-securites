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
  ArcElement,
  BarElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement
);

export default function ServiceDashboard() {
  const [stats, setStats] = useState({
    totalRequests: '...',
    activeAMCs: '...',
    openCalls: '...',
    techniciansActive: '...'
  });

  useEffect(() => {
    axios.get('/api/service/dashboard', { withCredentials: true })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Service Requests',
      data: [65, 59, 80, 81, 56, 124],
      backgroundColor: '#4e73df',
      hoverBackgroundColor: '#2e59d9',
      borderColor: '#4e73df',
    }]
  };

  const donutChartData = {
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    datasets: [{
      data: [30, 20, 35, 15],
      backgroundColor: ['#e74a3b', '#f6c23e', '#1cc88a', '#858796'],
      hoverBackgroundColor: ['#e74a3b', '#f6c23e', '#17a673', '#858796'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }]
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800 font-weight-bold">Service & AMC Dashboard</h1>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2 border-0" style={{ borderLeft: '4px solid #4e73df' }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Requests</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalRequests}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-headset fa-2x text-gray-300"></i>
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
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Active AMCs</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.activeAMCs}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-file-contract fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-danger shadow h-100 py-2 border-0" style={{ borderLeft: '4px solid #e74a3b' }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">Open Calls</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.openCalls} Pending</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
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
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Technicians</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.techniciansActive} Active</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user-cog fa-2x text-gray-300"></i>
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
              <h6 className="m-0 font-weight-bold text-primary">Service Requests (Last 6 Months)</h6>
            </div>
            <div className="card-body">
              <div className="chart-area" style={{ height: '300px' }}>
                <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4 border-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
              <h6 className="m-0 font-weight-bold text-primary">Ticket Status</h6>
            </div>
            <div className="card-body">
              <div className="chart-pie pt-4 pb-2" style={{ height: '260px' }}>
                <Doughnut data={donutChartData} options={{ maintainAspectRatio: false, cutout: '70%' }} />
              </div>
              <div className="mt-4 text-center small">
                <span className="mr-2"><i className="fas fa-circle text-danger"></i> Open</span>
                <span className="mr-2"><i className="fas fa-circle text-warning"></i> WIP</span>
                <span className="mr-2"><i className="fas fa-circle text-success"></i> Resolved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
