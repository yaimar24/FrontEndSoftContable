import React, { useState } from "react";
import { Save, ArrowLeft, Plus, Trash2, FileText, Calendar, Hash } from "lucide-react";
import Button from "../../../components/atoms/Button";
import StatusModal from "../../../components/organisms/StatusModal";
import InputField from "../../../components/atoms/InputField";
import SelectField from "../../../components/atoms/SelectField";
import { AsyncSearchField } from "../../../components/organisms/AsyncSearchField";
import { useNotaCreditoDebitoForm } from "../../../../application/hooks/useNotaCreditoDebitoForm";
import { searchProductos } from "../../../../data/services/producto/productoService";
import type { ProductoReadDTO } from "../../../../domain/models/Producto";
import {
  TipoNotaOptions,
  MotivoNotaOptions,
  MotivoNota,
} from "../../../../domain/models/NotaCreditoDebito";
import type { NotaDetalleCreateDTO } from "../../../../domain/models/NotaCreditoDebito";
import { formatCurrencyDecimals as formatCurrency } from "../../../../utils/formatters";

type ProductoConImpuestos = ProductoReadDTO & {
  impuestoCargoId?: number;
  tarifaCargo?: number;
  retencionId?: number;
  retencionNombre?: string;
  tarifaRetencion?: number;
};

interface Props {
  defaultTipo?: number;
  defaultOrigen?: number;
  defaultFacturaId?: number;
  facturaNumero?: string;
  onBack: () => void;
  onSuccess?: () => void;
}

const NotaCreatePage: React.FC<Props> = ({
  defaultTipo,
  defaultOrigen,
  defaultFacturaId,
  facturaNumero,
  onBack,
  onSuccess,
}) => {
  const {
    formData,
    showConfirm,
    resultModal,
    loading,
    setShowConfirm,
    setResultModal,
    handleChange,
    handleDetallesChange,
    handleConfirmSave,
  } = useNotaCreditoDebitoForm({
    defaultTipo,
    defaultOrigen,
    defaultFacturaId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addDetalle = () => {
    handleDetallesChange([
      ...formData.detalles,
      {
        productoId: null,
        descripcion: null,
        cantidad: 1,
        valorUnitario: 0,
        porcentajeDescuento: 0,
        impuestoCargoId: null,
        retencionId: null,
      },
    ]);
  };

  const removeDetalle = (index: number) => {
    handleDetallesChange(formData.detalles.filter((_: NotaDetalleCreateDTO, i: number) => i !== index));
  };

  const updateDetalle = (index: number, field: keyof NotaDetalleCreateDTO, value: NotaDetalleCreateDTO[keyof NotaDetalleCreateDTO]) => {
    const updated = formData.detalles.map((d: NotaDetalleCreateDTO, i: number) =>
      i === index ? { ...d, [field]: value } : d
    );
    handleDetallesChange(updated);
  };

  const currentTotal = Number(formData.detalles.reduce((acc: number, curr: NotaDetalleCreateDTO) => {
    const subtotal = curr.cantidad * curr.valorUnitario;
    const discount = subtotal * ((curr.porcentajeDescuento || 0) / 100);
    const base = subtotal - discount;
    const cargo = base * ((curr.tarifaCargo || 0) / 100);
    const retencion = base * ((curr.tarifaRetencion || 0) / 100);
    return acc + (base + cargo - retencion);
  }, 0).toFixed(2));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.facturaId) newErrors.facturaId = "La factura es requerida";
    if (!formData.fechaElaboracion) newErrors.fechaElaboracion = "La fecha es requerida";
    if (formData.detalles.length === 0) newErrors.detalles = "Debe incluir al menos un detalle";
    if (formData.motivo === MotivoNota.Otro && !formData.motivoDescripcion?.trim()) {
      newErrors.motivoDescripcion = "Debe indicar la descripción del motivo cuando selecciona 'Otro'";
    }

    formData.detalles.forEach((det: NotaDetalleCreateDTO, index: number) => {
      if (!det.productoId && !det.descripcion?.trim())
        newErrors[`detalle_${index}_producto`] = "Seleccione un producto o escriba una descripción";
      if (!det.cantidad || det.cantidad <= 0)
        newErrors[`detalle_${index}_cantidad`] = "Cantidad requ.";
      if (!det.valorUnitario || det.valorUnitario <= 0)
        newErrors[`detalle_${index}_valor`] = "Valor req.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) setShowConfirm(true);
  };

  const tipoLabel = formData.tipo === 1 ? "Nota Crédito" : "Nota Débito";

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={onBack} icon={ArrowLeft}>
            Volver
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black text-slate-800 tracking-tight">
              Crear {tipoLabel}
            </h1>
            {facturaNumero && (
              <p className="text-xs text-slate-500 font-medium">
                Factura: {facturaNumero}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-black text-slate-800">
            Total: {formatCurrency(currentTotal)}
          </span>
          <Button type="submit" variant="primary" icon={Save} isLoading={loading}>
            Guardar
          </Button>
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-6xl mx-auto mt-6 px-4 space-y-6">
        {/* Encabezado */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-5 flex items-center gap-2">
            <Hash size={16} className="text-blue-500" />
            Encabezado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Tipo de Nota"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              options={TipoNotaOptions}
              displayExpr={(item: { id: number; nombre: string }) => item.nombre}
              required
              disabled={!!defaultTipo}
            />
            <SelectField
              label="Motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              options={MotivoNotaOptions}
              displayExpr={(item: { id: number; nombre: string }) => item.nombre}
              required
            />
            <InputField
              label="Fecha Elaboración"
              name="fechaElaboracion"
              type="date"
              value={formData.fechaElaboracion}
              onChange={handleChange}
              icon={Calendar}
              required
              max={new Date().toISOString().split("T")[0]}
              error={errors.fechaElaboracion}
            />
          </div>

          {formData.motivo === MotivoNota.Otro && (
            <div className="mt-4">
              <InputField
                label="Descripción del Motivo"
                name="motivoDescripcion"
                value={formData.motivoDescripcion || ""}
                onChange={handleChange}
                placeholder="Describa el motivo (máx 500 caracteres)"
                maxLength={500}
                required
                error={errors.motivoDescripcion}
              />
            </div>
          )}

          <div className="mt-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones || ""}
              onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
              placeholder="Observaciones adicionales (opcional, máx 500 caracteres)"
              maxLength={500}
              rows={2}
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Detalles */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <FileText size={16} className="text-blue-500" />
              Detalles
            </h2>
            <Button type="button" variant="secondary" icon={Plus} onClick={addDetalle}>
              Agregar Línea
            </Button>
          </div>

          {errors.detalles && (
            <p className="text-red-500 text-xs font-medium mb-3">{errors.detalles}</p>
          )}

          {formData.detalles.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
              <span className="text-3xl mb-2 block">📦</span>
              <p className="text-slate-400 font-bold text-sm">
                Agregue al menos un detalle
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-4 py-3 w-1/3">Producto</th>
                    <th className="px-4 py-3 text-center w-20">Cant</th>
                    <th className="px-4 py-3 text-right w-32">V. Unitario</th>
                    <th className="px-4 py-3 text-center w-20">Dto %</th>
                    <th className="px-4 py-3 text-right w-32">Subtotal</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formData.detalles.map((det: NotaDetalleCreateDTO, index: number) => {
                    const sub = det.cantidad * det.valorUnitario;
                    const disc = sub * ((det.porcentajeDescuento || 0) / 100);
                    const base = sub - disc;
                    const cargo = base * ((det.tarifaCargo || 0) / 100);
                    const retencion = base * ((det.tarifaRetencion || 0) / 100);
                    const lineTotal = base + cargo - retencion;

                    return (
                      <tr key={index} className="group hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <AsyncSearchField
                            label="Producto"
                            value={String(det.productoId || "")}
                            displayValue={det.descripcion || ""}
                            placeholder="Buscar producto..."
                            fetcher={async (q: string) => {
                              const tipoUso = formData.origenFactura === 1 ? 1 : 2;
                              const res = await searchProductos(q, tipoUso, true);
                              return res.success && res.data ? res.data : [];
                            }}
                            getDisplayValue={(p: ProductoConImpuestos) => `${p.sku || 'S/N'} - ${p.nombre} ($${p.precios?.[0]?.valor?.toLocaleString() || 0}) ${p.impuestoCargoNombre ? `| Cargo: ${p.impuestoCargoNombre} (${p.tarifaCargo || p.tarifaIva || 0}%)` : ''} ${p.retencionNombre ? `| Ret: ${p.retencionNombre} (${p.tarifaRetencion || 0}%)` : ''}`}
                            getKey={(p: ProductoReadDTO) => p.id}
                            onSelect={(p: ProductoConImpuestos) => {
                              const updated = [...formData.detalles];
                              updated[index] = {
                                ...updated[index],
                                productoId: p.id,
                                descripcion: p.nombre,
                                valorUnitario: p.precios?.[0]?.valor || 0,
                                impuestoCargoId: p.impuestoCargoId || null,
                                impuestoCargoNombre: p.impuestoCargoNombre || undefined,
                                tarifaCargo: p.tarifaCargo ?? p.tarifaIva ?? 0,
                                retencionId: p.retencionId || null,
                                retencionNombre: p.retencionNombre || undefined,
                                tarifaRetencion: p.tarifaRetencion ?? 0,
                              };
                              handleDetallesChange(updated);
                            }}
                          />
                          {(det.impuestoCargoNombre || det.retencionNombre) && (
                            <div className="flex flex-wrap justify-start gap-2 mt-2 mb-1 px-1">
                              {det.impuestoCargoNombre && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 shadow-sm border border-blue-200">
                                  Cargo: {det.impuestoCargoNombre} {det.tarifaCargo ? `(${det.tarifaCargo}%)` : ""}
                                </span>
                              )}
                              {det.retencionNombre && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200">
                                  Retención: {det.retencionNombre} {det.tarifaRetencion ? `(${det.tarifaRetencion}%)` : ""}
                                </span>
                              )}
                            </div>
                          )}
                          {!det.productoId && (
                            <input
                              type="text"
                              placeholder="O escriba una descripción"
                              value={det.descripcion || ""}
                              onChange={(e) => updateDetalle(index, "descripcion", e.target.value)}
                              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          )}
                          {errors[`detalle_${index}_producto`] && (
                            <p className="text-red-500 text-[10px] mt-0.5">{errors[`detalle_${index}_producto`]}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={1}
                            step="any"
                            value={det.cantidad}
                            onChange={(e) => updateDetalle(index, "cantidad", Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-sm outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          {errors[`detalle_${index}_cantidad`] && (
                            <p className="text-red-500 text-[10px] mt-0.5">{errors[`detalle_${index}_cantidad`]}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={0}
                            step="any"
                            value={det.valorUnitario}
                            onChange={(e) => updateDetalle(index, "valorUnitario", Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-right text-sm outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          {errors[`detalle_${index}_valor`] && (
                            <p className="text-red-500 text-[10px] mt-0.5">{errors[`detalle_${index}_valor`]}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step="any"
                            value={det.porcentajeDescuento}
                            onChange={(e) => updateDetalle(index, "porcentajeDescuento", Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-sm outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-slate-800">
                          {formatCurrency(lineTotal)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeDetalle(index)}
                            className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <StatusModal
        show={showConfirm}
        type="confirm"
        message={`¿Desea guardar esta ${tipoLabel}?`}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        confirmText="Guardar"
        cancelText="Cancelar"
        loading={loading}
      />

      {/* Result Modal */}
      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => {
          setResultModal({ show: false, success: false, message: "" });
          if (resultModal.success) {
            onSuccess?.();
            onBack();
          }
        }}
      />
    </form>
  );
};

export default NotaCreatePage;
