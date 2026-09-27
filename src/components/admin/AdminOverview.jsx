import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AdminIcons from "./AdminIcons";
import { AdminContext } from "../../context/AdminContext";
import "./Admin.css";


function Loading() {
  return (
    <div style={{ padding: "3rem", textAlign: "center", color: "var(--adm-text-muted)" }}>
      Chargement...
    </div>
  );
}

function ErrorBox({ message, onRetry }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p style={{ color: "var(--adm-text-muted)", marginBottom: "0.75rem" }}>
        ⚠️ {message}
      </p>
      <button className="adm-btn adm-btn-secondary" onClick={onRetry}>
        Réessayer
      </button>
    </div>
  );
}

function KpiCard({ label, value, trend, sub, icon }) {
  return (
    <div className="adm-kpi-card">
      <div className="adm-kpi-header">
        <span className="adm-kpi-label">{label}</span>
        <div className="adm-kpi-icon-pill">{icon}</div>
      </div>
      <div className="adm-kpi-value">{value ?? "—"}</div>
      <div className="adm-kpi-footer">
        {trend && (
          <span className="adm-trend-pill positive">
            <AdminIcons.TrendingUp width="11" height="11" />
            {trend}
          </span>
        )}
        <span>{sub}</span>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const {
    stats,
    recentAssessments,
    loading,
    error,
    fetchStats,
    fetchRecentAssessments,
  } = useContext(AdminContext);

  useEffect(() => {
    fetchStats();
    fetchRecentAssessments();
  }, []);

  const assessments = recentAssessments;

  return (
    <div className="adm-view-container">
      <div className="adm-page-header">
        <div className="adm-header-title-block">
          <span className="adm-page-badge">
            <span className="adm-status-dot-green" />
            Supervision Centrale
          </span>
          <h1 className="adm-page-title">Tableau de bord Administrateur</h1>
          <p className="adm-page-subtitle">
            Indicateurs en temps réel — étudiants, bilans d'orientation, catalogue académique et mentorat.
          </p>
        </div>

        <div className="adm-header-actions">
          <Link to="/admin/schools" state={{ openNew: true }} className="adm-btn adm-btn-secondary">
            <AdminIcons.Plus width="13" height="13" />
            <span>Ajouter École</span>
          </Link>
          <Link to="/admin/fields" state={{ openNew: true }} className="adm-btn adm-btn-primary">
            <AdminIcons.Plus width="13" height="13" />
            <span>Ajouter Filière</span>
          </Link>
        </div>
      </div>

      {loading && <Loading />}
      {error && (
        <ErrorBox message={error} onRetry={() => { fetchStats(); fetchRecentAssessments(); }} />
      )}

      {!loading && !error && (

        <div className="adm-kpi-grid">
          <KpiCard
            label="Étudiants Inscrits"
            value={stats?.overview?.totalStudents?.toLocaleString()}
            sub={`${stats?.overview?.completedAssessments ?? 0} bilans finalisés`}
            icon={<AdminIcons.Users width="14" height="14" />}
          />
          <KpiCard
            label="Taux de Complétion"
            value={stats?.overview?.completionRate !== undefined ? `${stats.overview.completionRate}%` : "—"}
            sub="Bilans terminés / Inscrits"
            icon={<AdminIcons.Assessments width="14" height="14" />}
          />
          <KpiCard
            label="Catalogue Écoles"
            value={stats?.catalog?.totalSchools?.toLocaleString()}
            sub={`${stats?.catalog?.publicSchools ?? 0} publiques · ${stats?.catalog?.privateSchools ?? 0} privées`}
            icon={<AdminIcons.Schools width="14" height="14" />}
          />
          <KpiCard
            label="Filières Référencées"
            value={stats?.catalog?.totalFields?.toLocaleString()}
            sub="Domaines d'études actifs"
            icon={<AdminIcons.Fields width="14" height="14" />}
          />
          <KpiCard
            label="Séances de Mentorat"
            value={(
              (stats?.mentorship?.pendingSessions ?? 0) +
              (stats?.mentorship?.confirmedSessions ?? 0) +
              (stats?.mentorship?.completedSessions ?? 0)
            ).toLocaleString()}
            sub={`${stats?.mentorship?.pendingSessions ?? 0} en attente · ${stats?.mentorship?.confirmedSessions ?? 0} confirmées`}
            icon={<AdminIcons.Mentorship width="14" height="14" />}
          />
          <KpiCard
            label="Conseillers Actifs"
            value={stats?.mentorship?.activeMentors?.toLocaleString()}
            sub={`${stats?.mentorship?.completedSessions ?? 0} séances réalisées`}
            icon={<AdminIcons.Users width="14" height="14" />}
          />
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <h3 className="adm-card-title">Derniers Bilans RIASEC Enregistrés</h3>
            <p className="adm-card-desc">Résultats récents du chatbot d'orientation IA</p>
          </div>
          <Link to="/admin/assessments" className="adm-btn adm-btn-secondary adm-btn-sm">
            Voir tout
          </Link>
        </div>

        {loading && <Loading />}
        {error && (
          <ErrorBox message={error} onRetry={fetchRecentAssessments} />
        )}

        {!loading && !error && (

          <div className="adm-table-container">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Profil Dominant</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {assessments.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", color: "var(--adm-text-muted)", padding: "1.5rem" }}>
                      Aucun bilan enregistré pour l'instant.
                    </td>
                  </tr>
                ) : (
                  assessments.map((a) => (
                    <tr key={a.studentId}>
                      <td>
                        <div className="adm-user-cell">
                          <div className="adm-avatar">
                            {(a.studentName ?? "?").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="adm-user-info">
                            <span className="adm-user-name">{a.studentName}</span>
                            <span className="adm-user-email">{a.studentEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.78rem", color: "var(--adm-text-secondary)" }}>
                          Bilan RIASEC
                        </span>
                      </td>
                      <td>
                        <span className={`adm-status-badge ${a.embeddingComputed ? "active" : "suspended"}`}>
                          {a.embeddingComputed ? "Profil calculé" : "En attente"}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>
                        {a.assessmentDate ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {[
          { to: "/admin/users", label: "Gérer les Utilisateurs", icon: <AdminIcons.Users width="16" height="16" /> },
          { to: "/admin/fields", label: "Gérer les Filières", icon: <AdminIcons.Fields width="16" height="16" /> },
          { to: "/admin/schools", label: "Gérer les Écoles", icon: <AdminIcons.Schools width="16" height="16" /> },
          { to: "/admin/assessments", label: "Tous les Bilans", icon: <AdminIcons.Assessments width="16" height="16" /> },
          { to: "/admin/mentorship", label: "Séances Mentorat", icon: <AdminIcons.Mentorship width="16" height="16" /> },
          { to: "/admin/settings", label: "Paramètres", icon: <AdminIcons.Settings width="16" height="16" /> },
        ].map(({ to, label, icon }) => (
          <Link key={to} to={to} className="adm-btn adm-btn-secondary" style={{ justifyContent: "flex-start", gap: "0.6rem" }}>
            {icon}
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}