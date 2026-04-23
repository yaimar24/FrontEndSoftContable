import { useState } from "react";
import type {
  NotaCreditoDebitoCreateDTO,
  NotaDetalleCreateDTO,
} from "../../domain/models/NotaCreditoDebito";
import { TipoNotaCredDeb, OrigenFacturaNota, MotivoNota } from "../../domain/models/NotaCreditoDebito";
import { createNotaCreditoDebito } from "../../data/services/notaCreditoDebito/notaCreditoDebitoService";

interface UseNotaCreditoDebitoFormParams {
  defaultTipo?: number;
  defaultOrigen?: number;
  defaultFacturaId?: number;
}

export const useNotaCreditoDebitoForm = (params?: UseNotaCreditoDebitoFormParams) => {
  const [formData, setFormData] = useState<NotaCreditoDebitoCreateDTO>({
    tipo: (params?.defaultTipo as typeof TipoNotaCredDeb.NotaCredito) || TipoNotaCredDeb.NotaCredito,
    origenFactura: (params?.defaultOrigen as typeof OrigenFacturaNota.Venta) || OrigenFacturaNota.Venta,
    facturaId: params?.defaultFacturaId || 0,
    motivo: MotivoNota.Devolucion,
    motivoDescripcion: null,
    fechaElaboracion: new Date().toISOString().split("T")[0],
    observaciones: null,
    detalles: [],
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["tipo", "origenFactura", "motivo", "facturaId"].includes(name) ? Number(value) : value,
    }));
  };

  const handleDetallesChange = (detalles: NotaDetalleCreateDTO[]) => {
    setFormData((prev) => ({ ...prev, detalles }));
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const response = await createNotaCreditoDebito(formData);
      setResultModal({
        show: true,
        success: response.success,
        message: response.success
          ? "Nota guardada exitosamente"
          : response.message || "Error al guardar la nota",
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
    setFormData,
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
