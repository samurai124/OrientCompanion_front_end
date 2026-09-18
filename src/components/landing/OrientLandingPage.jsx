import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./OrientLandingPage.css";

const BrandLogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
    <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
    <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
    <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
    <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const RIASEC_DIMENSIONS = [
  {
    key: "I",
    name: "Investigateur",
    icon: "🔬",
    subtitle: "Analytique, Scientifique & Curieux",
    score: 92,
    desc: "Vous aimez comprendre les lois régissant les phénomènes, résoudre des énigmes mathématiques et concevoir des modèles abstraits pour percer des problèmes complexes.",
    strengths: ["Raisonnement logique", "Esprit critique", "Curiosité scientifique", "Rigueur d'analyse"],
    careers: ["Data Scientist", "Ingénieur R&D IA", "Chercheur en Biotechnologie", "Médecin Spécialiste"],
    schools: ["UM6P Benguerir (CS)", "CPGE (MPSI / PCSI)", "FMP Médecine", "ENSA Réseau Informatique"],
    sampleQuestion: "« Aimez-vous modéliser mathématiquement un problème complexe avant de programmer sa solution ? »",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80"
  },
  {
    key: "R",
    name: "Réaliste",
    icon: "⚙️",
    subtitle: "Pratique, Technique & Concret",
    score: 84,
    desc: "Vous privilégiez l'action directe, l'expérimentation matérielle, les systèmes mécaniques, la robotique et les technologies industrielles appliquées.",
    strengths: ["Pragmatisme", "Sens spatial", "Ingéniosité technique", "Habileté opératoire"],
    careers: ["Ingénieur Aéronautique", "Roboticien", "Chef de Projet BTP", "Architecte Systèmes Embarqués"],
    schools: ["ENSAM Casablanca & Meknès", "EHTP Casablanca", "AIAC Mohammed VI", "ENSA Génie Civil"],
    sampleQuestion: "« Préférez-vous concevoir un prototype physique tangible plutôt qu'étudier un concept théorique ? »",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
  },
  {
    key: "A",
    name: "Artistique",
    icon: "🎨",
    subtitle: "Créatif, Intuitif & Expressif",
    score: 68,
    desc: "Vous ressentez le besoin d'inventer de nouvelles formes, d'innover visuellement et de concevoir des expériences singulières affranchies des carcans conventionnels.",
    strengths: ["Sensibilité esthétique", "Pensée divergente", "Originalité", "Conception UI/UX"],
    careers: ["Architecte DPLG", "Directeur Artistique", "Designer Produit", "Concepteur Multimédia"],
    schools: ["ENA Rabat (Architecture)", "ESAV Marrakech", "Beaux-Arts Casablanca", "Artcom' Sup"],
    sampleQuestion: "« Accordez-vous une importance primordiale à l'émotion visuelle et à l'harmonie des formes dans un projet ? »",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80"
  },
  {
    key: "S",
    name: "Social",
    icon: "🤝",
    subtitle: "Humain, Empathique & Pédagogue",
    score: 74,
    desc: "Votre motivation profonde réside dans l'entraide, le soin, l'enseignement, le conseil et le développement du potentiel humain et collectif.",
    strengths: ["Intelligence relationnelle", "Écoute active", "Pédagogie", "Accompagnement d'équipe"],
    careers: ["Médecin / Chirurgien", "Pharmacien Clinicien", "Consultant RH & Coaching", "Professeur Agrégé"],
    schools: ["FMP / FMD (Facultés de Médecine)", "ISPITS Santé", "ENS Rabat", "Facultés des Sciences de l'Éducation"],
    sampleQuestion: "« Trouveriez-vous un sens profond à guider, écouter et soigner des personnes au quotidien ? »",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80"
  },
  {
    key: "E",
    name: "Entreprenant",
    icon: "⚡",
    subtitle: "Leader, Stratège & Décideur",
    score: 79,
    desc: "Vous êtes animé par le sens du défi, la négociation commerciale, la conduite d'équipes et la création de valeur à fort impact économique.",
    strengths: ["Leadership naturel", "Persuasion & Éloquence", "Esprit d'initiative", "Gestion des risques"],
    careers: ["Fondateur de Startup", "Directeur Financier", "Consultant en Stratégie", "Product Manager Tech"],
    schools: ["ISCAE Casablanca", "Réseau ENCG (Settat, Casa...)", "ESCA Business School", "HEM Rabat"],
    sampleQuestion: "« Aimez-vous piloter un projet collectif ambitieux et négocier avec des partenaires exigeants ? »",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80"
  },
  {
    key: "C",
    name: "Conventionnel",
    icon: "📋",
    subtitle: "Méthodique, Structuré & Fiable",
    score: 71,
    desc: "Vous appréciez l'organisation méthodique, le respect rigoureux des normes, la vérification chiffrée et la gouvernance de flux d'informations.",
    strengths: ["Précision millimétrée", "Organisation sans faille", "Respect des protocoles", "Fiabilité totale"],
    careers: ["Auditeur Financier", "Expert-Comptable", "Data Compliance Officer", "Actuaire en Assurance"],
    schools: ["ENCG Audit & Contrôle", "FSJES Droit des Affaires", "ISCAE Finance", "INSEA Rabat"],
    sampleQuestion: "« Prenez-vous plaisir à ordonner des données complexes et traquer la moindre anomalie de calcul ? »",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80"
  }
];

const SCHOOLS_DATA = [
  {
    id: "ensam",
    name: "ENSAM Casablanca & Meknès",
    category: "ingenierie",
    categoryLabel: "Ingénierie & Tech",
    badge: "Public • Cycle Prépa Intégré",
    threshold: 15.80,
    thresholdFormula: "75% National + 25% Régional",
    details: "Maths: 14.50 • PC/SVT: 15.80",
    exam: "Écrit QCM (Maths & Physique)",
    duration: "5 ans (2 ans prépa + 3 ans ingénieur)",
    filieres: ["Génie Informatique", "Génie Mécanique", "Mécatronique", "Génie Industriel"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "um6p",
    name: "UM6P Benguerir & Rabat",
    category: "excellence",
    categoryLabel: "Universités d'Élite",
    badge: "Fondation • Bourses au Mérite",
    threshold: 16.00,
    thresholdFormula: "Dossier d'excellence + Épreuves spécifiques",
    details: "Bourses à 100% selon mérite et critères sociaux",
    exam: "Test d'admission + Entretien de personnalité",
    duration: "3 à 5 ans",
    filieres: ["School of Computer Science", "EMINES Génie Industriel", "FGSES Sciences Po"],
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "encg",
    name: "Réseau ENCG Maroc (12 Villes)",
    category: "commerce",
    categoryLabel: "Commerce & Gestion",
    badge: "Public • Réseau National",
    threshold: 13.75,
    thresholdFormula: "Selon filière Bac (Eco: 13.00, SM: 13.50, PC: 14.50)",
    details: "Moyenne pondérée TAFEM",
    exam: "Test d'Admissibilité TAFEM",
    duration: "5 ans (Master Grande École)",
    filieres: ["Audit & Contrôle", "Finance de Marché", "Marketing Digital", "Management Stratégique"],
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fmp",
    name: "FMP - Facultés de Médecine & Pharmacie",
    category: "medecine",
    categoryLabel: "Médecine & Santé",
    badge: "Public • Concours Décentralisé",
    threshold: 12.00,
    thresholdFormula: "Seuil unique national décentralisé",
    details: "Moyenne générale Bac requise pour l'écrit",
    exam: "QCM National (SVT, Physique, Chimie, Maths)",
    duration: "6 ans (Médecine) / 5 ans (Pharmacie)",
    filieres: ["Médecine Générale", "Pharmacie", "Médecine Dentaire (FMD)"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ensa",
    name: "Réseau ENSA Maroc (13 Villes)",
    category: "ingenierie",
    categoryLabel: "Ingénierie & Tech",
    badge: "Public • Réseau National",
    threshold: 14.80,
    thresholdFormula: "75% National + 25% Régional",
    details: "Seuil unique national pour tout le réseau",
    exam: "Concours commun écrit 4 épreuves",
    duration: "5 ans (Diplôme d'Ingénieur d'État)",
    filieres: ["Génie Logiciel", "Cybersécurité", "Télécoms", "IA & Big Data"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cpge",
    name: "CPGE Maroc (Classes Préparatoires)",
    category: "ingenierie",
    categoryLabel: "Grandes Écoles",
    badge: "Public • Voie d'Excellence",
    threshold: 15.50,
    thresholdFormula: "Formule ministérielle CNO (Matières phares)",
    details: "Sélection sur dossier national",
    exam: "Accès direct sur dossier -> CNC en 2e année",
    duration: "2 ans préparatoires",
    filieres: ["MPSI (Maths-Physique)", "PCSI (Physique-Chimie)", "TSI (Technologie)", "ECS / ECT"],
    image: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "iscae",
    name: "ISCAE Casablanca & Rabat",
    category: "commerce",
    categoryLabel: "Commerce d'Élite",
    badge: "Public • Grande École de Management",
    threshold: 16.50,
    thresholdFormula: "Présélection nationale Post-Bac / CPGE",
    details: "Grande École de Commerce de référence",
    exam: "Épreuves écrites rigoureuses + Grand Oral",
    duration: "3 à 5 ans",
    filieres: ["Finance d'Entreprise", "Commerce International", "Marketing & Communication"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ena",
    name: "ENA Rabat (Architecture)",
    category: "excellence",
    categoryLabel: "Architecture & Design",
    badge: "Public • Concours National",
    threshold: 16.20,
    thresholdFormula: "75% National + 25% Régional",
    details: "Seuil élevé + Épreuve de dessin et culture générale",
    exam: "Épreuves écrites + Test d'aptitude plastique",
    duration: "6 ans (Diplôme d'Architecte)",
    filieres: ["Architecture & Urbanisme", "Patrimoine & Restauration", "Design Spatial & Paysage"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  }
];

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne le bilan RIASEC avec le conseiller IA ?",
    answer: "Notre algorithme applique la méthode psychométrique officielle de John Holland (RIASEC). Lors d'un échange conversationnel guidé de 5 minutes, notre conseiller IA explore vos préférences spontanées, vos points forts scolaires et vos valeurs professionnelles pour générer votre profil dominant (ex: IRS, SEC, ERA) et cartographier les filières et métiers à plus forte affinité."
  },
  {
    question: "Les seuils de présélection affichés sont-ils officiels ?",
    answer: "Absolument. Les données de seuils (2022-2025) sont issues des communications officielles du Ministère de l'Enseignement Supérieur du Maroc et des avis des concours des réseaux ENSAM, ENSA, FMP, ENCG, CPGE, etc. Notre simulateur intègre la formule ministérielle officielle (75% National + 25% Régional)."
  },
  {
    question: "Comment réserver et se déroule une séance de mentorat ?",
    answer: "Depuis votre cockpit ou la page mentorat, vous pouvez choisir un étudiant lauréat actuellement en 3e, 4e ou 5e année dans l'école ciblée (ENSAM, UM6P, ENCG, FMP...) et réserver un créneau de visioconférence de 45 minutes pour obtenir des retours d'expérience authentiques, des astuces concours et des fiches de révision."
  },
  {
    question: "La plateforme Orient Companion est-elle gratuite ?",
    answer: "Oui, l'accès au bilan RIASEC guidé par l'IA, le simulateur de note, la consultation de l'annuaire des écoles et les indices de probabilité d'admission sont 100% gratuits pour tous les lycéens et étudiants."
  },
  {
    question: "Puis-je suivre l'avancement de plusieurs candidatures à la fois ?",
    answer: "Oui. Votre cockpit unifié vous permet d'ajouter vos écoles et filières favorites en tant que vœux prioritaires (Vœu 1, 2, 3...), d'afficher le taux d'affinité RIASEC, le statut du dossier et les dates précises des épreuves écrites et orales."
  }
];

const getSchoolEligibility = (threshold, userScore) => {
  if (typeof threshold !== "number") {
    return { type: "admissible", label: "Dossier & Concours" };
  }
  const diff = userScore - threshold;
  if (diff >= 0.3) {
    return { type: "admissible", label: `Admissible (+${diff.toFixed(2)})` };
  } else if (diff >= -0.5) {
    return { type: "warning", label: `Zone seuil (${diff.toFixed(2)})` };
  } else {
    return { type: "selective", label: `Très sélectif (${diff.toFixed(2)})` };
  }
};

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

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("orient_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const PROTECTED_PATHS = new Set([
    "/assessment", "/recommendations", "/mentorship",
    "/dashboard", "/admin/fields", "/admin/schools", "/counselor/sessions",
  ]);

  const handleNav = (target) => {
    const routeMap = {
      dashboard: "/dashboard",
      chat: "/assessment",
      test: "/assessment",
      recommendations: "/recommendations",
      recs: "/recommendations",
      landing: "/",
      home: "/",
      schools: "/admin/schools",
      school: "/admin/schools",
      fields: "/admin/fields",
      field: "/admin/fields",
      mentor: "/mentorship",
      mentorship: "/mentorship",
      login: "/login",
      register: "/register",
    };
    const path = routeMap[target] ?? "/";

    if (PROTECTED_PATHS.has(path) && !isAuthenticated) {
      navigate("/login", { state: { from: { pathname: path } } });
      return;
    }
    navigate(path);
  };

  const [activeRiasec, setActiveRiasec] = useState("I");
  const [nationalGrade, setNationalGrade] = useState(16.5);
  const [regionalGrade, setRegionalGrade] = useState(15.0);
  const [schoolCategory, setSchoolCategory] = useState("all");
  const [activeCockpitTab, setActiveCockpitTab] = useState("candidatures");
  const [selectedSchool, setSelectedSchool] = useState("ensam");
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const simulatedScore = Number((nationalGrade * 0.75 + regionalGrade * 0.25).toFixed(2));
  const currentRiasec = RIASEC_DIMENSIONS.find((d) => d.key === activeRiasec) || RIASEC_DIMENSIONS[0];
  const filteredSchools = schoolCategory === "all"
    ? SCHOOLS_DATA
    : SCHOOLS_DATA.filter((s) => s.category === schoolCategory);

  const schoolDetails = {
    ensam: {
      name: "ENSAM Casablanca",
      sub: "Génie Informatique & Systèmes Mécaniques",
      threshold: "Seuil 2025 : 15.80 / 20",
      match: "96.8% Affinité",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
      stats: [
        { label: "Maths", value: "17.5", pct: "88%" },
        { label: "Physique", value: "16.0", pct: "80%" },
        { label: "Informatique", value: "18.5", pct: "93%" },
        { label: "Français", value: "15.0", pct: "75%" },
        { label: "Anglais", value: "17.0", pct: "85%" }
      ]
    },
    um6p: {
      name: "UM6P Benguerir",
      sub: "School of Computer Science & EMINES",
      threshold: "Sélection dossier & concours spécifique",
      match: "94.2% Affinité",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
      stats: [
        { label: "Maths", value: "18.0", pct: "90%" },
        { label: "Physique", value: "15.5", pct: "78%" },
        { label: "Informatique", value: "19.0", pct: "95%" },
        { label: "Français", value: "16.5", pct: "83%" },
        { label: "Anglais", value: "18.0", pct: "90%" }
      ]
    },
    encg: {
      name: "ENCG Settat",
      sub: "Gestion, Audit & Finance de Marché",
      threshold: "Concours TAFEM : Seuil 14.50",
      match: "91.5% Affinité",
      image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
      stats: [
        { label: "Maths", value: "15.5", pct: "78%" },
        { label: "Économie", value: "17.5", pct: "88%" },
        { label: "Français", value: "16.0", pct: "80%" },
        { label: "Anglais", value: "17.0", pct: "85%" },
        { label: "Philosophie", value: "14.5", pct: "73%" }
      ]
    }
  };

  return (
    <div className="shadcn-root" data-theme={theme}>

      <div className="shadcn-dot-pattern" aria-hidden="true" />

      <header className="shadcn-navbar">
        <div className="shadcn-nav-container">
          <div className="shadcn-nav-brand" onClick={() => handleNav("landing")}>
            <div className="shadcn-brand-icon">
              <BrandLogoIcon />
            </div>
            <span className="shadcn-brand-name">Orient Companion</span>
          </div>

          <nav className="shadcn-nav-menu">
            <a href="#bilan" className="shadcn-nav-link">Bilan RIASEC</a>
            <a href="#seuils" className="shadcn-nav-link">Écoles & Seuils</a>
            <a href="#compatibilite" className="shadcn-nav-link">Compatibilité</a>
            <a href="#campus-life" className="shadcn-nav-link">Vie de Campus</a>
            <a href="#tableau-de-bord" className="shadcn-nav-link">Cockpit Étudiant</a>
            <a href="#faq" className="shadcn-nav-link">FAQ</a>
          </nav>

          <div className="shadcn-nav-actions">
            <button
              className="ui-btn ui-btn-outline ui-btn-icon"
              onClick={toggleTheme}
              title={theme === "light" ? "Mode sombre" : "Mode clair"}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              className="ui-btn ui-btn-ghost ui-btn-sm"
              onClick={() => handleNav("login")}
            >
              Se connecter
            </button>

            <button
              className="ui-btn ui-btn-default ui-btn-sm"
              onClick={() => handleNav("chat")}
            >
              <span>Lancer l'IA</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <section className="shadcn-hero-section">
        <div className="shadcn-hero-content">
          <div className="ui-badge ui-badge-secondary shadcn-hero-badge" onClick={() => handleNav("chat")}>
            <span className="shadcn-pulse-dot" />
            <span>Orientation Post-Bac & Concours 2026 au Maroc</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>

          <h1 className="shadcn-hero-title">
            Révélez Votre Vocation.<br />
            Conquérez les Meilleures Écoles.
          </h1>

          <p className="shadcn-hero-subtitle">
            Lycéens et étudiants : maximisez vos chances d'admission grâce au bilan psychométrique RIASEC
            guidé par l'IA, explorez les campus d'excellence et anticipez les seuils de concours 2026.
          </p>

          <div className="shadcn-hero-cta-group">
            <button
              className="ui-btn ui-btn-default ui-btn-lg"
              onClick={() => handleNav("chat")}
            >
              <span>Passer le Bilan RIASEC Gratuit</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button
              className="ui-btn ui-btn-outline ui-btn-lg"
              onClick={() => handleNav("recommendations")}
            >
              Explorer les Écoles Partenaires
            </button>
          </div>

          <div className="shadcn-trust-pills">
            <span>✓ +4,500 lycéens orientés</span>
            <span className="dot-sep">•</span>
            <span>✓ Seuils officiels certifiés</span>
            <span className="dot-sep">•</span>
            <span>✓ Conseiller IA disponible 24/7</span>
          </div>
        </div>
      </section>

      <div className="shadcn-container" id="apercu">
        <div className="shadcn-hero-frame">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85"
            alt="Campus universitaire et étudiants en réussite"
            className="shadcn-hero-banner-img"
          />
          <div className="shadcn-hero-banner-overlay" />

          <div className="shadcn-hero-frame-body">
            <div className="ui-badge ui-badge-secondary mb-3">
              <span>Plateforme Nationale d'Orientation Augmentée</span>
            </div>
            <h2 className="shadcn-banner-headline">
              L'excellence académique marocaine à votre portée
            </h2>
            <p className="shadcn-banner-caption">
              Du bilan psychométrique Holland RIASEC jusqu'aux concours finaux : des données fiables,
              un accompagnement d'experts et des sessions de mentorat en direct.
            </p>

            <div className="shadcn-frame-stats-row">
              <div className="shadcn-stat-box">
                <span className="shadcn-stat-val">+120</span>
                <span className="shadcn-stat-sub">Grandes Écoles Référencées</span>
              </div>
              <div className="shadcn-stat-sep" />
              <div className="shadcn-stat-box">
                <span className="shadcn-stat-val">98.4%</span>
                <span className="shadcn-stat-sub">Taux d'Admission Ciblé</span>
              </div>
              <div className="shadcn-stat-sep" />
              <div className="shadcn-stat-box">
                <span className="shadcn-stat-val">24/7</span>
                <span className="shadcn-stat-sub">Conseiller IA Conversationnel</span>
              </div>
              <div className="shadcn-stat-sep" />
              <div className="shadcn-stat-box">
                <span className="shadcn-stat-val">4.98/5</span>
                <span className="shadcn-stat-sub">Note Moyenne Mentorat</span>
              </div>
            </div>
          </div>

          <div className="shadcn-glass-card glass-pos-tr">
            <div className="shadcn-glass-icon">🏛️</div>
            <div className="shadcn-glass-info">
              <strong>ENSAM Casablanca</strong>
              <span className="text-emerald-500">Affinité 96.8% • Admissible</span>
            </div>
          </div>

          <div className="shadcn-glass-card glass-pos-bl">
            <div className="shadcn-glass-icon">⭐</div>
            <div className="shadcn-glass-info">
              <strong>Mentorat 1-on-1 Direct</strong>
              <span>+450 lauréats disponibles</span>
            </div>
          </div>
        </div>

        <div className="shadcn-trio-grid">
          <div className="ui-card ui-card-hover shadcn-trio-card" onClick={() => handleNav("chat")}>
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
              alt="Conseiller IA RIASEC"
              className="shadcn-card-img-bg"
            />
            <div className="shadcn-card-scrim" />
            <div className="shadcn-card-overlay-content">
              <span className="ui-badge ui-badge-secondary w-fit mb-2">IA Psychométrique</span>
              <h3 className="text-xl font-bold text-white mb-1">Bilan RIASEC Intelligent</h3>
              <p className="text-sm text-zinc-300 mb-3">
                Évaluez vos affinités réelles selon le modèle Holland pour cibler les meilleures filières.
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold text-white">
                <span>Commencer le bilan</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="ui-card ui-card-hover shadcn-trio-card" onClick={() => handleNav("recommendations")}>
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
              alt="Campus UM6P Benguerir"
              className="shadcn-card-img-bg"
            />
            <div className="shadcn-card-scrim" />
            <div className="shadcn-card-overlay-content">
              <span className="ui-badge ui-badge-secondary w-fit mb-2">Grandes Écoles</span>
              <h3 className="text-xl font-bold text-white mb-1">Référentiel des Écoles</h3>
              <p className="text-sm text-zinc-300 mb-3">
                Seuils officiels 2022-2025, filières d'avenir et modalités d'admissibilité au Maroc.
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold text-white">
                <span>Explorer les écoles</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="ui-card ui-card-hover shadcn-trio-card" onClick={() => handleNav("mentor")}>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Mentorat étudiant"
              className="shadcn-card-img-bg"
            />
            <div className="shadcn-card-scrim" />
            <div className="shadcn-card-overlay-content">
              <span className="ui-badge ui-badge-secondary w-fit mb-2">Accompagnement</span>
              <h3 className="text-xl font-bold text-white mb-1">Mentorat Visio 1-on-1</h3>
              <p className="text-sm text-zinc-300 mb-3">
                Échangez directement avec des étudiants aînés ayant réussi les concours que vous visez.
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold text-white">
                <span>Réserver un créneau</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="shadcn-section" id="bilan">
        <div className="shadcn-section-header">
          <div className="ui-badge ui-badge-secondary mb-3">
            <span>Évaluation Psychométrique Holland</span>
          </div>
          <h2 className="shadcn-section-title">
            Bilan RIASEC : Cartographiez Votre Vocation
          </h2>
          <p className="shadcn-section-subtitle">
            Chaque profil est unique. Sélectionnez une dimension pour découvrir les vocations,
            les campus et les métiers d'excellence associés.
          </p>
        </div>

        <div className="shadcn-tabs-wrapper">
          <div className="ui-tabs-list">
            {RIASEC_DIMENSIONS.map((dim) => (
              <button
                key={dim.key}
                className={`ui-tabs-trigger ${activeRiasec === dim.key ? "active" : ""}`}
                onClick={() => setActiveRiasec(dim.key)}
              >
                <span className="font-bold mr-1.5">{dim.key}</span>
                <span>{dim.name}</span>
              </button>
            ))}
          </div>
        </div>

        {currentRiasec && (
          <div className="ui-card shadcn-riasec-card">
            <div className="shadcn-riasec-grid">

              <div className="shadcn-riasec-photo-wrap">
                <img
                  src={currentRiasec.image}
                  alt={currentRiasec.name}
                  className="shadcn-riasec-photo"
                  loading="lazy"
                />
                <div className="shadcn-riasec-photo-overlay" />
                <div className="shadcn-riasec-photo-chip">
                  <span className="text-xl mr-2">{currentRiasec.icon}</span>
                  <div>
                    <strong className="block text-sm font-semibold text-white">Dimension {currentRiasec.name}</strong>
                    <span className="text-xs text-emerald-400 font-medium">{currentRiasec.score}% d'affinité naturelle</span>
                  </div>
                </div>
              </div>

              <div className="shadcn-riasec-info-wrap">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="ui-badge ui-badge-secondary font-bold text-sm px-2 py-0.5">{currentRiasec.key}</span>
                      <h3 className="text-2xl font-bold tracking-tight text-foreground">{currentRiasec.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{currentRiasec.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Affinité</span>
                    <span className="block text-2xl font-bold tracking-tight text-foreground leading-none">{currentRiasec.score}%</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentRiasec.desc}
                </p>

                <div className="p-3.5 rounded-lg bg-muted/60 border border-border text-xs text-foreground italic">
                  <span className="block font-semibold not-italic text-muted-foreground mb-1">Exemple de question posée par l'IA :</span>
                  {currentRiasec.sampleQuestion}
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Points forts & Tempérament
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentRiasec.strengths.map((st, i) => (
                        <span key={i} className="ui-badge ui-badge-outline text-xs">✓ {st}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Grandes Écoles phares au Maroc
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentRiasec.schools.map((sc, i) => (
                        <span key={i} className="ui-badge ui-badge-secondary text-xs">🏛️ {sc}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Métiers & Carrières
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentRiasec.careers.map((cr, i) => (
                        <span key={i} className="ui-badge ui-badge-outline text-xs">💼 {cr}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button className="ui-btn ui-btn-default ui-btn-md w-full sm:w-auto" onClick={() => handleNav("chat")}>
                    <span>Démarrer l'évaluation RIASEC Complète</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="shadcn-section" id="compatibilite">
        <div className="shadcn-section-header">
          <div className="ui-badge ui-badge-secondary mb-3">
            <span>Analyse par Matière & Affinité</span>
          </div>
          <h2 className="shadcn-section-title">
            Compatibilité Pédagogique par Établissement
          </h2>
          <p className="shadcn-section-subtitle">
            Visualisez vos coefficients de réussite et les exigences académiques spécifiques à chaque Grande École.
          </p>
        </div>

        <div className="shadcn-tabs-wrapper mb-6">
          <div className="ui-tabs-list">
            <button
              className={`ui-tabs-trigger ${selectedSchool === "ensam" ? "active" : ""}`}
              onClick={() => setSelectedSchool("ensam")}
            >
              ENSAM Casablanca
            </button>
            <button
              className={`ui-tabs-trigger ${selectedSchool === "um6p" ? "active" : ""}`}
              onClick={() => setSelectedSchool("um6p")}
            >
              UM6P Benguerir
            </button>
            <button
              className={`ui-tabs-trigger ${selectedSchool === "encg" ? "active" : ""}`}
              onClick={() => setSelectedSchool("encg")}
            >
              ENCG Settat
            </button>
          </div>
        </div>

        <div className="ui-card p-6 md:p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

            <div className="relative h-64 rounded-xl overflow-hidden border border-border">
              <img
                src={schoolDetails[selectedSchool].image}
                alt={schoolDetails[selectedSchool].name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="ui-badge ui-badge-success mb-2">{schoolDetails[selectedSchool].match}</span>
                <h4 className="text-xl font-bold">{schoolDetails[selectedSchool].name}</h4>
                <p className="text-xs text-zinc-300 mt-0.5">{schoolDetails[selectedSchool].sub}</p>
                <span className="text-xs font-semibold text-emerald-400 block mt-1">{schoolDetails[selectedSchool].threshold}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-sm font-bold text-foreground">Exigences & Pondération par Matière</h4>
              {schoolDetails[selectedSchool].stats.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground">{s.label}</span>
                    <span className="text-muted-foreground font-bold">{s.value} / 20</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: s.pct }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <button className="ui-btn ui-btn-outline ui-btn-sm w-full" onClick={() => handleNav("recommendations")}>
                  Voir toutes les conditions d'accès ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shadcn-section" id="seuils">
        <div className="shadcn-section-header">
          <div className="ui-badge ui-badge-secondary mb-3">
            <span>Campus & Données Officielles</span>
          </div>
          <h2 className="shadcn-section-title">
            Écoles & Seuils de Présélection
          </h2>
          <p className="shadcn-section-subtitle">
            Consultez les seuils historiques réels (2022-2025) et testez immédiatement votre éligibilité
            selon la formule officielle (75% National + 25% Régional).
          </p>
        </div>

        <div className="ui-card p-6 md:p-8 mb-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="ui-badge ui-badge-secondary font-bold text-xs">Simulateur</span>
                <h3 className="text-xl font-bold tracking-tight text-foreground">Calculateur de Note de Présélection</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Ajustez vos notes prévisionnelles pour évaluer votre éligibilité en temps réel.</p>
            </div>
            <div className="text-right bg-muted/60 px-4 py-2 rounded-lg border border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase block">Note Pondérée</span>
              <span className="text-2xl font-extrabold tracking-tight text-foreground">{simulatedScore.toFixed(2)} <small className="text-sm font-normal text-muted-foreground">/ 20</small></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-border">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <label htmlFor="nat-slider" className="text-foreground">Examen National (75%)</label>
                <span className="text-foreground font-bold">{Number(nationalGrade).toFixed(2)} / 20</span>
              </div>
              <input
                id="nat-slider"
                type="range"
                min="10"
                max="20"
                step="0.25"
                value={nationalGrade}
                onChange={(e) => setNationalGrade(parseFloat(e.target.value))}
                className="shadcn-slider"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <label htmlFor="reg-slider" className="text-foreground">Examen Régional (25%)</label>
                <span className="text-foreground font-bold">{Number(regionalGrade).toFixed(2)} / 20</span>
              </div>
              <input
                id="reg-slider"
                type="range"
                min="10"
                max="20"
                step="0.25"
                value={regionalGrade}
                onChange={(e) => setRegionalGrade(parseFloat(e.target.value))}
                className="shadcn-slider"
              />
            </div>
          </div>

          <div className="pt-4 text-xs text-muted-foreground leading-relaxed flex items-center gap-2">
            <span className="text-base">📊</span>
            <span>
              Formule officielle : <strong>({Number(nationalGrade).toFixed(2)} × 0.75) + ({Number(regionalGrade).toFixed(2)} × 0.25) = {simulatedScore.toFixed(2)} / 20</strong>.
              {simulatedScore >= 15.5
                ? " Profil très compétitif : éligible pour la majorité des Grandes Écoles d'ingénieurs et de commerce !"
                : simulatedScore >= 13.5
                ? " Profil solide : accès favorable aux concours communs ENSA, ENCG et universités."
                : " Accès aux concours décentralisés (FMP, EST, BTS, Licences d'excellence)."}
            </span>
          </div>
        </div>

        <div className="shadcn-tabs-wrapper mb-8">
          <div className="ui-tabs-list">
            {[
              { key: "all", label: "Toutes les Écoles" },
              { key: "ingenierie", label: "Ingénierie & Tech" },
              { key: "commerce", label: "Commerce & Gestion" },
              { key: "medecine", label: "Médecine & Santé" },
              { key: "excellence", label: "Grandes Écoles d'Élite" }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`ui-tabs-trigger ${schoolCategory === tab.key ? "active" : ""}`}
                onClick={() => setSchoolCategory(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="shadcn-cards-grid">
          {filteredSchools.map((sch) => {
            const elig = getSchoolEligibility(sch.threshold, simulatedScore);
            return (
              <div key={sch.id} className="ui-card ui-card-hover shadcn-school-card">

                <div className="shadcn-school-img-wrap">
                  <img
                    src={sch.image}
                    alt={sch.name}
                    className="shadcn-school-img"
                    loading="lazy"
                  />
                  <div className="shadcn-school-img-scrim" />
                  <span className="ui-badge ui-badge-secondary shadcn-badge-top-left">
                    {sch.badge}
                  </span>
                  <span className={`ui-badge shadcn-badge-bottom-right ${
                    elig.type === "admissible"
                      ? "ui-badge-success"
                      : elig.type === "warning"
                      ? "ui-badge-warning"
                      : "ui-badge-destructive"
                  }`}>
                    {elig.label}
                  </span>
                </div>

                <div className="p-5 flex flex-col gap-3.5 flex-1">
                  <h3 className="font-bold text-base tracking-tight text-foreground leading-snug">
                    {sch.name}
                  </h3>

                  <div className="p-3 rounded-lg bg-muted/60 border border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Seuil 2025</span>
                      <span className="text-base font-extrabold text-foreground">
                        {typeof sch.threshold === "number" ? `${sch.threshold.toFixed(2)} / 20` : sch.threshold}
                      </span>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <span className="block font-medium text-foreground">{sch.thresholdFormula}</span>
                      <span className="text-[11px]">{sch.details}</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Format concours :</span>
                      <strong className="text-foreground">{sch.exam}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Cursus :</span>
                      <strong className="text-foreground">{sch.duration}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex flex-wrap gap-1 mt-auto">
                    {sch.filieres.map((f, idx) => (
                      <span key={idx} className="ui-badge ui-badge-outline text-[11px] font-normal py-0.5">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          <button className="ui-btn ui-btn-outline ui-btn-md" onClick={() => handleNav("recommendations")}>
            <span>Consulter le Référentiel Complet des Écoles Partenaires</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      <section className="shadcn-section" id="matching">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ui-card p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-foreground">Bilan IA Personnalisé</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Un entretien conversationnel fluide de 5 minutes avec notre conseiller IA
              pour cerner vos forces académiques et vos centres d'intérêt profonds.
            </p>
          </div>

          <div className="ui-card p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-foreground">Historique des Seuils</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Accédez aux seuils d'admissibilité officiels (2020-2025) pour plus de 120
              écoles publiques et privées au Maroc (CPGE, ENSAM, ENCG, FMP, UM6P).
            </p>
          </div>

          <div className="ui-card p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-foreground">Mentorat Visio 1-on-1</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Prenez rendez-vous directement avec des étudiants aînés actuellement en cursus
              dans l'école de vos rêves pour des conseils authentiques sans filtre.
            </p>
          </div>
        </div>
      </section>

      <section className="shadcn-section" id="campus-life">
        <div className="shadcn-section-header">
          <div className="ui-badge ui-badge-secondary mb-3">
            <span>Immersion & Vie de Campus</span>
          </div>
          <h2 className="shadcn-section-title">
            Projetez-vous Dans Votre Futur Quotidien
          </h2>
          <p className="shadcn-section-subtitle">
            Les Grandes Écoles au Maroc allient infrastructures de niveau international,
            innovation technologique et réseau d'alumni mondial.
          </p>
        </div>

        <div className="shadcn-gallery-grid">
          <div className="ui-card ui-card-hover shadcn-gallery-card card-span-2">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
              alt="Campus UM6P Benguerir"
              className="shadcn-gallery-img"
              loading="lazy"
            />
            <div className="shadcn-gallery-scrim" />
            <div className="shadcn-gallery-text">
              <span className="ui-badge ui-badge-secondary mb-1.5 w-fit">Infrastructures d'Élite</span>
              <h3 className="text-xl font-bold text-white mb-1">Campus & Laboratoires R&D Futuristes</h3>
              <p className="text-xs text-zinc-300">Des équipements pensés pour repousser les frontières de l'intelligence artificielle et des énergies propres.</p>
            </div>
          </div>

          <div className="ui-card ui-card-hover shadcn-gallery-card">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
              alt="Hackathons et robotique"
              className="shadcn-gallery-img"
              loading="lazy"
            />
            <div className="shadcn-gallery-scrim" />
            <div className="shadcn-gallery-text">
              <span className="ui-badge ui-badge-secondary mb-1.5 w-fit">Innovation & Projets</span>
              <h3 className="text-lg font-bold text-white mb-1">Hackathons & Robotique</h3>
              <p className="text-xs text-zinc-300">Concevez des prototypes concrets dès les premières années de formation.</p>
            </div>
          </div>

          <div className="ui-card ui-card-hover shadcn-gallery-card">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
              alt="Simulation clinique"
              className="shadcn-gallery-img"
              loading="lazy"
            />
            <div className="shadcn-gallery-scrim" />
            <div className="shadcn-gallery-text">
              <span className="ui-badge ui-badge-secondary mb-1.5 w-fit">Santé & Médecine</span>
              <h3 className="text-lg font-bold text-white mb-1">Simulation Clinique & CHU</h3>
              <p className="text-xs text-zinc-300">Formez-vous aux gestes médicaux au sein de centres hospitaliers modernes.</p>
            </div>
          </div>

          <div className="ui-card ui-card-hover shadcn-gallery-card card-span-2">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"
              alt="Diplôme et carrière"
              className="shadcn-gallery-img"
              loading="lazy"
            />
            <div className="shadcn-gallery-scrim" />
            <div className="shadcn-gallery-text">
              <span className="ui-badge ui-badge-secondary mb-1.5 w-fit">Carrière & Réussite</span>
              <h3 className="text-xl font-bold text-white mb-1">Diplôme d'État & Rayonnement International</h3>
              <p className="text-xs text-zinc-300">Accédez aux plus grandes entreprises mondiales ou créez votre propre startup à fort impact.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shadcn-section" id="tableau-de-bord">
        <div className="shadcn-section-header">
          <div className="ui-badge ui-badge-secondary mb-3">
            <span>Cockpit Étudiant Unifié</span>
          </div>
          <h2 className="shadcn-section-title">
            Pilotez Vos Candidatures en Temps Réel
          </h2>
          <p className="shadcn-section-subtitle">
            Centralisez vos vœux, vos prédictions de concours et vos sessions de mentorat
            sur une interface sobre et structurée.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="ui-card p-5 space-y-2">
            <div className="text-xl">🎯</div>
            <h4 className="font-bold text-sm text-foreground">Matching & IA</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Calcul continu de votre taux d'affinité avec chaque filière et estimation des chances d'admission.</p>
          </div>
          <div className="ui-card p-5 space-y-2">
            <div className="text-xl">📅</div>
            <h4 className="font-bold text-sm text-foreground">Alertes Concours</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Ne manquez aucun calendrier officiel (Tawjihi, ENSA, FMP, UM6P) grâce aux rappels intelligents.</p>
          </div>
          <div className="ui-card p-5 space-y-2">
            <div className="text-xl">📈</div>
            <h4 className="font-bold text-sm text-foreground">Objectif Notes Bac</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Identifiez la note minimale à décrocher au Bac National pour sécuriser votre école favorite.</p>
          </div>
          <div className="ui-card p-5 space-y-2">
            <div className="text-xl">👥</div>
            <h4 className="font-bold text-sm text-foreground">Mentorat Visio</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Réservez un échange direct avec des étudiants aînés actuellement en cursus.</p>
          </div>
        </div>

        <div className="ui-card p-6 md:p-8">
          <div className="flex justify-between items-center pb-6 border-b border-border flex-wrap gap-4 mb-6">
            <div className="ui-tabs-list">
              <button
                className={`ui-tabs-trigger ${activeCockpitTab === "candidatures" ? "active" : ""}`}
                onClick={() => setActiveCockpitTab("candidatures")}
              >
                Suivi des Vœux (3 actifs)
              </button>
              <button
                className={`ui-tabs-trigger ${activeCockpitTab === "prediction" ? "active" : ""}`}
                onClick={() => setActiveCockpitTab("prediction")}
              >
                Analyse Prédictive IA
              </button>
              <button
                className={`ui-tabs-trigger ${activeCockpitTab === "mentorat" ? "active" : ""}`}
                onClick={() => setActiveCockpitTab("mentorat")}
              >
                Mentorat Connecté
              </button>
            </div>
            <button className="ui-btn ui-btn-outline ui-btn-sm" onClick={() => handleNav("dashboard")}>
              <span>Ouvrir Mon Tableau de bord</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </div>

          {activeCockpitTab === "candidatures" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  rank: "Vœu 1",
                  name: "ENSAM Casablanca",
                  filiere: "Génie Mécanique & Systèmes Automatisés",
                  match: "96.8%",
                  status: "Dossier Validé",
                  statusType: "ui-badge-success",
                  date: "Concours : 22 Juil. 2026",
                  image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80"
                },
                {
                  rank: "Vœu 2",
                  name: "ENSA Marrakech",
                  filiere: "Génie Informatique & Cybersécurité",
                  match: "94.2%",
                  status: "Convoqué Écrit",
                  statusType: "ui-badge-secondary",
                  date: "Concours : 25 Juil. 2026",
                  image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
                },
                {
                  rank: "Vœu 3",
                  name: "UM6P Benguerir",
                  filiere: "School of Computer Science",
                  match: "91.5%",
                  status: "En Examen",
                  statusType: "ui-badge-warning",
                  date: "Oral : 03 Août 2026",
                  image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
                }
              ].map((v, i) => (
                <div key={i} className="ui-card overflow-hidden flex flex-col">
                  <div className="relative h-36 w-full">
                    <img src={v.image} alt={v.name} className="h-full w-full object-cover" />
                    <span className="ui-badge ui-badge-secondary absolute top-2 left-2 text-[11px]">
                      {v.rank}
                    </span>
                    <span className="ui-badge ui-badge-success absolute bottom-2 right-2 text-[11px] font-bold">
                      {v.match}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <strong className="text-sm font-bold text-foreground">{v.name}</strong>
                    <span className="text-xs text-muted-foreground">{v.filiere}</span>
                    <div className="pt-3 border-t border-border mt-auto flex items-center justify-between">
                      <span className={`ui-badge text-[11px] ${v.statusType}`}>{v.status}</span>
                      <span className="text-[11px] text-muted-foreground font-medium">{v.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeCockpitTab === "prediction" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <span className="text-xs font-semibold uppercase text-muted-foreground block mb-2">Indice de Confiance Global</span>
                <span className="text-5xl font-extrabold tracking-tight text-emerald-500 block mb-3">94.6%</span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Votre profil académique vous positionne au-dessus des seuils de présélection dans <strong>54 des 68 écoles</strong> répertoriées.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-foreground">Leviers d'optimisation préconisés :</h4>
                <div className="p-3 rounded-lg border border-border flex justify-between text-xs">
                  <span>Mathématiques (National)</span>
                  <strong className="text-emerald-500">+0.75 pt au score global / point gagné</strong>
                </div>
                <div className="p-3 rounded-lg border border-border flex justify-between text-xs">
                  <span>Physique-Chimie (National)</span>
                  <strong className="text-emerald-500">+0.50 pt au seuil ENSAM / ENSA</strong>
                </div>
                <p className="text-xs text-muted-foreground italic p-2.5 rounded bg-muted/40 border border-border">
                  « Focus conseillé : consolider les équations différentielles et l'analyse complexe pour sécuriser la mention Très Bien. »
                </p>
              </div>
            </div>
          )}

          {activeCockpitTab === "mentorat" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative h-60 rounded-xl overflow-hidden border border-border">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Session de mentorat"
                  className="h-full w-full object-cover"
                />
                <span className="ui-badge ui-badge-secondary absolute top-3 left-3 text-xs">
                  Visio 1-on-1 Interactive
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Amine El Fassi"
                    className="w-14 h-14 rounded-full object-cover border-2 border-border"
                  />
                  <div>
                    <h4 className="text-base font-bold text-foreground">Amine El Fassi</h4>
                    <p className="text-xs text-muted-foreground">4e Année ENSAM Casablanca • Majeur Concours</p>
                    <span className="ui-badge ui-badge-warning text-[10px] mt-1">★ 4.98 (24 sessions)</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  « Disponible pour débriefer les épreuves types de physique, partager mes fiches de révision et vous expliquer la réalité des études à l'ENSAM. »
                </p>
                <div className="text-xs font-semibold text-foreground">
                  Prochain créneau : Jeudi 18h00 (Visio 45 min)
                </div>
                <button className="ui-btn ui-btn-default ui-btn-sm" onClick={() => handleNav("mentor")}>
                  Réserver ma session avec Amine
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border flex justify-between items-center flex-wrap gap-4">
            <div>
              <h4 className="font-bold text-base text-foreground">Prêt à Prendre le Contrôle de Votre Orientation ?</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Créez votre profil en 2 minutes pour ouvrir votre cockpit complet.</p>
            </div>
            <div className="flex gap-2">
              <button className="ui-btn ui-btn-default ui-btn-sm" onClick={() => handleNav("dashboard")}>
                Accéder au Cockpit ↗
              </button>
              <button className="ui-btn ui-btn-outline ui-btn-sm" onClick={() => handleNav("chat")}>
                Lancer le Bilan RIASEC
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="shadcn-section" id="faq">
        <div className="shadcn-section-header">
          <div className="ui-badge ui-badge-secondary mb-3">
            <span>Questions Fréquentes</span>
          </div>
          <h2 className="shadcn-section-title">
            Tout Ce Que Vous Devez Savoir
          </h2>
          <p className="shadcn-section-subtitle">
            Des réponses claires pour vous accompagner sereinement dans vos choix d'orientation post-Bac au Maroc.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="ui-card overflow-hidden transition-all">
                <button
                  className="w-full p-4 md:p-5 text-left flex justify-between items-center gap-4 bg-transparent border-0 cursor-pointer font-sans"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm md:text-base text-foreground tracking-tight">
                    {item.question}
                  </span>
                  <span className="text-muted-foreground text-lg font-light shrink-0 transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
                    ↓
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 md:px-5 md:pb-5 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="shadcn-section pt-0">
        <div className="shadcn-cta-card">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=85"
            alt="Orientation réussie"
            className="shadcn-cta-bg"
          />
          <div className="shadcn-cta-scrim" />
          <div className="shadcn-cta-content">
            <span className="ui-badge ui-badge-secondary mb-3">Rejoignez l'Excellence</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Prêt à Décrocher l'École de Vos Rêves ?
            </h2>
            <p className="text-sm md:text-base text-zinc-300 max-w-xl mx-auto mb-6">
              Rejoignez des milliers de lycéens et étudiants qui construisent leur avenir académique avec Orient Companion.
            </p>
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <button className="ui-btn ui-btn-default ui-btn-lg" onClick={() => handleNav("chat")}>
                <span>Lancer Mon Bilan RIASEC</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="ui-btn ui-btn-outline ui-btn-lg bg-zinc-900/60 border-zinc-700 text-white hover:bg-zinc-800" onClick={() => handleNav("register")}>
                Créer un Compte Étudiant
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="shadcn-footer">
        <div className="shadcn-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-border text-sm">

            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav("landing")}>
                <div className="shadcn-brand-icon">
                  <BrandLogoIcon />
                </div>
                <span className="font-bold text-base tracking-tight text-foreground">Orient Companion</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Plateforme marocaine d'orientation augmentée par l'IA. Bilan RIASEC, analyse des seuils officiels et mentorat d'excellence.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-foreground block mb-2">Orientation</span>
              <a href="#bilan" className="block text-muted-foreground hover:text-foreground transition-colors">Bilan RIASEC Holland</a>
              <a href="#seuils" className="block text-muted-foreground hover:text-foreground transition-colors">Seuils Officiels 2025</a>
              <a href="#compatibilite" className="block text-muted-foreground hover:text-foreground transition-colors">Compatibilité par École</a>
              <a href="#campus-life" className="block text-muted-foreground hover:text-foreground transition-colors">Vie de Campus</a>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-foreground block mb-2">Services</span>
              <button className="block text-left text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 p-0 cursor-pointer text-xs" onClick={() => handleNav("chat")}>Conseiller IA 24/7</button>
              <button className="block text-left text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 p-0 cursor-pointer text-xs" onClick={() => handleNav("recommendations")}>Grandes Écoles Partenaires</button>
              <button className="block text-left text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 p-0 cursor-pointer text-xs" onClick={() => handleNav("mentor")}>Mentorat Visio 1-on-1</button>
              <button className="block text-left text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 p-0 cursor-pointer text-xs" onClick={() => handleNav("dashboard")}>Cockpit Candidat</button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-foreground block mb-2">Espace Candidat</span>
              <button className="block text-left text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 p-0 cursor-pointer text-xs" onClick={() => handleNav("login")}>Connexion Compte</button>
              <button className="block text-left text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 p-0 cursor-pointer text-xs" onClick={() => handleNav("register")}>Inscription Gratuite</button>
              <div className="pt-2">
                <button className="ui-btn ui-btn-outline ui-btn-sm text-xs gap-1.5" onClick={toggleTheme}>
                  <span>{theme === "light" ? "Mode Sombre 🌙" : "Mode Clair ☀️"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <span>© 2026 Orient Companion. Tous droits réservés.</span>
            <div className="flex gap-4 text-xs">
              <a href="#seuils" className="hover:text-foreground transition-colors">Données Ministérielles</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ & Support</a>
              <a href="#apercu" className="hover:text-foreground transition-colors">Haut de page ↑</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
