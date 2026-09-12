import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ProductsDashboard() {
    const [metrics, setMetrics] = useState({ itemGroups: 0, brands: 0, items: 0, uoms: 0 });
    const [recentItems, setRecentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/api/products/dashboard', { withCredentials: true })
            .then(res => {
                if(res.data.metrics) setMetrics(res.data.metrics);
                if(res.data.recentItems) setRecentItems(res.data.recentItems);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product dashboard data:", err);
                setLoading(false);
            });
    }, []);

    const quickActions = [
        { icon: 'fas fa-box-open', color: 'text-primary', label: 'Item', link: '/modules/products/items/new' },
        { icon: 'fas fa-layer-group', color: 'text-success', label: 'Item Group', link: '/modules/products/item-groups/new' },
        { icon: 'fas fa-tags', color: 'text-info', label: 'Brand', link: '/modules/products/brands/new' },
        { icon: 'fas fa-balance-scale', color: 'text-warning', label: 'UOM', link: '/modules/products/uoms/new' },
        { icon: 'fas fa-list-ul', color: 'text-danger', label: 'Item Attribute', link: '/modules/products/attributes/new' },
        { icon: 'fas fa-sitemap', color: 'text-secondary', label: 'Category', link: '#' },
        { icon: 'fas fa-money-bill', color: 'text-success', label: 'Price List', link: '/modules/products/price-lists/new' },
        { icon: 'fas fa-truck', color: 'text-primary', label: 'Vendor', link: '/modules/products/suppliers/new' },
        { icon: 'fas fa-user-tie', color: 'text-info', label: 'Customer', link: '/modules/sales-presales/customers' },
        { icon: 'fas fa-percent', color: 'text-warning', label: 'Tax Master', link: '/modules/products/taxes/new' },
        { icon: 'fas fa-warehouse', color: 'text-danger', label: 'Warehouse', link: '#' },
        { icon: 'fas fa-cloud-upload-alt', color: 'text-primary', label: 'Product Import', link: '/modules/products/import' }
    ];

    if (loading) {
        return (
            <div className="container-fluid py-4 text-center">
                <div className="spinner-border text-primary mt-5" role="status"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h4 className="mb-0">Products & Master Data</h4>
                <div className="text-muted small">Manage all product, item and master data for your business.</div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-3" style={{ background: '#fff0f3' }}>
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-danger bg-opacity-25 text-danger d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                                <i className="fas fa-layer-group"></i>
                            </div>
                            <div className="ms-3">
                                <div className="text-muted small fw-medium">Item Groups</div>
                                <h3 className="mb-0 fw-bold text-dark">{metrics.itemGroups}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-3" style={{ background: '#e0fbf1' }}>
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-25 text-success d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                                <i className="fas fa-tags"></i>
                            </div>
                            <div className="ms-3">
                                <div className="text-muted small fw-medium">Brands</div>
                                <h3 className="mb-0 fw-bold text-dark">{metrics.brands}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-3" style={{ background: '#fff3cd' }}>
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning bg-opacity-25 text-warning d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                                <i className="fas fa-box-open"></i>
                            </div>
                            <div className="ms-3">
                                <div className="text-muted small fw-medium">Items</div>
                                <h3 className="mb-0 fw-bold text-dark">{metrics.items.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-3" style={{ background: '#e0e7ff' }}>
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary bg-opacity-25 text-primary d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                                <i className="fas fa-balance-scale"></i>
                            </div>
                            <div className="ms-3">
                                <div className="text-muted small fw-medium">UOMs</div>
                                <h3 className="mb-0 fw-bold text-dark">{metrics.uoms}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0">
                    <h5 className="mb-0"><i className="fas fa-bolt text-warning me-2"></i> Quick Actions</h5>
                </div>
                <div className="card-body p-4">
                    <div className="row g-4">
                        {quickActions.map((action, idx) => (
                            <div className="col-md-3 col-sm-6" key={idx}>
                                <Link to={action.link} className="text-decoration-none">
                                    <div className="d-flex align-items-center p-3 rounded-3 border custom-hover-bg">
                                        <div className={`rounded-circle bg-light d-flex align-items-center justify-content-center ${action.color}`} style={{ width: '40px', height: '40px' }}>
                                            <i className={action.icon}></i>
                                        </div>
                                        <div className="ms-3 fw-medium text-dark">{action.label}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-bottom pt-4 px-4">
                            <h5 className="mb-0">Recent Items</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="list-group list-group-flush rounded-bottom-4">
                                {recentItems.map((item, idx) => (
                                    <div key={idx} className="list-group-item px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded bg-light d-flex align-items-center justify-content-center text-muted" style={{ width: '48px', height: '48px' }}>
                                                <i className="fas fa-camera"></i>
                                            </div>
                                            <div className="ms-3">
                                                <div className="fw-medium text-dark">{item.item_name}</div>
                                                <div className="text-muted small">{item.item_code} &bull; {item.brand}</div>
                                            </div>
                                        </div>
                                        <div className="text-muted small">Just now</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-primary text-white text-center d-flex flex-column justify-content-center align-items-center p-5">
                        <i className="fas fa-cubes mb-4" style={{ fontSize: '4rem', opacity: '0.8' }}></i>
                        <h4 className="fw-bold mb-2">Build a Stronger Product Catalogue</h4>
                        <p className="mb-4 text-white-50">Centralize. Standardize. Grow.</p>
                        <Link to="/modules/products/items/new" className="btn btn-light rounded-pill px-4 text-primary fw-medium shadow">Add New Item</Link>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-hover-bg:hover {
                    background-color: #f8fafc;
                    border-color: #cbd5e1 !important;
                }
            `}</style>
        </div>
    );
}
