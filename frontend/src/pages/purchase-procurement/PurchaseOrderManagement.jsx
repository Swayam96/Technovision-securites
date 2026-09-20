
import React, { useState, useEffect } from 'react';
import DataImportExport from '../../components/DataImportExport';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function PurchaseOrderManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/purchase/orders', { withCredentials: true });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-gray-800 font-weight-bold">Purchase Order Management</h4>
        <Link to="/modules/purchase-procurement/purchase-orders/new" className="btn btn-primary btn-sm px-3 shadow-sm rounded-pill">
          <i className="fas fa-plus fa-sm text-white-50 mr-2"></i> New Purchase Order
        </Link>
      </div>

      <div className="card shadow mb-4 border-0">
        <div className="card-header py-3 bg-white d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">All Purchase Orders</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td>{item.rfq_no || item.po_no || item.grn_no || item.invoice_no || item.payment_no || item.return_no || item.id}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.supplier_name || 'N/A'}</td>
                    <td>
                      <span className="badge bg-success">{item.status}</span>
                    </td>
                    <td>
                      <Link to={`/modules/purchase-procurement/purchase-orders/${item.id}`} className="btn btn-sm btn-link text-primary p-0 me-2"><i className="fas fa-edit"></i> Edit</Link>
          <DataImportExport data={data} tableName="purchase" onImportSuccess={fetchData} />
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-4">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
