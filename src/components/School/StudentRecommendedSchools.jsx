import { useContext, useEffect, useState, useMemo } from "react";
import { SchoolContext } from "../../context/SchoolContext";
import { FieldContext } from "../../context/FieldContext";
import "../Management.css";

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
    fetchSchools(selectedFieldId || null);
    if (fetchFields) fetchFields();
  }, [fetchSchools, fetchFields, selectedFieldId]);

  const filteredSchools = useMemo(() => {
    return (schools || []).filter((school) => {
      const matchesSearch =
        school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSector =
        selectedSector === "ALL" || school.type === selectedSector;

      return matchesSearch && matchesSector;
    });
  }, [schools, searchTerm, selectedSector]);

  return (
    <div className="mgmt-page-container" data-theme={theme}>
      {/* Background Circuit Pattern Layer */}
      <div className="mgmt-circuit-layer" aria-hidden="true">
        <svg className="mgmt-circuit-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuitGridStudentSchools" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 40 80 L 120 80 L 120 160 L 200 160 L 200 240" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <path d="M 0 120 L 80 120 L 80 200 L 160 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <circle cx="40" cy="80" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="120" cy="160" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="80" cy="200" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitGridStudentSchools)" />
        </svg>
      </div>

      <div className="mgmt-content-wrapper">
        {/* Header */}
        <div className="mgmt-header">
          <div className="mgmt-title-area">
            <h2>Établissements & Grandes Écoles</h2>
            <p>Découvrez les universités et instituts correspondant à votre projet d'orientation.</p>
          </div>
          <div className="mgmt-counter-badge">
            <span>{filteredSchools.length} établissement(s) disponible(s)</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mgmt-filter-bar">
          <input
            type="text"
            placeholder="Rechercher par école ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mgmt-search-input"
          />

          <select
            value={selectedFieldId}
            onChange={(e) => setSelectedFieldId(e.target.value)}
            className="mgmt-select"
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
            className="mgmt-select"
          >
            <option value="ALL">Tous les secteurs</option>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Privé</option>
            <option value="SEMI_PUBLIC">Semi-Public</option>
          </select>
        </div>

        {/* Error Banner */}
        {error && <div className="recs-error-banner">{error}</div>}

        {/* Table Content */}
        {loading ? (
          <div className="recs-loading-card">
            <div className="recs-spinner" />
            <p className="recs-loading-text">Recherche des établissements...</p>
          </div>
        ) : (
          <div className="mgmt-card-table">
            <div className="mgmt-table-responsive">
              <table className="mgmt-table">
                <thead>
                  <tr>
                    <th>Établissement</th>
                    <th>Ville</th>
                    <th>Secteur</th>
                    <th>Présentation</th>
                    <th>Portail Web</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchools.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                        Aucun établissement trouvé selon vos critères.
                      </td>
                    </tr>
                  ) : (
                    filteredSchools.map((school) => (
                      <tr key={school.id}>
                        <td>
                          <strong>{school.name}</strong>
                        </td>
                        <td>📍 {school.city || "Non spécifiée"}</td>
                        <td>
                          <span className="mgmt-table-tag">
                            {school.type || "PUBLIC"}
                          </span>
                        </td>
                        <td style={{ maxWidth: "340px" }}>
                          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>
                            {school.description || "Aucune description détaillée disponible."}
                          </p>
                        </td>
                        <td>
                          {school.website ? (
                            <a
                              href={school.website}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "var(--accent-blue)", textDecoration: "none", fontWeight: 600 }}
                            >
                              Accéder au site 🔗
                            </a>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>Non renseigné</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}