
export default function AuthSideHero({
  badgeText = "Orientation Intelligente",
  quoteTitle = "Façonnez votre parcours d'excellence académique.",
  quoteDesc = "Analysez votre profil psychométrique RIASEC, découvrez vos filières idéales et préparez votre avenir avec nos conseillers experts.",
}) {
  return (
    <div className="auth-hero-column" aria-hidden="true">

      <div className="auth-hero-ambient-glow" />

      <div className="auth-hero-pattern">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="authHeroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.12)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#authHeroGrid)" />
        </svg>
      </div>

      <div className="auth-hero-content">

        <div className="auth-hero-tag">
          <span className="auth-hero-tag-dot" />
          <span>{badgeText}</span>
        </div>

        <div className="auth-animated-scene">

          <div className="auth-orbit-center">
            <svg
              className="auth-orbit-svg"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#71717a" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#a1a1aa" />
                </linearGradient>
              </defs>

              <circle
                className="orbit-ring-outer"
                cx="200"
                cy="200"
                r="170"
                stroke="url(#orbitGrad1)"
                strokeWidth="1.2"
                strokeDasharray="6 8"
              />

              <circle
                className="orbit-ring-mid"
                cx="200"
                cy="200"
                r="125"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1"
                strokeDasharray="12 16"
              />

              <circle
                className="orbit-ring-inner"
                cx="200"
                cy="200"
                r="80"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1.5"
              />

              <g className="orbit-satellites">
                <circle cx="200" cy="30" r="4" fill="#ffffff" />
                <circle cx="370" cy="200" r="3" fill="#a1a1aa" />
                <circle cx="75" cy="200" r="3.5" fill="#e4e4e7" />
                <circle cx="200" cy="325" r="4" fill="#ffffff" />
              </g>

              <g className="orbit-core">
                <rect
                  x="182"
                  y="182"
                  width="36"
                  height="36"
                  rx="9"
                  fill="url(#coreGrad)"
                  transform="rotate(45 200 200)"
                />
                <circle cx="200" cy="200" r="6" fill="#09090b" />
              </g>
            </svg>
          </div>

          <div className="auth-floating-card auth-card-float-1">
            <div className="auth-float-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div className="auth-float-meta">
              <span className="auth-float-title">Adéquation Filière</span>
              <span className="auth-float-val">96% Match</span>
              <span className="auth-float-sub">ENSAM · UM6P · ENCG</span>
            </div>
          </div>

          <div className="auth-floating-card auth-card-float-2">
            <div className="auth-float-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="auth-float-meta">
              <span className="auth-float-title">Profil RIASEC</span>
              <span className="auth-float-val">Dominante : IRS</span>
              <span className="auth-float-sub">Investigateur • Réaliste</span>
            </div>
          </div>

          <div className="auth-floating-card auth-card-float-3">
            <div className="auth-float-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="auth-float-meta">
              <span className="auth-float-title">Mentorat d'Experts</span>
              <span className="auth-float-val">Séance Visio 1-to-1</span>
              <span className="auth-float-sub">Accompagnement humain</span>
            </div>
          </div>
        </div>

        
        <div className="auth-hero-footer">
          <h3 className="auth-hero-title">{quoteTitle}</h3>
          <p className="auth-hero-desc">{quoteDesc}</p>

          <div className="auth-hero-features">
            <span className="auth-hero-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Bilan RIASEC IA en 10 min</span>
            </span>
            <span className="auth-hero-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>150+ Grandes Écoles au Maroc</span>
            </span>
            <span className="auth-hero-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Conseillers certifiés</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
