
import React, { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function StockLedgerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item_code: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Draft'
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/inventory/ledger/${id}`, { withCredentials: true });
      const data = res.data;
      if (data.date) {
        data.date = new Date(data.date).toISOString().split('T')[0];
      }
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
        await axios.put(`/api/inventory/ledger/${id}`, formData, { withCredentials: true });
      } else {
        await axios.post(`/api/inventory/ledger`, formData, { withCredentials: true });
      }
      toast.success('Saved successfully!');
      navigate('/modules/inventory-logistics/ledger');
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-gray-800 font-weight-bold">{id === 'new' ? 'Create' : 'Edit'} Stock Ledger</h4>
      </div>

      <div className="card shadow mb-4 border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label font-weight-bold">Reference / ID</label>
                <input type="text" className="form-control" name="item_code" value={formData.item_code || ''} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label font-weight-bold">Date</label>
                <input type="date" className="form-control" name="date" value={formData.date || ''} onChange={handleChange} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label font-weight-bold">Status</label>
                <select className="form-select form-control" name="status" value={formData.status || ''} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary px-4 me-2">Save</button>
              <button type="button" onClick={() => navigate('/modules/inventory-logistics/ledger')} className="btn btn-light px-4 border">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
