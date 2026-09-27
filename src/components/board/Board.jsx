import { useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AssessmentContext } from "../../context/AssessmentContext";
import { RecommendationContext } from "../../context/RecommendationContext";
import { MentorshipContext } from "../../context/MentorshipContext";
import "./Board.css";

const RIASEC_INFO = {
  R: { label: "Réaliste", desc: "Pratique, technique et concret" },
  I: { label: "Investigateur", desc: "Analytique, scientifique et curieux" },
  A: { label: "Artistique", desc: "Créatif, intuitif et expressif" },
  S: { label: "Social", desc: "Empathique, relationnel et coopératif" },
  E: { label: "Entreprenant", desc: "Leader, persuasif et dynamique" },
  C: { label: "Conventionnel", desc: "Méthodique, rigoureux et structuré" },
};

const Icons = {
  Compass: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  Psychometric: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  Target: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Users: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Calendar: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Award: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  TrendingUp: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  School: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
};

export default function Board() {
  const navigate = useNavigate();
  const {
    profile,
    fetchProfile,
    hasCompletedAssessment,
    loading: assessmentLoading,
  } = useContext(AssessmentContext);
  const {
    recommendations,
    fetchMyRecommendations,
    loading: recsLoading,
  } = useContext(RecommendationContext);
  const {
    studentSessions,
    fetchMySessionsAsStudent,
    loading: sessionsLoading,
  } = useContext(MentorshipContext);

  useEffect(() => {
    if (fetchProfile) fetchProfile();
    if (fetchMyRecommendations) fetchMyRecommendations();
    if (fetchMySessionsAsStudent) fetchMySessionsAsStudent();
  }, []);


  const todayDateFormatted = useMemo(() => {
    const raw = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, []);

  const personalityScores = useMemo(() => {
    if (!profile) return null;
    if (profile.personalityScores) return profile.personalityScores;
    const fallback = {
      R: profile.rScore ?? profile.r ?? 0,
      I: profile.iScore ?? profile.i ?? 0,
      A: profile.aScore ?? profile.a ?? 0,
      S: profile.sScore ?? profile.s ?? 0,
      E: profile.eScore ?? profile.e ?? 0,
      C: profile.cScore ?? profile.c ?? 0,
    };
    const hasAny = Object.values(fallback).some((v) => v > 0);
    return hasAny ? fallback : null;
  }, [profile]);

  const top3Riasec = useMemo(() => {
    if (profile?.riasecCode && profile.riasecCode.length >= 3) {
      return profile.riasecCode.slice(0, 3).toUpperCase();
    }
    if (!personalityScores) return null;
    const sorted = Object.entries(personalityScores)
      .filter(([, val]) => typeof val === "number" && !isNaN(val))
      .sort((a, b) => b[1] - a[1]);
    if (sorted.length < 3) return null;
    return sorted.slice(0, 3).map(([k]) => k).join("");
  }, [profile, personalityScores]);

  const top3Dimensions = useMemo(() => {
    if (!top3Riasec || !personalityScores) return [];
    return top3Riasec.split("").map((letter) => {
      const score = Math.round(personalityScores[letter] ?? 0);
      const info = RIASEC_INFO[letter] || {
        label: letter,
        desc: "Dimension psychométrique",
      };
      return { letter, score, ...info };
    });
  }, [top3Riasec, personalityScores]);

  const strongSubject = useMemo(() => {
    if (profile?.strongSubject) {
      if (typeof profile.strongSubject === "string") {
        return { name: profile.strongSubject, score: null };
      }
      return profile.strongSubject;
    }
    const academic = profile?.academicScores;
    if (!academic || typeof academic !== "object") return null;
    const entries = Object.entries(academic).filter(
      ([, v]) => typeof v === "number" && !isNaN(v)
    );
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return { name: entries[0][0], score: entries[0][1] };
  }, [profile]);

  const averageGrade = useMemo(() => {
    if (profile?.averageGrade) {
      return Number(profile.averageGrade).toFixed(1);
    }
    const academic = profile?.academicScores;
    if (!academic || typeof academic !== "object") return null;
    const vals = Object.values(academic).filter(
      (v) => typeof v === "number" && !isNaN(v)
    );
    if (vals.length === 0) return null;
    const sum = vals.reduce((acc, v) => acc + v, 0);
    return (sum / vals.length).toFixed(1);
  }, [profile]);

  const isAssessmentCompleted = Boolean(profile || hasCompletedAssessment);
  const hasRecommendations = Boolean(recommendations && recommendations.length > 0);
  const hasMentorshipSession = Boolean(studentSessions && studentSessions.length > 0);

  const progressPercent = useMemo(() => {
    let p = 0;
    if (isAssessmentCompleted) p += 33;
    if (hasRecommendations) p += 33;
    if (hasMentorshipSession) p += 34;
    return p;
  }, [isAssessmentCompleted, hasRecommendations, hasMentorshipSession]);

  const dossierStatus = useMemo(() => {
    if (progressPercent === 100) {
      return "Dossier complet";
    }
    if (progressPercent >= 33) {
      return "Profil évalué";
    }
    return "Bilan en attente";
  }, [progressPercent]);

  const primaryAction = useMemo(() => {
    if (!isAssessmentCompleted) {
      return {
        label: "Démarrer l'entretien IA",
        link: "/assessment",
        guidance: "Étape 1 : Effectuez votre bilan RIASEC avec le conseiller IA.",
      };
    }
    if (!hasRecommendations) {
      return {
        label: "Découvrir mes recommandations",
        link: "/recommendations",
        guidance: "Étape 2 : Vos filières d'orientation sont prêtes à être explorées.",
      };
    }
    if (!hasMentorshipSession) {
      return {
        label: "Réserver une séance de mentorat",
        link: "/mentorship",
        guidance: "Étape 3 : Prenez rendez-vous avec un conseiller d'orientation.",
      };
    }
    return {
      label: "Gérer mes séances",
      link: "/mentorship",
      guidance: "Parcours complété : suivez vos séances de mentorat.",
    };
  }, [isAssessmentCompleted, hasRecommendations, hasMentorshipSession]);

  const topRecommendations = useMemo(() => {
    if (!recommendations || recommendations.length === 0) return [];

    const mapped = recommendations.map((item, idx) => {
      const rawScore = item.score ?? item.matchScore ?? null;
      const pct =
        rawScore !== null
          ? rawScore <= 1
            ? Math.round(rawScore * 100)
            : Math.round(rawScore)
          : null;

      const fieldName = item.fieldName || item.trackName || "Filière recommandée";
      const category = item.fieldCategory || item.category || "";
      const primarySchool = item.schools?.[0];
      const schoolDisplay =
        primarySchool?.name || item.schoolName || item.institution || null;
      const schoolCity = primarySchool?.city || null;

      return {
        id: item.id ?? idx,
        fieldName,
        category,
        schoolDisplay,
        schoolCity,
        matchPct: pct,
        explanation: item.explanation || "",
      };
    });

    mapped.sort((a, b) => (b.matchPct ?? 0) - (a.matchPct ?? 0));
    return mapped.slice(0, 3);
  }, [recommendations]);

  const nextSession = useMemo(() => {
    if (!studentSessions || studentSessions.length === 0) return null;
    return studentSessions[studentSessions.length - 1];
  }, [studentSessions]);

  return (
    <div className="board-container">

      <main className="board-main-container">

        <div className="board-page-header">
          <div className="board-title-group">
            <h1>Tableau de bord</h1>
            <p className="board-subtitle">
              Cockpit d'orientation central. Synthèse de votre avancement et actions prioritaires.
            </p>
          </div>
          <div className="board-date-badge">
            <Icons.Calendar />
            <span>{todayDateFormatted}</span>
          </div>
        </div>

        
        <section className="board-card" aria-labelledby="heading-progression">
          <div className="board-card-header">
            <div className="board-card-title-group">
              <div className="board-card-icon-box">
                <Icons.Compass />
              </div>
              <div>
                <h2 id="heading-progression" className="board-card-title">
                  1. Progression du Parcours
                </h2>
                <p className="board-card-desc">
                  Statut du dossier et étapes d'orientation clés
                </p>
              </div>
            </div>

            <div className="board-badge">
              <span className="board-badge-dot" />
              <span>{dossierStatus}</span>
            </div>
          </div>

          <div className="board-stepper-row">

            <div className={`board-step-card ${isAssessmentCompleted ? "complete" : "active"}`}>
              <div className="board-step-card-header">
                <span className="board-step-circle">
                  {isAssessmentCompleted ? <Icons.Check /> : "1"}
                </span>
                <span className="board-step-state-text">
                  {isAssessmentCompleted ? "Terminé" : "À passer"}
                </span>
              </div>
              <h3 className="board-step-name">Bilan RIASEC</h3>
              <p className="board-step-summary">
                {isAssessmentCompleted
                  ? "Entretien IA validé."
                  : "Évaluation du profil psychométrique."}
              </p>
            </div>

            <div
              className={`board-step-card ${
                hasRecommendations
                  ? "complete"
                  : isAssessmentCompleted
                  ? "active"
                  : ""
              }`}
            >
              <div className="board-step-card-header">
                <span className="board-step-circle">
                  {hasRecommendations ? <Icons.Check /> : "2"}
                </span>
                <span className="board-step-state-text">
                  {hasRecommendations
                    ? "Débloqué"
                    : isAssessmentCompleted
                    ? "En cours"
                    : "En attente"}
                </span>
              </div>
              <h3 className="board-step-name">Découverte filières</h3>
              <p className="board-step-summary">
                {hasRecommendations
                  ? `${recommendations.length} filière(s) calculée(s).`
                  : "Suggestions de filières et écoles."}
              </p>
            </div>

            <div
              className={`board-step-card ${
                hasMentorshipSession
                  ? "complete"
                  : hasRecommendations
                  ? "active"
                  : ""
              }`}
            >
              <div className="board-step-card-header">
                <span className="board-step-circle">
                  {hasMentorshipSession ? <Icons.Check /> : "3"}
                </span>
                <span className="board-step-state-text">
                  {hasMentorshipSession
                    ? "Planifié"
                    : hasRecommendations
                    ? "À réserver"
                    : "En attente"}
                </span>
              </div>
              <h3 className="board-step-name">Mentorat</h3>
              <p className="board-step-summary">
                {hasMentorshipSession
                  ? "Accompagnement humain actif."
                  : "Échange individuel avec un conseiller."}
              </p>
            </div>
          </div>

          <div className="board-gauge-box">
            <div className="board-gauge-meta">
              <span>Avancement global</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="board-gauge-track-thin">
              <div
                className="board-gauge-fill-thin"
                style={{ width: `${Math.max(progressPercent, 4)}%` }}
              />
            </div>
          </div>

          <div className="board-progress-action-row">
            <div className="board-guidance-note">
              <span>{primaryAction.guidance}</span>
            </div>

            <button
              className="board-btn-primary"
              onClick={() => navigate(primaryAction.link)}
            >
              <span>{primaryAction.label}</span>
              <Icons.ArrowRight />
            </button>
          </div>
        </section>

        <div className="board-columns-grid">

          <section className="board-card" aria-labelledby="heading-profile">
            <div className="board-card-header">
              <div className="board-card-title-group">
                <div className="board-card-icon-box">
                  <Icons.Psychometric />
                </div>
                <div>
                  <h2 id="heading-profile" className="board-card-title">
                    2. Profil Psychométrique
                  </h2>
                  <p className="board-card-desc">
                    Synthèse des résultats de l'entretien IA
                  </p>
                </div>
              </div>

              {isAssessmentCompleted && (
                <button
                  className="board-btn-outline"
                  onClick={() => navigate("/assessment")}
                >
                  Repasser
                </button>
              )}
            </div>

            {assessmentLoading ? (
              <div style={{ padding: "2rem 0", textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Chargement du profil…
              </div>
            ) : isAssessmentCompleted && top3Riasec ? (
              <div className="board-psychometric-stack">
                
                <div className="board-code-banner">
                  <div className="board-code-banner-col">
                    <span className="board-code-label">Code Holland (Top 3)</span>
                    <span className="board-code-val">{top3Riasec}</span>
                    <span className="board-code-sub">
                      Dominante {RIASEC_INFO[top3Riasec[0]]?.label || top3Riasec[0]}
                    </span>
                  </div>
                </div>

                
                <div className="board-traits-list">
                  {top3Dimensions.map((dim) => (
                    <div key={dim.letter} className="board-trait-row">
                      <div className="board-trait-left-col">
                        <span className="board-trait-mark">{dim.letter}</span>
                        <div>
                          <div className="board-trait-title">{dim.label}</div>
                          <div className="board-trait-desc-text">{dim.desc}</div>
                        </div>
                      </div>

                      <div className="board-trait-right-col">
                        <div className="board-trait-bar-track">
                          <div
                            className="board-trait-bar-fill"
                            style={{ width: `${Math.min(dim.score, 100)}%` }}
                          />
                        </div>
                        <span className="board-trait-score-num">{dim.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                
                <div className="board-academic-stats-row">
                  <div className="board-stat-tile">
                    <div className="board-stat-tile-header">
                      <span className="board-stat-tile-label">Matière forte</span>
                      <Icons.Award />
                    </div>
                    <div className="board-stat-tile-value">
                      {strongSubject?.name || "Non définie"}
                    </div>
                    <div className="board-stat-tile-sub">
                      {strongSubject?.score != null ? `${strongSubject.score} / 20` : "Atout principal"}
                    </div>
                  </div>

                  <div className="board-stat-tile">
                    <div className="board-stat-tile-header">
                      <span className="board-stat-tile-label">Moyenne déclarée</span>
                      <Icons.TrendingUp />
                    </div>
                    <div className="board-stat-tile-value">
                      {averageGrade ? `${averageGrade} / 20` : "Non définie"}
                    </div>
                    <div className="board-stat-tile-sub">
                      {averageGrade ? "Moyenne académique" : "À renseigner"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="board-empty-state-box">
                <h4>Profil non évalué</h4>
                <p>
                  Réalisez votre bilan avec le conseiller IA pour obtenir votre code RIASEC, votre matière forte et votre synthèse académique.
                </p>
                <button
                  className="board-btn-primary"
                  onClick={() => navigate("/assessment")}
                  style={{ marginTop: "0.25rem" }}
                >
                  <span>Passer l'entretien IA</span>
                  <Icons.ArrowRight />
                </button>
              </div>
            )}
          </section>

          <section className="board-card" aria-labelledby="heading-recs">
            <div className="board-card-header">
              <div className="board-card-title-group">
                <div className="board-card-icon-box">
                  <Icons.Target />
                </div>
                <div>
                  <h2 id="heading-recs" className="board-card-title">
                    3. Top Recommandations
                  </h2>
                  <p className="board-card-desc">
                    Filières compatibles (&gt;80%)
                  </p>
                </div>
              </div>

              <button
                className="board-btn-outline"
                onClick={() => navigate("/recommendations")}
              >
                <span>Voir tout ({recommendations?.length || 0})</span>
                <Icons.ArrowRight />
              </button>
            </div>

            {recsLoading ? (
              <div style={{ padding: "2rem 0", textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Calcul des filières compatibles…
              </div>
            ) : topRecommendations.length > 0 ? (
              <div className="board-recs-stack">
                {topRecommendations.map((item, idx) => (
                  <div key={item.id ?? idx} className="board-rec-item">
                    <div className="board-rec-header-row">
                      <h3 className="board-rec-name">{item.fieldName}</h3>
                      {item.matchPct !== null && (
                        <span className="board-rec-match-tag">
                          {item.matchPct}%
                        </span>
                      )}
                    </div>

                    <div className="board-rec-meta-row">
                      {item.schoolDisplay && (
                        <span className="board-rec-school-inline">
                          <Icons.School />
                          <span>{item.schoolDisplay}</span>
                          {item.schoolCity && <span>· {item.schoolCity}</span>}
                        </span>
                      )}
                      {item.category && <span>· {item.category}</span>}
                    </div>

                    {item.explanation && (
                      <p className="board-rec-explanation-text">
                        {item.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="board-empty-state-box">
                <h4>Aucune recommandation disponible</h4>
                <p>
                  Passez votre bilan d'orientation RIASEC pour générer votre sélection personnalisée de filières et grandes écoles.
                </p>
                <button
                  className="board-btn-primary"
                  onClick={() => navigate("/assessment")}
                  style={{ marginTop: "0.25rem" }}
                >
                  <span>Démarrer le bilan</span>
                  <Icons.ArrowRight />
                </button>
              </div>
            )}
          </section>
        </div>

        
        <section className="board-card" aria-labelledby="heading-mentor">
          <div className="board-card-header">
            <div className="board-card-title-group">
              <div className="board-card-icon-box">
                <Icons.Users />
              </div>
              <div>
                <h2 id="heading-mentor" className="board-card-title">
                  4. Rendez-vous de Mentorat
                </h2>
                <p className="board-card-desc">
                  Accompagnement individuel avec un conseiller
                </p>
              </div>
            </div>

            <button
              className="board-btn-outline"
              onClick={() => navigate("/mentorship")}
            >
              <span>Espace Mentorat</span>
              <Icons.ArrowRight />
            </button>
          </div>

          {sessionsLoading ? (
            <div style={{ padding: "2rem 0", textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Chargement des séances…
            </div>
          ) : nextSession ? (
            <div className="board-session-box">
              <div className="board-session-details">
                <div className="board-session-avatar">
                  {nextSession.counselorName
                    ? nextSession.counselorName.charAt(0).toUpperCase()
                    : "C"}
                </div>
                <div className="board-session-info-col">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <h3 className="board-session-counselor-name">
                      {nextSession.counselorName || `Conseiller #${nextSession.counselorId || ""}`}
                    </h3>
                    <span className="board-badge">
                      {(nextSession.status || "").toUpperCase().includes("CONFIRM")
                        ? "Confirmé"
                        : "En attente"}
                    </span>
                  </div>
                  <div className="board-session-time">
                    <Icons.Calendar />
                    <span>
                      {nextSession.scheduledAt
                        ? new Date(nextSession.scheduledAt).toLocaleString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : nextSession.createdAt
                        ? `Demandée le ${new Date(nextSession.createdAt).toLocaleDateString("fr-FR")}`
                        : "Créneau en attente de planification"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="board-btn-primary"
                onClick={() => navigate("/mentorship")}
              >
                <span>Accéder à la séance</span>
                <Icons.ArrowRight />
              </button>
            </div>
          ) : (
            <div className="board-mentor-invite">
              <div className="board-invite-left-side">
                <h3 className="board-invite-title">
                  Échangez en visio avec un conseiller d'orientation
                </h3>
                <p className="board-invite-text">
                  Bénéficiez d'une séance individuelle pour valider vos choix de filières et préparer vos candidatures.
                </p>
                <div className="board-invite-perks">
                  <span className="board-perk-item">
                    <Icons.Check />
                    <span>Échange de 30 min</span>
                  </span>
                  <span className="board-perk-item">
                    <Icons.Check />
                    <span>Revue du dossier</span>
                  </span>
                  <span className="board-perk-item">
                    <Icons.Check />
                    <span>Conseils personnalisés</span>
                  </span>
                </div>
              </div>

              <button
                className="board-btn-primary"
                onClick={() => navigate("/mentorship")}
              >
                <span>Réserver un créneau</span>
                <Icons.ArrowRight />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
