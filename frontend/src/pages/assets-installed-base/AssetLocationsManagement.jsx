
import React, { useState, useEffect } from 'react';
import DataImportExport from '../../components/DataImportExport';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AssetLocationsManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/assets/asset-locations', { withCredentials: true });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 text-gray-800 font-weight-bold">Asset Locations</h4>
        </div>
        <div>
          <Link to="/modules/assets-installed-base/asset-locations/new" className="btn btn-primary btn-sm px-3 shadow-sm rounded-pill">
          <i className="fas fa-plus fa-sm text-white-50 me-2"></i> New
        </Link>
          <DataImportExport data={data} tableName="assets" onImportSuccess={fetchData} />
        </div>
      </div>

      <div className="card shadow mb-4 border-0">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">No records found</td></tr>
                  ) : (
                    data.map(item => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td className="font-weight-bold">{item.location_name || item.location_name || item.id}</td>
                        <td>
                          <span className="badge bg-success rounded-pill px-3 py-2">{item.status || 'Active'}</span>
                        </td>
                        <td>
                          <Link to={`/modules/assets-installed-base/asset-locations/${item.id}`} className="btn btn-sm btn-link text-primary p-0 me-2"><i className="fas fa-edit"></i> Edit</Link>
                          <button className="btn btn-sm btn-link text-danger p-0"><i className="fas fa-trash"></i></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
