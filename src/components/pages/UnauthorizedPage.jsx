import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

/**
 * UnauthorizedPage — Affiché quand un utilisateur authentifié tente d'accéder
 * à une ressource réservée à un autre rôle.
 */
export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleGoBack = () => {
    // Redirige vers la page d'accueil appropriée selon le rôle
    if (user?.role === "STUDENT") navigate("/dashboard", { replace: true });
    else if (user?.role === "COUNSELOR") navigate("/counselor/sessions", { replace: true });
    else if (user?.role === "ADMIN") navigate("/admin/fields", { replace: true });
    else navigate("/", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        gap: "1rem",
      }}
    >
      <span style={{ fontSize: "3rem" }}>🚫</span>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>
        Accès non autorisé
      </h1>
      <p style={{ color: "var(--text-muted, #777)", maxWidth: 400 }}>
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        {user?.role && (
          <>
            {" "}
            Votre rôle actuel est <strong>{user.role}</strong>.
          </>
        )}
      </p>
      <button
        onClick={handleGoBack}
        style={{
          padding: "0.6rem 1.4rem",
          background: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "0.9rem",
        }}
      >
        Retour à mon espace
      </button>
    </div>
  );
}
