import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', { withCredentials: true });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>Organisation & Administration &gt; Users</div>
          <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
              <i className="fas fa-users"></i>
            </div>
            Users
          </h1>
        </div>
        <div>
          <button 
            className="btn btn-primary shadow-sm" 
            style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => navigate('/modules/organization-administration/users/new')}
          >
            <i className="fas fa-plus mr-1" style={{ marginRight: '5px' }}></i> New User
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div className="card-body table-responsive p-0">
          <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #eee' }}>
              <tr>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Username</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Full Name</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Active</th>
                <th style={{ padding: '12px 20px', textAlign: 'center', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
              ) : users.length > 0 ? (
                users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px 20px' }}><strong className="text-dark">{u.username}</strong></td>
                    <td style={{ padding: '15px 20px' }}>{u.full_name}</td>
                    <td style={{ padding: '15px 20px' }}>{u.role_id}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{ 
                        background: u.is_active ? '#dcfce7' : '#fee2e2', 
                        color: u.is_active ? '#166534' : '#991b1b', 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' 
                      }}>
                        {u.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                      <button 
                        onClick={() => navigate(`/modules/organization-administration/users/${u.id}`)}
                        style={{ background: 'transparent', color: '#3b82f6', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                      >
                        <i className="fas fa-pencil-alt mr-1" style={{ marginRight: '5px' }}></i> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                       <i className="fas fa-users fa-3x mb-3 text-light" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px', display: 'block' }}></i>
                       <p className="mb-0">No users found.</p>
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
