import React from 'react';

export default function ProductImport() {
    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h4 className="mb-0">Import Items</h4>
                <div className="text-muted small">Products & Master Data &gt; Import Items</div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-5">
                    <div className="d-flex justify-content-between mb-5" style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <div className="progress" style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', zIndex: '0' }}>
                            <div className="progress-bar bg-primary" role="progressbar" style={{ width: '25%' }}></div>
                        </div>
                        <div className="text-center" style={{ zIndex: '1' }}>
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '32px', height: '32px' }}>1</div>
                            <span className="small fw-bold">Upload</span>
                        </div>
                        <div className="text-center" style={{ zIndex: '1' }}>
                            <div className="bg-light text-muted rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 border" style={{ width: '32px', height: '32px' }}>2</div>
                            <span className="small text-muted">Map Fields</span>
                        </div>
                        <div className="text-center" style={{ zIndex: '1' }}>
                            <div className="bg-light text-muted rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 border" style={{ width: '32px', height: '32px' }}>3</div>
                            <span className="small text-muted">Validate</span>
                        </div>
                        <div className="text-center" style={{ zIndex: '1' }}>
                            <div className="bg-light text-muted rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 border" style={{ width: '32px', height: '32px' }}>4</div>
                            <span className="small text-muted">Import</span>
                        </div>
                    </div>

                    <div className="text-center py-5 px-3 border border-2 border-dashed rounded bg-light" style={{ borderColor: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
                        <div className="mb-3 text-primary">
                            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '48px' }}></i>
                        </div>
                        <h5>Drag and drop your file here</h5>
                        <p className="text-muted mb-4">or</p>
                        <button className="btn btn-outline-primary px-4 py-2 rounded-pill">Choose File</button>
                        
                        <div className="mt-4 pt-4 border-top">
                            <p className="small text-muted mb-1">Supported format: .xlsx, .xls | Use the provided template</p>
                            <a href="#" className="small text-primary text-decoration-none"><i className="fas fa-download me-1"></i> Download Item Import Template</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
