import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReciboCajaById } from "../../../../../data/services/venta/ventaService";
import type { ReciboCajaRead } from "../../../../../domain/models/Venta";
import { useGlobalLoading as useLoading } from "../../../../../application/context/LoadingContext";
import PageHeader from "../../../../components/organisms/PageHeader";
import { ArrowLeft, Printer, Banknote } from "lucide-react";
import Button from "../../../../components/atoms/Button";
import { AsientosContablesSection } from "../../../../components/organisms/AsientosContablesSection";

export const ReciboCajaViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [recibo, setRecibo] = useState<ReciboCajaRead | null>(null);
  const { show, hide } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchRecibo(Number(id));
    }
  }, [id]);

  const fetchRecibo = async (reciboId: number) => {
    try {
      show();
      const res = await getReciboCajaById(reciboId);
      if (res.success && res.data) {
        setRecibo(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!recibo) return null;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="print:hidden">
        <PageHeader 
          title="Detalle de Recibo de Caja" 
          subtitle="Previsualización del comprobante de pago" 
          icon={Banknote}
          actions={
            <Button
              variant="primary"
              icon={Printer}
              onClick={handlePrint}
            >
              Imprimir Recibo
            </Button>
          }
        />
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mt-4"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      <div className="bg-white border-2 border-slate-200/60 p-6 rounded-2xl shadow-xl shadow-slate-200/50 print:shadow-none print:border-none print:p-0">
        <div className="border-4 border-slate-800 p-5 rounded-2xl print:p-0 print:border-none">
          <div className="text-center border-b-4 border-slate-800 pb-6 mb-6">
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Recibo de Caja</h1>
            <h2 className="text-4xl font-black text-blue-600 mt-2 tracking-tight">{recibo.numero}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-medium">
            <div className="space-y-4">
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Cliente</p>
                <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {recibo.terceroNombre}
                </p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Factura Vinculada</p>
                <button 
                  onClick={() => navigate(`/dashboard/ventas/${recibo.facturaVentaId}`)} 
                  className="text-lg font-black text-blue-600 hover:underline tracking-tight"
                >
                  {recibo.facturaVentaNumero}
                </button>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Medio de Pago</p>
                <p className="text-base font-bold text-slate-800">{recibo.medioPagoId} - {recibo.medioPagoNombre}</p>
              </div>
            </div>

            <div className="space-y-4 md:border-l-2 border-slate-100 md:pl-8">
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Tipo de Operaci\u00f3n</p>
                <span className={`inline-block px-3 py-1 font-black text-xs uppercase border rounded-lg ${recibo.esAbono ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                  {recibo.esAbono ? 'ABONO' : 'PAGO TOTAL'}
                </span>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Fecha de Recibo</p>
                <p className="text-base font-bold text-slate-800 tracking-tight">{new Date(recibo.fechaRecibo).toLocaleDateString()}</p>
              </div>
              {(recibo.referencia || recibo.observacion) && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  {recibo.referencia && (
                    <div>
                      <p className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Referencia</p>
                      <p className="text-sm font-bold text-slate-700">{recibo.referencia}</p>
                    </div>
                  )}
                  {recibo.observacion && (
                    <div>
                      <p className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Observaciones</p>
                      <p className="text-sm font-bold text-slate-700">{recibo.observacion}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-slate-50 border-t-4 border-slate-800 p-6 rounded-xl text-right">
            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-2">Monto Recibido</p>
            <p className="text-5xl font-black text-slate-800 tracking-tighter">${recibo.monto.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 print:hidden mt-8 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <Banknote size={18} className="text-blue-500" />
              Comprobantes contables
            </h3>
        </div>
        <div className="p-6">
            <AsientosContablesSection tipoDocumento="ReciboCaja" documentoId={recibo.id} />
        </div>
      </div>

    </div>
  );
};
export default ReciboCajaViewer;

