import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import AuthSideHero from "./AuthSideHero";
import BrandLogo from "../common/BrandLogo";
import "./Auth.css";

const PUBLIC_ROLES = ["STUDENT", "COUNSELOR"];

const schema = yup.object({
  email: yup
    .string()
    .required("L'adresse email est obligatoire")
    .email("Format d'email invalide"),
  password: yup
    .string()
    .required("Le mot de passe est obligatoire")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  fullName: yup.string().required("Le nom complet est obligatoire"),
  role: yup
    .string()
    .oneOf(PUBLIC_ROLES, "Sélectionnez un rôle valide")
    .required("Le rôle est obligatoire"),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [theme] = useState(() => localStorage.getItem("orient_theme") || "light");
  const { register: registerAuth, error: contextError } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const selectedRole = watch("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    const success = await registerAuth(data);
    if (success) {
      navigate("/login", { state: { registered: true } });
    } else {
      setError(contextError || "Échec de l'inscription. Veuillez réessayer.");
    }
    setLoading(false);
  };


  return (
    <div className="auth-page-wrapper" data-theme={theme}>
      <div className="auth-form-column">
        <div className="auth-top-brand">
          <Link to="/" className="auth-brand-link">
            <div className="auth-brand-icon">
              <BrandLogo size={18} />
            </div>
            <span>OrientCompanion</span>
          </Link>

          <Link to="/" className="auth-back-link">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Accueil</span>
          </Link>
        </div>

        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1 className="auth-title">Créer un compte</h1>
            <p className="auth-subtitle">
              Rejoignez la plateforme d'orientation académique et professionnelle.
            </p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-field-group">
              <label className="auth-label">Profil de compte</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                <div
                  onClick={() => setValue("role", "STUDENT", { shouldValidate: true })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "8px",
                    border: `1.5px solid ${
                      selectedRole === "STUDENT"
                        ? "var(--adm-primary, #2563eb)"
                        : "var(--adm-border-hairline, #e2e8f0)"
                    }`,
                    backgroundColor:
                      selectedRole === "STUDENT"
                        ? "rgba(37, 99, 235, 0.05)"
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={selectedRole === "STUDENT" ? "#2563eb" : "currentColor"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>Élève / Étudiant</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--adm-text-muted, #64748b)" }}>
                      Bilans & orientation
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setValue("role", "COUNSELOR", { shouldValidate: true })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "8px",
                    border: `1.5px solid ${
                      selectedRole === "COUNSELOR"
                        ? "var(--adm-primary, #2563eb)"
                        : "var(--adm-border-hairline, #e2e8f0)"
                    }`,
                    backgroundColor:
                      selectedRole === "COUNSELOR"
                        ? "rgba(37, 99, 235, 0.05)"
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={selectedRole === "COUNSELOR" ? "#2563eb" : "currentColor"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>Conseiller</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--adm-text-muted, #64748b)" }}>
                      Mentorat & suivi
                    </div>
                  </div>
                </div>
              </div>
              <input type="hidden" {...register("role")} />
              {errors.role && <p className="auth-error-msg">{errors.role.message}</p>}
            </div>

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
                type="email"
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

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <div className="auth-footer-link">
            Déjà inscrit ?{" "}
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </div>
        </div>

        <div className="auth-form-footer-note">
          © 2026 OrientCompanion. Plateforme d'orientation intelligente.
        </div>
      </div>

      <AuthSideHero
        badgeText="Adhésion Plateforme"
        quoteTitle="Votre avenir académique commence ici."
        quoteDesc="Créez votre compte pour explorer votre profil RIASEC, analyser votre adéquation avec les filières d'excellence et réserver vos séances de mentorat."
      />
    </div>
  );
}