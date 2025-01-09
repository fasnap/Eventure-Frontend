import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ alllowedType }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    const defaultLoginRedirect = {
      admin: "/admin/login",
      creator: "/creator/login",
      attendee: "/attendee/login",
    };

    return <Navigate to={defaultLoginRedirect[user?.user_type] || "/"} />;
  }

  if (!alllowedType.includes(user?.user_type)) {
    const defaultRedirects = {
      admin: "/admin/dashboard",
      creator: "/creator/profile",
      attendee: "/attendee/profile",
    };
    return <Navigate to={defaultRedirects[user?.user_type] || "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
