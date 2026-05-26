import PageHeader from "@/presentation/components/organisms/PageHeader";

import EmpleadosList from "./ListEmpleados/EmpleadosList";
import EmpleadosCreatePage from "./CreateEmpleados/EmpleadosCreatePage";
import { useState, useEffect } from "react";
import { getEmpleados } from "@/data/services/empleado/empleadoService";
import { Users } from "lucide-react";

const EmpleadosPage = () => {

  const [view, setView] = useState<'lista' | 'formulario'>('lista');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const response = await getEmpleados(page, pageSize, searchTerm);
      if (response.success && response.data) {
        // Soporta respuesta paginada o array plano
        if (Array.isArray(response.data)) {
          setEmpleados(response.data);
          setTotalCount(response.data.length);
        } else {
          setEmpleados(response.data.items || []);
          setTotalCount(response.data.totalCount || 0);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'lista') fetchEmpleados();
  }, [page, pageSize, searchTerm, view]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-5 space-y-4">


    <PageHeader
  title="Gestión de Empleados"
  subtitle={`${totalCount} registros activos`}
  icon = {Users}
  switcher={
    <>
      <button
        onClick={() => { setSelectedEmpleado(null); setView("lista"); }}
        className={`tuto-btn-terceros-lista flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                  ${view === 'lista' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
      >
        Lista de empleados
      </button>
      <button
        onClick={() => { setSelectedEmpleado(null); setView("formulario"); }}
        className={`tuto-btn-terceros-formulario flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                  ${view === 'formulario' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
      >
        + Crear empleado
      </button>
    </>
  }
/>
      {view === 'lista' ? (
        <EmpleadosList
          data={empleados}
          onEdit={(empleado) => {
            setSelectedEmpleado(empleado);
            setView('formulario');
          }}
          isServer={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          paginationProps={{
            page,
            pageSize,
            setPage,
            setPageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            hasNextPage: page * pageSize < totalCount,
            hasPreviousPage: page > 1,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          loading={loading}
        />
      ) : (
        <EmpleadosCreatePage
          initialData={selectedEmpleado}
          onBack={() => {
            setSelectedEmpleado(null);
            setView('lista');
          }}
        />
      )}
    </div>
  );
};

export default EmpleadosPage;