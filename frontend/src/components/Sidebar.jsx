import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ navModules }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper to determine the sub-icon matching the Python Jinja template
  const getSubIcon = (fnId) => {
    if (['employee-profile', 'employee-master', 'users'].includes(fnId)) return "far fa-user";
    if (['company', 'departments', 'branches'].includes(fnId)) return "far fa-building";
    if (fnId === 'attendance') return "far fa-clock";
    if (fnId === 'leave') return "far fa-calendar-alt";
    if (fnId === 'payroll') return "fas fa-file-invoice-dollar";
    return "far fa-circle";
  };

  return (
    <aside className="saas-sidebar">
      <div className="sidebar-brand">
        <Link to="/" className="brand-link" style={{ textDecoration: 'none' }}>
          <img src="/assets/img/logo.png" alt="Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-title">Technovision ERP</span>
            <span className="brand-subtitle">People | Process | Progress</span>
          </div>
        </Link>
      </div>

      <div className="sidebar-menu">
        <Link to="/" className={`menu-item ${currentPath === '/' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
          <i className="fas fa-home menu-icon"></i>
          <span>Home</span>
        </Link>

        {navModules.map((item) => {
          const m = item.module || item;
          const isActiveSection = currentPath.startsWith(`/modules/${m.id}`);
          const isModuleHome = currentPath === `/modules/${m.id}`;
          
          return (
            <div key={m.id} className={`menu-section ${isActiveSection ? 'active-section' : ''}`}>
              <Link to={`/modules/${m.id}`} className={`menu-item section-title ${isModuleHome ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                <i className={`${m.fa_icon} menu-icon`}></i>
                <span>{m.title}</span>
              </Link>
              {isActiveSection && (
                <div className="menu-subitems">
                  {m.functions && m.functions.map((fn) => {
                    const fnPath = `/modules/${m.id}/${fn.id}`;
                    const isActiveFn = currentPath === fnPath;
                    return (
                      <Link key={fn.id} to={fnPath} className={`menu-subitem ${isActiveFn ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                        <i className={`${getSubIcon(fn.id)} menu-icon-small`}></i>
                        <span>{fn.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
