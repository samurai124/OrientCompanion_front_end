import { Link } from "react-router-dom";

/**
 * NotFoundPage — Page 404 générique.
 */
export default function NotFoundPage() {
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
      <span style={{ fontSize: "3rem" }}>🔍</span>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>
        Page introuvable
      </h1>
      <p style={{ color: "var(--text-muted, #777)", maxWidth: 380 }}>
        L'adresse <code>{window.location.pathname}</code> ne correspond à aucune
        page de l'application.
      </p>
      <Link
        to="/"
        style={{
          padding: "0.6rem 1.4rem",
          background: "#6366f1",
          color: "#fff",
          borderRadius: 10,
          fontWeight: 600,
          textDecoration: "none",
          fontSize: "0.9rem",
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
