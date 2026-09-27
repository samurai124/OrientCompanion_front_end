import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";

function isTokenExpired(token) {
  if (!token) return true;
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

  const expired = isTokenExpired(token);

  useEffect(() => {
    if (expired && logout && token) {
      logout();
    }
  }, [expired, logout, token]);

  if (!isAuthenticated || !token || expired) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}