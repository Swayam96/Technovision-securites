import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PayrollList() {
  const [slips, setSlips] = useState([]);
  const date = new Date();
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayroll();
  }, [year, month]);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/payroll?year=${year}&month=${month}`, { withCredentials: true });
      setSlips(res.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await axios.post('/api/payroll/generate', { year, month }, { withCredentials: true });
      alert('Payroll generated successfully!');
      fetchPayroll();
    } catch (err) {
      alert('Failed to generate payroll');
    }
    setGenerating(false);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>HRMS &gt; Payroll</div>
          <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
              <i className="fas fa-money-check-alt"></i>
            </div>
            Payroll Generation
          </h1>
        </div>
        <div>
          <button 
            className="btn btn-success shadow-sm" 
            style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? 'Generating...' : <span><i className="fas fa-cogs mr-1" style={{ marginRight: '5px' }}></i> Generate Payroll</span>}
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div className="card-header bg-white border-bottom-0 pt-4 pb-2" style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <label style={{ margin: 0, fontWeight: 600 }}>Year:</label>
             <input 
               type="number" 
               value={year} 
               onChange={e => setYear(parseInt(e.target.value))}
               style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', width: '100px' }}
             />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <label style={{ margin: 0, fontWeight: 600 }}>Month:</label>
             <select 
               value={month} 
               onChange={e => setMonth(parseInt(e.target.value))}
               style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', width: '150px' }}
             >
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                ))}
             </select>
          </div>
        </div>
        <div className="card-body table-responsive p-0">
          <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #eee' }}>
              <tr>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Employee</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Designation</th>
                <th style={{ padding: '12px 20px', textAlign: 'center' }}>Work Days</th>
                <th style={{ padding: '12px 20px', textAlign: 'center' }}>Present</th>
                <th style={{ padding: '12px 20px', textAlign: 'center' }}>Leave</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Base Salary</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Gross</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Deductions</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
              ) : slips.length > 0 ? (
                slips.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px 20px' }}>
                      <strong className="text-dark">{s.employee_name}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.department_name}</div>
                    </td>
                    <td style={{ padding: '15px 20px' }}>{s.designation_name}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>{s.total_days}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center', color: '#166534' }}>{s.present_days}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center', color: '#b45309' }}>{s.leave_days}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'right' }}>{formatCurrency(s.base_salary)}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'right' }}>{formatCurrency(s.gross_salary)}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'right', color: '#ef4444' }}>{formatCurrency(s.deductions)}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{formatCurrency(s.net_salary)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                       <i className="fas fa-file-invoice-dollar fa-3x mb-3 text-light" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px', display: 'block' }}></i>
                       <p className="mb-0">No payroll generated for this month.</p>
                       <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Click "Generate Payroll" to calculate.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
