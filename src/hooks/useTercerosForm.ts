import { useState, useEffect } from "react";
import { getColegioIdFromToken } from "../utils/jwt";
import type { TerceroCreateDTO } from "../models/Tercero";
import { getParametros } from "../services/colegio/parametrosService";
import { calcularDV } from "../utils/calcularDV";
import {
  vincularTercero,
  updateTercero,
} from "../services/terceros/terceroService";
import { validators } from "../utils/validators";
import { validateForm } from "../utils/validateForm";

export const useTercerosForm = (token: string | null, initialData?: any) => {
  const colegioId = getColegioIdFromToken(token);
  const [isSaving, setIsSaving] = useState(false);
  const [parametros, setParametros] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<TerceroCreateDTO>({
    // Inicializamos en 0 para que sean numbers pero el validador los detecte como vacíos
    tipoPersonaId: 0,
    tipoIdentificacionId: 0,
    identificacion: "",
    dv: "",
    nombres: "",
    apellidos: "",
    nombreComercial: "",
    email: null,
    indicativo: "+57",
    codigoPostal: "",
    contactoNombres: "",
    contactoApellidos: "",
    correoFacturacion: "",
    colegioId: "",
    categoriaId: 0,
    regimenIvaId: 0,
    ciudadId: null,
    direccion: null,
    telefono: null,
    responsabilidadesFiscalesIds: [],
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({
    show: false,
    success: false,
    message: "",
  });

  // Carga de parámetros iniciales
  useEffect(() => {
    if (colegioId) {
      getParametros().then((res) => {
        if (res.success && res.data) {
          setParametros(res.data);
        }
      });
    }
  }, [colegioId]);

  // Sincronización para edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        nombres: initialData.nombres || "",
        apellidos: initialData.apellidos || "",
        nombreComercial: initialData.nombreComercial || "",
        responsabilidadesFiscalesIds:
          initialData.responsabilidadesFiscalesIds ||
          initialData.responsabilidades?.map((r: any) => r.id) ||
          [],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Limpiar error del campo cuando el usuario empieza a escribir o seleccionar
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    
    setFormData((prev) => {
      // Convertimos a número si el campo termina en 'Id'
      const val = name.endsWith('Id') ? Number(value) : value;
      const newData = { ...prev, [name]: val };
      
      if (name === "identificacion") newData.dv = calcularDV(value).toString();
      return newData;
    });
  };

  const handleCheckboxChange = (id: number) => {
    if (errors.responsabilidadesFiscalesIds) {
      setErrors(prev => ({ ...prev, responsabilidadesFiscalesIds: "" }));
    }

    setFormData((prev) => {
      const currentIds = prev.responsabilidadesFiscalesIds || [];
      const newIds = currentIds.includes(id)
        ? currentIds.filter((i) => i !== id)
        : [...currentIds, id];
      return { ...prev, responsabilidadesFiscalesIds: newIds };
    });
  };

  const handleSaveClick = () => {
    const schema: Record<string, any[]> = {
      // Usamos requiredSelect para que el valor 0 dispare el error
      tipoPersonaId: [validators.requiredSelect("Seleccione el tipo de persona")],
      tipoIdentificacionId: [validators.requiredSelect("Seleccione el tipo de documento")],
      identificacion: [validators.required()],

      // Información Condicional
      ...(formData.tipoPersonaId === 1
        ? { 
            nombres: [validators.required()], 
            apellidos: [validators.required()] 
          }
        : { 
            nombreComercial: [validators.required()] 
          }),
      
      // Sección Fiscal
      categoriaId: [validators.requiredSelect("La categoría es obligatoria")],
      regimenIvaId: [validators.requiredSelect("El régimen es obligatorio")],
    };

    // Agregar validador de formato email sólo si el campo email tiene algún valor
    if (formData.email && formData.email.trim() !== "") {
        schema.email = [validators.email?.()];
    }

    if (formData.correoFacturacion && formData.correoFacturacion.trim() !== "") {
        schema.correoFacturacion = [validators.email?.()];
    }

    const validationErrors = validateForm(formData, schema) as Record<string, string>;

  

    if (Object.keys(validationErrors).length === 0) {
      setShowConfirm(true);
    } else {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleConfirmSave = async () => {
    if (!colegioId) return;
    setShowConfirm(false);
    setIsSaving(true);

    try {
        const payload: Record<string, any> = { ...formData, colegioId };
        
        // Convert empty strings to null for optional fields to match backend requirements
        if (!payload.email || payload.email.trim() === "") payload.email = null;
        if (!payload.telefono || payload.telefono.trim() === "") payload.telefono = null;
        if (!payload.direccion || payload.direccion.trim() === "") payload.direccion = null;
        if (!payload.ciudadId || payload.ciudadId === 0) payload.ciudadId = null;

      const result = initialData?.id
        ? await updateTercero(initialData.id, { ...payload, id: initialData.id } as any)
        : await vincularTercero(payload as any);

      setResultModal({
        show: true,
        success: result.success,
        message: result.success ? "Tercero guardado con éxito." : result.message,
      });

    } catch (err: unknown) {
      setResultModal({
        show: true,
        success: false,
        message: err instanceof Error ? err.message : "Error inesperado al guardar.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData, parametros, isSaving, errors,
    showConfirm, resultModal, setShowConfirm, setResultModal,
    handleChange, handleCheckboxChange, handleSaveClick, handleConfirmSave,
  };
};