import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminIcons from "./AdminIcons";
import { AdminApi } from "../../api/AdminApi";
import { useFetch } from "../../hooks/useFetch";
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

  const fieldsFetch = useFetch(
    useCallback(() => AdminApi.getFields(), []),
    []
  );

  const fields = useMemo(() => {
    return Array.isArray(fieldsFetch.data) ? fieldsFetch.data : fieldsFetch.data?.content ?? [];
  }, [fieldsFetch.data]);

  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [localList, setLocalList]   = useState(null);

  const list = useMemo(() => {
    if (localList) return localList;
    return Array.isArray(data) ? data : data?.content ?? [];
  }, [localList, data]);

  const filtered = useMemo(() => list.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (s.name ?? "").toLowerCase().includes(q) ||
      (s.city ?? "").toLowerCase().includes(q) ||
      (s.country ?? "").toLowerCase().includes(q);
    const matchType = typeFilter === "ALL" || s.type === typeFilter;
    return matchSearch && matchType;
  }), [list, search, typeFilter]);

  const openModal = useCallback((school = null) => {
    setEditTarget(school);
    setForm(school ? {
      name: school.name ?? "",
      city: school.city ?? "",
      country: school.country ?? "Maroc",
      type: school.type ?? "public",
      fieldId: school.fieldId ?? (fields[0]?.id || ""),
      website: school.website ?? "",
      description: school.description ?? "",
    } : {
      ...EMPTY_FORM,
      fieldId: fields[0]?.id || "",
    });
    setModalOpen(true);
  }, [fields]);

  useEffect(() => {
    if (location.state?.openNew) {
      openModal();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, openModal]);

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
    if (!form.fieldId) {
      alert("Veuillez sélectionner une filière de rattachement.");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      fieldId: Number(form.fieldId),
    };
    try {
      if (editTarget) {
        const updated = await AdminApi.updateSchool(editTarget.id, payload);
        setLocalList(list.map((s) => s.id === editTarget.id ? updated : s));
      } else {
        const created = await AdminApi.createSchool(payload);
        setLocalList([created, ...list]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err?.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer cette école ?")) return;
    setLocalList(list.filter((s) => s.id !== id));
    try {
      await AdminApi.deleteSchool(id);
    } catch {
      setLocalList(null);
      reload();
    }
  }

  return (
    <div className="adm-view-container">
      <div className="adm-page-header">
        <div className="adm-header-title-block">
          <span className="adm-page-badge"><span className="adm-status-dot-green" /> Référentiel</span>
          <h1 className="adm-page-title">Établissements & Universités</h1>
          <p className="adm-page-subtitle">{list.length} établissements dans le système.</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => openModal()}>
          <AdminIcons.Plus width="13" height="13" />
          <span>Nouvelle école</span>
        </button>
      </div>

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

      <div className="adm-card">
        {loading && <Loading />}
        {error   && <ErrorBox message={error} onRetry={reload} />}

        {!loading && !error && (
          <div className="adm-table-container">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Établissement</th>
                  <th>Type</th>
                  <th>Filière de rattachement</th>
                  <th>Ville / Pays</th>
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
                            {s.description.slice(0, 80)}{s.description.length > 80 ? "…" : ""}
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
                          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => openModal(s)} title="Modifier">
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

      {modalOpen && (
        <div className="adm-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">{editTarget ? "Modifier l'établissement" : "Nouvel établissement"}</h3>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="adm-modal-form">
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Nom de l'établissement *</label>
                    <input className="adm-form-input" required value={form.name}
                      placeholder="Ex: École Mohammadia d'Ingénieurs (EMI)"
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Type d'établissement *</label>
                    <select className="adm-form-select" value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}>
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
                    <input className="adm-form-input" required value={form.city}
                      placeholder="Ex: Rabat, Casablanca..."
                      onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                </div>

                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Pays</label>
                    <input className="adm-form-input" value={form.country}
                      placeholder="Ex: Maroc"
                      onChange={(e) => setForm({ ...form, country: e.target.value })} />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Site Web officiel</label>
                    <input className="adm-form-input" type="url"
                      placeholder="https://..."
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })} />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description & Formations</label>
                  <textarea className="adm-form-textarea" rows={3}
                    placeholder="Présentation synthétique de l'école et de ses filières..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-secondary" onClick={() => setModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                  {saving ? "Enregistrement..." : editTarget ? "Mettre à jour" : "Créer l'établissement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
