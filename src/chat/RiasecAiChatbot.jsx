import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
import { AssessmentContext } from "../context/AssessmentContext";
import "./RiasecAiChatbot.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const SYSTEM_INSTRUCTION = `
You are "Companion Orient", an empathetic academic counselor specialized in Moroccan higher education.
Workflow:
1. Discovery: Bac branch, grades, RIASEC preferences.
2. Pathway Alignment: Bac+2, Bac+3, Bac+5, CPGE, EST, FST, ENCG, ENSAM, Universities.
3. Concrete guidance with concise replies (<200 words).
Required scores:
- academicScores (0-20): Mathématiques, Informatique, Physique, Chimie, Biologie, Électronique, Statistiques, Réseaux, Géologie, Sciences de la Terre, Économie, Français, Anglais, Histoire, Géographie, Philosophie, Sciences sociales, Arts Plastiques.
- interests (0-100): using the same subjects.
- personalityScores (0-100): R, I, A, S, E, C.

At the end of the assessment, append IMPERATIVELY this strict JSON block:
\`\`\`json
{
  "isFinished": true,
  "assessmentData": {
    "personalityScores": { "R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0 },
    "academicScores": {},
    "interests": {}
  }
}
\`\`\`
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

export default function CompleteAssessmentChatbot() {
  const { submitAssessment, loading: contextSubmitting, error: contextError } = useContext(AssessmentContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [error, setError] = useState("");
  const [assessmentResult, setAssessmentResult] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!apiKey) {
      setError("Clé API Gemini manquante (VITE_GEMINI_API_KEY).");
      return;
    }

    const startChat = async () => {
      try {
        setLoading(true);
        const session = ai.chats.create({
          model: "gemini-3.6-flash",
          config: { systemInstruction: SYSTEM_INSTRUCTION },
        });
        setChatSession(session);

        const res = await session.sendMessage({
          message: "Bonjour ! Accueillez-moi en tant que Companion Orient et démarrez l'entretien.",
        });
        setMessages([{ sender: "bot", text: cleanBotResponse(res.text) }]);
      } catch (err) {
        console.error("Init error:", err);
        setError("Impossible de contacter le conseiller d'orientation.");
      } finally {
        setLoading(false);
      }
    };

    startChat();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading || contextSubmitting || !chatSession) return;

    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: query });
      const rawText = response.text;
      setMessages((prev) => [...prev, { sender: "bot", text: cleanBotResponse(rawText) }]);

      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed?.isFinished && parsed?.assessmentData) {
          setAssessmentResult(parsed.assessmentData);
          const ok = await submitAssessment(parsed.assessmentData);
          if (ok) {
            const redirect = location.state?.redirectAfterAssessment ?? "/recommendations";
            navigate(redirect, { replace: true });
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError("Erreur de connexion. Veuillez réessayer.");
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
                  <span className="chat-typing-label">Companion Orient analyse vos options...</span>
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
              placeholder="Posez votre question ou répondez à Companion Orient..."
              className="chat-text-input"
              disabled={loading || contextSubmitting || !!error}
            />
            <button
              type="submit"
              disabled={loading || contextSubmitting || !input.trim() || !!error}
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
            <div key={lIdx} className={line.trim().startsWith("-") || line.trim().startsWith("•") ? "chat-bullet-line" : "chat-text-line"}>
              {parts.map((p, pIdx) =>
                p.startsWith("**") && p.endsWith("**") ? <strong key={pIdx}>{p.slice(2, -2)}</strong> : p
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
      <h3>🎉 Bilan d'orientation finalisé avec succès !</h3>
      <p>Vos scores Holland RIASEC et vos préférences académiques ont été enregistrés.</p>

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
        Découvrir mes écoles &amp; filières recommandées →
      </button>
    </div>
  );
}