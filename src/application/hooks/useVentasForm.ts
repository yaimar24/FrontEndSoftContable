import { useState, useEffect } from "react";
import type { FacturaVentaCreateDTO, FacturaDetalleCreateDTO } from "../../domain/models/Venta";
import { createVenta, updateVenta } from "../../data/services/venta/ventaService";
import { getParametrosFacturacion } from "../../data/services/colegio/parametrosService";
import { getColegioIdFromToken } from "../../utils/jwt";

export const useVentasForm = (token: string | null, initialData?: any) => {
  const colegioId = getColegioIdFromToken(token) || "";

  const [formData, setFormData] = useState<FacturaVentaCreateDTO>({
    tipoFacturaId: initialData?.tipoFacturaId || 1,
    clienteId: initialData?.clienteId || "",
    vendedorId: colegioId,
    colegioId: colegioId,
    fechaElaboracion: initialData?.fechaElaboracion ? new Date(initialData.fechaElaboracion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    esCredito: initialData?.esCredito || false,
    diasCredito: initialData?.diasCredito || null,
    medioPagoId: initialData?.medioPagoId || null,
    detalles: initialData?.detalles || [],
    pagos: initialData?.pagos || [],
  });  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });
  const [loading, setLoading] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [parametrosFacturacion, setParametrosFacturacion] = useState<{mediosPago: any[], frecuenciasPago: any[]}>({ mediosPago: [], frecuenciasPago: [] });     

  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
    getParametrosFacturacion().then(res => {
      if (res.success && res.data) {
        setParametrosFacturacion(res.data);
      }
    });  }, [formData.tipoFacturaId, initialData?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FacturaVentaCreateDTO) => ({
      ...prev,
      [name]: name === "tipoFacturaId" ? Number(value) : value,
    }));
  };

  const handleDetallesChange = (detalles: FacturaDetalleCreateDTO[]) => {       
    setFormData((prev: FacturaVentaCreateDTO) => ({ ...prev, detalles }));
  };

  const handlePagosChange = (pagos: any[]) => {
    setFormData((prev: FacturaVentaCreateDTO) => ({ ...prev, pagos }));
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      let response;
      if (initialData?.id) {
        response = await updateVenta(initialData.id, formData, idempotencyKey);
      } else {
        response = await createVenta(formData, idempotencyKey);
      }
      
      setResultModal({
        show: true,
        success: response.success,
        message: response.success ? "Venta guardada exitosamente" : response.message || "Error al guardar la venta",
      });
      
      if (response.success) {
        setIdempotencyKey(crypto.randomUUID());
      }
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
    loading,
    showConfirm,
    resultModal,
    parametrosFacturacion,
    setShowConfirm,
    setResultModal,
    handleChange,
    handleDetallesChange,
    handlePagosChange,
    handleConfirmSave,
  };
};