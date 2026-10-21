import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from './Loader';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await axios.get('/api/me', { withCredentials: true, cache: false });
        setUser(userRes.data.user);
      } catch (err) {
        console.error("Auth error in layout:", err);
        navigate('/login');
        return;
      }

      try {
        // We reuse the dashboard endpoint for now because it returns navModules
        const dashRes = await axios.get('/api/dashboard', { withCredentials: true, cache: false });
        setData(dashRes.data);
      } catch (err) {
        console.error("Dashboard data load error in layout:", err);
        // Fallback with empty structure so authenticated user can still use the app
        setData({ navModules: [], counts: {}, stats: {} });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  if (loading || !data || !user) {
    return <Loader />;
  }

  return (
    <div className="saas-layout">
      <div className="layout-wrapper">
        <Sidebar navModules={data.navModules} />
        
        <div className="layout-main">
          <Header user={user} />
          
          <main className="saas-content" style={{ position: 'relative', overflowX: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                style={{ width: '100%', height: '100%' }}
              >
                <Outlet context={{ user, data }} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
