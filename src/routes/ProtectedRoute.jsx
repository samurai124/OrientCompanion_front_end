import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";

function isTokenExpired(token) {
  if (!token) return true;
  if (token === "demo-admin-token" || token === "demo-counselor-token") return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp ? decoded.exp < Date.now() / 1000 : false;
  } catch {
    return true;
  }
}

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, token, isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  const expired = useMemo(() => isTokenExpired(token), [token]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (token === "demo-admin-token" || token === "demo-counselor-token") {
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
  }

  if (expired) {
    if (logout) logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}