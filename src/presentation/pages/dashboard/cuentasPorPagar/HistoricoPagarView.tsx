import { useEffect, useState } from 'react';
import { useCuentasPorPagar } from '../../../../application/hooks/useCuentasPorPagar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

const COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

export const HistoricoPagarView = () => {
  const { historico, loading, fetchHistorico } = useCuentasPorPagar();
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (fecha) fetchHistorico(fecha);
  }, [fetchHistorico, fecha]);

  const barData = historico ? [
    { name: '0-30 días', value: historico.rango0a30, color: COLORS[0] },
    { name: '31-60 días', value: historico.rango31a60, color: COLORS[1] },
    { name: '61-90 días', value: historico.rango61a90, color: COLORS[2] },
    { name: '+90 días', value: historico.rangoMas90, color: COLORS[3] },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Selector de fecha */}
      <div className="tuto-historico-fecha flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
          <Calendar size={20} strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fecha de Corte</label>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 hover:bg-white"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-slate-400 font-bold text-sm">Cargando histórico...</div>
      )}

      {historico && !loading && (
        <>
          {/* KPIs */}
          <div className="tuto-historico-kpis grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CuentasPorPagar Total al corte</p>
              <p className="text-2xl font-black text-slate-800 tracking-tight mt-1">{formatCurrency(historico.totalPendiente)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">CuentasPorPagar Vencida al corte</p>
              <p className="text-2xl font-black text-rose-600 tracking-tight mt-1">{formatCurrency(historico.totalVencido)}</p>
              {historico.totalPendiente > 0 && (
                <p className="text-[10px] font-bold text-slate-400 mt-1">
                  {((historico.totalVencido / historico.totalPendiente) * 100).toFixed(1)}% del total
                </p>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="tuto-historico-chart bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest mb-4">
              Distribución por Rango — {new Date(historico.fechaCorte).toLocaleDateString()}
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
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
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {barData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[10px] font-bold text-slate-500">{entry.name}: {formatCurrency(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
