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
  const [loading, setLoading] = useState(true);
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
    email: "",
    indicativo: "+57",
    codigoPostal: "",
    contactoNombres: "",
    contactoApellidos: "",
    correoFacturacion: "",
    colegioId: "",
    categoriaId: 0,
    regimenIvaId: 0,
    ciudadId: 0,
    direccion: "",
    telefono: "",
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
      getParametros().then((data) => {
        setParametros(data);
        setLoading(false);
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
      
      email: [validators.required(), validators.email?.()],
      telefono: [validators.required()],

      // Ubicación
      ciudadId: [validators.requiredSelect("La ciudad es obligatoria")],
      direccion: [validators.required()],

      // Sección Fiscal
      correoFacturacion: [validators.required(), validators.email?.()],
      codigoPostal: [validators.required()],
      categoriaId: [validators.requiredSelect("La categoría es obligatoria")],
      regimenIvaId: [validators.requiredSelect("El régimen es obligatorio")],
    };

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
      const payload = { ...formData, colegioId };
      
      const result = initialData?.id
        ? await updateTercero(initialData.id, { ...payload, id: initialData.id } as any)
        : await vincularTercero(payload);

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
    formData, parametros, loading, isSaving, errors,
    showConfirm, resultModal, setShowConfirm, setResultModal,
    handleChange, handleCheckboxChange, handleSaveClick, handleConfirmSave,
  };
};