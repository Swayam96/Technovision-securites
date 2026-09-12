import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';

import Dashboard from './pages/core/Dashboard';
import ModuleOverview from './pages/core/ModuleOverview';
import NotFound from './pages/core/NotFound';

// Organization & Admin
import CompanyList from './pages/organization-admin/CompanyList';
import CompanyForm from './pages/organization-admin/CompanyForm';
import DepartmentList from './pages/organization-admin/DepartmentList';
import DepartmentForm from './pages/organization-admin/DepartmentForm';
import DesignationList from './pages/organization-admin/DesignationList';
import DesignationForm from './pages/organization-admin/DesignationForm';
import RoleList from './pages/organization-admin/RoleList';
import RoleForm from './pages/organization-admin/RoleForm';
import UserList from './pages/organization-admin/UserList';
import Permissions from './pages/organization-admin/Permissions';
import EmployeeMasterList from './pages/organization-admin/EmployeeMasterList';
import EmployeeMasterForm from './pages/organization-admin/EmployeeMasterForm';
import EmployeeProfileList from './pages/organization-admin/EmployeeProfileList';
import EmployeeProfileForm from './pages/organization-admin/EmployeeProfileForm';
import BranchList from './pages/organization-admin/BranchList';
import BranchForm from './pages/organization-admin/BranchForm';

// HRMS
import AttendanceList from './pages/hrms/AttendanceList';
import LeaveList from './pages/hrms/LeaveList';
import LeaveForm from './pages/hrms/LeaveForm';
import ShiftList from './pages/hrms/ShiftList';
import PayrollList from './pages/hrms/PayrollList';
import ExpenseList from './pages/hrms/ExpenseList';
import ExpenseForm from './pages/hrms/ExpenseForm';

// Sales & Presales
import SalesDashboard from './pages/sales-presales/SalesDashboard';
import LeadManagement from './pages/sales-presales/LeadManagement';
import LeadForm from './pages/sales-presales/LeadForm';
import ContactManagement from './pages/sales-presales/ContactManagement';
import ContactForm from './pages/sales-presales/ContactForm';
import CustomerManagement from './pages/sales-presales/CustomerManagement';
import CustomerForm from './pages/sales-presales/CustomerForm';
import OpportunityManagement from './pages/sales-presales/OpportunityManagement';
import OpportunityForm from './pages/sales-presales/OpportunityForm';
import QuotationManagement from './pages/sales-presales/QuotationManagement';
import QuotationForm from './pages/sales-presales/QuotationForm';
import BOQManagement from './pages/sales-presales/BOQManagement';
import BOQForm from './pages/sales-presales/BOQForm';
import SalesOrderManagement from './pages/sales-presales/SalesOrderManagement';
import SalesOrderForm from './pages/sales-presales/SalesOrderForm';

// Products & Master Data
import ProductsDashboard from './pages/products-master-data/ProductsDashboard';
import ItemManagement from './pages/products-master-data/ItemManagement';
import ItemForm from './pages/products-master-data/ItemForm';
import ItemGroupManagement from './pages/products-master-data/ItemGroupManagement';
import ItemGroupForm from './pages/products-master-data/ItemGroupForm';
import BrandManagement from './pages/products-master-data/BrandManagement';
import BrandForm from './pages/products-master-data/BrandForm';
import UOMManagement from './pages/products-master-data/UOMManagement';
import UOMForm from './pages/products-master-data/UOMForm';
import AttributeManagement from './pages/products-master-data/AttributeManagement';
import AttributeForm from './pages/products-master-data/AttributeForm';
import TaxMaster from './pages/products-master-data/TaxMaster';
import TaxForm from './pages/products-master-data/TaxForm';
import SupplierManagement from './pages/products-master-data/SupplierManagement';
import SupplierForm from './pages/products-master-data/SupplierForm';
import PriceListManagement from './pages/products-master-data/PriceListManagement';
import PriceListForm from './pages/products-master-data/PriceListForm';
import ProductImport from './pages/products-master-data/ProductImport';
import ProductSettings from './pages/products-master-data/ProductSettings';

// Purchase & Procurement
import PurchaseDashboard from './pages/purchase-procurement/PurchaseDashboard';
import RFQManagement from './pages/purchase-procurement/RFQManagement';
import RFQForm from './pages/purchase-procurement/RFQForm';
import QuotationComparison from './pages/purchase-procurement/QuotationComparison';
import PurchaseOrderManagement from './pages/purchase-procurement/PurchaseOrderManagement';
import PurchaseOrderForm from './pages/purchase-procurement/PurchaseOrderForm';
import GRNManagement from './pages/purchase-procurement/GRNManagement';
import GRNForm from './pages/purchase-procurement/GRNForm';
import PurchaseInvoiceManagement from './pages/purchase-procurement/PurchaseInvoiceManagement';
import PurchaseInvoiceForm from './pages/purchase-procurement/PurchaseInvoiceForm';
import SupplierPaymentManagement from './pages/purchase-procurement/SupplierPaymentManagement';
import SupplierPaymentForm from './pages/purchase-procurement/SupplierPaymentForm';
import PurchaseReturnManagement from './pages/purchase-procurement/PurchaseReturnManagement';
import PurchaseReturnForm from './pages/purchase-procurement/PurchaseReturnForm';
import SupplierPerformance from './pages/purchase-procurement/SupplierPerformance';
import ProcurementReports from './pages/purchase-procurement/ProcurementReports';
import PurchaseSettings from './pages/purchase-procurement/PurchaseSettings';

// Projects & Installation
import ProjectDashboard from './pages/projects-installation/ProjectDashboard';
import ProjectManagement from './pages/projects-installation/ProjectManagement';
import ProjectForm from './pages/projects-installation/ProjectForm';
import ProjectDetails from './pages/projects-installation/ProjectDetails';
import ProjectBOQManagement from './pages/projects-installation/BOQManagement';
import ProjectBOQForm from './pages/projects-installation/BOQForm';
import TaskManagement from './pages/projects-installation/TaskManagement';
import TaskForm from './pages/projects-installation/TaskForm';
import SiteReportManagement from './pages/projects-installation/SiteReportManagement';
import SiteReportForm from './pages/projects-installation/SiteReportForm';
import MilestoneManagement from './pages/projects-installation/MilestoneManagement';
import MilestoneForm from './pages/projects-installation/MilestoneForm';
import DocumentManagement from './pages/projects-installation/DocumentManagement';
import DocumentForm from './pages/projects-installation/DocumentForm';
import ResourceManagement from './pages/projects-installation/ResourceManagement';
import ResourceForm from './pages/projects-installation/ResourceForm';
import ProjectFinancials from './pages/projects-installation/ProjectFinancials';
import ProjectSettings from './pages/projects-installation/ProjectSettings';

// Inventory & Logistics
import InventoryDashboard from './pages/inventory-logistics/InventoryDashboard';
import WarehouseManagement from './pages/inventory-logistics/WarehouseManagement';
import WarehouseForm from './pages/inventory-logistics/WarehouseForm';
import StockLedgerManagement from './pages/inventory-logistics/StockLedgerManagement';
import StockLedgerForm from './pages/inventory-logistics/StockLedgerForm';
import MaterialReceiptManagement from './pages/inventory-logistics/MaterialReceiptManagement';
import MaterialReceiptForm from './pages/inventory-logistics/MaterialReceiptForm';
import MaterialIssueManagement from './pages/inventory-logistics/MaterialIssueManagement';
import MaterialIssueForm from './pages/inventory-logistics/MaterialIssueForm';
import StockTransferManagement from './pages/inventory-logistics/StockTransferManagement';
import StockTransferForm from './pages/inventory-logistics/StockTransferForm';
import StockReconciliationManagement from './pages/inventory-logistics/StockReconciliationManagement';
import StockReconciliationForm from './pages/inventory-logistics/StockReconciliationForm';
import DeliveryManagement from './pages/inventory-logistics/DeliveryManagement';
import DeliveryForm from './pages/inventory-logistics/DeliveryForm';
import ReturnsManagement from './pages/inventory-logistics/ReturnsManagement';
import ReturnsForm from './pages/inventory-logistics/ReturnsForm';
import InventoryReports from './pages/inventory-logistics/InventoryReports';
import InventorySettings from './pages/inventory-logistics/InventorySettings';

// Service & AMC
import ServiceDashboard from './pages/service-amc/ServiceDashboard';
import ServiceRequestManagement from './pages/service-amc/ServiceRequestManagement';
import ServiceRequestForm from './pages/service-amc/ServiceRequestForm';
import ServiceCallManagement from './pages/service-amc/ServiceCallManagement';
import ServiceCallForm from './pages/service-amc/ServiceCallForm';
import TechnicianAssignmentManagement from './pages/service-amc/TechnicianAssignmentManagement';
import TechnicianAssignmentForm from './pages/service-amc/TechnicianAssignmentForm';
import PreventiveMaintenanceManagement from './pages/service-amc/PreventiveMaintenanceManagement';
import PreventiveMaintenanceForm from './pages/service-amc/PreventiveMaintenanceForm';
import AMCManagement from './pages/service-amc/AMCManagement';
import AMCForm from './pages/service-amc/AMCForm';
import BreakdownManagement from './pages/service-amc/BreakdownManagement';
import BreakdownForm from './pages/service-amc/BreakdownForm';
import ServiceClosureManagement from './pages/service-amc/ServiceClosureManagement';
import ServiceClosureForm from './pages/service-amc/ServiceClosureForm';

// Assets & Installed Base
import AssetDashboard from './pages/assets-installed-base/AssetDashboard';
import AssetRegistryManagement from './pages/assets-installed-base/AssetRegistryManagement';
import AssetRegistryForm from './pages/assets-installed-base/AssetRegistryForm';
import WarrantyAMCManagement from './pages/assets-installed-base/WarrantyAMCManagement';
import WarrantyAMCForm from './pages/assets-installed-base/WarrantyAMCForm';
import ServiceHistoryManagement from './pages/assets-installed-base/ServiceHistoryManagement';
import ServiceHistoryForm from './pages/assets-installed-base/ServiceHistoryForm';
import AssetLocationsManagement from './pages/assets-installed-base/AssetLocationsManagement';
import AssetLocationsForm from './pages/assets-installed-base/AssetLocationsForm';
import AssetsReports from './pages/assets-installed-base/AssetsReports';

// MIS & Management
import MISDashboard from './pages/mis-management/MISDashboard';
import ReportsManagement from './pages/mis-management/ReportsManagement';
import ReportsForm from './pages/mis-management/ReportsForm';
import BudgetPlanningManagement from './pages/mis-management/BudgetPlanningManagement';
import BudgetPlanningForm from './pages/mis-management/BudgetPlanningForm';
import KPIsScorecardsManagement from './pages/mis-management/KPIsScorecardsManagement';
import KPIsScorecardsForm from './pages/mis-management/KPIsScorecardsForm';
import ManagementReviewManagement from './pages/mis-management/ManagementReviewManagement';
import ManagementReviewForm from './pages/mis-management/ManagementReviewForm';
import Analytics from './pages/mis-management/Analytics';
import DataExport from './pages/mis-management/DataExport';

import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
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
      </Routes>
    </Router>
  );
}

export default App;
