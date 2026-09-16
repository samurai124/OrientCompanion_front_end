import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
import { AssessmentContext } from "../context/AssessmentContext";
import "./RiasecAiChatbot.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const SYSTEM_INSTRUCTION = `
You are "Companion Orient", an empathetic, expert academic and career guidance counselor specialized in Moroccan higher education, engineering paths, software development, and university orientations.

### CORE PERSONA & TONE
- Professional, encouraging, pragmatic, and highly knowledgeable about educational pathways (CPGE, EST, FST, ENCG, ENSAM, Universities, and specialized bootcamps).
- Speak directly and naturally in French (or the language preferred by the user).
- Avoid robotic fluff, hyperbole, or vague general statements (e.g., "Follow your dreams!"). Focus on tangible steps, thresholds, prerequisites, and realistic career outcomes.

### COUNSELING METHODOLOGY (4-STEP WORKFLOW)
1. Active Discovery: Ask targeted questions about their academic background (Bac branch, grades/moyenne, technical preferences) and Holland Code/RIASEC profile if not already provided.
2. Pathway Alignment: Map their strengths to specific degree structures (Bac+2, Bac+3, Bac+5) and career trajectories.
3. Comparative Analysis: Evaluate options side-by-side (e.g., Public vs. Private, EST+LP vs. CPGE+Engineering School).
4. Concrete Next Steps: Provide actionable guidance (entrance exam dates, threshold trends, key skills to develop).

### REQUIRED DATA COLLECTION (FOR ORIENTCOMPANION DOSSIER)
Throughout the conversational discovery, you must progressively gather:
1. Notes académiques (academicScores) : échelle de 0 à 20.
2. Centres d'intérêt (interests) : échelle de 0 à 100.
3. Profil psychométrique RIASEC (personalityScores) : scores Réaliste (R), Investigateur (I), Artistique (A), Social (S), Entreprenant (E), Conventionnel (C) sur une échelle de 0 à 100.

EXIGENCE STRICTE SUR LES NOMS DE MATIÈRES (pour academicScores et interests) :
Utilisez UNIQUEMENT les noms exacts suivants :
• Mathématiques • Informatique • Physique • Chimie • Biologie • Électronique
• Statistiques • Réseaux • Géologie • Sciences de la Terre • Économie
• Français • Anglais • Histoire • Géographie • Philosophie • Sciences sociales • Arts Plastiques

### CONSTRAINTS & BEHAVIORAL RULES
- Do not make up fake school names, unverified admission thresholds, or nonexistent accreditation status.
- Keep conversational turns concise (under 200 words per reply) to encourage back-and-forth dialog.
- Ask one or two focused questions at a time.
- When generating structured recommendation summaries, output valid JSON blocks alongside human-readable explanations.
- Never output raw internal variable names or technical code markers to the user outside the json code block.
- Once you have gathered sufficient data to formulate recommendations (usually between 5 to 7 turns), provide your structured guidance and append IMPERATIVELY the following strict JSON block at the very end of your final reply:

\`\`\`json
{
  "isFinished": true,
  "assessmentData": {
    "personalityScores": {
      "R": 45.0, "I": 85.0, "A": 30.0, "S": 50.0, "E": 60.0, "C": 70.0
    },
    "academicScores": {
      "Mathématiques": 16.5,
      "Informatique": 18.0
    },
    "interests": {
      "Informatique": 95.0,
      "Mathématiques": 80.0
    }
  }
}
\`\`\`

### OUTPUT STYLING
- Use light bullet points and inline bolding for readability.
- When summarizing recommended options, highlight: Degree Level, Duration, Key Skills Required, and Typical Career Roles.
`;

// Helper to strip JSON output from raw message text
function cleanBotResponse(text) {
  if (!text) return "";
  return text.replace(/```json[\s\S]*?```/, "").trim();
}

// Helper to format bot and user markdown (bolding and bullet points)
function formatMessageContent(text) {
  if (!text) return "";
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim().startsWith("*");
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const formattedLine = parts.map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return (
      <div key={lineIdx} className={isBullet ? "chat-bullet-line" : "chat-text-line"}>
        {formattedLine}
      </div>
    );
  });
}

export default function CompleteAssessmentChatbot() {
  const { submitAssessment, loading: contextSubmitting, error: contextError } = useContext(AssessmentContext);
  const navigate = useNavigate();
  const location = useLocation();


  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [error, setError] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      if (!apiKey) {
        setError("Clé API Gemini introuvable dans le fichier .env (VITE_GEMINI_API_KEY).");
        return;
      }

      try {
        setLoading(true);
        const session = ai.chats.create({
          model: "gemini-3.6-flash",
          config: { systemInstruction: SYSTEM_INSTRUCTION },
        });
        setChatSession(session);

        const response = await session.sendMessage({
          message: "Bonjour ! Accueillez-moi en tant que Companion Orient et commencez notre entretien d'orientation selon votre méthodologie.",
        });

        setMessages([{ sender: "bot", text: cleanBotResponse(response.text) }]);
      } catch (err) {
        console.error("Erreur d'initialisation Gemini:", err);
        setError("Erreur lors de l'initialisation du conseiller Companion Orient. Vérifiez votre connexion internet.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || contextSubmitting || !chatSession) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userText });
      const rawText = response.text;

      setMessages((prev) => [...prev, { sender: "bot", text: cleanBotResponse(rawText) }]);

      // Extraction du JSON d'évaluation finale
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed.isFinished && parsed.assessmentData) {
            setIsFinished(true);
            setAssessmentResult(parsed.assessmentData);

            // Envoi au backend via AssessmentContext
            const success = await submitAssessment(parsed.assessmentData);
            if (success) {
              // Post-Assessment Flow :
              // Si AssessmentGuard a mémorisé la destination dans location.state,
              // on y redirige directement ; sinon, fallback vers /recommendations.
              const redirectTarget =
                location.state?.redirectAfterAssessment ?? "/recommendations";
              navigate(redirectTarget, { replace: true });
            }
          }
        } catch (pErr) {
          console.error("Erreur de parsing du JSON d'évaluation:", pErr);
        }
      }
    } catch (err) {
      console.error("Erreur de communication avec Gemini:", err);
      setError("Délai d'attente dépassé ou erreur de communication avec l'IA. Veuillez renvoyer votre réponse.");
    } finally {
      setLoading(false);
    }
  };

  const personalityLabels = {
    R: "Réaliste",
    I: "Investigateur",
    A: "Artistique",
    S: "Social",
    E: "Entreprenant",
    C: "Conventionnel",
  };

  // Theme state synced with landing page
  const [theme] = useState(() => {
    return localStorage.getItem("orient_theme") || "light";
  });

  return (
    <div className="chat-page-root" data-theme={theme}>
      {/* Subtle Embossed Circuit / Pathway Layer */}
      <div className="chat-circuit-layer" aria-hidden="true">
        <svg className="chat-circuit-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuitGridChat" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 40 80 L 120 80 L 120 160 L 200 160 L 200 240" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <path d="M 0 120 L 80 120 L 80 200 L 160 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.12" />
              <circle cx="40" cy="80" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="120" cy="160" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
              <circle cx="80" cy="200" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitGridChat)" />
        </svg>
      </div>

      {/* Steps / Methodology Tracker */}
      <div className="chat-steps-bar">
        <div className={`chat-nav-step-chip ${messages.length >= 0 ? "active" : ""}`}>
          <span className="step-num">01</span>
          <span>Découverte</span>
        </div>
        <div className={`chat-nav-step-chip ${messages.length > 2 ? "active" : ""}`}>
          <span className="step-num">02</span>
          <span>Filières</span>
        </div>
        <div className={`chat-nav-step-chip ${messages.length > 4 ? "active" : ""}`}>
          <span className="step-num">03</span>
          <span>Comparatif</span>
        </div>
        <div className={`chat-nav-step-chip ${messages.length > 6 ? "active" : ""}`}>
          <span className="step-num">04</span>
          <span>Recommandations</span>
        </div>
      </div>

      {/* Chatbot Frosted Glass Window Container */}
      <div className="chat-card-container">
        {/* Chat Messages Scroll Area */}
        <div className="chat-messages-scroll">
          <div className="chat-messages-inner">
            {(error || contextError) && (
              <div className="error-banner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error || contextError}</span>
              </div>
            )}

          {messages.map((msg, idx) => {
            const isBot = msg.sender === "bot";
            return (
              <div key={idx} className={`chat-msg-row ${isBot ? "bot" : "user"}`}>
                <div className={`chat-msg-avatar ${isBot ? "avatar-bot" : "avatar-user"}`}>
                  {isBot ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>

                <div className="chat-bubble-card">
                  {formatMessageContent(msg.text)}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="chat-typing-row">
              <div className="chat-msg-avatar avatar-bot">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div className="chat-typing-bubble">
                <div className="chat-typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="chat-typing-label">Companion Orient analyse vos options...</span>
              </div>
            </div>
          )}

          {/* Context Submitting State */}
          {contextSubmitting && (
            <div className="chat-typing-row">
              <div className="chat-typing-bubble" style={{ borderLeft: "4px solid #10b981" }}>
                <span className="chat-typing-label">Enregistrement de votre profil d'orientation...</span>
              </div>
            </div>
          )}

          {/* Celebration Card When Assessment is Finished */}
          {isFinished && assessmentResult && (
            <div className="chat-completion-card">
              <div className="completion-header">
                <div className="completion-icon-trophy">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
                    <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                  </svg>
                </div>
                <div>
                  <h3>Bilan d'orientation finalisé avec succès !</h3>
                  <p>Vos scores Holland RIASEC et vos préférences académiques ont été enregistrés.</p>
                </div>
              </div>

              {assessmentResult.personalityScores && (
                <div className="riasec-scores-summary">
                  <div className="riasec-scores-title">Profil Holland RIASEC</div>
                  <div className="riasec-bars-grid">
                    {Object.entries(assessmentResult.personalityScores).map(([key, score]) => (
                      <div key={key} className="riasec-bar-item">
                        <div className="riasec-bar-track">
                          <div
                            className="riasec-bar-fill"
                            style={{ height: `${Math.min(Math.max(score, 10), 100)}%` }}
                          ></div>
                        </div>
                        <span className="riasec-bar-letter">{key}</span>
                        <span className="riasec-bar-value">{Math.round(score)}%</span>
                        <span style={{ fontSize: "0.65rem", color: "#cbd5e1" }}>
                          {personalityLabels[key] || key}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="completion-actions">
                <button className="btn-view-recs" onClick={() => navigate("/recommendations")}>
                  <span>Découvrir mes écoles &amp; filières recommandées</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Form Bar */}
        <form onSubmit={handleSendMessage} className="chat-input-form-bar">
          <div className="chat-input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question ou répondez à Companion Orient..."
              className="chat-text-input"
              disabled={loading || contextSubmitting || !!error}
            />
            <button
              type="submit"
              disabled={loading || contextSubmitting || !input.trim() || !!error}
              className="chat-send-btn"
            >
              <span>Envoyer</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}