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

const RIASEC_LABELS = {
  R: { label: "Réaliste",      color: "#3b82f6" },
  I: { label: "Investigateur", color: "#6366f1" },
  A: { label: "Artistique",    color: "#ec4899" },
  S: { label: "Social",        color: "#10b981" },
  E: { label: "Entreprenant",  color: "#f59e0b" },
  C: { label: "Conventionnel", color: "#8b5cf6" },
};

export default function CounselorStudents() {
  const { data, loading, error, reload } = useFetch(
    useCallback(() => CounselorApi.getStudents(), []),
    []
  );

  const [search, setSearch]           = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [selected, setSelected]       = useState(null);

  const students = useMemo(() => {
    return Array.isArray(data) ? data : data?.content ?? [];
  }, [data]);

  const filtered = useMemo(() => students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (s.fullName      ?? "").toLowerCase().includes(q) ||
      (s.email         ?? "").toLowerCase().includes(q) ||
      (s.city          ?? "").toLowerCase().includes(q);
    const matchLevel = levelFilter === "ALL" || s.educationLevel === levelFilter;
    return matchSearch && matchLevel;
  }), [students, search, levelFilter]);

  const levels = useMemo(() => [...new Set(students.map((s) => s.educationLevel).filter(Boolean))], [students]);

  return (
    <div className="csl-view-container">

      <div className="csl-page-header">
        <div className="csl-header-title-block">
          <span className="csl-page-badge"><span className="csl-status-dot-green" /> Portefeuille</span>
          <h1 className="csl-page-title">Mes Étudiants</h1>
          <p className="csl-page-subtitle">{students.length} étudiants assignés à votre profil.</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <input
          className="csl-search-input"
          placeholder="Rechercher nom, email, ville…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "200px" }}
        />
        <select className="csl-select" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
          <option value="ALL">Tous les niveaux</option>
          {levels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {loading && <Loading />}
      {error   && <ErrorBox message={error} onRetry={reload} />}

      {!loading && !error && (
        filtered.length === 0 ? (
          <p style={{ color: "var(--csl-text-muted)", textAlign: "center", padding: "2rem" }}>
            Aucun étudiant trouvé.
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}>
            {filtered.map((s) => {
              const dominantKey = (s.dominantRiasec ?? "").charAt(0);
              const meta = RIASEC_LABELS[dominantKey];
              return (
                <div
                  key={s.id}
                  className="csl-card"
                  style={{ padding: "1.25rem", cursor: "pointer" }}
                  onClick={() => setSelected(s)}
                >

                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.85rem" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "10px",
                      backgroundColor: meta?.color ?? "var(--csl-btn-primary-bg)",
                      color: "#fff", fontSize: "0.88rem", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      {(s.fullName ?? "?").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ fontSize: "0.9rem", color: "var(--csl-text-primary)" }}>{s.fullName}</strong>
                      <div style={{ fontSize: "0.72rem", color: "var(--csl-text-muted)" }}>{s.email}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {s.educationLevel && <span className="csl-tag">{s.educationLevel}</span>}
                    {s.city           && <span className="csl-tag">📍 {s.city}</span>}
                    {s.dominantRiasec && (
                      <span className="csl-tag" style={{
                        backgroundColor: (meta?.color ?? "#666") + "22",
                        color: meta?.color ?? "#666",
                        border: `1px solid ${(meta?.color ?? "#666")}44`,
                      }}>
                        {s.dominantRiasec} — {meta?.label ?? "—"}
                      </span>
                    )}
                  </div>

                  <button
                    className="csl-btn csl-btn-secondary csl-btn-sm"
                    style={{ marginTop: "0.85rem", width: "100%" }}
                    onClick={(e) => { e.stopPropagation(); setSelected(s); }}
                  >
                    <CounselorIcons.ArrowRight width="11" height="11" />
                    Voir le profil complet
                  </button>
                </div>
              );
            })}
          </div>
        )
      )}

      {selected && (
        <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
          <div className="adm-modal" style={{ maxWidth: "540px" }} onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">{selected.fullName}</h3>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.84rem" }}>
                {[
                  ["Email",          selected.email],
                  ["Ville",          selected.city],
                  ["Niveau",         selected.educationLevel],
                  ["RIASEC dominant",selected.dominantRiasec],
                  ["Bilans passés",  selected.assessmentsCount ?? "—"],
                  ["Dernière activité", selected.lastActive ?? "—"],
                ].map(([k, v]) => v ? (
                  <div key={k} style={{ padding: "0.5rem", backgroundColor: "var(--adm-bg-subtle)", borderRadius: "6px" }}>
                    <span style={{ color: "var(--adm-text-muted)", fontSize: "0.7rem", display: "block" }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ) : null)}
              </div>

              {selected.bio && (
                <p style={{ fontSize: "0.82rem", color: "var(--adm-text-secondary)", lineHeight: 1.5 }}>
                  {selected.bio}
                </p>
              )}
            </div>

            <div className="adm-modal-footer">
              <button className="csl-btn csl-btn-secondary" onClick={() => setSelected(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
