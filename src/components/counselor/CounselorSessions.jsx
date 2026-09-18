import { useState, useMemo, useCallback } from "react";
import CounselorIcons from "./CounselorIcons";
import { CounselorApi } from "../../api/CounselorApi";
import { useFetch } from "../../hooks/useFetch";
import "./Counselor.css";

function Loading() {
  return <div style={{ padding: "3rem", textAlign: "center", color: "var(--csl-text-muted)" }}>Chargement...</div>;
}

function ErrorBox({ message, onRetry }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p style={{ color: "var(--csl-text-muted)", marginBottom: "0.5rem" }}>⚠️ {message}</p>
      <button className="csl-btn csl-btn-secondary" onClick={onRetry}>Réessayer</button>
    </div>
  );
}

const STATUS_LABELS = {
  SCHEDULED: "Planifiée",
  REQUESTED: "En attente",
  COMPLETED: "Terminée",
  CONFIRMED: "Confirmée",
  PENDING:   "En attente",
  CANCELLED: "Annulée",
};

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

function toDatetimeLocal(isoString) {
  if (!isoString) {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    now.setMinutes(0);
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  }
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

export default function CounselorSessions() {
  const { data, loading, error, reload } = useFetch(
    useCallback(() => CounselorApi.getSessions(), []),
    []
  );

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatus]       = useState("ALL");
  const [editTarget, setEditTarget]     = useState(null);
  const [formDate, setFormDate]         = useState("");
  const [formMeetLink, setFormMeetLink] = useState("");
  const [saving, setSaving]             = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const list = useMemo(() => {
    return Array.isArray(data) ? data : data?.content ?? [];
  }, [data]);

  const filtered = useMemo(() => list.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (s.studentName  ?? "").toLowerCase().includes(q) ||
      (s.studentEmail ?? "").toLowerCase().includes(q) ||
      (s.meetLink     ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchSearch && matchStatus;
  }), [list, search, statusFilter]);

  function openEditModal(session) {
    setEditTarget(session);
    setFormDate(toDatetimeLocal(session.scheduledAt));
    setFormMeetLink(session.meetLink || "");
  }

  function closeEditModal() {
    setEditTarget(null);
    setFormDate("");
    setFormMeetLink("");
  }

  async function handleSaveSession(e) {
    e.preventDefault();
    if (!editTarget) return;

    if (!formDate) {
      alert("Veuillez sélectionner la date et l'heure.");
      return;
    }

    setSaving(true);
    try {
      await CounselorApi.updateSession(editTarget.id, {
        status: "SCHEDULED",
        scheduledAt: formDate,
        meetLink: formMeetLink.trim() || null,
      });
      showToast("Date et lien Meet enregistrés avec succès !");
      closeEditModal();
      reload();
    } catch (err) {
      alert(err?.response?.data?.message || "Impossible de mettre à jour la séance.");
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkCompleted(sessionId) {
    if (!window.confirm("Marquer cette séance comme terminée ?")) return;
    try {
      await CounselorApi.updateSession(sessionId, { status: "COMPLETED" });
      showToast("Séance marquée comme terminée.");
      reload();
    } catch {
      alert("Impossible de modifier le statut.");
    }
  }

  return (
    <div className="csl-view-container">
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 300,
            backgroundColor: "var(--csl-btn-primary-bg, #2563eb)",
            color: "#ffffff",
            padding: "0.75rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 600,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>✓ {toastMessage}</span>
        </div>
      )}

      <div className="csl-page-header">
        <div className="csl-header-title-block">
          <span className="csl-page-badge"><span className="csl-status-dot-green" /> Agenda & Visioconférence</span>
          <h1 className="csl-page-title">Séances de Mentorat</h1>
          <p className="csl-page-subtitle">{list.length} séances assignées à votre profil.</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <input
          className="csl-search-input"
          placeholder="Rechercher par étudiant, email, lien Meet…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "200px" }}
        />
        <select className="csl-select" value={statusFilter} onChange={(e) => setStatus(e.target.value)}>
          <option value="ALL">Tous les statuts</option>
          <option value="SCHEDULED">Planifiées</option>
          <option value="REQUESTED">En attente</option>
          <option value="COMPLETED">Terminées</option>
        </select>
      </div>

      <div className="csl-card">
        {loading && <Loading />}
        {error   && <ErrorBox message={error} onRetry={reload} />}

        {!loading && !error && (
          <div className="adm-table-container">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Date & Heure</th>
                  <th>Lien Google Meet</th>
                  <th>Demandée le</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "var(--csl-text-muted)", padding: "2rem" }}>
                      Aucune séance trouvée.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const scheduled = formatDateTime(s.scheduledAt);
                    const created = formatDateTime(s.createdAt);

                    return (
                      <tr key={s.id}>
                        <td>
                          <div className="adm-user-cell">
                            <div className="adm-avatar">
                              {(s.studentName ?? "?").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="adm-user-info">
                              <span className="adm-user-name">{s.studentName}</span>
                              <span className="adm-user-email">{s.studentEmail || "—"}</span>
                            </div>
                          </div>
                        </td>

                        <td style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                          <strong>{scheduled.date}</strong>
                          {scheduled.time !== "—" && (
                            <span style={{ color: "var(--csl-text-secondary)", marginLeft: "0.3rem" }}>
                              • {scheduled.time}
                            </span>
                          )}
                        </td>

                        <td style={{ fontSize: "0.78rem" }}>
                          {s.meetLink ? (
                            <a
                              href={s.meetLink.startsWith("http") ? s.meetLink : `https://${s.meetLink}`}
                              target="_blank"
                              rel="noreferrer"
                              className="csl-btn csl-btn-primary csl-btn-sm"
                              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                            >
                              <CounselorIcons.Video width="12" height="12" />
                              <span>Rejoindre Meet ↗</span>
                            </a>
                          ) : (
                            <span style={{ color: "var(--csl-text-muted)" }}>— Non défini</span>
                          )}
                        </td>

                        <td style={{ fontSize: "0.75rem", color: "var(--csl-text-muted)" }}>
                          {created.date}
                        </td>

                        <td>
                          <span className={`csl-status-badge ${(s.status ?? "").toLowerCase()}`}>
                            {STATUS_LABELS[s.status] ?? s.status}
                          </span>
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: "0.4rem" }}>
                            <button
                              className="csl-btn csl-btn-secondary csl-btn-sm"
                              onClick={() => openEditModal(s)}
                              title="Définir ou modifier le lien Meet et la date"
                            >
                              <span>{s.scheduledAt ? "Modifier Meet / Date" : "Planifier & Meet"}</span>
                            </button>

                            {s.status === "SCHEDULED" && (
                              <button
                                className="csl-btn csl-btn-primary csl-btn-sm"
                                onClick={() => handleMarkCompleted(s.id)}
                                title="Marquer comme terminée"
                              >
                                <span>Terminée ✓</span>
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
      </div>

      {editTarget && (
        <div className="adm-modal-overlay" onClick={closeEditModal}>
          <div className="adm-modal" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Planifier la séance & Lien Meet</h3>
              <button className="adm-modal-close" onClick={closeEditModal}>✕</button>
            </div>

            <form onSubmit={handleSaveSession} className="adm-form">
              <div style={{ padding: "0.5rem 0", fontSize: "0.85rem", color: "var(--csl-text-secondary)" }}>
                Étudiant : <strong>{editTarget.studentName}</strong> ({editTarget.studentEmail || "—"})
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Date et Heure de la séance *</label>
                <input
                  className="adm-input"
                  type="datetime-local"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--csl-text-muted)" }}>
                  Sélectionnez le créneau convenu pour l'échange d'orientation.
                </span>
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Lien Google Meet / Visioconférence</label>
                <input
                  className="adm-input"
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={formMeetLink}
                  onChange={(e) => setFormMeetLink(e.target.value)}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--csl-text-muted)" }}>
                  Exemple : https://meet.google.com/xyz-abcd-efg ou tout lien de visioconférence.
                </span>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="csl-btn csl-btn-secondary" onClick={closeEditModal}>
                  Annuler
                </button>
                <button type="submit" className="csl-btn csl-btn-primary" disabled={saving}>
                  {saving ? "Enregistrement..." : "Confirmer et Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
