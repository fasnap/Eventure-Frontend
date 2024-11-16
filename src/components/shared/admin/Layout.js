import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function Layout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <AdminHeader className="w-full fixed top-0 left-0 right-0 bg-gray-800 text-white z-10" />

      {/* Sidebar and Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar className="w-64 bg-gray-800 text-white p-4" />

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto bg-gray-100">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
