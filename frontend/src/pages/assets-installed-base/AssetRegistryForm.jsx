
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function AssetRegistryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    asset_no: '',
    status: 'Active'
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/assets/asset-registry/${id}`, { withCredentials: true });
      const data = res.data;
      if (data.installation_date) data.installation_date = new Date(data.installation_date).toISOString().split('T')[0];
      if (data.warranty_expiry) data.warranty_expiry = new Date(data.warranty_expiry).toISOString().split('T')[0];
      if (data.start_date) data.start_date = new Date(data.start_date).toISOString().split('T')[0];
      if (data.end_date) data.end_date = new Date(data.end_date).toISOString().split('T')[0];
      if (data.service_date) data.service_date = new Date(data.service_date).toISOString().split('T')[0];
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
        await axios.put(`/api/assets/asset-registry/${id}`, formData, { withCredentials: true });
      } else {
        await axios.post(`/api/assets/asset-registry`, formData, { withCredentials: true });
      }
      navigate('/modules/assets-installed-base/asset-registry');
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-gray-800 font-weight-bold">{id === 'new' ? 'Create' : 'Edit'} Asset Registry</h4>
      </div>

      <div className="card shadow mb-4 border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label font-weight-bold">Reference / ID</label>
                <input type="text" className="form-control" name="asset_no" value={formData.asset_no || ''} onChange={handleChange} required />
              </div>
              {apiPath !== 'locations' && (
                <div className="col-md-6">
                  <label className="form-label font-weight-bold">Status</label>
                  <select className="form-select form-control" name="status" value={formData.status || ''} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="In Service">In Service</option>
                    <option value="Under AMC">Under AMC</option>
                    <option value="Expired">Expired</option>
                    <option value="Completed">Completed</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary px-4 me-2">Save</button>
              <button type="button" onClick={() => navigate('/modules/assets-installed-base/asset-registry')} className="btn btn-light px-4 border">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
