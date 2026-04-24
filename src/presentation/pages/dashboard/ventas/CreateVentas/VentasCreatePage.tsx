import React, { useEffect, useState } from "react";
import { Receipt, Save, ArrowLeft, Tags, User, Calendar, FileText, Plus, Trash2, Hash, Wallet, DollarSign } from "lucide-react";
import Button from "../../../../components/atoms/Button";
import StatusModal from "../../../../components/organisms/StatusModal";
import InputField from "../../../../components/atoms/InputField";
import { AsyncSearchField } from "../../../../components/organisms/AsyncSearchField";
import SelectField from "../../../../components/atoms/SelectField";
import { useVentasForm } from "../../../../../application/hooks/useVentasForm";
import { useAuth } from "../../../../../application/hooks/useAuth";
import { getNombreColegioFromToken } from "../../../../../utils/jwt";
import { buscarTerceros } from "../../../../../data/services/terceros/terceroService";
import { searchProductos } from "../../../../../data/services/producto/productoService";
import type { FacturaDetalleCreateDTO, ReciboCajaCreate } from "../../../../../domain/models/Venta";
import { formatCurrency } from '../../../../../utils/formatters';

interface Props {
  initialData?: any;
  onBack: () => void;
}

const VentasCreatePage: React.FC<Props> = ({ initialData, onBack }) => {
  const isEditing = !!initialData;
  const { token } = useAuth();  const nombreColegio = getNombreColegioFromToken(token) || "Colegio (Automático)";  const {
    formData,    showConfirm,
    resultModal,
    parametrosFacturacion,
    setShowConfirm,
    setResultModal,
    handleChange,
    handleConfirmSave,
    handleDetallesChange,
    handlePagosChange
  } = useVentasForm(token, initialData);

  const addDetalle = () => {
    handleDetallesChange([
      ...formData.detalles,
      {
        productoId: "",
        descripcion: "",
        cantidad: 1,
        valorUnitario: 0,
        porcentajeDescuento: 0,
      } as FacturaDetalleCreateDTO
    ]);
  };

  const removeDetalle = (index: number) => {
    handleDetallesChange(formData.detalles.filter((_: any, i: number) => i !== index));
  };

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.clienteId) newErrors.clienteId = "El cliente es requerido";
    if (!formData.fechaElaboracion) newErrors.fechaElaboracion = "La fecha es requerida";
    
    formData.detalles.forEach((doc: any, index: number) => {
      if (!doc.productoId) newErrors[`detalle_${index}_producto`] = "Debe elegir un producto";
      if (!doc.cantidad || doc.cantidad <= 0) newErrors[`detalle_${index}_cantidad`] = "Cantidad requ.";
      if (doc.valorUnitario === undefined || doc.valorUnitario < 0) newErrors[`detalle_${index}_valor`] = "Valor req.";
    });

    if (formData.esCredito) {
      
      if (!formData.diasCredito || formData.diasCredito < 1 || formData.diasCredito > 365) newErrors.diasCredito = "1-365 días";
    } else {
      if (condicionPago === 'CONTADO') {
        (formData.pagos || []).forEach((pago: any, index: number) => {
          if (!pago.medioPagoId) newErrors[`pago_${index}_medioPago`] = "Requerido";
          if (!pago.monto || pago.monto <= 0) newErrors[`pago_${index}_monto`] = "Requerido";
          if (!pago.fechaRecibo && !formData.fechaElaboracion) newErrors[`pago_${index}_fechaRecibo`] = "Requerido";
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const currentTotal = Number(formData.detalles.reduce((acc: number, curr: FacturaDetalleCreateDTO) => {
    const subtotal = curr.cantidad * curr.valorUnitario;
    const discount = subtotal * ((curr.porcentajeDescuento || 0) / 100);
    const base = subtotal - discount;
    const cargo = base * ((curr.tarifaCargo || 0) / 100);
    const retencion = base * ((curr.tarifaRetencion || 0) / 100);
    return acc + (base + cargo - retencion);
  }, 0).toFixed(2));

  const currentTotalPagos = Number((formData.pagos || []).reduce((acc: number, curr: ReciboCajaCreate) => acc + (curr.monto || 0), 0).toFixed(2));
  const saldoPendiente = Number(Math.max(0, currentTotal - currentTotalPagos).toFixed(2));

  const [condicionPago, setCondicionPago] = useState<'CREDITO' | 'CONTADO'>(
    formData.esCredito ? 'CREDITO' : 'CONTADO'
  );

  useEffect(() => {
    if (condicionPago === 'CONTADO' && !formData.esCredito) {
      const p = formData.pagos && formData.pagos.length > 0 ? formData.pagos[0] : { medioPagoId: 1, monto: 0, fechaRecibo: formData.fechaElaboracion, referencia: "", observaciones: "" };
      handlePagosChange([{ ...p, monto: currentTotal }]);
    } else if (condicionPago === 'CREDITO') {
      handlePagosChange([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condicionPago, currentTotal, formData.esCredito]);

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20 px-4 animate-in fade-in duration-500">
      <StatusModal
        show={showConfirm}
        type="confirm"
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
        message={isEditing ? "¿Actualizar esta venta?" : "¿Crear esta nueva venta?"}
      />

      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => {
          setResultModal((m) => ({ ...m, show: false }));
          if (resultModal.success) onBack();
        }}
      />

      <div className="tuto-ventas-sticky-header flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm sticky top-4 z-20 border border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors" title="Volver">    
            <ArrowLeft size={24} className="text-slate-400" />
          </button>
          <h1 className="text-xl font-black text-slate-800 uppercase flex items-center gap-2">
            <Receipt size={28} className="text-blue-600" />
            {isEditing ? "Editar Venta" : "Nueva Venta"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Estimado</p>
            <p className="text-xl font-black text-emerald-600">{formatCurrency(Math.round(currentTotal))}</p>
          </div>
          {(formData.pagos || []).length > 0 && (
            <div className="text-right mr-4 border-l pl-4 border-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Abonado</p>
              <p className="text-xl font-black text-blue-600">{formatCurrency(Math.round(currentTotalPagos))}</p>
            </div>
          )}
          {(formData.pagos || []).length > 0 && saldoPendiente > 0 && (
             <div className="text-right mr-4 border-l pl-4 border-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saldo</p>
              <p className="text-xl font-black text-amber-600">{formatCurrency(Math.round(saldoPendiente))}</p>
            </div>
          )}
            <Button 
              onClick={() => {
                if (!validateForm()) {
                  setResultModal({ show: true, success: false, message: "Por favor corrija los campos en rojo." });
                  return;
                }
                if (formData.detalles.length === 0) {
                  setResultModal({ show: true, success: false, message: "La factura debe tener al menos un detalle agregado." });
                  return;
                }
                setShowConfirm(true);
              }} 
              icon={Save}
            >
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <section className="tuto-ventas-encabezado bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <FileText size={18} className="text-blue-500" /> Datos de Encabezado
            </h3>
            <div className="space-y-4">
              <InputField
                label="Número de Venta"
                name="numero"
                value={(formData as any).numero || "Pendiente"}
                onChange={() => {}}
                icon={Hash}
                placeholder="-- Generado Automáticamente --"
                disabled
              />

              <AsyncSearchField
                label="Buscar Cliente"
                value={formData.clienteId}
                displayValue={formData.clienteId ? "Cliente Seleccionado" : ""}
                placeholder="Nombre o ID del Cliente..."
                fetcher={async (q) => {
                  const res = await buscarTerceros("CLIENTE,PROVEEDOR", q, true);
                  return res.success && res.data ? res.data : [];
                }}
                getDisplayValue={(c: any) => c.nombreCompleto ? `${c.nombreCompleto} - ${c.identificacion}` : (c.nombreComercial ? `${c.nombreComercial} - ${c.identificacion}` : `${c.identificacion}`)}
                getKey={(c: any) => c.id}
                onSelect={(c: any) => handleChange({ target: { name: "clienteId", value: c.id } } as any)}
                required
                error={errors.clienteId}
              />

              <InputField
                label="Vendedor"
                name="vendedor"
                value={nombreColegio}
                onChange={() => {}}
                icon={User}
                disabled
              />

              <InputField
                label="Fecha de la Venta"
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
                onChange={handleChange}
                placeholder="Nota u observación de la factura"
              />
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <section className="tuto-ventas-detalle bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-700 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Tags size={18} className="text-emerald-500" /> Líneas de Detalle
              </h3>
              <Button onClick={addDetalle} icon={Plus} variant="outline" className="text-xs py-2 px-4 rounded-xl">
                Añadir Producto
              </Button>
            </div>

            {formData.detalles.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                <FileText size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500 mb-1">Sin detalles agregados</p>
                <p className="text-xs text-slate-400">Añada productos para continuar con la venta</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.detalles.map((detalle: FacturaDetalleCreateDTO, index: number) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                     {/* Botón Eliminar fila */}
                     <button
                        onClick={() => removeDetalle(index)}
                        className="absolute -top-3 -right-3 p-2 bg-red-100 text-red-600 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all hidden group-hover:block"
                        title="Eliminar fila"
                      >
                        <Trash2 size={14} />
                      </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="lg:col-span-3">
                        <AsyncSearchField
                          label="Producto"
                          value={detalle.productoId}
                          displayValue={detalle.descripcion || ""}
                          placeholder="Buscar nombre o referencia"
                          fetcher={async (q) => {
                            const res = await searchProductos(q, 1, true); // tipoUso 1 = Venta
                            return res.success && res.data ? res.data : [];
                          }}
                          getDisplayValue={(p: any) => `${p.sku || 'S/N'} - ${p.nombre} (${formatCurrency(p.precios?.[0]?.valor)}) ${p.impuestoCargoNombre ? `| Cargo: ${p.impuestoCargoNombre} (${p.tarifaCargo}%)` : ''} ${p.retencionNombre ? `| Ret: ${p.retencionNombre} (${p.tarifaRetencion}%)` : ''}`}
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
                            handleDetallesChange(newDetalles);
                          }}
                          required
                          error={errors[`detalle_${index}_producto`]}
                        />
                        {(detalle.impuestoCargoNombre || detalle.retencionNombre) && (
                          <div className="flex flex-wrap justify-start gap-2 mt-2 mb-3 px-1">
                            {detalle.impuestoCargoNombre && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 shadow-sm border border-blue-200">
                                Cargo: {detalle.impuestoCargoNombre} {detalle.tarifaCargo ? `(${detalle.tarifaCargo}%)` : ""}
                              </span>
                            )}
                            {detalle.retencionNombre && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200">
                                Retención: {detalle.retencionNombre} {detalle.tarifaRetencion ? `(${detalle.tarifaRetencion}%)` : ""}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-3">
                         <InputField
                          label="Descripción (Opcional)"
                          name="descripcion"
                          value={detalle.descripcion || ""}
                          onChange={(e) => {
                            const newDetalles = [...formData.detalles];
                            newDetalles[index].descripcion = e.target.value;
                            handleDetallesChange(newDetalles);
                          }}
                          placeholder="Nota sobre el producto"
                        />
                      </div>

                      <InputField
                        label="Cant."
                        name="cantidad"
                        type="number"
                        min={0}
                        max={999}
                        step="1"
                        maxLength={3}
                        onlyNumbers
                        value={detalle.cantidad === 0 ? '' : detalle.cantidad}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newDetalles = [...formData.detalles];
                          const val = e.target.value;
                          newDetalles[index].cantidad = val === '' ? 0 : Math.max(0, Math.trunc(Number(val)));
                          handleDetallesChange(newDetalles);
                        }}
                        required
                        error={errors[`detalle_${index}_cantidad`]}
                      />

                      <InputField
                        label="V. Unitario"
                        name="valorUnitario"
                        type="number"
                        min={0}
                        max={10000000}
                        step="0.01"
                        maxLength={8}
                        onlyNumbers
                        allowDecimals
                        value={detalle.valorUnitario === 0 ? '' : detalle.valorUnitario}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newDetalles = [...formData.detalles];
                          const val = e.target.value;
                          newDetalles[index].valorUnitario = val === '' ? 0 : Math.max(0, Number(val));
                          handleDetallesChange(newDetalles);
                        }}
                        required
                        error={errors[`detalle_${index}_valor`]}
                      />

                      <InputField
                        label="% Dcto"
                        name="porcentajeDescuento"
                        type="number"
                        min={0}
                        max={100}
                        step="0.01"
                        maxLength={21}
                        onlyNumbers
                        allowDecimals
                        value={detalle.porcentajeDescuento === 0 ? '' : detalle.porcentajeDescuento}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newDetalles = [...formData.detalles];
                          const val = e.target.value;
                          newDetalles[index].porcentajeDescuento = val === '' ? 0 : Math.min(100, Math.max(0, Number(val)));
                          handleDetallesChange(newDetalles);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sección de Condición y Medios de Pago */}
          <section className="tuto-ventas-pagos bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mt-6">
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
                    handleChange({ target: { name: "diasCredito", value: null } } as any);
                    
                  }
                }}
                options={[
                  { id: 'CONTADO', nombre: 'De Contado (Pago Total)' },
                  { id: 'CREDITO', nombre: 'A Crédito' }
                ]}
                displayExpr={(item) => item.nombre}
              />
            </div>

            {condicionPago === 'CREDITO' ? ( <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50'> <InputField label='Días de Crédito' name='diasCredito' type='number' min={1} max={365} maxLength={21} onlyNumbers value={formData.diasCredito || ''} onChange={(e: any) => handleChange({ target: { name: 'diasCredito', value: Number(e.target.value) || null } } as any)} required error={errors.diasCredito} /> <div className='flex flex-col justify-center'> <p className='text-sm font-medium p-2 mt-[26px] bg-white rounded-lg border border-emerald-200 text-center text-slate-600'>Vencimiento: {formData.diasCredito ? new Date(new Date(formData.fechaElaboracion + 'T12:00:00').getTime() + (formData.diasCredito * 24 * 60 * 60 * 1000)).toLocaleDateString() : 'Ingresa días'} </p> </div> <div className='col-span-1 md:col-span-2 text-center mt-2 p-3 bg-amber-50 border border-amber-100 rounded-xl'> <p className='text-xs text-amber-600 font-medium'>Factura a Crédito. Quedará en estado Pendiente.</p> </div> </div> ) : (
              <div className="space-y-4">
                {formData.pagos?.map((pago: ReciboCajaCreate, index: number) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        label="Medio de Pago"
                        name={`pago_${index}_medioPagoId`}
                        value={pago.medioPagoId || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const newPagos = [...formData.pagos!];
                          newPagos[index].medioPagoId = Number(e.target.value) || 0;
                          handlePagosChange(newPagos);
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
                        maxLength={21}
                        onlyNumbers
                        allowDecimals
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
                        name="fechaRecibo"
                        type="date"
                        value={pago.fechaRecibo || formData.fechaElaboracion}
                        onChange={(e) => {
                          const newPagos = [...formData.pagos!];
                          newPagos[index].fechaRecibo = e.target.value;
                          handlePagosChange(newPagos);
                        }}
                        disabled
                        required
                        error={errors[`pago_${index}_fechaRecibo`]}
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

export default VentasCreatePage;





