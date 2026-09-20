import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ACTION_IDS = ["read", "write", "create", "submit", "cancel", "amend", "print", "email", "export", "report", "share", "delete", "import"];

export default function Permissions() {
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [usersRes, modulesRes] = await Promise.all([
        axios.get('/api/users', { withCredentials: true }),
        axios.get('/api/modules', { withCredentials: true })
      ]);
      setUsers(usersRes.data);
      setModules(modulesRes.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const fetchPermissions = async (userId) => {
    try {
      const res = await axios.get(`/api/users/${userId}/permissions`, { withCredentials: true });
      console.log('Fetched permissions for user', userId, ':', res.data);
      setPermissions(res.data);
    } catch (err) {
      console.error("Failed to load permissions", err);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    if (userId) {
      fetchPermissions(userId);
    } else {
      setPermissions({});
    }
  };

  const handleToggle = (moduleId, functionId, action) => {
    const key = `${moduleId}:${functionId}`;
    setPermissions(prev => {
      const updated = { ...prev };
      if (!updated[key]) updated[key] = {};
      updated[key] = {
        ...updated[key],
        [action]: !updated[key][action]
      };
      
      // Auto-toggle read if write is checked, etc (simplify for now)
      if (action === 'write' && updated[key].write) {
        updated[key].read = true;
      }
      
      return updated;
    });
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await axios.put(`/api/users/${selectedUser}/permissions`, permissions, { withCredentials: true });
      alert('Permissions saved successfully!');
    } catch (err) {
      alert('Failed to save permissions');
    }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>Organisation & Administration &gt; Permissions</div>
          <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
              <i className="fas fa-key"></i>
            </div>
            User Permissions
          </h1>
        </div>
        <div>
          <button 
            className="btn btn-success shadow-sm" 
            style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={handleSave}
            disabled={!selectedUser || saving}
          >
            {saving ? 'Saving...' : <span><i className="fas fa-save mr-1" style={{ marginRight: '5px' }}></i> Save Permissions</span>}
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4" style={{ background: '#fff', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <label style={{ fontWeight: 600, margin: 0 }}>Select User:</label>
        <select 
          value={selectedUser} 
          onChange={handleUserChange}
          style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', minWidth: '300px' }}
        >
          <option value="">-- Choose a user to edit permissions --</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.full_name} ({u.username})</option>
          ))}
        </select>
      </div>

      {selectedUser && modules.length > 0 && (
        <div className="card border-0 shadow-sm" style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          <div className="card-body table-responsive p-0">
            <table className="table table-bordered mb-0" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '2px solid #eee' }}>
                <tr>
                  <th style={{ padding: '12px 20px', textAlign: 'left', position: 'sticky', left: 0, background: '#f8fafc', zIndex: 2 }}>Module / Function</th>
                  {ACTION_IDS.map(action => (
                    <th key={action} style={{ padding: '12px 10px', textAlign: 'center', textTransform: 'capitalize' }}>{action}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map(mod => (
                  <React.Fragment key={mod.id}>
                    <tr>
                      <td colSpan={ACTION_IDS.length + 1} style={{ padding: '10px 20px', background: '#f1f5f9', fontWeight: 600, color: '#334155' }}>
                        <i className={`${mod.fa_icon} mr-2`} style={{ marginRight: '8px' }}></i> {mod.title}
                      </td>
                    </tr>
                    {mod.functions.map(fn => {
                      const key = `${mod.id}:${fn.id}`;
                      const fnPerms = permissions[key] || {};
                      return (
                        <tr key={fn.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px 20px', paddingLeft: '40px', position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>
                            {fn.title}
                          </td>
                          {ACTION_IDS.map(action => (
                            <td key={action} style={{ padding: '10px', textAlign: 'center' }}>
                              <input 
                                type="checkbox" 
                                checked={!!fnPerms[action]} 
                                onChange={() => handleToggle(mod.id, fn.id, action)}
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
