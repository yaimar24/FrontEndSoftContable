import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, type Column } from '../../../components/organisms/Table';
import { useCartera } from '../../../../application/hooks/useCartera';
import type { CuentaPorCobrar } from '../../../../domain/models/Cartera';
import { FileText, Eye, DollarSign, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { formatCurrency } from '../../../../utils/formatters';

const COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

const getDiasVencidosBadge = (dias: number) => {
  if (dias <= 0) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (dias <= 30) return 'bg-amber-50 text-amber-600 border-amber-100';
  if (dias <= 60) return 'bg-orange-50 text-orange-600 border-orange-100';
  return 'bg-rose-50 text-rose-600 border-rose-100';
};

export const AgingCarteraView = () => {
  const navigate = useNavigate();
  const { aging, loading, fetchAging } = useCartera();

  useEffect(() => {
    fetchAging();
  }, [fetchAging]);

  if (loading || !aging) {
    return <div className="text-center py-12 text-slate-400 font-bold text-sm">Cargando aging de cartera...</div>;
  }

  const barData = [
    { name: '0-30 días', value: aging.rango0a30, color: COLORS[0] },
    { name: '31-60 días', value: aging.rango31a60, color: COLORS[1] },
    { name: '61-90 días', value: aging.rango61a90, color: COLORS[2] },
    { name: '+90 días', value: aging.rangoMas90, color: COLORS[3] },
  ];

  const pieData = barData.filter(d => d.value > 0);

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
    <div className="space-y-6">
      {/* Cards KPI */}
      <div className="tuto-aging-cards grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Deuda</p>
            <p className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(aging.totalDeuda)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pagado</p>
            <p className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(aging.totalPagado)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facturas Pendientes</p>
            <p className="text-xl font-black text-slate-800 tracking-tight">{aging.facturasPendientes}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="tuto-aging-charts grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest mb-4">Distribución por Rango</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest mb-4">Proporción de Cartera</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {barData.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-bold text-slate-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facturas Table */}
      <div className="tuto-aging-table bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest flex items-center gap-2">
            <Clock size={16} /> Facturas Vencidas
          </h3>
        </div>
        <Table data={aging.facturas} columns={columns} />
      </div>
    </div>
  );
};
