import React, { useEffect } from 'react';
import PageHeader from '../../components/organisms/PageHeader';
import { Table } from '../../components/organisms/Table';
import { useEmpleadosNomina } from '../../../application/hooks/nomina/useEmpleadosNomina';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, Edit3 } from 'lucide-react';
import SearchBar from '../../components/molecules/SearchBar';
import { useFilter } from '../../../application/hooks/useGenericFilter';

export const EmpleadosNominaList: React.FC = () => {
  const { empleados, fetchEmpleados } = useEmpleadosNomina();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);
  
  const {
    searchTerm,
    setSearchTerm,
    filteredData,
  } = useFilter(empleados || [], {
    searchFields: ["nombres", "apellidos", "numeroDocumento", "correoElectronico", "nombreCompleto"],
  });

  const columns = [
    {
      header: "Empleado",
      className: "min-w-[220px] sticky left-0 bg-white group-hover:bg-slate-50 z-20 transition-colors",
      render: (e: any) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <User size={18} />
          </div>
          <div className="flex flex-col">
            <span className={`font-black uppercase text-[11px] tracking-tight ${e.activo ? "text-slate-800" : "text-slate-400 italic"}`}>
              {e.nombreCompleto || `${e.nombres || ''} ${e.apellidos || ''}`.trim()}
            </span>
            <span className="text-[10px] text-slate-400 font-black uppercase">{e.numeroDocumento}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Correo",
      className: "min-w-[180px]",
      render: (e: any) => (
        <span className="font-bold text-slate-700 text-xs">{e.correoElectronico}</span>
      ),
    },
    {
      header: 'Estado', 
      render: (e: any) => (
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${e.activo ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {e.activo ? "Activo" : "Inactivo"}
        </span>
      ) 
    },
    {
      header: "Acciones",
      className: "text-right sticky right-0 bg-white group-hover:bg-slate-50 z-20 transition-colors",
      render: (e: any) => (
        <div className="flex justify-end gap-2">
          <button
            title="Editar Detalles"
            onClick={() => navigate(`/dashboard/nomina/empleados/${e.id}/editar`)}
            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Edit3 size={15} strokeWidth={2.5} />
          </button>
        
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-4 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      <PageHeader
        title="Gestión de Empleados"
        subtitle={`${filteredData?.length || 0} Registros activos`}
        switcher={
          <button 
            onClick={() => navigate('/dashboard/nomina/empleados/nuevo')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all bg-blue-600 text-white shadow-lg shadow-blue-200`}
          >
            <UserPlus size={14} /> Registrar Empleado
          </button>
        }
      />
      
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full lg:w-1/3">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nombre, documento o correo..."
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <Table
            columns={columns}
            data={filteredData}
          />
        </div>
      </div>
    </div>
  );
};
