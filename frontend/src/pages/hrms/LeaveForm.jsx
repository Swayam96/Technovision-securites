import toast from 'react-hot-toast';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LeaveForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('/api/leave', formData, { withCredentials: true });
      toast.success('Saved successfully!');
      navigate('/modules/hrms/leave');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit leave request');
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', boxSizing: 'border-box', fontSize: '0.9rem', color: '#1e293b' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#0f172a', fontSize: '0.9rem' };

  return (
    <div style={{ padding: '30px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Leave</h1>
        <div style={{ color: '#64748b', fontSize: '1rem' }}>HRMS</div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a' }}>
          Apply leave
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '25px 20px' }}>
          {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}
          
          <div style={{ color: '#64748b', fontSize: '1rem', marginBottom: '25px' }}>
            Request goes to HR / Admin.
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Leave type *</label>
            <select name="leave_type" value={formData.leave_type} onChange={handleChange} required style={inputStyle}>
              <option value="">— Select type —</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Leave Without Pay">Leave Without Pay</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>From *</label>
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>To *</label>
            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>Reason</label>
            <textarea 
              name="reason" 
              value={formData.reason} 
              onChange={handleChange} 
              style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
              placeholder=""
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: '#2563eb', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '6px', 
              fontWeight: '500', 
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Submitting...' : 'Submit request'}
          </button>
        </form>
      </div>
    </div>
  );
}
