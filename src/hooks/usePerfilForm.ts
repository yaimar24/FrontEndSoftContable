import { useState, useEffect } from 'react';
import { getColegioIdFromToken } from '../utils/jwt';
import { getParametros } from '../services/colegio/parametrosService';
import { getColegioById, updateColegio } from '../services/colegio/colegioService';
import type { Colegio } from '../models/Colegio';


export const usePerfilForm = (token: string | null) => {
  const colegioId = getColegioIdFromToken(token);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Colegio>>({});
  const [parametros, setParametros] = useState<any>(null);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: '' });

  useEffect(() => {
    if (colegioId) {
      Promise.all([getColegioById(colegioId), getParametros()])
        .then(([colegioData, parametrosData]) => {
          setFormData(colegioData);
          setParametros(parametrosData);
        })
        .catch(err => console.error("Error:", err))
        .finally(() => setLoading(false));
    }
  }, [colegioId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleRepChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const reps = [...(prev.representantesLegales || [])];
      reps[index] = { ...reps[index], [field]: value };
      return { ...prev, representantesLegales: reps };
    });
  };

  const handleSave = async () => {
    if (!colegioId) return;
    setShowConfirm(false);
    setIsSaving(true);
    try {
      const result = await updateColegio(colegioId, formData);
      setResultModal({
        show: true,
        success: result.success,
        message: result.success ? "Actualizado correctamente." : (result.message || "Error al guardar.")
      });
    } catch (error) {
      setResultModal({ show: true, success: false, message: "Error de servidor." });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    colegioId, loading, isSaving, formData, parametros,
    showConfirm, setShowConfirm, resultModal, setResultModal,
    handleChange, handleRepChange, handleSave
  };
};