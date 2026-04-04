import { useEffect, useState } from "react";
import VentasList from "./ListVentas/VentasList";
import VentasCreatePage from "./CreateVentas/VentasCreatePage";
import { getVentasByColegio } from "../../../../services/venta/ventaService";
import { FileText, FilePlus, Receipt } from "lucide-react";
import LoadingOverlay from "../../../shared/LoadingOverlay";
import type { FacturaVentaReadDTO } from "../../../../models/Venta";

const VentasPage = () => {
  const [view, setView] = useState<'lista' | 'formulario'>('lista');
  const [ventas, setVentas] = useState<FacturaVentaReadDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const response = await getVentasByColegio();
      if (response.success && response.data) setVentas(response.data);        
    } finally { setLoading(false); }
  };

  useEffect(() => { if (view === 'lista') fetchVentas(); }, [view]);

  const handleBackToList = () => {
    setView('lista');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-8">
      {loading && <LoadingOverlay message="Sincronizando Facturas..." />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-3">
            <Receipt className="text-blue-600" size={28}/> Gestión de Ventas
          </h1>
          {view === 'lista' && !loading && (
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              {ventas.length} Facturas registradas
            </p>
          )}
        </div>

        <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm self-start">
          <button
            onClick={handleBackToList}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
              ${view === 'lista' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FileText size={14} /> Historial de Ventas
          </button>
          <button
            onClick={() => { setView('formulario'); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
              ${view === 'formulario' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}       
          >
            <FilePlus size={14} /> Nueva Venta
          </button>
        </div>
      </div>

      <main className="animate-in fade-in slide-in-from-bottom-3 duration-700"> 
        {view === 'lista' ? (
          <VentasList data={ventas} onEdit={() => {}} />
        ) : (
          <VentasCreatePage onBack={handleBackToList} />
        )}
      </main>
    </div>
  );
};
export default VentasPage;