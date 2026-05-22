import { useState, useEffect } from 'react';
import { crearProducto, getProductoParametros, updateProducto } from '../../data/services/producto/productoService';

import type { ProductoCreateDTO } from '../../domain/models/Producto';

interface ProductoFormData extends Partial<ProductoCreateDTO> {
  id?: string;
  categoriaId?: number;
  cuentaIngresoNombre?: string;
  cuentaCostoNombre?: string;
  cuentaInventarioNombre?: string;
}

interface ProductoParametros {
  categorias?: { id: number; nombre: string }[];
  impuestos?: { id: number; nombre: string }[];
  retenciones?: { id: number; nombre: string; tarifa: number }[];
  unidadesMedida?: { id: number; nombre: string }[];
  [key: string]: unknown;
}

export const useProductosForm = (initialData?: ProductoFormData) => {
  const [formData, setFormData] = useState<ProductoFormData>(initialData || {
    nombre: "", sku: "", codigoBarras: "", esServicio: true,
    esInventariable: false, visibleEnFacturas: true, categoriaId: 1,
    unidadMedidaDianId: 1, impuestoCargoId: 1, tipoUso: 1, precios: [{ nombreLista: "General", valor: 0, incluyeIva: false }]
  });

  const [parametros, setParametros] = useState<ProductoParametros | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    (async () => {
      const resp = await getProductoParametros();
      if (resp.success && resp.data) setParametros(resp.data as ProductoParametros);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: unknown } }) => {
    const { name, value } = e.target;
    const type = 'type' in e.target ? e.target.type : undefined;
    const checked = 'checked' in e.target ? (e.target as HTMLInputElement).checked : undefined;
    
    let parsedValue: unknown = value;
    if (name === 'tipoUso' || name === 'categoriaId' || name === 'unidadMedidaDianId' || name === 'impuestoCargoId' || name === 'retencionId' || name === 'categoriaId') {
       parsedValue = value ? Number(value) : value;
    }
    
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : parsedValue }));
  };

  const handleConfirmSave = async () => {
    const resp = initialData?.id
      ? await updateProducto(initialData.id, formData as Partial<ProductoCreateDTO>)
      : await crearProducto(formData as ProductoCreateDTO);
    
    setResultModal({ show: true, success: resp.success, message: resp.message });
    setShowConfirm(false);
  };

  return { formData, parametros, showConfirm, resultModal, setShowConfirm, setResultModal, handleChange, handleConfirmSave };
};