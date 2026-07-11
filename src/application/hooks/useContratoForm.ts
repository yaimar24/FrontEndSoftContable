import { useEffect, useState } from "react";

import type {
ContratoCreateDTO,
ContratoUpdateDTO
} from "../../domain/models/Contrato";
import type { Parametros } from "../../domain/models/Parametros";

import {
crearContrato,
updateContrato
} from "../../data/services/contrato/contratoService";
import { getParametros } from "../../data/services/colegio/parametrosService";

interface ResultModal {
show: boolean;
success: boolean;
message: string;
}

const initialState: ContratoCreateDTO = {
colegioId: "",
empleadoId: "",

cargoId: 0,
centroCostoId: 0,

tipoContrato: "Indefinido",
salarioBase: 0,

fechaInicio: "",
fechaFin: "",

auxilioTransporte: false,
aplicaHorasExtra: false,
};

export const useContratoForm = (
empleadoId: string,
initialData?: ContratoUpdateDTO | null
) => {
const [formData, setFormData] = useState<ContratoCreateDTO>({
    ...initialState,
    empleadoId,
});

const [errors, setErrors] = useState<any>({});

const [parametros, setParametros] = useState<Parametros>();

const [showConfirm, setShowConfirm] = useState(false);

const [resultModal, setResultModal] = useState<ResultModal>({
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
    if (empleadoId) {
    setFormData((prev) => ({ ...prev, empleadoId }));
    }
}, [empleadoId]);

useEffect(() => {
    if (initialData) {
    setFormData(initialData);
    }
}, [initialData]);


const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
    const target = e.target as HTMLInputElement; // Cast temporal para leer .checked si es un input
    const { name, value, type } = e.target;

    let finalValue: any = value;

    // 1. Si es un checkbox (auxilioTransporte, aplicaHorasExtra), extraemos su estado booleano
    if (type === "checkbox") {
    finalValue = target.checked;
    } 
    // 2. Si el campo es el salario o un ID, nos aseguramos de guardarlo como número y no como string
    else if (name === "salarioBase" || name.endsWith("Id")) {
    finalValue = value === "" ? 0 : Number(value);
    }

    setFormData((prev) => ({
    ...prev,
    [name]: finalValue,
    }));
};

const validate = () => {
    const newErrors: any = {};

    if (!formData.tipoContrato) 
    newErrors.tipoContrato = "Requerido";

    if (!formData.fechaInicio) 
    newErrors.fechaInicio = "Requerido";

    // Validamos que el salario sea un número real mayor a cero
    if (!formData.salarioBase || formData.salarioBase <= 0) {
    newErrors.salarioBase = "El salario debe ser mayor a 0";
    }

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
        ? await updateContrato(initialData.id, {
            ...initialData,
            ...formData,
        })
        : await crearContrato(formData);

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