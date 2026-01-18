import { useState, useEffect } from "react";
import { getColegioIdFromToken } from "../utils/jwt";
import type { TerceroCreateDTO, TerceroupdateDTO } from "../models/Tercero";
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
    tipoPersonaId: 1,
    tipoIdentificacionId: 1,
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
    categoriaId: 1,
    regimenIvaId: 1,
    ciudadId: 1,
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

  // Carga de parámetros
  useEffect(() => {
    if (colegioId) {
      getParametros().then((data) => {
        setParametros(data);
        setLoading(false);
      });
    }
  }, [colegioId]);

  // Sincronización de datos para EDICIÓN
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "identificacion") newData.dv = calcularDV(value).toString();
      return newData;
    });
  };

  const handleCheckboxChange = (id: number) => {
    setFormData((prev) => {
      const currentIds = prev.responsabilidadesFiscalesIds || [];
      const newIds = currentIds.includes(id)
        ? currentIds.filter((i) => i !== id)
        : [...currentIds, id];
      return { ...prev, responsabilidadesFiscalesIds: newIds };
    });
  };

  const handleSaveClick = () => {
    const schema = {
      identificacion: [validators.required()],
      email: [
        validators.required(),
        validators.email?.() || validators.required(),
      ],
      ...(formData.tipoPersonaId === 1
        ? { nombres: [validators.required()] }
        : { nombreComercial: [validators.required()] }),
    };
    const validationErrors = validateForm(formData, schema) as Record<
      string,
      string
    >;
    if (Object.keys(validationErrors).length === 0) setShowConfirm(true);
    else {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

const handleConfirmSave = async () => {
  if (!colegioId) return;
  setShowConfirm(false);
  setIsSaving(true);

  try {
    const payload = { ...formData, colegioId } as TerceroupdateDTO | TerceroCreateDTO;

    // Llamada a API según si existe id
    const result = initialData?.id
      ? await updateTercero(initialData.id, { ...payload, id: initialData.id })
      : await vincularTercero(payload);

    setResultModal({
      show: true,
      success: result.success,
      message: result.success ? "Éxito en la operación." : result.message,
    });

  } catch (err: unknown) {
    setResultModal({
      show: true,
      success: false,
      message: err instanceof Error ? err.message : "Error de red.",
    });
  } finally {
    setIsSaving(false);
  }
};

  return {
    formData,
    parametros,
    loading,
    isSaving,
    errors,
    showConfirm,
    resultModal,
    setShowConfirm,
    setResultModal,
    handleChange,
    handleCheckboxChange,
    handleSaveClick,
    handleConfirmSave,
  };
};
