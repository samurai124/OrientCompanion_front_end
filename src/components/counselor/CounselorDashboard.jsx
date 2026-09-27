import { useState, useMemo, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import CounselorIcons from "./CounselorIcons";
import { CounselorContext } from "../../context/CounselorContext";
import { AuthContext } from "../../context/AuthContext";
import "./Counselor.css";


function Loading() {
  return <div style={{ padding: "2rem", textAlign: "center", color: "var(--csl-text-muted)" }}>Chargement...</div>;
}

function ErrorBox({ message, onRetry }) {
  return (
    <div style={{ padding: "1.5rem", textAlign: "center" }}>
      <p style={{ color: "var(--csl-text-muted)", marginBottom: "0.5rem" }}>⚠️ {message}</p>
      <button className="csl-btn csl-btn-secondary" onClick={onRetry}>Réessayer</button>
    </div>
  );
}

function formatDateTime(isoString) {
  if (!isoString) return { date: "—", time: "—", full: "Date à définir" };
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

function KpiCard({ label, value, sub, subStyle, icon }) {
  return (
    <div className="csl-kpi-card">
      <div className="csl-kpi-header">
        <span className="csl-kpi-label">{label}</span>
        {icon}
      </div>
      <div className="csl-kpi-value">{value ?? "—"}</div>
      <div className="csl-kpi-footer">
        <span className="csl-tag" style={subStyle}>{sub}</span>
      </div>
    </div>
  );
}

export default function CounselorDashboard() {
  const { user } = useContext(AuthContext);
  const {
    profile,
    sessions: contextSessions,
    loading,
    error,
    fetchProfile,
    fetchSessions,
    updateSession,
  } = useContext(CounselorContext);

  useEffect(() => {
    fetchProfile();
    fetchSessions();
  }, []);

  const sessions = Array.isArray(contextSessions) ? contextSessions : [];

  const upcomingSessions = useMemo(() => {
    return sessions
      .filter((s) => s.status === "SCHEDULED" || s.status === "REQUESTED")
      .slice(0, 5);
  }, [sessions]);

  const completedSessionsCount = useMemo(() => {
    return sessions.filter((s) => s.status === "COMPLETED").length;
  }, [sessions]);

  const counselorName = profile?.fullName ?? user?.fullName ?? "Conseiller";

  const [scheduleModalTarget, setScheduleModalTarget] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const openScheduleModal = (session) => {
    setScheduleModalTarget(session);
    setScheduleDate(toDatetimeLocal(session.scheduledAt));
    setMeetLink(session.meetLink || "");
  };

  const closeScheduleModal = () => {
    setScheduleModalTarget(null);
    setScheduleDate("");
    setMeetLink("");
  };

  const handleSaveMeetAndDate = async (e) => {
    e.preventDefault();
    if (!scheduleModalTarget) return;

    if (!scheduleDate) {
      alert("Veuillez sélectionner la date et l'heure de la séance.");
      return;
    }

    setSavingSchedule(true);
    const success = await updateSession(scheduleModalTarget.id, {
      status: "SCHEDULED",
      scheduledAt: scheduleDate,
      meetLink: meetLink.trim() || null,
    });
    if (success) {
      showToast("Séance planifiée et lien Meet enregistré avec succès !");
      closeScheduleModal();
    } else {
      alert("Impossible de mettre à jour la séance.");
    }
    setSavingSchedule(false);
  };


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
          <span className="csl-page-badge">
            <span className="csl-status-dot-green" />
            Supervision & Mentorat
          </span>
          <h1 className="csl-page-title">Bonjour, {counselorName}</h1>
          <p className="csl-page-subtitle">
            Espace d'accompagnement individualisé — planification des séances, liens Google Meet et suivi des étudiants.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link to="/counselor/sessions" className="csl-btn csl-btn-primary">
            <CounselorIcons.Calendar width="13" height="13" />
            <span>Gérer toutes les séances ({sessions.length})</span>
          </Link>
        </div>
      </div>

      <div className="csl-kpi-grid">
        <KpiCard
          label="Étudiants Suivis"
          value={profile?.activeStudentsCount ?? new Set(sessions.map((s) => s.studentId)).size}
          sub="Lycéens & Candidats"
          icon={<CounselorIcons.Users width="14" height="14" />}
        />
        <KpiCard
          label="Séances à Venir"
          value={upcomingSessions.length}
          sub="À réaliser"
          subStyle={{ backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}
          icon={<CounselorIcons.Calendar width="14" height="14" />}
        />
        <KpiCard
          label="Séances Terminées"
          value={completedSessionsCount}
          sub="Entretiens complétés"
          subStyle={{ backgroundColor: "rgba(59, 130, 246, 0.12)", color: "#2563eb" }}
          icon={<CounselorIcons.CheckSquare width="14" height="14" />}
        />
        <KpiCard
          label="Spécialité"
          value={profile?.specialtyFieldName || "Orientation"}
          sub="Filière de référence"
          icon={<CounselorIcons.Award width="14" height="14" />}
        />
      </div>

      <div className="csl-card" style={{ marginTop: "1rem" }}>
        <div className="csl-card-header">
          <div>
            <h2 className="csl-card-title">Prochains Rendez-vous & Planification Meet</h2>
            <p className="csl-card-desc">
              Définissez la date et ajoutez un lien Google Meet pour chaque séance demandée par un étudiant.
            </p>
          </div>
          <Link to="/counselor/sessions" className="csl-btn csl-btn-secondary csl-btn-sm">
            Voir tout ({sessions.length})
          </Link>
        </div>

        <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {loading && <Loading />}
          {error && <ErrorBox message={error} onRetry={() => { fetchProfile(); fetchSessions(); }} />}

          {!loading && !error && upcomingSessions.length === 0 && (
            <p style={{ color: "var(--csl-text-muted)", fontSize: "0.84rem", padding: "1rem", textAlign: "center" }}>

              Aucune séance en attente ou planifiée pour le moment.
            </p>
          )}

          {upcomingSessions.map((s) => {
            const scheduledInfo = formatDateTime(s.scheduledAt);
            const isScheduled = s.status === "SCHEDULED" && s.scheduledAt;

            return (
              <div
                key={s.id}
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid var(--csl-border-hairline)",
                  backgroundColor: "var(--csl-bg-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        backgroundColor: "var(--csl-btn-primary-bg, #2563eb)",
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {(s.studentName ?? "?").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ fontSize: "0.9rem" }}>{s.studentName}</strong>
                      <div style={{ fontSize: "0.76rem", color: "var(--csl-text-secondary)" }}>
                        {s.studentEmail || "Étudiant inscrit"}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`csl-status-badge ${s.status === "SCHEDULED" ? "active" : "pending"}`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {s.status === "SCHEDULED" ? "Planifiée" : "Demande en attente de date"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.65rem",
                    borderTop: "1px solid var(--csl-border-hairline)",
                    fontSize: "0.8rem",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>📅</span>
                    <strong style={{ color: isScheduled ? "var(--csl-text-primary)" : "var(--csl-warning-text, #d97706)" }}>
                      {scheduledInfo.full}
                    </strong>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {s.meetLink ? (
                      <a
                        href={s.meetLink.startsWith("http") ? s.meetLink : `https://${s.meetLink}`}
                        target="_blank"
                        rel="noreferrer"
                        className="csl-btn csl-btn-primary csl-btn-sm"
                        style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                      >
                        <CounselorIcons.Video width="13" height="13" />
                        <span>Rejoindre Google Meet ↗</span>
                      </a>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "var(--csl-text-muted)" }}>
                        Lien Meet non renseigné
                      </span>
                    )}

                    <button
                      className="csl-btn csl-btn-secondary csl-btn-sm"
                      onClick={() => openScheduleModal(s)}
                      title="Modifier la date ou le lien Meet"
                    >
                      <span>{s.meetLink && s.scheduledAt ? "Modifier Meet / Date" : "Planifier & Ajouter Meet"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {scheduleModalTarget && (
        <div className="adm-modal-overlay" onClick={closeScheduleModal}>
          <div className="adm-modal" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Planifier la séance & Lien Meet</h3>
              <button className="adm-modal-close" onClick={closeScheduleModal}>✕</button>
            </div>

            <form onSubmit={handleSaveMeetAndDate} className="adm-form">
              <div style={{ padding: "0.5rem 0", fontSize: "0.85rem", color: "var(--csl-text-secondary)" }}>
                Étudiant : <strong>{scheduleModalTarget.studentName}</strong> ({scheduleModalTarget.studentEmail || "—"})
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Date et Heure de la séance *</label>
                <input
                  className="adm-input"
                  type="datetime-local"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--csl-text-muted)" }}>
                  Sélectionnez le jour et l'heure convenus pour l'entretien.
                </span>
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Lien Google Meet / Visioconférence</label>
                <input
                  className="adm-input"
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--csl-text-muted)" }}>
                  Exemple : https://meet.google.com/xyz-abcd-efg ou lien Teams/Zoom.
                </span>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="csl-btn csl-btn-secondary" onClick={closeScheduleModal}>
                  Annuler
                </button>
                <button type="submit" className="csl-btn csl-btn-primary" disabled={savingSchedule}>
                  {savingSchedule ? "Enregistrement..." : "Confirmer et Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
