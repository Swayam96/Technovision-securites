import React, { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function ItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    item_code: '',
    item_name: '',
    item_group: '',
    brand: '',
    uom: 'Nos',
    status: 'Active'
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:3000/api/products/items/${id}`, { withCredentials: true })
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
        await axios.put(`http://localhost:3000/api/products/items/${id}`, formData, { withCredentials: true });
      } else {
        await axios.post('http://localhost:3000/api/products/items', formData, { withCredentials: true });
      }
      toast.success(isEdit ? 'Updated successfully!' : 'Created successfully!');
      navigate('/modules/products/items');
    } catch (err) {
      console.error(err);
      alert('Failed to save item');
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
        <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>Products & Master Data &gt; Items</div>
        <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
            <i className="fas fa-box-open"></i>
          </div>
          {isEdit ? 'Edit Item' : 'New Item'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Item Details</div>
          <div style={cardBodyStyle}>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Item Code *</label>
                <input type="text" name="item_code" value={formData.item_code} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / span 2' }}>
                <label style={labelStyle}>Item Name *</label>
                <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Item Group</label>
                <input type="text" name="item_group" value={formData.item_group} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>UOM</label>
                <select name="uom" value={formData.uom} onChange={handleChange} style={inputStyle}>
                  <option value="Nos">Nos</option>
                  <option value="Box">Box</option>
                  <option value="Mtr">Mtr</option>
                  <option value="Kg">Kg</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button type="button" onClick={() => navigate('/modules/products/items')} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', marginRight: '10px', fontWeight: 500 }}>
            Cancel
          </button>
          <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
            <i className="fas fa-save mr-1" style={{ marginRight: '5px' }}></i> Save Item
          </button>
        </div>
      </form>
    </div>
  );
}
