import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <i className="fas fa-hammer" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '20px' }}></i>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>Module Under Construction</h2>
      <p style={{ color: '#64748b', marginBottom: '30px' }}>
        This page has not been ported to the new React interface yet.
      </p>
      <Link to="/" style={{ background: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '4px' }}>
        Return to Dashboard
      </Link>
    </div>
  );
}
