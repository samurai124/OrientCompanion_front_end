import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./OrientLandingPage.css";

export default function OrientLandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  // Si l'utilisateur est déjà connecté, le rediriger directement vers son tableau de bord
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Theme state: light or dark (default to light matching the reference webp image)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("orient_theme") || "light";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("orient_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  /**
   * Routes protégées (nécessitent d'être connecté) :
   * Si le visiteur n'est pas authentifié, on le redirige vers /login
   * avec la destination finale dans state.from — il y sera renvoyé
   * automatiquement après connexion (cf. LoginPage).
   */
  const PROTECTED_PATHS = new Set([
    "/assessment", "/recommendations", "/mentorship",
    "/dashboard", "/admin/fields", "/admin/schools", "/counselor/sessions",
  ]);

  const handleNav = (target) => {
    const routeMap = {
      dashboard: "/dashboard",
      chat: "/assessment",
      test: "/assessment",
      recommendations: "/recommendations",
      recs: "/recommendations",
      landing: "/",
      home: "/",
      schools: "/admin/schools",
      school: "/admin/schools",
      fields: "/admin/fields",
      field: "/admin/fields",
      mentor: "/mentorship",
      mentorship: "/mentorship",
      login: "/login",
      register: "/register",
    };
    const path = routeMap[target] ?? "/";

    if (PROTECTED_PATHS.has(path) && !isAuthenticated) {
      // Visiteur non connecté → login, puis retour automatique
      navigate("/login", { state: { from: { pathname: path } } });
      return;
    }
    navigate(path);
  };


  // Active dashboard tab inside the hero preview
  const [activeDashTab, setActiveDashTab] = useState("overview");

  // Selected school in dashboard
  const [selectedSchool, setSelectedSchool] = useState("ensam");

  const schoolDetails = {
    ensam: {
      name: "ENSAM Casablanca",
      sub: "Génie Informatique & Systèmes",
      threshold: "Seuil 2025 : 15.80 / 20",
      match: "96.8% Affinité",
      stats: [
        { label: "Maths", value: "17.5", height: "85%" },
        { label: "Physique", value: "16.0", height: "75%" },
        { label: "Info", value: "18.5", height: "92%" },
        { label: "Français", value: "15.0", height: "68%" },
        { label: "Anglais", value: "17.0", height: "80%" }
      ]
    },
    um6p: {
      name: "UM6P Benguerir",
      sub: "School of Computer Science",
      threshold: "Sélection dossier & concours",
      match: "94.2% Affinité",
      stats: [
        { label: "Maths", value: "18.0", height: "90%" },
        { label: "Physique", value: "15.5", height: "72%" },
        { label: "Info", value: "19.0", height: "96%" },
        { label: "Français", value: "16.5", height: "78%" },
        { label: "Anglais", value: "18.0", height: "88%" }
      ]
    },
    encg: {
      name: "ENCG Settat",
      sub: "Gestion, Finance & Audit",
      threshold: "Concours TAFEM : Seuil 14.50",
      match: "91.5% Affinité",
      stats: [
        { label: "Maths", value: "15.5", height: "72%" },
        { label: "Éco", value: "17.5", height: "86%" },
        { label: "Français", value: "16.0", height: "75%" },
        { label: "Anglais", value: "17.0", height: "82%" },
        { label: "Philo", value: "14.5", height: "65%" }
      ]
    }
  };

  return (
    <div className="crystal-wrapper" data-theme={theme}>
      {/* Main Glass Canvas Card container (like the rounded device/card in reference) */}
      <div className="crystal-canvas">
        {/* Subtle embossed circuit / pathway background lines & glyph tokens */}
        <div className="crystal-circuit-layer" aria-hidden="true">
          <svg className="crystal-circuit-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuitGrid" width="240" height="240" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 40 80 L 120 80 L 120 160 L 200 160 L 200 240" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
                <path d="M 0 120 L 80 120 L 80 200 L 160 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
                <circle cx="40" cy="80" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
                <circle cx="120" cy="160" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
                <circle cx="80" cy="200" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
                <rect x="196" y="156" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.18" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuitGrid)" />
          </svg>

          {/* Floating embossed glyph tokens (similar to crypto tokens in reference) */}
          <div className="crystal-floating-badge badge-pos-1">
            <span className="badge-icon">🎓</span>
          </div>
          <div className="crystal-floating-badge badge-pos-2">
            <span className="badge-icon">⚡</span>
          </div>
          <div className="crystal-floating-badge badge-pos-3">
            <span className="badge-icon">✦</span>
          </div>
          <div className="crystal-floating-badge badge-pos-4">
            <span className="badge-icon">🏛️</span>
          </div>
          <div className="crystal-floating-badge badge-pos-5">
            <span className="badge-icon">📊</span>
          </div>
          <div className="crystal-floating-badge badge-pos-6">
            <span className="badge-icon">🧭</span>
          </div>
        </div>

        {/* =====================================================================
            1. TOP NAVBAR (Crypto Crystal style: Brand, Center Links, Dark Pill CTA)
            ===================================================================== */}
        <header className="crystal-nav">
          <div className="crystal-brand" onClick={() => handleNav("landing")}>
            <div className="crystal-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
                <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
                <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
                <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
                <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <span className="crystal-brand-title">Orient Companion</span>
          </div>

          <nav className="crystal-nav-menu">
            <a href="#bilan" className="crystal-nav-link">Bilan RIASEC</a>
            <a href="#matching" className="crystal-nav-link">Écoles & Seuils</a>
            <button className="crystal-nav-link-btn" onClick={() => handleNav("dashboard")}>
              Tableau de bord ↗
            </button>
          </nav>

          <div className="crystal-nav-actions">
            {/* Theme Toggle Button */}
            <button
              className="crystal-theme-toggle"
              onClick={toggleTheme}
              title={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Dark Pill CTA Button (Get Wallet in reference -> Lancer l'IA) */}
            <button
              className="crystal-btn-pill-dark"
              onClick={() => handleNav("chat")}
            >
              Lancer l'IA
            </button>
          </div>
        </header>

        {/* =====================================================================
            2. HERO CENTERPIECE (Trio pill, Title, Subtitle, Double Pill Buttons)
            ===================================================================== */}
        <section className="crystal-hero">
          {/* Centered Top Trio Badge (like the 3 currency icons in reference) */}
          <div className="crystal-trio-pill">
            <div className="trio-dot">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="trio-dot">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" stroke="var(--crystal-canvas-bg)" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="trio-dot">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="crystal-hero-headline">
            Révélez Votre Vocation,<br />
            Conquérez les Meilleures Écoles
          </h1>

          {/* Subtitle */}
          <p className="crystal-hero-caption">
            Lycéens et étudiants : maximisez vos chances d'admission grâce au bilan RIASEC
            guidé par l'IA et l'analyse prédictive des seuils de concours au Maroc.
          </p>

          {/* Double Pill Buttons (Crypto Crystal Program + Open Dashboard) */}
          <div className="crystal-hero-buttons">
            <button
              className="crystal-btn-solid"
              onClick={() => handleNav("chat")}
            >
              Bilan RIASEC Gratuit
            </button>
            <button
              className="crystal-btn-outline"
              onClick={() => handleNav("recommendations")}
            >
              Consulter les Écoles
            </button>
          </div>
        </section>

        {/* =====================================================================
            3. EMBEDDED DASHBOARD (Exact layout and aesthetic of the image mockup!)
            ===================================================================== */}
        <div className="crystal-mockup-wrapper" id="bilan">
          <div className="crystal-dashboard-card">
            {/* Dashboard Topbar */}
            <div className="dash-topbar">
              <div className="dash-topbar-left">
                <div className="dash-brand-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                  <span>Orient Companion</span>
                </div>
              </div>

              <div className="dash-topbar-center">
                <div className="dash-user-badge">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Hamza"
                    className="dash-user-avatar"
                  />
                  <div className="dash-user-meta">
                    <span className="dash-user-name">Bonjour, Hamza</span>
                    <span className="dash-user-date">Lundi, 14 Septembre 2026</span>
                  </div>
                </div>
              </div>

              <div className="dash-topbar-right">
                <div className="dash-search-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Rechercher une école...</span>
                  <kbd className="dash-kbd">⌘K</kbd>
                </div>

                <div className="dash-icon-group">
                  <button className="dash-icon-btn" onClick={toggleTheme} title="Changer le thème">
                    {theme === "light" ? "☀️" : "🌙"}
                  </button>
                  <button className="dash-icon-btn" title="Historique">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </button>
                  <button className="dash-icon-btn" title="Notifications">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Content: Sidebar + Cards */}
            <div className="dash-main-layout">
              {/* Internal Sidebar */}
              <aside className="dash-sidebar">
                <span className="dash-sidebar-heading">Navigation</span>

                <div className="dash-nav-list">
                  <button
                    className={`dash-menu-item ${activeDashTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveDashTab("overview")}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="9" />
                      <rect x="14" y="3" width="7" height="5" />
                      <rect x="14" y="12" width="7" height="9" />
                      <rect x="3" y="16" width="7" height="5" />
                    </svg>
                    <span>Synthèse RIASEC</span>
                  </button>

                  <button
                    className={`dash-menu-item ${activeDashTab === "schools" ? "active" : ""}`}
                    onClick={() => setActiveDashTab("schools")}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    <span>Écoles Éligibles</span>
                  </button>

                  <button
                    className={`dash-menu-item ${activeDashTab === "thresholds" ? "active" : ""}`}
                    onClick={() => setActiveDashTab("thresholds")}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    <span>Simulateur Seuils</span>
                  </button>

                  <button
                    className="dash-menu-item"
                    onClick={() => handleNav("chat")}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>Conseiller IA</span>
                  </button>
                </div>

                <div className="dash-sidebar-divider" />

                <span className="dash-sidebar-heading">Écoles phares</span>
                <div className="dash-schools-selector">
                  <button
                    className={`dash-sub-item ${selectedSchool === "ensam" ? "active" : ""}`}
                    onClick={() => setSelectedSchool("ensam")}
                  >
                    ENSAM Casablanca
                  </button>
                  <button
                    className={`dash-sub-item ${selectedSchool === "um6p" ? "active" : ""}`}
                    onClick={() => setSelectedSchool("um6p")}
                  >
                    UM6P Benguerir
                  </button>
                  <button
                    className={`dash-sub-item ${selectedSchool === "encg" ? "active" : ""}`}
                    onClick={() => setSelectedSchool("encg")}
                  >
                    ENCG Settat
                  </button>
                </div>
              </aside>

              {/* Main Panels Area */}
              <main className="dash-panels-grid">
                {/* Panel 1: RIASEC Psychometric Dimensions Bar Chart (Like BTC Card) */}
                <div className="dash-card dash-card--btc">
                  <div className="dash-card-header">
                    <div className="dash-coin-badge">
                      <div className="coin-icon">🎯</div>
                      <div className="coin-meta">
                        <span className="coin-value">Profil Holland : IRS</span>
                        <span className="coin-sub">Dominante Investigateur</span>
                      </div>
                    </div>
                    <button className="dash-dots-btn" onClick={() => handleNav("chat")} title="Détails">
                      •••
                    </button>
                  </div>

                  <div className="dash-chart-bars">
                    <div className="chart-bar-col">
                      <div className="chart-bar-fill" style={{ height: "88%" }} />
                      <span className="chart-bar-label">I</span>
                      <span className="chart-bar-val">88%</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="chart-bar-fill" style={{ height: "76%" }} />
                      <span className="chart-bar-label">R</span>
                      <span className="chart-bar-val">76%</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="chart-bar-fill" style={{ height: "64%" }} />
                      <span className="chart-bar-label">S</span>
                      <span className="chart-bar-val">64%</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="chart-bar-fill" style={{ height: "52%" }} />
                      <span className="chart-bar-label">E</span>
                      <span className="chart-bar-val">52%</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="chart-bar-fill" style={{ height: "45%" }} />
                      <span className="chart-bar-label">A</span>
                      <span className="chart-bar-val">45%</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="chart-bar-fill" style={{ height: "70%" }} />
                      <span className="chart-bar-label">C</span>
                      <span className="chart-bar-val">70%</span>
                    </div>
                  </div>
                </div>

                {/* Panel 2: School Compatibility & Threshold Performance (Like Binance Card) */}
                <div className="dash-card dash-card--binance">
                  <div className="dash-card-header">
                    <div className="dash-school-meta">
                      <div className="dash-school-logo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="dash-school-title">{schoolDetails[selectedSchool].name}</h4>
                        <span className="dash-school-sub">
                          {schoolDetails[selectedSchool].sub} •{" "}
                          <strong className="text-positive">{schoolDetails[selectedSchool].match}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="dash-school-balance">
                      <span className="dash-balance-code">{schoolDetails[selectedSchool].threshold}</span>
                      <span className="dash-balance-val">Statut Favorable</span>
                    </div>
                  </div>

                  {/* Academic Subjects bar chart preview */}
                  <div className="dash-stats-bars">
                    {schoolDetails[selectedSchool].stats.map((s, idx) => (
                      <div key={idx} className="dash-stat-col">
                        <span className="dash-stat-bubble">{s.value}</span>
                        <div className="dash-stat-track">
                          <div className="dash-stat-fill" style={{ height: s.height }} />
                        </div>
                        <span className="dash-stat-name">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* =====================================================================
            4. THREE CORE PILLARS (Clean, subtle, matching the glass aesthetic)
            ===================================================================== */}
        <section className="crystal-pillars-section" id="matching">
          <div className="crystal-pillars-grid">
            <div className="crystal-pillar-card">
              <div className="pillar-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="pillar-title">Bilan IA Personnalisé</h3>
              <p className="pillar-desc">
                Un échange conversationnel fluide de 5 minutes avec notre conseiller IA
                pour cerner vos forces académiques et vos centres d'intérêt profonds.
              </p>
            </div>

            <div className="crystal-pillar-card">
              <div className="pillar-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3 className="pillar-title">Historique des Seuils</h3>
              <p className="pillar-desc">
                Accédez aux seuils d'admissibilité officiels (2020-2025) pour plus de 120
                écoles publiques et privées au Maroc (CPGE, ENSAM, ENCG, FMP, UM6P).
              </p>
            </div>

            <div className="crystal-pillar-card">
              <div className="pillar-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="pillar-title">Mentorat Visio 1-on-1</h3>
              <p className="pillar-desc">
                Prenez rendez-vous directement avec des étudiants aînés actuellement en cursus
                dans l'école de vos rêves pour des conseils authentiques sans filtre.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. FOOTER (Clean, minimalist, integrated into the glass canvas)
            ===================================================================== */}
        <footer className="crystal-footer">
          <div className="crystal-footer-left">
            <span className="crystal-footer-brand">Orient Companion</span>
            <span className="crystal-footer-copy">© 2026 • L'orientation académique augmentée par l'IA</span>
          </div>

          <div className="crystal-footer-right">
            <button className="crystal-footer-link" onClick={() => handleNav("chat")}>
              Lancer l'entretien
            </button>
            <button className="crystal-footer-link" onClick={() => handleNav("recommendations")}>
              Recommandations
            </button>
            <button className="crystal-footer-link" onClick={toggleTheme}>
              {theme === "light" ? "Mode Sombre 🌙" : "Mode Clair ☀️"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
