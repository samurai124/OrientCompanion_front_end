import { useContext, useEffect } from "react";
import { MentorshipContext } from "../../context/MentorshipContext";

/**
 * CounselorSessionsPage — Vue dédiée aux conseillers (et admins).
 *
 * Affiche la liste des séances d'orientation assignées au conseiller connecté,
 * avec possibilité d'accepter, de refuser ou de reprogrammer chaque séance.
 *
 * Les actions métier sont déléguées à MentorshipContext.updateSession().
 */
export default function CounselorSessionsPage() {
  const {
    counselorSessions,
    fetchMySessionsAsCounselor,
    updateSession,
    loading,
    error,
  } = useContext(MentorshipContext);

  useEffect(() => {
    fetchMySessionsAsCounselor();
  }, [fetchMySessionsAsCounselor]);

  const statusLabel = {
    PENDING: "En attente",
    ACCEPTED: "Acceptée",
    REJECTED: "Refusée",
    COMPLETED: "Terminée",
  };

  const statusColor = {
    PENDING: "#d97706",
    ACCEPTED: "#16a34a",
    REJECTED: "#dc2626",
    COMPLETED: "#6366f1",
  };

  return (
    <div
      style={{
        maxWidth: 860,
        margin: "3rem auto",
        padding: "0 1.5rem",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>
          📋 Mes séances d'orientation
        </h1>
        <p style={{ color: "var(--text-muted, #777)", marginTop: "0.4rem" }}>
          Gérez et validez les demandes de séance de vos étudiants.
        </p>
      </header>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: 10,
            padding: "0.75rem 1rem",
            color: "#dc2626",
            marginBottom: "1.5rem",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--text-muted, #888)" }}>Chargement des séances…</p>
      ) : counselorSessions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--text-muted, #999)",
          }}
        >
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.75rem" }}>
            🗓️
          </span>
          Aucune séance assignée pour le moment.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {counselorSessions.map((session) => (
            <li
              key={session.id}
              style={{
                background: "var(--surface, #fff)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 14,
                padding: "1.25rem 1.5rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {/* Informations sur la séance */}
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  Étudiant :{" "}
                  <span style={{ fontWeight: 400 }}>
                    {session.studentEmail || `#${session.studentId}`}
                  </span>
                </p>
                {session.requestedAt && (
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.83rem", color: "var(--text-muted, #888)" }}>
                    Demandé le {new Date(session.requestedAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "0.5rem",
                    padding: "0.2rem 0.6rem",
                    borderRadius: 6,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    background: `${statusColor[session.status] || "#aaa"}18`,
                    color: statusColor[session.status] || "#555",
                  }}
                >
                  {statusLabel[session.status] || session.status}
                </span>
              </div>

              {/* Actions (uniquement si la séance est en attente) */}
              {session.status === "PENDING" && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => updateSession(session.id, { status: "ACCEPTED" })}
                    style={actionBtn("#16a34a")}
                  >
                    ✔ Accepter
                  </button>
                  <button
                    onClick={() => updateSession(session.id, { status: "REJECTED" })}
                    style={actionBtn("#dc2626")}
                  >
                    ✖ Refuser
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function actionBtn(color) {
  return {
    padding: "0.4rem 0.9rem",
    background: `${color}12`,
    border: `1px solid ${color}30`,
    borderRadius: 8,
    color,
    fontWeight: 600,
    fontSize: "0.83rem",
    cursor: "pointer",
    transition: "background 0.15s",
  };
}
