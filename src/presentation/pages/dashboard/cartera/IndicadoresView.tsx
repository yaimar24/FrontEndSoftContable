import { useEffect } from 'react';
import { useCartera } from '../../../../application/hooks/useCartera';
import { TrendingUp, TrendingDown, Clock, RotateCw, Percent, DollarSign, AlertTriangle, BarChart3, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

export const IndicadoresView = () => {
  const { indicadores, loading, fetchIndicadores } = useCartera();

  useEffect(() => {
    fetchIndicadores();
  }, [fetchIndicadores]);

  if (loading || !indicadores) {
    return <div className="text-center py-12 text-slate-400 font-bold text-sm">Cargando indicadores...</div>;
  }

  const kpis = [
    {
      label: 'Total Cartera',
      value: formatCurrency(indicadores.totalCartera),
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Vencido',
      value: formatCurrency(indicadores.totalVencido),
      icon: TrendingDown,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      label: 'Total Por Vencer',
      value: formatCurrency(indicadores.totalPorVencer),
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: '% Cartera Vencida',
      value: `${indicadores.porcentajeCarteraVencida.toFixed(1)}%`,
      icon: Percent,
      color: indicadores.porcentajeCarteraVencida > 50 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Días Promedio Recaudo',
      value: `${indicadores.diasPromedioRecaudo.toFixed(1)} días`,
      icon: Clock,
      color: indicadores.diasPromedioRecaudo > 60 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Rotación Cartera',
      value: `${indicadores.rotacionCartera.toFixed(2)}x`,
      icon: RotateCw,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="tuto-indicadores-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3.5 rounded-xl ${kpi.color}`}>
              <kpi.icon size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interpretación */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest mb-4">Análisis Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${indicadores.porcentajeCarteraVencida > 50 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${indicadores.porcentajeCarteraVencida > 50 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}
              >
                {indicadores.porcentajeCarteraVencida > 50 ? <AlertTriangle size={16} strokeWidth={2.5} /> : <CheckCircle2 size={16} strokeWidth={2.5} />}
              </div>
              <p className="text-xs font-bold leading-5 text-slate-600">
                {indicadores.porcentajeCarteraVencida > 50
                  ? `El ${indicadores.porcentajeCarteraVencida.toFixed(0)}% de tu cartera está vencida. Se recomienda gestión de cobro activa.`
                  : `Solo el ${indicadores.porcentajeCarteraVencida.toFixed(0)}% de tu cartera está vencida. Buen control.`
                }
              </p>
            </div>
          </div>
          <div className={`p-4 rounded-xl border ${indicadores.diasPromedioRecaudo > 60 ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${indicadores.diasPromedioRecaudo > 60 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}
              >
                {indicadores.diasPromedioRecaudo > 60 ? <Clock size={16} strokeWidth={2.5} /> : <BarChart3 size={16} strokeWidth={2.5} />}
              </div>
              <p className="text-xs font-bold leading-5 text-slate-600">
                {indicadores.diasPromedioRecaudo > 60
                  ? `El recaudo promedio es de ${indicadores.diasPromedioRecaudo.toFixed(0)} días. Considera revisar políticas de crédito.`
                  : `Recaudo promedio de ${indicadores.diasPromedioRecaudo.toFixed(0)} días. Dentro del rango saludable.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
