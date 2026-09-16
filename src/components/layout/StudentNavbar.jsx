import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./StudentNavbar.css";

const Icons = {
  Brand: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" opacity="0.6" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" opacity="0.6" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Sun: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

export default function StudentNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("orient_theme") || "light"
  );

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("orient_theme", next);
    document.documentElement.setAttribute("data-theme", next);
    window.dispatchEvent(new CustomEvent("orient_theme_change", { detail: next }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { name: "Tableau de bord", link: "/dashboard" },
    { name: "Entretien IA", link: "/assessment" },
    { name: "Recommandations", link: "/recommendations" },
    { name: "Écoles", link: "/StudentRecommendedSchools" },
    { name: "Mentorat", link: "/mentorship" },
  ];

  const studentInitial = (user?.fullName || user?.email || "E")
    .charAt(0)
    .toUpperCase();

  return (
    <header className="student-navbar">
      <div className="student-navbar-inner">
        <NavLink to="/dashboard" className="student-navbar-brand">
          <div className="student-navbar-brand-mark">
            <Icons.Brand />
          </div>
          <span>OrientCompanion</span>
        </NavLink>

        <nav className="student-navbar-menu" aria-label="Navigation principale">
          {navItems.map((item) => (
            <NavLink
              key={item.link}
              to={item.link}
              className={({ isActive }) =>
                `student-navbar-link${isActive ? " active" : ""}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="student-navbar-actions">
          <button
            className="student-navbar-theme-btn"
            onClick={toggleTheme}
            title={theme === "light" ? "Mode sombre" : "Mode clair"}
            aria-label="Changer le thème"
          >
            {theme === "light" ? <Icons.Moon /> : <Icons.Sun />}
          </button>

          <div className="student-navbar-user-pill">
            <div className="student-navbar-avatar">{studentInitial}</div>
            <span>{user?.fullName || user?.email || "Étudiant"}</span>
          </div>

          <button
            className="student-navbar-logout-btn"
            onClick={handleLogout}
            title="Se déconnecter"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
