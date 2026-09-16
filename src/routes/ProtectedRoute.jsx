import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";

/**
 * ProtectedRoute — Garde d'authentification et d'autorisation basée sur les rôles.
 *
 * @param {string[]} allowedRoles - Liste des rôles autorisés (ex: ["ROLE_STUDENT"]).
 *                                  Si vide, tout utilisateur authentifié est autorisé.
 *
 * Flux de décision :
 *  1. Pas de JWT                     → redirect /login (URL cible sauvegardée dans state.from)
 *  2. JWT expiré                     → logout + redirect /login
 *  3. JWT valide mais rôle refusé    → redirect /unauthorized
 *  4. OK                             → <Outlet />
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, token, isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  // 1. Aucun token en mémoire → non connecté
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Vérification de l'expiration du JWT
  //    Même si le token est présent dans localStorage, il peut être expiré.
  try {
    const decoded = jwtDecode(token);
    const nowInSeconds = Date.now() / 1000;
    if (decoded.exp && decoded.exp < nowInSeconds) {
      // Token expiré → on nettoie la session et on redirige
      logout();
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } catch {
    // JWT malformé → on nettoie et on redirige
    logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. JWT valide mais rôle non autorisé → unauthorized
  if (
    allowedRoles.length > 0 &&
    (!user?.role || !allowedRoles.includes(user.role))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Accès accordé
  return <Outlet />;
}