import { useState, useEffect, useContext } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AdminIcons from "../components/admin/AdminIcons";
import BrandLogo from "../components/common/BrandLogo";
import "./AdminLayout.css";

export default function AdminLayout() {
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
    if (p.includes("/admin/users")) return "Utilisateurs & Profils";
    if (p.includes("/admin/fields")) return "Filières d'Études";
    if (p.includes("/admin/schools")) return "Établissements & Universités";
    if (p.includes("/admin/assessments")) return "Bilans RIASEC & IA";
    if (p.includes("/admin/mentorship")) return "Séances & Mentorat";
    if (p.includes("/admin/settings")) return "Paramètres Système";
    return "Vue d'ensemble";
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Vue d'ensemble", icon: AdminIcons.Dashboard },
    { to: "/admin/users", label: "Utilisateurs", icon: AdminIcons.Users },
    { to: "/admin/fields", label: "Filières", icon: AdminIcons.Fields },
    { to: "/admin/schools", label: "Établissements", icon: AdminIcons.Schools },
    { to: "/admin/assessments", label: "Bilans RIASEC", icon: AdminIcons.Assessments },
    { to: "/admin/mentorship", label: "Mentorats", icon: AdminIcons.Mentorship },
    { to: "/admin/settings", label: "Paramètres", icon: AdminIcons.Settings },
  ];

  const adminName = user?.fullName || user?.email || "Administrateur";
  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <div className="adm-layout-wrapper">
      {sidebarOpen && (
        <div
          className="adm-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`adm-sidebar${sidebarOpen ? " open" : ""}`}>
        <NavLink to="/admin/dashboard" className="adm-sidebar-brand" onClick={() => setSidebarOpen(false)}>
          <div className="adm-brand-symbol">
            <BrandLogo size={18} />
          </div>
          <div className="adm-brand-text">
            <span className="adm-brand-name">OrientCompanion</span>
            <span className="adm-brand-subtitle">Console Admin</span>
          </div>
        </NavLink>

        <nav className="adm-sidebar-nav" aria-label="Navigation Administrateur">
          <div className="adm-nav-section-title">Gestion & Données</div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `adm-nav-item${isActive ? " active" : ""}`
                }
              >
                <Icon width="15" height="15" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="adm-sidebar-footer">
          <NavLink
            to="/dashboard"
            className="adm-student-switch-btn"
            title="Consulter l'espace étudiant"
            onClick={() => setSidebarOpen(false)}
          >
            <AdminIcons.ExternalLink width="12" height="12" />
            <span>Basculer vue Étudiant</span>
          </NavLink>

          <div className="adm-system-status-pill">
            <span className="adm-status-dot-green" />
            <span>Système Opérationnel</span>
          </div>
        </div>
      </aside>

      <div className="adm-main-wrapper">
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button
              className="adm-sidebar-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Ouvrir le menu"
            >
              <AdminIcons.Menu width="16" height="16" />
            </button>

            <div className="adm-breadcrumb">
              <span>Admin</span>
              <span>/</span>
              <strong>{getBreadcrumbTitle()}</strong>
            </div>
          </div>

          <div className="adm-topbar-right">
            <button
              className="adm-topbar-icon-btn"
              onClick={toggleTheme}
              title={theme === "light" ? "Activer Mode Sombre" : "Activer Mode Clair"}
              aria-label="Changer le thème"
            >
              {theme === "light" ? <AdminIcons.Moon /> : <AdminIcons.Sun />}
            </button>

            <div style={{ position: "relative" }}>
              <button
                className="adm-topbar-icon-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                title="Notifications"
                aria-label="Notifications"
              >
                <AdminIcons.Bell />
                <span className="adm-notif-badge" />
              </button>

              {notifOpen && (
                <div className="adm-notif-popover">
                  <div className="adm-notif-header">
                    <span>Notifications récentes</span>
                    <span className="adm-tag">—</span>
                  </div>
                  <div className="adm-notif-list">
                    <div className="adm-notif-item unread">
                      <span className="adm-notif-item-title">Connexions au système</span>
                      <span style={{ color: "var(--adm-text-secondary)" }}>Activité de la plateforme</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="adm-user-profile-pill">
              <div className="adm-user-avatar-sm">{adminInitial}</div>
              <span style={{ fontWeight: 600 }}>{adminName}</span>
            </div>

            <button
              className="adm-logout-btn"
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
