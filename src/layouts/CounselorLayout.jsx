import { useState, useEffect, useContext } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CounselorIcons from "../components/counselor/CounselorIcons";
import BrandLogo from "../components/common/BrandLogo";
import "../components/counselor/Counselor.css";

export default function CounselorLayout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
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
    if (logout) logout();
    navigate("/login", { replace: true });
  };

  const getBreadcrumbTitle = () => {
    const p = location.pathname;
    if (p.includes("/counselor/sessions")) return "Mes Séances d'Orientation";
    if (p.includes("/counselor/students")) return "Mes Étudiants Suivis";
    if (p.includes("/counselor/reviews")) return "Validation des Bilans RIASEC";
    if (p.includes("/counselor/resources")) return "Référentiel Concours & Seuils";
    if (p.includes("/counselor/availability")) return "Disponibilités & Profil";
    return "Tableau de bord Conseiller";
  };

  const navItems = [
    { to: "/counselor/dashboard", label: "Tableau de bord", icon: CounselorIcons.Dashboard },
    { to: "/counselor/sessions", label: "Mes Séances", icon: CounselorIcons.Calendar },
    { to: "/counselor/students", label: "Mes Étudiants", icon: CounselorIcons.Users },
    { to: "/counselor/reviews", label: "Revues RIASEC", icon: CounselorIcons.CheckSquare },
    { to: "/counselor/resources", label: "Guide & Seuils", icon: CounselorIcons.BookOpen },
    { to: "/counselor/availability", label: "Disponibilités", icon: CounselorIcons.Clock },
  ];

  const counselorName = user?.fullName || "Conseiller";
  const counselorInitials = counselorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="csl-layout-wrapper">
      {sidebarOpen && (
        <div
          className="csl-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`csl-sidebar${sidebarOpen ? " open" : ""}`}>
        <NavLink to="/counselor/dashboard" className="csl-sidebar-brand" onClick={() => setSidebarOpen(false)}>
          <div className="csl-brand-symbol">
            <BrandLogo size={18} />
          </div>
          <div className="csl-brand-text">
            <span className="csl-brand-name">OrientCompanion</span>
            <span className="csl-brand-subtitle">Espace Conseiller</span>
          </div>
        </NavLink>

        <nav className="csl-sidebar-nav" aria-label="Navigation Conseiller">
          <div className="csl-nav-section-title">Accompagnement & Suivi</div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `csl-nav-item${isActive ? " active" : ""}`
                }
              >
                <Icon width="15" height="15" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="csl-sidebar-footer">
          <NavLink
            to="/dashboard"
            className="csl-btn csl-btn-secondary csl-btn-sm"
            style={{ width: "100%", boxSizing: "border-box", justifyContent: "center" }}
            title="Consulter l'espace étudiant"
            onClick={() => setSidebarOpen(false)}
          >
            <CounselorIcons.ExternalLink width="12" height="12" />
            <span>Vue Étudiant</span>
          </NavLink>

          <div className="csl-sidebar-footer-profile">
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "5px",
                backgroundColor: "var(--csl-btn-primary-bg)",
                color: "var(--csl-btn-primary-text)",
                fontSize: "0.72rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {counselorInitials}
            </div>
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <strong style={{ fontSize: "0.78rem", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {counselorName}
              </strong>
              <div className="csl-status-pill">
                <span className="csl-status-dot-green" />
                <span>Disponible pour rdv</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="csl-main-wrapper">
        <header className="csl-topbar">
          <div className="csl-topbar-left">
            <button
              className="csl-sidebar-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Menu"
            >
              <CounselorIcons.Menu width="16" height="16" />
            </button>

            <div className="csl-breadcrumb">
              <span>Conseiller</span>
              <span>/</span>
              <strong>{getBreadcrumbTitle()}</strong>
            </div>
          </div>

          <div className="csl-topbar-right">
            <button
              className="csl-topbar-icon-btn"
              onClick={toggleTheme}
              title={theme === "light" ? "Mode Sombre" : "Mode Clair"}
              aria-label="Changer de thème"
            >
              {theme === "light" ? <CounselorIcons.Moon /> : <CounselorIcons.Sun />}
            </button>

            <div style={{ position: "relative" }}>
              <button
                className="csl-topbar-icon-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                title="Notifications"
                aria-label="Notifications"
              >
                <CounselorIcons.Bell />
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#f59e0b",
                  }}
                />
              </button>

              {notifOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "44px",
                    right: 0,
                    width: "300px",
                    backgroundColor: "var(--csl-bg-card)",
                    border: "1px solid var(--csl-border-hairline)",
                    borderRadius: "8px",
                    boxShadow: "var(--csl-shadow-md)",
                    zIndex: 100,
                    padding: "0.85rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.82rem" }}>Alertes de suivi</strong>
                    <span className="csl-tag">Activité</span>
                  </div>
                  <div style={{ fontSize: "0.76rem", lineHeight: 1.4, color: "var(--csl-text-secondary)" }}>
                    • Rendez-vous d'orientation planifiés avec les étudiants.
                  </div>
                </div>
              )}
            </div>

            <button
              className="csl-logout-btn"
              onClick={handleLogout}
              title="Se déconnecter"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
