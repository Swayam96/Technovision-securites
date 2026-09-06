import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async (searchQuery = '') => {
    try {
      const res = await axios.get(`/api/roles?q=${searchQuery}`, { withCredentials: true });
      setRoles(res.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchRoles(query);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>Organisation & Administration &gt; Roles</div>
          <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
              <i className="fas fa-user-tag"></i>
            </div>
            Roles
          </h1>
        </div>
        <div>
          <button 
            className="btn btn-primary shadow-sm" 
            style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => navigate('/modules/organization-administration/roles/new')}
          >
            <i className="fas fa-plus mr-1" style={{ marginRight: '5px' }}></i> New Role
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div className="card-header bg-white border-bottom-0 pt-4 pb-2 d-flex justify-content-between align-items-center" style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
          <div className="header-search bg-light" style={{ width: '300px', display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '8px 12px', borderRadius: '4px' }}>
            <i className="fas fa-search search-icon" style={{ color: '#94a3b8', marginRight: '8px' }}></i>
            <form className="w-100" onSubmit={handleSearch} style={{ width: '100%' }}>
               <input 
                 type="search" 
                 value={query} 
                 onChange={e => setQuery(e.target.value)} 
                 className="search-input bg-transparent border-0 w-100" 
                 placeholder="Search roles..." 
                 style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }}
               />
            </form>
          </div>
        </div>
        <div className="card-body table-responsive p-0">
          <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #eee' }}>
              <tr>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Role Name</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Code</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Department</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Company</th>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px 20px', textAlign: 'center', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
              ) : roles.length > 0 ? (
                roles.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px 20px' }}><strong className="text-dark">{r.role_name}</strong></td>
                    <td style={{ padding: '15px 20px' }}>{r.role_code}</td>
                    <td style={{ padding: '15px 20px' }}>{r.department_name || '—'}</td>
                    <td style={{ padding: '15px 20px' }}>{r.company_name || '—'}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{ 
                        background: r.status === 'Active' ? '#dcfce7' : '#f1f5f9', 
                        color: r.status === 'Active' ? '#166534' : '#475569', 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' 
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                      <button 
                        onClick={() => navigate(`/modules/organization-administration/roles/${r.id}`)}
                        style={{ background: 'transparent', color: '#3b82f6', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                      >
                        <i className="fas fa-pencil-alt mr-1" style={{ marginRight: '5px' }}></i> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                       <i className="fas fa-user-tag fa-3x mb-3 text-light" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px', display: 'block' }}></i>
                       <p className="mb-0">{query ? 'No matches.' : 'No roles yet. Add the first role.'}</p>
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
