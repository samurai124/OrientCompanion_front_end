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

      return userData;
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants incorrects.");
      return null;
    }
  };

  const loginAsDemoAdmin = () => {
    const demoUser = {
      id: "admin-demo-1",
      email: "admin@orientcompanion.ma",
      fullName: "Administrateur Orient",
      role: "ADMIN",
    };
    const demoToken = "demo-admin-token";
    setToken(demoToken);
    setUser(demoUser);
    localStorage.setItem("token", demoToken);
    localStorage.setItem("user", JSON.stringify(demoUser));
    return demoUser;
  };

  const loginAsDemoCounselor = () => {
    const demoUser = {
      id: "csl-demo-1",
      email: "a.senhaji@counselor.orientcompanion.ma",
      fullName: "Dr. Amina Senhaji",
      role: "COUNSELOR",
    };
    const demoToken = "demo-counselor-token";
    setToken(demoToken);
    setUser(demoUser);
    localStorage.setItem("token", demoToken);
    localStorage.setItem("user", JSON.stringify(demoUser));
    return demoUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, error, login, logout, loginAsDemoAdmin, loginAsDemoCounselor, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}