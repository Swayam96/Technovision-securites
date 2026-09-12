import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShiftList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/api/employees', { withCredentials: true });
        setEmployees(res.data || []);
      } catch (err) {
        console.error('Failed to fetch employees', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const shifts = [
    {
      id: 1,
      name: 'General Shift',
      shiftType: 'General',
      startTime: '09:00 AM',
      endTime: '06:00 PM',
      color: '#3b82f6',
      bg: '#eff6ff',
      icon: 'fas fa-sun',
      description: 'Standard office hours for most internal employees.'
    },
    {
      id: 2,
      name: 'Field Shift',
      shiftType: 'Field',
      startTime: '10:00 AM',
      endTime: '07:00 PM',
      color: '#f59e0b',
      bg: '#fffbeb',
      icon: 'fas fa-map-marked-alt',
      description: 'Staggered hours for field agents and on-site technicians.'
    }
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100%' }}>
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div>
          <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>HRMS &gt; Shift Management</div>
          <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <div className="avatar text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
              <i className="fas fa-clock"></i>
            </div>
            Shift Timings
          </h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {shifts.map(shift => {
          const shiftEmployees = employees.filter(e => e.shift_type === shift.shiftType && e.status === 'Active');
          
          return (
          <div key={shift.id} className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ height: '8px', backgroundColor: shift.color }}></div>
            <div className="card-body" style={{ padding: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: shift.bg, color: shift.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '15px' }}>
                  <i className={shift.icon}></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#1e293b' }}>{shift.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Active</span>
                </div>
              </div>
              
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Start Time</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{shift.startTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>End Time</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{shift.endTime}</span>
                </div>
              </div>
              
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>
                {shift.description}
              </p>

              <div>
                <h6 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Assigned Employees</span>
                  <span style={{ backgroundColor: shift.color, color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '0.75rem' }}>{loading ? '...' : shiftEmployees.length}</span>
                </h6>
                <div style={{ maxHeight: '120px', overflowY: 'auto', paddingRight: '5px' }}>
                  {loading ? (
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Loading employees...</div>
                  ) : shiftEmployees.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {shiftEmployees.map(emp => (
                        <span key={emp.id} style={{ fontSize: '0.8rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                           <i className="fas fa-user" style={{ color: shift.color }}></i> {emp.employee_name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No active employees assigned.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
