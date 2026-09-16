import { useContext, useEffect, useState } from "react";
import { FieldContext } from "../../context/FieldContext";
import "../Management.css";

export default function FieldsManagement({ onNavigate }) {
  const {
    fields,
    loading,
    error,
    fetchFields,
    createField,
    updateField,
    deleteField,
  } = useContext(FieldContext);

  const [theme] = useState(() => {
    return localStorage.getItem("orient_theme") || "light";
  });

  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const initialFormState = {
    name: "",
    category: "",
    description: "",
    duration: "",
    degreeLevel: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchFields(categoryFilter, searchTerm);
  }, [fetchFields, categoryFilter, searchTerm]);

  const handleOpenModal = (field = null) => {
    if (field) {
      setEditingField(field);
      setFormData({
        name: field.name || "",
        category: field.category || "",
        description: field.description || "",
        duration: field.duration || "",
        degreeLevel: field.degreeLevel || "",
      });
    } else {
      setEditingField(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingField(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;

    if (editingField) {
      success = await updateField(editingField.id, formData);
    } else {
      success = await createField(formData);
    }

    if (success) {
      handleCloseModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette filière ?")) {
      await deleteField(id);
    }
  };

  return (
    <div className="mgmt-page-container" data-theme={theme}>
      {/* Background Circuit Pattern */}
      <div className="mgmt-circuit-layer" aria-hidden="true">
        <svg className="mgmt-circuit-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuitGridFields" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 40 80 L 120 80 L 120 160 L 200 160 L 200 240" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <path d="M 0 120 L 80 120 L 80 200 L 160 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <circle cx="40" cy="80" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="120" cy="160" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitGridFields)" />
        </svg>
      </div>

      <div className="mgmt-content-wrapper">
        {/* Header */}
        <div className="mgmt-header">
          <div className="mgmt-title-area">
            <h2>Gestion des Filières d'Études</h2>
            <p>Configurez les parcours académiques, spécialités et débouchés professionnels.</p>
          </div>
          <button className="mgmt-btn-primary" onClick={() => handleOpenModal()}>
            <span>+ Ajouter une Filière</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mgmt-filter-bar">
          <input
            type="text"
            placeholder="Rechercher une filière par nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mgmt-search-input"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="mgmt-select"
          >
            <option value="">Toutes les catégories</option>
            <option value="INFORMATIQUE">Informatique & Tech</option>
            <option value="INGENIERIE">Ingénierie & Industrie</option>
            <option value="SANTE">Santé & Médecine</option>
            <option value="BUSINESS">Commerce & Gestion</option>
          </select>
        </div>

        {/* Error Banner */}
        {error && <div className="recs-error-banner">{error}</div>}

        {/* Table Card */}
        {loading ? (
          <div className="recs-loading-card">
            <div className="recs-spinner" />
            <p className="recs-loading-text">Chargement des filières...</p>
          </div>
        ) : (
          <div className="mgmt-card-table">
            <div className="mgmt-table-responsive">
              <table className="mgmt-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom de la Filière</th>
                    <th>Catégorie</th>
                    <th>Niveau Diplôme</th>
                    <th>Durée</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fields?.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                        Aucune filière trouvée.
                      </td>
                    </tr>
                  ) : (
                    fields?.map((field) => (
                      <tr key={field.id}>
                        <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>#{field.id}</td>
                        <td>
                          <strong>{field.name}</strong>
                          {field.description && (
                            <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                              {field.description.slice(0, 80)}...
                            </p>
                          )}
                        </td>
                        <td>
                          <span className="mgmt-table-tag">
                            {field.category || "Général"}
                          </span>
                        </td>
                        <td>{field.degreeLevel || "Bac + 5"}</td>
                        <td>{field.duration || "5 ans"}</td>
                        <td>
                          <div className="mgmt-table-actions">
                            <button
                              className="mgmt-action-btn"
                              onClick={() => handleOpenModal(field)}
                            >
                              Modifier
                            </button>
                            <button
                              className="mgmt-action-btn mgmt-action-btn--delete"
                              onClick={() => handleDelete(field.id)}
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
                {editingField ? "Modifier la Filière" : "Ajouter une Filière"}
              </h3>
              <form className="mgmt-modal-form" onSubmit={handleSubmit}>
                <div className="mgmt-modal-field">
                  <label>Nom de la filière</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Génie Informatique & IA"
                  />
                </div>

                <div className="mgmt-modal-field">
                  <label>Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">-- Sélectionner une catégorie --</option>
                    <option value="INFORMATIQUE">Informatique & Tech</option>
                    <option value="INGENIERIE">Ingénierie & Industrie</option>
                    <option value="SANTE">Santé & Médecine</option>
                    <option value="BUSINESS">Commerce & Gestion</option>
                  </select>
                </div>

                <div className="mgmt-modal-field">
                  <label>Niveau de diplôme</label>
                  <input
                    type="text"
                    value={formData.degreeLevel}
                    onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value })}
                    placeholder="Ex: Bac+5 (Ingénieur d'État)"
                  />
                </div>

                <div className="mgmt-modal-field">
                  <label>Durée d'études</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Ex: 5 ans (avec classes prépas)"
                  />
                </div>

                <div className="mgmt-modal-field">
                  <label>Description & Débouchés</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Compétences visées, carrières..."
                  />
                </div>

                <div className="mgmt-modal-actions">
                  <button type="button" className="mgmt-btn-secondary" onClick={handleCloseModal}>
                    Annuler
                  </button>
                  <button type="submit" className="mgmt-btn-primary" disabled={loading}>
                    {loading ? "Enregistrement..." : editingField ? "Mettre à jour" : "Créer la filière"}
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