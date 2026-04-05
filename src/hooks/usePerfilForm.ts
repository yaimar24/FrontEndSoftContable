import { useState, useEffect } from 'react';
import { getColegioIdFromToken } from '../utils/jwt';
import { getParametros } from '../services/colegio/parametrosService';
import { getColegioById, updateColegio } from '../services/colegio/colegioService';
import type { Colegio } from '../models/Colegio';


export const usePerfilForm = (token: string | null) => {
  const colegioId = getColegioIdFromToken(token);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Colegio>>({});
  const [parametros, setParametros] = useState<any>(null);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: '' });

  useEffect(() => {
    if (colegioId) {
      Promise.all([getColegioById(), getParametros()])
        .then(([colegioResponse, parametrosResponse]) => {
          if (colegioResponse.success && colegioResponse.data) {
            setFormData(colegioResponse.data);
            localStorage.setItem('perfilInstitucional', JSON.stringify(colegioResponse.data));
            if (colegioResponse.data.logoPath) {
              const logo = colegioResponse.data.logoPath;
              localStorage.setItem('logoUrl', logo);
              window.dispatchEvent(new CustomEvent('logoUpdate', { detail: logo }));
            }
          }
          if (parametrosResponse.success && parametrosResponse.data) {
            setParametros(parametrosResponse.data);
          }
        })
        .catch(err => console.error("Error:", err))
    }
  }, [colegioId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        setFormData(prev => ({ ...prev, [name]: target.files![0] }));
      }
    } else {
      const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      setFormData(prev => ({ ...prev, [name]: val }));
    }
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
      if (result.success && result.data) {
        setFormData(result.data); // Update local form with correct path
        localStorage.setItem('perfilInstitucional', JSON.stringify(result.data));

        if (result.data.logoPath) {
          const logo = result.data.logoPath;
          localStorage.setItem('logoUrl', logo);
          window.dispatchEvent(new CustomEvent('logoUpdate', { detail: logo }));
        }
      }

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
    colegioId, isSaving, formData, parametros,
    showConfirm, setShowConfirm, resultModal, setResultModal,
    handleChange, handleRepChange, handleSave
  };
};