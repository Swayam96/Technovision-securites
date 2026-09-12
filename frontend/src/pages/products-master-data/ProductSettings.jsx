import React from 'react';

export default function ProductSettings() {
    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h4 className="mb-0">Product Module Settings</h4>
                <div className="text-muted small">Products & Master Data &gt; Settings</div>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <div className="list-group rounded-3 shadow-sm border-0 mb-4">
                        <a href="#" className="list-group-item list-group-item-action active border-0 text-primary bg-primary bg-opacity-10 fw-medium"><i className="fas fa-cog me-2"></i> General</a>
                        <a href="#" className="list-group-item list-group-item-action border-0"><i className="fas fa-box me-2"></i> Items</a>
                        <a href="#" className="list-group-item list-group-item-action border-0"><i className="fas fa-list-ul me-2"></i> Attributes</a>
                        <a href="#" className="list-group-item list-group-item-action border-0"><i className="fas fa-sort-numeric-down me-2"></i> Naming Series</a>
                        <a href="#" className="list-group-item list-group-item-action border-0"><i className="fas fa-cloud-upload-alt me-2"></i> Import/Export</a>
                        <a href="#" className="list-group-item list-group-item-action border-0"><i className="fas fa-plug me-2"></i> Integrations</a>
                    </div>
                </div>
                
                <div className="col-md-9">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white border-bottom pt-4 pb-3 px-4">
                            <h5 className="mb-0">General Settings</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="itemCodeAuto" defaultChecked />
                                <label className="form-check-label" htmlFor="itemCodeAuto">Enable Item Code Auto Generation</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="dupItemCheck" defaultChecked />
                                <label className="form-check-label" htmlFor="dupItemCheck">Enable Duplicate Item Check</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="multiUom" defaultChecked />
                                <label className="form-check-label" htmlFor="multiUom">Allow Multiple UOM per Item</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="itemApproval" />
                                <label className="form-check-label" htmlFor="itemApproval">Enable Item Approval Workflow</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="brandItem" defaultChecked />
                                <label className="form-check-label" htmlFor="brandItem">Maintain Brand-wise Item Series</label>
                            </div>
                            <div className="form-check form-switch mb-4">
                                <input className="form-check-input" type="checkbox" id="itemImage" defaultChecked />
                                <label className="form-check-label" htmlFor="itemImage">Enable Item Image Upload</label>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted small fw-medium">Set Default Price List</label>
                                <select className="form-select" style={{ maxWidth: '300px' }}>
                                    <option>Standard Selling</option>
                                    <option>Dealer Selling</option>
                                </select>
                            </div>
                            
                            <div className="mt-5 pt-3 border-top text-end">
                                <button className="btn btn-primary px-4 rounded-pill">Save Settings</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
