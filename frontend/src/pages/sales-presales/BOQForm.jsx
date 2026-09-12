import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function BOQForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    boq_no: '',
    project: '',
    customer: '',
    type: 'New Installation',
    amount: 0,
    status: 'Draft'
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:3000/api/sales/boq-solutions/${id}`, { withCredentials: true })
        .then(res => {
          setFormData(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/api/sales/boq-solutions/${id}`, formData, { withCredentials: true });
      } else {
        await axios.post('http://localhost:3000/api/sales/boq-solutions', formData, { withCredentials: true });
      }
      navigate('/modules/sales-presales/boq-solutions');
    } catch (err) {
      console.error(err);
      alert('Failed to save BOQ');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  const cardStyle = { background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' };
  const cardHeaderStyle = { padding: '15px 20px', borderBottom: '1px solid #E2E8F0', background: '#f8fafc', fontWeight: '600', color: '#1e293b' };
  const cardBodyStyle = { padding: '20px' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#475569', fontSize: '0.875rem' };
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="content-header" style={{ marginBottom: '20px' }}>
        <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>Sales & Presales &gt; BOQ / Solutions Builder</div>
        <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
            <i className="fas fa-cubes"></i>
          </div>
          {isEdit ? 'Edit BOQ' : 'New BOQ'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>BOQ Details</div>
          <div style={cardBodyStyle}>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>BOQ No *</label>
                <input type="text" name="boq_no" value={formData.boq_no} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Project / Subject</label>
                <input type="text" name="project" value={formData.project} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Customer *</label>
                <input type="text" name="customer" value={formData.customer} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Solution Type</label>
                <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                  <option value="New Installation">New Installation</option>
                  <option value="Upgrade">Upgrade</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Total Amount (₹) *</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button type="button" onClick={() => navigate('/modules/sales-presales/boq-solutions')} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', marginRight: '10px', fontWeight: 500 }}>
            Cancel
          </button>
          <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
            <i className="fas fa-save mr-1" style={{ marginRight: '5px' }}></i> Save BOQ
          </button>
        </div>
      </form>
    </div>
  );
}
