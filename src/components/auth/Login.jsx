import { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LoginForm from "../../forms/LoginForm";
import AuthSideHero from "./AuthSideHero";
import BrandLogo from "../common/BrandLogo";
import "./Auth.css";

function getHomeByRole(role) {
  switch (role) {
    case "STUDENT":   return "/dashboard";
    case "COUNSELOR": return "/counselor/dashboard";
    case "ADMIN":     return "/admin/dashboard";
    default:          return "/";
  }
}

export default function LoginPage() {
  const { login, error: contextError } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [theme] = useState(() => {
    return localStorage.getItem("orient_theme") || "light";
  });

  const handleLoginSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    const userData = await login(data);

    if (userData) {
      const requestedPath = location.state?.from?.pathname;
      const destination = requestedPath ?? getHomeByRole(userData.role);
      navigate(destination, { replace: true });
    } else {
      setErrorMessage(contextError || "Échec de la connexion. Vérifiez vos identifiants.");
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
            <h1 className="auth-title">Connexion</h1>
            <p className="auth-subtitle">
              Accédez à votre cockpit d'orientation et vos résultats RIASEC.
            </p>
          </div>

          {(errorMessage || contextError) && (
            <div className="auth-error-banner">
              {errorMessage || contextError}
            </div>
          )}

          <LoginForm onSubmit={handleLoginSubmit} loading={loading} />

          <div className="auth-footer-link">
            Pas encore de compte ?{" "}
            <Link to="/register" className="auth-link">
              S'inscrire gratuitement
            </Link>
          </div>
        </div>

        <div className="auth-form-footer-note">
          © 2026 OrientCompanion. Plateforme d'orientation intelligente.
        </div>
      </div>

      <AuthSideHero
        badgeText="Cockpit d'orientation"
        quoteTitle="Retrouvez vos bilans, écoles et mentorats."
        quoteDesc="Connectez-vous pour continuer votre exploration, analyser votre adéquation académique et concrétiser vos candidatures."
      />
    </div>
  );
}