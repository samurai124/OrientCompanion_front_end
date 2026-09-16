import { useContext, useEffect, useState } from "react";
import { MentorshipContext } from "../../context/MentorshipContext";
import "../Management.css";

export default function MentorshipManagement({ onNavigate }) {
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
  const [filterField, setFilterField] = useState("");

  useEffect(() => {
    if (activeTab === "STUDENT") {
      fetchAvailableCounselors(filterField || null);
      fetchMySessionsAsStudent();
    } else {
      fetchMySessionsAsCounselor();
    }
  }, [activeTab, filterField, fetchAvailableCounselors, fetchMySessionsAsStudent, fetchMySessionsAsCounselor]);

  const handleRequestSession = async (counselorId) => {
    const success = await requestSession(counselorId);
    if (success) {
      alert("Demande de séance de mentorat envoyée avec succès !");
    }
  };

  const handleUpdateStatus = async (sessionId, status) => {
    await updateSession(sessionId, { status });
  };

  return (
    <div className="mgmt-page-container" data-theme={theme}>
      {/* Background Circuit Pattern */}
      <div className="mgmt-circuit-layer" aria-hidden="true">
        <svg className="mgmt-circuit-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuitGridMentor" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 40 80 L 120 80 L 120 160 L 200 160 L 200 240" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <path d="M 0 120 L 80 120 L 80 200 L 160 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <circle cx="40" cy="80" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="120" cy="160" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="80" cy="200" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitGridMentor)" />
        </svg>
      </div>

      <div className="mgmt-content-wrapper">
        {/* Header */}
        <div className="mgmt-header">
          <div className="mgmt-title-area">
            <h2>Mentorat Visio & Accompagnement</h2>
            <p>Planifiez des rendez-vous avec des conseillers ou gérez vos séances attribuées.</p>
          </div>
          <div className="mgmt-tab-switcher">
            <button
              className={`mgmt-tab-btn ${activeTab === "STUDENT" ? "active" : ""}`}
              onClick={() => setActiveTab("STUDENT")}
            >
              🎓 Espace Étudiant
            </button>
            <button
              className={`mgmt-tab-btn ${activeTab === "COUNSELOR" ? "active" : ""}`}
              onClick={() => setActiveTab("COUNSELOR")}
            >
              👨‍🏫 Espace Conseiller
            </button>
          </div>
        </div>

        {error && <div className="recs-error-banner">{error}</div>}

        {/* VUE ÉTUDIANT */}
        {activeTab === "STUDENT" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* Section Conseillers */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>Mentors & Conseillers Disponibles</h3>
                <input
                  type="text"
                  placeholder="Filtrer par filière..."
                  value={filterField}
                  onChange={(e) => setFilterField(e.target.value)}
                  className="mgmt-search-input"
                  style={{ maxWidth: "260px" }}
                />
              </div>

              {loading ? (
                <div className="recs-loading-card">
                  <div className="recs-spinner" />
                  <p className="recs-loading-text">Recherche des mentors disponibles...</p>
                </div>
              ) : counselors.length === 0 ? (
                <div className="recs-empty-card" style={{ padding: "3rem" }}>
                  <p style={{ margin: 0, color: "var(--text-muted)" }}>Aucun conseiller disponible pour le moment.</p>
                </div>
              ) : (
                <div className="mgmt-mentor-grid">
                  {counselors.map((counselor) => (
                    <div key={counselor.id} className="mgmt-mentor-card">
                      <div className="mgmt-mentor-top">
                        <div className="mgmt-mentor-avatar">
                          {counselor.name ? counselor.name.charAt(0).toUpperCase() : "M"}
                        </div>
                        <div>
                          <h4 className="mgmt-mentor-name">{counselor.name || `Conseiller #${counselor.id}`}</h4>
                          <span className="mgmt-mentor-specialty">{counselor.specialty || counselor.email}</span>
                        </div>
                      </div>

                      {counselor.matchScore && (
                        <div>
                          <span className="mgmt-table-tag" style={{ color: "var(--accent-positive)" }}>
                            🎯 {counselor.matchScore}% Compatibilité
                          </span>
                        </div>
                      )}

                      <button
                        className="mgmt-btn-primary"
                        onClick={() => handleRequestSession(counselor.id)}
                        disabled={loading}
                        style={{ width: "100%", justifyContent: "center" }}
                      >
                        Demander un RDV Visio
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section Séances Demandées */}
            <div>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1.2rem", fontWeight: 700 }}>Mes Séances Demandées</h3>
              <div className="mgmt-card-table">
                <div className="mgmt-table-responsive">
                  <table className="mgmt-table">
                    <thead>
                      <tr>
                        <th>ID Séance</th>
                        <th>Conseiller</th>
                        <th>Statut</th>
                        <th>Date de demande</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentSessions.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                            Aucune séance demandée pour l'instant.
                          </td>
                        </tr>
                      ) : (
                        studentSessions.map((session) => (
                          <tr key={session.id}>
                            <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>#{session.id}</td>
                            <td>
                              <strong>{session.counselorName || `Conseiller #${session.counselorId}`}</strong>
                            </td>
                            <td>
                              <span className="mgmt-table-tag">
                                {session.status || "EN ATTENTE"}
                              </span>
                            </td>
                            <td>
                              {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : "Récente"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VUE CONSEILLER */}
        {activeTab === "COUNSELOR" && (
          <div>
            <h3 style={{ margin: "0 0 1rem", fontSize: "1.2rem", fontWeight: 700 }}>Séances Attribuées</h3>
            {loading ? (
              <div className="recs-loading-card">
                <div className="recs-spinner" />
                <p className="recs-loading-text">Chargement de vos séances...</p>
              </div>
            ) : (
              <div className="mgmt-card-table">
                <div className="mgmt-table-responsive">
                  <table className="mgmt-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Étudiant</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {counselorSessions.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                            Aucune séance ne vous a été assignée.
                          </td>
                        </tr>
                      ) : (
                        counselorSessions.map((session) => (
                          <tr key={session.id}>
                            <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>#{session.id}</td>
                            <td>
                              <strong>{session.studentName || `Étudiant #${session.studentId}`}</strong>
                            </td>
                            <td>
                              <span className="mgmt-table-tag">
                                {session.status}
                              </span>
                            </td>
                            <td>
                              {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : "Récente"}
                            </td>
                            <td>
                              <div className="mgmt-table-actions">
                                {session.status === "PENDING" && (
                                  <>
                                    <button
                                      className="mgmt-action-btn"
                                      onClick={() => handleUpdateStatus(session.id, "CONFIRMED")}
                                    >
                                      Accepter
                                    </button>
                                    <button
                                      className="mgmt-action-btn mgmt-action-btn--delete"
                                      onClick={() => handleUpdateStatus(session.id, "REJECTED")}
                                    >
                                      Refuser
                                    </button>
                                  </>
                                )}
                                {session.status === "CONFIRMED" && (
                                  <button
                                    className="mgmt-action-btn"
                                    onClick={() => handleUpdateStatus(session.id, "COMPLETED")}
                                  >
                                    Terminer
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}