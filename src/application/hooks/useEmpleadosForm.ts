import { useEffect, useState } from "react";


import type {
  EmpleadoCreateDTO,
  EmpleadoUpdateDTO
} from "../../domain/models/Empleado";
import type { Parametros } from "../../domain/models/Parametros";

import {
  crearEmpleado,
  updateEmpleado
} from "../../data/services/empleado/empleadoService";
import { getParametros } from "../../data/services/colegio/parametrosService";

interface ResultModal {
  show: boolean;
  success: boolean;
  message: string;
}

const initialState: EmpleadoCreateDTO = {
  colegioId: "",

  nombres: "",
  apellidos: "",

  tipoIdentificacionId: 0,
  numeroDocumento: "",

  correoElectronico: "",
  numeroCelular: "",

  municipioResidenciaId: 0,
  direccionResidencia: "",

  medioPagoId: 0,

  bancoId: 0,
  tipoCuenta: 1,
  numeroCuenta: "",

  municipioOficinaId: 0,
  direccionOficina: "",
};

export const useEmpleadosForm = (
  // token: string, // Eliminado por no usarse
  initialData?: EmpleadoUpdateDTO | null
) => {

  const [formData, setFormData] =
    useState<EmpleadoCreateDTO>(initialState);

  const [errors, setErrors] = useState<any>({});


  const [parametros, setParametros] = useState<Parametros>();

  const [showConfirm, setShowConfirm] = useState(false);

  const [resultModal, setResultModal] =
    useState<ResultModal>({
      show: false,
      success: false,
      message: "",
    });


  useEffect(() => {
    getParametros().then((res) => {
      if (res.success && res.data) {
        setParametros(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {

    const newErrors: any = {};

    if (!formData.nombres)
      newErrors.nombres = "Requerido";

    if (!formData.apellidos)
      newErrors.apellidos = "Requerido";

    if (!formData.numeroDocumento)
      newErrors.numeroDocumento = "Requerido";

    if (!formData.tipoIdentificacionId)
      newErrors.tipoIdentificacionId = "Requerido";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (!validate()) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {

    try {

      const response = initialData
        ? await updateEmpleado(initialData.id, {
            ...initialData,
            ...formData,
          })
        : await crearEmpleado(formData);

      setResultModal({
        show: true,
        success: response.success,
        message: response.message,
      });

    } catch (error: any) {

      setResultModal({
        show: true,
        success: false,
        message: error.message || "Error",
      });

    } finally {
      setShowConfirm(false);
    }
  };

  return {
    formData,
    setFormData,

    parametros,
    setParametros,

    errors,

    showConfirm,
    setShowConfirm,

    resultModal,
    setResultModal,

    handleChange,

    handleSaveClick,
    handleConfirmSave,
  };
};