import React, { useEffect, useState } from 'react';
import TableSkeleton from '../../components/TableSkeleton';
import axios from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AttendanceList() {
  const [view, setView] = useState('me'); // 'me' or 'team'
  
  const [myAttendance, setMyAttendance] = useState(null);
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState([]);
  const [teamStatsUser, setTeamStatsUser] = useState(null); // Selected user id for team stats
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const { data } = useOutletContext(); // global layout data
  const roleId = data?.user?.role_id;
  const orgRole = (data?.user?.org_role_name || '').toLowerCase();
  const isAdmin = roleId === 'admin' || roleId === 'hr' || roleId === 1 || roleId === 2 || data?.user?.username === 'admin' || orgRole.includes('admin') || orgRole.includes('hr') || orgRole.includes('manager');

  useEffect(() => {
    if (view === 'team' && !isAdmin) {
      setView('me');
    }
  }, [view, isAdmin]);

  useEffect(() => {
    if (view === 'me') {
      fetchMyAttendance();
      fetchStats();
    } else {
      fetchTeam();
    }
  }, [view, date, year, month]);

  useEffect(() => {
    if (view === 'team' && teamStatsUser) {
      fetchStats(teamStatsUser);
    } else if (view === 'team') {
      setStats([]);
    }
  }, [teamStatsUser, view]);

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
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to load attendance data. Please contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (employeeId = '') => {
    try {
      const res = await axios.get(`/api/attendance/stats${employeeId ? `?employeeId=${employeeId}` : ''}`, { withCredentials: true });
      setStats(res.data || []);
    } catch (err) {
      console.error('Failed to fetch stats', err);
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
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to punch in');
    }
  };

  const handlePunchOut = async () => {
    try {
      const res = await axios.post('/api/attendance/punch-out', {}, { withCredentials: true });
      setMessage(res.data.message);
      fetchMyAttendance();
      fetchStats();
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
  
  // Custom tooltip for decimal hours
  const formatTimeDec = (val) => {
    if (val === null || val === undefined) return '';
    const h = Math.floor(val);
    const m = Math.round((val - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const StatsCharts = () => {
    if (!stats || stats.length === 0) return <div className="text-muted p-4 text-center">No analytics data available.</div>;
    
    const labels = stats.map(s => s.name);
    const lineData = {
      labels,
      datasets: [
        {
          label: 'Check In',
          data: stats.map(s => s.checkIn),
          borderColor: '#10b981',
          backgroundColor: '#10b981',
          spanGaps: true,
          tension: 0.3
        },
        {
          label: 'Check Out',
          data: stats.map(s => s.checkOut),
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          spanGaps: true,
          tension: 0.3
        }
      ]
    };

    const lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6 } },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatTimeDec(context.raw);
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function(value) { return formatTimeDec(value); }
          }
        }
      }
    };

    const barData = {
      labels,
      datasets: [
        {
          label: 'Late Mark',
          data: stats.map(s => s.late),
          backgroundColor: '#ef4444',
          borderRadius: 4
        }
      ]
    };

    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.raw > 0 ? 'Late' : 'On Time';
            }
          }
        }
      },
      scales: {
        y: {
          ticks: { stepSize: 1 }
        }
      }
    };

    return (
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100 border-0" style={{ borderRadius: '8px' }}>
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h5 className="card-title" style={{ fontSize: '1rem', fontWeight: 600 }}>Check-in & Check-out Times (Last 30 Days)</h5>
            </div>
            <div className="card-body" style={{ height: '300px', padding: '15px' }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100 border-0" style={{ borderRadius: '8px' }}>
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h5 className="card-title" style={{ fontSize: '1rem', fontWeight: 600 }}>Late Marks (Last 30 Days)</h5>
            </div>
            <div className="card-body" style={{ height: '300px', padding: '15px' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100%' }}>
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
        <ul className="nav nav-pills mb-4" style={{ display: 'flex', gap: '5px', listStyle: 'none', padding: 0 }}>
          <li className="nav-item">
            <button 
              className={`nav-link btn ${view === 'me' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => { setView('me'); setTeamStatsUser(null); }}
              style={{ border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', background: view === 'me' ? '#3b82f6' : '#fff', color: view === 'me' ? '#fff' : '#475569', boxShadow: view === 'me' ? '0 4px 6px -1px rgba(59, 130, 246, 0.5)' : '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              My Attendance
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link btn ${view === 'team' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setView('team')}
              style={{ border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', background: view === 'team' ? '#3b82f6' : '#fff', color: view === 'team' ? '#fff' : '#475569', boxShadow: view === 'team' ? '0 4px 6px -1px rgba(59, 130, 246, 0.5)' : '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              Team Attendance
            </button>
          </li>
        </ul>
      )}

      {view === 'team' && isAdmin ? (
        <>
          <div className="card shadow-sm border-0 mb-4" style={{ background: '#fff', borderRadius: '12px' }}>
            <div className="card-header bg-white" style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>All Employees</h3>
              <div className="card-tools">
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="form-control"
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Employee</th>
                      <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Username</th>
                      <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Check in</th>
                      <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Check out</th>
                      <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Hours</th>
                      <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <TableSkeleton columns={7} />
                    ) : team.length > 0 ? (
                      team.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', background: teamStatsUser === r.id ? '#f0fdf4' : 'transparent' }}>
                          <td style={{ padding: '15px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontWeight: 600 }}>
                                {(r.employee_name || 'U').charAt(0)}
                              </div>
                              <strong>{r.employee_name}</strong>
                            </div>
                          </td>
                          <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{r.username}</td>
                          <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{r.check_in}</td>
                          <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{r.check_out}</td>
                          <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{r.hours}</td>
                          <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                            {r.status === 'Present' && <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Present</span>}
                            {r.status === 'Checked in' && <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Checked in</span>}
                            {r.status === 'Late' && <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Late</span>}
                            {r.status === 'Late (Checked in)' && <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Late (In)</span>}
                            {r.status === 'Absent' && <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Absent</span>}
                            {r.status === 'Not in' && <span style={{ background: '#f1f5f9', color: '#94a3b8', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Not in</span>}
                          </td>
                          <td style={{ padding: '15px 20px', verticalAlign: 'middle', textAlign: 'right' }}>
                            <button 
                              onClick={() => setTeamStatsUser(r.id)} 
                              className="btn btn-sm btn-light" 
                              style={{ borderRadius: '6px', fontSize: '0.8rem' }}
                              title="View Analytics"
                            >
                              <i className="fas fa-chart-bar text-primary"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No employees found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {teamStatsUser && (
            <div className="mb-4">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                  <i className="fas fa-chart-line mr-2 text-primary"></i> Analytics: {team.find(t => t.id === teamStatsUser)?.employee_name || 'User'}
                </h4>
                <button onClick={() => setTeamStatsUser(null)} className="btn btn-sm btn-light" style={{ borderRadius: '50%' }}><i className="fas fa-times"></i></button>
              </div>
              <StatsCharts />
            </div>
          )}
        </>
      ) : (
        myAttendance && (
          <>
            <div className="row mb-4" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="col-md-4" style={{ flex: '1 1 300px' }}>
                <div className="card shadow-sm border-0 h-100" style={{ background: '#fff', borderRadius: '12px', padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 15px' }}>
                    <i className="fas fa-fingerprint"></i>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>{myAttendance.employee_name}</h3>
                  <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>{myAttendance.now_label}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: '5px' }}>Check In</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>{myAttendance.today_in}</div>
                    </div>
                    <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: '5px' }}>Check Out</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>{myAttendance.today_out}</div>
                    </div>
                  </div>
                  
                  {!myAttendance.checked_in ? (
                    <button onClick={handlePunchIn} className="btn" style={{ width: '100%', padding: '12px', fontSize: '1.1rem', fontWeight: 600, background: '#10b981', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)' }}>
                      <i className="fas fa-sign-in-alt mr-2"></i> Punch In
                    </button>
                  ) : !myAttendance.checked_out ? (
                    <button onClick={handlePunchOut} className="btn" style={{ width: '100%', padding: '12px', fontSize: '1.1rem', fontWeight: 600, background: '#f59e0b', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.4)' }}>
                      <i className="fas fa-sign-out-alt mr-2"></i> Punch Out
                    </button>
                  ) : (
                    <div style={{ padding: '12px', background: '#f0fdf4', color: '#166534', borderRadius: '8px', fontWeight: 500 }}>
                      <i className="fas fa-check-circle mr-2"></i> Attendance complete for today
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-md-8" style={{ flex: '2 1 500px' }}>
                <div className="card shadow-sm border-0 h-100" style={{ background: '#fff', borderRadius: '12px' }}>
                  <div className="card-header bg-white" style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="card-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Attendance Record: {myAttendance.month_label}</h3>
                    <div className="card-tools" style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => shiftMonth(-1)} className="btn btn-sm btn-light" style={{ padding: '5px 12px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px' }}><i className="fas fa-chevron-left"></i></button>
                      <button onClick={() => shiftMonth(1)} className="btn btn-sm btn-light" style={{ padding: '5px 12px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px' }}><i className="fas fa-chevron-right"></i></button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive" style={{ maxHeight: '400px' }}>
                      <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 1, boxShadow: '0 1px 0 #e2e8f0' }}>
                          <tr>
                            <th style={{ padding: '12px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600 }}>Date</th>
                            <th style={{ padding: '12px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600 }}>Check in</th>
                            <th style={{ padding: '12px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600 }}>Check out</th>
                            <th style={{ padding: '12px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600 }}>Hours</th>
                            <th style={{ padding: '12px 20px', borderBottom: 'none', color: '#64748b', fontWeight: 600 }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myAttendance.rows.map(r => (
                            <tr key={r.date} style={{ 
                              background: r.is_today ? '#f0f9ff' : (r.weekend ? '#f8fafc' : 'transparent'),
                              color: r.weekend ? '#94a3b8' : 'inherit',
                              borderBottom: '1px solid #f1f5f9'
                            }}>
                              <td style={{ padding: '12px 20px' }}>
                                <div style={{ fontWeight: 500 }}>{r.label}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{r.weekday}</div>
                              </td>
                              <td style={{ padding: '12px 20px', verticalAlign: 'middle' }}>{r.check_in}</td>
                              <td style={{ padding: '12px 20px', verticalAlign: 'middle' }}>{r.check_out}</td>
                              <td style={{ padding: '12px 20px', verticalAlign: 'middle' }}>{r.hours}</td>
                              <td style={{ padding: '12px 20px', verticalAlign: 'middle' }}>
                                {r.status === 'Present' && <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Present</span>}
                                {r.status === 'Checked in' && <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Checked in</span>}
                                {r.status === 'Late' && <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Late</span>}
                                {r.status === 'Late (Checked in)' && <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Late (In)</span>}
                                {r.status === 'Weekend' && <span style={{ background: '#f1f5f9', color: '#64748b', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #e2e8f0' }}>Weekend</span>}
                                {r.status === 'Absent' && <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Absent</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <StatsCharts />
          </>
        )
      )}
    </div>
  );
}
