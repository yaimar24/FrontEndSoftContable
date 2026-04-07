import { useEffect, useState } from "react";
import TercerosList from "./ListTerceros/TercerosList";
import TercerosCreatePage from "./CreateTerceros/TercerosCreatePage";
import { getTercerosByColegio } from "../../../../services/terceros/terceroService";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import LoadingOverlay from "../../../shared/LoadingOverlay";
import PageHeader from "../../../Layout/PageHeader";
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
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {loading && <LoadingOverlay message="Sincronizando..." />}
      
      <PageHeader
        title="Gestión de Terceros"
        subtitle={view === 'lista' && !loading ? `${terceros.length} Registros activos` : undefined}
        icon={ShieldCheck}
        switcher={
          <>
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
          </>
        }
      />

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