import { useState, useMemo, useCallback, useEffect } from "react";
import AdminIcons from "./AdminIcons";
import { AdminApi } from "../../api/AdminApi";
import { useFetch } from "../../hooks/useFetch";
import "./Admin.css";

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

function formatDateTime(isoString) {
  if (!isoString) return { date: "—", time: "—", full: "Non planifiée" };
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { date: isoString, time: "—", full: isoString };
    const date = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return { date, time, full: `${date} à ${time}` };
  } catch {
    return { date: isoString, time: "—", full: isoString };
  }
}

export default function AdminMentorship() {
  const { data, loading, error, reload } = useFetch(
    useCallback(() => AdminApi.getMentorshipSessions(), []),
    []
  );

  const sessions = useMemo(() => {
    return Array.isArray(data) ? data : data?.content ?? [];
  }, [data]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedSession, setSelectedSession] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && selectedSession) {
        setSelectedSession(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSession]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchSearch =
        (s.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.studentEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.counselorName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.counselorEmail || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [sessions, searchTerm, statusFilter]);

  const handleUpdateStatus = async (sessionId, newStatus) => {
    setUpdating(true);
    try {
      await AdminApi.updateMentorshipSessionStatus(sessionId, newStatus);
      showToast(`Statut de la séance mis à jour : ${newStatus}`);
      reload();
      if (selectedSession && selectedSession.id === sessionId) {
        setSelectedSession((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      alert("Erreur lors de la mise à jour du statut de la séance.");
    } finally {
      setUpdating(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="adm-view-container">
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 300,
            backgroundColor: "var(--adm-btn-primary-bg)",
            color: "var(--adm-btn-primary-text)",
            padding: "0.65rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.82rem",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.18)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <AdminIcons.Check width="14" height="14" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="adm-page-header">
        <div className="adm-header-title-block">
          <span className="adm-page-badge">Accompagnement & Orientation</span>
          <h1 className="adm-page-title">Séances de Mentorat & Conseillers</h1>
          <p className="adm-page-subtitle">
            Supervision des demandes de rendez-vous d'orientation et entretiens entre étudiants et conseillers.
          </p>
        </div>
      </div>

      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Séances Totales</span>
            <AdminIcons.Mentorship width="14" height="14" />
          </div>
          <div className="adm-kpi-value">{sessions.length}</div>
          <div className="adm-kpi-footer">
            <span className="adm-trend-pill positive">Toutes demandes</span>
          </div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Planifiées</span>
            <span className="adm-tag">Confirmées</span>
          </div>
          <div className="adm-kpi-value">
            {sessions.filter((s) => s.status === "SCHEDULED").length}
          </div>
          <div className="adm-kpi-footer"><span>Créneau fixé</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">En attente</span>
            <AdminIcons.Users width="14" height="14" />
          </div>
          <div className="adm-kpi-value">
            {sessions.filter((s) => s.status === "REQUESTED").length}
          </div>
          <div className="adm-kpi-footer"><span>Demandes à traiter</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Terminées</span>
            <span className="adm-tag">Réalisées</span>
          </div>
          <div className="adm-kpi-value">
            {sessions.filter((s) => s.status === "COMPLETED").length}
          </div>
          <div className="adm-kpi-footer"><span>Entretiens effectués</span></div>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-toolbar-left">
          <div className="adm-search-box">
            <span className="adm-search-icon"><AdminIcons.Search /></span>
            <input
              type="text"
              className="adm-search-input"
              placeholder="Rechercher par étudiant, conseiller, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="adm-tab-pills">
            <button className={`adm-tab-pill${statusFilter === "ALL" ? " active" : ""}`} onClick={() => setStatusFilter("ALL")}>Toutes</button>
            <button className={`adm-tab-pill${statusFilter === "SCHEDULED" ? " active" : ""}`} onClick={() => setStatusFilter("SCHEDULED")}>Planifiées</button>
            <button className={`adm-tab-pill${statusFilter === "REQUESTED" ? " active" : ""}`} onClick={() => setStatusFilter("REQUESTED")}>En attente</button>
            <button className={`adm-tab-pill${statusFilter === "COMPLETED" ? " active" : ""}`} onClick={() => setStatusFilter("COMPLETED")}>Terminées</button>
            <button className={`adm-tab-pill${statusFilter === "CANCELLED" ? " active" : ""}`} onClick={() => setStatusFilter("CANCELLED")}>Annulées</button>
          </div>
        </div>
      </div>

      <div className="adm-card">
        {loading && <Loading />}
        {error && <ErrorBox message={error} onRetry={reload} />}

        {!loading && !error && (
          <div className="adm-table-container">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Conseiller Référent</th>
                  <th>Séance programmée</th>
                  <th>Demandée le</th>
                  <th>Statut</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--adm-text-muted)" }}>
                      Aucune séance ne correspond aux filtres.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => {
                    const scheduled = formatDateTime(session.scheduledAt);
                    const created = formatDateTime(session.createdAt);

                    return (
                      <tr key={session.id}>
                        <td>
                          <div className="adm-user-cell">
                            <div className="adm-avatar">
                              {(session.studentName || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="adm-user-info">
                              <span className="adm-user-name">{session.studentName}</span>
                              <span className="adm-user-email">{session.studentEmail || "—"}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                              {session.counselorName}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)" }}>
                              {session.counselorEmail || "—"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div style={{ display: "flex", flexDirection: "column", fontSize: "0.76rem" }}>
                            <strong>{scheduled.date}</strong>
                            <span style={{ color: "var(--adm-text-secondary)" }}>{scheduled.time}</span>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.76rem", color: "var(--adm-text-muted)" }}>
                            {created.date}
                          </span>
                        </td>

                        <td>
                          <span className={`adm-status-badge ${(session.status || "").toLowerCase()}`}>
                            {session.status === "SCHEDULED"
                              ? "Planifiée"
                              : session.status === "REQUESTED"
                              ? "En attente"
                              : session.status === "COMPLETED"
                              ? "Terminée"
                              : session.status === "CANCELLED"
                              ? "Annulée"
                              : session.status ?? "—"}
                          </span>
                        </td>

                        <td>
                          <div className="adm-row-actions" style={{ justifyContent: "flex-end" }}>
                            <button
                              className="adm-icon-btn"
                              title="Voir les détails"
                              onClick={() => setSelectedSession(session)}
                            >
                              <AdminIcons.Dashboard width="12" height="12" />
                            </button>

                            {session.status !== "COMPLETED" && session.status !== "CANCELLED" && (
                              <button
                                className="adm-icon-btn"
                                title="Marquer comme terminée"
                                disabled={updating}
                                onClick={() => handleUpdateStatus(session.id, "COMPLETED")}
                              >
                                <AdminIcons.Check width="12" height="12" />
                              </button>
                            )}

                            {session.status !== "CANCELLED" && (
                              <button
                                className="adm-icon-btn delete"
                                title="Annuler la séance"
                                disabled={updating}
                                onClick={() => handleUpdateStatus(session.id, "CANCELLED")}
                              >
                                <AdminIcons.X width="12" height="12" />
                              </button>
                            )}
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
            Affichage de <strong>{filteredSessions.length}</strong> sur <strong>{sessions.length}</strong> séances
          </span>
        </div>
      </div>

      {selectedSession && (
        <div className="adm-modal-backdrop" onClick={() => setSelectedSession(null)}>
          <div className="adm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">Fiche de Séance d'Orientation</h2>
              <button className="adm-icon-btn" onClick={() => setSelectedSession(null)}>
                <AdminIcons.X width="14" height="14" />
              </button>
            </div>

            <div className="adm-modal-body">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className={`adm-status-badge ${(selectedSession.status || "").toLowerCase()}`}>
                  {selectedSession.status === "SCHEDULED"
                    ? "Planifiée"
                    : selectedSession.status === "REQUESTED"
                    ? "En attente"
                    : selectedSession.status === "COMPLETED"
                    ? "Terminée"
                    : selectedSession.status === "CANCELLED"
                    ? "Annulée"
                    : selectedSession.status ?? "—"}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>
                  Séance #{selectedSession.id}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  padding: "0.85rem",
                  backgroundColor: "var(--adm-bg-subtle)",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  marginTop: "0.5rem",
                }}
              >
                <div>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Étudiant :</span>
                  <div style={{ fontWeight: 600 }}>{selectedSession.studentName}</div>
                  <div style={{ color: "var(--adm-text-muted)", fontSize: "0.72rem" }}>
                    {selectedSession.studentEmail || "—"}
                  </div>
                </div>

                <div>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Conseiller :</span>
                  <div style={{ fontWeight: 600 }}>{selectedSession.counselorName}</div>
                  <div style={{ color: "var(--adm-text-muted)", fontSize: "0.72rem" }}>
                    {selectedSession.counselorEmail || "—"}
                  </div>
                </div>

                <div>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Date programmée :</span>
                  <div style={{ fontWeight: 600 }}>
                    {formatDateTime(selectedSession.scheduledAt).full}
                  </div>
                </div>

                <div>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Date de la demande :</span>
                  <div style={{ fontWeight: 600 }}>
                    {formatDateTime(selectedSession.createdAt).full}
                  </div>
                </div>
              </div>
            </div>

            <div className="adm-modal-footer">
              {selectedSession.status !== "COMPLETED" && selectedSession.status !== "CANCELLED" && (
                <button
                  type="button"
                  className="adm-btn adm-btn-primary adm-btn-sm"
                  disabled={updating}
                  onClick={() => handleUpdateStatus(selectedSession.id, "COMPLETED")}
                >
                  Marquer comme terminée
                </button>
              )}
              {selectedSession.status !== "CANCELLED" && (
                <button
                  type="button"
                  className="adm-btn adm-btn-danger adm-btn-sm"
                  disabled={updating}
                  onClick={() => handleUpdateStatus(selectedSession.id, "CANCELLED")}
                >
                  Annuler la séance
                </button>
              )}
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                onClick={() => setSelectedSession(null)}
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
