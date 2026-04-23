import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { getNotaById } from "../../../../data/services/notaCreditoDebito/notaCreditoDebitoService";
import type { NotaCreditoDebitoReadDTO } from "../../../../domain/models/NotaCreditoDebito";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import Button from "../../../components/atoms/Button";
import StatusModal from "../../../components/organisms/StatusModal";
import { AsientosContablesSection } from "../../../components/organisms/AsientosContablesSection";
import { formatCurrencyDecimals as formatCurrency } from "../../../../utils/formatters";
import { getNotaEstadoInfo } from "../../../../utils/statusHelpers";

const NotaViewerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nota, setNota] = useState<NotaCreditoDebitoReadDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });

  const fetchNota = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getNotaById(Number(id));
      if (res.success && res.data) {
        setNota(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNota();
  }, [id]);

  if (loading) return <LoadingOverlay message="Cargando nota..." />;

  if (!nota) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-black text-slate-800 mb-4">No se encontró la nota</h2>
        <Button onClick={() => navigate(-1)} variant="primary">
          Volver
        </Button>
      </div>
    );
  }

  const { color: badgeColor } = getNotaEstadoInfo(nota.estadoNombre);

  const goBack = () => {
    if (nota.facturaVentaId) {
      navigate(`/dashboard/ventas/${nota.facturaVentaId}`);
    } else if (nota.facturaCompraId) {
      navigate(`/dashboard/factura-compra/${nota.facturaCompraId}`);
    } else {
      navigate("/dashboard/notas");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={goBack} icon={ArrowLeft}>
            Volver
          </Button>
          <div className="hidden sm:flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {nota.tipoNombre} #{nota.numero}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
              {nota.estadoNombre}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto mt-8 px-4 space-y-4">
        {/* Alerta de Anulación */}
        {nota.estadoId === 2 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-sm flex items-start gap-4">
            <span className="text-amber-500 text-2xl">⚠️</span>
            <div>
              <h3 className="text-amber-800 font-black text-sm uppercase tracking-widest">Nota Anulada</h3>
              <p className="text-amber-700 text-xs font-medium mt-1">
                Esta nota ha sido anulada. Se ha generado un reverso contable automático para neutralizar los valores previamente asentados.
              </p>
            </div>
          </div>
        )}

        {/* Encabezado */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tipo</p>
            <p className="text-base font-black text-slate-800">{nota.tipoNombre}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Factura Origen</p>
            <p className="text-sm font-bold text-slate-700">{nota.facturaNumero}</p>
            <p className="text-xs text-slate-500 font-medium">{nota.origenFacturaNombre}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tercero</p>
            <p className="text-sm font-bold text-slate-700">{nota.terceroNombre}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha Elaboración</p>
            <p className="text-sm font-bold text-slate-700">
              {new Intl.DateTimeFormat("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(nota.fechaElaboracion))}
            </p>
          </div>
        </div>

        {/* Motivo */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Motivo</p>
            <p className="text-sm font-bold text-slate-700">{nota.motivoNombre}</p>
            {nota.motivoDescripcion && (
              <p className="text-xs text-slate-500 mt-1">{nota.motivoDescripcion}</p>
            )}
          </div>
          {nota.observaciones && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Observaciones</p>
              <p className="text-sm font-medium text-slate-700">{nota.observaciones}</p>
            </div>
          )}
        </div>

        {/* Grid: Detalles + Resumen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Detalles */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={18} className="text-blue-500" />
                  Detalle de Ítems
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-3">Producto / Descripción</th>
                      <th className="px-6 py-3 text-center">Cant</th>
                      <th className="px-6 py-3 text-right">V. Unitario</th>
                      <th className="px-6 py-3 text-center">Impuestos</th>
                      <th className="px-6 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {nota.detalles?.map((det) => (
                      <tr key={det.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-800">
                          {det.productoNombre || det.descripcion}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600">{det.cantidad}</td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {formatCurrency(det.valorUnitario)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col gap-1 items-center">
                            {det.impuestoCargoNombre && (
                              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">
                                {det.impuestoCargoNombre} +{formatCurrency(det.impuestoCargo)}
                              </span>
                            )}
                            {det.retencionNombre && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">
                                {det.retencionNombre} -{formatCurrency(det.impuestoRetencion)}
                              </span>
                            )}
                            {!det.impuestoCargoNombre && !det.retencionNombre && (
                              <span className="text-slate-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-800 font-bold">
                          {formatCurrency(det.valorTotal)}
                        </td>
                      </tr>
                    ))}
                    {(!nota.detalles || nota.detalles.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          No hay detalles.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-6">
                Resumen
              </h3>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total Bruto</span>
                  <span>{formatCurrency(nota.totalBruto)}</span>
                </div>
                {nota.descuentoTotal > 0 && (
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Descuentos</span>
                    <span className="text-red-500">-{formatCurrency(nota.descuentoTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(nota.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 border-t border-slate-100 pt-4">
                  <span>Impuestos (+)</span>
                  <span>{formatCurrency(nota.totalImpuestoCargo)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Retenciones (-)</span>
                  <span>{formatCurrency(nota.totalRetencion)}</span>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-base">Total Neto</span>
                    <span className="font-black text-slate-800 text-lg">
                      {formatCurrency(nota.totalNeto)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprobantes Contables */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  Comprobantes Contables
                </h3>
              </div>
              <div className="p-4">
                <AsientosContablesSection
                  tipoDocumento="FacturaVenta"
                  documentoId={nota.id}
                  initialComprobantes={nota.comprobantes || []}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => setResultModal({ show: false, success: false, message: "" })}
      />
    </div>
  );
};

export default NotaViewerPage;
