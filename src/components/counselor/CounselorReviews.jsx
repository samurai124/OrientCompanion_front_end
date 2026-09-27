import { useState, useEffect, useContext } from "react";
import CounselorIcons from "./CounselorIcons";
import { CounselorContext } from "../../context/CounselorContext";
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

export default function CounselorReviews() {
  const {
    pendingAssessments,
    loading,
    error,
    fetchPendingAssessments,
    submitReview,
  } = useContext(CounselorContext);

  useEffect(() => {
    fetchPendingAssessments();
  }, []);

  const [selected, setSelected] = useState(null);
  const [opinion, setOpinion]   = useState("");
  const [saving, setSaving]     = useState(false);

  const list = Array.isArray(pendingAssessments) ? pendingAssessments : [];

  function openReview(rev) {
    setSelected(rev);
    setOpinion(rev.counselorEndorsement || "");
  }

  async function handleValidate(e) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    const success = await submitReview(selected.id, { opinion, status: "VALIDATED" });
    if (success) {
      setSelected(null);
    } else {
      alert("Impossible d'enregistrer l'avis.");
    }
    setSaving(false);
  }


  return (
    <div className="csl-view-container">

      <div className="csl-page-header">
        <div className="csl-header-title-block">
          <span className="csl-page-badge"><span className="csl-status-dot-green" /> Validation</span>
          <h1 className="csl-page-title">Bilans RIASEC à Examiner</h1>
          <p className="csl-page-subtitle">{list.length} bilans en attente de votre avis professionnel.</p>
        </div>
      </div>

      {loading && <Loading />}
      {error   && <ErrorBox message={error} onRetry={fetchPendingAssessments} />}

      {!loading && !error && list.length === 0 && (

        <div style={{ padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "var(--csl-text-muted)", fontSize: "1rem" }}>
            ✅ Tous les bilans ont été traités. Aucun bilan en attente.
          </p>
        </div>
      )}

      {!loading && !error && list.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {list.map((rev) => (
            <div key={rev.id} className="csl-card" style={{ padding: "1.25rem" }}>

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                  <strong style={{ fontSize: "0.92rem" }}>{rev.studentName}</strong>
                  <div style={{ fontSize: "0.74rem", color: "var(--csl-text-muted)", marginTop: "0.2rem" }}>
                    Soumis le {rev.dateSubmitted ?? "—"} • Durée : {rev.testDuration ?? "—"}
                  </div>
                </div>
                <span className="csl-tag adm-tag-code" style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                  {rev.dominantCode}
                </span>
              </div>

              {rev.aiDominantCareer && (
                <div style={{ fontSize: "0.8rem", color: "var(--csl-text-secondary)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                  <strong>Suggestion IA :</strong> {rev.aiDominantCareer}
                  {rev.aiMatchConfidence && (
                    <span className="csl-tag" style={{ marginLeft: "0.5rem", fontSize: "0.7rem" }}>
                      Match {rev.aiMatchConfidence}
                    </span>
                  )}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="csl-status-badge pending_review" style={{ fontSize: "0.72rem" }}>
                  En attente de validation
                </span>
                <button className="csl-btn csl-btn-primary csl-btn-sm" onClick={() => openReview(rev)}>
                  <CounselorIcons.CheckSquare width="12" height="12" />
                  <span>Rédiger l'avis</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      
      {selected && (
        <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Avis Conseiller — {selected.studentName}</h3>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <form onSubmit={handleValidate} className="adm-form">
              
              <div style={{
                padding: "0.85rem", borderRadius: "6px",
                backgroundColor: "var(--adm-bg-subtle)", marginBottom: "1rem",
                fontSize: "0.82rem", lineHeight: 1.6,
              }}>
                <div><strong>Profil dominant :</strong> {selected.dominantCode}</div>
                {selected.aiDominantCareer && (
                  <div><strong>Suggestion IA :</strong> {selected.aiDominantCareer}</div>
                )}
                {selected.suggestedSchools?.length > 0 && (
                  <div><strong>Écoles suggérées :</strong> {selected.suggestedSchools.join(", ")}</div>
                )}
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Votre avis professionnel *</label>
                <textarea
                  className="adm-input" rows={6} required
                  placeholder="Avis favorable / défavorable, observations sur le profil RIASEC, recommandations d'orientation…"
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                />
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="csl-btn csl-btn-secondary" onClick={() => setSelected(null)}>
                  Annuler
                </button>
                <button type="submit" className="csl-btn csl-btn-primary" disabled={saving}>
                  {saving ? "Enregistrement..." : "Valider & Soumettre l'avis"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
