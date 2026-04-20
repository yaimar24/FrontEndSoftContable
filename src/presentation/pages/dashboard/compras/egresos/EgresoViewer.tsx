import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getComprobanteEgresoById } from "../../../../../data/services/comprobanteEgreso/comprobanteEgresoService";
import type { ComprobanteEgresoRead } from "../../../../../domain/models/ComprobanteEgreso";
import { useGlobalLoading as useLoading } from "../../../../../application/context/LoadingContext";
import PageHeader from "../../../../components/organisms/PageHeader";
import { ArrowLeft, Printer, Banknote } from "lucide-react";
import Button from "../../../../components/atoms/Button";
import { AsientosContablesSection } from "../../../../components/organisms/AsientosContablesSection";

export const EgresoViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [egreso, setEgreso] = useState<ComprobanteEgresoRead | null>(null);
  const { show, hide } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchEgreso(Number(id));
    }
  }, [id]);

  const fetchEgreso = async (egresoId: number) => {
    try {
      show();
      const res = await getComprobanteEgresoById(egresoId);
      if (res.success && res.data) {
        setEgreso(res.data);
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

  if (!egreso) return null;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="print:hidden">
        <PageHeader 
          title="Detalle de Comprobante de Egreso" 
          subtitle="Previsualización del comprobante de pago" 
          icon={Banknote}
          actions={
            <Button
              variant="primary"
              icon={Printer}
              onClick={handlePrint}
            >
              Imprimir Comprobante
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
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Comprobante de Egreso</h1>
            <h2 className="text-4xl font-black text-blue-600 mt-2 tracking-tight">{egreso.numero}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-medium">
            <div className="space-y-4">
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Proveedor</p>
                <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {egreso.proveedorNombre}
                </p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Factura Vinculada</p>
                <button 
                  onClick={() => navigate(`/dashboard/factura-compra/${egreso.facturaCompraId}`)} 
                  className="text-lg font-black text-blue-600 hover:underline tracking-tight"
                >
                  {egreso.facturaCompraNumero}
                </button>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Medio de Pago</p>
                <p className="text-base font-bold text-slate-800">{egreso.medioPagoId} - {egreso.medioPagoNombre}</p>
              </div>
            </div>

            <div className="space-y-4 md:border-l-2 border-slate-100 md:pl-8">
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Tipo de Operación</p>
                <span className={`inline-block px-3 py-1 font-black text-xs uppercase border rounded-lg ${egreso.esAbono ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                  {egreso.esAbono ? 'ABONO' : 'PAGO TOTAL'}
                </span>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Fecha de Egreso</p>
                <p className="text-base font-bold text-slate-800 tracking-tight">{new Date(egreso.fechaEgreso).toLocaleDateString()}</p>
              </div>
              {(egreso.referencia || egreso.observaciones) && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  {egreso.referencia && (
                    <div>
                      <p className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Referencia</p>
                      <p className="text-sm font-bold text-slate-700">{egreso.referencia}</p>
                    </div>
                  )}
                  {egreso.observaciones && (
                    <div>
                      <p className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Observaciones</p>
                      <p className="text-sm font-bold text-slate-700">{egreso.observaciones}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-slate-50 border-t-4 border-slate-800 p-6 rounded-xl text-right">
            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-2">Monto Pagado</p>
            <p className="text-5xl font-black text-slate-800 tracking-tighter">${egreso.monto?.toLocaleString()}</p>
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
            <AsientosContablesSection tipoDocumento="ComprobanteEgreso" documentoId={egreso.id} />
        </div>
      </div>

    </div>
  );
};
export default EgresoViewer;