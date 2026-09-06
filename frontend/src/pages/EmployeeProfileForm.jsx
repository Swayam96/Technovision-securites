import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EmployeeProfileForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    joining_date: '',
    username: '',
    email: '',
    status: 'Active',
    father_name: '',
    father_occupation: '',
    mother_name: '',
    mother_occupation: '',
    current_address: '',
    permanent_address: '',
    mobile_number: '',
    secondary_number: '',
    emergency_number: ''
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/employee-profiles/${id}`, { withCredentials: true })
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
        await axios.put(`/api/employee-profiles/${id}`, formData, { withCredentials: true });
      } else {
        await axios.post('/api/employee-profiles', formData, { withCredentials: true });
      }
      navigate('/modules/organization-administration/employee-profile');
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
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
        <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>Organisation & Administration &gt; Employee Profile</div>
        <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
            <i className="fas fa-address-card"></i>
          </div>
          {isEdit ? 'Edit Employee Profile' : 'Add Employee Profile'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Personal details</div>
          <div style={cardBodyStyle}>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input type="text" name="full_name" value={formData.full_name || ''} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Birth date</label>
                <input type="date" name="birth_date" value={formData.birth_date || ''} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderStyle}>General details</div>
          <div style={cardBodyStyle}>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Joining date</label>
                <input type="date" name="joining_date" value={formData.joining_date || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Username</label>
                <input type="text" name="username" value={formData.username || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} style={inputStyle} />
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
          <div style={cardHeaderStyle}>Family details</div>
          <div style={cardBodyStyle}>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Father’s name</label>
                <input type="text" name="father_name" value={formData.father_name || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Father’s occupation</label>
                <input type="text" name="father_occupation" value={formData.father_occupation || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mother’s name</label>
                <input type="text" name="mother_name" value={formData.mother_name || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mother’s occupation</label>
                <input type="text" name="mother_occupation" value={formData.mother_occupation || ''} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Contact details</div>
          <div style={cardBodyStyle}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Current address</label>
              <textarea name="current_address" value={formData.current_address || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }}></textarea>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Permanent address</label>
              <textarea name="permanent_address" value={formData.permanent_address || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }}></textarea>
            </div>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Mobile number</label>
                <input type="text" name="mobile_number" value={formData.mobile_number || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Secondary number</label>
                <input type="text" name="secondary_number" value={formData.secondary_number || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Emergency number</label>
                <input type="text" name="emergency_number" value={formData.emergency_number || ''} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Documents</div>
          <div style={cardBodyStyle}>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Aadhaar card *</label>
                <input type="file" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>PAN card *</label>
                <input type="file" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Address proof</label>
                <input type="file" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Light bill</label>
                <input type="file" style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button type="button" onClick={() => navigate('/modules/organization-administration/employee-profile')} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', marginRight: '10px', fontWeight: 500 }}>
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
