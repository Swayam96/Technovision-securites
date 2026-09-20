import React, { useState, useEffect } from 'react';
import DataImportExport from '../../components/DataImportExport';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function PriceListManagement() {
    const [priceLists, setPriceLists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/api/products/price-lists', { withCredentials: true })
            .then(res => {
                setPriceLists(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching price lists:", err);
                setLoading(false);
            });
    }, []);

    const getStatusBadge = (status) => {
        return status === 'Active' 
            ? <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Active</span>
            : <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">{status}</span>;
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Price Lists</h4>
                    <div className="text-muted small">Products & Master Data &gt; Price Lists</div>
                </div>
                <div>
                    <Link to="new" className="btn btn-primary btn-sm px-3 shadow-sm rounded-pill">
                        <i className="fas fa-plus me-2"></i> New Price List
                    </Link>
          <DataImportExport data={priceLists} tableName="priceLists" onImportSuccess={() => window.location.reload()} />
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <span className="input-group-text bg-light border-0"><i className="fas fa-search text-muted"></i></span>
                        <input type="text" className="form-control bg-light border-0" placeholder="Search Price Lists..." />
                    </div>
                </div>
                <div className="card-body px-0 pt-3">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="ps-4">Price List Name</th>
                                        <th>Currency</th>
                                        <th>Applicable To</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th className="text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {priceLists.map((list) => (
                                        <tr key={list.id}>
                                            <td className="ps-4 fw-medium text-dark">{list.list_name}</td>
                                            <td className="text-muted">{list.currency}</td>
                                            <td className="text-muted">{list.applicable_to}</td>
                                            <td className="text-muted">{list.description}</td>
                                            <td>{getStatusBadge(list.status)}</td>
                                            <td className="text-end pe-4">
                                                <Link to={`/modules/products/price-lists/${list.id}`} className="btn btn-sm btn-link text-primary p-0 me-2"><i className="fas fa-edit"></i> Edit</Link>
                                                <button className="btn btn-sm btn-link text-muted p-0"><i className="fas fa-ellipsis-v"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
