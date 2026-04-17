import { useState, useEffect } from "react";
import type { FacturaCompraCreateDTO, FacturaCompraDetalleCreateDTO, PagoEgresoCreate } from "../../domain/models/FacturaCompra";
import { createCompra, getCompraById, updateFacturaCompra } from "../../data/services/compra/compraService";

import { getParametrosFacturacion } from "../../data/services/colegio/parametrosService";
import type { ParametrosFacturacionDTO } from "../../data/services/colegio/parametrosService";

export const useComprasForm = (initialCompraId?: number, initialData?: Partial<FacturaCompraCreateDTO> & { id?: number, numero?: string }) => {
  const [parametrosFacturacion, setParametrosFacturacion] = useState<ParametrosFacturacionDTO>({
    mediosPago: [],
    frecuenciasPago: []
  });

  useEffect(() => {
    getParametrosFacturacion().then(res => {
      if (res.success && res.data) {
        setParametrosFacturacion(res.data);
      }
    });
  }, []);

  const [formData, setFormData] = useState<FacturaCompraCreateDTO>({
    tipoFacturaId: initialData?.tipoFacturaId || 1, // o el id que corresponda a "FACTURA DE COMPRA"
    numeroReferencia: initialData?.numeroReferencia || "",
    proveedorId: initialData?.proveedorId || "",
    fechaElaboracion: initialData?.fechaElaboracion ? new Date(initialData.fechaElaboracion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    esCredito: false,
    medioPagoId: null,
    frecuenciaPagoId: null,
    numeroCuotas: null,
    pagos: [],
    detalles: initialData?.detalles || [],
  });  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCompraId) {
      loadCompra(initialCompraId);
    }
  }, [initialCompraId]);
  const loadCompra = async (id: number) => {
    setLoading(true);
    try {
      const res = await getCompraById(id);
      if (res.success && res.data) {
        const d = res.data;
        setFormData({
          tipoFacturaId: (d as any).tipoFacturaId || 1,
          proveedorId: d.proveedorId || "",
          fechaElaboracion: new Date(d.fechaElaboracion).toISOString().split('T')[0],
          esCredito: d.esCredito,
          medioPagoId: d.medioPagoId || null,
          frecuenciaPagoId: d.frecuenciaPagoId || null,
          numeroCuotas: d.numeroCuotas || null,
          detalles: d.detalles?.map(det => ({
            tipoItem: det.tipoItem,
            productoId: det.productoId,
            codigo: det.codigo,
            descripcion: det.descripcion,
            cantidad: det.cantidad,
            valorUnitario: det.valorUnitario,
            porcentajeDescuento: det.porcentajeDescuento,
            impuestoCargoId: det.impuestoCargoId,
            retencionId: det.retencionId,
            cuentaContableCodigo: det.cuentaContableCodigo,
            impuestoCargoNombre: det.impuestoCargoNombre || undefined,
            tarifaCargo: det.tarifaCargo,
            retencionNombre: det.retencionNombre || undefined,
            tarifaRetencion: det.tarifaRetencion,
          })) || []
        });      }
    } catch {
      // Handle error if needed
    } finally {
      setLoading(false);
    }
  };

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

  const handlePagosChange = (pagos: PagoEgresoCreate[]) => {       
    setFormData((prev: FacturaCompraCreateDTO) => ({ ...prev, pagos }));      
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const dataToSubmit = { ...formData };
      
      // Auto-asignar el medio de pago al nivel raíz si no está asignado o es contado
      if (!dataToSubmit.esCredito && dataToSubmit.pagos && dataToSubmit.pagos.length > 0) {
        dataToSubmit.medioPagoId = dataToSubmit.pagos[0].medioPagoId;
      }
      
      let response;
      if (initialCompraId) {
        response = await updateFacturaCompra(initialCompraId, dataToSubmit);
      } else {
        response = await createCompra(dataToSubmit);
      }
      setResultModal({
        show: true,
        success: response.success,
        message: response.success ? `Compra ${initialCompraId ? 'actualizada' : 'guardada'} exitosamente` : response.message || `Error al ${initialCompraId ? 'actualizar' : 'guardar'} la compra`,
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
    loading,
    showConfirm,
    resultModal,
    parametrosFacturacion,
    setShowConfirm,
    setResultModal,
    handleChange,
    setProveedorId,
    handleDetallesChange,
    handlePagosChange,
    handleConfirmSave,
  };
};