import { useEffect, useState } from 'react';
import { Table, type Column } from '../../../components/organisms/Table';
import SearchBar from '../../../components/molecules/SearchBar';
import { FilterGroup } from '../../../components/molecules/FilterGroup';
import { useCartera } from '../../../../application/hooks/useCartera';
import type { CuentaPorCobrar } from '../../../../domain/models/Cartera';
import { FileText, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

const getDiasVencidosBadge = (dias: number) => {
  if (dias <= 0) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (dias <= 30) return 'bg-amber-50 text-amber-600 border-amber-100';
  if (dias <= 60) return 'bg-orange-50 text-orange-600 border-orange-100';
  return 'bg-rose-50 text-rose-600 border-rose-100';
};

const getEstadoBadge = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case 'pagada': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'pendiente': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'anulada': return 'bg-rose-50 text-rose-600 border-rose-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

export const CuentasPorCobrarView = () => {
  const navigate = useNavigate();
  const { cuentas, loading, fetchCuentasPorCobrar } = useCartera();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  useEffect(() => {
    const estadoNum = filterEstado !== '' ? Number(filterEstado) : undefined;
    fetchCuentasPorCobrar(undefined, desde || undefined, hasta || undefined, estadoNum);
  }, [fetchCuentasPorCobrar, filterEstado, desde, hasta]);

  const filteredData = cuentas.filter(c => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return c.clienteNombre.toLowerCase().includes(term) ||
      c.numeroFactura.toLowerCase().includes(term);
  });

  const columns: Column<CuentaPorCobrar>[] = [
    {
      header: 'Factura',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <FileText size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase text-[11px] text-slate-800">{item.numeroFactura}</span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
              {new Date(item.fecha).toLocaleDateString()}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Cliente',
      render: (item) => (
        <span className="font-bold text-[10px] text-slate-700 uppercase">{item.clienteNombre}</span>
      )
    },
    {
      header: 'Vencimiento',
      render: (item) => (
        <span className="text-[10px] font-bold text-slate-600">
          {new Date(item.fechaVencimiento).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Días Vencidos',
      render: (item) => (
        <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider ${getDiasVencidosBadge(item.diasVencidos)}`}>
          {item.diasVencidos <= 0 ? 'Al día' : `${item.diasVencidos} días`}
        </span>
      )
    },
    {
      header: 'Saldo',
      render: (item) => (
        <span className="font-black text-slate-800 text-xs">{formatCurrency(item.saldo)}</span>
      )
    },
    {
      header: 'Estado',
      render: (item) => (
        <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider ${getEstadoBadge(item.estado)}`}>
          {item.estado}
        </span>
      )
    },
    {
      header: 'Acciones',
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/dashboard/ventas/${item.facturaId}`)}
            className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-600 hover:text-white transition-all shadow-sm"
            title="Ver Factura"
          >
            <Eye size={15} strokeWidth={2.5} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="tuto-cartera-search w-full md:w-1/3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por cliente o factura..."
          />
        </div>
        <div className="tuto-cartera-filters flex flex-wrap gap-2 items-end">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Desde</label>
            <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
              className="border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hasta</label>
            <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
              className="border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white" />
          </div>
          <FilterGroup
            options={[
              { label: 'Todos', id: '' },
              { label: 'Pendiente', id: '1' },
              { label: 'Pagada', id: '4' },
              { label: 'Anulada', id: '5' },
            ]}
            activeId={filterEstado}
            onChange={setFilterEstado}
          />
        </div>
      </div>

      <div className="tuto-cartera-table bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold text-sm">Cargando...</div>
        ) : (
          <Table data={filteredData} columns={columns} />
        )}
      </div>
    </div>
  );
};
