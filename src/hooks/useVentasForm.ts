import { useState, useEffect } from "react";
import type { FacturaVentaCreateDTO, FacturaDetalleCreateDTO } from "../models/Venta";
import { createVenta, updateVenta, getProximoNumeroFactura } from "../services/venta/ventaService";      
import { getColegioIdFromToken } from "../utils/jwt";

export const useVentasForm = (token: string | null, initialData?: any) => {
  const colegioId = getColegioIdFromToken(token) || "";

  const [formData, setFormData] = useState<FacturaVentaCreateDTO>({
    tipoFacturaId: initialData?.tipoFacturaId || 1,
    clienteId: initialData?.clienteId || "",
    vendedorId: colegioId, // Usamos el ID del colegio emisor
    colegioId: colegioId,
    fechaElaboracion: initialData?.fechaElaboracion ? new Date(initialData.fechaElaboracion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    detalles: initialData?.detalles || [],
  });

  const [numeroDisplay, setNumeroDisplay] = useState<string>(initialData?.numero || "");
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.tipoFacturaId && !initialData?.id) {
      getProximoNumeroFactura(formData.tipoFacturaId).then(res => {
        if (res.success && res.data) {
          setNumeroDisplay(res.data);
        }
      });
    }
  }, [formData.tipoFacturaId, initialData?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FacturaVentaCreateDTO) => ({
      ...prev,
      [name]: name === "tipoFacturaId" ? Number(value) : value,
    }));
  };

  const handleDetallesChange = (detalles: FacturaDetalleCreateDTO[]) => {       
    setFormData((prev: FacturaVentaCreateDTO) => ({ ...prev, detalles }));  };
  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      let response;
      if (initialData?.id) {
        response = await updateVenta(initialData.id, formData);
      } else {
        response = await createVenta(formData);
      }
      setResultModal({
        show: true,
        success: response.success,
        message: response.success ? "Venta guardada exitosamente" : response.message || "Error al guardar la venta",
      });
    } catch (error) {
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
    handleDetallesChange,
    handleConfirmSave,
  };
};