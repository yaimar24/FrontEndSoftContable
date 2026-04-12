import React from 'react';
import { ShoppingCart, Save, ArrowLeft, Tags, Calendar, FileText, Plus, Trash2, Hash } from 'lucide-react';
import Button from '../../../../components/atoms/Button';
import InputField from '../../../../components/atoms/InputField';
import { AsyncSearchField } from '../../../../components/organisms/AsyncSearchField';
import { SelectorCuentaPuc } from '../../../../components/organisms/SelectorCuentaPuc';
import { buscarTerceros } from '../../../../../data/services/terceros/terceroService';
import SelectField from '../../../../components/atoms/SelectField';
import StatusModal from '../../../../components/organisms/StatusModal';
import { useComprasForm } from '../../../../../application/hooks/useComprasForm';
import { searchProductos } from '../../../../../data/services/producto/productoService';
import type { FacturaCompraDetalleCreateDTO, TipoItemCompraEnum } from '../../../../../domain/models/FacturaCompra';

interface Props {
  onBack: () => void;
  initialCompraId?: number;
}

const CreateCompras: React.FC<Props> = ({ onBack, initialCompraId }) => {
  const {
    formData,
    numeroDisplay,
    showConfirm,
    resultModal,
    setShowConfirm,
    setResultModal,
    handleChange,
    setProveedorId,
    handleDetallesChange,
    handleConfirmSave,
    parametrosFacturacion,
  } = useComprasForm(initialCompraId);

  const addDetalle = () => {
    handleDetallesChange([
      ...formData.detalles,
      {
        tipoItem: 1,
        productoId: 0,
        pucId: undefined,
        activoFijoId: undefined,
        descripcion: '',
        cantidad: 1,
        valorUnitario: 0,
        porcentajeDescuento: 0,
        impuestoCargoNombre: '',
        tarifaCargo: 0,
        retencionNombre: '',
        tarifaRetencion: 0,
      } as unknown as FacturaCompraDetalleCreateDTO
    ]);
  };

  const removeDetalle = (index: number) => {
    handleDetallesChange(formData.detalles.filter((_: any, i: number) => i !== index));
  };

  const [errors, setErrors] = React.useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.proveedorId) newErrors.proveedorId = "El proveedor es requerido";
    if (!formData.esCredito && !formData.medioPagoId) newErrors.medioPagoId = "Medio de pago es requerido";
    if (!formData.fechaElaboracion) newErrors.fechaElaboracion = "La fecha es requerida";
    
    formData.detalles.forEach((doc: any, index: number) => {
      // Si tipoItem === 1 (Producto)
      if (doc.tipoItem === 1 && !doc.productoId) newErrors[`detalle_${index}_producto`] = "Debe elegir un producto";
      // Si no es producto, la descripción es obligatoria
      if (doc.tipoItem !== 1 && (!doc.descripcion || doc.descripcion.trim() === '')) newErrors[`detalle_${index}_descripcion`] = "Desc. requerida";

      if (!doc.cantidad || doc.cantidad <= 0) newErrors[`detalle_${index}_cantidad`] = "Cantidad requ.";
      if (doc.valorUnitario === undefined || doc.valorUnitario < 0) newErrors[`detalle_${index}_valor`] = "Valor req.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const itemTypeOptions = [
    { id: 1, label: 'Producto' },
    { id: 2, label: 'Activo Fijo' },
    { id: 3, label: 'Gasto' }
  ];

  const currentTotal = Number(formData.detalles.reduce((acc: number, curr: FacturaCompraDetalleCreateDTO) => {
    const subtotal = curr.cantidad * (curr.valorUnitario || 0);
    const discount = subtotal * ((curr.porcentajeDescuento || 0) / 100);
    const base = subtotal - discount;
    const cargo = base * ((curr.tarifaCargo || 0) / 100);
    const retencion = base * ((curr.tarifaRetencion || 0) / 100);
    return acc + (base + cargo - retencion);
  }, 0).toFixed(2));

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20 px-4 animate-in fade-in duration-500">
      <StatusModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        type="confirm"
        message={initialCompraId ? "¿Estás seguro de actualizar esta factura de compra?" : "¿Estás seguro de registrar esta factura de compra?"}
        confirmText={initialCompraId ? "Actualizar" : "Confirmar"}
        onConfirm={handleConfirmSave}
        cancelText="Cancelar"
      />

      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => {
          setResultModal({ ...resultModal, show: false });
          if(resultModal.success) onBack();
        }}
      />

      <div className="tuto-compra-sticky-header flex justify-between items-center bg-white p-6 rounded-4xl shadow-sm sticky top-4 z-20 border border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors" title="Volver">
            <ArrowLeft size={24} className="text-slate-400" />
          </button>
          <h1 className="text-xl font-black text-slate-800 uppercase flex items-center gap-2">
            <ShoppingCart size={28} className="text-indigo-600" />
            {initialCompraId ? 'Actualizar Factura de Compra' : 'Nueva Factura de Compra'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Estimado</p>
            <p className="text-xl font-black text-indigo-600">${Math.round(currentTotal).toLocaleString()}</p>
          </div>
          <Button
            onClick={() => {
              if (!validateForm()) {
                setResultModal({ show: true, success: false, message: 'Por favor corrija los campos en rojo.' });
                return;
              }
              if (formData.detalles.length === 0) {
                setResultModal({ show: true, success: false, message: 'La factura debe tener al menos un detalle agregado.' });
                return;
              }
              setShowConfirm(true);
            }}
            icon={Save}
          >
            {initialCompraId ? 'Actualizar Compra' : 'Guardar Compra'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <section className="tuto-compra-encabezado bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <FileText size={18} className="text-indigo-500" /> Datos de Encabezado
            </h3>
            <div className="space-y-4">
              <InputField
                label="Número de Compra"
                name="numero"
                value={numeroDisplay || 'Pendiente'}
                onChange={() => {}}
                icon={Hash}
                placeholder="-- Generado Automáticamente --"
                disabled
              />

              <AsyncSearchField
                label="Buscar Proveedor"
                value={formData.proveedorId}
                displayValue={formData.proveedorId ? "Proveedor Seleccionado" : ""}
                placeholder="Nombre o ID del Proveedor..."
                fetcher={async (q) => {
                  const res = await buscarTerceros("CLIENTE,PROVEEDOR", q, true);
                  return res.success && res.data ? res.data : [];
                }}
                getDisplayValue={(c: any) => c.nombreCompleto ? `${c.nombreCompleto} - ${c.identificacion}` : (c.nombreComercial ? `${c.nombreComercial} - ${c.identificacion}` : `${c.identificacion}`)}
                getKey={(c: any) => c.id}
                onSelect={(c: any) => setProveedorId(c.id)}
                required
                error={errors.proveedorId}
              />

              <InputField
                label="Fecha de Elaboración"
                name="fechaElaboracion"
                type="date"
                value={formData.fechaElaboracion}
                onChange={handleChange}
                icon={Calendar}
                required
                error={errors.fechaElaboracion}
              />

              <SelectField
                label="Medio de Pago"
                name="medioPagoId"
                value={formData.medioPagoId || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange({ target: { name: 'medioPagoId', value: Number(e.target.value) || null } } as any)}
                options={parametrosFacturacion.mediosPago}
                displayExpr={(item) => item.nombre}
                required
                error={errors.medioPagoId}
              />
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <section className="tuto-compra-detalle bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-700 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Tags size={18} className="text-emerald-500" /> Líneas de Detalle
              </h3>
              <Button onClick={addDetalle} icon={Plus} variant="outline" className="text-xs py-2 px-4 rounded-xl">
                Añadir Ítem
              </Button>
            </div>

            {formData.detalles.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                <FileText size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500 mb-1">Sin detalles agregados</p>
                <p className="text-xs text-slate-400">Añada ítems para continuar con la factura de compra</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.detalles.map((detalle: FacturaCompraDetalleCreateDTO, index: number) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                    <button
                      onClick={() => removeDetalle(index)}
                      className="absolute -top-3 -right-3 p-2 bg-red-100 text-red-600 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all hidden group-hover:block"
                      title="Eliminar fila"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="lg:col-span-1">
                        <SelectField
                          label="Tipo de Ítem"
                          name="tipoItem"
                          value={detalle.tipoItem}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const newDetalles = [...formData.detalles];
                            newDetalles[index].tipoItem = Number(e.target.value) as TipoItemCompraEnum;
                            newDetalles[index].productoId = undefined; // Resetear id
                            handleDetallesChange(newDetalles);
                          }}
                          options={itemTypeOptions}
                          displayExpr={(opt: { id: number; label: string }) => opt.label}
                        />
                      </div>
                      
                      <div className="lg:col-span-3">
                        {detalle.tipoItem === 1 && (
                          <AsyncSearchField
                            label="Producto"
                            value={detalle.productoId || ''}
                            displayValue={detalle.descripcion || ''}
                            placeholder="Buscar nombre o referencia"
                            fetcher={async (q) => {
                              const res = await searchProductos(q, true);
                              return res.success && res.data ? res.data : [];
                            }}
                            getDisplayValue={(p: any) => `${p.sku || 'S/N'} - ${p.nombre} ($${p.precios?.[0]?.valor?.toLocaleString() || 0})`}
                            getKey={(p: any) => p.id}
                            onSelect={(p: any) => {
                              const newDetalles = [...formData.detalles];
                              newDetalles[index].productoId = p.id;
                              newDetalles[index].descripcion = p.nombre;
                              newDetalles[index].valorUnitario = p.precios?.[0]?.valor || 0;
                              newDetalles[index].cantidad = 1;
                              newDetalles[index].impuestoCargoNombre = p.impuestoCargoNombre;
                              newDetalles[index].tarifaCargo = p.tarifaCargo;
                              newDetalles[index].retencionNombre = p.retencionNombre;
                              newDetalles[index].tarifaRetencion = p.tarifaRetencion;
                              newDetalles[index].cuentaContableCodigo = p.cuentaInventarioCodigo || null;
                              (newDetalles[index] as any).cuentaContableNombre = p.cuentaInventarioNombre || null;
                              handleDetallesChange(newDetalles);
                            }}
                            required
                            error={errors[`detalle_${index}_producto`]}
                          />
                        )}
                        {detalle.tipoItem !== 1 && (
                          <InputField
                            label="Descripción *"
                            name="descripcion"
                            value={detalle.descripcion || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const newDetalles = [...formData.detalles];
                              newDetalles[index].descripcion = e.target.value;
                              handleDetallesChange(newDetalles);
                            }}
                            placeholder="Ej. Servicio de consultoría"
                            required
                            error={errors[`detalle_${index}_descripcion`]}
                          />
                        )}
                        
                        <div className="mt-3">
                          {detalle.tipoItem === 1 && (
                            <InputField
                              label="Cuenta Contable (Inventario)"
                              name={`cuenta_${index}`}
                              value={detalle.cuentaContableCodigo ? `${detalle.cuentaContableCodigo} - ${(detalle as any).cuentaContableNombre || ''}` : '—'}
                              onChange={() => {}}
                              disabled
                            />
                          )}
                          {detalle.tipoItem === 2 && (
                            <SelectorCuentaPuc
                              label="Cuenta Contable (Activo Fijo)"
                              codigoRaiz="15"
                              value={detalle.cuentaContableCodigo || null}
                              onChange={(val) => {
                                const newDetalles = [...formData.detalles];
                                newDetalles[index].cuentaContableCodigo = val;
                                handleDetallesChange(newDetalles);
                              }}
                            />
                          )}
                          {detalle.tipoItem === 3 && (
                            <SelectorCuentaPuc
                              label="Cuenta Contable (Gasto)"
                              codigoRaiz="5"
                              value={detalle.cuentaContableCodigo || null}
                              onChange={(val) => {
                                const newDetalles = [...formData.detalles];
                                newDetalles[index].cuentaContableCodigo = val;
                                handleDetallesChange(newDetalles);
                              }}
                            />
                          )}
                        </div>

                        {(detalle.impuestoCargoNombre || detalle.retencionNombre) && detalle.tipoItem === 1 && (
                          <div className="flex flex-wrap justify-start gap-2 mt-2 mb-1 px-1">
                            {detalle.impuestoCargoNombre && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 shadow-sm border border-blue-200">
                                Cargo: {detalle.impuestoCargoNombre} {detalle.tarifaCargo ? `(${detalle.tarifaCargo}%)` : ''}
                              </span>
                            )}
                            {detalle.retencionNombre && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200">
                                Retención: {detalle.retencionNombre} {detalle.tarifaRetencion ? `(${detalle.tarifaRetencion}%)` : ''}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-4 gap-3 mt-2">
                        <InputField
                          label="Cantidad"
                          name="cantidad"
                          type="number"
                          min={0}
                          step="0.01"
                          value={detalle.cantidad === 0 ? '' : detalle.cantidad}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newDetalles = [...formData.detalles];
                            const val = e.target.value;
                            newDetalles[index].cantidad = val === '' ? 0 : Math.max(0, Number(val));
                            handleDetallesChange(newDetalles);
                          }}
                          placeholder="0"
                          error={errors[`detalle_${index}_cantidad`]}
                          required
                        />
                        <InputField
                          label="Val. Unitario"
                          name="valorUnitario"
                          type="number"
                          min={0}
                          step="0.01"
                          value={detalle.valorUnitario === 0 ? '' : (detalle.valorUnitario || '')}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newDetalles = [...formData.detalles];
                            const val = e.target.value;
                            newDetalles[index].valorUnitario = val === '' ? 0 : Math.max(0, Number(val));
                            handleDetallesChange(newDetalles);
                          }}
                          placeholder="$ 0"
                          error={errors[`detalle_${index}_valor`]}
                          required
                        />
                        <InputField
                          label="% Desc."
                          name="porcentajeDescuento"
                          type="number"
                          min={0}
                          max={100}
                          step="0.01"
                          value={detalle.porcentajeDescuento === 0 ? '' : detalle.porcentajeDescuento}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newDetalles = [...formData.detalles];
                            const val = e.target.value;
                            newDetalles[index].porcentajeDescuento = val === '' ? 0 : Math.min(100, Math.max(0, Number(val)));
                            handleDetallesChange(newDetalles);
                          }}
                          placeholder="%"
                        />
                        <div className="flex flex-col justify-end">
                          <label className="text-[10px] uppercase font-bold text-slate-500 mb-1">Subtotal</label>
                          <div className="bg-emerald-50 text-emerald-700 font-bold p-3 rounded-xl border border-emerald-100 text-center">
                            ${Math.round((detalle.cantidad * (detalle.valorUnitario || 0)) - ((detalle.cantidad * (detalle.valorUnitario || 0)) * ((detalle.porcentajeDescuento || 0) / 100))).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreateCompras;
