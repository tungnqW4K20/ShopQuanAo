import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage'; 
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ManageCategories from './pages/ManageCategories';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;