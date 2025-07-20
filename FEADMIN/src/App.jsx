import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage'; 
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ManageCategories from './pages/ManageCategories';
import PublicRoute from './components/Auth/PublicRoute';
import ManageSuppliers from './pages/ManageSuppliers';
import ManageCustomers from './pages/ManageCustomers';
import ManageProducts from './pages/ManageProducts';
import ProductEditPage from './pages/ProductEditPage';
import ManageOrdersPage from './pages/ManageOrdersPage';
import ImportInvoiceManagement from './pages/ImportInvoiceManagement';
import CreateImportInvoice from './pages/CreateImportInvoice';
import ManageProductComments from './pages/ManageProductComments';
import TODOAPP from './pages/TODOAPP';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="manage/categories" element={<ManageCategories />} />
        <Route path="manage/suppliers" element={<ManageSuppliers />} />
        <Route path="manage/customers" element={<ManageCustomers />} />
        <Route path="manage/products" element={<ManageProducts />} />
        <Route path="/admin/products/:productId/edit" element={<ProductEditPage />} /> 
        <Route path="manage/orders" element={<ManageOrdersPage />} />
        <Route path="manage/imports" element={<ImportInvoiceManagement />} />
        <Route path="imports/new" element={<CreateImportInvoice />} />
        <Route path="/admin/products/comments" element={<ManageProductComments />} />
        <Route path="/todoapp" element={<TODOAPP />} />

      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;



