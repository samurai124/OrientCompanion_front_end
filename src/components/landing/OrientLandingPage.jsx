import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BrandLogo from "../common/BrandLogo";
import "./OrientLandingPage.css";

/* ==========================================================================
   SVG ICONS & LOGOS (Dribbble Design Faithful)
   ========================================================================== */

const SchoolLogoIcon = () => <BrandLogo size={28} />;

const ArrowUpRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const QuoteWatermarkIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.25">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

/* Academic Program Icons */
const BookOpenIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const SpeedometerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const FeatherPenIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

const BeakerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v7.31a2 2 0 0 1-.37 1.17L4.35 18A2 2 0 0 0 6 21h12a2 2 0 0 0 1.65-3l-5.28-7.52A2 2 0 0 1 14 9.31V2" />
    <path d="M8.5 2h7" />
    <path d="M7 16h10" />
  </svg>
);

/* Moroccan Higher Education Emblems / Logos in Grid */
const EnsamLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fillOpacity="0.15" />
    <path d="M12 6L7 16h10L12 6zm0 3.2l2.6 5.3H9.4L12 9.2z" />
  </svg>
);

const Um6pLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="8" height="8" rx="2" fillOpacity="0.25" />
    <rect x="13" y="3" width="8" height="8" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
    <rect x="13" y="13" width="8" height="8" rx="2" fillOpacity="0.25" />
  </svg>
);

const EncgLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M8 10h8" />
  </svg>
);

const EnsaLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

const FmpLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2z" />
  </svg>
);

const CpgeLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 20h20L12 2zm0 5.5l5.5 10.5h-11L12 7.5z" />
  </svg>
);

const IscaeLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="8" width="18" height="8" rx="4" fill="currentColor" fillOpacity="0.2" />
    <circle cx="9" cy="12" r="2" fill="currentColor" />
  </svg>
);

const EhtpLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="19" cy="5" r="1.5" fill="currentColor" />
  </svg>
);

const InseaLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const AiacLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 12h5v8h10v-8h5L12 2z" />
  </svg>
);

const EnaLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <line x1="12" y1="12" x2="19" y2="7" />
  </svg>
);

/* Social Icons */
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XTwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

/* ==========================================================================
   DATA SPECIFICATIONS (Adapted to OrientCompanion Post-Bac Platform)
   ========================================================================== */

const PARTNER_LOGOS = [
  { name: "ENSAM", icon: <EnsamLogo /> },
  { name: "UM6P", icon: <Um6pLogo /> },
  { name: "ENCG", icon: <EncgLogo /> },
  { name: "ENSA", icon: <EnsaLogo /> },
  { name: "FMP", icon: <FmpLogo /> },
  { name: "CPGE", icon: <CpgeLogo /> },
  { name: "ISCAE", icon: <IscaeLogo /> },
  { name: "EHTP", icon: <EhtpLogo /> },
  { name: "INSEA", icon: <InseaLogo /> },
  { name: "AIAC", icon: <AiacLogo /> },
  { name: "ENA", icon: <EnaLogo /> },
  { name: "+ 30 Autres", isTextBadge: true },
];

const ACADEMIC_PROGRAMS = [
  {
    icon: <BookOpenIcon />,
    title: "Bilan Psychométrique RIASEC",
    desc: "Une cartographie scientifique de vos aptitudes et motivations professionnelles selon le modèle officiel de John Holland.",
  },
  {
    icon: <SpeedometerIcon />,
    title: "Simulateur de Seuils Concours",
    desc: "Évaluez vos probabilités d'admission en temps réel avec la formule officielle ministérielle (75% National + 25% Régional).",
  },
  {
    icon: <FeatherPenIcon />,
    title: "Stratégie de Candidature & Vœux",
    desc: "Un accompagnement sur-mesure pour ordonner vos vœux et aborder sereinement les épreuves écrites et orales de sélection.",
  },
  {
    icon: <BeakerIcon />,
    title: "Mentorat Visio 1-on-1 Direct",
    desc: "Échangez en direct avec des lauréats et étudiants aînés en cursus dans les Grandes Écoles de vos rêves pour des conseils ciblés.",
  },
];

const FACILITIES_DATA = [
  {
    title: "LABORATOIRES DE RECHERCHE",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    className: "facility-science",
  },
  {
    title: "MÉDIATHÈQUES & BIBLIOTHÈQUES",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    className: "facility-library",
  },
  {
    title: "COMPLEXES SPORTIFS OLYMPIQUES",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    className: "facility-sports",
  },
  {
    title: "ESPACES DE COWORKING & CLUBS",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    className: "facility-corner",
  },
  {
    title: "CENTRES INFORMATIQUES & IA",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    className: "facility-computer",
  },
  {
    title: "PARCS & CAMPUS D'EXCELLENCE",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    className: "facility-park",
  },
];

const ACHIEVEMENTS_DATA = [
  {
    award: "Major du Concours National ENSAM Casablanca",
    name: "Amine Benali - Promotion 2025",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
  },
  {
    award: "Bourse d'Excellence UM6P School of CS",
    name: "Salma Tazi - Promotion 2025",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
  },
  {
    award: "1er Prix National Olympiades de Mathématiques",
    name: "Yassine Mansouri - Promotion 2024",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    award: "Admise Concours Médecine FMP Rabat (Mention TB)",
    name: "Kenza Chraibi - Promotion 2024",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  },
  {
    award: "Admission CPGE MPSI vers Concours Grandes Écoles",
    name: "Mehdi Berrada - Promotion 2023",
    badgeNumber: "19.42 / 20",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
];

const TESTIMONIALS_DATA = [
  {
    name: "Youssef El Alami",
    cohort: "ENSAM Casablanca • Génie Informatique",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    text: "OrientCompanion m'a permis de canaliser mon profil RIASEC vers le génie informatique. Les simulations de seuils et les astuces partagées par mon mentor ont été déterminantes pour réussir les épreuves écrites de l'ENSAM.",
  },
  {
    name: "Nour Benjelloun",
    cohort: "UM6P Benguerir • CS & Data Science",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    text: "J'hésitais entre plusieurs filières d'ingénierie d'excellence. Le bilan m'a donné des certitudes objectives et le mentorat m'a préparée avec brio aux entretiens de sélection de l'UM6P et à l'obtention de ma bourse.",
  },
  {
    name: "Karim Idrissi",
    cohort: "ENCG Settat • Finance & Audit",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    text: "Un outil indispensable pour tout bachelier ambitieux. Grâce au suivi régulier des seuils et à la préparation au test TAFEM, j'ai abordé les concours avec une sérénité totale et intégré mon premier vœu.",
  },
];

const NEWS_FEATURED = [
  {
    date: "2026-05-15",
    title: "Ouverture des Inscriptions aux Concours Nationaux d'Ingénierie",
    excerpt: "Consultez le calendrier ministériel officiel, les seuils indicatifs 2026 et les modalités d'admission pour les réseaux ENSAM et ENSA.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
  },
  {
    date: "2026-04-28",
    title: "UM6P : Nouveaux Programmes en Intelligence Artificielle & Green Tech",
    excerpt: "L'université d'élite dévoile ses nouvelles filières post-bac et son programme d'attribution des bourses d'excellence au mérite.",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80",
  },
];

const NEWS_RECENT = [
  {
    date: "2026-04-10",
    title: "Guide Pratique : Réussir les Concours des Facultés de Médecine (FMP)",
    excerpt: "Méthodologie détaillée pour aborder les QCM scientifiques décentralisés et optimiser votre gestion du temps d'épreuve.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
  },
  {
    date: "2026-03-22",
    title: "Webinaire Exclusif : Choisir entre CPGE et Prépa Intégrée",
    excerpt: "Nos lauréats mentors comparent les rythmes de travail, les perspectives de double diplôme et les débouchés professionnels.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
  },
  {
    date: "2026-03-05",
    title: "Publication de l'Observatoire des Seuils Post-Bac (2022-2025)",
    excerpt: "Analyse rétrospective des notes minimales d'admissibilité par filière de baccalauréat (Sciences Maths, PC, SVT, Éco).",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80",
  },
];

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function OrientLandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("orient_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("orient_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const [activeTestimonialDot, setActiveTestimonialDot] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdmissionsModal, setShowAdmissionsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  const handleNav = (target) => {
    setMobileMenuOpen(false);
    if (target === "admissions") {
      navigate("/assessment");
    } else if (target === "login") {
      navigate("/login");
    } else if (target === "register") {
      navigate("/register");
    } else if (target === "assessment") {
      navigate("/assessment");
    } else if (target === "recommendations") {
      navigate("/recommendations");
    } else if (target === "mentorship") {
      navigate("/mentorship");
    } else if (target.startsWith("#")) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="dribbble-landing-root" data-theme={theme}>

      {/* ====================================================================
          TOP NAVBAR
          ==================================================================== */}
      <header className="dribbble-navbar">
        <div className="dribbble-nav-container">

          {/* BRAND LOGO */}
          <div className="dribbble-brand" onClick={() => handleNav("#hero")}>
            <div className="dribbble-brand-symbol">
              <SchoolLogoIcon />
            </div>
            <div className="dribbble-brand-text">
              <span className="dribbble-brand-name">OrientCompanion</span>
              <span className="dribbble-brand-sub">Post-Bac & Concours</span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION LINKS */}
          <nav className="dribbble-nav-links">
            <a href="#about" onClick={(e) => { e.preventDefault(); handleNav("#about"); }}>Bilan RIASEC</a>
            <a href="#programmes" onClick={(e) => { e.preventDefault(); handleNav("#programmes"); }}>Simulateur</a>
            <a href="#ecoles" onClick={(e) => { e.preventDefault(); handleNav("#ecoles"); }}>Grandes Écoles</a>
            <a href="#campus" onClick={(e) => { e.preventDefault(); handleNav("#campus"); }}>Campus & Vie</a>
            <a href="#laureats" onClick={(e) => { e.preventDefault(); handleNav("#laureats"); }}>Mentorat</a>
            <a href="#actualites" onClick={(e) => { e.preventDefault(); handleNav("#actualites"); }}>Actualités</a>
          </nav>

          {/* ACTIONS: THEME TOGGLE & AUTH */}
          <div className="dribbble-nav-actions">
            <button
              className="dribbble-theme-toggle"
              onClick={toggleTheme}
              title={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
              aria-label="Changer le thème"
            >
              {theme === "light" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>

            <button
              className="dribbble-btn-text"
              onClick={() => handleNav("login")}
            >
              Connexion
            </button>

            <button
              className="dribbble-btn-pill-dark"
              onClick={() => handleNav("admissions")}
            >
              <span>Lancer le Bilan</span>
              <ArrowRightIcon />
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              className="dribbble-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu de navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="dribbble-mobile-menu">
            <a href="#about" onClick={() => handleNav("#about")}>Bilan RIASEC</a>
            <a href="#programmes" onClick={() => handleNav("#programmes")}>Simulateur & Seuils</a>
            <a href="#ecoles" onClick={() => handleNav("#ecoles")}>Grandes Écoles</a>
            <a href="#campus" onClick={() => handleNav("#campus")}>Campus & Vie</a>
            <a href="#laureats" onClick={() => handleNav("#laureats")}>Mentorat</a>
            <a href="#actualites" onClick={() => handleNav("#actualites")}>Actualités Concours</a>
            <div className="dribbble-mobile-actions">
              <button className="dribbble-btn-outline w-full" onClick={() => handleNav("login")}>Se connecter</button>
              <button className="dribbble-btn-pill-dark w-full" onClick={() => handleNav("admissions")}>Lancer le Bilan RIASEC</button>
            </div>
          </div>
        )}
      </header>

      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <section className="dribbble-hero-section" id="hero">
        <div className="dribbble-container">

          {/* TOP ASYMMETRIC ROW */}
          <div className="dribbble-hero-top-grid">
            <div className="dribbble-hero-title-col">
              <h1 className="dribbble-hero-headline">
                Révélez votre vocation et conquérez les meilleures Grandes Écoles
              </h1>
            </div>

            <div className="dribbble-hero-desc-col">
              <p className="dribbble-hero-paragraph">
                Notre plateforme d'orientation intelligente accompagne les lycéens et bacheliers vers la réussite de leur projet post-bac. Bilan psychométrique RIASEC guidé par l'IA, anticipation des seuils ministériels et mentorat avec des lauréats.
              </p>
              <div className="dribbble-hero-btn-wrap">
                <button
                  className="dribbble-btn-pill-dark hero-btn"
                  onClick={() => setShowAdmissionsModal(true)}
                >
                  <span>Consulter les Seuils 2026</span>
                  <ArrowUpRightIcon />
                </button>
              </div>
            </div>
          </div>

          {/* LARGE HERO ARCHITECTURAL PHOTO */}
          <div className="dribbble-hero-banner-wrap">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=85"
              alt="Campus Universitaire d'Excellence au Maroc"
              className="dribbble-hero-banner-img"
              loading="eager"
            />
          </div>

        </div>
      </section>

      {/* ====================================================================
          ABOUT SECTION WITH SIGNATURE BLUE PIXEL / MOSAIC PATTERN
          ==================================================================== */}
      <section className="dribbble-about-section" id="about">

        {/* GEOMETRIC MOSAIC / PIXEL BLOCKS (App Accent Blue) */}
        <div className="mosaic-accent-grid" aria-hidden="true">
          {/* Top Right Cluster */}
          <div className="mosaic-box mb-tr-1" />
          <div className="mosaic-box mb-tr-2" />
          <div className="mosaic-box mb-tr-3" />
          <div className="mosaic-box mb-tr-4" />
          <div className="mosaic-box mb-tr-5" />
          <div className="mosaic-box mb-tr-6" />
          <div className="mosaic-box mb-tr-7" />

          {/* Left Mid/Lower Cluster */}
          <div className="mosaic-box mb-ml-1" />
          <div className="mosaic-box mb-ml-2" />
          <div className="mosaic-box mb-ml-3" />
          <div className="mosaic-box mb-ml-4" />
          <div className="mosaic-box mb-ml-5" />
          <div className="mosaic-box mb-ml-6" />
          <div className="mosaic-box mb-ml-7" />
          <div className="mosaic-box mb-ml-8" />
        </div>

        <div className="dribbble-container about-inner-container">

          <div className="about-label-row">
            <span className="dribbble-section-tag">NOTRE MISSION</span>
          </div>

          {/* MANIFESTO STATEMENT WITH EMPHASIZED KEYWORDS */}
          <h2 className="about-manifesto-text">
            Fondée pour démocratiser l'excellence, <span className="highlight-text">OrientCompanion</span> est la plateforme dédiée à <span className="highlight-text">l'orientation post-bac</span>, combinant le <span className="highlight-text">bilan psychométrique RIASEC</span>, la simulation des concours et le <span className="highlight-text">mentorat personnalisé</span> pour guider chaque <span className="highlight-text">élève</span> vers son plein potentiel.
          </h2>

          {/* 4 STATS CARDS (CARD 1 IS SOLID APP BLUE) */}
          <div className="about-stats-grid">

            {/* Solid Accent Card */}
            <div className="stat-card-solid-blue">
              <h3 className="stat-card-title">+4 500<br />Bacheliers Orientés</h3>
              <p className="stat-card-desc">Accompagnement certifié vers l'excellence</p>
            </div>

            {/* Standard Stat Card 2 */}
            <div className="stat-card-standard">
              <h3 className="stat-card-title">+120 Écoles<br />Référencées</h3>
              <p className="stat-card-desc">ENSAM, UM6P, ENCG, FMP, ENSA, CPGE...</p>
            </div>

            {/* Standard Stat Card 3 */}
            <div className="stat-card-standard">
              <h3 className="stat-card-title">98.4% Taux<br />de Satisfaction</h3>
              <p className="stat-card-desc">Évaluations lycéens et conseillers certifiés</p>
            </div>

            {/* Standard Stat Card 4 */}
            <div className="stat-card-standard">
              <h3 className="stat-card-title">+450 Lauréats<br />Mentors Actifs</h3>
              <p className="stat-card-desc">Étudiants aînés mobilisés en visioconférence</p>
            </div>

          </div>

        </div>
      </section>

      {/* ====================================================================
          UNIVERSITY ADMISSIONS / PARTNER LOGOS GRID
          ==================================================================== */}
      <section className="dribbble-partners-section" id="ecoles">
        <div className="dribbble-container">

          <div className="partners-title-wrap">
            <span className="partners-subheading">NOS ÉLÈVES SONT ADMIS DANS LES PLUS GRANDES ÉCOLES</span>
          </div>

          <div className="partners-logo-grid">
            {PARTNER_LOGOS.map((item, idx) => (
              <div key={idx} className={`partner-logo-cell ${item.isTextBadge ? "partner-cell-badge" : ""}`}>
                {item.isTextBadge ? (
                  <span className="partner-more-text">{item.name}</span>
                ) : (
                  <div className="partner-logo-inner">
                    <span className="partner-logo-icon">{item.icon}</span>
                    <span className="partner-logo-name">{item.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          ACADEMIC PROGRAM EXCELLENCE (Piliers d'Accompagnement)
          ==================================================================== */}
      <section className="dribbble-academic-section" id="programmes">
        <div className="dribbble-container">

          {/* HEADER ROW */}
          <div className="academic-header-grid">
            <h2 className="academic-headline">
              Piliers Fondamentaux<br />de Votre Réussite
            </h2>
            <p className="academic-subtext">
              Un écosystème méthodologique complet conçu pour transformer le doute en stratégie d'admission gagnante dans les filières d'élite.
            </p>
          </div>

          {/* 4 CARDS ROW */}
          <div className="academic-cards-grid">
            {ACADEMIC_PROGRAMS.map((prog, idx) => (
              <div key={idx} className="academic-program-card">
                <div className="academic-card-icon">
                  {prog.icon}
                </div>
                <h3 className="academic-card-title">{prog.title}</h3>
                <p className="academic-card-desc">{prog.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          SCHOOL FACILITIES (Campus & Infrastructures d'Élite)
          ==================================================================== */}
      <section className="dribbble-facilities-section" id="campus">
        <div className="dribbble-container">

          <div className="facilities-header">
            <h2 className="facilities-headline">
              Vie de Campus &<br />Infrastructures d'Élite
            </h2>
          </div>

          {/* BENTO GRID OF HIGH QUALITY ARCHITECTURE & AMENITIES */}
          <div className="facilities-bento-grid">

            <div className="facility-card science-lab">
              <div className="facility-img-wrap">
                <img
                  src={FACILITIES_DATA[0].image}
                  alt={FACILITIES_DATA[0].title}
                  className="facility-photo"
                  loading="lazy"
                />
              </div>
              <span className="facility-caption">{FACILITIES_DATA[0].title}</span>
            </div>

            <div className="facility-card library">
              <div className="facility-img-wrap">
                <img
                  src={FACILITIES_DATA[1].image}
                  alt={FACILITIES_DATA[1].title}
                  className="facility-photo"
                  loading="lazy"
                />
              </div>
              <span className="facility-caption">{FACILITIES_DATA[1].title}</span>
            </div>

            <div className="facility-card sports-area">
              <div className="facility-img-wrap">
                <img
                  src={FACILITIES_DATA[2].image}
                  alt={FACILITIES_DATA[2].title}
                  className="facility-photo"
                  loading="lazy"
                />
              </div>
              <span className="facility-caption">{FACILITIES_DATA[2].title}</span>
            </div>

            <div className="facility-card student-corner">
              <div className="facility-img-wrap">
                <img
                  src={FACILITIES_DATA[3].image}
                  alt={FACILITIES_DATA[3].title}
                  className="facility-photo"
                  loading="lazy"
                />
              </div>
              <span className="facility-caption">{FACILITIES_DATA[3].title}</span>
            </div>

            <div className="facility-card computer-lab">
              <div className="facility-img-wrap">
                <img
                  src={FACILITIES_DATA[4].image}
                  alt={FACILITIES_DATA[4].title}
                  className="facility-photo"
                  loading="lazy"
                />
              </div>
              <span className="facility-caption">{FACILITIES_DATA[4].title}</span>
            </div>

            <div className="facility-card campus-park">
              <div className="facility-img-wrap">
                <img
                  src={FACILITIES_DATA[5].image}
                  alt={FACILITIES_DATA[5].title}
                  className="facility-photo"
                  loading="lazy"
                />
              </div>
              <span className="facility-caption">{FACILITIES_DATA[5].title}</span>
            </div>

          </div>

        </div>
      </section>

      {/* ====================================================================
          OUR PROUD STUDENTS' ACHIEVEMENTS (Nos Lauréats & Fiertés)
          ==================================================================== */}
      <section className="dribbble-achievements-section" id="laureats">
        <div className="dribbble-container">

          <div className="achievements-header">
            <h2 className="achievements-headline">
              Les Réussites Remarquables de Nos Élèves
            </h2>
          </div>

          {/* 5 AWARDS PORTRAIT CARDS */}
          <div className="achievements-cards-grid">
            {ACHIEVEMENTS_DATA.map((item, idx) => (
              <div key={idx} className="achievement-card">
                <div className="achievement-photo-frame">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="achievement-photo"
                    loading="lazy"
                  />
                  {item.badgeNumber && (
                    <div className="achievement-timer-overlay">
                      {item.badgeNumber}
                    </div>
                  )}
                </div>
                <div className="achievement-info">
                  <h4 className="achievement-award-title">{item.award}</h4>
                  <p className="achievement-student-meta">{item.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="achievements-btn-wrap">
            <button
              className="dribbble-btn-outline-pill"
              onClick={() => setShowAchievementsModal(true)}
            >
              Découvrir le Palmarès des Admis
            </button>
          </div>

        </div>
      </section>

      {/* ====================================================================
          GRADUATE PERSPECTIVES (Retours d'Expérience)
          ==================================================================== */}
      <section className="dribbble-perspectives-section">
        <div className="dribbble-container">

          <div className="perspectives-header-grid">
            <h2 className="perspectives-headline">
              Perspectives des<br />Lauréats & Mentors
            </h2>
            <div className="perspectives-right-col">
              <p className="perspectives-subtext">
                Découvrez comment nos mentors et anciens bacheliers ont concrétisé leurs ambitions dans les meilleures écoles.
              </p>
              <button
                className="dribbble-btn-outline-pill"
                onClick={() => handleNav("mentorship")}
              >
                Réserver une Séance de Mentorat
              </button>
            </div>
          </div>

          {/* 3 TESTIMONIAL CARDS */}
          <div className="perspectives-cards-grid">
            {TESTIMONIALS_DATA.map((item, idx) => (
              <div key={idx} className="perspective-card">
                <div className="perspective-card-top">
                  <div className="perspective-author">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="perspective-avatar"
                      loading="lazy"
                    />
                    <div className="perspective-author-info">
                      <h4 className="perspective-author-name">{item.name}</h4>
                      <span className="perspective-author-cohort">{item.cohort}</span>
                    </div>
                  </div>
                </div>

                <div className="perspective-body">
                  <p className="perspective-text">{item.text}</p>
                  <div className="perspective-quote-icon">
                    <QuoteWatermarkIcon />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CAROUSEL DOT INDICATORS */}
          <div className="perspectives-carousel-dots">
            {[0, 1, 2].map((dot) => (
              <button
                key={dot}
                className={`carousel-dot ${activeTestimonialDot === dot ? "active" : ""}`}
                onClick={() => setActiveTestimonialDot(dot)}
                aria-label={`Témoignage ${dot + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          LATEST NEWS (Actualités Concours & Formations)
          ==================================================================== */}
      <section className="dribbble-news-section" id="actualites">
        <div className="dribbble-container">

          <div className="news-header-row">
            <h2 className="news-headline">Actualités Concours & Formations</h2>
            <button
              className="dribbble-link-action"
              onClick={() => handleNav("recommendations")}
            >
              <span>Voir Toutes les Actualités</span>
            </button>
          </div>

          {/* TOP 2 FEATURED NEWS CARDS */}
          <div className="news-featured-grid">
            {/* Featured Card 1: Full-height image with dark text overlay */}
            <div className="news-card-featured-overlay">
              <img
                src={NEWS_FEATURED[0].image}
                alt={NEWS_FEATURED[0].title}
                className="news-featured-photo"
                loading="lazy"
              />
              <div className="news-featured-gradient-overlay" />
              <div className="news-featured-overlay-content">
                <span className="news-date-badge date-light">{NEWS_FEATURED[0].date}</span>
                <h3 className="news-featured-title text-light">{NEWS_FEATURED[0].title}</h3>
                <p className="news-featured-excerpt text-light-dim">{NEWS_FEATURED[0].excerpt}</p>
              </div>
            </div>

            {/* Featured Card 2: Image on top, text underneath */}
            <div className="news-card-featured-standard">
              <div className="news-featured-img-top-wrap">
                <img
                  src={NEWS_FEATURED[1].image}
                  alt={NEWS_FEATURED[1].title}
                  className="news-featured-photo"
                  loading="lazy"
                />
              </div>
              <div className="news-featured-standard-content">
                <span className="news-date-badge">{NEWS_FEATURED[1].date}</span>
                <h3 className="news-featured-title text-dark">{NEWS_FEATURED[1].title}</h3>
                <p className="news-featured-excerpt text-dim">{NEWS_FEATURED[1].excerpt}</p>
              </div>
            </div>
          </div>

          {/* BOTTOM 3 NEWS CARDS */}
          <div className="news-recent-grid">
            {NEWS_RECENT.map((item, idx) => (
              <div key={idx} className="news-card-recent">
                <div className="news-recent-img-wrap">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="news-recent-photo"
                    loading="lazy"
                  />
                </div>
                <div className="news-recent-content">
                  <span className="news-date-badge dark-mode-date">{item.date}</span>
                  <h4 className="news-recent-title">{item.title}</h4>
                  <p className="news-recent-excerpt">{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          FOOTER (Matching Dribbble Layout & App Colors)
          ==================================================================== */}
      <footer className="dribbble-footer" id="contact">
        <div className="dribbble-container">

          <div className="dribbble-footer-main-grid">

            {/* COLUMN 1: MISSION STATEMENT & SOCIAL ICONS */}
            <div className="footer-col-mission">
              <h3 className="footer-mission-text">
                OrientCompanion s'engage à accompagner chaque bachelier vers l'épanouissement académique, le discernement vocationnel et la réussite des concours d'excellence.
              </h3>
              <div className="footer-social-row">
                <a href="#linkedin" aria-label="LinkedIn" className="footer-social-circle"><LinkedInIcon /></a>
                <a href="#instagram" aria-label="Instagram" className="footer-social-circle"><InstagramIcon /></a>
                <a href="#facebook" aria-label="Facebook" className="footer-social-circle"><FacebookIcon /></a>
                <a href="#twitter" aria-label="X" className="footer-social-circle"><XTwitterIcon /></a>
                <a href="#youtube" aria-label="YouTube" className="footer-social-circle"><YouTubeIcon /></a>
              </div>
            </div>

            {/* COLUMN 2: NAVIGATION LINKS */}
            <div className="footer-col-nav">
              <span className="footer-col-heading">NAVIGATION</span>
              <ul className="footer-links-list">
                <li><a href="#about" onClick={(e) => { e.preventDefault(); handleNav("#about"); }}>Bilan RIASEC</a></li>
                <li><a href="#programmes" onClick={(e) => { e.preventDefault(); handleNav("#programmes"); }}>Simulateur de Seuils</a></li>
                <li><a href="#ecoles" onClick={(e) => { e.preventDefault(); handleNav("#ecoles"); }}>Grandes Écoles & Cursus</a></li>
                <li><a href="#campus" onClick={(e) => { e.preventDefault(); handleNav("#campus"); }}>Campus & Infrastructures</a></li>
                <li><a href="#laureats" onClick={(e) => { e.preventDefault(); handleNav("#laureats"); }}>Mentorat avec des Lauréats</a></li>
              </ul>
            </div>

            {/* COLUMN 3: CONTACT INFORMATION */}
            <div className="footer-col-contact">
              <span className="footer-col-heading">CONTACT</span>
              <div className="footer-contact-details">
                <div className="contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <a href="mailto:contact@orientcompanion.ma">contact@orientcompanion.ma</a>
                </div>
                <div className="contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>+212 5 22 98 44 00</span>
                </div>
                <div className="contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>14 Boulevard de l'Avenir, Quartier Anfa, Casablanca, Maroc</span>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM COPYRIGHT & LEGAL BAR */}
          <div className="dribbble-footer-bottom-bar">
            <span className="footer-copy-text">© 2026 OrientCompanion. Tous droits réservés.</span>
            <div className="footer-legal-links">
              <a href="#privacy">Politique de Confidentialité</a>
              <a href="#terms">Conditions d'Utilisation</a>
            </div>
          </div>

        </div>
      </footer>

      {/* ====================================================================
          MODALS / POPUPS (Admissions & Achievements Interactive Views)
          ==================================================================== */}
      {showAdmissionsModal && (
        <div className="dribbble-modal-backdrop" onClick={() => setShowAdmissionsModal(false)}>
          <div className="dribbble-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="dribbble-modal-close" onClick={() => setShowAdmissionsModal(false)}>✕</button>
            <span className="dribbble-section-tag">POST-BAC MAROC 2026 - 2027</span>
            <h3 className="modal-title">Simulateur & Seuils d'Admission</h3>
            <p className="modal-desc">
              Anticipez vos chances d'admissibilité dans les filières d'excellence (ENSAM, UM6P, ENCG, FMP, ENSA, CPGE) grâce à la formule officielle et au bilan psychométrique.
            </p>
            <div className="modal-steps-list">
              <div className="modal-step">
                <span className="step-num">1</span>
                <div>
                  <strong>Bilan Psychométrique RIASEC (5 min)</strong>
                  <p>Déterminez vos 3 dimensions dominantes Holland avec notre conseiller IA conversationnel.</p>
                </div>
              </div>
              <div className="modal-step">
                <span className="step-num">2</span>
                <div>
                  <strong>Simulation avec Calcul 75/25</strong>
                  <p>Intégrez vos notes d'examen National et Régional pour comparer vos scores aux seuils 2022-2025.</p>
                </div>
              </div>
              <div className="modal-step">
                <span className="step-num">3</span>
                <div>
                  <strong>Mentorat Direct avec un Lauréat</strong>
                  <p>Réservez une séance visio avec un étudiant aîné pour des retours d'expérience authentiques.</p>
                </div>
              </div>
            </div>
            <div className="modal-actions-row">
              <button
                className="dribbble-btn-pill-dark w-full"
                onClick={() => {
                  setShowAdmissionsModal(false);
                  navigate("/assessment");
                }}
              >
                <span>Démarrer Mon Évaluation Gratuite</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {showAchievementsModal && (
        <div className="dribbble-modal-backdrop" onClick={() => setShowAchievementsModal(false)}>
          <div className="dribbble-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="dribbble-modal-close" onClick={() => setShowAchievementsModal(false)}>✕</button>
            <span className="dribbble-section-tag">PALMARÈS DES ADMISSIONS</span>
            <h3 className="modal-title">Les Succès de Nos Élèves</h3>
            <p className="modal-desc">
              Chaque année, plus de 98% des bacheliers accompagnés intègrent l'un de leurs trois premiers vœux dans les plus grandes écoles d'ingénieurs, de commerce et de médecine.
            </p>
            <div className="modal-achievements-list">
              <div className="achieve-row">
                <span className="achieve-badge gold">Major</span>
                <div>
                  <strong>ENSAM Casablanca • Génie Informatique</strong>
                  <p>Amine Benali - 1ère place au concours écrit et oral 2025</p>
                </div>
              </div>
              <div className="achieve-row">
                <span className="achieve-badge gold">Bourse</span>
                <div>
                  <strong>UM6P Benguerir • School of Computer Science</strong>
                  <p>Salma Tazi - Attribution de la Bourse d'Excellence Fondation 100%</p>
                </div>
              </div>
              <div className="achieve-row">
                <span className="achieve-badge silver">Top 5</span>
                <div>
                  <strong>Concours Commun TAFEM ENCG</strong>
                  <p>Yassine Mansouri - Rang 4 national sur plus de 18 000 candidats</p>
                </div>
              </div>
            </div>
            <div className="modal-actions-row">
              <button
                className="dribbble-btn-pill-dark w-full"
                onClick={() => setShowAchievementsModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
