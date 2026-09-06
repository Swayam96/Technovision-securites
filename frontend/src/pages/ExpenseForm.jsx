import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExpenseForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        expenseType: '',
        customer: '',
        project: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        paymentMode: '',
        merchant: '',
        gstAmount: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mock API call delay
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/modules/hrms/expenses');
        }, 800);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100%' }}>
            {/* Header */}
            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <div className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>HRMS &gt; Expenses &gt; New</div>
                    <h1 className="mb-0 d-flex align-items-center" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                        <button 
                            onClick={() => navigate('/modules/hrms/expenses')}
                            className="btn btn-sm btn-light shadow-sm"
                            style={{ marginRight: '15px', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        Add Expense
                    </h1>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '10px' }}>
                        <div className="card-header bg-white" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                            <h3 className="card-title mb-0" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Expense Details</h3>
                        </div>
                        <div className="card-body" style={{ padding: '30px' }}>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>Expense Type *</label>
                                        <select name="expenseType" className="form-control" value={formData.expenseType} onChange={handleChange} required style={{ borderRadius: '6px' }}>
                                            <option value="">Select Type</option>
                                            <option value="Fuel">Fuel</option>
                                            <option value="Travel (Outstation)">Travel (Outstation)</option>
                                            <option value="Local Conveyance">Local Conveyance</option>
                                            <option value="Material Purchase">Material Purchase</option>
                                            <option value="Hotel / Accommodation">Hotel / Accommodation</option>
                                            <option value="Food / Meals">Food / Meals</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>Customer / Client</label>
                                        <select name="customer" className="form-control" value={formData.customer} onChange={handleChange} style={{ borderRadius: '6px' }}>
                                            <option value="">Select Customer</option>
                                            <option value="ABC Industries">ABC Industries</option>
                                            <option value="XYZ Infra">XYZ Infra</option>
                                            <option value="LMN Pharma">LMN Pharma</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>Project / Job</label>
                                        <select name="project" className="form-control" value={formData.project} onChange={handleChange} style={{ borderRadius: '6px' }}>
                                            <option value="">Select Project</option>
                                            <option value="P-1042 - Office Setup">P-1042 - Office Setup</option>
                                            <option value="P-0987 - CCTV Install">P-0987 - CCTV Install</option>
                                            <option value="P-1105 - AMC Visit">P-1105 - AMC Visit</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>Date *</label>
                                        <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required style={{ borderRadius: '6px' }} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>Amount (&#8377;) *</label>
                                        <input type="number" step="0.01" name="amount" className="form-control" placeholder="0.00" value={formData.amount} onChange={handleChange} required style={{ borderRadius: '6px' }} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>Payment Mode *</label>
                                        <select name="paymentMode" className="form-control" value={formData.paymentMode} onChange={handleChange} required style={{ borderRadius: '6px' }}>
                                            <option value="">Select Mode</option>
                                            <option value="Personal Card (Reimburse)">Personal Card (Reimburse)</option>
                                            <option value="Corporate Card">Corporate Card</option>
                                            <option value="Cash">Cash</option>
                                            <option value="UPI">UPI</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>Merchant / Vendor *</label>
                                        <input type="text" name="merchant" className="form-control" placeholder="e.g. Shell Fuel Station" value={formData.merchant} onChange={handleChange} required style={{ borderRadius: '6px' }} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>GST Amount (Optional)</label>
                                        <input type="number" step="0.01" name="gstAmount" className="form-control" placeholder="0.00" value={formData.gstAmount} onChange={handleChange} style={{ borderRadius: '6px' }} />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>Description *</label>
                                    <textarea name="description" className="form-control" rows="3" placeholder="Explain the purpose of this expense..." value={formData.description} onChange={handleChange} required style={{ borderRadius: '6px' }}></textarea>
                                </div>

                                <hr style={{ borderColor: '#e2e8f0', margin: '30px 0' }} />

                                <div className="d-flex justify-content-end gap-2" style={{ gap: '10px' }}>
                                    <button type="button" className="btn btn-light" style={{ padding: '10px 20px', borderRadius: '6px' }} onClick={() => navigate('/modules/hrms/expenses')}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-outline-primary" style={{ padding: '10px 20px', borderRadius: '6px' }} onClick={() => navigate('/modules/hrms/expenses')}>
                                        Save as Draft
                                    </button>
                                    <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', border: 'none', padding: '10px 20px', borderRadius: '6px' }} disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '10px' }}>
                        <div className="card-header bg-white" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                            <h3 className="card-title mb-0" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Add Receipt</h3>
                        </div>
                        <div className="card-body text-center" style={{ padding: '40px 30px' }}>
                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '40px 20px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                                <i className="fas fa-cloud-upload-alt mb-3" style={{ fontSize: '2.5rem', color: '#94a3b8' }}></i>
                                <h5 style={{ color: '#475569', fontWeight: 600 }}>Upload Receipt</h5>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>Drag and drop or click to browse</p>
                                <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '10px' }}>PNG, JPG, PDF up to 5MB</p>
                            </div>
                            
                            <div style={{ marginTop: '20px' }}>
                                <button className="btn btn-outline-secondary w-100 mb-2" style={{ borderRadius: '6px' }}>
                                    <i className="fas fa-camera mr-2"></i> Capture from Camera
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
