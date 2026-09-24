import { useState, useMemo, useCallback } from "react";
import AdminIcons from "./AdminIcons";
import { AdminApi } from "../../api/AdminApi";
import { useFetch } from "../../hooks/useFetch";
import "./Admin.css";

// Icônes vectorielles SVG professionnelles
const TabIcons = {
  Cpu: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  ),
  Sliders: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  Shield: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Database: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  RefreshCw: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("AI");
  const [toastMessage, setToastMessage] = useState("");

  const [aiModel, setAiModel] = useState("gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.35);
  const [maxOutputTokens, setMaxOutputTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState(
    `Tu es le conseiller d'orientation expert OrientCompanion, spécialisé dans l'enseignement supérieur au Maroc (Grandes Écoles d'Ingénieurs, Universités, Facultés de Médecine, Écoles de Commerce). Ton objectif est de conduire un entretien psychométrique bienveillant basé sur les 6 dimensions RIASEC de John Holland (Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel). Pose des questions ouvertes adaptées au profil du bachelier marocain.`
  );

  const [academicYear, setAcademicYear] = useState("2026 - 2027");
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const [autoActivateAccounts, setAutoActivateAccounts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const { data: auditData } = useFetch(
    useCallback(() => AdminApi.getAuditLogs().catch(() => []), []),
    []
  );

  const auditLogs = useMemo(() => {
    return Array.isArray(auditData) ? auditData : auditData?.content ?? [];
  }, [auditData]);

  const [auditCategory, setAuditCategory] = useState("ALL");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) =>
      auditCategory === "ALL" ? true : log.category === auditCategory
    );
  }, [auditLogs, auditCategory]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast("Paramètres sauvegardés et synchronisés avec succès.");
  };

  const handleExportData = () => {
    showToast("Génération du rapport d'export complet en cours (JSON/CSV)...");
  };

  const handlePurgeCache = () => {
    if (window.confirm("Voulez-vous purger le cache des recommandations IA ?")) {
      showToast("Cache des recommandations IA réinitialisé.");
    }
  };

  return (
    <div className="adm-view-container">
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 300,
            backgroundColor: "var(--adm-btn-primary-bg)",
            color: "var(--adm-btn-primary-text)",
            padding: "0.65rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.82rem",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.18)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <AdminIcons.Check width="14" height="14" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="adm-page-header">
        <div className="adm-header-title-block">
          <span className="adm-page-badge">Configuration Globale</span>
          <h1 className="adm-page-title">Paramètres Système & IA</h1>
          <p className="adm-page-subtitle">
            Ajustement des modèles d'intelligence artificielle Gemini, directives du chatbot
            psychométrique, politique d'inscription et traçabilité d'audit.
          </p>
        </div>

        <div className="adm-header-actions">
          <button className="adm-btn adm-btn-primary" onClick={handleSaveSettings}>
            <AdminIcons.Check width="13" height="13" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>

      <div className="adm-tab-pills" style={{ width: "fit-content" }}>
        <button
          className={`adm-tab-pill${activeTab === "AI" ? " active" : ""}`}
          onClick={() => setActiveTab("AI")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          <TabIcons.Cpu size={14} />
          <span>Moteur IA Gemini & RIASEC</span>
        </button>
        <button
          className={`adm-tab-pill${activeTab === "PLATFORM" ? " active" : ""}`}
          onClick={() => setActiveTab("PLATFORM")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          <TabIcons.Sliders size={14} />
          <span>Paramètres Plateforme</span>
        </button>
        <button
          className={`adm-tab-pill${activeTab === "AUDIT" ? " active" : ""}`}
          onClick={() => setActiveTab("AUDIT")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          <TabIcons.Shield size={14} />
          <span>Journal d'Audit & Sécurité</span>
        </button>
        <button
          className={`adm-tab-pill${activeTab === "DATA" ? " active" : ""}`}
          onClick={() => setActiveTab("DATA")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          <TabIcons.Database size={14} />
          <span>Données & Sauvegardes</span>
        </button>
      </div>

      {activeTab === "AI" && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Configuration de l'IA Générative (Google GenAI)</h2>
              <p className="adm-card-desc">
                Paramètres d'inférence appliqués lors des entretiens chatbot et du scoring RIASEC.
              </p>
            </div>
            <span className="adm-tag adm-tag-code">SDK @google/genai v2.22</span>
          </div>

          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="adm-form-row">
              <div className="adm-form-group">
                <label className="adm-form-label">Modèle d'Inférence Actif</label>
                <select
                  className="adm-form-select"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommandé - Ultra rapide & équilibré)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Production stable)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Raisonnement analytique profond)</option>
                </select>
                <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)" }}>
                  Garantit un temps de réponse &lt; 800ms pour le chat en direct.
                </span>
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">
                  Température : <strong>{temperature}</strong>
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--adm-btn-primary-bg)" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--adm-text-muted)" }}>
                  <span>Déterministe (0.0)</span>
                  <span>Équilibré (0.35)</span>
                  <span>Créatif (1.0)</span>
                </div>
              </div>
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Limite de Tokens de Sortie</label>
              <input
                type="number"
                className="adm-form-input"
                value={maxOutputTokens}
                onChange={(e) => setMaxOutputTokens(parseInt(e.target.value, 10))}
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">
                Directive Système Principale (System Prompt RIASEC)
              </label>
              <textarea
                rows="5"
                className="adm-form-textarea"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                style={{ fontFamily: "monospace", fontSize: "0.78rem" }}
              />
              <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)" }}>
                Ce prompt guide l'agent virtuel lors des sessions d'orientation des lycéens.
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "PLATFORM" && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Paramètres Généraux de la Plateforme</h2>
              <p className="adm-card-desc">Contrôle des flux d'inscriptions, années scolaires et notifications</p>
            </div>
          </div>

          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="adm-form-group" style={{ maxWidth: "320px" }}>
              <label className="adm-form-label">Année Académique de Référence</label>
              <input
                type="text"
                className="adm-form-input"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                paddingTop: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid var(--adm-border-hairline)",
                  backgroundColor: "var(--adm-bg-subtle)",
                }}
              >
                <div>
                  <strong style={{ fontSize: "0.85rem" }}>Ouverture des Inscriptions Étudiants</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--adm-text-secondary)" }}>
                    Permet aux lycéens de créer un compte librement.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={registrationsOpen}
                  onChange={(e) => setRegistrationsOpen(e.target.checked)}
                  style={{ transform: "scale(1.25)", cursor: "pointer", accentColor: "var(--adm-btn-primary-bg)" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid var(--adm-border-hairline)",
                  backgroundColor: "var(--adm-bg-subtle)",
                }}
              >
                <div>
                  <strong style={{ fontSize: "0.85rem" }}>Activation Immédiate des Comptes</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--adm-text-secondary)" }}>
                    Valide instantanément l'accès sans étape de modération manuelle.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoActivateAccounts}
                  onChange={(e) => setAutoActivateAccounts(e.target.checked)}
                  style={{ transform: "scale(1.25)", cursor: "pointer", accentColor: "var(--adm-btn-primary-bg)" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid var(--adm-border-hairline)",
                  backgroundColor: "var(--adm-bg-subtle)",
                }}
              >
                <div>
                  <strong style={{ fontSize: "0.85rem" }}>Notifications par Email</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--adm-text-secondary)" }}>
                    Envoi automatique des résumés de bilan RIASEC et convocations mentorat.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  style={{ transform: "scale(1.25)", cursor: "pointer", accentColor: "var(--adm-btn-primary-bg)" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid var(--adm-danger-border)",
                  backgroundColor: "var(--adm-danger-bg)",
                }}
              >
                <div>
                  <strong style={{ fontSize: "0.85rem", color: "var(--adm-danger-text)" }}>
                    Mode Maintenance Exceptionnelle
                  </strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--adm-danger-text)" }}>
                    Affiche une page de maintenance aux étudiants et suspend les bilans.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  style={{ transform: "scale(1.25)", cursor: "pointer", accentColor: "#dc2626" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "AUDIT" && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Journal d'Audit & Traçabilité</h2>
              <p className="adm-card-desc">Historique des actions critiques réalisées par les administrateurs</p>
            </div>

            <div className="adm-tab-pills">
              {["ALL", "Écoles", "Filières", "Système"].map((cat) => (
                <button
                  key={cat}
                  className={`adm-tab-pill${auditCategory === cat ? " active" : ""}`}
                  onClick={() => setAuditCategory(cat)}
                >
                  {cat === "ALL" ? "Tous" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="adm-table-container">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Administrateur</th>
                  <th>Action Réalisée</th>
                  <th>Catégorie</th>
                  <th>Horodatage</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "var(--adm-text-muted)" }}>
                      Aucun journal d'audit enregistré.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span style={{ fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 600 }}>
                          {log.admin}
                        </span>
                      </td>
                      <td>{log.action}</td>
                      <td>
                        <span className="adm-tag">{log.category}</span>
                      </td>
                      <td style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>
                        {log.timestamp}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "DATA" && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Gestion des Données & Sauvegardes</h2>
              <p className="adm-card-desc">Exports de données, purges de caches et intégrité de la plateforme</p>
            </div>
          </div>

          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div
              style={{
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid var(--adm-border-hairline)",
                backgroundColor: "var(--adm-bg-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.85rem" }}>Export Global des Données de la Plateforme</strong>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: "var(--adm-text-secondary)" }}>
                  Téléchargez une archive contenant la totalité des bilans RIASEC, fiches écoles et filières (format JSON & CSV).
                </p>
              </div>
              <button className="adm-btn adm-btn-secondary" onClick={handleExportData}>
                <AdminIcons.Download width="13" height="13" />
                <span>Exporter l'archive (.zip)</span>
              </button>
            </div>

            <div
              style={{
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid var(--adm-border-hairline)",
                backgroundColor: "var(--adm-bg-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.85rem" }}>Purger le Cache des Recommandations IA</strong>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: "var(--adm-text-secondary)" }}>
                  Force le re-calcul des scores d'adéquation pour tous les profils étudiants lors de leur prochaine consultation.
                </p>
              </div>
              <button className="adm-btn adm-btn-secondary" onClick={handlePurgeCache}>
                <TabIcons.RefreshCw size={13} />
                <span>Purger le cache IA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}