import React from 'react';

export default function Loader() {
  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      background: '#f8fafc',
      flexDirection: 'column'
    }}>
      <div className="spinner" style={{
        width: '50px',
        height: '50px',
        border: '4px solid rgba(59, 130, 246, 0.2)',
        borderLeftColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '20px', color: '#64748b', fontWeight: 500, fontSize: '1rem', letterSpacing: '0.5px' }}>
        Loading Technovision ERP...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
