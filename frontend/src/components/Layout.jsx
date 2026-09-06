import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await axios.get('/api/me', { withCredentials: true });
        setUser(userRes.data.user);
        
        // We reuse the dashboard endpoint for now because it returns navModules
        const dashRes = await axios.get('/api/dashboard', { withCredentials: true });
        setData(dashRes.data);
      } catch (err) {
        console.error("Auth error in layout:", err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  if (loading || !data || !user) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>Loading Technovision ERP...</div>;
  }

  return (
    <div className="saas-layout">
      <div className="layout-wrapper">
        <Sidebar navModules={data.navModules} />
        
        <div className="layout-main">
          <Header user={user} />
          
          <main className="saas-content">
            <Outlet context={{ user, data }} />
          </main>
        </div>
      </div>
    </div>
  );
}
