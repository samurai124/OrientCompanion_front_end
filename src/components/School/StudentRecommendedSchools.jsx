import { useContext, useEffect, useState, useMemo } from "react";
import { SchoolContext } from "../../context/SchoolContext";
import { FieldContext } from "../../context/FieldContext";
import "./StudentRecommendedSchools.css";

const CAMPUS_PRESETS = {
  ensam: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
  um6p: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
  encg: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
  emi: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80",
  inpt: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=80",
  ensa: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  ehtp: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=800&q=80",
  aiac: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  iscae: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  fmp: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
  fst: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
  ena: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  fsjes: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
  generic: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80",
};

function getSchoolCampusImage(school) {
  if (school?.imageUrl) return school.imageUrl;
  if (school?.image) return school.image;

  const normalized = (school?.name || "").toLowerCase();

  for (const [key, url] of Object.entries(CAMPUS_PRESETS)) {
    if (key !== "generic" && normalized.includes(key)) {
      return url;
    }
  }

  if (normalized.includes("ingén") || normalized.includes("polytech") || normalized.includes("techno")) {
    return CAMPUS_PRESETS.ensam;
  }
  if (normalized.includes("commerce") || normalized.includes("gestion") || normalized.includes("business")) {
    return CAMPUS_PRESETS.encg;
  }
  if (normalized.includes("médec") || normalized.includes("santé") || normalized.includes("pharma")) {
    return CAMPUS_PRESETS.fmp;
  }
  if (normalized.includes("archi")) {
    return CAMPUS_PRESETS.ena;
  }
  if (normalized.includes("droit") || normalized.includes("écono")) {
    return CAMPUS_PRESETS.fsjes;
  }

  return CAMPUS_PRESETS.generic;
}

export default function StudentRecommendedSchools() {
  const { schools, loading, error, fetchSchools } = useContext(SchoolContext);
  const { fields, fetchFields } = useContext(FieldContext);

  const [theme] = useState(() => {
    return localStorage.getItem("orient_theme") || "light";
  });

  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");

  useEffect(() => {
    if (fetchFields) fetchFields();
  }, []);

  useEffect(() => {
    fetchSchools(selectedFieldId || null);
  }, [selectedFieldId]);


  const filteredSchools = useMemo(() => {
    return (schools || []).filter((school) => {
      const name = (school.name || "").toLowerCase();
      const city = (school.city || "").toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || city.includes(query);
      const matchesSector = selectedSector === "ALL" || school.type === selectedSector;

      return matchesSearch && matchesSector;
    });
  }, [schools, searchTerm, selectedSector]);

  const hasActiveFilters = Boolean(searchTerm || selectedFieldId || selectedSector !== "ALL");

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedFieldId("");
    setSelectedSector("ALL");
  };

  return (
    <div className="schools-container" data-theme={theme}>
      <div className="schools-wrapper">

        <header className="schools-header">
          <div className="schools-title-group">
            <h1 className="schools-title">Établissements & Grandes Écoles</h1>
            <p className="schools-subtitle">
              Explorez les universités, instituts et grandes écoles correspondant à vos ambitions académiques.
            </p>
          </div>

          <div className="schools-counter-pill">
            <span className="schools-counter-dot" />
            <span>{filteredSchools.length} établissement{filteredSchools.length !== 1 ? "s" : ""}</span>
          </div>
        </header>

        <div className="schools-toolbar">

          <div className="schools-search-box">
            <svg
              className="schools-search-icon"
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
              placeholder="Rechercher par école ou ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="schools-search-input"
            />
          </div>

          <div className="schools-filter-group">
            <select
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              className="schools-select"
            >
              <option value="">Toutes les filières</option>
              {fields?.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="schools-select"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Privé</option>
              <option value="SEMI_PUBLIC">Semi-Public</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="schools-reset-btn"
                title="Effacer tous les filtres"
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
        </div>

        {error && (
          <div className="schools-error-banner" role="alert">
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
          <div className="schools-cards-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="school-skeleton-card">
                <div className="school-skeleton-media" />
                <div className="school-skeleton-body">
                  <div className="school-skeleton-line" style={{ width: "65%" }} />
                  <div className="school-skeleton-line" style={{ width: "90%" }} />
                  <div className="school-skeleton-line" style={{ width: "45%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (

          <div className="schools-cards-grid">
            {filteredSchools.length === 0 ? (
              <div className="schools-empty-state">
                <div className="schools-empty-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21h18" />
                    <path d="M5 21V7l8-4v18" />
                    <path d="M19 21V11l-6-4" />
                    <path d="M9 9v.01" />
                    <path d="M9 12v.01" />
                    <path d="M9 15v.01" />
                    <path d="M9 18v.01" />
                  </svg>
                </div>
                <h3 className="schools-empty-title">Aucun établissement trouvé</h3>
                <p className="schools-empty-desc">
                  Aucun résultat ne correspond à vos filtres actuels. Essayez de modifier vos termes de recherche.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="schools-reset-btn"
                    style={{ marginTop: "0.5rem" }}
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              filteredSchools.map((school) => {
                const schoolImage = getSchoolCampusImage(school);
                const sectorLabel =
                  school.type === "PUBLIC"
                    ? "Public"
                    : school.type === "PRIVATE"
                    ? "Privé"
                    : school.type === "SEMI_PUBLIC"
                    ? "Semi-Public"
                    : school.type || "Public";

                return (
                  <article key={school.id} className="school-card">

                    <div className="school-card-media">
                      <img
                        src={schoolImage}
                        alt={`Campus ${school.name}`}
                        className="school-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = CAMPUS_PRESETS.generic;
                        }}
                      />
                      <div className="school-media-overlay" />

                      <div className="school-media-top-badges">
                        <span className="school-type-badge">
                          {sectorLabel}
                        </span>

                        {school.city && (
                          <span className="school-city-badge">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{school.city}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="school-card-body">
                      <div className="school-card-header">
                        <h2 className="school-card-title">{school.name}</h2>
                      </div>

                      <p className="school-card-desc">
                        {school.description ||
                          "Établissement d'enseignement supérieur d'excellence proposant des formations accréditées et des débouchés professionnels reconnus."}
                      </p>

                      {Array.isArray(school.fields) && school.fields.length > 0 && (
                        <div className="school-fields-section">
                          <span className="school-fields-label">Filières clés</span>
                          <div className="school-fields-tags">
                            {school.fields.slice(0, 3).map((f) => (
                              <span key={f.id} className="school-field-pill" title={f.name}>
                                {f.name}
                              </span>
                            ))}
                            {school.fields.length > 3 && (
                              <span
                                className="school-field-pill-more"
                                title={school.fields
                                  .slice(3)
                                  .map((f) => f.name)
                                  .join(", ")}
                              >
                                +{school.fields.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <footer className="school-card-footer">
                      <div className="school-footer-meta">
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
                          {Array.isArray(school.fields) ? `${school.fields.length} parcours` : "Accrédité"}
                        </span>
                      </div>

                      {school.website ? (
                        <a
                          href={school.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="school-portal-link"
                          title={`Consulter le site officiel de ${school.name}`}
                        >
                          <span>Portail officiel</span>
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
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      ) : (
                        <span className="school-no-portal">Portail non renseigné</span>
                      )}
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