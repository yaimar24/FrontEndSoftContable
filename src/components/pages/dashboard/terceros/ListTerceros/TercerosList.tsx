import React, { useState } from 'react';
import { Search, Filter, Edit3, Mail, Phone, Building2, User } from 'lucide-react';
import { Table } from '../../../../common/Table';

interface TercerosListProps {
  data: any[];
  onEdit: (tercero: any) => void;
}

const TercerosList: React.FC<TercerosListProps> = ({ data, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtro ajustado para buscar en nombres, apellidos o nombre comercial
  const filteredData = data.filter(t => {
    const nombreCompleto = `${t.nombres} ${t.apellidos} ${t.nombreComercial}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase()) || 
           t.identificacion?.includes(searchTerm);
  });

  const columns = [
    { 
      header: 'Tercero / Razón Social', 
      className: 'min-w-[300px] sticky left-0 bg-white group-hover:bg-slate-50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]', 
      render: (t: any) => {
        // Lógica para mostrar Nombre Real o Nombre Comercial
        const esPersonaNatural = t.tipoPersonaId === 1;
        const nombreAMostrar = esPersonaNatural 
          ? `${t.nombres} ${t.apellidos}` 
          : t.nombreComercial;

        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${esPersonaNatural ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
              {esPersonaNatural ? <User size={16} /> : <Building2 size={16} />}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-800 tracking-tight uppercase leading-tight">
                {nombreAMostrar || "SIN NOMBRE"}
              </span>
              <span className={`text-[8px] font-black mt-1 px-2 py-0.5 rounded-md uppercase w-fit ${
                t.categoriaId === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {t.categoriaId === 1 ? 'Cliente' : 'Proveedor'}
              </span>
            </div>
          </div>
        );
      } 
    },
    { 
      header: 'Identificación', 
      className: 'min-w-[140px]',
      render: (t: any) => (
        <div className="flex flex-col">
            <span className="font-bold text-slate-700 tabular-nums">{t.identificacion}</span>
            <span className="text-[10px] text-slate-400 font-bold">DV: {t.dv}</span>
        </div>
      )
    },
    { 
      header: 'Contacto Directo', 
      className: 'min-w-[240px]',
      render: (t: any) => (
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-2 text-slate-600 font-bold lowercase">
            <Mail size={12} className="text-blue-500 shrink-0"/> {t.email}
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-bold">
            <Phone size={12} className="text-blue-500 shrink-0"/> {t.telefono}
          </div>
        </div>
      ) 
    },
    { 
      header: 'Ubicación', 
      className: 'min-w-[200px]',
      render: (t: any) => (
        <div className="flex flex-col text-[10px] uppercase font-bold text-slate-500">
            <span>{t.direccion}</span>
            <span className="text-blue-600/70 text-[9px]">Cod. Postal: {t.codigoPostal}</span>
        </div>
      ) 
    },
    

    {
      header: 'Acciones',
      className: 'text-right sticky right-0 bg-white group-hover:bg-slate-50 z-20',
      render: (t: any) => (
        <div className="flex justify-end gap-1">
          <button 
            onClick={() => onEdit(t)} 
            className="p-2 hover:bg-blue-600 hover:text-white rounded-xl text-slate-400 transition-all shadow-sm border border-slate-100"
          >
            <Edit3 size={16} />
          </button>
    
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="BUSCAR POR NOMBRE, NIT O CORREO..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-[11px] font-bold uppercase tracking-wider shadow-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase text-slate-500 hover:text-blue-600 transition-all shadow-sm">
          <Filter size={18} /> Filtros Avanzados
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <Table columns={columns} data={filteredData} />
      </div>
    </div>
  );
};

export default TercerosList;