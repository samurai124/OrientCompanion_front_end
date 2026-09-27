import { createContext, useState } from "react";
import { CounselorApi } from "../api/CounselorApi";

export const CounselorContext = createContext();

export function CounselorProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [pendingAssessments, setPendingAssessments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const data = await CounselorApi.getProfile();
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error fetching counselor profile:", err);
      return null;
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CounselorApi.getSessions();
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setSessions(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des séances.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await CounselorApi.updateSession(id, updateData);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
      );
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de mettre à jour la séance.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CounselorApi.getPendingAssessments();
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setPendingAssessments(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des bilans.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (id, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      await CounselorApi.submitReview(id, reviewData);
      setPendingAssessments((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Impossible d'enregistrer l'avis.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CounselorApi.getStudents();
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setStudents(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des étudiants.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <CounselorContext.Provider
      value={{
        profile,
        sessions,
        pendingAssessments,
        students,
        loading,
        error,
        fetchProfile,
        fetchSessions,
        updateSession,
        fetchPendingAssessments,
        submitReview,
        fetchStudents,
      }}
    >
      {children}
    </CounselorContext.Provider>
  );
}
