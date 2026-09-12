import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const ACTION_IDS = ["read", "write", "create", "submit", "cancel", "amend", "print", "email", "export", "report", "share", "delete", "import"];
const STANDARD_WRITE = ["read", "create", "write", "submit", "cancel", "amend", "print", "email", "export", "report", "share"];

export default function EmployeeMasterForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    profile_id: '',
    username: '',
    status: 'Active',
    shift_type: 'General',
    base_salary: 0,
    company_id: '',
    branch_id: '',
    department_id: '',
    designation_id: '',
    org_role_id: '',
    reporting_authority_id: '',
    access_modules: []
  });

  const [profiles, setProfiles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [orgRoles, setOrgRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modules, setModules] = useState([]);

  const [permMap, setPermMap] = useState({});
  const [expandedModules, setExpandedModules] = useState({});

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, coRes, brRes, depRes, desRes, roleRes, empRes, modRes] = await Promise.all([
          axios.get('/api/employee-profiles', { withCredentials: true }),
          axios.get('/api/companies', { withCredentials: true }),
          axios.get('/api/branches', { withCredentials: true }),
          axios.get('/api/departments', { withCredentials: true }),
          axios.get('/api/designations', { withCredentials: true }),
          axios.get('/api/roles', { withCredentials: true }),
          axios.get('/api/employees', { withCredentials: true }),
          axios.get('/api/modules', { withCredentials: true })
        ]);
        setProfiles(profRes.data || []);
        setCompanies(coRes.data || []);
        setBranches(brRes.data || []);
        setDepartments(depRes.data || []);
        setDesignations(desRes.data || []);
        setOrgRoles(roleRes.data || []);
        setEmployees(empRes.data || []);
        setModules(modRes.data || []);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };
    fetchData();

    if (isEdit) {
      axios.get(`/api/employees/${id}`, { withCredentials: true })
        .then(res => {
          const d = res.data;
          setFormData({
            ...d,
            access_modules: d.access_modules ? d.access_modules.split(',').filter(Boolean) : []
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'access_modules') {
      if (checked) {
        setFormData(prev => ({ ...prev, access_modules: [...prev.access_modules, value] }));
        setExpandedModules(prev => ({ ...prev, [value]: true })); // Auto-expand when checked
      } else {
        setFormData(prev => ({ ...prev, access_modules: prev.access_modules.filter(m => m !== value) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-populate username if profile changes and it's new
      if (name === 'profile_id' && !isEdit) {
        const selectedProfile = profiles.find(p => p.id === parseInt(value));
        if (selectedProfile) {
          if (selectedProfile.username) {
            setFormData(prev => ({ ...prev, username: selectedProfile.username }));
          } else if (selectedProfile.full_name) {
            const generated = selectedProfile.full_name.toLowerCase().split(/\s+/).join('.');
            setFormData(prev => ({ ...prev, username: generated }));
          }
        }
      }
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handlePermChange = (moduleId, fnId, action, checked) => {
    const key = `${moduleId}:${fnId}`;
    setPermMap(prev => {
      const existing = prev[key] || {};
      return { ...prev, [key]: { ...existing, [action]: checked } };
    });
  };

  const setBulkPerms = (moduleId, fns, type) => {
    setPermMap(prev => {
      const nextMap = { ...prev };
      fns.forEach(fn => {
        const key = `${moduleId}:${fn.id}`;
        const newFlags = {};
        if (type === 'all') {
          ACTION_IDS.forEach(a => newFlags[a] = true);
        } else if (type === 'standard') {
          newFlags.read = true;
          STANDARD_WRITE.forEach(a => newFlags[a] = true);
        }
        nextMap[key] = newFlags;
      });
      return nextMap;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, perm_map: permMap };
      if (isEdit) {
        await axios.put(`/api/employees/${id}`, payload, { withCredentials: true });
      } else {
        await axios.post('/api/employees', payload, { withCredentials: true });
      }
      navigate('/modules/organization-administration/employee-master');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save employee master');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  const cardStyle = { background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' };
  const cardHeaderStyle = { padding: '15px 20px', borderBottom: '1px solid #E2E8F0', background: '#f8fafc', fontWeight: '600', color: '#1e293b', margin: 0 };
  const cardBodyStyle = { padding: '20px' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#475569', fontSize: '0.875rem' };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="content-header" style={{ marginBottom: '20px' }}>
        <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>Organisation & Administration &gt; Employees &gt; Add Employee</div>
        <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <div className="avatar bg-primary text-white" style={{ width: '32px', height: '32px', fontSize: '1rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
            <i className="fas fa-user-plus"></i>
          </div>
          {isEdit ? 'Edit Employee' : 'Add Employee'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          
          {/* Left Column */}
          <div>
            {/* Profile Selection */}
            <div style={cardStyle}>
              <h5 style={cardHeaderStyle}>Employee Identity</h5>
              <div style={cardBodyStyle}>
                {profiles.length === 0 && (
                  <div style={{ padding: '10px', background: '#fffbeb', color: '#b45309', borderRadius: '6px', marginBottom: '15px', fontSize: '0.875rem' }}>
                    Add an employee in <Link to="/modules/organization-administration/employee-profile/new" style={{ color: '#d97706', fontWeight: 500 }}>Employee Profile</Link> first.
                  </div>
                )}
                <div style={{ marginBottom: '15px' }}>
                  <label style={labelStyle}>Employee Name *</label>
                  <select name="profile_id" value={formData.profile_id} onChange={handleChange} required style={inputStyle} disabled={isEdit}>
                    <option value="">— Select employee —</option>
                    {profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Username *</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} required minLength={3} style={inputStyle} readOnly={isEdit} />
                  {!isEdit && (
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px' }}>
                      <i className="fas fa-info-circle"></i> Login is created with default password <strong>12345</strong>.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div style={cardStyle}>
              <h5 style={cardHeaderStyle}>Job Information</h5>
              <div style={cardBodyStyle}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={labelStyle}>Status *</label>
                  <select name="status" value={formData.status} onChange={handleChange} required style={inputStyle}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Absconding">Absconding</option>
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={labelStyle}>Shift Type *</label>
                  <select name="shift_type" value={formData.shift_type} onChange={handleChange} required style={inputStyle}>
                    <option value="General">General Shift (9 AM to 6 PM)</option>
                    <option value="Field">Field Shift (10 AM to 7 PM)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Base Salary (Per Month) *</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ padding: '10px 15px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRight: 'none', borderRadius: '6px 0 0 6px', color: '#475569' }}>₹</div>
                    <input type="number" step="0.01" name="base_salary" value={formData.base_salary} onChange={handleChange} required style={{ ...inputStyle, borderRadius: '0 6px 6px 0' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Organization Placement */}
            <div style={cardStyle}>
              <h5 style={cardHeaderStyle}>Organization Placement</h5>
              <div style={cardBodyStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Company *</label>
                    <select name="company_id" value={formData.company_id} onChange={handleChange} required style={inputStyle}>
                      <option value="">— Select company —</option>
                      {companies.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Branch *</label>
                    <select name="branch_id" value={formData.branch_id} onChange={handleChange} required style={inputStyle}>
                      <option value="">— Select branch —</option>
                      {branches
                        .filter(b => !formData.company_id || !b.company_id || String(b.company_id) === String(formData.company_id))
                        .map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Department *</label>
                    <select name="department_id" value={formData.department_id} onChange={handleChange} required style={inputStyle}>
                      <option value="">— Select department —</option>
                      {departments
                        .filter(d => !formData.company_id || !d.company_id || String(d.company_id) === String(formData.company_id))
                        .map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Designation *</label>
                    <select name="designation_id" value={formData.designation_id} onChange={handleChange} required style={inputStyle}>
                      <option value="">— Select designation —</option>
                      {designations
                        .filter(d => !formData.company_id || !d.company_id || String(d.company_id) === String(formData.company_id))
                        .filter(d => !formData.department_id || !d.department_id || String(d.department_id) === String(formData.department_id))
                        .map(d => <option key={d.id} value={d.id}>{d.designation_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Role *</label>
                    <select name="org_role_id" value={formData.org_role_id} onChange={handleChange} required style={inputStyle}>
                      <option value="">— Select role —</option>
                      {orgRoles
                        .filter(r => !formData.company_id || !r.company_id || String(r.company_id) === String(formData.company_id))
                        .filter(r => !formData.department_id || !r.department_id || String(r.department_id) === String(formData.department_id))
                        .map(r => <option key={r.id} value={r.id}>{r.role_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Reporting Authority</label>
                    <select name="reporting_authority_id" value={formData.reporting_authority_id} onChange={handleChange} style={inputStyle}>
                      <option value="">— Select reporting authority —</option>
                      {employees
                        .filter(e => String(e.id) !== String(formData.id))
                        .filter(e => !formData.profile_id || String(e.profile_id) !== String(formData.profile_id))
                        .map(e => <option key={e.id} value={e.id}>{e.employee_name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Profile */}
            <div style={cardStyle}>
              <h5 style={cardHeaderStyle}>Access Profile & Permissions</h5>
              <div style={cardBodyStyle}>
                
                {/* Modules Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                  {modules.map(m => (
                    <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, color: '#475569', fontSize: '0.875rem' }}>
                      <input 
                        type="checkbox" 
                        name="access_modules" 
                        value={m.id} 
                        checked={formData.access_modules.includes(m.id)} 
                        onChange={handleChange}
                        style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
                      />
                      {m.title}
                    </label>
                  ))}
                </div>

                {/* Granular Permissions Matrix */}
                {formData.access_modules.length > 0 && (
                  <div>
                    <h6 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '15px' }}>Detailed Permissions Matrix</h6>
                    
                    {formData.access_modules.map(modId => {
                      const m = modules.find(x => x.id === modId);
                      if (!m) return null;
                      const isExpanded = expandedModules[m.id];
                      
                      return (
                        <div key={m.id} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '15px', overflow: 'hidden' }}>
                          <div 
                            style={{ background: '#f8fafc', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none' }}
                            onClick={(e) => {
                              if (e.target.tagName !== 'BUTTON') toggleModule(m.id);
                            }}
                          >
                            <h6 style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>{m.title}</h6>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <button type="button" onClick={() => setBulkPerms(m.id, m.functions, 'standard')} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', color: '#475569', fontWeight: 500 }}>Standard</button>
                              <button type="button" onClick={() => setBulkPerms(m.id, m.functions, 'all')} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: 500 }}>All</button>
                              <button type="button" onClick={() => setBulkPerms(m.id, m.functions, 'clear')} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', color: '#475569', fontWeight: 500 }}>Clear</button>
                              <span style={{ marginLeft: '10px', color: '#94a3b8', fontSize: '0.8rem' }}>
                                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                              </span>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                                <thead>
                                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '10px 15px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>Function</th>
                                    {ACTION_IDS.map(a => (
                                      <th key={a} style={{ padding: '10px 5px', textAlign: 'center', color: '#475569', fontWeight: 600, textTransform: 'capitalize' }}>
                                        {a}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {m.functions.map(fn => {
                                    const key = `${m.id}:${fn.id}`;
                                    const flags = permMap[key] || {};
                                    return (
                                      <tr key={fn.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '10px 15px', color: '#1e293b', fontWeight: 500, whiteSpace: 'nowrap' }}>{fn.title}</td>
                                        {ACTION_IDS.map(a => (
                                          <td key={a} style={{ padding: '10px 5px', textAlign: 'center' }}>
                                            <input 
                                              type="checkbox" 
                                              checked={!!flags[a]}
                                              onChange={(e) => handlePermChange(m.id, fn.id, a, e.target.checked)}
                                              style={{ accentColor: '#3b82f6', width: '14px', height: '14px', cursor: 'pointer' }}
                                            />
                                          </td>
                                        ))}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button type="button" onClick={() => navigate('/modules/organization-administration/employee-master')} style={{ background: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', marginRight: '10px', fontWeight: 500 }}>
                Cancel
              </button>
              <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                <i className="fas fa-save mr-1" style={{ marginRight: '5px' }}></i> {isEdit ? 'Save Employee' : 'Create Employee & User'}
              </button>
            </div>
            
          </div>
        </div>
      </form>
    </div>
  );
}
