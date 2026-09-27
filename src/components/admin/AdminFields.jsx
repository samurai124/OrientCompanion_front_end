import { useState, useMemo, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import AdminIcons from "./AdminIcons";
import { AdminContext } from "../../context/AdminContext";
import "./Admin.css";


function Loading() {
  return <div style={{ padding: "3rem", textAlign: "center", color: "var(--adm-text-muted)" }}>Chargement...</div>;
}

function ErrorBox({ message, onRetry }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p style={{ color: "var(--adm-text-muted)", marginBottom: "0.75rem" }}>⚠️ {message}</p>
      <button className="adm-btn adm-btn-secondary" onClick={onRetry}>Réessayer</button>
    </div>
  );
}

const EMPTY_FORM = {
  name: "",
  category: "INFORMATIQUE",
  relatedSubjects: "",
  requiredTraitsJson: "",
  description: "",
};

export default function AdminFields() {
  const location = useLocation();

  const {
    adminFields,
    loading,
    error,
    fetchAdminFields,
    createField,
    updateField,
    deleteField,
  } = useContext(AdminContext);

  useEffect(() => {
    fetchAdminFields();
  }, []);

  const list = adminFields;

  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState("ALL");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);

  const filtered = useMemo(() => list.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (f.name            ?? "").toLowerCase().includes(q) ||
      (f.relatedSubjects ?? "").toLowerCase().includes(q) ||
      (f.description     ?? "").toLowerCase().includes(q);
    const matchCat = catFilter === "ALL" || f.category === catFilter;
    return matchSearch && matchCat;
  }), [list, search, catFilter]);

  function openModal(field = null) {
    setEditTarget(field);
    setForm(field ? {
      name: field.name ?? "",
      category: field.category ?? "INFORMATIQUE",
      relatedSubjects: field.relatedSubjects ?? "",
      requiredTraitsJson: field.requiredTraitsJson ?? "",
      description: field.description ?? "",
    } : EMPTY_FORM);
    setModalOpen(true);
  }

  useEffect(() => {
    if (location.state?.openNew) {
      openModal();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && modalOpen) {
        setModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    let result;
    if (editTarget) {
      result = await updateField(editTarget.id, form);
    } else {
      result = await createField(form);
    }
    if (result) {
      setModalOpen(false);
    } else {
      alert("Erreur lors de la sauvegarde.");
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer cette filière ?")) return;
    const success = await deleteField(id);
    if (!success) alert("Erreur lors de la suppression.");
  }



  return (
    <div className="adm-view-container">
      <div className="adm-page-header">
        <div className="adm-header-title-block">
          <span className="adm-page-badge"><span className="adm-status-dot-green" /> Référentiel</span>
          <h1 className="adm-page-title">Filières Académiques</h1>
          <p className="adm-page-subtitle">{list.length} filières enregistrées dans le système.</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => openModal()}>
          <AdminIcons.Plus width="13" height="13" />
          <span>Nouvelle filière</span>
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <input
          className="adm-search-input"
          placeholder="Rechercher par nom, matières..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "200px" }}
        />
        <select className="adm-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="ALL">Toutes les catégories</option>
          <option value="INFORMATIQUE">Informatique</option>
          <option value="GENIE_CIVIL">Génie Civil</option>
          <option value="MEDECINE">Médecine</option>
          <option value="COMMERCE">Commerce</option>
          <option value="DROIT">Droit</option>
          <option value="ARCHITECTURE">Architecture</option>
        </select>
      </div>

      <div className="adm-card">
        {loading && <Loading />}
        {error   && <ErrorBox message={error} onRetry={reload} />}

        {!loading && !error && (
          <div className="adm-table-container">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Filière</th>
                  <th>Catégorie</th>
                  <th>Matières associées</th>
                  <th>Profils / Traits</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "var(--adm-text-muted)", padding: "2rem" }}>
                      Aucune filière trouvée.
                    </td>
                  </tr>
                ) : (
                  filtered.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <div>
                          <strong style={{ fontSize: "0.84rem" }}>{f.name}</strong>
                          {f.description && (
                            <div style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)", marginTop: "0.15rem" }}>
                              {f.description.slice(0, 90)}{f.description.length > 90 ? "…" : ""}
                            </div>
                          )}
                        </div>
                      </td>
                      <td><span className="adm-tag">{f.category ?? "—"}</span></td>
                      <td style={{ fontSize: "0.78rem" }}>{f.relatedSubjects || "—"}</td>
                      <td>
                        {f.requiredTraitsJson ? (
                          <span className="adm-tag adm-tag-code">{f.requiredTraitsJson}</span>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => openModal(f)} title="Modifier">
                            <AdminIcons.Edit width="12" height="12" />
                          </button>
                          <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(f.id)} title="Supprimer">
                            <AdminIcons.Trash width="12" height="12" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="adm-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">{editTarget ? "Modifier la filière" : "Nouvelle filière"}</h3>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="adm-modal-form">
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Nom de la filière *</label>
                    <input className="adm-form-input" required value={form.name}
                      placeholder="Ex: Génie Informatique & IA"
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Catégorie</label>
                    <select className="adm-form-select" value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="INFORMATIQUE">Informatique</option>
                      <option value="GENIE_CIVIL">Génie Civil</option>
                      <option value="MEDECINE">Médecine</option>
                      <option value="COMMERCE">Commerce</option>
                      <option value="DROIT">Droit</option>
                      <option value="ARCHITECTURE">Architecture</option>
                    </select>
                  </div>
                </div>

                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Matières associées</label>
                    <input className="adm-form-input" value={form.relatedSubjects}
                      placeholder="Ex: Mathématiques, Algorithmique, Physique"
                      onChange={(e) => setForm({ ...form, relatedSubjects: e.target.value })} />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Profils RIASEC / Traits requis</label>
                    <input className="adm-form-input" value={form.requiredTraitsJson}
                      placeholder="Ex: I, R ou Investigateur"
                      onChange={(e) => setForm({ ...form, requiredTraitsJson: e.target.value })} />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description & Débouchés</label>
                  <textarea className="adm-form-textarea" rows={3} value={form.description}
                    placeholder="Compétences visées, carrières et débouchés professionnels..."
                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-secondary" onClick={() => setModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                  {saving ? "Enregistrement..." : editTarget ? "Mettre à jour" : "Créer la filière"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
