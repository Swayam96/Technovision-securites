import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function BranchList() {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ branch_name: '', company_id: '', status: 'Active' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [bRes, cRes] = await Promise.all([
        axios.get('/api/branches', { withCredentials: true }),
        axios.get('/api/companies', { withCredentials: true })
      ]);
      setRecords(bRes.data);
      setCompanies(cRes.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else setError('Failed to load branches.');
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setFormData({ branch_name: '', company_id: companies.length > 0 ? companies[0].id : '', status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (rec) => {
    setEditingId(rec.id);
    setFormData({ branch_name: rec.branch_name, company_id: rec.company_id || '', status: rec.status });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/branches/${editingId}`, formData, { withCredentials: true });
        setMessage('Branch updated successfully!');
      } else {
        await axios.post('/api/branches', formData, { withCredentials: true });
        setMessage('Branch created successfully!');
      }
      setShowModal(false);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving branch');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    try {
      await axios.delete(`/api/branches/${id}`, { withCredentials: true });
      setMessage('Branch deleted successfully!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting branch');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="content-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="mb-0" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Branches</h1>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Organization Administration</p>
          </div>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card card-outline card-primary shadow-sm" style={{ background: '#fff', borderRadius: '8px', borderTop: '3px solid #3b82f6' }}>
        <div className="card-header bg-white" style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ margin: 0, fontSize: '1.1rem' }}>Manage Branches</h3>
          <div className="card-tools">
            <button onClick={openNew} className="btn btn-primary btn-sm" style={{ padding: '5px 15px', borderRadius: '4px', background: '#3b82f6', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <i className="fas fa-plus"></i> New Branch
            </button>
          </div>
        </div>
        <div className="card-body p-0 table-responsive">
          <table className="table table-striped table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #eee' }}>
              <tr>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Branch Name</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Company</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
              ) : records.length > 0 ? (
                records.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 20px' }}><strong>{r.branch_name}</strong></td>
                    <td style={{ padding: '12px 20px' }}>{r.company_name || '—'}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span className={`badge ${r.status === 'Active' ? 'badge-success' : 'badge-secondary'}`} style={{
                        background: r.status === 'Active' ? '#10b981' : '#64748b',
                        color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <button onClick={() => openEdit(r)} className="btn btn-xs btn-outline-primary mr-1" style={{ marginRight: '5px', padding: '2px 8px', border: '1px solid #3b82f6', color: '#3b82f6', background: 'transparent', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(r.id)} className="btn btn-xs btn-outline-danger" style={{ padding: '2px 8px', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No branches found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog">
              <div className="modal-content" style={{ border: 'none', borderRadius: '8px', overflow: 'hidden' }}>
                <div className="modal-header" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 className="modal-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{editingId ? 'Edit Branch' : 'New Branch'}</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body" style={{ padding: '20px' }}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Branch Name <span style={{ color: 'red' }}>*</span></label>
                      <input type="text" className="form-control" value={formData.branch_name} onChange={e => setFormData({...formData, branch_name: e.target.value})} required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="e.g. Head Office, West Coast Branch" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Company</label>
                      <select className="form-control" value={formData.company_id} onChange={e => setFormData({...formData, company_id: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        <option value="">-- None --</option>
                        {companies.map(c => (
                          <option key={c.id} value={c.id}>{c.company_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Status</label>
                      <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '15px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '6px 12px', background: '#64748b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Save Branch</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
