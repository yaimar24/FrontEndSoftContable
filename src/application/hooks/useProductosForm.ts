import { useState, useEffect } from 'react';
import { crearProducto, getProductoParametros, updateProducto } from '../../data/services/producto/productoService';

import type { ProductoCreateDTO } from '../../domain/models/Producto';

export const useProductosForm = (initialData?: Partial<ProductoCreateDTO> & { id?: string }) => {
  const [formData, setFormData] = useState(initialData || {
    nombre: "", sku: "", codigoBarras: "", esServicio: true,
    esInventariable: false, visibleEnFacturas: true, categoriaProductoId: 1,
    unidadMedidaDianId: 1, impuestoCargoId: 1, tipoUso: 1, precios: [{ nombreLista: "General", valor: 0, incluyeIva: false }]
  });

  const [parametros, setParametros] = useState<Record<string, unknown> | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    (async () => {
      const resp = await getProductoParametros();
      if (resp.success) setParametros(resp.data);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    let parsedValue = value;
    if (name === 'tipoUso' || name === 'categoriaId' || name === 'unidadMedidaDianId' || name === 'impuestoCargoId' || name === 'retencionId' || name === 'categoriaProductoId') {
       parsedValue = value ? Number(value) : value;
    }
    
    setFormData((prev: Record<string, unknown>) => ({ ...prev, [name]: type === 'checkbox' ? checked : parsedValue }));
  };

  const handleConfirmSave = async () => {
    const resp = initialData 
      ? await updateProducto(initialData.id, formData)
      : await crearProducto(formData);
    
    setResultModal({ show: true, success: resp.success, message: resp.message });
    setShowConfirm(false);
  };

  return { formData, parametros, showConfirm, resultModal, setShowConfirm, setResultModal, handleChange, handleConfirmSave };
};