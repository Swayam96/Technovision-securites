import React from 'react';
import { useParams, Link, useOutletContext, Navigate } from 'react-router-dom';

export default function ModuleOverview() {
  const { moduleId } = useParams();
  const { data } = useOutletContext();
  
  if (!data || !data.navModules) return <div>Loading...</div>;

  const moduleItem = data.navModules.find(m => m.id === moduleId);
  
  if (!moduleItem) {
    return <Navigate to="/" />;
  }

  const statIcons = ['fa-building', 'fa-code-branch', 'fa-sitemap', 'fa-users'];
  const statColors = ['text-primary', 'text-success', 'text-warning', 'text-purple'];

  return (
    <div style={{ padding: '20px' }}>
      <div className="content-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div className="avatar bg-primary text-white mr-3" style={{ width: '48px', height: '48px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginRight: '15px' }}>
          <i className={moduleItem.fa_icon}></i>
        </div>
        <div>
          <h1 className="mb-1" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>{moduleItem.title}</h1>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{moduleItem.blurb}</p>
        </div>
      </div>

      <div className="row mb-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {moduleItem.functions && moduleItem.functions.slice(0, 4).map((fn, index) => (
          <div key={fn.id} style={{ flex: '1 1 200px' }}>
            <div className="card stat-card h-100 mb-0" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'center', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className={`mr-3 ${statColors[index % 4]}`} style={{ fontSize: '2rem', marginRight: '15px' }}>
                 <i className={`fas ${statIcons[index % 4]}`}></i>
              </div>
              <div>
                <div className="stat-label mb-0" style={{ fontSize: '0.8rem', color: '#64748b' }}>{fn.title}</div>
                <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.counts[fn.id] || 0}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row" style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 2 }}>
          <h5 className="mb-3 font-weight-bold" style={{ fontSize: '1rem', color: '#1E293B', marginBottom: '15px' }}>Quick Access</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {moduleItem.functions && moduleItem.functions.map(fn => (
              <Link 
                key={fn.id} 
                to={`/modules/${moduleItem.id}/${fn.id}`} 
                className="card" 
                style={{ 
                  flex: '1 1 200px', 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  textDecoration: 'none', 
                  padding: '15px', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  background: '#fff',
                  color: '#1E293B',
                  boxShadow: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div className="avatar bg-light text-primary" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', marginRight: '15px', background: '#f8f9fa' }}>
                  <i className="far fa-circle text-primary" style={{ color: '#007bff' }}></i>
                </div>
                <span className="font-weight-500" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{fn.title}</span>
              </Link>
            ))}
          </div>

          <div className="card mt-4" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', marginTop: '20px' }}>
            <div className="card-header" style={{ padding: '15px 20px', borderBottom: '1px solid #eee' }}>
              <h3 className="card-title" style={{ margin: 0, fontSize: '1.1rem' }}>Recent Activities</h3>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush" style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.85rem' }}>
                <li className="list-group-item" style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #eee' }}>
                  <i className="fas fa-user-plus text-primary mr-3" style={{ fontSize: '1.2rem', width: '24px', color: '#0d6efd' }}></i>
                  <div>
                    New employee added: <strong>Rohit Sharma</strong><br/>
                    <span className="text-muted">2 hours ago</span>
                  </div>
                </li>
                <li className="list-group-item" style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #eee' }}>
                  <i className="fas fa-sitemap text-success mr-3" style={{ fontSize: '1.2rem', width: '24px', color: '#198754' }}></i>
                  <div>
                    Department updated: <strong>Service Department</strong><br/>
                    <span className="text-muted">5 hours ago</span>
                  </div>
                </li>
                <li className="list-group-item" style={{ display: 'flex', alignItems: 'center', padding: '15px 20px' }}>
                  <i className="fas fa-calendar-plus text-warning mr-3" style={{ fontSize: '1.2rem', width: '24px', color: '#ffc107' }}></i>
                  <div>
                    Holiday list created: <strong>Maharashtra Holiday List 2026</strong><br/>
                    <span className="text-muted">1 day ago</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="card overflow-hidden" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
            <div style={{ height: '120px', background: 'url("/assets/img/login-bg.png") center/cover', backgroundColor: '#3b82f6' }}></div>
            <div className="card-body text-center" style={{ padding: '20px', paddingTop: 0, position: 'relative' }}>
              <div className="avatar bg-white shadow-sm mx-auto" style={{ width: '64px', height: '64px', marginTop: '-32px', marginBottom: '1rem', borderRadius: '50%', padding: '8px', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)' }}>
                <img src="/assets/img/logo.png" width="48" height="48" alt="Logo" style={{ objectFit: 'contain' }} />
              </div>
              <h5 className="font-weight-bold mb-1" style={{ fontSize: '1.1rem', margin: '0 0 5px 0' }}>Technovision Enterprises</h5>
              <p className="text-muted small mb-3" style={{ fontSize: '0.85rem', color: '#64748b' }}>Head Office: Mumbai, Maharashtra, India</p>
              
              <div className="text-left small mb-2" style={{ textAlign: 'left', fontSize: '0.85rem', marginBottom: '8px' }}>
                <strong>CIN:</strong> U74999MH2022PTC390214
              </div>
              <div className="text-left small mb-2" style={{ textAlign: 'left', fontSize: '0.85rem', marginBottom: '8px' }}>
                <strong>PAN:</strong> AABCT2967K
              </div>
              <div className="text-left small mb-4" style={{ textAlign: 'left', fontSize: '0.85rem', marginBottom: '16px' }}>
                <strong>Website:</strong> <a href="#" style={{ color: '#0d6efd' }}>www.technovision.in</a>
              </div>
              
              <div className="p-3 bg-light rounded text-left" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', textAlign: 'left' }}>
                <div className="d-flex align-items-center mb-2" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <i className="fas fa-hands-helping text-primary mr-2" style={{ fontSize: '1.5rem', color: '#0d6efd', marginRight: '8px' }}></i>
                  <span className="font-weight-bold text-primary" style={{ color: '#0d6efd', fontWeight: 'bold' }}>Together</span>
                </div>
                <p className="mb-0 font-weight-500" style={{ color: '#1E293B', margin: 0, fontWeight: 500 }}>We Build a Stronger Organisation™</p>
              </div>
            </div>
          </div>
          
          <div className="card mt-3" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', marginTop: '15px' }}>
            <div className="card-body py-2" style={{ padding: '10px 20px' }}>
              <a href="#" className="text-dark text-decoration-none d-flex align-items-center py-2" style={{ display: 'flex', alignItems: 'center', color: '#212529', textDecoration: 'none', padding: '8px 0' }}>
                <i className="fas fa-cog text-muted mr-3" style={{ color: '#6c757d', marginRight: '12px' }}></i> Settings
              </a>
              <hr className="my-1" style={{ margin: '4px 0', borderTop: '1px solid #eee' }} />
              <a href="#" className="text-dark text-decoration-none d-flex align-items-center py-2" style={{ display: 'flex', alignItems: 'center', color: '#212529', textDecoration: 'none', padding: '8px 0' }}>
                <i className="far fa-question-circle text-muted mr-3" style={{ color: '#6c757d', marginRight: '12px' }}></i> Help & Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
