import { useState, useMemo, useCallback, useEffect } from "react";
import AdminIcons from "./AdminIcons";
import { AdminApi } from "../../api/AdminApi";
import { useFetch } from "../../hooks/useFetch";
import "./Admin.css";

const ROLE_LABELS = { STUDENT: "Étudiant", COUNSELOR: "Conseiller", ADMIN: "Admin" };

function getStatus(u) {
  return u.enabled === false ? "SUSPENDED" : "ACTIVE";
}

export default function AdminUsers() {
  const { data, loading, error, reload } = useFetch(useCallback(() => AdminApi.getUsers(), []), []);

  const [search, setSearch] = useState("");
  const [roleFilter, setRole] = useState("ALL");
  const [statusFilter, setStatus] = useState("ALL");

  const [createOpen, setCreateOpen] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState(null);

  const list = useMemo(() => (Array.isArray(data) ? data : data?.content ?? []), [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((u) => {
      const matchSearch = !q || [u.fullName, u.email].some((v) => (v ?? "").toLowerCase().includes(q));
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchStatus = statusFilter === "ALL" || getStatus(u) === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [list, search, roleFilter, statusFilter]);

  const counts = useMemo(() => ({
    total: list.length,
    students: list.filter((u) => u.role === "STUDENT").length,
    counselors: list.filter((u) => u.role === "COUNSELOR").length,
    admins: list.filter((u) => u.role === "ADMIN").length,
  }), [list]);

  async function handleToggleStatus(user) {
    const next = getStatus(user) === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await AdminApi.toggleUserStatus(user.id, next);
      reload();
    } catch {
      alert("Erreur lors de la modification du statut.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer cet utilisateur définitivement ?")) return;
    try {
      await AdminApi.deleteUser(id);
      reload();
    } catch {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <div className="adm-view-container">
      <div className="adm-page-header">
        <div className="adm-header-title-block">
          <span className="adm-page-badge">
            <span className="adm-status-dot-green" /> Gestion des Comptes
          </span>
          <h1 className="adm-page-title">Utilisateurs</h1>
          <p className="adm-page-subtitle">
            {counts.total} comptes — {counts.students} étudiants, {counts.counselors} conseillers, {counts.admins} admins.
          </p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setCreateOpen(true)}>
          <AdminIcons.Plus width="13" height="13" />
          <span>Nouveau compte</span>
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <input
          className="adm-search-input"
          placeholder="Rechercher par nom, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "200px" }}
        />
        <select className="adm-select" value={roleFilter} onChange={(e) => setRole(e.target.value)}>
          <option value="ALL">Tous les rôles</option>
          <option value="STUDENT">Étudiant</option>
          <option value="COUNSELOR">Conseiller</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select className="adm-select" value={statusFilter} onChange={(e) => setStatus(e.target.value)}>
          <option value="ALL">Tous les statuts</option>
          <option value="ACTIVE">Actif</option>
          <option value="SUSPENDED">Suspendu</option>
        </select>
      </div>

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
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Inscrit le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "var(--adm-text-muted)", padding: "2rem" }}>
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                    filtered.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="adm-user-cell">
                          <div className="adm-avatar">{(u.fullName ?? "?").slice(0, 2).toUpperCase()}</div>
                          <div className="adm-user-info">
                            <span className="adm-user-name">{u.fullName}</span>
                            <span className="adm-user-email">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="adm-tag">{ROLE_LABELS[u.role] ?? u.role}</span>
                        {u.role === "STUDENT" && (
                          <span
                            className="adm-tag"
                            style={{
                              marginLeft: "0.4rem",
                              fontSize: "0.7rem",
                              backgroundColor: u.assessmentDone ? "rgba(16, 185, 129, 0.12)" : "rgba(100, 116, 139, 0.12)",
                              color: u.assessmentDone ? "#10b981" : "var(--adm-text-muted)",
                            }}
                          >
                            {u.assessmentDone ? "RIASEC ✓" : "Sans bilan"}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`adm-status-badge ${getStatus(u).toLowerCase()}`}>
                          {getStatus(u) === "ACTIVE" ? "Actif" : "Suspendu"}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>
                        {u.createdAt ? u.createdAt.split("T")[0] : "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            className="adm-btn adm-btn-secondary adm-btn-sm"
                            onClick={() => handleToggleStatus(u)}
                            title={getStatus(u) === "ACTIVE" ? "Suspendre" : "Activer"}
                          >
                            {getStatus(u) === "ACTIVE" ? "Suspendre" : "Activer"}
                          </button>
                          <button
                            className="adm-btn adm-btn-secondary adm-btn-sm"
                            onClick={() => setPasswordTarget(u)}
                            title="Modifier le mot de passe"
                          >
                            🔑
                          </button>
                          <button
                            className="adm-btn adm-btn-danger adm-btn-sm"
                            onClick={() => handleDelete(u.id)}
                            title="Supprimer"
                          >
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

      {createOpen && (
        <CreateUserModal
          onClose={() => setCreateOpen(false)}
          onSuccess={() => { setCreateOpen(false); reload(); }}
        />
      )}

      {passwordTarget && (
        <ResetPasswordModal
          user={passwordTarget}
          onClose={() => setPasswordTarget(null)}
        />
      )}
    </div>
  );
}

function CreateUserModal({ onClose, onSuccess }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "STUDENT" });

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setSaving(true);
    try {
      await AdminApi.createUser(form);
      onSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || "Impossible de créer l'utilisateur.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3 className="adm-modal-title">Nouveau compte utilisateur</h3>
          <button type="button" className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="adm-modal-form">
          <div className="adm-modal-body">
            <div className="adm-form-row">
              <div className="adm-form-group">
                <label className="adm-form-label">Nom complet *</label>
                <input
                  className="adm-form-input"
                  required
                  placeholder="Ex: Sara Mansouri"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Email *</label>
                <input
                  className="adm-form-input"
                  type="email"
                  required
                  placeholder="etudiant@student.ma"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="adm-form-row">
              <div className="adm-form-group">
                <label className="adm-form-label">Mot de passe *</label>
                <input
                  className="adm-form-input"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 caractères"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Rôle *</label>
                <select
                  className="adm-form-select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="STUDENT">Étudiant</option>
                  <option value="COUNSELOR">Conseiller d'orientation</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            </div>
          </div>
          <div className="adm-modal-footer">
            <button type="button" className="adm-btn adm-btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
              {saving ? "Enregistrement..." : "Créer le compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResetPasswordModal({ user, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleReset(e) {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }
    setSaving(true);
    try {
      await AdminApi.resetUserPassword(user.id, newPassword);
      alert(`Mot de passe réinitialisé avec succès pour ${user.fullName}.`);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
        <div className="adm-modal-header">
          <h3 className="adm-modal-title">Modifier le mot de passe</h3>
          <button type="button" className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleReset} className="adm-modal-form">
          <div className="adm-modal-body">
            <p style={{ fontSize: "0.82rem", color: "var(--adm-text-secondary)", margin: 0, lineHeight: 1.45 }}>
              Définir un nouveau mot de passe pour <strong>{user.fullName}</strong> ({user.email}).
            </p>
            <div className="adm-form-group">
              <label className="adm-form-label">Nouveau mot de passe *</label>
              <input
                className="adm-form-input"
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 caractères"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="adm-modal-footer">
            <button type="button" className="adm-btn adm-btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
              {saving ? "Mise à jour..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}