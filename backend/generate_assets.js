const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/assets-installed-base');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const listTemplate = (componentName, apiPath, title, idField) => `
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ${componentName}Management() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/assets/${apiPath}', { withCredentials: true });
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
        <h4 className="mb-0 text-gray-800 font-weight-bold">${title}</h4>
        <Link to="/modules/assets-installed-base/${apiPath}/new" className="btn btn-primary shadow-sm">
          <i className="fas fa-plus fa-sm text-white-50 me-2"></i> New
        </Link>
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
                        <td className="font-weight-bold">{item.${idField} || item.location_name || item.id}</td>
                        <td>
                          <span className="badge bg-success rounded-pill px-3 py-2">{item.status || 'Active'}</span>
                        </td>
                        <td>
                          <Link to={\`/modules/assets-installed-base/${apiPath}/\${item.id}\`} className="btn btn-sm btn-link text-primary p-0 me-2"><i className="fas fa-edit"></i> Edit</Link>
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
`;

const formTemplate = (componentName, apiPath, title, idField) => `
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ${componentName}Form() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ${idField}: '',
    status: 'Active'
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(\`/api/assets/${apiPath}/\${id}\`, { withCredentials: true });
      const data = res.data;
      if (data.installation_date) data.installation_date = new Date(data.installation_date).toISOString().split('T')[0];
      if (data.warranty_expiry) data.warranty_expiry = new Date(data.warranty_expiry).toISOString().split('T')[0];
      if (data.start_date) data.start_date = new Date(data.start_date).toISOString().split('T')[0];
      if (data.end_date) data.end_date = new Date(data.end_date).toISOString().split('T')[0];
      if (data.service_date) data.service_date = new Date(data.service_date).toISOString().split('T')[0];
      setFormData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id && id !== 'new') {
        await axios.put(\`/api/assets/${apiPath}/\${id}\`, formData, { withCredentials: true });
      } else {
        await axios.post(\`/api/assets/${apiPath}\`, formData, { withCredentials: true });
      }
      navigate('/modules/assets-installed-base/${apiPath}');
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-gray-800 font-weight-bold">{id === 'new' ? 'Create' : 'Edit'} ${title}</h4>
      </div>

      <div className="card shadow mb-4 border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label font-weight-bold">Reference / ID</label>
                <input type="text" className="form-control" name="${idField}" value={formData.${idField} || ''} onChange={handleChange} required />
              </div>
              {apiPath !== 'locations' && (
                <div className="col-md-6">
                  <label className="form-label font-weight-bold">Status</label>
                  <select className="form-select form-control" name="status" value={formData.status || ''} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="In Service">In Service</option>
                    <option value="Under AMC">Under AMC</option>
                    <option value="Expired">Expired</option>
                    <option value="Completed">Completed</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary px-4 me-2">Save</button>
              <button type="button" onClick={() => navigate('/modules/assets-installed-base/${apiPath}')} className="btn btn-light px-4 border">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
`;

const configs = [
  { comp: 'AssetRegistry', path: 'asset-registry', title: 'Asset Registry', idField: 'asset_no' },
  { comp: 'WarrantyAMC', path: 'warranty-amc', title: 'Warranty & AMC', idField: 'amc_no' },
  { comp: 'ServiceHistory', path: 'service-history', title: 'Service History', idField: 'ticket_no' },
  { comp: 'AssetLocations', path: 'asset-locations', title: 'Asset Locations', idField: 'location_name' }
];

configs.forEach(c => {
  fs.writeFileSync(path.join(dir, c.comp + 'Management.jsx'), listTemplate(c.comp, c.path, c.title, c.idField));
  fs.writeFileSync(path.join(dir, c.comp + 'Form.jsx'), formTemplate(c.comp, c.path, c.title, c.idField));
});

console.log('Assets components generated successfully.');
