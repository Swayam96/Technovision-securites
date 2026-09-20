import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function BranchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    branch_name: '',
    branch_code: '',
    company_id: '',
    country: '',
    state: '',
    city: '',
    address: '',
    contact_number: '',
    email: '',
    status: 'Active'
  });

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    // Fetch dropdowns
    axios.get('/api/companies', { withCredentials: true })
      .then(res => setCompanies(res.data || []))
      .catch(err => console.error("Error fetching companies", err));

    if (isEdit) {
      axios.get(`/api/branches/${id}`, { withCredentials: true })
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
        await axios.put(`/api/branches/${id}`, formData, { withCredentials: true });
      } else {
        await axios.post('/api/branches', formData, { withCredentials: true });
      }
      toast.success(isEdit ? 'Updated successfully!' : 'Created successfully!');
      navigate('/modules/organization-administration/branches');
    } catch (err) {
      console.error(err);
      alert('Failed to save branch');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  const cardStyle = { background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' };
  const cardHeaderStyle = { padding: '15px 20px', borderBottom: '1px solid #E2E8F0', background: '#f8fafc', fontWeight: '600', color: '#1e293b' };
  const cardBodyStyle = { padding: '20px' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#475569', fontSize: '0.875rem' };
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="content-header" style={{ marginBottom: '20px' }}>
        <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>Organisation & Administration &gt; Branch</div>
        <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
            <i className="fas fa-building"></i>
          </div>
          {isEdit ? 'Edit Branch' : 'Add Branch'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Branch Details</div>
          <div style={cardBodyStyle}>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Branch Name *</label>
                <input type="text" name="branch_name" value={formData.branch_name || ''} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Branch Code *</label>
                <input type="text" name="branch_code" value={formData.branch_code || ''} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Company *</label>
                <select name="company_id" value={formData.company_id || ''} onChange={handleChange} required style={inputStyle}>
                  <option value="">— Select company —</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.company_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} required style={inputStyle}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Location & Contact</div>
          <div style={cardBodyStyle}>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Country</label>
                <input type="text" name="country" value={formData.country || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input type="text" name="state" value={formData.state || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" name="city" value={formData.city || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contact Number</label>
                <input type="text" name="contact_number" value={formData.contact_number || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Address</label>
                <textarea name="address" value={formData.address || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }}></textarea>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button type="button" onClick={() => navigate('/modules/organization-administration/branches')} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', marginRight: '10px', fontWeight: 500 }}>
            Cancel
          </button>
          <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
            <i className="fas fa-save mr-1" style={{ marginRight: '5px' }}></i> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
