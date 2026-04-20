import { useEffect, useState } from 'react';
import { Table, type Column } from '../../../components/organisms/Table';
import SearchBar from '../../../components/molecules/SearchBar';
import { useCartera } from '../../../../application/hooks/useCartera';
import type { ResumenCliente } from '../../../../domain/models/Cartera';
import { Users, AlertTriangle } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

export const ResumenClienteView = () => {
  const { resumenClientes, loading, fetchResumenClientes } = useCartera();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResumenClientes();
  }, [fetchResumenClientes]);

  const filteredData = resumenClientes.filter(c => {
    if (!searchTerm) return true;
    return c.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sorted = [...filteredData].sort((a, b) => b.totalDeuda - a.totalDeuda);

  const columns: Column<ResumenCliente>[] = [
    {
      header: 'Cliente',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${item.totalVencido > 0 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
            {item.clienteNombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-slate-800">{item.clienteNombre}</span>
            <span className="text-[9px] font-bold text-slate-400">{item.numeroFacturasPendientes} facturas pendientes</span>
          </div>
        </div>
      )
    },
    {
      header: 'Total Deuda',
      render: (item) => (
        <span className="font-black text-slate-800 text-xs">{formatCurrency(item.totalDeuda)}</span>
      )
    },
    {
      header: 'Vencido',
      render: (item) => (
        <span className={`font-black text-xs ${item.totalVencido > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
          {formatCurrency(item.totalVencido)}
        </span>
      )
    },
    {
      header: 'Por Vencer',
      render: (item) => (
        <span className="font-black text-xs text-amber-600">{formatCurrency(item.totalPorVencer)}</span>
      )
    },
    {
      header: 'Riesgo',
      render: (item) => {
        const ratio = item.totalDeuda > 0 ? (item.totalVencido / item.totalDeuda) * 100 : 0;
        let badge = 'bg-emerald-50 text-emerald-600 border-emerald-100';
        let label = 'Bajo';
        if (ratio > 70) { badge = 'bg-rose-50 text-rose-600 border-rose-100'; label = 'Alto'; }
        else if (ratio > 40) { badge = 'bg-amber-50 text-amber-600 border-amber-100'; label = 'Medio'; }
        return (
          <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider ${badge}`}>
            {label}
          </span>
        );
      }
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="tuto-resumen-search w-full md:w-1/3">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar cliente..." />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
          <AlertTriangle size={14} />
          <span>Ordenado por mayor deuda</span>
        </div>
      </div>

      <div className="tuto-resumen-table bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold text-sm">Cargando...</div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Users size={40} strokeWidth={1.5} />
            <p className="mt-3 font-bold text-sm">No hay datos de clientes</p>
          </div>
        ) : (
          <Table data={sorted} columns={columns} />
        )}
      </div>
    </div>
  );
};
