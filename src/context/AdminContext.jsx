import { createContext, useState } from "react";
import { AdminApi } from "../api/AdminApi";

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminFields, setAdminFields] = useState([]);
  const [adminSchools, setAdminSchools] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [adminSessions, setAdminSessions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des statistiques.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminApi.getRecentAssessments();
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setRecentAssessments(list);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des bilans.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminApi.getUsers();
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setUsers(list);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await AdminApi.createUser(formData);
      setUsers((prev) => [...prev, newUser]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de créer l'utilisateur.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await AdminApi.toggleUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, enabled: newStatus === "ACTIVE" } : u))
      );
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification du statut.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (userId, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      await AdminApi.resetUserPassword(userId, newPassword);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await AdminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminFields = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminApi.getFields(params);
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setAdminFields(list);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des filières.");
    } finally {
      setLoading(false);
    }
  };

  const createField = async (fieldData) => {
    setLoading(true);
    setError(null);
    try {
      const newField = await AdminApi.createField(fieldData);
      setAdminFields((prev) => [newField, ...prev]);
      return newField;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création de la filière.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (id, fieldData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await AdminApi.updateField(id, fieldData);
      setAdminFields((prev) => prev.map((f) => (f.id === id ? updated : f)));
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification de la filière.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteField = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await AdminApi.deleteField(id);
      setAdminFields((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression de la filière.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminSchools = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminApi.getSchools(params);
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setAdminSchools(list);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des écoles.");
    } finally {
      setLoading(false);
    }
  };

  const createSchool = async (schoolData) => {
    setLoading(true);
    setError(null);
    try {
      const newSchool = await AdminApi.createSchool(schoolData);
      setAdminSchools((prev) => [newSchool, ...prev]);
      return newSchool;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création de l'école.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSchool = async (id, schoolData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await AdminApi.updateSchool(id, schoolData);
      setAdminSchools((prev) => prev.map((s) => (s.id === id ? updated : s)));
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification de l'école.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchool = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await AdminApi.deleteSchool(id);
      setAdminSchools((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression de l'école.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminApi.getAssessments();
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setAssessments(list);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des bilans.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminApi.getMentorshipSessions();
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setAdminSessions(list);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des séances.");
    } finally {
      setLoading(false);
    }
  };

  const updateAdminSessionStatus = async (sessionId, status) => {
    setLoading(true);
    setError(null);
    try {
      await AdminApi.updateMentorshipSessionStatus(sessionId, status);
      setAdminSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status } : s))
      );
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du statut.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const data = await AdminApi.getAuditLogs();
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setAuditLogs(list);
    } catch {
      setAuditLogs([]);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        stats,
        recentAssessments,
        users,
        adminFields,
        adminSchools,
        assessments,
        adminSessions,
        auditLogs,
        loading,
        error,

        fetchStats,
        fetchRecentAssessments,
        fetchUsers,
        createUser,
        toggleUserStatus,
        resetUserPassword,
        deleteUser,
        fetchAdminFields,
        createField,
        updateField,
        deleteField,
        fetchAdminSchools,
        createSchool,
        updateSchool,
        deleteSchool,
        fetchAssessments,
        fetchAdminSessions,
        updateAdminSessionStatus,
        fetchAuditLogs,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
