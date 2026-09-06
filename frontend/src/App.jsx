import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import CompanyList from './pages/CompanyList';
import DepartmentList from './pages/DepartmentList';
import DesignationList from './pages/DesignationList';
import RoleList from './pages/RoleList';
import UserList from './pages/UserList';
import Permissions from './pages/Permissions';
import EmployeeMasterList from './pages/EmployeeMasterList';
import EmployeeProfileList from './pages/EmployeeProfileList';
import AttendanceList from './pages/AttendanceList';
import LeaveList from './pages/LeaveList';
import LeaveForm from './pages/LeaveForm';
import ShiftList from './pages/ShiftList';
import PayrollList from './pages/PayrollList';
import ExpenseList from './pages/ExpenseList';
import ExpenseForm from './pages/ExpenseForm';
import ModuleOverview from './pages/ModuleOverview';
import BranchList from './pages/BranchList';
import CompanyForm from './pages/CompanyForm';
import DepartmentForm from './pages/DepartmentForm';
import DesignationForm from './pages/DesignationForm';
import RoleForm from './pages/RoleForm';
import BranchForm from './pages/BranchForm';
import EmployeeMasterForm from './pages/EmployeeMasterForm';
import EmployeeProfileForm from './pages/EmployeeProfileForm';
import NotFound from './pages/NotFound';

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
          
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
