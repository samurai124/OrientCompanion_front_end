import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthApi } from "../../api/AuthApi";
import AuthSideHero from "./AuthSideHero";
import "./Auth.css";

const ROLES = ["STUDENT", "COUNSELOR", "ADMIN"];

const schema = yup.object({
  email: yup
    .string()
    .required("L'email est obligatoire")
    .email("Format d'email invalide"),
  password: yup
    .string()
    .required("Le mot de passe est obligatoire")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  fullName: yup.string().required("Le nom complet est obligatoire"),
  role: yup
    .string()
    .oneOf(ROLES, "Le rôle est obligatoire")
    .required("Le rôle est obligatoire"),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [theme] = useState(() => {
    return localStorage.getItem("orient_theme") || "light";
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      role: "STUDENT",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await AuthApi.register(data);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      const message =
        err.response?.data?.message || "Échec de l'inscription. Veuillez réessayer.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper" data-theme={theme}>
      {/* ── LEFT COLUMN: FULL HEIGHT FORM ────────────────────────────── */}
      <div className="auth-form-column">
        {/* Top brand header */}
        <div className="auth-top-brand">
          <Link to="/" className="auth-brand-link">
            <div className="auth-brand-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
              </svg>
            </div>
            <span>OrientCompanion</span>
          </Link>

          <Link to="/" className="auth-back-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Accueil</span>
          </Link>
        </div>

        {/* Center form container */}
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1 className="auth-title">Créer un compte</h1>
            <p className="auth-subtitle">
              Rejoignez la plateforme d'orientation de référence au Maroc.
            </p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="fullName">Nom complet</label>
              <input
                type="text"
                id="fullName"
                placeholder="Ex: Yassine El Idrissi"
                className="auth-input"
                {...register("fullName")}
              />
              {errors.fullName && <p className="auth-error-msg">{errors.fullName.message}</p>}
            </div>

            <div className="auth-field-group">
              <label className="auth-label" htmlFor="email">Adresse Email</label>
              <input
                type="text"
                id="email"
                placeholder="votre.nom@exemple.ma"
                className="auth-input"
                {...register("email")}
              />
              {errors.email && <p className="auth-error-msg">{errors.email.message}</p>}
            </div>

            <div className="auth-field-group">
              <label className="auth-label" htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                placeholder="Minimum 8 caractères"
                className="auth-input"
                {...register("password")}
              />
              {errors.password && <p className="auth-error-msg">{errors.password.message}</p>}
            </div>

            <div className="auth-field-group">
              <label className="auth-label" htmlFor="role">Statut / Rôle</label>
              <select id="role" className="auth-select" {...register("role")}>
                <option value="STUDENT">🎓 Élève / Étudiant(e)</option>
                <option value="COUNSELOR">👨‍🏫 Conseiller d'Orientation</option>
                <option value="ADMIN">⚙️ Administrateur</option>
              </select>
              {errors.role && <p className="auth-error-msg">{errors.role.message}</p>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Création en cours..." : "S'inscrire gratuitement"}
            </button>
          </form>

          <div className="auth-footer-link">
            Déjà inscrit ?{" "}
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </div>
        </div>

        {/* Bottom subtle copyright */}
        <div className="auth-form-footer-note">
          © 2026 OrientCompanion. Plateforme d'orientation intelligente.
        </div>
      </div>

      {/* ── RIGHT COLUMN: ANIMATED VISUAL HERO ───────────────────────── */}
      <AuthSideHero
        badgeText="Inscription Candidat"
        quoteTitle="Votre avenir académique commence ici."
        quoteDesc="Créez votre compte pour explorer votre profil RIASEC, analyser votre adéquation avec plus de 150 écoles d'excellence et réserver vos mentorats."
      />
    </div>
  );
}