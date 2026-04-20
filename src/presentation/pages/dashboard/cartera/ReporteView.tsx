import { useEffect, useState } from 'react';
import { Table, type Column } from '../../../components/organisms/Table';
import SearchBar from '../../../components/molecules/SearchBar';
import { FilterGroup } from '../../../components/molecules/FilterGroup';
import { useCartera } from '../../../../application/hooks/useCartera';
import type { ReporteCarteraLinea } from '../../../../domain/models/Cartera';
import { FileText, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../../utils/formatters';
import { getAgingRangeBadge as getAgingBadge } from '../../../../utils/statusHelpers';

export const ReporteView = () => {
  const navigate = useNavigate();
  const { reporte, loading, fetchReporte } = useCartera();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  useEffect(() => {
    const estadoNum = filterEstado !== '' ? Number(filterEstado) : undefined;
    fetchReporte({
      desde: desde || undefined,
      hasta: hasta || undefined,
      estado: estadoNum,
    });
  }, [fetchReporte, filterEstado, desde, hasta]);

  const filteredData = (reporte?.lineas || []).filter(c => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return c.clienteNombre.toLowerCase().includes(term) ||
      c.numeroFactura.toLowerCase().includes(term);
  });

  const handleExportCSV = () => {
    if (!reporte?.lineas.length) return;
    const headers = ['Factura', 'Cliente', 'Fecha', 'Vencimiento', 'Días Vencidos', 'Total Neto', 'Pagado', 'Saldo', 'Estado', 'Rango Aging'];
    const rows = reporte.lineas.map(l => [
      l.numeroFactura, l.clienteNombre, l.fecha.split('T')[0], l.fechaVencimiento.split('T')[0],
      l.diasVencidos, l.totalNeto, l.totalPagado, l.saldo, l.estado, l.rangoAging
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_cartera_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<ReporteCarteraLinea>[] = [
    {
      header: 'Factura',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <FileText size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase text-[11px] text-slate-800">{item.numeroFactura}</span>
            <span className="text-[9px] font-bold text-slate-400">{new Date(item.fecha).toLocaleDateString()}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Cliente',
      render: (item) => <span className="font-bold text-[10px] text-slate-700 uppercase">{item.clienteNombre}</span>
    },
    {
      header: 'Total Neto',
      render: (item) => <span className="font-bold text-xs text-slate-600">{formatCurrency(item.totalNeto)}</span>
    },
    {
      header: 'Pagado',
      render: (item) => <span className="font-bold text-xs text-emerald-600">{formatCurrency(item.totalPagado)}</span>
    },
    {
      header: 'Saldo',
      render: (item) => <span className="font-black text-xs text-slate-800">{formatCurrency(item.saldo)}</span>
    },
    {
      header: 'Rango',
      render: (item) => (
        <span className={`px-2 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider ${getAgingBadge(item.rangoAging)}`}>
          {item.rangoAging}
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
      {/* Totales */}
      {reporte && (
        <div className="tuto-reporte-totales grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-slate-100 p-4 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Deuda</span>
            <span className="font-black text-slate-800">{formatCurrency(reporte.totalDeuda)}</span>
          </div>
          <div className="bg-white rounded-xl border border-rose-100 p-4 flex justify-between items-center">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Total Vencido</span>
            <span className="font-black text-rose-600">{formatCurrency(reporte.totalVencido)}</span>
          </div>
          <div className="bg-white rounded-xl border border-amber-100 p-4 flex justify-between items-center">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Total Por Vencer</span>
            <span className="font-black text-amber-600">{formatCurrency(reporte.totalPorVencer)}</span>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="tuto-reporte-search w-full md:w-1/3">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por cliente o factura..." />
        </div>
        <div className="tuto-reporte-filters flex flex-wrap gap-2 items-end">
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
          <button
            onClick={handleExportCSV}
            disabled={!reporte?.lineas.length}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] text-white rounded-xl font-bold text-[11px] hover:bg-blue-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="tuto-reporte-table bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold text-sm">Cargando reporte...</div>
        ) : (
          <Table data={filteredData} columns={columns} />
        )}
      </div>
    </div>
  );
};
