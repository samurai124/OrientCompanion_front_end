import { useState, useEffect, useContext } from "react";
import CounselorIcons from "./CounselorIcons";
import { CounselorContext } from "../../context/CounselorContext";
import "./Counselor.css";

const DEFAULT_SLOTS = [
  { day: "Lundi", active: true, format: "Visioconférence", slots: ["14:00 - 14:45", "15:00 - 15:45", "16:00 - 16:45"] },
  { day: "Mardi", active: true, format: "Présentiel (Cabinet)", slots: ["10:00 - 10:45", "11:00 - 11:45", "14:00 - 14:45"] },
  { day: "Mercredi", active: true, format: "Visioconférence", slots: ["14:00 - 14:45", "15:00 - 15:45", "16:00 - 16:45", "17:00 - 17:45"] },
  { day: "Jeudi", active: true, format: "Présentiel (Cabinet)", slots: ["10:00 - 10:45", "11:00 - 11:45", "15:00 - 15:45"] },
  { day: "Vendredi", active: true, format: "Visioconférence", slots: ["14:00 - 14:45", "15:00 - 15:45"] },
  { day: "Samedi", active: false, format: "Visioconférence", slots: ["10:00 - 10:45", "11:00 - 11:45"] },
];

export default function CounselorAvailability() {
  const { profile: contextProfile, fetchProfile } = useContext(CounselorContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  const profile = {
    fullName: contextProfile?.fullName || "Conseiller d'Orientation",
    title: contextProfile?.title || "Conseiller Spécialiste Orientation Supérieure",
    email: contextProfile?.email || "conseiller@orientcompanion.ma",
    phone: contextProfile?.phone || "+212 5 22 00 00 00",
    bio: contextProfile?.bio || "Accompagnement personnalisé des bacheliers et préparation aux concours des grandes écoles marocaines et internationales.",
    specialties: contextProfile?.specialties || ["Grandes Écoles d'Ingénieurs", "CPGE & Universités", "Commerce & Gestion"],
  };



  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [toastMessage, setToastMessage] = useState("");

  const handleToggleDay = (idx) => {
    setSlots((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, active: !s.active } : s))
    );
    showToast("Disponibilité mise à jour.");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast("Profil et créneaux horaires enregistrés avec succès.");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="csl-view-container">
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 300,
            backgroundColor: "var(--csl-btn-primary-bg)",
            color: "var(--csl-btn-primary-text)",
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
          <CounselorIcons.Check width="14" height="14" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="csl-page-header">
        <div className="csl-header-title-block">
          <span className="csl-page-badge">Configuration Professionnelle</span>
          <h1 className="csl-page-title">Disponibilités & Profil Conseiller</h1>
          <p className="csl-page-subtitle">
            Configurez vos plages horaires de consultation pour les étudiants,
            les modalités d'accueil (visioconférence ou cabinet) et vos spécialités d'orientation.
          </p>
        </div>

        <div className="csl-header-actions">
          <button className="csl-btn csl-btn-primary" onClick={handleSaveProfile}>
            <CounselorIcons.Check width="13" height="13" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <div className="csl-card">
          <div className="csl-card-header">
            <div>
              <h2 className="csl-card-title">Créneaux de Consultation Hebdomadaires</h2>
              <p className="csl-card-desc">Plages ouvertes à la réservation pour les étudiants</p>
            </div>
            <span className="csl-tag">Fuseau Maroc (GMT+1)</span>
          </div>

          <div style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {slots.map((dayItem, idx) => (
              <div
                key={dayItem.day}
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid var(--csl-border-hairline)",
                  backgroundColor: dayItem.active ? "var(--csl-bg-card)" : "var(--csl-bg-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: dayItem.active ? 1 : 0.6,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <strong style={{ fontSize: "0.88rem" }}>{dayItem.day}</strong>
                    <span className="csl-tag" style={{ fontSize: "0.68rem" }}>
                      {dayItem.format}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--csl-text-secondary)", marginTop: "0.25rem" }}>
                    {dayItem.slots.join("  •  ")}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.74rem", fontWeight: 500 }}>
                    {dayItem.active ? "Ouvert" : "Fermé"}
                  </span>
                  <input
                    type="checkbox"
                    checked={dayItem.active}
                    onChange={() => handleToggleDay(idx)}
                    style={{ transform: "scale(1.2)", cursor: "pointer", accentColor: "var(--csl-btn-primary-bg)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="csl-card">
          <div className="csl-card-header">
            <div>
              <h2 className="csl-card-title">Fiche Professionnelle Publique</h2>
              <p className="csl-card-desc">Visible par vos étudiants lors de la réservation</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="csl-form-group">
              <label className="csl-form-label">Nom et Titre</label>
              <input
                type="text"
                className="csl-form-input"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>

            <div className="csl-form-group">
              <label className="csl-form-label">Titre Professionnel</label>
              <input
                type="text"
                className="csl-form-input"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              />
            </div>

            <div className="csl-form-group">
              <label className="csl-form-label">Adresse Email</label>
              <input
                type="email"
                disabled
                className="csl-form-input"
                value={profile.email}
                style={{ opacity: 0.7 }}
              />
            </div>

            <div className="csl-form-group">
              <label className="csl-form-label">Téléphone Professionnel</label>
              <input
                type="text"
                className="csl-form-input"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <div className="csl-form-group">
              <label className="csl-form-label">Biographie / Présentation</label>
              <textarea
                rows="4"
                className="csl-form-textarea"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>

            <div className="csl-form-group">
              <label className="csl-form-label">Domaines de Spécialité</label>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                {profile.specialties.map((spec, i) => (
                  <span key={i} className="csl-tag" style={{ fontSize: "0.72rem" }}>
                    ✔ {spec}
                  </span>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
