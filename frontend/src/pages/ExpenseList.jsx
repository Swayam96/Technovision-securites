import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ExpenseList() {
    const [summary, setSummary] = useState({
        my_expenses: { amount: 0, count: 0 },
        pending_approval: { amount: 0, count: 0 },
        approved: { amount: 0, count: 0 },
        reimbursed: { amount: 0, count: 0 }
    });
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // UI State
    const [activeTab, setActiveTab] = useState('My Expenses');
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [detailsTab, setDetailsTab] = useState('Details');
    
    // Filter State
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [employeeFilter, setEmployeeFilter] = useState('All Employees');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/expenses', { withCredentials: true });
            setSummary(res.data.summary);
            setExpenses(res.data.expenses);
            setFilteredExpenses(res.data.expenses); // initial state
        } catch (err) {
            if (err.response?.status === 401) navigate('/login');
            setError('Failed to fetch expenses.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Filter Application
    const applyFilters = () => {
        let result = expenses;
        
        // Tab Filtering (Mock logic based on current user)
        if (activeTab === 'My Expenses') {
            result = result.filter(e => e.employee === 'Rohit Sharma' || e.employee === 'Suraj Yadav'); // Mocking "My"
        } else if (activeTab === 'Team Expenses') {
            result = result.filter(e => e.employee !== 'Rohit Sharma'); // Mocking "Team"
        }
        
        // Dropdown Filtering
        if (statusFilter !== 'All Status') {
            result = result.filter(e => e.status === statusFilter);
        }
        
        // Date Filtering
        if (startDateFilter) {
            const start = new Date(startDateFilter);
            result = result.filter(e => new Date(e.date) >= start);
        }
        if (endDateFilter) {
            const end = new Date(endDateFilter);
            end.setHours(23, 59, 59, 999);
            result = result.filter(e => new Date(e.date) <= end);
        }
        
        setFilteredExpenses(result);
        setSelectedExpense(null); // Clear side panel on filter change
    };

    // Watch for Tab Changes to Auto-Apply Tab Filter
    useEffect(() => {
        applyFilters();
    }, [activeTab, expenses]);

    const resetFilters = () => {
        setStatusFilter('All Status');
        setEmployeeFilter('All Employees');
        setStartDateFilter('');
        setEndDateFilter('');
        setActiveTab('My Expenses'); // Resetting tab as well
        setFilteredExpenses(expenses);
    };

    const handleView = (expense) => {
        setSelectedExpense(expense);
        setDetailsTab('Details');
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return { bg: '#dcfce7', color: '#166534', text: 'Approved' };
            case 'Submitted': return { bg: '#e0f2fe', color: '#0369a1', text: 'Submitted' };
            case 'Under Review': return { bg: '#ffedd5', color: '#c2410c', text: 'Under Review' };
            case 'Reimbursed': return { bg: '#f3e8ff', color: '#6b21a8', text: 'Reimbursed' };
            default: return { bg: '#f1f5f9', color: '#475569', text: status };
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>HRMS &gt; Expense Management</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Expense Management</h1>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Submit and track your business expenses. Get reimbursed faster.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#eff6ff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <div style={{ backgroundColor: '#2563eb', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                        <i className="fas fa-users"></i>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e40af' }}>Customer Master (Common)</div>
                        <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Used across Lead &rarr; Sales Inquiry &rarr; Quotation &rarr; Project &rarr; Expenses</div>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Summary Cards */}
            <div className="row mb-4" style={{ display: 'flex', gap: '20px', flexWrap: 'nowrap', overflowX: 'auto' }}>
                <div className="col" style={{ minWidth: '220px' }}>
                    <div className="card shadow-sm" style={{ borderRadius: '10px', border: 'none', borderLeft: '4px solid #3b82f6' }}>
                        <div className="card-body" style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '15px' }}>
                                <i className="fas fa-wallet"></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>My Expenses This Month</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>&#8377; {summary.my_expenses.amount.toLocaleString()}</div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{summary.my_expenses.count} expenses</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col" style={{ minWidth: '220px' }}>
                    <div className="card shadow-sm" style={{ borderRadius: '10px', border: 'none', borderLeft: '4px solid #f59e0b' }}>
                        <div className="card-body" style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '15px' }}>
                                <i className="fas fa-hourglass-half"></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Pending Approval</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>&#8377; {summary.pending_approval.amount.toLocaleString()}</div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{summary.pending_approval.count} expenses</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col" style={{ minWidth: '220px' }}>
                    <div className="card shadow-sm" style={{ borderRadius: '10px', border: 'none', borderLeft: '4px solid #10b981' }}>
                        <div className="card-body" style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '15px' }}>
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Approved</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>&#8377; {summary.approved.amount.toLocaleString()}</div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{summary.approved.count} expenses</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col" style={{ minWidth: '220px' }}>
                    <div className="card shadow-sm" style={{ borderRadius: '10px', border: 'none', borderLeft: '4px solid #8b5cf6' }}>
                        <div className="card-body" style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '15px' }}>
                                <i className="fas fa-money-bill-wave"></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Reimbursed</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>&#8377; {summary.reimbursed.amount.toLocaleString()}</div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{summary.reimbursed.count} expenses</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>
                {/* Main Content Area */}
                <div className="card shadow-sm" style={{ flex: 1, borderRadius: '10px', border: 'none', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Tabs & New Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            {['My Expenses', 'Team Expenses', 'Customer Wise', 'Reports'].map(tab => (
                                <div 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{ 
                                        cursor: 'pointer', 
                                        fontWeight: activeTab === tab ? 600 : 500,
                                        color: activeTab === tab ? '#2563eb' : '#64748b',
                                        borderBottom: activeTab === tab ? '2px solid #2563eb' : 'none',
                                        paddingBottom: '5px'
                                    }}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>
                        <button 
                            className="btn btn-primary btn-sm" 
                            style={{ background: '#2563eb', border: 'none', borderRadius: '6px', padding: '6px 16px', fontWeight: 500 }}
                            onClick={() => navigate('/modules/hrms/expenses/new')}
                        >
                            <i className="fas fa-plus mr-2"></i> New Expense
                        </button>
                    </div>

                    {/* Filters */}
                    <div style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Employee</label>
                            <select 
                                className="form-control" 
                                style={{ borderRadius: '6px', height: '38px', fontSize: '0.875rem' }}
                                value={employeeFilter}
                                onChange={(e) => setEmployeeFilter(e.target.value)}
                            >
                                <option>All Employees</option>
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '320px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Date Range</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="date" className="form-control" style={{ borderRadius: '6px', height: '38px', fontSize: '0.875rem' }} value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
                                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>to</span>
                                <input type="date" className="form-control" style={{ borderRadius: '6px', height: '38px', fontSize: '0.875rem' }} value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Expense Type</label>
                            <select className="form-control" style={{ borderRadius: '6px', height: '38px', fontSize: '0.875rem' }}>
                                <option>All Types</option>
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Customer / Client</label>
                            <select className="form-control" style={{ borderRadius: '6px', height: '38px', fontSize: '0.875rem' }}>
                                <option>All Customers</option>
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Project / Job</label>
                            <select className="form-control" style={{ borderRadius: '6px', height: '38px', fontSize: '0.875rem' }}>
                                <option>All Projects</option>
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Status</label>
                            <select 
                                className="form-control" 
                                style={{ borderRadius: '6px', height: '38px', fontSize: '0.875rem' }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All Status">All Status</option>
                                <option value="Approved">Approved</option>
                                <option value="Submitted">Submitted</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Reimbursed">Reimbursed</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className="btn btn-primary" 
                                style={{ background: '#2563eb', border: 'none', borderRadius: '6px', padding: '0 16px', height: '38px', fontSize: '0.875rem', fontWeight: 500 }}
                                onClick={applyFilters}
                            >
                                Apply
                            </button>
                            <button 
                                className="btn btn-light" 
                                style={{ color: '#2563eb', backgroundColor: '#eff6ff', border: 'none', borderRadius: '6px', padding: '0 16px', height: '38px', fontSize: '0.875rem', fontWeight: 500 }}
                                onClick={resetFilters}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 1 }}>
                                <tr>
                                    <th style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}><input type="checkbox" /></th>
                                    <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Expense ID</th>
                                    <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Date</th>
                                    <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Employee</th>
                                    <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Expense Type</th>
                                    <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Customer / Client</th>
                                    <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Project / Job</th>
                                    <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Amount (&#8377;)</th>
                                    <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Receipt</th>
                                    <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Status</th>
                                    <th style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="11" className="text-center py-4">Loading...</td></tr>
                                ) : filteredExpenses.length > 0 ? filteredExpenses.map(exp => {
                                    const statusStyle = getStatusStyle(exp.status);
                                    return (
                                        <tr key={exp.id} onClick={() => handleView(exp)} style={{ cursor: 'pointer', backgroundColor: selectedExpense?.id === exp.id ? '#f1f5f9' : 'transparent' }}>
                                            <td style={{ padding: '12px 20px' }}><input type="checkbox" onClick={(e) => e.stopPropagation()} /></td>
                                            <td style={{ padding: '12px 10px', color: '#2563eb', fontWeight: 500 }}>{exp.id}</td>
                                            <td style={{ padding: '12px 10px' }}>{exp.date}</td>
                                            <td style={{ padding: '12px 10px', fontWeight: 500 }}>{exp.employee}</td>
                                            <td style={{ padding: '12px 10px' }}>{exp.expense_type}</td>
                                            <td style={{ padding: '12px 10px' }}>{exp.customer}</td>
                                            <td style={{ padding: '12px 10px' }}>{exp.project}</td>
                                            <td style={{ padding: '12px 10px', fontWeight: 600 }}>{exp.amount.toLocaleString()}</td>
                                            <td style={{ padding: '12px 10px' }}>
                                                <div style={{ width: '24px', height: '32px', backgroundColor: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#94a3b8' }}>
                                                    <i className="fas fa-file-invoice"></i>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 10px' }}>
                                                <span style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                                                    {statusStyle.text}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 20px' }}>
                                                <button className="btn btn-sm btn-light" style={{ fontSize: '0.8rem', padding: '2px 8px', marginRight: '5px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }} onClick={(e) => { e.stopPropagation(); handleView(exp); }}>View</button>
                                                <button className="btn btn-sm btn-light" style={{ fontSize: '0.8rem', padding: '2px 8px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}><i className="fas fa-ellipsis-h"></i></button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan="11" className="text-center py-4" style={{ color: '#64748b' }}>No expenses found matching the criteria.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Panel (Expense Details) */}
                {selectedExpense && (
                    <div className="card shadow-sm" style={{ width: '400px', borderRadius: '10px', border: 'none', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Expense Details</h3>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginTop: '5px' }}>{selectedExpense.id}</div>
                            </div>
                            <div>
                                <span style={{ ...getStatusStyle(selectedExpense.status), padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500, backgroundColor: getStatusStyle(selectedExpense.status).bg, color: getStatusStyle(selectedExpense.status).color }}>
                                    {selectedExpense.status}
                                </span>
                                <button className="btn btn-sm" style={{ color: '#94a3b8', border: 'none', background: 'none', marginLeft: '10px' }} onClick={() => setSelectedExpense(null)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', padding: '0 20px', borderBottom: '1px solid #e2e8f0' }}>
                            {['Details', 'Receipt', 'Approval', 'Comments'].map(tab => (
                                <div 
                                    key={tab}
                                    onClick={() => setDetailsTab(tab)}
                                    style={{ 
                                        cursor: 'pointer', 
                                        fontWeight: detailsTab === tab ? 600 : 500,
                                        color: detailsTab === tab ? '#2563eb' : '#64748b',
                                        borderBottom: detailsTab === tab ? '2px solid #2563eb' : 'none',
                                        padding: '12px 10px',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                            {detailsTab === 'Details' && (
                                <div style={{ fontSize: '0.85rem' }}>
                                    <div className="mb-3">
                                        <div style={{ color: '#64748b', marginBottom: '2px' }}>Employee</div>
                                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{selectedExpense.employee}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ color: '#64748b', marginBottom: '2px' }}>Date</div>
                                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{selectedExpense.date}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ color: '#64748b', marginBottom: '2px' }}>Expense Type</div>
                                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{selectedExpense.expense_type}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ color: '#64748b', marginBottom: '2px' }}>Customer / Client</div>
                                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{selectedExpense.customer}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ color: '#64748b', marginBottom: '2px' }}>Project / Job</div>
                                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{selectedExpense.project}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ color: '#64748b', marginBottom: '2px' }}>Amount</div>
                                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>&#8377; {selectedExpense.amount.toLocaleString()}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ color: '#64748b', marginBottom: '2px' }}>Payment Mode</div>
                                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{selectedExpense.payment_mode}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ color: '#64748b', marginBottom: '2px' }}>Merchant / Vendor</div>
                                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{selectedExpense.merchant}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ color: '#64748b', marginBottom: '2px' }}>Description</div>
                                        <div style={{ color: '#1e293b' }}>{selectedExpense.description}</div>
                                    </div>
                                </div>
                            )}

                            {detailsTab === 'Receipt' && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', padding: '20px', borderRadius: '8px', marginBottom: '10px' }}>
                                        {/* Placeholder for receipt image matching mockup */}
                                        <div style={{ padding: '20px', border: '1px solid #e2e8f0', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontFamily: 'monospace', textAlign: 'left', fontSize: '0.8rem', color: '#333' }}>
                                            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem', marginBottom: '10px' }}>{selectedExpense.merchant}</div>
                                            <div style={{ borderBottom: '1px dashed #ccc', marginBottom: '10px' }}></div>
                                            <div>Date: {selectedExpense.date}</div>
                                            <div>Customer: {selectedExpense.employee}</div>
                                            <div style={{ borderBottom: '1px dashed #ccc', margin: '10px 0' }}></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                <span>Total:</span>
                                                <span>&#8377; {selectedExpense.amount.toLocaleString()}</span>
                                            </div>
                                            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.7rem' }}>
                                                <i className="fas fa-qrcode" style={{ fontSize: '2rem' }}></i>
                                                <br/>Thank You
                                            </div>
                                        </div>
                                    </div>
                                    <a href="#" style={{ color: '#2563eb', fontSize: '0.85rem' }}>View Full Image</a>
                                </div>
                            )}

                            {detailsTab === 'Approval' && (
                                <div style={{ fontSize: '0.85rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '15px' }}>Approval Timeline</h4>
                                    <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid #e2e8f0', marginLeft: '10px' }}>
                                        {selectedExpense.timeline.map((t, idx) => (
                                            <div key={idx} style={{ position: 'relative', marginBottom: '20px' }}>
                                                <div style={{ 
                                                    position: 'absolute', 
                                                    left: '-26px', 
                                                    top: '0', 
                                                    width: '10px', 
                                                    height: '10px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: t.done ? '#10b981' : '#cbd5e1',
                                                    border: '2px solid #fff'
                                                }}></div>
                                                <div style={{ fontWeight: 600, color: t.done ? '#1e293b' : '#94a3b8' }}>{t.step}</div>
                                                {t.by !== '-' && <div style={{ color: '#64748b' }}>by {t.by}</div>}
                                                {t.time !== '-' && <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>{t.time}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {detailsTab === 'Comments' && (
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    No comments yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                `}
            </style>
        </div>
    );
}
