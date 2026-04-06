import React, { useEffect, useState } from "react";
import { Receipt, Save, ArrowLeft, Tags, User, Calendar, FileText, Plus, Trash2, Hash, Wallet, DollarSign } from "lucide-react";
import Button from "../../../../common/Button";
import StatusModal from "../../../../common/StatusModal";
import InputField from "../../../../common/InputField";
import { AsyncSearchField } from "../../../../common/AsyncSearchField";
import SelectField from "../../../../common/SelectField";
import { useVentasForm } from "../../../../../hooks/useVentasForm";
import { useAuth } from "../../../../../hooks/useAuth";
import { getNombreColegioFromToken } from "../../../../../utils/jwt";
import { searchClientes } from "../../../../../services/terceros/terceroService";
import { searchProductos } from "../../../../../services/producto/productoService";
import { getMediosPago } from "../../../../../services/venta/ventaService";
import type { FacturaDetalleCreateDTO, ReciboCajaCreate } from "../../../../../models/Venta";

interface Props {
  initialData?: any;
  onBack: () => void;
}

const VentasCreatePage: React.FC<Props> = ({ initialData, onBack }) => {
  const isEditing = !!initialData;
  const { token } = useAuth();  const nombreColegio = getNombreColegioFromToken(token) || "Colegio (Automático)";  const {
    formData,    numeroDisplay,    showConfirm,
    resultModal,
    setShowConfirm,
    setResultModal,
    handleChange,
    handleConfirmSave,
    handleDetallesChange,
    handlePagosChange
  } = useVentasForm(token, initialData);

  const [mediosPago, setMediosPago] = useState<any[]>([]);

  useEffect(() => {
    getMediosPago().then(res => {
      if (res.success && res.data) {
        setMediosPago(res.data);
      }
    });
  }, []);

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

  const [condicionPago, setCondicionPago] = useState<'CREDITO' | 'CONTADO' | 'PARCIAL'>(
    (formData.pagos && formData.pagos.length > 0) 
      ? (currentTotalPagos >= currentTotal ? 'CONTADO' : 'PARCIAL') 
      : 'CREDITO'
  );

  useEffect(() => {
    if (condicionPago === 'CONTADO') {
      const p = formData.pagos && formData.pagos.length > 0 ? formData.pagos[0] : { medioPagoCodigo: "", monto: 0, fechaRecibo: formData.fechaElaboracion, referencia: "", observacion: "" };
      handlePagosChange([{ ...p, monto: currentTotal }]);
    } else if (condicionPago === 'CREDITO') {
      handlePagosChange([]);
    } else if (condicionPago === 'PARCIAL' && (!formData.pagos || formData.pagos.length === 0)) {
      handlePagosChange([{ medioPagoCodigo: "", monto: 0, fechaRecibo: formData.fechaElaboracion, referencia: "", observacion: "" }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condicionPago, currentTotal]);

  const addPago = () => {
    const newPagos = formData.pagos || [];
    handlePagosChange([
      ...newPagos,
      {
        medioPagoCodigo: "",
        monto: saldoPendiente > 0 ? saldoPendiente : 0,
        fechaRecibo: formData.fechaElaboracion,
        referencia: "",
        observacion: ""
      } as ReciboCajaCreate
    ]);
  };

  const removePago = (index: number) => {
    handlePagosChange((formData.pagos || []).filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4 animate-in fade-in duration-500">
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

      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm sticky top-4 z-20 border border-slate-100">
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
            <p className="text-xl font-black text-emerald-600">${Math.round(currentTotal).toLocaleString()}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <FileText size={18} className="text-blue-500" /> Datos de Encabezado
            </h3>
            <div className="space-y-4">
              <InputField
                label="Número de Venta"
                name="numero"
                value={numeroDisplay || "Pendiente"}
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
                icon={User}
                fetcher={async (q) => {
                  const res = await searchClientes(q);
                  return res.success && res.data ? res.data : [];
                }}
                getDisplayValue={(c: any) => c.nombreComercial ? `${c.nombreComercial} - ${c.identificacion}` : `${c.nombreCompleto} - ${c.identificacion}`}
                getKey={(c: any) => c.id}
                onSelect={(c: any) => handleChange({ target: { name: "clienteId", value: c.id } } as any)}
                required
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
              />
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
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
                          displayValue={detalle.productoId ? "Producto agregado" : ""}
                          placeholder="Buscar nombre o referencia"
                          fetcher={async (q) => {
                            const res = await searchProductos(q);
                            return res.success && res.data ? res.data : [];
                          }}
                          getDisplayValue={(p: any) => `${p.sku || 'S/N'} - ${p.nombre} ($${p.precios?.[0]?.valor?.toLocaleString() || 0}) ${p.impuestoCargoNombre ? `| Cargo: ${p.impuestoCargoNombre} (${p.tarifaCargo}%)` : ''} ${p.retencionNombre ? `| Ret: ${p.retencionNombre} (${p.tarifaRetencion}%)` : ''}`}
                          getKey={(p: any) => p.id}
                          onSelect={(p: any) => {
                            const newDetalles = [...formData.detalles];
                            newDetalles[index].productoId = p.id;
                            newDetalles[index].descripcion = p.nombre;
                            newDetalles[index].valorUnitario = p.precios?.[0]?.valor || 0;
                            // Optionally override amount to 1 on re-select     
                            newDetalles[index].cantidad = 1;
                            newDetalles[index].impuestoCargoNombre = p.impuestoCargoNombre;
                            newDetalles[index].tarifaCargo = p.tarifaCargo;
                            newDetalles[index].retencionNombre = p.retencionNombre;
                            newDetalles[index].tarifaRetencion = p.tarifaRetencion;
                            handleDetallesChange(newDetalles);
                          }}
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
                        value={detalle.cantidad}
                        onChange={(e) => {
                          const newDetalles = [...formData.detalles];
                          newDetalles[index].cantidad = Number(e.target.value);
                          handleDetallesChange(newDetalles);
                        }}
                        required
                      />

                      <InputField
                        label="V. Unitario"
                        name="valorUnitario"
                        type="number"
                        value={detalle.valorUnitario}
                        onChange={(e) => {
                          const newDetalles = [...formData.detalles];
                          newDetalles[index].valorUnitario = Number(e.target.value);
                          handleDetallesChange(newDetalles);
                        }}
                        required
                      />

                      <InputField
                        label="% Dcto"
                        name="porcentajeDescuento"
                        type="number"
                        value={detalle.porcentajeDescuento || ""}
                        onChange={(e) => {
                          const newDetalles = [...formData.detalles];
                          newDetalles[index].porcentajeDescuento = Number(e.target.value);
                          handleDetallesChange(newDetalles);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sección de Medios de Pago */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mt-6">
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCondicionPago(e.target.value as any)}
                options={[
                  { id: 'CREDITO', nombre: 'A Crédito (Borrador / Sin Abono Inicial)' },
                  { id: 'CONTADO', nombre: 'De Contado (Pago Total)' },
                  { id: 'PARCIAL', nombre: 'Pago Parcial (Abono Inicial)' }
                ]}
                displayExpr={(item) => item.nombre}
              />
            </div>

            {condicionPago === 'CREDITO' ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                <DollarSign size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500 mb-1">Factura a Crédito</p>
                <p className="text-xs text-slate-400">Esta factura quedará marcada como "Borrador". Los abonos se registrarán después de haberla aprobado.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.pagos?.map((pago: ReciboCajaCreate, index: number) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                    {index > 0 && (
                        <button
                        onClick={() => removePago(index)}
                        className="absolute -top-3 -right-3 p-2 bg-red-100 text-red-600 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all hidden group-hover:block"
                        title="Eliminar fila"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        label="Medio de Pago"
                        name="medioPagoCodigo"
                        value={pago.medioPagoCodigo}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const newPagos = [...formData.pagos!];
                          newPagos[index].medioPagoCodigo = e.target.value;
                          handlePagosChange(newPagos);
                        }}
                        options={mediosPago.map(m => ({ id: m.codigo, nombre: `${m.codigo} - ${m.nombre}` }))}
                        displayExpr={item => item.nombre}
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
disabled={condicionPago === 'CONTADO' && index === 0}
                        required
                        icon={DollarSign}
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
                        disabled={condicionPago === 'CONTADO' && index === 0}
                        required
                      />
                    </div>
                  </div>
                ))}
                
                {condicionPago === 'PARCIAL' && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={addPago} icon={Plus} variant="outline" className="text-xs py-2 px-4 rounded-xl">
                      Agregar otro medio de pago
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default VentasCreatePage;





