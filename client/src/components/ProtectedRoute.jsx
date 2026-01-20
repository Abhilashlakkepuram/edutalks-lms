import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = getToken();
  const user = getUser();

  // ❌ Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;
