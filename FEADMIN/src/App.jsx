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

      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;