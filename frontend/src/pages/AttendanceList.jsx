import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function AttendanceList() {
  const [view, setView] = useState('me'); // 'me' or 'team'
  
  const [myAttendance, setMyAttendance] = useState(null);
  const [team, setTeam] = useState([]);
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const { data } = useOutletContext(); // global layout data
  const isAdmin = data?.user?.is_admin || data?.user?.role_id === 'hr';

  useEffect(() => {
    if (view === 'team' && !isAdmin) {
      setView('me');
    }
  }, [view, isAdmin]);

  useEffect(() => {
    if (view === 'me') {
      fetchMyAttendance();
    } else {
      fetchTeam();
    }
  }, [view, date, year, month]);

  const fetchMyAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/attendance/my?year=${year}&month=${month}`, { withCredentials: true });
      setMyAttendance(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else if (err.response?.data?.error === 'no-employee') {
        setError('Your login is not linked to Employee Master. Ask HR to create your employee record first.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/attendance/team?date=${date}`, { withCredentials: true });
      setTeam(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handlePunchIn = async () => {
    try {
      const res = await axios.post('/api/attendance/punch-in', {}, { withCredentials: true });
      setMessage(res.data.message);
      fetchMyAttendance();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to punch in');
    }
  };

  const handlePunchOut = async () => {
    try {
      const res = await axios.post('/api/attendance/punch-out', {}, { withCredentials: true });
      setMessage(res.data.message);
      fetchMyAttendance();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to punch out');
    }
  };

  const shiftMonth = (delta) => {
    let newM = month + delta;
    let newY = year;
    if (newM < 1) { newM = 12; newY--; }
    if (newM > 12) { newM = 1; newY++; }
    setMonth(newM);
    setYear(newY);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="content-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="mb-0" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Attendance</h1>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>HRMS</p>
          </div>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {isAdmin && (
        <ul className="nav nav-pills mb-3" style={{ display: 'flex', gap: '5px', listStyle: 'none', padding: 0 }}>
          <li className="nav-item">
            <button 
              className={`nav-link btn ${view === 'me' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setView('me')}
              style={{ border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer' }}
            >
              My attendance
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link btn ${view === 'team' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setView('team')}
              style={{ border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer' }}
            >
              Team attendance
            </button>
          </li>
        </ul>
      )}

      {view === 'team' && isAdmin ? (
        <div className="card card-outline card-primary shadow-sm" style={{ background: '#fff', borderRadius: '8px', borderTop: '3px solid #3b82f6' }}>
          <div className="card-header bg-white" style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title" style={{ margin: 0, fontSize: '1.1rem' }}>All employees</h3>
            <div className="card-tools">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="form-control form-control-sm"
                  style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-striped table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '2px solid #eee' }}>
                <tr>
                  <th style={{ padding: '12px 20px', textAlign: 'left' }}>Employee</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left' }}>Username</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left' }}>Check in</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left' }}>Check out</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left' }}>Hours</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                ) : team.length > 0 ? (
                  team.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 20px' }}><strong>{r.employee_name}</strong></td>
                      <td style={{ padding: '12px 20px' }}>{r.username}</td>
                      <td style={{ padding: '12px 20px' }}>{r.check_in}</td>
                      <td style={{ padding: '12px 20px' }}>{r.check_out}</td>
                      <td style={{ padding: '12px 20px' }}>{r.hours}</td>
                      <td style={{ padding: '12px 20px' }}>
                        {r.status === 'Present' && <span className="badge badge-success" style={{ background: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>Present</span>}
                        {r.status === 'Checked in' && <span className="badge badge-warning" style={{ background: '#f59e0b', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>Checked in</span>}
                        {r.status === 'Not in' && <span className="badge badge-secondary" style={{ background: '#64748b', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>Not in</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{ padding: '20px', color: '#64748b' }}>No employees in Employee Master yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        myAttendance && (
          <div className="row" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div className="col-md-4" style={{ flex: '1 1 300px' }}>
              <div className="card card-outline card-success punch-card shadow-sm" style={{ background: '#fff', borderRadius: '8px', borderTop: '3px solid #10b981', padding: '20px', textAlign: 'center' }}>
                <p className="text-muted mb-1" style={{ fontSize: '0.9rem', color: '#64748b' }}>{myAttendance.employee_name}</p>
                <h2 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '15px 0' }}>{myAttendance.now_label}</h2>
                <p className="mb-1" style={{ fontSize: '1.1rem' }}>
                  In: <strong>{myAttendance.today_in}</strong> &nbsp; Out: <strong>{myAttendance.today_out}</strong>
                </p>
                
                {!myAttendance.checked_in ? (
                  <button onClick={handlePunchIn} className="btn btn-success btn-lg btn-block mt-3" style={{ width: '100%', padding: '15px', fontSize: '1.2rem', background: '#10b981', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', marginTop: '15px' }}>
                    Check in
                  </button>
                ) : !myAttendance.checked_out ? (
                  <button onClick={handlePunchOut} className="btn btn-warning btn-lg btn-block mt-3" style={{ width: '100%', padding: '15px', fontSize: '1.2rem', background: '#f59e0b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', marginTop: '15px' }}>
                    Check out
                  </button>
                ) : (
                  <p className="text-success mt-3 mb-0" style={{ color: '#10b981', fontWeight: 500, marginTop: '15px' }}>Attendance complete for today.</p>
                )}
              </div>
            </div>
            
            <div className="col-md-8" style={{ flex: '2 1 500px' }}>
              <div className="card card-outline card-primary shadow-sm" style={{ background: '#fff', borderRadius: '8px', borderTop: '3px solid #3b82f6' }}>
                <div className="card-header bg-white" style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="card-title" style={{ margin: 0, fontSize: '1.1rem' }}>{myAttendance.month_label}</h3>
                  <div className="card-tools" style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => shiftMonth(-1)} className="btn btn-sm btn-light" style={{ padding: '5px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}>&laquo;</button>
                    <button onClick={() => shiftMonth(1)} className="btn btn-sm btn-light" style={{ padding: '5px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}>&raquo;</button>
                  </div>
                </div>
                <div className="card-body table-responsive p-0">
                  <table className="table table-sm table-striped mb-0" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '2px solid #eee' }}>
                      <tr>
                        <th style={{ padding: '10px 15px', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '10px 15px', textAlign: 'left' }}>Day</th>
                        <th style={{ padding: '10px 15px', textAlign: 'left' }}>Check in</th>
                        <th style={{ padding: '10px 15px', textAlign: 'left' }}>Check out</th>
                        <th style={{ padding: '10px 15px', textAlign: 'left' }}>Hours</th>
                        <th style={{ padding: '10px 15px', textAlign: 'left' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAttendance.rows.map(r => (
                        <tr key={r.date} style={{ 
                          background: r.is_today ? '#e0f2fe' : 'transparent',
                          color: r.weekend ? '#94a3b8' : 'inherit',
                          borderBottom: '1px solid #eee'
                        }}>
                          <td style={{ padding: '10px 15px' }}>{r.label}</td>
                          <td style={{ padding: '10px 15px' }}>{r.weekday}</td>
                          <td style={{ padding: '10px 15px' }}>{r.check_in}</td>
                          <td style={{ padding: '10px 15px' }}>{r.check_out}</td>
                          <td style={{ padding: '10px 15px' }}>{r.hours}</td>
                          <td style={{ padding: '10px 15px' }}>
                            {r.status === 'Present' && <span className="badge badge-success" style={{ background: '#10b981', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>Present</span>}
                            {r.status === 'Checked in' && <span className="badge badge-warning" style={{ background: '#f59e0b', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>Checked in</span>}
                            {r.status === 'Weekend' && <span className="badge badge-light" style={{ background: '#f1f5f9', color: '#64748b', padding: '3px 6px', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid #e2e8f0' }}>Weekend</span>}
                            {r.status === 'Absent' && <span className="badge badge-secondary" style={{ background: '#64748b', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>Absent</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
