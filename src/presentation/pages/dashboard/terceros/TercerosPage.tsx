import { useEffect, useState } from "react";
import TercerosList from "./ListTerceros/TercerosList";
import TercerosCreatePage from "./CreateTerceros/TercerosCreatePage";
import { getTercerosByColegio } from "../../../../data/services/terceros/terceroService";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import PageHeader from "../../../components/organisms/PageHeader";
import type { TerceroCreateDTO, TerceroUpdateDTO } from "../../../../domain/models/Tercero";
import { useTutorial } from "../../../../application/context/TutorialContext";

const TercerosPage = () => {
  const [view, setView] = useState<'lista' | 'formulario'>('lista');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tercerosInfo, setTercerosInfo] = useState<any>(null);
  const [terceros, setTerceros] = useState<TerceroUpdateDTO[]>([]);
  const [selectedTercero, setSelectedTercero] = useState<TerceroCreateDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { setSteps } = useTutorial();

  const fetchTerceros = async () => {
    try {
      setLoading(true);
      const response = await getTercerosByColegio(page, pageSize, searchTerm);
      if (response.success && response.data) {
        setTercerosInfo(response.data);
        setTerceros((response.data as any).items || []);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { 
    if (view === 'lista') {
      fetchTerceros();
      setSteps([
        {
          target: '.tuto-header-terceros',
          content: 'Este es el módulo de Terceros. Aquí gestionas a todos tus clientes, proveedores y empleados.',
        },
        {
          target: '.tuto-btn-terceros-lista',
          content: 'Consulta el listado actualizado de terceros registrados.',
        },
        {
          target: '.tuto-btn-terceros-nuevo',
          content: 'Registra un nuevo tercero (cliente, proveedor o empleado) desde aquí.',
        },
        {
          target: '.tuto-terceros-filter',
          content: 'Filtra los terceros por tipo: clientes, proveedores o muestra todos.',
        },
        {
          target: '.tuto-terceros-export',
          content: 'Exporta la información de terceros a Excel o PDF para reportes.',
        },
        {
          target: '.tuto-terceros-search',
          content: 'Busca terceros por nombre, razón social o número de identificación.',
        },
        {
          target: '.tuto-terceros-table',
          content: 'Tabla de terceros con acciones: editar datos, vincular o desvincular de la institución.',
        }
      ]);
    } else {
      setSteps([
        {
          target: '.tuto-terceros-sticky-header',
          content: 'En esta barra superior puedes ver el título y guardar los cambios realizados.',
        },
        {
          target: '.tuto-terceros-identificacion',
          content: 'Selecciona el tipo de persona (natural o jurídica), el tipo de identificación y el número del documento.',
        },
        {
          target: '.tuto-terceros-info',
          content: 'Completa los datos de nombre, email y teléfono del tercero.',
        },
        {
          target: '.tuto-terceros-ubicacion',
          content: 'Selecciona el municipio y escribe la dirección del tercero.',
        },
        {
          target: '.tuto-terceros-fiscal',
          content: 'Configura la información fiscal: tipo de contribuyente, régimen y responsabilidades.',
        }
      ]);
    }
  }, [view, setSteps, page, pageSize, searchTerm]);

  const handleEdit = (tercero: TerceroCreateDTO) => {
    setSelectedTercero(tercero);
    setView('formulario');
  };

  const handleBackToList = () => {
    setView('lista');
    setSelectedTercero(null);
  };

  return (
    <div className="tuto-form-terceros min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-4 max-w-[1600px] mx-auto">
      {loading && <LoadingOverlay message="Sincronizando..." />}
      
      <div className="tuto-header-terceros">
        <PageHeader
          title="Gestión de Terceros"
          subtitle={view === 'lista' && !loading ? `${terceros.length} Registros activos` : undefined}
          icon={ShieldCheck}
          switcher={
            <>
              <button 
                onClick={handleBackToList}
                className={`tuto-btn-terceros-lista flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                  ${view === 'lista' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Users size={14} /> Lista De Terceros
              </button>
              <button 
                onClick={() => { setSelectedTercero(null); setView('formulario'); }}
                className={`tuto-btn-terceros-nuevo flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                  ${view === 'formulario' && !selectedTercero ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <UserPlus size={14} /> Registrar Terceros
              </button>
            </>
          }
        />
      </div>

      <main className="animate-in fade-in slide-in-from-bottom-3 duration-700">
        {view === 'lista' ? (
          <TercerosList 
            data={terceros} 
            onEdit={handleEdit}
            isServer={!!tercerosInfo}
            paginationProps={tercerosInfo ? {
              ...tercerosInfo,
              onPageChange: setPage,
              onPageSizeChange: (s: number) => { setPageSize(s); setPage(1); }
            } : undefined}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        ) : (
          <TercerosCreatePage initialData={selectedTercero} onBack={handleBackToList} />
        )}
      </main>
    </div>
  );
};

export default TercerosPage;
