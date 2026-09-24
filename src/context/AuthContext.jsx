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

  const userData = {
    id: response.user?.id,
    email: response.user?.email || decoded.sub,
    fullName: response.user?.fullName,
    role: response.user?.role || decoded.role,
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