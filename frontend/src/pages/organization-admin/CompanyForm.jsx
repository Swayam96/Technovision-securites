import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function CompanyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    company_name: '',
    company_code: '',
    legal_name: '',
    company_type: '',
    status: 'Active',
    parent_company: '',
    website: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    pan: '',
    gst_registration_status: '',
    gstin: '',
    gst_state: '',
    cin: '',
    tan: '',
    registration_number: '',
    registration_date: '',
    phone: '',
    email: '',
    primary_contact: '',
    primary_contact_phone: '',
    primary_contact_email: '',
    finance_contact: '',
    operations_contact: '',
    default_currency: 'INR',
    fiscal_year: '',
    default_branch: '',
    default_warehouse: '',
    default_price_list: ''
  });

  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/company/${id}`, { withCredentials: true })
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
        await axios.put(`/api/company/${id}`, formData, { withCredentials: true });
      } else {
        await axios.post('/api/company', formData, { withCredentials: true });
      }
      navigate('/modules/organization-administration/company');
    } catch (err) {
      console.error(err);
      alert('Failed to save company');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  const cardStyle = { background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#475569', fontSize: '0.875rem' };
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="content-header" style={{ marginBottom: '20px' }}>
        <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>Organisation & Administration &gt; Company</div>
        <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
            <i className="fas fa-building"></i>
          </div>
          {isEdit ? 'Edit Company' : 'Add Company'}
        </h1>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#f8fafc' }}>
          {['details', 'address', 'statutory', 'contacts', 'settings'].map(tab => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{ 
                padding: '12px 20px', 
                cursor: 'pointer', 
                fontWeight: 500,
                color: activeTab === tab ? '#3b82f6' : '#64748b',
                borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'details' && (
            <div style={gridStyle}>
              <div><label style={labelStyle}>Company Name *</label><input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Company Code *</label><input type="text" name="company_code" value={formData.company_code} onChange={handleChange} required style={inputStyle} /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Legal Name</label><input type="text" name="legal_name" value={formData.legal_name} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Company Type</label><input type="text" name="company_type" value={formData.company_type} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Status *</label><select name="status" value={formData.status} onChange={handleChange} required style={inputStyle}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
              <div><label style={labelStyle}>Parent Company</label><input type="text" name="parent_company" value={formData.parent_company} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Website</label><input type="text" name="website" value={formData.website} onChange={handleChange} style={inputStyle} /></div>
            </div>
          )}

          {activeTab === 'address' && (
            <div style={gridStyle}>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Address Line 1</label><input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} style={inputStyle} /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Address Line 2</label><input type="text" name="address_line2" value={formData.address_line2} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>City</label><input type="text" name="city" value={formData.city} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>State</label><input type="text" name="state" value={formData.state} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Pincode</label><input type="text" name="pincode" value={formData.pincode} onChange={handleChange} style={inputStyle} /></div>
            </div>
          )}

          {activeTab === 'statutory' && (
            <div style={gridStyle}>
              <div><label style={labelStyle}>PAN</label><input type="text" name="pan" value={formData.pan} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>GST Registration Status</label><input type="text" name="gst_registration_status" value={formData.gst_registration_status} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>GSTIN</label><input type="text" name="gstin" value={formData.gstin} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>CIN</label><input type="text" name="cin" value={formData.cin} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>TAN</label><input type="text" name="tan" value={formData.tan} onChange={handleChange} style={inputStyle} /></div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div style={gridStyle}>
              <div><label style={labelStyle}>Company Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Company Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Primary Contact</label><input type="text" name="primary_contact" value={formData.primary_contact} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Primary Contact Phone</label><input type="text" name="primary_contact_phone" value={formData.primary_contact_phone} onChange={handleChange} style={inputStyle} /></div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={gridStyle}>
              <div><label style={labelStyle}>Default Currency</label><input type="text" name="default_currency" value={formData.default_currency} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Fiscal Year</label><input type="text" name="fiscal_year" value={formData.fiscal_year} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Default Branch</label><input type="text" name="default_branch" value={formData.default_branch} onChange={handleChange} style={inputStyle} /></div>
            </div>
          )}

          <div style={{ textAlign: 'right', padding: '20px', borderTop: '1px solid #E2E8F0', background: '#f8fafc' }}>
            <button type="button" onClick={() => navigate('/modules/organization-administration/company')} style={{ background: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', marginRight: '10px', fontWeight: 500 }}>
              Cancel
            </button>
            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-save mr-1" style={{ marginRight: '5px' }}></i> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
