import React from "react";
import AdminSidebar from "../../components/shared/admin/AdminSidebar";
import AdminHeader from "../../components/shared/admin/AdminHeader";
import UsersList from "../../components/admin/UsersList";

function UsersListPage() {
  return (
    <div className="flex h-screen">
      <div className="w-56 bg-gray-700 h-full p-4">
        <AdminSidebar />
      </div>
      <div className="flex-grow flex flex-col">
        <AdminHeader />
        <div className="flex-grow overflow-auto p-4">
          <UsersList />
        </div>
      </div>
    </div>
  );
}

export default UsersListPage;
