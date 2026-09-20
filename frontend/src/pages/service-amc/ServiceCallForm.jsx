
import React, { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ServiceCallForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    call_no: '',
    status: 'Open'
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/service/calls/${id}`, { withCredentials: true });
      const data = res.data;
      if (data.date) data.date = new Date(data.date).toISOString().split('T')[0];
      if (data.scheduled_date) data.scheduled_date = new Date(data.scheduled_date).toISOString().split('T')[0];
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
        await axios.put(`/api/service/calls/${id}`, formData, { withCredentials: true });
      } else {
        await axios.post(`/api/service/calls`, formData, { withCredentials: true });
      }
      toast.success('Saved successfully!');
      navigate('/modules/service-amc/calls');
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-gray-800 font-weight-bold">{id === 'new' ? 'Create' : 'Edit'} Service Call</h4>
      </div>

      <div className="card shadow mb-4 border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label font-weight-bold">Reference / ID</label>
                <input type="text" className="form-control" name="call_no" value={formData.call_no || ''} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label font-weight-bold">Status</label>
                <select className="form-select form-control" name="status" value={formData.status || ''} onChange={handleChange}>
                  <option value="Open">Open</option>
                  <option value="Active">Active</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary px-4 me-2">Save</button>
              <button type="button" onClick={() => navigate('/modules/service-amc/calls')} className="btn btn-light px-4 border">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
