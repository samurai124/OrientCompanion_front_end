import { useState, useMemo, useEffect, useContext } from "react";
import AdminIcons from "./AdminIcons";
import { AdminContext } from "../../context/AdminContext";
import "./Admin.css";

const RIASEC_FULL_NAMES = {
  R: { label: "Réaliste", color: "#3b82f6", desc: "Technique, concret, manipulation d'outils et systèmes physiques" },
  I: { label: "Investigateur", color: "#6366f1", desc: "Analytique, scientifique, curiosité et recherche intellectuelle" },
  A: { label: "Artistique", color: "#ec4899", desc: "Créatif, esthétique, imagination et conception spatiale" },
  S: { label: "Social", color: "#10b981", desc: "Empathie, enseignement, soin et travail d'équipe" },
  E: { label: "Entreprenant", color: "#f59e0b", desc: "Leadership, persuasion, négociation et sens des affaires" },
  C: { label: "Conventionnel", color: "#8b5cf6", desc: "Méthode, rigueur, organisation et structuration des données" },
};

function Loading() {
  return <div style={{ padding: "3rem", textAlign: "center", color: "var(--adm-text-muted)" }}>Chargement...</div>;
}

function ErrorBox({ message, onRetry }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p style={{ color: "var(--adm-text-muted)", marginBottom: "0.75rem" }}>⚠️ {message}</p>
      <button className="adm-btn adm-btn-secondary" onClick={onRetry}>Réessayer</button>
    </div>
  );
}

export default function AdminAssessments() {
  const { assessments = [], loading, error, fetchAssessments } = useContext(AdminContext);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const [dimensionFilter, setDimensionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && selectedAssessment) {
        setSelectedAssessment(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAssessment]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((a) => {

      const matchSearch =
        (a.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.studentEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.dominantCode || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchDimension =
        dimensionFilter === "ALL" || (a.dominantCode || "").includes(dimensionFilter);

      const matchStatus =
        statusFilter === "ALL" || a.status === statusFilter;

      return matchSearch && matchDimension && matchStatus;
    });
  }, [assessments, searchTerm, dimensionFilter, statusFilter]);

  const mostFrequentDominant = useMemo(() => {
    if (!assessments.length) return "—";
    const counts = {};
    assessments.forEach((a) => {
      const code = a.dominantCode;
      if (code) counts[code] = (counts[code] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) return "—";
    const topCode = sorted[0][0];
    return `${RIASEC_FULL_NAMES[topCode]?.label || topCode} (${topCode})`;
  }, [assessments]);

  const completedCount = useMemo(() => {
    return assessments.filter((a) => a.embeddingComputed || a.status === "VALIDATED").length;
  }, [assessments]);



  return (
    <div className="adm-view-container">
      <div className="adm-page-header">
        <div className="adm-header-title-block">
          <span className="adm-page-badge">Intelligence Artificielle & Psychométrie</span>
          <h1 className="adm-page-title">Supervision des Bilans RIASEC</h1>
          <p className="adm-page-subtitle">
            Analyse des entretiens conduits par le chatbot IA, profils Holland dominants,
            scores psychométriques et recommandations d'orientation générées.
          </p>
        </div>
      </div>

      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Bilans Enregistrés</span>
            <AdminIcons.Assessments width="14" height="14" />
          </div>
          <div className="adm-kpi-value">{assessments.length}</div>

          <div className="adm-kpi-footer">
            <span className="adm-trend-pill positive">Total enregistrés</span>
          </div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Profil Principal</span>
            <span className="adm-tag">Holland</span>
          </div>
          <div className="adm-kpi-value">{mostFrequentDominant}</div>
          <div className="adm-kpi-footer">
            <span>Tendance observée</span>
          </div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Profils Validés</span>
            <AdminIcons.Sparkles width="14" height="14" />
          </div>
          <div className="adm-kpi-value">{completedCount}</div>
          <div className="adm-kpi-footer">
            <span className="adm-trend-pill positive">Bilans complets</span>
          </div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Taux d'Embeddings</span>
            <AdminIcons.Dashboard width="14" height="14" />
          </div>
          <div className="adm-kpi-value">
            {assessments.length > 0 ? `${Math.round((completedCount / assessments.length) * 100)}%` : "100%"}
          </div>


          <div className="adm-kpi-footer">
            <span>Vecteurs IA générés</span>
          </div>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-toolbar-left">
          <div className="adm-search-box">
            <span className="adm-search-icon">
              <AdminIcons.Search />
            </span>
            <input
              type="text"
              className="adm-search-input"
              placeholder="Rechercher par nom d'étudiant, email ou code RIASEC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="adm-tab-pills">
            <button
              className={`adm-tab-pill${dimensionFilter === "ALL" ? " active" : ""}`}
              onClick={() => setDimensionFilter("ALL")}
            >
              Toutes dimensions
            </button>
            <button
              className={`adm-tab-pill${dimensionFilter === "I" ? " active" : ""}`}
              onClick={() => setDimensionFilter("I")}
              title="Investigateur"
            >
              I - Investigateur
            </button>
            <button
              className={`adm-tab-pill${dimensionFilter === "R" ? " active" : ""}`}
              onClick={() => setDimensionFilter("R")}
              title="Réaliste"
            >
              R - Réaliste
            </button>
            <button
              className={`adm-tab-pill${dimensionFilter === "A" ? " active" : ""}`}
              onClick={() => setDimensionFilter("A")}
              title="Artistique"
            >
              A - Artistique
            </button>
            <button
              className={`adm-tab-pill${dimensionFilter === "E" ? " active" : ""}`}
              onClick={() => setDimensionFilter("E")}
              title="Entreprenant"
            >
              E - Entreprenant
            </button>
            <button
              className={`adm-tab-pill${dimensionFilter === "S" ? " active" : ""}`}
              onClick={() => setDimensionFilter("S")}
              title="Social"
            >
              S - Social
            </button>
            <button
              className={`adm-tab-pill${dimensionFilter === "C" ? " active" : ""}`}
              onClick={() => setDimensionFilter("C")}
              title="Conventionnel"
            >
              C - Conventionnel
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <select
            className="adm-select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="VALIDATED">Validé IA</option>
            <option value="PENDING_REVIEW">En attente / Incomplet</option>
          </select>
        </div>
      </div>

      <div className="adm-card">
        {loading && <Loading />}
        {error && <ErrorBox message={error} onRetry={fetchAssessments} />}


        {!loading && !error && (
          <div className="adm-table-container">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Profil Holland</th>
                  <th>Aperçu des Scores RIASEC</th>
                  <th>Top Recommandation IA</th>
                  <th>Statut</th>
                  <th>Date du bilan</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "3rem", color: "var(--adm-text-muted)" }}>
                      Aucun bilan ne correspond aux critères de recherche.
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((a) => {
                    const itemKey = a.studentId || a.id;
                    const dateStr = a.assessmentDate || a.date;
                    const isValidated = a.status === "VALIDATED" || a.embeddingComputed;

                    return (
                      <tr key={itemKey}>
                        <td>
                          <div className="adm-user-cell">
                            <div className="adm-avatar">
                              {(a.studentName || "?").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="adm-user-info">
                              <span className="adm-user-name">{a.studentName}</span>
                              <span className="adm-user-email">{a.studentEmail}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {a.dominantCode ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <span className="adm-tag adm-tag-code">{a.dominantCode}</span>
                              <span style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                                {a.dominantTitle || RIASEC_FULL_NAMES[a.dominantCode]?.label || a.dominantCode}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>En attente</span>
                          )}
                        </td>

                        <td style={{ minWidth: "160px" }}>
                          {a.scores && Object.keys(a.scores).length > 0 ? (
                            <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "24px" }}>
                              {Object.entries(a.scores).map(([k, score]) => {
                                const val = Number(score) || 0;
                                return (
                                  <div
                                    key={k}
                                    style={{
                                      flex: 1,
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      gap: "2px",
                                    }}
                                    title={`${k} (${RIASEC_FULL_NAMES[k]?.label || k}) : ${val}`}
                                  >
                                    <div
                                      style={{
                                        width: "100%",
                                        height: `${Math.min(22, Math.max(3, val * 0.7))}px`,
                                        backgroundColor: RIASEC_FULL_NAMES[k]?.color || "var(--adm-btn-primary-bg)",
                                        borderRadius: "2px",
                                      }}
                                    />
                                    <span style={{ fontSize: "0.6rem", color: "var(--adm-text-muted)" }}>{k}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>—</span>
                          )}
                        </td>

                        <td>
                          {a.topRecommendations?.[0] ? (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                                {a.topRecommendations[0].field}
                              </span>
                              <span style={{ fontSize: "0.72rem", color: "var(--adm-text-secondary)" }}>
                                {a.topRecommendations[0].school} • Match {a.topRecommendations[0].match}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: "var(--adm-text-muted)", fontSize: "0.75rem" }}>
                              {isValidated ? "Recommandations générées" : "En cours"}
                            </span>
                          )}
                        </td>

                        <td>
                          <span className={`adm-status-badge ${isValidated ? "active" : "pending"}`}>
                            {isValidated ? "Validé IA" : "En attente"}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.76rem" }}>{dateStr || "—"}</span>
                        </td>

                        <td>
                          <div className="adm-row-actions" style={{ justifyContent: "flex-end" }}>
                            <button
                              className="adm-btn adm-btn-secondary adm-btn-sm"
                              onClick={() => setSelectedAssessment(a)}
                            >
                              <span>Examiner</span>
                              <AdminIcons.ArrowRight width="11" height="11" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="adm-pagination">
          <span>
            Affichage de <strong>{filteredAssessments.length}</strong> sur <strong>{assessments.length}</strong> bilans
          </span>
        </div>
      </div>

      {selectedAssessment && (
        <div className="adm-modal-backdrop" onClick={() => setSelectedAssessment(null)}>
          <div
            className="adm-modal-dialog"
            style={{ maxWidth: "680px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {selectedAssessment.dominantCode && (
                  <span className="adm-tag adm-tag-code">{selectedAssessment.dominantCode}</span>
                )}
                <h2 className="adm-modal-title">
                  Bilan de {selectedAssessment.studentName}
                </h2>
              </div>
              <button className="adm-icon-btn" onClick={() => setSelectedAssessment(null)}>
                <AdminIcons.X width="14" height="14" />
              </button>
            </div>

            <div className="adm-modal-body">
              {selectedAssessment.aiSummary && (
                <div
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "6px",
                    backgroundColor: "var(--adm-bg-subtle)",
                    border: "1px solid var(--adm-border-hairline)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.78rem", fontWeight: 700 }}>
                    <AdminIcons.Sparkles width="13" height="13" />
                    <span>Synthèse du Moteur IA Gemini</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.45, color: "var(--adm-text-primary)" }}>
                    {selectedAssessment.aiSummary}
                  </p>
                </div>
              )}

              {selectedAssessment.scores && Object.keys(selectedAssessment.scores).length > 0 && (
                <div>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", fontWeight: 700 }}>
                    Jauges Psychométriques Holland (Dimensions RIASEC)
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {Object.entries(selectedAssessment.scores).map(([dimKey, rawScore]) => {
                      const score = Number(rawScore) || 0;
                      const info = RIASEC_FULL_NAMES[dimKey];
                      const maxScore = 30;
                      const percentage = Math.min(100, Math.round((score / maxScore) * 100));

                      return (
                        <div key={dimKey} className="adm-riasec-bar-container">
                          <span
                            className="adm-riasec-badge"
                            style={{ backgroundColor: info?.color || "inherit" }}
                          >
                            {dimKey}
                          </span>
                          <div style={{ width: "110px", fontSize: "0.78rem", fontWeight: 600 }}>
                            {info?.label || dimKey}
                          </div>
                          <div className="adm-progress-track">
                            <div
                              className="adm-progress-fill"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: info?.color || "var(--adm-btn-primary-bg)",
                              }}
                            />
                          </div>
                          <span className="adm-riasec-score-text">{score} pts</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedAssessment.topRecommendations && selectedAssessment.topRecommendations.length > 0 && (
                <div>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", fontWeight: 700 }}>
                    Parcours Académiques Recommandés par l'IA
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {selectedAssessment.topRecommendations.map((rec, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "0.65rem 0.85rem",
                          borderRadius: "6px",
                          border: "1px solid var(--adm-border-hairline)",
                          backgroundColor: "var(--adm-bg-card)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: "0.82rem" }}>{rec.field}</strong>
                          <div style={{ fontSize: "0.74rem", color: "var(--adm-text-secondary)" }}>
                            🏫 {rec.school}
                          </div>
                        </div>
                        <span className="adm-tag" style={{ fontWeight: 700 }}>
                          Match {rec.match}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.78rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "6px",
                  backgroundColor: "var(--adm-bg-subtle)",
                }}
              >
                <span>Date d'évaluation : <strong>{selectedAssessment.assessmentDate || selectedAssessment.date || "—"}</strong></span>
                <span className={`adm-status-badge ${selectedAssessment.embeddingComputed || selectedAssessment.status === "VALIDATED" ? "active" : "pending"}`}>
                  {selectedAssessment.embeddingComputed || selectedAssessment.status === "VALIDATED" ? "Profil calculé & vectorisé" : "Bilan en attente"}
                </span>
              </div>
            </div>

            <div className="adm-modal-footer">
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                onClick={() => setSelectedAssessment(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
