import { createContext, useState, useCallback } from "react";
import { SchoolApi } from "../api/schoolApi";

export const SchoolContext = createContext();

export function SchoolProvider({ children }) {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchools = useCallback(async (fieldId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await SchoolApi.findAll(fieldId);
      setSchools(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des écoles.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSchoolById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await SchoolApi.findById(id);
      setSelectedSchool(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "École introuvable.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSchool = async (schoolData) => {
    setLoading(true);
    setError(null);
    try {
      const newSchool = await SchoolApi.create(schoolData);
      setSchools((prev) => [...prev, newSchool]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création de l'école.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSchool = async (id, schoolData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSchool = await SchoolApi.update(id, schoolData);
      setSchools((prev) => prev.map((s) => (s.id === id ? updatedSchool : s)));
      if (selectedSchool?.id === id) setSelectedSchool(updatedSchool);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification de l'école.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchool = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await SchoolApi.delete(id);
      setSchools((prev) => prev.filter((s) => s.id !== id));
      if (selectedSchool?.id === id) setSelectedSchool(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression de l'école.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        schools,
        selectedSchool,
        loading,
        error,
        fetchSchools,
        fetchSchoolById,
        createSchool,
        updateSchool,
        deleteSchool,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}
