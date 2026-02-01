import { useState, useEffect } from 'react';
import { crearProducto, getProductoParametros, updateProducto } from '../services/producto/productoService';

export const useProductosForm = (initialData?: any) => {
  const [formData, setFormData] = useState(initialData || {
    nombre: "", sku: "", codigoBarras: "", esServicio: true,
    esInventariable: false, visibleEnFacturas: true, categoriaProductoId: 1,
    unidadMedidaDianId: 1, impuestoCargoId: 1, precios: [{ nombreLista: "General", valor: 0, incluyeIva: false }]
  });

  const [parametros, setParametros] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    (async () => {
      const resp = await getProductoParametros();
      if (resp.success) setParametros(resp.data);
    })();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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