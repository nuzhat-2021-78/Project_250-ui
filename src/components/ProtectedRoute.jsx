import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");
  console.log(JSON.stringify(privileges));

  if (!token) return <Navigate to="/login" />;

  const hasPrivileges = allowedRoles.every(p => privileges.includes(p));
  console.log(hasPrivileges)
  if (!hasPrivileges) return <Navigate to="/unauthorized" />;
  console.log("returning children");
  return <Outlet/>;
};

export default ProtectedRoute;
