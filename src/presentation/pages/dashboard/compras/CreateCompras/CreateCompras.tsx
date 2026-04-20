import React, { useEffect, useState } from 'react';
import { ShoppingCart, Save, ArrowLeft, Tags, Calendar, FileText, Plus, Trash2, Hash, Wallet, DollarSign } from 'lucide-react';
import Button from '../../../../components/atoms/Button';
import InputField from '../../../../components/atoms/InputField';
import { AsyncSearchField } from '../../../../components/organisms/AsyncSearchField';
import { SelectorCuentaPuc } from '../../../../components/organisms/SelectorCuentaPuc';
import { buscarTerceros } from '../../../../../data/services/terceros/terceroService';
import SelectField from '../../../../components/atoms/SelectField';
import StatusModal from '../../../../components/organisms/StatusModal';
import { useComprasForm } from '../../../../../application/hooks/useComprasForm';
import { searchProductos } from '../../../../../data/services/producto/productoService';
import type { FacturaCompraDetalleCreateDTO, TipoItemCompraEnum, PagoEgresoCreate } from '../../../../../domain/models/FacturaCompra';

interface Props {
  onBack: () => void;
  initialCompraId?: number;
}

const CreateCompras: React.FC<Props> = ({ onBack, initialCompraId }) => {
  const {
    formData,
    showConfirm,
    resultModal,
    setShowConfirm,
    setResultModal,
    handleChange,
    setProveedorId,
    handleDetallesChange,
    handlePagosChange,
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
    if (!formData.numeroReferencia) newErrors.numeroReferencia = "El número de referencia es requerido";
    if (!formData.proveedorId) newErrors.proveedorId = "El proveedor es requerido";
    if (!formData.fechaElaboracion) newErrors.fechaElaboracion = "La fecha es requerida";
    
    formData.detalles.forEach((doc: any, index: number) => {
      // Si tipoItem === 1 (Producto)
      if (doc.tipoItem === 1 && !doc.productoId) newErrors[`detalle_${index}_producto`] = "Debe elegir un producto";
      // Si no es producto, la descripción es obligatoria
      if (doc.tipoItem !== 1 && (!doc.descripcion || doc.descripcion.trim() === '')) newErrors[`detalle_${index}_descripcion`] = "Desc. requerida";

      if (!doc.cantidad || doc.cantidad <= 0) newErrors[`detalle_${index}_cantidad`] = "Cantidad requ.";
      if (doc.valorUnitario === undefined || doc.valorUnitario < 0) newErrors[`detalle_${index}_valor`] = "Valor req.";
    });

    if (formData.esCredito) {
      if (!formData.diasCredito || formData.diasCredito < 1 || formData.diasCredito > 365) {
        newErrors.diasCredito = "1-365 días";
      }
    } else {
      if (condicionPago === 'CONTADO') {
        (formData.pagos || []).forEach((pago: any, index: number) => {
          if (!pago.medioPagoId) newErrors[`pago_${index}_medioPago`] = "Requerido";
          if (!pago.monto || pago.monto <= 0) newErrors[`pago_${index}_monto`] = "Requerido";
          if (!pago.fechaEgreso && !formData.fechaElaboracion) newErrors[`pago_${index}_fechaEgreso`] = "Requerido";
        });
      }
    }

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

  const currentTotalPagos = Number((formData.pagos || []).reduce((acc: number, curr: PagoEgresoCreate) => acc + (curr.monto || 0), 0).toFixed(2));
  const saldoPendiente = Number(Math.max(0, currentTotal - currentTotalPagos).toFixed(2));

  const [condicionPago, setCondicionPago] = useState<'CREDITO' | 'CONTADO'>(
    formData.esCredito ? 'CREDITO' : 'CONTADO'
  );

  useEffect(() => {
    if (condicionPago === 'CONTADO' && !formData.esCredito) {
      const defaultMedioPagoId = parametrosFacturacion.mediosPago?.length > 0 ? parametrosFacturacion.mediosPago[0].id : null;
      const p = formData.pagos && formData.pagos.length > 0 ? formData.pagos[0] : { medioPagoId: defaultMedioPagoId, monto: 0, fechaEgreso: formData.fechaElaboracion, referencia: "", observaciones: "" };
      handlePagosChange([{ ...p, monto: currentTotal } as any]);
      handleChange({ target: { name: 'medioPagoId', value: p.medioPagoId || defaultMedioPagoId } } as any);
    } else if (condicionPago === 'CREDITO') {
      handlePagosChange([]);
      handleChange({ target: { name: 'medioPagoId', value: null } } as any);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condicionPago, currentTotal, formData.esCredito, parametrosFacturacion.mediosPago]);

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
          {(formData.pagos || []).length > 0 && (
            <div className="text-right mr-4 border-l pl-4 border-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Abonado</p>
              <p className="text-xl font-black text-blue-600">${Math.round(currentTotalPagos).toLocaleString()}</p>
            </div>
          )}
          {(formData.pagos || []).length > 0 && saldoPendiente > 0 && (
            <div className="text-right mr-4 border-l pl-4 border-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saldo</p>
              <p className="text-xl font-black text-amber-600">${Math.round(saldoPendiente).toLocaleString()}</p>
            </div>
          )}
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
                label="Número de Referencia"
                name="numeroReferencia"
                value={formData.numeroReferencia || ""}
                onChange={(e) => handleChange({ target: { name: 'numeroReferencia', value: e.target.value } } as any)}
                icon={Hash}
                placeholder="Factura del Proveedor"
                required
                error={errors.numeroReferencia}
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

              <InputField
                label="Observación (Opcional)"
                name="observaciones"
                value={formData.observaciones || ""}
                onChange={(e) => handleChange({ target: { name: 'observaciones', value: e.target.value } } as any)}
                placeholder="Nota u observación de la factura"
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
                              const res = await searchProductos(q, 2, true); // tipoUso 2 = Compra
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

          {/* Sección de Condición y Medios de Pago */}
          <section className="tuto-compra-pagos bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-700 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Wallet size={18} className="text-blue-500" /> Condición y Medio de Pago
              </h3>
            </div>

            <div className="mb-6 border-b border-slate-100 pb-6">
              <SelectField
                label="Condición de Pago"
                name="condicionPago"
                value={condicionPago}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const isCredito = e.target.value === 'CREDITO';
                  setCondicionPago(e.target.value as any);
                  handleChange({ target: { name: 'esCredito', value: isCredito } } as any);
                  if (isCredito) {
                    handleChange({ target: { name: 'medioPagoId', value: null } } as any);
                    handlePagosChange([]);
                  } else {
                  }
                }}
                options={[
                  { id: 'CONTADO', nombre: 'De Contado (Pago Total)' },
                  { id: 'CREDITO', nombre: 'A Crédito ' }
                ]}
                displayExpr={(item) => item.nombre}
              />
            </div>

            {condicionPago === 'CREDITO' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50">
                <InputField
                  label="Días de Crédito"
                  name="diasCredito"
                  type="number"
                  min={1}
                  max={365}
                  value={formData.diasCredito || ''}
                  onChange={(e: any) => handleChange({ target: { name: 'diasCredito', value: Number(e.target.value) || null } } as any)}
                  required
                  error={errors.diasCredito}
                />
                
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-medium p-2 mt-[26px] bg-white rounded-lg border border-emerald-200 text-center text-slate-600">
                    Vencimiento: {formData.diasCredito ? new Date(new Date(formData.fechaElaboracion + 'T12:00:00').getTime() + (formData.diasCredito * 24 * 60 * 60 * 1000)).toLocaleDateString() : 'Ingresa días'}
                  </p>
                </div>
                
                <div className="col-span-1 md:col-span-2 text-center mt-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs text-amber-600 font-medium">Esta compra quedará en estado "Pendiente". Los abonos se registrarán según las cuotas acordadas.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.pagos?.map((pago: PagoEgresoCreate, index: number) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        label="Medio de Pago"
                        name={`pago_${index}_medioPagoId`}
                        value={pago.medioPagoId || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const newPagos = [...formData.pagos!];
                          const val = Number(e.target.value) || 0;
                          newPagos[index].medioPagoId = val;
                          handlePagosChange(newPagos);
                          
                          if (index === 0) {
                            handleChange({ target: { name: 'medioPagoId', value: val } } as any);
                          }
                        }}
                        options={parametrosFacturacion.mediosPago}
                        displayExpr={(item) => item.nombre}
                        required
                        error={errors[`pago_${index}_medioPago`]}
                      />

                      <InputField
                        label="Monto Recibido"
                        name="monto"
                        type="number"
                        value={pago.monto || ""}
                        onChange={(e) => {
                          const newPagos = [...formData.pagos!];
                          newPagos[index].monto = Number(e.target.value);
                          handlePagosChange(newPagos);
                        }}
                        disabled
                        required
                        icon={DollarSign}
                        error={errors[`pago_${index}_monto`]}
                      />

                      <InputField
                        label="Referencia (Opcional)"
                        name="referencia"
                        value={pago.referencia || ""}
                        onChange={(e) => {
                          const newPagos = [...formData.pagos!];
                          newPagos[index].referencia = e.target.value;
                          handlePagosChange(newPagos);
                        }}
                        placeholder="Nro. cheque, trans., etc."
                      />

                      <InputField
                        label="Fecha de Pago"
                        name="fechaEgreso"
                        type="date"
                        value={pago.fechaEgreso || formData.fechaElaboracion}
                        onChange={(e) => {
                          const newPagos = [...formData.pagos!];
                          newPagos[index].fechaEgreso = e.target.value;
                          handlePagosChange(newPagos);
                        }}
                        disabled
                        required
                        error={errors[`pago_${index}_fechaEgreso`]}
                      />
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
