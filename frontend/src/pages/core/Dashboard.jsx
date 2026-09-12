import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, data } = useOutletContext();

  if (!data || !user) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Welcome, {user.full_name}</h1>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{user.role_title} workspace</p>
        </div>
        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
          {new Date().toDateString()}
        </div>
      </div>

      <div className="row mb-4" style={{ display: 'flex', gap: '20px' }}>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div className="stat-label">Total Records</div>
          <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.stats.total}</div>
          <div className="stat-subtext" style={{ color: '#666' }}>Active across modules</div>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div className="stat-label">Open / Active</div>
          <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.stats.open}</div>
          <div className="stat-subtext text-warning" style={{ color: '#f59e0b' }}>Requires attention</div>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div className="stat-label">Assigned Modules</div>
          <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.navModules.length}</div>
          <div className="stat-subtext" style={{ color: '#666' }}>Based on permissions</div>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div className="stat-label">User Profile</div>
          <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{user.username}</div>
          <div className="stat-subtext text-primary" style={{ color: '#3b82f6' }}>{user.role_title}</div>
        </div>
      </div>

      <div className="row" style={{ display: 'flex', gap: '20px' }}>
        <div className="col-lg-8" style={{ flex: 2 }}>
          <div className="card" style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div className="card-header" style={{ padding: '15px 20px', borderBottom: '1px solid #eee' }}>
              <h3 className="card-title" style={{ margin: 0, fontSize: '1.1rem' }}>Your Modules</h3>
            </div>
            <div className="card-body p-0">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #eee' }}>
                  <tr>
                    <th style={{ padding: '12px 20px', textAlign: 'left' }}>Module</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px 20px', textAlign: 'center' }}>Records</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.navModules.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ width: '36px', height: '36px', background: '#eff6ff', color: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' }}>
                            <i className={m.fa_icon}></i>
                          </div>
                          <strong>{m.title}</strong>
                        </div>
                      </td>
                      <td style={{ padding: '15px 20px', color: '#64748b', fontSize: '0.85rem' }}>{m.blurb}</td>
                      <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{data.counts[m.id] || 0}</span>
                      </td>
                      <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                        <button onClick={() => navigate(`/modules/${m.id}`)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Open</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-4" style={{ flex: 1 }}>
          <div className="card" style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div className="card-header" style={{ padding: '15px 20px', borderBottom: '1px solid #eee' }}>
              <h3 className="card-title" style={{ margin: 0, fontSize: '1.1rem' }}>Recent Activity</h3>
            </div>
            <div className="card-body p-0">
              {data.stats.recent && data.stats.recent.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {data.stats.recent.map(r => (
                    <li key={r.id} style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{r.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>{r.entity} · {r.module_id}</div>
                      </div>
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', height: 'fit-content' }}>{r.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ padding: '20px', textAlign: 'center', color: '#64748b', margin: 0 }}>No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
