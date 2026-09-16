import { useState, useEffect, useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import StudentNavbar from "../components/layout/StudentNavbar";
import "./AppLayout.css";

/**
 * AppLayout — Layout partagé pour les pages de l'application.
 * Les étudiants utilisent la StudentNavbar unifiée (style shadcn/ui monochrome).
 * Les conseillers et administrateurs utilisent leurs menus dédiés.
 */
export default function AppLayout() {
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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isStudent = user?.role === "STUDENT";
  const isCounselor = user?.role === "COUNSELOR";
  const isAdmin = user?.role === "ADMIN";

  // ── ESPACE ÉTUDIANT (Navbar unifiée StudentNavbar) ──────────────────────────
  if (isStudent) {
    return (
      <div className="app-subpage-wrapper">
        <StudentNavbar />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Outlet />
        </main>
      </div>
    );
  }

  // ── ESPACE CONSEILLER / ADMIN ──────────────────────────────────────────────
  return (
    <div className="app-subpage-wrapper">
      <header className="app-sub-navbar">
        <div className="app-sub-navbar-inner">
          {/* ── Brand ── */}
          <div className="app-nav-left">
            <NavLink
              to={isCounselor ? "/counselor/sessions" : "/admin/fields"}
              className="app-brand"
              aria-label="Accueil"
            >
              <div className="app-brand-symbol">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="app-brand-name">
                Orient<strong>Companion</strong>
              </span>
            </NavLink>

            {/* ── Nav Links Conseiller / Admin ── */}
            <nav className="app-nav-menu" aria-label="Navigation principale">
              {isCounselor && (
                <NavLink
                  to="/counselor/sessions"
                  className={({ isActive }) =>
                    `app-nav-btn${isActive ? " active" : ""}`
                  }
                >
                  Mes séances
                </NavLink>
              )}

              {isAdmin && (
                <>
                  <NavLink
                    to="/admin/fields"
                    className={({ isActive }) =>
                      `app-nav-btn${isActive ? " active" : ""}`
                    }
                  >
                    Filières
                  </NavLink>
                  <NavLink
                    to="/admin/schools"
                    className={({ isActive }) =>
                      `app-nav-btn${isActive ? " active" : ""}`
                    }
                  >
                    Établissements
                  </NavLink>
                  <NavLink
                    to="/counselor/sessions"
                    className={({ isActive }) =>
                      `app-nav-btn${isActive ? " active" : ""}`
                    }
                  >
                    Séances
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* ── Actions ── */}
          <div className="app-nav-right">
            <button
              className="app-theme-btn"
              onClick={toggleTheme}
              title={theme === "light" ? "Mode Sombre" : "Mode Clair"}
              aria-label="Changer le thème"
            >
              {theme === "light" ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
              )}
            </button>

            {user && (
              <span className="app-user-email" title={user.email}>
                {user.email}
              </span>
            )}

            <button className="app-cta-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Rendu de la page enfant active */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </main>
    </div>
  );
}
