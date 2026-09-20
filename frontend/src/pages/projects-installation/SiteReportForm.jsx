
import React, { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function SiteReportForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    report_id: '',
    name: '',
    status: 'In Progress'
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/projects/site-reports/${id}`, { withCredentials: true });
      const data = res.data;
      if (data.start_date) data.start_date = new Date(data.start_date).toISOString().split('T')[0];
      if (data.end_date) data.end_date = new Date(data.end_date).toISOString().split('T')[0];
      setFormData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id && id !== 'new') {
        await axios.put(`/api/projects/site-reports/${id}`, formData, { withCredentials: true });
      } else {
        await axios.post(`/api/projects/site-reports`, formData, { withCredentials: true });
      }
      toast.success('Saved successfully!');
      navigate('/modules/projects-installation/site-reports');
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-gray-800 font-weight-bold">{id === 'new' ? 'Create' : 'Edit'} Report</h4>
      </div>

      <div className="card shadow mb-4 border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label font-weight-bold">Code / ID</label>
                <input type="text" className="form-control" name="report_id" value={formData.report_id || ''} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label font-weight-bold">Name / Title</label>
                <input type="text" className="form-control" name={formData.resource_name !== undefined ? 'resource_name' : formData.milestone_name !== undefined ? 'milestone_name' : formData.file_name !== undefined ? 'file_name' : 'name'} value={formData.name || formData.resource_name || formData.milestone_name || formData.file_name || ''} onChange={handleChange} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label font-weight-bold">Status</label>
                <select className="form-select form-control" name="status" value={formData.status || ''} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary px-4 me-2">Save</button>
              <button type="button" onClick={() => navigate('/modules/projects-installation/site-reports')} className="btn btn-light px-4 border">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
