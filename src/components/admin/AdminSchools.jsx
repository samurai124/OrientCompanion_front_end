import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminIcons from "./AdminIcons";
import { AdminApi } from "../../api/AdminApi";
import { useFetch } from "../../hooks/useFetch";
import "./Admin.css";

const EMPTY_FORM = {
  name: "",
  city: "",
  country: "Maroc",
  type: "public",
  fieldId: "",
  website: "",
  description: "",
};

export default function AdminSchools() {
  const location = useLocation();

  const { data, loading, error, reload } = useFetch(
    useCallback(() => AdminApi.getSchools(), []),
    []
  );

  const { data: fieldsData } = useFetch(
    useCallback(() => AdminApi.getFields(), []),
    []
  );

  const schools = useMemo(() => (Array.isArray(data) ? data : data?.content ?? []), [data]);
  const fields = useMemo(() => (Array.isArray(fieldsData) ? fieldsData : fieldsData?.content ?? []), [fieldsData]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [modalTarget, setModalTarget] = useState(null); // null: fermée, "NEW": création, objet: édition

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return schools.filter((s) => {
      const matchSearch = !q || [s.name, s.city, s.country].some((val) => (val ?? "").toLowerCase().includes(q));
      const matchType = typeFilter === "ALL" || s.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [schools, search, typeFilter]);

  useEffect(() => {
    if (location.state?.openNew) {
      setModalTarget("NEW");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette école définitivement ?")) return;
    try {
      await AdminApi.deleteSchool(id);
      reload();
    } catch {
      alert("Impossible de supprimer cet établissement.");
    }
  };

  return (
    <div className="adm-view-container">
      {/* En-tête */}
      <div className="adm-page-header">
        <div className="adm-header-title-block">
          <span className="adm-page-badge"><span className="adm-status-dot-green" /> Référentiel</span>
          <h1 className="adm-page-title">Établissements & Universités</h1>
          <p className="adm-page-subtitle">{schools.length} établissements répertoriés.</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setModalTarget("NEW")}>
          <AdminIcons.Plus width="13" height="13" />
          <span>Nouvelle école</span>
        </button>
      </div>

      {/* Barre de filtres */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <input
          className="adm-search-input"
          placeholder="Rechercher par nom, ville, pays…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "200px" }}
        />
        <select className="adm-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="ALL">Tous les types</option>
          <option value="public">Public</option>
          <option value="private">Privé</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="adm-card">
        {loading && <div style={{ padding: "3rem", textAlign: "center", color: "var(--adm-text-muted)" }}>Chargement...</div>}
        {error && (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ color: "var(--adm-text-muted)", marginBottom: "0.75rem" }}>⚠️ {error}</p>
            <button className="adm-btn adm-btn-secondary" onClick={reload}>Réessayer</button>
          </div>
        )}

        {!loading && !error && (
          <div className="adm-table-container">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Établissement</th>
                  <th>Type</th>
                  <th>Filière</th>
                  <th>Localisation</th>
                  <th>Site Web</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "var(--adm-text-muted)", padding: "2rem" }}>
                      Aucun établissement trouvé.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong style={{ fontSize: "0.84rem" }}>{s.name}</strong>
                        {s.description && (
                          <div style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)", marginTop: "0.15rem" }}>
                            {s.description.slice(0, 75)}{s.description.length > 75 ? "…" : ""}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`adm-tag ${s.type === "private" ? "adm-tag-private" : "adm-tag-public"}`}>
                          {s.type === "private" ? "Privé" : "Public"}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.78rem" }}>
                        {s.fieldName || fields.find((f) => f.id === s.fieldId)?.name || "—"}
                      </td>
                      <td style={{ fontSize: "0.78rem" }}>
                        {s.city ?? "—"}{s.country ? `, ${s.country}` : ""}
                      </td>
                      <td>
                        {s.website ? (
                          <a
                            href={s.website.startsWith("http") ? s.website : `https://${s.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="adm-table-link"
                            style={{ fontSize: "0.78rem" }}
                          >
                            Visiter ↗
                          </a>
                        ) : (
                          <span style={{ color: "var(--adm-text-muted)", fontSize: "0.75rem" }}>—</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => setModalTarget(s)} title="Modifier">
                            <AdminIcons.Edit width="12" height="12" />
                          </button>
                          <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(s.id)} title="Supprimer">
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

      {/* Modale d'ajout/modification */}
      {modalTarget && (
        <SchoolModal
          target={modalTarget === "NEW" ? null : modalTarget}
          fields={fields}
          onClose={() => setModalTarget(null)}
          onSuccess={() => { setModalTarget(null); reload(); }}
        />
      )}
    </div>
  );
}

function SchoolModal({ target, fields, onClose, onSuccess }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => (
    target
      ? { ...EMPTY_FORM, ...target, fieldId: target.fieldId ?? fields[0]?.id ?? "" }
      : { ...EMPTY_FORM, fieldId: fields[0]?.id ?? "" }
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fieldId) {
      alert("Veuillez sélectionner une filière.");
      return;
    }

    setSaving(true);
    const payload = { ...form, fieldId: Number(form.fieldId) };

    try {
      if (target?.id) {
        await AdminApi.updateSchool(target.id, payload);
      } else {
        await AdminApi.createSchool(payload);
      }
      onSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3 className="adm-modal-title">{target ? "Modifier l'établissement" : "Nouvel établissement"}</h3>
          <button type="button" className="adm-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="adm-modal-form">
          <div className="adm-modal-body">
            <div className="adm-form-row">
              <div className="adm-form-group">
                <label className="adm-form-label">Nom de l'établissement *</label>
                <input
                  className="adm-form-input"
                  required
                  placeholder="Ex: EMI, ENSAM, ENCG..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Type *</label>
                <select
                  className="adm-form-select"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="public">Public</option>
                  <option value="private">Privé</option>
                </select>
              </div>
            </div>

            <div className="adm-form-row">
              <div className="adm-form-group">
                <label className="adm-form-label">Filière de rattachement *</label>
                <select
                  className="adm-form-select"
                  required
                  value={form.fieldId}
                  onChange={(e) => setForm({ ...form, fieldId: e.target.value })}
                >
                  <option value="">Sélectionner une filière...</option>
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.category || "Général"})
                    </option>
                  ))}
                </select>
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Ville *</label>
                <input
                  className="adm-form-input"
                  required
                  placeholder="Ex: Rabat, Casablanca..."
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
            </div>

            <div className="adm-form-row">
              <div className="adm-form-group">
                <label className="adm-form-label">Pays</label>
                <input
                  className="adm-form-input"
                  placeholder="Maroc"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Site Web officiel</label>
                <input
                  className="adm-form-input"
                  type="url"
                  placeholder="https://..."
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Description</label>
              <textarea
                className="adm-form-textarea"
                rows={3}
                placeholder="Présentation synthétique..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="adm-modal-footer">
            <button type="button" className="adm-btn adm-btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
              {saving ? "Enregistrement..." : target ? "Mettre à jour" : "Créer l'établissement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}