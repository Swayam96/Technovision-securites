import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/api/change-password', {
        password
      }, { withCredentials: true });

      if (response.data.success) {
        navigate(response.data.redirect || '/');
      }
    } catch (err) {
      console.error('Change password error details:', err);
      if (err.response && err.response.data && err.response.data.error) {
         setError(err.response.data.error);
      } else {
         setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="split-layout">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="left-content">
          <div className="branding">
            <div className="logo-wrapper">
               <img src="/assets/img/logo.png" alt="Logo" className="logo-img" />
               <div className="logo-text">
                 <h1>Technovision ERP</h1>
                 <p>People | Process | Progress</p>
               </div>
            </div>
          </div>
          <div className="hero-text">
            <h2>Secure Your Account</h2>
            <p>Please set a new password to continue accessing the platform.</p>
          </div>
          <div className="module-grid" style={{ opacity: 0.5 }}>
            <div className="module-item"><div className="icon-box blue"><i className="fas fa-users-cog"></i></div><span>HR & Payroll</span></div>
            <div className="module-item"><div className="icon-box green"><i className="fas fa-chart-line"></i></div><span>Sales & CRM</span></div>
            <div className="module-item"><div className="icon-box purple"><i className="fas fa-project-diagram"></i></div><span>Projects</span></div>
            <div className="module-item"><div className="icon-box orange"><i className="fas fa-boxes"></i></div><span>Inventory</span></div>
            <div className="module-item"><div className="icon-box light-blue"><i className="fas fa-shopping-cart"></i></div><span>Purchase</span></div>
            <div className="module-item"><div className="icon-box emerald"><i className="fas fa-tools"></i></div><span>Service & AMC</span></div>
            <div className="module-item"><div className="icon-box red"><i className="fas fa-file-invoice-dollar"></i></div><span>Finance</span></div>
            <div className="module-item"><div className="icon-box indigo"><i className="fas fa-chart-bar"></i></div><span>Reports</span></div>
          </div>
          <div className="footer-text">
             <div className="col">
                <strong>Technology for</strong><br />A Safer & Smarter World
             </div>
             <div className="col-divider"></div>
             <div className="col">
                People<br />Solutions<br />Growth
             </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="right-panel">
        <div className="lang-selector">
           <span><i className="fas fa-globe"></i> English <i className="fas fa-chevron-down" style={{ fontSize: '10px', marginLeft: '4px' }}></i></span>
        </div>
        
        <div className="login-container">
          <div className="login-header">
            <h2>Set New Password</h2>
            <p>Required for first-time login</p>
          </div>
          
          {error && <div className="auth-alert error">{error}</div>}

          <form onSubmit={handleChangePassword} autoComplete="off">
            <div className="form-group">
              <label>New Password</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-lock icon-left"></i>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Enter new password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  minLength={6}
                />
                <i 
                  className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'} icon-right show-pwd`} 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                ></i>
              </div>
            </div>
            
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-lock icon-left"></i>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  placeholder="Confirm new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  minLength={6}
                />
              </div>
            </div>

            <button className="btn-primary" type="submit" style={{ marginTop: '20px' }}>Save Password &rarr;</button>
          </form>
        </div>
        
        <div className="right-footer">
          <strong>Technovision Enterprises</strong><br />
          Version 1.0.0 | Powered by ERPNext
        </div>
      </div>
    </div>
  );
}
