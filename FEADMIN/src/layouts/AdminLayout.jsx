import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from './Sidebar';

function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar className="fixed left-0 top-0 h-screen z-20 bg-white w-64 shadow-lg" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
