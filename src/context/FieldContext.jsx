import { createContext, useState, useCallback } from "react";
import { FieldApi } from "../api/fieldApi";

export const FieldContext = createContext();

export function FieldProvider({ children }) {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFields = useCallback(async (category, search) => {
    setLoading(true);
    setError(null);
    try {
      const data = await FieldApi.findAll(category, search);
      setFields(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des filières.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFieldById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await FieldApi.findById(id);
      setSelectedField(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Filière introuvable.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createField = async (fieldData) => {
    setLoading(true);
    setError(null);
    try {
      const newField = await FieldApi.create(fieldData);
      setFields((prev) => [...prev, newField]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création de la filière.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (id, fieldData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedField = await FieldApi.update(id, fieldData);
      setFields((prev) => prev.map((f) => (f.id === id ? updatedField : f)));
      if (selectedField?.id === id) setSelectedField(updatedField);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification de la filière.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteField = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await FieldApi.delete(id);
      setFields((prev) => prev.filter((f) => f.id !== id));
      if (selectedField?.id === id) setSelectedField(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression de la filière.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FieldContext.Provider
      value={{
        fields,
        selectedField,
        loading,
        error,
        fetchFields,
        fetchFieldById,
        createField,
        updateField,
        deleteField,
      }}
    >
      {children}
    </FieldContext.Provider>
  );
}
