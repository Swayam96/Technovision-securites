import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const SalesDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/sales/dashboard', {
                    withCredentials: true
                });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching sales dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!data) return <div>Failed to load data.</div>;

    const { metrics, pipelineData, opportunityByStage, recentActivities, myTasks } = data;

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Sales & Presales Dashboard</h4>
                    <div className="text-muted small">Sales & Presales &gt; Dashboard</div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm px-3 shadow-sm rounded-pill">
                        <i className="fas fa-download me-2"></i> Report
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 small fw-bold text-uppercase">Total Leads</p>
                                    <h3 className="mb-0 fw-bold">{metrics.totalLeads}</h3>
                                </div>
                                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                    <i className="fas fa-users fs-5"></i>
                                </div>
                            </div>
                            <div className="mt-3 text-success small fw-bold">
                                <i className="fas fa-arrow-up me-1"></i> {metrics.leadsTrend}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 small fw-bold text-uppercase">Opportunities</p>
                                    <h3 className="mb-0 fw-bold">{metrics.totalOpps}</h3>
                                </div>
                                <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                    <i className="fas fa-bullseye fs-5"></i>
                                </div>
                            </div>
                            <div className="mt-3 text-success small fw-bold">
                                <i className="fas fa-arrow-up me-1"></i> {metrics.oppsTrend}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 small fw-bold text-uppercase">Quotations</p>
                                    <h3 className="mb-0 fw-bold">{metrics.totalQtns}</h3>
                                </div>
                                <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                    <i className="fas fa-file-invoice-dollar fs-5"></i>
                                </div>
                            </div>
                            <div className="mt-3 text-success small fw-bold">
                                <i className="fas fa-arrow-up me-1"></i> {metrics.qtnsTrend}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 small fw-bold text-uppercase">Sales Orders</p>
                                    <h3 className="mb-0 fw-bold">{metrics.totalOrders}</h3>
                                </div>
                                <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                    <i className="fas fa-shopping-cart fs-5"></i>
                                </div>
                            </div>
                            <div className="mt-3 text-success small fw-bold">
                                <i className="fas fa-arrow-up me-1"></i> {metrics.ordersTrend}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                            <h5 className="mb-0 fw-bold">Sales Pipeline (Value)</h5>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <LineChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} dx={-10} />
                                        <RechartsTooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                        <Line type="monotone" dataKey="leads" name="Leads" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                                        <Line type="monotone" dataKey="opportunity" name="Opportunity" stroke="#22c55e" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                                        <Line type="monotone" dataKey="quotation" name="Quotation" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                                        <Line type="monotone" dataKey="salesOrder" name="Sales Order" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                            <h5 className="mb-0 fw-bold">Opportunity by Stage</h5>
                        </div>
                        <div className="card-body p-0 d-flex flex-column align-items-center justify-content-center relative">
                            <div style={{ width: '100%', height: 220, position: 'relative' }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={opportunityByStage}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {opportunityByStage.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ color: '#333' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div className="text-muted small fw-bold">Total</div>
                                    <h3 className="mb-0 fw-bold">{metrics.totalOpps}</h3>
                                </div>
                            </div>
                            
                            <div className="w-100 px-4 pb-4">
                                <div className="row g-2">
                                    {opportunityByStage.map((stage, idx) => (
                                        <div className="col-6 d-flex align-items-center justify-content-between" key={idx}>
                                            <div className="d-flex align-items-center">
                                                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: stage.fill, marginRight: 8 }}></div>
                                                <span className="small text-muted">{stage.name}</span>
                                            </div>
                                            <span className="small fw-bold">{stage.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lists Row */}
            <div className="row g-4">
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Recent Activities</h5>
                            <button className="btn btn-link text-decoration-none p-0">View All</button>
                        </div>
                        <div className="card-body px-4 pb-4 pt-0">
                            <div className="timeline-wrapper">
                                {recentActivities.map((act, idx) => (
                                    <div className="d-flex align-items-start mb-3" key={act.id}>
                                        <div className={`${act.color} bg-opacity-10 p-2 rounded-circle me-3 mt-1`}>
                                            <i className={act.icon} style={{ width: '16px', textAlign: 'center' }}></i>
                                        </div>
                                        <div>
                                            <p className="mb-1 fw-medium">{act.title}</p>
                                            <small className="text-muted">{act.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">My Tasks</h5>
                            <button className="btn btn-sm btn-outline-primary rounded-pill px-3">
                                <i className="fas fa-plus me-1"></i> Add Task
                            </button>
                        </div>
                        <div className="card-body px-4 pb-4 pt-0">
                            <div className="list-group list-group-flush">
                                {myTasks.map((task) => (
                                    <div className="list-group-item px-0 py-3 border-bottom d-flex align-items-start" key={task.id}>
                                        <div className="form-check me-3">
                                            <input className="form-check-input" type="checkbox" value="" id={`task-${task.id}`} />
                                        </div>
                                        <div className="flex-grow-1">
                                            <label className="form-check-label mb-1 fw-medium" htmlFor={`task-${task.id}`}>
                                                {task.title}
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <small className={`fw-bold me-3 ${task.urgent ? 'text-danger' : 'text-primary'}`}>
                                                    {task.due}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown">
                                                <i className="fas fa-ellipsis-v"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default SalesDashboard;
