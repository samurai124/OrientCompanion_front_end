import { useContext, useEffect, useState, useMemo } from "react";
import { MentorshipContext } from "../../context/MentorshipContext";
import "./MentorshipManagement.css";

// High-resolution photography of academic advisors and professional mentors
const MENTOR_PRESETS = {
  // 1. Engineering / Tech Advisor
  engineering: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  // 2. Tech / Computer Science Mentor
  tech: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  // 3. Business / Finance / Management Mentor
  business: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  // 4. Medical / Health Sciences Mentor
  medicine: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
  // 5. Architecture & Design Mentor
  architecture: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
  // 6. Law & Humanities Counselor
  law: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  // 7. Academic Guidance Counselor (General)
  academic: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
  // 8. Senior Director Advisor
  senior: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
  // Generic fallback
  generic: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
};

/**
 * Maps a counselor/mentor to a high-resolution professional advisor portrait.
 */
function getMentorImage(counselor) {
  if (counselor?.imageUrl) return counselor.imageUrl;
  if (counselor?.avatarUrl) return counselor.avatarUrl;
  if (counselor?.photo) return counselor.photo;

  const text = `${counselor?.name || ""} ${counselor?.specialty || ""} ${counselor?.email || ""}`.toLowerCase();

  if (text.includes("info") || text.includes("data") || text.includes("ia") || text.includes("logiciel") || text.includes("cyber") || text.includes("tech")) {
    return MENTOR_PRESETS.tech;
  }
  if (text.includes("ingén") || text.includes("mécan") || text.includes("civil") || text.includes("industr") || text.includes("électr")) {
    return MENTOR_PRESETS.engineering;
  }
  if (text.includes("commerce") || text.includes("manage") || text.includes("gestion") || text.includes("finance") || text.includes("audit") || text.includes("marketing")) {
    return MENTOR_PRESETS.business;
  }
  if (text.includes("médec") || text.includes("santé") || text.includes("pharma") || text.includes("dentaire")) {
    return MENTOR_PRESETS.medicine;
  }
  if (text.includes("archi") || text.includes("urban") || text.includes("design")) {
    return MENTOR_PRESETS.architecture;
  }
  if (text.includes("droit") || text.includes("jurid") || text.includes("justice")) {
    return MENTOR_PRESETS.law;
  }
  if (text.includes("senior") || text.includes("direct") || text.includes("prof")) {
    return MENTOR_PRESETS.senior;
  }

  const pool = [
    MENTOR_PRESETS.academic,
    MENTOR_PRESETS.business,
    MENTOR_PRESETS.engineering,
    MENTOR_PRESETS.tech,
    MENTOR_PRESETS.medicine,
    MENTOR_PRESETS.senior,
  ];
  const hash = Math.abs((Number(counselor?.id) || 1) % pool.length);
  return pool[hash] || MENTOR_PRESETS.academic;
}

export default function MentorshipManagement() {
  const {
    counselors,
    studentSessions,
    counselorSessions,
    loading,
    error,
    fetchAvailableCounselors,
    requestSession,
    fetchMySessionsAsStudent,
    fetchMySessionsAsCounselor,
    updateSession,
  } = useContext(MentorshipContext);

  const [theme] = useState(() => {
    return localStorage.getItem("orient_theme") || "light";
  });

  const [activeTab, setActiveTab] = useState("STUDENT");
  const [searchTerm, setSearchTerm] = useState("");
  const [requestingId, setRequestingId] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState("");

  useEffect(() => {
    if (activeTab === "STUDENT") {
      fetchAvailableCounselors(null);
      fetchMySessionsAsStudent();
    } else {
      fetchMySessionsAsCounselor();
    }
  }, [activeTab, fetchAvailableCounselors, fetchMySessionsAsStudent, fetchMySessionsAsCounselor]);

  const handleRequestSession = async (counselorId, counselorName) => {
    setRequestingId(counselorId);
    setRequestSuccess("");
    const success = await requestSession(counselorId);
    if (success) {
      setRequestSuccess(`Demande de séance envoyée à ${counselorName || "votre conseiller"} avec succès.`);
      setTimeout(() => setRequestSuccess(""), 5000);
    }
    setRequestingId(null);
  };

  const handleUpdateStatus = async (sessionId, status) => {
    await updateSession(sessionId, { status });
  };

  const filteredCounselors = useMemo(() => {
    return (counselors || []).filter((c) => {
      const name = (c.name || "").toLowerCase();
      const spec = (c.specialty || "").toLowerCase();
      const email = (c.email || "").toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      return !query || name.includes(query) || spec.includes(query) || email.includes(query);
    });
  }, [counselors, searchTerm]);

  return (
    <div className="mentor-container" data-theme={theme}>
      <div className="mentor-wrapper">
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <header className="mentor-header">
          <div className="mentor-title-group">
            <h1 className="mentor-title">Mentorat & Accompagnement Visio</h1>
            <p className="mentor-subtitle">
              Planifiez des séances individuelles avec des conseillers certifiés et anciens étudiants des grandes écoles.
            </p>
          </div>

          <div className="mentor-tab-pills">
            <button
              className={`mentor-tab-pill ${activeTab === "STUDENT" ? "active" : ""}`}
              onClick={() => setActiveTab("STUDENT")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span>Espace Étudiant</span>
            </button>
            <button
              className={`mentor-tab-pill ${activeTab === "COUNSELOR" ? "active" : ""}`}
              onClick={() => setActiveTab("COUNSELOR")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
              <span>Espace Conseiller</span>
            </button>
          </div>
        </header>

        {/* ── NOTIFICATIONS ───────────────────────────────────────────────── */}
        {error && (
          <div className="schools-error-banner" role="alert" style={{ marginTop: "1.5rem" }}>
            <span>{error}</span>
          </div>
        )}

        {requestSuccess && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "6px",
              border: "1px solid var(--border-hairline)",
              backgroundColor: "var(--bg-subtle)",
              color: "var(--text-primary)",
              fontSize: "0.8rem",
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{requestSuccess}</span>
          </div>
        )}

        {/* =================================================================
            VUE ÉTUDIANT
            ================================================================= */}
        {activeTab === "STUDENT" && (
          <div>
            {/* Section Header & Toolbar */}
            <div className="mentor-section-header">
              <h2 className="mentor-section-title">Mentors & Conseillers Disponibles</h2>
              <span className="schools-counter-pill">
                <span className="schools-counter-dot" />
                <span>{filteredCounselors.length} mentor{filteredCounselors.length !== 1 ? "s" : ""}</span>
              </span>
            </div>

            <div className="mentor-toolbar">
              <div className="mentor-search-box">
                <svg
                  className="mentor-search-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher par nom, spécialité ou filière..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mentor-search-input"
                />
              </div>
            </div>

            {/* Skeletons on loading */}
            {loading ? (
              <div className="mentor-cards-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="mentor-skeleton-card">
                    <div className="mentor-skeleton-media" />
                    <div className="mentor-skeleton-body">
                      <div className="mentor-skeleton-line" style={{ width: "60%" }} />
                      <div className="mentor-skeleton-line" style={{ width: "40%" }} />
                      <div className="mentor-skeleton-line" style={{ width: "90%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCounselors.length === 0 ? (
              <div className="mentor-empty-state">
                <div className="mentor-empty-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="mentor-empty-title">Aucun mentor disponible actuellement</h3>
                <p className="mentor-empty-desc">
                  Revenez un peu plus tard ou modifiez vos termes de recherche.
                </p>
              </div>
            ) : (
              /* ── MENTORS CARDS GRID ─────────────────────────────────────── */
              <div className="mentor-cards-grid">
                {filteredCounselors.map((counselor) => {
                  const mentorPhoto = getMentorImage(counselor);
                  const counselorName = counselor.name || `Conseiller #${counselor.id}`;
                  const specialty = counselor.specialty || "Orientation Académique & Carrières";
                  const matchScore = counselor.matchScore || null;

                  return (
                    <article key={counselor.id} className="mentor-card">
                      {/* Top Advisor Photo with Overlays */}
                      <div className="mentor-card-media">
                        <img
                          src={mentorPhoto}
                          alt={`Mentor ${counselorName}`}
                          className="mentor-card-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = MENTOR_PRESETS.generic;
                          }}
                        />
                        <div className="mentor-media-overlay" />

                        <div className="mentor-media-top-badges">
                          <span className="mentor-specialty-badge">
                            {specialty}
                          </span>

                          <span className="mentor-status-badge">
                            <span className="mentor-status-dot" />
                            <span>{matchScore ? `${matchScore}% Match` : "Disponible Visio"}</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="mentor-card-body">
                        <div className="mentor-card-header">
                          <h3 className="mentor-card-title">{counselorName}</h3>
                          <div className="mentor-card-role">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span>Conseiller Référent OrientCompanion</span>
                          </div>
                        </div>

                        <p className="mentor-card-desc">
                          {counselor.bio ||
                            counselor.description ||
                            "Accompagnement personnalisé pour l'analyse de votre profil RIASEC, la préparation aux entretiens et le choix stratégique de votre parcours."}
                        </p>

                        <div className="mentor-features-row">
                          <span className="mentor-feature-pill">🎯 Bilan personnalisé</span>
                          <span className="mentor-feature-pill">⏱ 45 min Visio</span>
                          <span className="mentor-feature-pill">💬 1-to-1</span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <footer className="mentor-card-footer">
                        <div className="mentor-footer-meta">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>Réponse sous 24h</span>
                        </div>

                        <button
                          type="button"
                          className="mentor-action-btn"
                          onClick={() => handleRequestSession(counselor.id, counselorName)}
                          disabled={loading || requestingId === counselor.id}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                          </svg>
                          <span>
                            {requestingId === counselor.id ? "Envoi..." : "Demander RDV"}
                          </span>
                        </button>
                      </footer>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ── SECTION: MES SÉANCES DEMANDÉES ──────────────────────────── */}
            <div style={{ marginTop: "3.5rem" }}>
              <div className="mentor-section-header">
                <h2 className="mentor-section-title">Mes Séances de Mentorat</h2>
                <span className="schools-counter-pill">
                  <span>{studentSessions.length} séance{studentSessions.length !== 1 ? "s" : ""}</span>
                </span>
              </div>

              {studentSessions.length === 0 ? (
                <div className="mentor-empty-state" style={{ padding: "3rem 1.5rem" }}>
                  <p className="mentor-empty-desc">
                    Vous n'avez pas encore demandé de séance de mentorat. Choisissez un conseiller ci-dessus pour planifier votre premier entretien visio.
                  </p>
                </div>
              ) : (
                <div className="mentor-sessions-grid">
                  {studentSessions.map((session) => {
                    const status = session.status || "PENDING";
                    const statusText =
                      status === "CONFIRMED" || status === "ACCEPTED"
                        ? "Confirmée"
                        : status === "REJECTED"
                        ? "Refusée"
                        : status === "COMPLETED"
                        ? "Terminée"
                        : "En attente";

                    return (
                      <div key={session.id} className="mentor-session-card">
                        <div className="mentor-session-header">
                          <span className="mentor-session-id">Séance #{session.id}</span>
                          <span className="mentor-session-status">{statusText}</span>
                        </div>

                        <h3 className="mentor-session-name">
                          {session.counselorName || `Conseiller #${session.counselorId}`}
                        </h3>

                        <div className="mentor-session-footer">
                          <span>
                            {session.createdAt
                              ? new Date(session.createdAt).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Date récente"}
                          </span>
                          <span>Entretien Visio</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================
            VUE CONSEILLER
            ================================================================= */}
        {activeTab === "COUNSELOR" && (
          <div style={{ marginTop: "2rem" }}>
            <div className="mentor-section-header">
              <h2 className="mentor-section-title">Séances Attribuées</h2>
              <span className="schools-counter-pill">
                <span>{counselorSessions.length} demande{counselorSessions.length !== 1 ? "s" : ""}</span>
              </span>
            </div>

            {loading ? (
              <div className="mentor-cards-grid">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="mentor-skeleton-card" style={{ height: "180px" }}>
                    <div className="mentor-skeleton-body">
                      <div className="mentor-skeleton-line" style={{ width: "50%" }} />
                      <div className="mentor-skeleton-line" style={{ width: "80%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : counselorSessions.length === 0 ? (
              <div className="mentor-empty-state">
                <h3 className="mentor-empty-title">Aucune séance attribuée</h3>
                <p className="mentor-empty-desc">
                  Les demandes d'accompagnement des étudiants apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="mentor-sessions-grid">
                {counselorSessions.map((session) => (
                  <div key={session.id} className="mentor-session-card">
                    <div className="mentor-session-header">
                      <span className="mentor-session-id">Dossier #{session.id}</span>
                      <span className="mentor-session-status">{session.status}</span>
                    </div>

                    <h3 className="mentor-session-name">
                      {session.studentName || `Étudiant #${session.studentId}`}
                    </h3>

                    <div className="mentor-session-footer">
                      <span>
                        {session.createdAt
                          ? new Date(session.createdAt).toLocaleDateString("fr-FR")
                          : "Récente"}
                      </span>

                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        {session.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(session.id, "CONFIRMED")}
                              className="recs-btn recs-btn-primary"
                              style={{ height: "28px", padding: "0 0.6rem", fontSize: "0.72rem" }}
                            >
                              Accepter
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(session.id, "REJECTED")}
                              className="recs-btn recs-btn-outline"
                              style={{ height: "28px", padding: "0 0.6rem", fontSize: "0.72rem" }}
                            >
                              Refuser
                            </button>
                          </>
                        )}
                        {session.status === "CONFIRMED" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(session.id, "COMPLETED")}
                            className="recs-btn recs-btn-primary"
                            style={{ height: "28px", padding: "0 0.6rem", fontSize: "0.72rem" }}
                          >
                            Terminer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}