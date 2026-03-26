import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ requiredPermission, children }) => {
  const { hasPermission, user } = useAuth();
  console.log(requiredPermission, hasPermission(requiredPermission));
  console.log(user);
  if (!user) return children;
  if (!hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
