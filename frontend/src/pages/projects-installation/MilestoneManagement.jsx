
import React, { useState, useEffect } from 'react';
import DataImportExport from '../../components/DataImportExport';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function MilestoneManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/projects/milestones', { withCredentials: true });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-gray-800 font-weight-bold">Milestone Management</h4>
        <Link to="/modules/projects-installation/milestones/new" className="btn btn-primary btn-sm px-3 shadow-sm rounded-pill">
          <i className="fas fa-plus fa-sm text-white-50 mr-2"></i> New Milestone
        </Link>
          <DataImportExport data={data} tableName="projects" onImportSuccess={fetchData} />
      </div>

      <div className="card shadow mb-4 border-0">
        <div className="card-header py-3 bg-white d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">All Milestones</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Name/Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td>{item.project_code || item.task_id || item.boq_code || item.report_id || item.id}</td>
                    <td>{item.name || item.resource_name || item.milestone_name || item.file_name || 'N/A'}</td>
                    <td>
                      <span className="badge bg-success">{item.status}</span>
                    </td>
                    <td>
                      <Link to={`/modules/projects-installation/milestones/${item.id}`} className="btn btn-sm btn-link text-primary p-0 me-2"><i className="fas fa-edit"></i> Edit</Link>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan="4" className="text-center py-4">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
