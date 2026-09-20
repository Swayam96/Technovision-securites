import React from 'react';

export default function TableSkeleton({ columns = 5, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="skeleton-row" style={{ borderBottom: '1px solid #eee' }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} style={{ padding: '15px 20px' }}>
              <div 
                className="skeleton-cell"
                style={{
                  height: '20px',
                  width: colIndex === 0 ? '70%' : colIndex === columns - 1 ? '40px' : '90%',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  margin: colIndex === columns - 1 ? '0 auto' : '0'
                }}
              ></div>
            </td>
          ))}
        </tr>
      ))}
      <style>{`
        .skeleton-cell {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
