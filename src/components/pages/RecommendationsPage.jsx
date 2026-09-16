import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RecommendationContext } from "../../context/RecommendationContext";
import "./RecommendationsPage.css";

export default function RecommendationsPage() {
  const {
    recommendations,
    loading,
    error,
    fetchMyRecommendations,
    regenerateRecommendations,
  } = useContext(RecommendationContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRecommendations();
  }, [fetchMyRecommendations]);

  return (
    <div className="recs-page-container">
      <div className="recs-circuit-layer" aria-hidden="true">
        <svg className="recs-circuit-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuitGridRecs" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 40 80 L 120 80 L 120 160 L 200 160 L 200 240" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <path d="M 0 120 L 80 120 L 80 200 L 160 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <circle cx="40" cy="80" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="120" cy="160" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="80" cy="200" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitGridRecs)" />
        </svg>
      </div>

      <div className="recs-content-wrapper">
        {/* Header */}
        <div className="recs-header">
          <div className="recs-title-col">
            <h1>Vos Recommandations</h1>
            <p>Filières et établissements d'excellence adaptés à votre profil RIASEC et vos notes.</p>
          </div>
          <button onClick={regenerateRecommendations} className="recs-regen-btn" disabled={loading}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span>Régénérer les résultats</span>
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="recs-error-banner">{error}</div>
        )}

        {/* Chargement */}
        {loading ? (
          <div className="recs-loading-card">
            <div className="recs-spinner" />
            <p className="recs-loading-text">
              Analyse de votre profil psychométrique et calcul des filières optimales…
            </p>
          </div>

        ) : recommendations.length === 0 ? (
          /* État vide */
          <div className="recs-empty-card">
            <div className="recs-empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h3 className="recs-empty-title">Aucune recommandation disponible</h3>
            <p className="recs-empty-desc">
              Passez votre premier bilan avec Companion Orient pour débloquer
              votre liste d'écoles et de filières personnalisées.
            </p>
            <button className="recs-regen-btn" onClick={() => navigate("/assessment")}>
              Démarrer le bilan IA →
            </button>
          </div>

        ) : (
          /* Liste des recommandations */
          <div className="recs-grid">
            {recommendations.map((item, index) => {
              /**
               * Mapping défensif des champs du backend → affichage.
               *
               * Backend RecommendationResponse retourne :
               *   fieldName      → nom de la filière
               *   fieldCategory  → catégorie (Ingénierie, Commerce, etc.)
               *   score          → score de compatibilité (0–1 ou 0–100)
               *   explanation    → texte généré par le LLM
               *   schools        → List<SchoolResponse> avec name, city, etc.
               *
               * Champs legacy du frontend (ancienne version) :
               *   trackName, schoolName, institution, matchScore
               */
              const fieldName   = item.fieldName   || item.trackName       || "Filière inconnue";
              const category    = item.fieldCategory|| item.category        || "";
              const rawScore    = item.score        ?? item.matchScore      ?? null;
              // Le backend peut envoyer un score entre 0 et 1 (0.96) ou entre 0 et 100 (96)
              const matchPct    = rawScore !== null
                ? rawScore <= 1
                  ? Math.round(rawScore * 100)
                  : Math.round(rawScore)
                : null;

              // École principale : première de la liste ou champ legacy
              const primarySchool = item.schools?.[0];
              const schoolDisplay = primarySchool?.name
                || item.schoolName
                || item.institution
                || null;

              return (
                <div key={item.id ?? index} className="recs-card">
                  <div className="recs-card-top">
                    <div className="recs-card-school-info">
                      <div className="recs-school-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="recs-track-name">{fieldName}</h2>
                        {category && (
                          <p className="recs-school-name" style={{ opacity: 0.7, fontSize: "0.82rem" }}>
                            {category}
                          </p>
                        )}
                        {schoolDisplay && (
                          <p className="recs-school-name">{schoolDisplay}</p>
                        )}
                      </div>
                    </div>

                    {matchPct !== null && (
                      <div className="recs-match-badge">
                        <span className="recs-match-label">Compatibilité</span>
                        <span className="recs-match-value">{matchPct}%</span>
                      </div>
                    )}
                  </div>

                  {/* Explications LLM */}
                  {item.explanation && (
                    <div className="recs-analysis-box">
                      <div className="recs-analysis-heading">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>Analyse OrientCompanion</span>
                      </div>
                      <p className="recs-analysis-text">{item.explanation}</p>
                    </div>
                  )}

                  {/* Toutes les écoles associées si plusieurs */}
                  {item.schools && item.schools.length > 1 && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <p style={{ fontSize: "0.8rem", fontWeight: 600, opacity: 0.6, margin: "0 0 0.4rem" }}>
                        Établissements compatibles
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {item.schools.map((school, si) => (
                          <span
                            key={si}
                            style={{
                              padding: "0.2rem 0.6rem",
                              borderRadius: 6,
                              fontSize: "0.78rem",
                              background: "rgba(99,102,241,0.08)",
                              color: "var(--accent, #6366f1)",
                              fontWeight: 500,
                            }}
                          >
                            {school.name}
                            {school.city ? ` · ${school.city}` : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}