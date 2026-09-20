import React, { useState, useEffect } from 'react';
import DataImportExport from '../../components/DataImportExport';
import axios from 'axios';
import { Link } from 'react-router-dom';

const QuotationManagement = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotations = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/sales/quotations', {
                    withCredentials: true
                });
                setQuotations(response.data);
            } catch (error) {
                console.error("Error fetching quotations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotations();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Draft':
                return <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">Draft</span>;
            case 'Sent':
                return <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">Sent</span>;
            case 'Viewed':
                return <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">Viewed</span>;
            case 'Accepted':
                return <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Accepted</span>;
            case 'Expired':
                return <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">Expired</span>;
            default:
                return <span className="badge bg-light text-dark px-3 py-2 rounded-pill">{status}</span>;
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Quotations</h4>
                    <div className="text-muted small">Sales & Presales &gt; Quotation Management</div>
                </div>
                <div>
                    <Link to="new" className="btn btn-primary btn-sm px-3 shadow-sm rounded-pill">
                        <i className="fas fa-plus me-2"></i> New Quotation
                    </Link>
          <DataImportExport data={quotations} tableName="quotations" onImportSuccess={() => window.location.reload()} />
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <span className="input-group-text bg-light border-0"><i className="fas fa-search text-muted"></i></span>
                        <input type="text" className="form-control bg-light border-0" placeholder="Search quotations..." />
                    </div>
                    <div className="d-flex gap-2">
                        <select className="form-select border-0 bg-light rounded-pill px-4 text-muted small" style={{ minWidth: '150px' }}>
                            <option>All Status</option>
                            <option>Draft</option>
                            <option>Sent</option>
                            <option>Accepted</option>
                        </select>
                        <select className="form-select border-0 bg-light rounded-pill px-4 text-muted small" style={{ minWidth: '150px' }}>
                            <option>All Customers</option>
                        </select>
                    </div>
                </div>
                <div className="card-body px-0 pt-3">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="ps-4 rounded-start">Quotation No</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Subject</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th className="text-end pe-4 rounded-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotations.map((qtn) => (
                                        <tr key={qtn.id}>
                                            <td className="ps-4 fw-medium text-primary"><a href="#" className="text-decoration-none">{qtn.qtn_no}</a></td>
                                            <td className="text-muted">{qtn.date}</td>
                                            <td className="text-muted">{qtn.customer}</td>
                                            <td className="text-muted">{qtn.subject}</td>
                                            <td className="text-muted">₹ {parseInt(qtn.amount).toLocaleString('en-IN')}</td>
                                            <td>{getStatusBadge(qtn.status)}</td>
                                            <td className="text-end pe-4">
                                                <Link to={`/modules/sales-presales/quotations/${qtn.id}`} className="btn btn-sm btn-link text-primary p-0 me-2"><i className="fas fa-edit"></i> Edit</Link>
                                                <button className="btn btn-sm btn-link text-muted p-0"><i className="fas fa-ellipsis-v"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="card-footer bg-white border-top px-4 py-3 d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Showing 1 to {quotations.length} of {quotations.length} entries</span>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className="page-item disabled"><a className="page-link border-0" href="#">&lt;</a></li>
                            <li className="page-item active"><a className="page-link border-0 rounded" href="#">1</a></li>
                            <li className="page-item"><a className="page-link border-0 text-dark" href="#">2</a></li>
                            <li className="page-item"><a className="page-link border-0 text-dark" href="#">3</a></li>
                            <li className="page-item"><a className="page-link border-0" href="#">&gt;</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default QuotationManagement;
