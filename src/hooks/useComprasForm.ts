import { useState, useEffect } from "react";
import type { FacturaCompraCreateDTO, FacturaCompraDetalleCreateDTO } from "../models/FacturaCompra";
import { createCompra, getProximoNumeroFacturaCompra } from "../services/compra/compraService";

export const useComprasForm = (initialData?: Partial<FacturaCompraCreateDTO> & { id?: number, numero?: string }) => {
  const [formData, setFormData] = useState<FacturaCompraCreateDTO>({
    tipoFacturaId: initialData?.tipoFacturaId || 1, // o el id que corresponda a "FACTURA DE COMPRA"
    proveedorId: initialData?.proveedorId || "",
    fechaElaboracion: initialData?.fechaElaboracion ? new Date(initialData.fechaElaboracion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    detalles: initialData?.detalles || [],
  });

  const [numeroDisplay, setNumeroDisplay] = useState<string>(initialData?.numero || "");
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.tipoFacturaId && !initialData?.id) {
      getProximoNumeroFacturaCompra(formData.tipoFacturaId).then(res => {
        if (res.success && res.data) {
          setNumeroDisplay(res.data);
        }
      });
    }
  }, [formData.tipoFacturaId, initialData?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FacturaCompraCreateDTO) => ({
      ...prev,
      [name]: name === "tipoFacturaId" ? Number(value) : value,
    }));
  };

  const setProveedorId = (id: string) => {
    setFormData(prev => ({ ...prev, proveedorId: id }));
  }

  const handleDetallesChange = (detalles: FacturaCompraDetalleCreateDTO[]) => {       
    setFormData((prev: FacturaCompraCreateDTO) => ({ ...prev, detalles }));      
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const response = await createCompra(formData);
      setResultModal({
        show: true,
        success: response.success,
        message: response.success ? "Compra guardada exitosamente" : response.message || "Error al guardar la compra",
      });
    } catch {
      setResultModal({
        show: true,
        success: false,
        message: "Ocurrió un error inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    numeroDisplay,
    loading,
    showConfirm,
    resultModal,
    setShowConfirm,
    setResultModal,
    handleChange,
    setProveedorId,
    handleDetallesChange,
    handleConfirmSave,
  };
};