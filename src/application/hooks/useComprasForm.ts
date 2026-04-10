import { useState, useEffect } from "react";
import type { FacturaCompraCreateDTO, FacturaCompraDetalleCreateDTO } from "../../domain/models/FacturaCompra";
import { createCompra, getProximoNumeroFacturaCompra, getCompraById, updateFacturaCompra } from "../../data/services/compra/compraService";

export const useComprasForm = (initialCompraId?: number, initialData?: Partial<FacturaCompraCreateDTO> & { id?: number, numero?: string }) => {
  const [formData, setFormData] = useState<FacturaCompraCreateDTO>({
    tipoFacturaId: initialData?.tipoFacturaId || 1, // o el id que corresponda a "FACTURA DE COMPRA"
    proveedorId: initialData?.proveedorId || "",
    fechaElaboracion: initialData?.fechaElaboracion ? new Date(initialData.fechaElaboracion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    medioPagoCodigo: initialData?.medioPagoCodigo || "",
    detalles: initialData?.detalles || [],
  });

  const [numeroDisplay, setNumeroDisplay] = useState<string>(initialData?.numero || "");
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCompraId) {
      loadCompra(initialCompraId);
    }
  }, [initialCompraId]);

  useEffect(() => {
    if (!initialCompraId && formData.tipoFacturaId && !initialData?.id) {
      getProximoNumeroFacturaCompra(formData.tipoFacturaId).then(res => {
        if (res.success && res.data) {
          setNumeroDisplay(res.data);
        }
      });
    }
  }, [initialCompraId, formData.tipoFacturaId, initialData?.id]);

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
          medioPagoCodigo: d.medioPagoCodigo || "",
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
        });
        setNumeroDisplay(d.numero || "");
      }
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

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      let response;
      if (initialCompraId) {
        response = await updateFacturaCompra(initialCompraId, formData);
      } else {
        response = await createCompra(formData);
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