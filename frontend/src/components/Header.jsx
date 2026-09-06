import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Header({ user }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  return (
    <header className="saas-header">
      <div className="header-search">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search or type a command (Ctrl + G)" className="search-input" />
      </div>
      
      <div className="header-right">
        <div className={`header-action profile-dropdown dropdown ${dropdownOpen ? 'show' : ''}`} style={{ position: 'relative' }}>
          <div 
            className="profile-btn" 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="profile-avatar">
              <span className="avatar-initials">{user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'U'}</span>
            </div>
            <div className="profile-info">
              <span className="profile-name">{user?.full_name}</span>
              <span className="profile-role">{user?.role_title}</span>
            </div>
            <i className="fas fa-chevron-down" style={{ fontSize: '10px', marginLeft: '10px', color: '#64748b' }}></i>
          </div>
          
          {dropdownOpen && (
            <div className="dropdown-menu dropdown-menu-right profile-menu shadow-sm show" style={{ position: 'absolute', right: 0, top: '100%', minWidth: '200px' }}>
              <a href="#" className="dropdown-item">
                <i className="far fa-user text-muted mr-2"></i> My Profile
              </a>
              <a href="#" className="dropdown-item">
                <i className="fas fa-cog text-muted mr-2"></i> Settings
              </a>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item text-danger" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i> Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
