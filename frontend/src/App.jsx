import React, { Suspense } from 'react';
import Loader from './components/Loader';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import ChangePassword from './pages/auth/ChangePassword';
import { Toaster } from 'react-hot-toast';

const Dashboard = React.lazy(() => import('./pages/core/Dashboard'));
const ModuleOverview = React.lazy(() => import('./pages/core/ModuleOverview'));
import NotFound from './pages/core/NotFound';

// Organization & Admin
const CompanyList = React.lazy(() => import('./pages/organization-admin/CompanyList'));
const CompanyForm = React.lazy(() => import('./pages/organization-admin/CompanyForm'));
const DepartmentList = React.lazy(() => import('./pages/organization-admin/DepartmentList'));
const DepartmentForm = React.lazy(() => import('./pages/organization-admin/DepartmentForm'));
const DesignationList = React.lazy(() => import('./pages/organization-admin/DesignationList'));
const DesignationForm = React.lazy(() => import('./pages/organization-admin/DesignationForm'));
const RoleList = React.lazy(() => import('./pages/organization-admin/RoleList'));
const RoleForm = React.lazy(() => import('./pages/organization-admin/RoleForm'));
const UserList = React.lazy(() => import('./pages/organization-admin/UserList'));
const Permissions = React.lazy(() => import('./pages/organization-admin/Permissions'));
const EmployeeMasterList = React.lazy(() => import('./pages/organization-admin/EmployeeMasterList'));
const EmployeeMasterForm = React.lazy(() => import('./pages/organization-admin/EmployeeMasterForm'));
const EmployeeProfileList = React.lazy(() => import('./pages/organization-admin/EmployeeProfileList'));
const EmployeeProfileForm = React.lazy(() => import('./pages/organization-admin/EmployeeProfileForm'));
const BranchList = React.lazy(() => import('./pages/organization-admin/BranchList'));
const BranchForm = React.lazy(() => import('./pages/organization-admin/BranchForm'));

// HRMS
const AttendanceList = React.lazy(() => import('./pages/hrms/AttendanceList'));
const LeaveList = React.lazy(() => import('./pages/hrms/LeaveList'));
const LeaveForm = React.lazy(() => import('./pages/hrms/LeaveForm'));
const ShiftList = React.lazy(() => import('./pages/hrms/ShiftList'));
const PayrollList = React.lazy(() => import('./pages/hrms/PayrollList'));
const ExpenseList = React.lazy(() => import('./pages/hrms/ExpenseList'));
const ExpenseForm = React.lazy(() => import('./pages/hrms/ExpenseForm'));

// Sales & Presales
const SalesDashboard = React.lazy(() => import('./pages/sales-presales/SalesDashboard'));
const LeadManagement = React.lazy(() => import('./pages/sales-presales/LeadManagement'));
const LeadForm = React.lazy(() => import('./pages/sales-presales/LeadForm'));
const ContactManagement = React.lazy(() => import('./pages/sales-presales/ContactManagement'));
const ContactForm = React.lazy(() => import('./pages/sales-presales/ContactForm'));
const CustomerManagement = React.lazy(() => import('./pages/sales-presales/CustomerManagement'));
const CustomerForm = React.lazy(() => import('./pages/sales-presales/CustomerForm'));
const OpportunityManagement = React.lazy(() => import('./pages/sales-presales/OpportunityManagement'));
const OpportunityForm = React.lazy(() => import('./pages/sales-presales/OpportunityForm'));
const QuotationManagement = React.lazy(() => import('./pages/sales-presales/QuotationManagement'));
const QuotationForm = React.lazy(() => import('./pages/sales-presales/QuotationForm'));
const BOQManagement = React.lazy(() => import('./pages/sales-presales/BOQManagement'));
const BOQForm = React.lazy(() => import('./pages/sales-presales/BOQForm'));
const SalesOrderManagement = React.lazy(() => import('./pages/sales-presales/SalesOrderManagement'));
const SalesOrderForm = React.lazy(() => import('./pages/sales-presales/SalesOrderForm'));

// Products & Master Data
const ProductsDashboard = React.lazy(() => import('./pages/products-master-data/ProductsDashboard'));
const ItemManagement = React.lazy(() => import('./pages/products-master-data/ItemManagement'));
const ItemForm = React.lazy(() => import('./pages/products-master-data/ItemForm'));
const ItemGroupManagement = React.lazy(() => import('./pages/products-master-data/ItemGroupManagement'));
const ItemGroupForm = React.lazy(() => import('./pages/products-master-data/ItemGroupForm'));
const BrandManagement = React.lazy(() => import('./pages/products-master-data/BrandManagement'));
const BrandForm = React.lazy(() => import('./pages/products-master-data/BrandForm'));
const UOMManagement = React.lazy(() => import('./pages/products-master-data/UOMManagement'));
const UOMForm = React.lazy(() => import('./pages/products-master-data/UOMForm'));
const AttributeManagement = React.lazy(() => import('./pages/products-master-data/AttributeManagement'));
const AttributeForm = React.lazy(() => import('./pages/products-master-data/AttributeForm'));
const TaxMaster = React.lazy(() => import('./pages/products-master-data/TaxMaster'));
const TaxForm = React.lazy(() => import('./pages/products-master-data/TaxForm'));
const SupplierManagement = React.lazy(() => import('./pages/products-master-data/SupplierManagement'));
const SupplierForm = React.lazy(() => import('./pages/products-master-data/SupplierForm'));
const PriceListManagement = React.lazy(() => import('./pages/products-master-data/PriceListManagement'));
const PriceListForm = React.lazy(() => import('./pages/products-master-data/PriceListForm'));
const ProductImport = React.lazy(() => import('./pages/products-master-data/ProductImport'));
const ProductSettings = React.lazy(() => import('./pages/products-master-data/ProductSettings'));

// Purchase & Procurement
const PurchaseDashboard = React.lazy(() => import('./pages/purchase-procurement/PurchaseDashboard'));
const RFQManagement = React.lazy(() => import('./pages/purchase-procurement/RFQManagement'));
const RFQForm = React.lazy(() => import('./pages/purchase-procurement/RFQForm'));
const QuotationComparison = React.lazy(() => import('./pages/purchase-procurement/QuotationComparison'));
const PurchaseOrderManagement = React.lazy(() => import('./pages/purchase-procurement/PurchaseOrderManagement'));
const PurchaseOrderForm = React.lazy(() => import('./pages/purchase-procurement/PurchaseOrderForm'));
const GRNManagement = React.lazy(() => import('./pages/purchase-procurement/GRNManagement'));
const GRNForm = React.lazy(() => import('./pages/purchase-procurement/GRNForm'));
const PurchaseInvoiceManagement = React.lazy(() => import('./pages/purchase-procurement/PurchaseInvoiceManagement'));
const PurchaseInvoiceForm = React.lazy(() => import('./pages/purchase-procurement/PurchaseInvoiceForm'));
const SupplierPaymentManagement = React.lazy(() => import('./pages/purchase-procurement/SupplierPaymentManagement'));
const SupplierPaymentForm = React.lazy(() => import('./pages/purchase-procurement/SupplierPaymentForm'));
const PurchaseReturnManagement = React.lazy(() => import('./pages/purchase-procurement/PurchaseReturnManagement'));
const PurchaseReturnForm = React.lazy(() => import('./pages/purchase-procurement/PurchaseReturnForm'));
const SupplierPerformance = React.lazy(() => import('./pages/purchase-procurement/SupplierPerformance'));
const ProcurementReports = React.lazy(() => import('./pages/purchase-procurement/ProcurementReports'));
const PurchaseSettings = React.lazy(() => import('./pages/purchase-procurement/PurchaseSettings'));

// Projects & Installation
const ProjectDashboard = React.lazy(() => import('./pages/projects-installation/ProjectDashboard'));
const ProjectManagement = React.lazy(() => import('./pages/projects-installation/ProjectManagement'));
const ProjectForm = React.lazy(() => import('./pages/projects-installation/ProjectForm'));
const ProjectDetails = React.lazy(() => import('./pages/projects-installation/ProjectDetails'));
const ProjectBOQManagement = React.lazy(() => import('./pages/projects-installation/BOQManagement'));
const ProjectBOQForm = React.lazy(() => import('./pages/projects-installation/BOQForm'));
const TaskManagement = React.lazy(() => import('./pages/projects-installation/TaskManagement'));
const TaskForm = React.lazy(() => import('./pages/projects-installation/TaskForm'));
const SiteReportManagement = React.lazy(() => import('./pages/projects-installation/SiteReportManagement'));
const SiteReportForm = React.lazy(() => import('./pages/projects-installation/SiteReportForm'));
const MilestoneManagement = React.lazy(() => import('./pages/projects-installation/MilestoneManagement'));
const MilestoneForm = React.lazy(() => import('./pages/projects-installation/MilestoneForm'));
const DocumentManagement = React.lazy(() => import('./pages/projects-installation/DocumentManagement'));
const DocumentForm = React.lazy(() => import('./pages/projects-installation/DocumentForm'));
const ResourceManagement = React.lazy(() => import('./pages/projects-installation/ResourceManagement'));
const ResourceForm = React.lazy(() => import('./pages/projects-installation/ResourceForm'));
const ProjectFinancials = React.lazy(() => import('./pages/projects-installation/ProjectFinancials'));
const ProjectSettings = React.lazy(() => import('./pages/projects-installation/ProjectSettings'));

// Inventory & Logistics
const InventoryDashboard = React.lazy(() => import('./pages/inventory-logistics/InventoryDashboard'));
const WarehouseManagement = React.lazy(() => import('./pages/inventory-logistics/WarehouseManagement'));
const WarehouseForm = React.lazy(() => import('./pages/inventory-logistics/WarehouseForm'));
const StockLedgerManagement = React.lazy(() => import('./pages/inventory-logistics/StockLedgerManagement'));
const StockLedgerForm = React.lazy(() => import('./pages/inventory-logistics/StockLedgerForm'));
const MaterialReceiptManagement = React.lazy(() => import('./pages/inventory-logistics/MaterialReceiptManagement'));
const MaterialReceiptForm = React.lazy(() => import('./pages/inventory-logistics/MaterialReceiptForm'));
const MaterialIssueManagement = React.lazy(() => import('./pages/inventory-logistics/MaterialIssueManagement'));
const MaterialIssueForm = React.lazy(() => import('./pages/inventory-logistics/MaterialIssueForm'));
const StockTransferManagement = React.lazy(() => import('./pages/inventory-logistics/StockTransferManagement'));
const StockTransferForm = React.lazy(() => import('./pages/inventory-logistics/StockTransferForm'));
const StockReconciliationManagement = React.lazy(() => import('./pages/inventory-logistics/StockReconciliationManagement'));
const StockReconciliationForm = React.lazy(() => import('./pages/inventory-logistics/StockReconciliationForm'));
const DeliveryManagement = React.lazy(() => import('./pages/inventory-logistics/DeliveryManagement'));
const DeliveryForm = React.lazy(() => import('./pages/inventory-logistics/DeliveryForm'));
const ReturnsManagement = React.lazy(() => import('./pages/inventory-logistics/ReturnsManagement'));
const ReturnsForm = React.lazy(() => import('./pages/inventory-logistics/ReturnsForm'));
const InventoryReports = React.lazy(() => import('./pages/inventory-logistics/InventoryReports'));
const InventorySettings = React.lazy(() => import('./pages/inventory-logistics/InventorySettings'));

// Service & AMC
const ServiceDashboard = React.lazy(() => import('./pages/service-amc/ServiceDashboard'));
const ServiceRequestManagement = React.lazy(() => import('./pages/service-amc/ServiceRequestManagement'));
const ServiceRequestForm = React.lazy(() => import('./pages/service-amc/ServiceRequestForm'));
const ServiceCallManagement = React.lazy(() => import('./pages/service-amc/ServiceCallManagement'));
const ServiceCallForm = React.lazy(() => import('./pages/service-amc/ServiceCallForm'));
const TechnicianAssignmentManagement = React.lazy(() => import('./pages/service-amc/TechnicianAssignmentManagement'));
const TechnicianAssignmentForm = React.lazy(() => import('./pages/service-amc/TechnicianAssignmentForm'));
const PreventiveMaintenanceManagement = React.lazy(() => import('./pages/service-amc/PreventiveMaintenanceManagement'));
const PreventiveMaintenanceForm = React.lazy(() => import('./pages/service-amc/PreventiveMaintenanceForm'));
const AMCManagement = React.lazy(() => import('./pages/service-amc/AMCManagement'));
const AMCForm = React.lazy(() => import('./pages/service-amc/AMCForm'));
const BreakdownManagement = React.lazy(() => import('./pages/service-amc/BreakdownManagement'));
const BreakdownForm = React.lazy(() => import('./pages/service-amc/BreakdownForm'));
const ServiceClosureManagement = React.lazy(() => import('./pages/service-amc/ServiceClosureManagement'));
const ServiceClosureForm = React.lazy(() => import('./pages/service-amc/ServiceClosureForm'));

// Assets & Installed Base
const AssetDashboard = React.lazy(() => import('./pages/assets-installed-base/AssetDashboard'));
const AssetRegistryManagement = React.lazy(() => import('./pages/assets-installed-base/AssetRegistryManagement'));
const AssetRegistryForm = React.lazy(() => import('./pages/assets-installed-base/AssetRegistryForm'));
const WarrantyAMCManagement = React.lazy(() => import('./pages/assets-installed-base/WarrantyAMCManagement'));
const WarrantyAMCForm = React.lazy(() => import('./pages/assets-installed-base/WarrantyAMCForm'));
const ServiceHistoryManagement = React.lazy(() => import('./pages/assets-installed-base/ServiceHistoryManagement'));
const ServiceHistoryForm = React.lazy(() => import('./pages/assets-installed-base/ServiceHistoryForm'));
const AssetLocationsManagement = React.lazy(() => import('./pages/assets-installed-base/AssetLocationsManagement'));
const AssetLocationsForm = React.lazy(() => import('./pages/assets-installed-base/AssetLocationsForm'));
const AssetsReports = React.lazy(() => import('./pages/assets-installed-base/AssetsReports'));

// MIS & Management
const MISDashboard = React.lazy(() => import('./pages/mis-management/MISDashboard'));
const ReportsManagement = React.lazy(() => import('./pages/mis-management/ReportsManagement'));
const ReportsForm = React.lazy(() => import('./pages/mis-management/ReportsForm'));
const BudgetPlanningManagement = React.lazy(() => import('./pages/mis-management/BudgetPlanningManagement'));
const BudgetPlanningForm = React.lazy(() => import('./pages/mis-management/BudgetPlanningForm'));
const KPIsScorecardsManagement = React.lazy(() => import('./pages/mis-management/KPIsScorecardsManagement'));
const KPIsScorecardsForm = React.lazy(() => import('./pages/mis-management/KPIsScorecardsForm'));
const ManagementReviewManagement = React.lazy(() => import('./pages/mis-management/ManagementReviewManagement'));
const ManagementReviewForm = React.lazy(() => import('./pages/mis-management/ManagementReviewForm'));
const Analytics = React.lazy(() => import('./pages/mis-management/Analytics'));
const DataExport = React.lazy(() => import('./pages/mis-management/DataExport'));

import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Suspense fallback={<Loader />}><Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Protected routes wrapped in Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="modules/:moduleId" element={<ModuleOverview />} />
          
          <Route path="modules/organization-administration/company" element={<CompanyList />} />
          <Route path="modules/organization-administration/company/new" element={<CompanyForm />} />
          <Route path="modules/organization-administration/company/:id" element={<CompanyForm />} />
          
          <Route path="modules/organization-administration/departments" element={<DepartmentList />} />
          <Route path="modules/organization-administration/departments/new" element={<DepartmentForm />} />
          <Route path="modules/organization-administration/departments/:id" element={<DepartmentForm />} />
          
          <Route path="modules/organization-administration/designations" element={<DesignationList />} />
          <Route path="modules/organization-administration/designations/new" element={<DesignationForm />} />
          <Route path="modules/organization-administration/designations/:id" element={<DesignationForm />} />
          
          <Route path="modules/organization-administration/roles" element={<RoleList />} />
          <Route path="modules/organization-administration/roles/new" element={<RoleForm />} />
          <Route path="modules/organization-administration/roles/:id" element={<RoleForm />} />
          
          <Route path="modules/organization-administration/users" element={<UserList />} />
          <Route path="modules/organization-administration/permissions" element={<Permissions />} />
          
          <Route path="modules/organization-administration/employee-master" element={<EmployeeMasterList />} />
          <Route path="modules/organization-administration/employee-master/new" element={<EmployeeMasterForm />} />
          <Route path="modules/organization-administration/employee-master/:id" element={<EmployeeMasterForm />} />
          
          <Route path="modules/organization-administration/employee-profile" element={<EmployeeProfileList />} />
          <Route path="modules/organization-administration/employee-profile/new" element={<EmployeeProfileForm />} />
          <Route path="modules/organization-administration/employee-profile/:id" element={<EmployeeProfileForm />} />
          
          <Route path="modules/organization-administration/branches" element={<BranchList />} />
          <Route path="modules/organization-administration/branches/new" element={<BranchForm />} />
          <Route path="modules/organization-administration/branches/:id" element={<BranchForm />} />

          <Route path="modules/hrms/attendance" element={<AttendanceList />} />
          <Route path="modules/hrms/leave" element={<LeaveList />} />
          <Route path="modules/hrms/leave/new" element={<LeaveForm />} />
          <Route path="modules/hrms/shift" element={<ShiftList />} />
          <Route path="modules/hrms/payroll" element={<PayrollList />} />
          <Route path="modules/hrms/expenses" element={<ExpenseList />} />
          <Route path="modules/hrms/expenses/new" element={<ExpenseForm />} />
          <Route path="modules/hrms/expenses/:id" element={<ExpenseForm />} />
          
          <Route path="modules/sales-presales/dashboard" element={<SalesDashboard />} />
          <Route path="modules/sales-presales/leads" element={<LeadManagement />} />
          <Route path="modules/sales-presales/leads/new" element={<LeadForm />} />
          <Route path="modules/sales-presales/leads/:id" element={<LeadForm />} />
          
          <Route path="modules/sales-presales/contacts" element={<ContactManagement />} />
          <Route path="modules/sales-presales/contacts/new" element={<ContactForm />} />
          <Route path="modules/sales-presales/contacts/:id" element={<ContactForm />} />
          
          <Route path="modules/sales-presales/customers" element={<CustomerManagement />} />
          <Route path="modules/sales-presales/customers/new" element={<CustomerForm />} />
          <Route path="modules/sales-presales/customers/:id" element={<CustomerForm />} />
          
          <Route path="modules/sales-presales/opportunities" element={<OpportunityManagement />} />
          <Route path="modules/sales-presales/opportunities/new" element={<OpportunityForm />} />
          <Route path="modules/sales-presales/opportunities/:id" element={<OpportunityForm />} />
          
          <Route path="modules/sales-presales/quotations" element={<QuotationManagement />} />
          <Route path="modules/sales-presales/quotations/new" element={<QuotationForm />} />
          <Route path="modules/sales-presales/quotations/:id" element={<QuotationForm />} />
          
          <Route path="modules/sales-presales/boq-solutions" element={<BOQManagement />} />
          <Route path="modules/sales-presales/boq-solutions/new" element={<BOQForm />} />
          <Route path="modules/sales-presales/boq-solutions/:id" element={<BOQForm />} />
          
          <Route path="modules/sales-presales/sales-orders" element={<SalesOrderManagement />} />
          <Route path="modules/sales-presales/sales-orders/new" element={<SalesOrderForm />} />
          <Route path="modules/sales-presales/sales-orders/:id" element={<SalesOrderForm />} />
          
          {/* Products & Master Data Routes */}
          <Route path="modules/products/dashboard" element={<ProductsDashboard />} />
          <Route path="modules/products/items" element={<ItemManagement />} />
          <Route path="modules/products/items/new" element={<ItemForm />} />
          <Route path="modules/products/items/:id" element={<ItemForm />} />
          
          <Route path="modules/products/item-groups" element={<ItemGroupManagement />} />
          <Route path="modules/products/item-groups/new" element={<ItemGroupForm />} />
          <Route path="modules/products/item-groups/:id" element={<ItemGroupForm />} />
          
          <Route path="modules/products/brands" element={<BrandManagement />} />
          <Route path="modules/products/brands/new" element={<BrandForm />} />
          <Route path="modules/products/brands/:id" element={<BrandForm />} />
          
          <Route path="modules/products/uoms" element={<UOMManagement />} />
          <Route path="modules/products/uoms/new" element={<UOMForm />} />
          <Route path="modules/products/uoms/:id" element={<UOMForm />} />
          
          <Route path="modules/products/attributes" element={<AttributeManagement />} />
          <Route path="modules/products/attributes/new" element={<AttributeForm />} />
          <Route path="modules/products/attributes/:id" element={<AttributeForm />} />
          
          <Route path="modules/products/taxes" element={<TaxMaster />} />
          <Route path="modules/products/taxes/new" element={<TaxForm />} />
          <Route path="modules/products/taxes/:id" element={<TaxForm />} />
          
          <Route path="modules/products/suppliers" element={<SupplierManagement />} />
          <Route path="modules/products/suppliers/new" element={<SupplierForm />} />
          <Route path="modules/products/suppliers/:id" element={<SupplierForm />} />
          
          <Route path="modules/products/price-lists" element={<PriceListManagement />} />
          <Route path="modules/products/price-lists/new" element={<PriceListForm />} />
          <Route path="modules/products/price-lists/:id" element={<PriceListForm />} />
          
          <Route path="modules/products/import" element={<ProductImport />} />
          <Route path="modules/products/settings" element={<ProductSettings />} />

          {/* Purchase & Procurement Routes */}
          <Route path="modules/purchase-procurement/dashboard" element={<PurchaseDashboard />} />
          
          <Route path="modules/purchase-procurement/suppliers" element={<Navigate to="/modules/products/suppliers" replace />} />
          
          <Route path="modules/purchase-procurement/rfq" element={<RFQManagement />} />
          <Route path="modules/purchase-procurement/rfq/new" element={<RFQForm />} />
          <Route path="modules/purchase-procurement/rfq/:id" element={<RFQForm />} />
          
          <Route path="modules/purchase-procurement/quotation-compare" element={<QuotationComparison />} />
          
          <Route path="modules/purchase-procurement/purchase-orders" element={<PurchaseOrderManagement />} />
          <Route path="modules/purchase-procurement/purchase-orders/new" element={<PurchaseOrderForm />} />
          <Route path="modules/purchase-procurement/purchase-orders/:id" element={<PurchaseOrderForm />} />
          
          <Route path="modules/purchase-procurement/grn" element={<GRNManagement />} />
          <Route path="modules/purchase-procurement/grn/new" element={<GRNForm />} />
          <Route path="modules/purchase-procurement/grn/:id" element={<GRNForm />} />
          
          <Route path="modules/purchase-procurement/invoices" element={<PurchaseInvoiceManagement />} />
          <Route path="modules/purchase-procurement/invoices/new" element={<PurchaseInvoiceForm />} />
          <Route path="modules/purchase-procurement/invoices/:id" element={<PurchaseInvoiceForm />} />
          
          <Route path="modules/purchase-procurement/payments" element={<SupplierPaymentManagement />} />
          <Route path="modules/purchase-procurement/payments/new" element={<SupplierPaymentForm />} />
          <Route path="modules/purchase-procurement/payments/:id" element={<SupplierPaymentForm />} />
          
          <Route path="modules/purchase-procurement/returns" element={<PurchaseReturnManagement />} />
          <Route path="modules/purchase-procurement/returns/new" element={<PurchaseReturnForm />} />
          <Route path="modules/purchase-procurement/returns/:id" element={<PurchaseReturnForm />} />
          
          <Route path="modules/purchase-procurement/performance" element={<SupplierPerformance />} />
          <Route path="modules/purchase-procurement/reports" element={<ProcurementReports />} />
          <Route path="modules/purchase-procurement/settings" element={<PurchaseSettings />} />

          {/* Projects & Installation Routes */}
          <Route path="modules/projects-installation/dashboard" element={<ProjectDashboard />} />
          
          <Route path="modules/projects-installation/projects" element={<ProjectManagement />} />
          <Route path="modules/projects-installation/projects/new" element={<ProjectForm />} />
          <Route path="modules/projects-installation/projects/:id" element={<ProjectForm />} />
          
          <Route path="modules/projects-installation/project-details" element={<ProjectDetails />} />
          
          <Route path="modules/projects-installation/boq" element={<ProjectBOQManagement />} />
          <Route path="modules/projects-installation/boq/new" element={<ProjectBOQForm />} />
          <Route path="modules/projects-installation/boq/:id" element={<ProjectBOQForm />} />
          
          <Route path="modules/projects-installation/tasks" element={<TaskManagement />} />
          <Route path="modules/projects-installation/tasks/new" element={<TaskForm />} />
          <Route path="modules/projects-installation/tasks/:id" element={<TaskForm />} />
          
          <Route path="modules/projects-installation/site-reports" element={<SiteReportManagement />} />
          <Route path="modules/projects-installation/site-reports/new" element={<SiteReportForm />} />
          <Route path="modules/projects-installation/site-reports/:id" element={<SiteReportForm />} />
          
          <Route path="modules/projects-installation/milestones" element={<MilestoneManagement />} />
          <Route path="modules/projects-installation/milestones/new" element={<MilestoneForm />} />
          <Route path="modules/projects-installation/milestones/:id" element={<MilestoneForm />} />
          
          <Route path="modules/projects-installation/documents" element={<DocumentManagement />} />
          <Route path="modules/projects-installation/documents/new" element={<DocumentForm />} />
          <Route path="modules/projects-installation/documents/:id" element={<DocumentForm />} />
          
          <Route path="modules/projects-installation/team" element={<ResourceManagement />} />
          <Route path="modules/projects-installation/team/new" element={<ResourceForm />} />
          <Route path="modules/projects-installation/team/:id" element={<ResourceForm />} />
          
          <Route path="modules/projects-installation/more" element={<ProjectFinancials />} />

          {/* Inventory & Logistics */}
          <Route path="modules/inventory-logistics/dashboard" element={<InventoryDashboard />} />
          <Route path="modules/inventory-logistics/items" element={<Navigate to="/modules/products/items" replace />} />
          <Route path="modules/inventory-logistics/warehouses" element={<WarehouseManagement />} />
          <Route path="modules/inventory-logistics/warehouses/new" element={<WarehouseForm />} />
          <Route path="modules/inventory-logistics/warehouses/:id" element={<WarehouseForm />} />
          <Route path="modules/inventory-logistics/stock-ledger" element={<StockLedgerManagement />} />
          <Route path="modules/inventory-logistics/stock-ledger/new" element={<StockLedgerForm />} />
          <Route path="modules/inventory-logistics/stock-ledger/:id" element={<StockLedgerForm />} />
          <Route path="modules/inventory-logistics/material-receipt" element={<MaterialReceiptManagement />} />
          <Route path="modules/inventory-logistics/material-receipt/new" element={<MaterialReceiptForm />} />
          <Route path="modules/inventory-logistics/material-receipt/:id" element={<MaterialReceiptForm />} />
          <Route path="modules/inventory-logistics/material-issue" element={<MaterialIssueManagement />} />
          <Route path="modules/inventory-logistics/material-issue/new" element={<MaterialIssueForm />} />
          <Route path="modules/inventory-logistics/material-issue/:id" element={<MaterialIssueForm />} />
          <Route path="modules/inventory-logistics/stock-transfer" element={<StockTransferManagement />} />
          <Route path="modules/inventory-logistics/stock-transfer/new" element={<StockTransferForm />} />
          <Route path="modules/inventory-logistics/stock-transfer/:id" element={<StockTransferForm />} />
          <Route path="modules/inventory-logistics/stock-reconciliation" element={<StockReconciliationManagement />} />
          <Route path="modules/inventory-logistics/stock-reconciliation/new" element={<StockReconciliationForm />} />
          <Route path="modules/inventory-logistics/stock-reconciliation/:id" element={<StockReconciliationForm />} />
          <Route path="modules/inventory-logistics/delivery" element={<DeliveryManagement />} />
          <Route path="modules/inventory-logistics/delivery/new" element={<DeliveryForm />} />
          <Route path="modules/inventory-logistics/delivery/:id" element={<DeliveryForm />} />
          <Route path="modules/inventory-logistics/returns" element={<ReturnsManagement />} />
          <Route path="modules/inventory-logistics/returns/new" element={<ReturnsForm />} />
          <Route path="modules/inventory-logistics/returns/:id" element={<ReturnsForm />} />
          <Route path="modules/inventory-logistics/reports" element={<InventoryReports />} />
          <Route path="modules/inventory-logistics/settings" element={<InventorySettings />} />

          {/* Service & AMC */}
          <Route path="modules/service-amc/dashboard" element={<ServiceDashboard />} />
          <Route path="modules/service-amc/service-request" element={<ServiceRequestManagement />} />
          <Route path="modules/service-amc/service-request/new" element={<ServiceRequestForm />} />
          <Route path="modules/service-amc/service-request/:id" element={<ServiceRequestForm />} />
          <Route path="modules/service-amc/service-call" element={<ServiceCallManagement />} />
          <Route path="modules/service-amc/service-call/new" element={<ServiceCallForm />} />
          <Route path="modules/service-amc/service-call/:id" element={<ServiceCallForm />} />
          <Route path="modules/service-amc/technician-assignment" element={<TechnicianAssignmentManagement />} />
          <Route path="modules/service-amc/technician-assignment/new" element={<TechnicianAssignmentForm />} />
          <Route path="modules/service-amc/technician-assignment/:id" element={<TechnicianAssignmentForm />} />
          <Route path="modules/service-amc/preventive-maintenance" element={<PreventiveMaintenanceManagement />} />
          <Route path="modules/service-amc/preventive-maintenance/new" element={<PreventiveMaintenanceForm />} />
          <Route path="modules/service-amc/preventive-maintenance/:id" element={<PreventiveMaintenanceForm />} />
          <Route path="modules/service-amc/amc" element={<AMCManagement />} />
          <Route path="modules/service-amc/amc/new" element={<AMCForm />} />
          <Route path="modules/service-amc/amc/:id" element={<AMCForm />} />
          <Route path="modules/service-amc/breakdown" element={<BreakdownManagement />} />
          <Route path="modules/service-amc/breakdown/new" element={<BreakdownForm />} />
          <Route path="modules/service-amc/breakdown/:id" element={<BreakdownForm />} />
          <Route path="modules/service-amc/service-closure" element={<ServiceClosureManagement />} />
          <Route path="modules/service-amc/service-closure/new" element={<ServiceClosureForm />} />
          <Route path="modules/service-amc/service-closure/:id" element={<ServiceClosureForm />} />

          {/* Assets & Installed Base */}
          <Route path="modules/assets-installed-base/dashboard" element={<AssetDashboard />} />
          <Route path="modules/assets-installed-base/asset-registry" element={<AssetRegistryManagement />} />
          <Route path="modules/assets-installed-base/asset-registry/new" element={<AssetRegistryForm />} />
          <Route path="modules/assets-installed-base/asset-registry/:id" element={<AssetRegistryForm />} />
          <Route path="modules/assets-installed-base/warranty-amc" element={<WarrantyAMCManagement />} />
          <Route path="modules/assets-installed-base/warranty-amc/new" element={<WarrantyAMCForm />} />
          <Route path="modules/assets-installed-base/warranty-amc/:id" element={<WarrantyAMCForm />} />
          <Route path="modules/assets-installed-base/service-history" element={<ServiceHistoryManagement />} />
          <Route path="modules/assets-installed-base/service-history/new" element={<ServiceHistoryForm />} />
          <Route path="modules/assets-installed-base/service-history/:id" element={<ServiceHistoryForm />} />
          <Route path="modules/assets-installed-base/asset-locations" element={<AssetLocationsManagement />} />
          <Route path="modules/assets-installed-base/asset-locations/new" element={<AssetLocationsForm />} />
          <Route path="modules/assets-installed-base/asset-locations/:id" element={<AssetLocationsForm />} />
          <Route path="modules/assets-installed-base/reports" element={<AssetsReports />} />

          {/* MIS & Management */}
          <Route path="modules/mis-management/dashboard" element={<MISDashboard />} />
          <Route path="modules/mis-management/reports" element={<ReportsManagement />} />
          <Route path="modules/mis-management/reports/new" element={<ReportsForm />} />
          <Route path="modules/mis-management/reports/:id" element={<ReportsForm />} />
          <Route path="modules/mis-management/analytics" element={<Analytics />} />
          <Route path="modules/mis-management/budget-planning" element={<BudgetPlanningManagement />} />
          <Route path="modules/mis-management/budget-planning/new" element={<BudgetPlanningForm />} />
          <Route path="modules/mis-management/budget-planning/:id" element={<BudgetPlanningForm />} />
          <Route path="modules/mis-management/kpis-scorecards" element={<KPIsScorecardsManagement />} />
          <Route path="modules/mis-management/kpis-scorecards/new" element={<KPIsScorecardsForm />} />
          <Route path="modules/mis-management/kpis-scorecards/:id" element={<KPIsScorecardsForm />} />
          <Route path="modules/mis-management/management-review" element={<ManagementReviewManagement />} />
          <Route path="modules/mis-management/management-review/new" element={<ManagementReviewForm />} />
          <Route path="modules/mis-management/management-review/:id" element={<ManagementReviewForm />} />
          <Route path="modules/mis-management/data-export" element={<DataExport />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes></Suspense>
    </Router>
  );
}

export default App;
