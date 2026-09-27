import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AssessmentContext } from "../context/AssessmentContext";
import "./RiasecAiChatbot.css";

// --- MVP JURY DEMO : ÉVALUATION ULTRA-RAPIDE (2 ÉCHANGES) ---
const SYSTEM_INSTRUCTION = `
You are "Companion Orient", an AI counselor for Moroccan higher education.
This is a live jury demo (MVP): be concise, fast, and finish within 2 to 3 user turns max.

CONSTRAINTS:
- Keep your conversational answers very short (1 to 2 sentences, <40 words).
- Never ask long lists of questions. Ask at most 1 single direct question per reply.
- DO NOT ask the user to self-grade or calculate their scores. YOU must compute and infer all values.

FLOW (Target: Complete in 2 user replies):
1. First message: Welcome the student and ask only: Bac branch + main grades.
2. After user's 1st reply: Acknowledge briefly and ask 1 short question about work preference (e.g., "Aimez-vous créer des logiciels/machines concrètes ou analyser des données théoriques ?").
3. After user's 2nd reply (or immediately if the user already provided branch, grades, and passions): Conclude warmly in 1 sentence and APPEND THE STRICT JSON BLOCK BELOW.

REQUIRED JSON SUBJECT KEYS:
academicScores (0-20): Mathématiques, Informatique, Physique, Chimie, Biologie, Électronique, Statistiques, Réseaux, Géologie, Sciences de la Terre, Économie, Français, Anglais, Histoire, Géographie, Philosophie, Sciences sociales, Arts Plastiques.
interests (0-100): same keys.
personalityScores (0-100): R, I, A, S, E, C.

FINAL OUTPUT BLOCK (Must be strictly valid JSON):
\`\`\`json
{
  "isFinished": true,
  "assessmentData": {
    "personalityScores": { "R": 85, "I": 90, "A": 30, "S": 55, "E": 65, "C": 50 },
    "academicScores": { "Mathématiques": 17, "Informatique": 18, "Physique": 15 },
    "interests": { "Informatique": 95, "Mathématiques": 85, "Réseaux": 70 }
  }
}
\`\`\`
(Replace the values with your actual inferred scores based on the conversation).
`;

const PERSONALITY_LABELS = {
  R: "Réaliste",
  I: "Investigateur",
  A: "Artistique",
  S: "Social",
  E: "Entreprenant",
  C: "Conventionnel",
};

const cleanBotResponse = (text) => (text ? text.replace(/```json[\s\S]*?```/, "").trim() : "");

async function callGeminiDirect(history, userPrompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Clé API Gemini introuvable (VITE_GEMINI_API_KEY manquante dans le fichier .env).");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

  const contents = [
    ...history.map((msg) => ({
      role: msg.sender === "bot" ? "model" : "user",
      parts: [{ text: msg.rawText || msg.text }],
    })),
    { role: "user", parts: [{ text: userPrompt }] },
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Erreur de communication avec l'API Gemini.");
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export default function CompleteAssessmentChatbot() {
  const { submitAssessment, loading: contextSubmitting, error: contextError } = useContext(AssessmentContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assessmentResult, setAssessmentResult] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      try {
        setLoading(true);
        // Prompt concis pour démarrer immédiatement sur la question 1
        const startPrompt = "Démarre l'entretien avec une salutation courte (1 phrase) et demande ma filière de Bac ainsi que mes matières fortes.";
        const rawText = await callGeminiDirect([], startPrompt);

        if (isMounted) {
          setMessages([{ sender: "bot", text: cleanBotResponse(rawText), rawText }]);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Init Gemini Error:", err);
          setError(err.message || "Impossible de joindre le conseiller virtuel.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initChat();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading || contextSubmitting) return;

    const nextHistory = [...messages, { sender: "user", text: query, rawText: query }];
    setInput("");
    setMessages(nextHistory);
    setLoading(true);
    setError("");

    try {
      const rawText = await callGeminiDirect(messages, query);
      const displayMessage = { sender: "bot", text: cleanBotResponse(rawText), rawText };
      setMessages([...nextHistory, displayMessage]);

      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed?.isFinished && parsed?.assessmentData) {
            setAssessmentResult(parsed.assessmentData);
            const ok = await submitAssessment(parsed.assessmentData);
            if (ok) {
              const redirect = location.state?.redirectAfterAssessment ?? "/recommendations";
              navigate(redirect, { replace: true });
            }
          }
        } catch (jsonErr) {
          console.error("Erreur parsing JSON:", jsonErr);
          setError("Erreur lors de la génération du profil d'orientation.");
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Erreur de connexion avec l'IA.");
    } finally {
      setLoading(false);
    }
  };

  const stepActive = (threshold) => (messages.length >= threshold ? "active" : "");

  return (
    <div className="chat-page-root">
      <div className="chat-steps-bar">
        {["Découverte", "Filières", "Comparatif", "Recommandations"].map((label, idx) => (
          <div key={label} className={`chat-nav-step-chip ${stepActive(idx * 2)}`}>
            <span className="step-num">0{idx + 1}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="chat-card-container">
        <div className="chat-messages-scroll">
          <div className="chat-messages-inner">
            {(error || contextError) && (
              <div className="error-banner">⚠️ {error || contextError}</div>
            )}

            {messages.map((msg, idx) => (
              <ChatMessage key={idx} msg={msg} />
            ))}

            {loading && (
              <div className="chat-typing-row">
                <div className="chat-typing-bubble">
                  <div className="chat-typing-dots"><span /><span /><span /></div>
                  <span className="chat-typing-label">Companion Orient analyse votre profil (Scoring 60/40)...</span>
                </div>
              </div>
            )}

            {assessmentResult && (
              <RiasecCompletionCard
                result={assessmentResult}
                onNavigate={() => navigate("/recommendations")}
              />
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form-bar">
          <div className="chat-input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Bac SM, 17 en Maths, passionné par le code..."
              className="chat-text-input"
              disabled={loading || contextSubmitting}
            />
            <button
              type="submit"
              disabled={loading || contextSubmitting || !input.trim()}
              className="chat-send-btn"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({ msg }) {
  const isBot = msg.sender === "bot";
  return (
    <div className={`chat-msg-row ${isBot ? "bot" : "user"}`}>
      <div className={`chat-msg-avatar ${isBot ? "avatar-bot" : "avatar-user"}`}>
        {isBot ? "🤖" : "👤"}
      </div>
      <div className="chat-bubble-card">
        {msg.text.split("\n").map((line, lIdx) => {
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <div
              key={lIdx}
              className={line.trim().startsWith("-") || line.trim().startsWith("•") ? "chat-bullet-line" : "chat-text-line"}
            >
              {parts.map((p, pIdx) =>
                p.startsWith("**") && p.endsWith("**") ? (
                  <strong key={pIdx}>{p.slice(2, -2)}</strong>
                ) : (
                  p
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RiasecCompletionCard({ result, onNavigate }) {
  return (
    <div className="chat-completion-card">
      <h3>🎉 Bilan d'orientation finalisé en temps record !</h3>
      <p>L'algorithme de fusion 60/40 a calculé vos scores RIASEC et académiques.</p>

      {result.personalityScores && (
        <div className="riasec-bars-grid">
          {Object.entries(result.personalityScores).map(([key, score]) => (
            <div key={key} className="riasec-bar-item">
              <div className="riasec-bar-track">
                <div
                  className="riasec-bar-fill"
                  style={{ height: `${Math.min(Math.max(score, 10), 100)}%` }}
                />
              </div>
              <span className="riasec-bar-letter">{key}</span>
              <span className="riasec-bar-value">{Math.round(score)}%</span>
              <small>{PERSONALITY_LABELS[key] || key}</small>
            </div>
          ))}
        </div>
      )}

      <button className="btn-view-recs" onClick={onNavigate}>
        Voir mes recommandations personnalisées →
      </button>
    </div>
  );
}