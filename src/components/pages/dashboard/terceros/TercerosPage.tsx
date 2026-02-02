import { useEffect, useState } from "react";
import TercerosList from "./ListTerceros/TercerosList";
import TercerosCreatePage from "./CreateTerceros/TercerosCreatePage";
import { getTercerosByColegio } from "../../../../services/terceros/terceroService";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import LoadingOverlay from "../../../shared/LoadingOverlay";
import type { TerceroCreateDTO, TerceroupdateDTO } from "../../../../models/Tercero";
const TercerosPage = () => {
  const [view, setView] = useState<'lista' | 'formulario'>('lista');
  const [terceros, setTerceros] = useState<TerceroupdateDTO[]>([]);
  const [selectedTercero, setSelectedTercero] = useState<TerceroCreateDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTerceros = async () => {
    try {
      setLoading(true);
      const response = await getTercerosByColegio();
      if (response.success && response.data) setTerceros(response.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (view === 'lista') fetchTerceros(); }, [view]);

  const handleEdit = (tercero: TerceroCreateDTO) => {
    setSelectedTercero(tercero);
    setView('formulario');
  };

  const handleBackToList = () => {
    setView('lista');
    setSelectedTercero(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-8">
      {loading && <LoadingOverlay message="Sincronizando..." />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-3">
            <ShieldCheck className="text-blue-600" size={28}/> Gestión de Terceros
          </h1>
          {view === 'lista' && !loading && (
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              {terceros.length} Registros activos
            </p>
          )}
        </div>

        <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm self-start">
          <button 
            onClick={handleBackToList}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
              ${view === 'lista' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Users size={14} /> Lista De Terceros
          </button>
          <button 
            onClick={() => { setSelectedTercero(null); setView('formulario'); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
              ${view === 'formulario' && !selectedTercero ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <UserPlus size={14} /> Registrar Terceros
          </button>
        </div>
      </div>

      <main className="animate-in fade-in slide-in-from-bottom-3 duration-700">
        {view === 'lista' ? (
          <TercerosList data={terceros} onEdit={handleEdit} />
        ) : (
          <TercerosCreatePage initialData={selectedTercero} onBack={handleBackToList} />
        )}
      </main>
    </div>
  );
};

export default TercerosPage;