import { useState, useEffect } from 'react';
import { getColegioIdFromToken } from '../../utils/jwt';
import { getParametros } from '../../data/services/colegio/parametrosService';
import { getColegioById, updateColegio } from '../../data/services/colegio/colegioService';
import type { Colegio } from '../../domain/models/Colegio';
import type { Parametros } from '../../domain/models/Parametros';


export const usePerfilForm = (token: string | null) => {
  const colegioId = getColegioIdFromToken(token);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Colegio>>({});
  const [parametros, setParametros] = useState<Parametros | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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

  const handleRepChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const reps = [...(prev.representantesLegales || [])];
      reps[index] = { ...reps[index], [field]: value };
      return { ...prev, representantesLegales: reps };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombreColegio?.trim()) newErrors.nombreColegio = "El nombre es obligatorio";
    if (!formData.nit?.trim()) newErrors.nit = "El NIT es obligatorio";
    if (!formData.municipioId) newErrors.municipioId = "Debes seleccionar un municipio";
    if (formData.tarifaIca === undefined || formData.tarifaIca === null || formData.tarifaIca === "") newErrors.tarifaIca = "La tarifa ICA es obligatoria";

    const rep = formData.representantesLegales?.[0];
    if (!rep?.nombre?.trim()) newErrors.repNombre = "El nombre del representante es obligatorio";
    if (!rep?.numeroIdentificacion?.trim()) newErrors.repNumeroIdentificacion = "La identificación del representante es obligatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmSave = () => {
    if (!validate()) return;
    setShowConfirm(true);
  };

  const handleSave = async () => {
    if (!colegioId) return;
    setShowConfirm(false);
    setIsSaving(true);
    try {
      const result = await updateColegio(colegioId, formData);
      if (result.success) {
        // Recargar los datos actualizados desde el servidor
        const [colegioResponse] = await Promise.all([getColegioById()]);
        
        if (colegioResponse.success && colegioResponse.data) {
            setFormData(colegioResponse.data);
            localStorage.setItem('perfilInstitucional', JSON.stringify(colegioResponse.data));

            if (colegioResponse.data.logoPath) {
              const logo = colegioResponse.data.logoPath;
              localStorage.setItem('logoUrl', logo);
              window.dispatchEvent(new CustomEvent('logoUpdate', { detail: logo }));
            }
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
    colegioId, isSaving, formData, parametros, errors,
    showConfirm, setShowConfirm, resultModal, setResultModal,
    handleChange, handleRepChange, handleSave, handleConfirmSave
  };
};