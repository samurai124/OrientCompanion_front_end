import { useState, useMemo, useCallback } from "react";
import CounselorIcons from "./CounselorIcons";
import { AdminApi } from "../../api/AdminApi";
import { useFetch } from "../../hooks/useFetch";
import "./Counselor.css";

export default function CounselorResources() {
  const { data: schoolsData, loading, error, reload } = useFetch(
    useCallback(() => AdminApi.getSchools().catch(() => []), []),
    []
  );

  const schools = useMemo(() => {
    return Array.isArray(schoolsData) ? schoolsData : schoolsData?.content ?? [];
  }, [schoolsData]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredSchools = useMemo(() => {
    return schools.filter((s) => {
      const q = searchTerm.toLowerCase();
      return (
        (s.name || "").toLowerCase().includes(q) ||
        (s.city || "").toLowerCase().includes(q) ||
        (s.category || "").toLowerCase().includes(q)
      );
    });
  }, [schools, searchTerm]);

  return (
    <div className="csl-view-container">
      <div className="csl-page-header">
        <div className="csl-header-title-block">
          <span className="csl-page-badge">Base de Connaissances</span>
          <h1 className="csl-page-title">Référentiel Concours & Seuils Maroc</h1>
          <p className="csl-page-subtitle">
            Guide de référence pour les conseillers : seuils historiques de présélection,
            modalités des concours nationaux (CNC, ENSAM, FMP, UM6P) et calendrier 2026.
          </p>
        </div>
      </div>

      <div className="csl-toolbar">
        <div className="csl-toolbar-left">
          <div className="csl-search-box">
            <span className="csl-search-icon">
              <CounselorIcons.Search />
            </span>
            <input
              type="text"
              className="csl-search-input"
              placeholder="Rechercher une école, un concours ou une ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="csl-card">
        <div className="csl-card-header">
          <div>
            <h2 className="csl-card-title">Seuils Historiques & Modalités d'Admission</h2>
            <p className="csl-card-desc">Données observées pour les sessions 2024-2025 et prévisions 2026</p>
          </div>
          <span className="csl-tag">Session 2026</span>
        </div>

        {loading && <div style={{ padding: "3rem", textAlign: "center", color: "var(--csl-text-muted)" }}>Chargement...</div>}
        {error && (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ color: "var(--csl-text-muted)", marginBottom: "0.5rem" }}>⚠️ {error}</p>
            <button className="csl-btn csl-btn-secondary" onClick={reload}>Réessayer</button>
          </div>
        )}

        {!loading && !error && (
          <div className="csl-table-container">
            <table className="csl-table">
              <thead>
                <tr>
                  <th>Établissement</th>
                  <th>Catégorie / Filière</th>
                  <th>Ville</th>
                  <th>Seuil Estimé</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "3rem", color: "var(--csl-text-muted)" }}>
                      Aucun établissement trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredSchools.map((s) => (
                    <tr key={s.id || s.name}>
                      <td>
                        <strong style={{ fontSize: "0.85rem" }}>{s.name}</strong>
                        {s.website && (
                          <div style={{ fontSize: "0.72rem", color: "var(--csl-text-secondary)", marginTop: "0.2rem" }}>
                            🌐 {s.website}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="csl-tag">{s.category || "Général"}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.78rem" }}>📍 {s.city || "Maroc"}</span>
                      </td>
                      <td>
                        <span className="csl-tag" style={{ fontWeight: 700, backgroundColor: "var(--csl-bg-subtle)" }}>
                          {s.threshold ? `${s.threshold} / 20` : "Concours"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.78rem", color: "var(--csl-text-secondary)", maxWidth: "260px", display: "inline-block" }}>
                          {s.description || "Admission sur dossier & concours écrit."}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        <div className="csl-card" style={{ padding: "1.25rem" }}>
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem", fontWeight: 700 }}>
            📌 Calcul de la Moyenne de Présélection
          </h3>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--csl-text-secondary)", lineHeight: 1.5 }}>
            Pour les concours post-bac marocains (ENSAM, ENSA, FMP), le calcul standard applique :
            <strong> 75% à la moyenne de l'examen National</strong> et <strong>25% à l'examen Régional</strong>.
            Rappelez aux élèves l'importance cruciale de maximiser les épreuves nationales de Maths et Physique.
          </p>
        </div>

        <div className="csl-card" style={{ padding: "1.25rem" }}>
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem", fontWeight: 700 }}>
            🎯 Stratégie de Candidature UM6P
          </h3>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--csl-text-secondary)", lineHeight: 1.5 }}>
            L'UM6P n'utilise pas un seuil mathématique rigide. L'évaluation repose sur la cohérence du projet,
            la curiosité intellectuelle, les projets parascolaires (GitHub, concours scientifiques, clubs) et l'aisance à l'entretien.
          </p>
        </div>
      </div>
    </div>
  );
}
