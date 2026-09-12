import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LeaveList() {
  const [myLeaves, setMyLeaves] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'approvals'
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'my') {
        const res = await axios.get('/api/leave/my', { withCredentials: true });
        setMyLeaves(res.data);
      } else {
        const res = await axios.get('/api/leave/approvals', { withCredentials: true });
        setApprovals(res.data);
      }
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/leave/${id}/status`, { status }, { withCredentials: true });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const renderStatus = (status) => {
    let color = '#64748b';
    let bg = '#f1f5f9';
    if (status === 'Approved') { color = '#166534'; bg = '#dcfce7'; }
    if (status === 'Rejected') { color = '#991b1b'; bg = '#fee2e2'; }
    if (status === 'Pending') { color = '#b45309'; bg = '#fef3c7'; }
    return (
      <span style={{ background: bg, color: color, padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500 }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>HRMS &gt; Leave Management</div>
          <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
              <i className="fas fa-calendar-alt"></i>
            </div>
            Leave Requests
          </h1>
        </div>
        <div>
          <button 
            className="btn btn-primary btn-sm px-3 shadow-sm rounded-pill" 
            style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => navigate('/modules/hrms/leave/new')}
          >
            <i className="fas fa-plus mr-1" style={{ marginRight: '5px' }}></i> Request Leave
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setActiveTab('my')}
          style={{ 
            padding: '10px 20px', 
            background: activeTab === 'my' ? '#3b82f6' : '#fff', 
            color: activeTab === 'my' ? '#fff' : '#475569',
            border: '1px solid #cbd5e1', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: activeTab === 'my' ? 600 : 400
          }}
        >
          My Leave Requests
        </button>
        <button 
          onClick={() => setActiveTab('approvals')}
          style={{ 
            padding: '10px 20px', 
            background: activeTab === 'approvals' ? '#3b82f6' : '#fff', 
            color: activeTab === 'approvals' ? '#fff' : '#475569',
            border: '1px solid #cbd5e1', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: activeTab === 'approvals' ? 600 : 400
          }}
        >
          Pending Approvals
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div className="card-body table-responsive p-0">
          <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #eee' }}>
              <tr>
                {activeTab === 'approvals' && <th style={{ padding: '12px 20px', textAlign: 'left' }}>Employee</th>}
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Leave Type</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Start Date</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>End Date</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Reason</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Status</th>
                {activeTab === 'approvals' && <th style={{ padding: '12px 20px', textAlign: 'center' }}>Actions</th>}
                {activeTab === 'my' && <th style={{ padding: '12px 20px', textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
              ) : (activeTab === 'my' ? myLeaves : approvals).length > 0 ? (
                (activeTab === 'my' ? myLeaves : approvals).map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
                    {activeTab === 'approvals' && (
                      <td style={{ padding: '15px 20px' }}><strong className="text-dark">{l.employee_name}</strong></td>
                    )}
                    <td style={{ padding: '15px 20px' }}>{l.leave_type}</td>
                    <td style={{ padding: '15px 20px' }}>{l.start_date}</td>
                    <td style={{ padding: '15px 20px' }}>{l.end_date}</td>
                    <td style={{ padding: '15px 20px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.reason}</td>
                    <td style={{ padding: '15px 20px' }}>{renderStatus(l.status)}</td>
                    
                    {activeTab === 'approvals' && (
                      <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                           <button 
                             onClick={() => handleStatusChange(l.id, 'Approved')}
                             style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                           >Approve</button>
                           <button 
                             onClick={() => handleStatusChange(l.id, 'Rejected')}
                             style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                           >Reject</button>
                        </div>
                      </td>
                    )}
                    
                    {activeTab === 'my' && (
                      <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                         {l.status === 'Pending' && (
                           <button 
                             onClick={() => handleStatusChange(l.id, 'Cancelled')}
                             style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                           >Cancel</button>
                         )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                       <i className="fas fa-calendar-alt fa-3x mb-3 text-light" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px', display: 'block' }}></i>
                       <p className="mb-0">No leave requests found.</p>
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
