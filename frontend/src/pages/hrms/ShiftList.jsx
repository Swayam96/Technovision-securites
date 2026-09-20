import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ShiftList() {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editShift, setEditShift] = useState(null);
  
  const [formData, setFormData] = useState({
    shift_name: '',
    start_time: '09:00',
    end_time: '18:00',
    color: '#3b82f6',
    bg: '#eff6ff',
    icon: 'fas fa-clock',
    description: '',
    status: 'Active'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [shiftsRes, empRes] = await Promise.all([
        axios.get('/api/shifts', { withCredentials: true }),
        axios.get('/api/employees', { withCredentials: true })
      ]);
      setShifts(shiftsRes.data || []);
      setEmployees(empRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
      toast.error('Failed to fetch shifts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditShift(null);
    setFormData({
      shift_name: '',
      start_time: '09:00',
      end_time: '18:00',
      color: '#3b82f6',
      bg: '#eff6ff',
      icon: 'fas fa-clock',
      description: '',
      status: 'Active'
    });
    setShowModal(true);
  };

  const openEditModal = (shift) => {
    setEditShift(shift);
    setFormData({
      shift_name: shift.shift_name,
      start_time: shift.start_time.slice(0, 5),
      end_time: shift.end_time.slice(0, 5),
      color: shift.color,
      bg: shift.bg,
      icon: shift.icon,
      description: shift.description,
      status: shift.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Postgres time requires seconds
      const payload = { 
        ...formData, 
        start_time: formData.start_time.length === 5 ? formData.start_time + ':00' : formData.start_time,
        end_time: formData.end_time.length === 5 ? formData.end_time + ':00' : formData.end_time 
      };

      if (editShift) {
        await axios.put(`/api/shifts/${editShift.id}`, payload, { withCredentials: true });
        toast.success('Shift updated successfully');
      } else {
        await axios.post('/api/shifts', payload, { withCredentials: true });
        toast.success('Shift created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save shift');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100%' }}>
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>HRMS &gt; Shift Management</div>
          <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <div className="avatar text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
              <i className="fas fa-clock"></i>
            </div>
            Shift Timings
          </h1>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>
          <i className="fas fa-plus mr-1"></i> Add Shift
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {shifts.map(shift => {
          const shiftEmployees = employees.filter(e => e.shift_id === shift.id && e.status === 'Active');
          
          return (
          <div key={shift.id} className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', transition: 'transform 0.2s', position: 'relative' }}>
            <div style={{ height: '8px', backgroundColor: shift.color }}></div>
            <div className="card-body" style={{ padding: '25px' }}>
              <button 
                onClick={() => openEditModal(shift)}
                className="btn btn-sm btn-light" 
                style={{ position: 'absolute', top: '20px', right: '20px', borderRadius: '50%', width: '30px', height: '30px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fas fa-edit text-muted"></i>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: shift.bg, color: shift.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '15px' }}>
                  <i className={shift.icon}></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#1e293b' }}>{shift.shift_name}</h3>
                  <span className={`badge ${shift.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>{shift.status}</span>
                </div>
              </div>
              
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Start Time</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{shift.start_time.slice(0, 5)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>End Time</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{shift.end_time.slice(0, 5)}</span>
                </div>
              </div>
              
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px', minHeight: '40px' }}>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editShift ? 'Edit Shift' : 'Add Shift'}</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)}>&times;</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Shift Name</label>
                    <input type="text" className="form-control" value={formData.shift_name} onChange={e => setFormData({...formData, shift_name: e.target.value})} required />
                  </div>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label>Start Time</label>
                      <input type="time" className="form-control" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} required />
                    </div>
                    <div className="col-md-6 form-group">
                      <label>End Time</label>
                      <input type="time" className="form-control" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} required />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label>Color (Hex)</label>
                      <input type="color" className="form-control" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} required />
                    </div>
                    <div className="col-md-6 form-group">
                      <label>Icon (FontAwesome)</label>
                      <input type="text" className="form-control" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">{editShift ? 'Save Changes' : 'Create Shift'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
