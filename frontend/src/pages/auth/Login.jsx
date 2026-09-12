import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', {
        username,
        password
      }, { withCredentials: true });

      if (response.data.redirect) {
        navigate(response.data.redirect);
      }
    } catch (err) {
      console.error('Login error details:', err);
      if (err.response) {
         console.error('Response data:', err.response.data);
         if (err.response.data && err.response.data.error) {
             setError(err.response.data.error);
         } else {
             setError('An unexpected error occurred.');
         }
      } else if (err.request) {
         console.error('No response received (Network Error). Request details:', err.request);
         setError('Network error: Could not connect to the server.');
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
            <h2>One Integrated Platform<br />for a Smarter Tomorrow</h2>
            <p>Manage your people, projects, inventory,<br />finances and more — all in one place.</p>
          </div>
          <div className="module-grid">
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
            <h2>Welcome Back</h2>
            <p>Login to access Technovision ERP</p>
          </div>
          
          {error && <div className="auth-alert error">{error}</div>}

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="form-group">
              <label>Username</label>
              <div className="input-icon-wrapper">
                <i className="far fa-user icon-left"></i>
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-lock icon-left"></i>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <i className="far fa-eye icon-right show-pwd"></i>
              </div>
            </div>
            
            <div className="form-options">
               <label className="remember-me">
                 <input type="checkbox" defaultChecked />
                 <span>Remember me</span>
               </label>
               <a href="#" className="forgot-pwd">Forgot Password?</a>
            </div>

            <button className="btn-primary" type="submit">Login &rarr;</button>
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
