import { useEffect, useContext, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RecommendationContext } from "../../context/RecommendationContext";
import "./RecommendationsPage.css";

const DISCIPLINE_PRESETS = {

  ai: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",

  software: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",

  cyber: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",

  telecom: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",

  robotics: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",

  electronics: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",

  civil: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",

  architecture: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",

  medicine: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",

  dentistry: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",

  pharmacy: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",

  finance: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",

  business: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",

  logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",

  aerospace: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",

  agronomy: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80",

  law: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",

  design: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",

  science: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80",

  generic: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
};

function getRecommendationImage(item) {
  if (item?.imageUrl) return item.imageUrl;
  if (item?.image) return item.image;

  const text = `${item.fieldName || ""} ${item.trackName || ""} ${item.fieldCategory || ""} ${item.category || ""} ${item.explanation || ""}`.toLowerCase();

  if (
    text.includes("artificielle") ||
    text.includes("big data") ||
    text.includes("data science") ||
    text.includes("machine learning") ||
    text.includes("deep learning") ||
    text.includes("données massives") ||
    /\bia\b/.test(text)
  ) {
    return DISCIPLINE_PRESETS.ai;
  }

  if (
    text.includes("cyber") ||
    text.includes("sécurité des systèmes") ||
    text.includes("sécurité informatique") ||
    text.includes("cryptograph")
  ) {
    return DISCIPLINE_PRESETS.cyber;
  }

  if (
    text.includes("télécom") ||
    text.includes("telecom") ||
    text.includes("réseau") ||
    text.includes("iot") ||
    text.includes("fibre optique")
  ) {
    return DISCIPLINE_PRESETS.telecom;
  }

  if (
    text.includes("logiciel") ||
    text.includes("software") ||
    text.includes("informatique") ||
    text.includes("développement") ||
    text.includes("programme") ||
    text.includes("web") ||
    text.includes("cloud") ||
    text.includes("systèmes d'information")
  ) {
    return DISCIPLINE_PRESETS.software;
  }

  if (
    text.includes("aéron") ||
    text.includes("aérospat") ||
    text.includes("aviation") ||
    text.includes("aéro") ||
    text.includes("pilote")
  ) {
    return DISCIPLINE_PRESETS.aerospace;
  }

  if (
    text.includes("mécatron") ||
    text.includes("robot") ||
    text.includes("automati")
  ) {
    return DISCIPLINE_PRESETS.robotics;
  }

  if (
    text.includes("électron") ||
    text.includes("embarqu") ||
    text.includes("électrotech") ||
    text.includes("électrique")
  ) {
    return DISCIPLINE_PRESETS.electronics;
  }

  if (
    text.includes("civil") ||
    text.includes("btp") ||
    text.includes("bâtiment") ||
    text.includes("travaux publics") ||
    text.includes("ouvrages") ||
    text.includes("hydraulique")
  ) {
    return DISCIPLINE_PRESETS.civil;
  }

  if (
    text.includes("architec") ||
    text.includes("urban") ||
    text.includes("paysag")
  ) {
    return DISCIPLINE_PRESETS.architecture;
  }

  if (
    text.includes("dent") ||
    text.includes("odontol") ||
    text.includes("bucco")
  ) {
    return DISCIPLINE_PRESETS.dentistry;
  }

  if (
    text.includes("pharm") ||
    text.includes("biotech") ||
    text.includes("médicament") ||
    text.includes("biochim") ||
    text.includes("génétique")
  ) {
    return DISCIPLINE_PRESETS.pharmacy;
  }

  if (
    text.includes("médec") ||
    text.includes("chirurg") ||
    text.includes("santé") ||
    text.includes("clinique") ||
    text.includes("infirmi")
  ) {
    return DISCIPLINE_PRESETS.medicine;
  }

  if (
    text.includes("financ") ||
    text.includes("banque") ||
    text.includes("audit") ||
    text.includes("compta") ||
    text.includes("bours") ||
    text.includes("fiscal")
  ) {
    return DISCIPLINE_PRESETS.finance;
  }

  if (
    text.includes("logist") ||
    text.includes("supply") ||
    text.includes("transport") ||
    text.includes("fret")
  ) {
    return DISCIPLINE_PRESETS.logistics;
  }

  if (
    text.includes("commerce") ||
    text.includes("marketing") ||
    text.includes("management") ||
    text.includes("gestion") ||
    text.includes("business") ||
    text.includes("vente") ||
    text.includes("ressources humaines")
  ) {
    return DISCIPLINE_PRESETS.business;
  }

  if (
    text.includes("agro") ||
    text.includes("agri") ||
    text.includes("végétal") ||
    text.includes("environn") ||
    text.includes("écolog") ||
    text.includes("forêt")
  ) {
    return DISCIPLINE_PRESETS.agronomy;
  }

  if (
    text.includes("droit") ||
    text.includes("jurid") ||
    text.includes("justice") ||
    text.includes("avocat") ||
    text.includes("magistrat") ||
    text.includes("politique") ||
    text.includes("diplom")
  ) {
    return DISCIPLINE_PRESETS.law;
  }

  if (
    text.includes("design") ||
    text.includes("graphi") ||
    text.includes("multiméd") ||
    text.includes("ux") ||
    text.includes("ui") ||
    text.includes("création")
  ) {
    return DISCIPLINE_PRESETS.design;
  }

  if (
    text.includes("mécan") ||
    text.includes("industr") ||
    text.includes("ingénier") ||
    text.includes("matériaux")
  ) {
    return DISCIPLINE_PRESETS.robotics;
  }

  if (
    text.includes("physique") ||
    text.includes("chimie") ||
    text.includes("math")
  ) {
    return DISCIPLINE_PRESETS.science;
  }

  return DISCIPLINE_PRESETS.generic;
}

export default function RecommendationsPage() {
  const {
    recommendations,
    loading,
    error,
    fetchMyRecommendations,
    regenerateRecommendations,
  } = useContext(RecommendationContext);

  const navigate = useNavigate();

  const [theme] = useState(() => {
    return localStorage.getItem("orient_theme") || "light";
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [minMatchFilter, setMinMatchFilter] = useState("ALL");

  useEffect(() => {
    fetchMyRecommendations();
  }, []);


  const categories = useMemo(() => {
    const set = new Set();
    (recommendations || []).forEach((r) => {
      const cat = r.fieldCategory || r.category;
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [recommendations]);

  const filteredRecommendations = useMemo(() => {
    return (recommendations || []).filter((item) => {
      const fieldName = (item.fieldName || item.trackName || "").toLowerCase();
      const schoolName = (item.schools?.[0]?.name || item.schoolName || item.institution || "").toLowerCase();
      const category = (item.fieldCategory || item.category || "").toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !query ||
        fieldName.includes(query) ||
        schoolName.includes(query) ||
        category.includes(query);

      const matchesCategory =
        selectedCategory === "ALL" ||
        (item.fieldCategory || item.category) === selectedCategory;

      const rawScore = item.score ?? item.matchScore ?? 0;
      const matchPct = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);

      let matchesScore = true;
      if (minMatchFilter === "90") matchesScore = matchPct >= 90;
      else if (minMatchFilter === "80") matchesScore = matchPct >= 80;

      return matchesSearch && matchesCategory && matchesScore;
    });
  }, [recommendations, searchTerm, selectedCategory, minMatchFilter]);

  const hasActiveFilters = Boolean(
    searchTerm || selectedCategory !== "ALL" || minMatchFilter !== "ALL"
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ALL");
    setMinMatchFilter("ALL");
  };

  return (
    <div className="recs-container" data-theme={theme}>
      <div className="recs-wrapper">

        <header className="recs-header">
          <div className="recs-title-group">
            <h1 className="recs-title">Filières & Formations Recommandées</h1>
            <p className="recs-subtitle">
              Recommandations personnalisées générées selon votre profil psychométrique RIASEC et vos préférences.
            </p>
          </div>

          <div className="recs-header-actions">
            <div className="recs-counter-pill">
              <span className="recs-counter-dot" />
              <span>
                {filteredRecommendations.length} filière{filteredRecommendations.length !== 1 ? "s" : ""}
              </span>
            </div>

            <button
              onClick={regenerateRecommendations}
              className="recs-btn recs-btn-outline"
              disabled={loading}
              title="Recalculer les recommandations"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              <span>{loading ? "Calcul en cours..." : "Régénérer"}</span>
            </button>

            <Link
              to="/assessment"
              className="recs-btn recs-btn-primary"
              title="Accéder au conseiller IA RIASEC"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Conseiller IA</span>
            </Link>
          </div>
        </header>

        <div className="recs-toolbar">
          <div className="recs-search-box">
            <svg
              className="recs-search-icon"
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
              placeholder="Rechercher une filière, spécialité ou école..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="recs-search-input"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="recs-select"
          >
            <option value="ALL">Toutes les disciplines</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={minMatchFilter}
            onChange={(e) => setMinMatchFilter(e.target.value)}
            className="recs-select"
          >
            <option value="ALL">Toute affinité</option>
            <option value="90">Affinité ≥ 90%</option>
            <option value="80">Affinité ≥ 80%</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="recs-btn recs-btn-outline"
              style={{ height: "38px" }}
              title="Effacer les filtres"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Effacer</span>
            </button>
          )}
        </div>

        {error && (
          <div className="recs-error-banner" role="alert">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="recs-cards-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rec-skeleton-card">
                <div className="rec-skeleton-media" />
                <div className="rec-skeleton-body">
                  <div className="rec-skeleton-line" style={{ width: "70%" }} />
                  <div className="rec-skeleton-line" style={{ width: "45%" }} />
                  <div className="rec-skeleton-line" style={{ width: "95%" }} />
                  <div className="rec-skeleton-line" style={{ width: "80%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (

          <div className="recs-cards-grid">
            {filteredRecommendations.length === 0 ? (
              <div className="recs-empty-card">
                <div className="recs-empty-icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h2 className="recs-empty-title">Aucune recommandation disponible</h2>
                <p className="recs-empty-desc">
                  Échangez avec notre conseiller d'orientation IA ou régénérez l'analyse pour débloquer votre sélection de filières sur mesure.
                </p>
                <div className="recs-empty-actions">
                  <button
                    onClick={() => navigate("/assessment")}
                    className="recs-btn recs-btn-primary"
                  >
                    Démarrer le bilan IA (Chatbot) →
                  </button>
                  <button
                    onClick={regenerateRecommendations}
                    className="recs-btn recs-btn-outline"
                  >
                    Générer les filières
                  </button>
                </div>
              </div>
            ) : (
              filteredRecommendations.map((item, index) => {
                const fieldName = item.fieldName || item.trackName || "Filière recommandée";
                const category = item.fieldCategory || item.category || "Enseignement Supérieur";
                const rawScore = item.score ?? item.matchScore ?? null;
                const matchPct =
                  rawScore !== null
                    ? rawScore <= 1
                      ? Math.round(rawScore * 100)
                      : Math.round(rawScore)
                    : null;

                const primarySchool = item.schools?.[0];
                const schoolDisplay =
                  primarySchool?.name || item.schoolName || item.institution || null;
                const schoolCity = primarySchool?.city || null;

                const cardImage = getRecommendationImage(item);

                return (
                  <article key={item.id ?? index} className="rec-card">

                    <div className="rec-card-media">
                      <img
                        src={cardImage}
                        alt={`Formation ${fieldName}`}
                        className="rec-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DISCIPLINE_PRESETS.generic;
                        }}
                      />
                      <div className="rec-media-overlay" />

                      <div className="rec-media-top-badges">
                        <span className="rec-category-badge">{category}</span>

                        {matchPct !== null && (
                          <span className="rec-score-badge">
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span>{matchPct}% Match</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rec-card-body">
                      <div className="rec-card-header">
                        <h2 className="rec-track-title">{fieldName}</h2>
                        {schoolDisplay && (
                          <div className="rec-primary-school">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                              <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                            <span>
                              {schoolDisplay}
                              {schoolCity ? ` · ${schoolCity}` : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      {item.explanation && (
                        <div className="rec-analysis-box">
                          <div className="rec-analysis-header">
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                            </svg>
                            <span>Analyse OrientCompanion</span>
                          </div>
                          <p className="rec-analysis-text">{item.explanation}</p>
                        </div>
                      )}

                      {Array.isArray(item.schools) && item.schools.length > 1 && (
                        <div className="rec-schools-section">
                          <span className="rec-schools-label">Établissements partenaires</span>
                          <div className="rec-schools-tags">
                            {item.schools.slice(0, 3).map((school, si) => (
                              <span
                                key={si}
                                className="rec-school-pill"
                                title={`${school.name}${school.city ? ` (${school.city})` : ""}`}
                              >
                                {school.name}
                              </span>
                            ))}
                            {item.schools.length > 3 && (
                              <span className="rec-school-pill" style={{ opacity: 0.6 }}>
                                +{item.schools.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <footer className="rec-card-footer">
                      <div className="rec-footer-meta">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>
                          {matchPct && matchPct >= 90
                            ? "Priorité haute"
                            : "Forte compatibilité"}
                        </span>
                      </div>

                      <Link
                        to="/StudentRecommendedSchools"
                        className="rec-explore-btn"
                        title="Consulter les écoles proposant ce cursus"
                      >
                        <span>Voir les écoles</span>
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    </footer>
                  </article>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}