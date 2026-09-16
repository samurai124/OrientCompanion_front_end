import { useContext, useEffect, useState } from "react";
import { SchoolContext } from "../../context/SchoolContext";
import { FieldContext } from "../../context/FieldContext";
import "../Management.css";

export default function SchoolsManagement({ onNavigate }) {
  const {
    schools,
    loading,
    error,
    fetchSchools,
    createSchool,
    updateSchool,
    deleteSchool,
  } = useContext(SchoolContext);

  const { fields, fetchFields } = useContext(FieldContext);

  const [theme] = useState(() => {
    return localStorage.getItem("orient_theme") || "light";
  });

  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);

  const initialFormState = {
    name: "",
    city: "",
    type: "PUBLIC",
    website: "",
    description: "",
    fieldIds: [],
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchSchools(selectedFieldId || null);
    if (fetchFields) fetchFields();
  }, [fetchSchools, fetchFields, selectedFieldId]);

  const handleOpenModal = (school = null) => {
    if (school) {
      setEditingSchool(school);
      setFormData({
        name: school.name || "",
        city: school.city || "",
        type: school.type || "PUBLIC",
        website: school.website || "",
        description: school.description || "",
        fieldIds: school.fields ? school.fields.map((f) => f.id) : [],
      });
    } else {
      setEditingSchool(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchool(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;

    if (editingSchool) {
      success = await updateSchool(editingSchool.id, formData);
    } else {
      success = await createSchool(formData);
    }

    if (success) {
      handleCloseModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet établissement ?")) {
      await deleteSchool(id);
    }
  };

  const filteredSchools = (schools || []).filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mgmt-page-container" data-theme={theme}>
      {/* Background Circuit Pattern Layer */}
      <div className="mgmt-circuit-layer" aria-hidden="true">
        <svg className="mgmt-circuit-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuitGridSchools" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 40 80 L 120 80 L 120 160 L 200 160 L 200 240" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <path d="M 0 120 L 80 120 L 80 200 L 160 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <circle cx="40" cy="80" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="120" cy="160" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="80" cy="200" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitGridSchools)" />
        </svg>
      </div>

      <div className="mgmt-content-wrapper">
        {/* Header */}
        <div className="mgmt-header">
          <div className="mgmt-title-area">
            <h2>Gestion des Établissements & Écoles</h2>
            <p>Administrez la liste des universités, grandes écoles et instituts au Maroc.</p>
          </div>
          <button className="mgmt-btn-primary" onClick={() => handleOpenModal()}>
            <span>+ Ajouter une École</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mgmt-filter-bar">
          <input
            type="text"
            placeholder="Rechercher par nom d'école ou ville..."
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
        </div>

        {/* Error Banner */}
        {error && <div className="recs-error-banner">{error}</div>}

        {/* Table Card */}
        {loading ? (
          <div className="recs-loading-card">
            <div className="recs-spinner" />
            <p className="recs-loading-text">Chargement des établissements...</p>
          </div>
        ) : (
          <div className="mgmt-card-table">
            <div className="mgmt-table-responsive">
              <table className="mgmt-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom de l'Établissement</th>
                    <th>Ville</th>
                    <th>Secteur</th>
                    <th>Site Web</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchools.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                        Aucun établissement trouvé.
                      </td>
                    </tr>
                  ) : (
                    filteredSchools.map((school) => (
                      <tr key={school.id}>
                        <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>#{school.id}</td>
                        <td>
                          <strong>{school.name}</strong>
                        </td>
                        <td>📍 {school.city || "Non spécifiée"}</td>
                        <td>
                          <span className="mgmt-table-tag">
                            {school.type || "PUBLIC"}
                          </span>
                        </td>
                        <td>
                          {school.website ? (
                            <a
                              href={school.website}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "var(--accent-blue)", textDecoration: "none" }}
                            >
                              Visiter 🔗
                            </a>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>N/A</span>
                          )}
                        </td>
                        <td>
                          <div className="mgmt-table-actions">
                            <button
                              className="mgmt-action-btn"
                              onClick={() => handleOpenModal(school)}
                            >
                              Modifier
                            </button>
                            <button
                              className="mgmt-action-btn mgmt-action-btn--delete"
                              onClick={() => handleDelete(school.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Création / Édition */}
        {isModalOpen && (
          <div className="mgmt-modal-backdrop" onClick={handleCloseModal}>
            <div className="mgmt-modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="mgmt-modal-title">
                {editingSchool ? "Modifier l'Établissement" : "Ajouter un Établissement"}
              </h3>
              <form className="mgmt-modal-form" onSubmit={handleSubmit}>
                <div className="mgmt-modal-field">
                  <label>Nom de l'établissement</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: ENSAM Casablanca"
                  />
                </div>

                <div className="mgmt-modal-field">
                  <label>Ville</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Casablanca"
                  />
                </div>

                <div className="mgmt-modal-field">
                  <label>Secteur</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Privé</option>
                    <option value="SEMI_PUBLIC">Semi-Public</option>
                  </select>
                </div>

                <div className="mgmt-modal-field">
                  <label>Site Web Officiel</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="mgmt-modal-field">
                  <label>Description & Cursus</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Présentation des parcours..."
                  />
                </div>

                <div className="mgmt-modal-actions">
                  <button type="button" className="mgmt-btn-secondary" onClick={handleCloseModal}>
                    Annuler
                  </button>
                  <button type="submit" className="mgmt-btn-primary" disabled={loading}>
                    {loading ? "Enregistrement..." : editingSchool ? "Mettre à jour" : "Créer l'école"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}