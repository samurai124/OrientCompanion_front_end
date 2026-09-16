import { createContext, useState, useCallback } from "react";
import { MentorshipApi } from "../api/mentorshipApi";

export const MentorshipContext = createContext();

export function MentorshipProvider({ children }) {
  const [counselors, setCounselors] = useState([]);
  const [studentSessions, setStudentSessions] = useState([]);
  const [counselorSessions, setCounselorSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Student Actions ---

  // Fetch available counselors (optionally filtered by field)
  const fetchAvailableCounselors = useCallback(async (fieldId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await MentorshipApi.getAvailableCounselors(fieldId);
      setCounselors(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des conseillers.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Request a new mentorship session
  const requestSession = async (counselorId) => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await MentorshipApi.requestSession(counselorId);
      setStudentSessions((prev) => [...prev, newSession]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la demande de séance.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch requested sessions history for student
  const fetchMySessionsAsStudent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await MentorshipApi.getMySessionsAsStudent();
      setStudentSessions(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des séances.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Counselor Actions ---

  // Fetch assigned sessions for counselor
  const fetchMySessionsAsCounselor = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await MentorshipApi.getMySessionsAsCounselor();
      setCounselorSessions(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des séances.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update session status or details (accept, reject, reschedule)
  const updateSession = async (sessionId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await MentorshipApi.updateSession(sessionId, updateData);
      setCounselorSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? updated : s))
      );
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour de la séance.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MentorshipContext.Provider
      value={{
        counselors,
        studentSessions,
        counselorSessions,
        loading,
        error,
        fetchAvailableCounselors,
        requestSession,
        fetchMySessionsAsStudent,
        fetchMySessionsAsCounselor,
        updateSession,
      }}
    >
      {children}
    </MentorshipContext.Provider>
  );
}
