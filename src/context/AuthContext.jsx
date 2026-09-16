import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthApi } from "../api/AuthApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await AuthApi.login(credentials);
      const jwtToken = response.token;
      const decoded = jwtDecode(jwtToken);

      /**
       * Résolution du rôle — ordre de priorité :
       * 1. decoded.role        → claim JWT (ajouté par le backend fixé)
       * 2. response.user?.role → corps de la réponse HTTP (fallback fiable)
       * 3. decoded.authorities → format Spring Security alternatif
       *
       * La valeur est la valeur brute de l'enum Java : "STUDENT" | "COUNSELOR" | "ADMIN"
       */
      const resolvedRole =
        decoded.role ||
        response.user?.role ||
        (decoded.authorities?.[0]?.authority ?? "").replace("ROLE_", "") ||
        null;

      const userData = {
        id:       response.user?.id    || decoded.id || null,
        email:    decoded.sub,
        fullName: response.user?.fullName || null,
        role:     resolvedRole,
      };

      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // ⚠️ On retourne userData (pas juste true) pour que Login.jsx puisse
      // lire le rôle IMMÉDIATEMENT sans attendre la mise à jour du state React.
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants incorrects.");
      return null;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, error, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}