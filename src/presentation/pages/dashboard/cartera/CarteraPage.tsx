import { useState, useEffect } from 'react';
import { Landmark, List, BarChart3, Clock, FileSpreadsheet, Activity, Users, History } from 'lucide-react';
import PageHeader from '../../../components/organisms/PageHeader';
import { CuentasPorCobrarView } from './CuentasPorCobrarView';
import { AgingCarteraView } from './AgingCarteraView';
import { PorVencerView } from './PorVencerView';
import { ReporteView } from './ReporteView';
import { IndicadoresView } from './IndicadoresView';
import { ResumenClienteView } from './ResumenClienteView';
import { HistoricoView } from './HistoricoView';
import { useTutorial } from '../../../../application/context/TutorialContext';

type CarteraTab = 'cuentas' | 'aging' | 'porvencer' | 'reporte' | 'indicadores' | 'clientes' | 'historico';

const CarteraPage = () => {
  const [tab, setTab] = useState<CarteraTab>('cuentas');
  const { setSteps } = useTutorial();

  useEffect(() => {
    if (tab === 'cuentas') {
      setSteps([
        {
          target: '.tuto-header-cartera',
          content: 'Este es el módulo de Cartera. Gestiona las cuentas por cobrar de tu institución.',
        },
        {
          target: '.tuto-cartera-tabs',
          content: 'Navega entre las diferentes vistas: Cuentas por Cobrar, Aging, Por Vencer, Reporte, KPIs, Clientes e Histórico.',
        },
        {
          target: '.tuto-cartera-search',
          content: 'Busca facturas por nombre de cliente o número de factura.',
        },
        {
          target: '.tuto-cartera-filters',
          content: 'Filtra por rango de fechas y estado de la factura.',
        },
        {
          target: '.tuto-cartera-table',
          content: 'Tabla con las cuentas por cobrar. Los colores indican la antigüedad del vencimiento.',
        },
      ]);
    } else if (tab === 'aging') {
      setSteps([
        {
          target: '.tuto-header-cartera',
          content: 'Aging de Cartera: análisis de antigüedad de la deuda.',
        },
        {
          target: '.tuto-aging-cards',
          content: 'Indicadores clave: total de deuda, total pagado y facturas pendientes.',
        },
        {
          target: '.tuto-aging-charts',
          content: 'Gráficos de distribución de cartera por rangos de vencimiento (0-30, 31-60, 61-90, +90 días).',
        },
        {
          target: '.tuto-aging-table',
          content: 'Tabla detallada de las facturas vencidas ordenadas por antigüedad.',
        },
      ]);
    } else if (tab === 'porvencer') {
      setSteps([
        {
          target: '.tuto-header-cartera',
          content: 'Facturas por Vencer: monitorea las facturas próximas a su fecha de vencimiento.',
        },
        {
          target: '.tuto-porvencer-filter',
          content: 'Selecciona el rango de días para consultar (15, 30, 60 o 90 días).',
        },
        {
          target: '.tuto-porvencer-table',
          content: 'Facturas ordenadas por proximidad de vencimiento. Las que vencen en menos de 7 días se resaltan en rojo.',
        },
      ]);
    } else if (tab === 'reporte') {
      setSteps([
        {
          target: '.tuto-header-cartera',
          content: 'Reporte de Cartera: vista detallada exportable con filtros avanzados.',
        },
        {
          target: '.tuto-reporte-totales',
          content: 'Resumen de totales: deuda total, vencido y por vencer.',
        },
        {
          target: '.tuto-reporte-filters',
          content: 'Filtra por fechas, estado y exporta a CSV.',
        },
        {
          target: '.tuto-reporte-table',
          content: 'Tabla detallada con total neto, pagado, saldo y rango de aging por factura.',
        },
      ]);
    } else if (tab === 'indicadores') {
      setSteps([
        {
          target: '.tuto-header-cartera',
          content: 'Indicadores (KPIs): métricas financieras clave de tu cartera.',
        },
        {
          target: '.tuto-indicadores-grid',
          content: 'Indicadores: total cartera, % vencida, días promedio de recaudo y rotación.',
        },
      ]);
    } else if (tab === 'clientes') {
      setSteps([
        {
          target: '.tuto-header-cartera',
          content: 'Resumen por Cliente: concentración de deuda por cada cliente.',
        },
        {
          target: '.tuto-resumen-search',
          content: 'Busca un cliente específico.',
        },
        {
          target: '.tuto-resumen-table',
          content: 'Tabla con la deuda consolidada por cliente, incluyendo nivel de riesgo.',
        },
      ]);
    } else if (tab === 'historico') {
      setSteps([
        {
          target: '.tuto-header-cartera',
          content: 'Histórico: consulta el estado de la cartera en una fecha de corte específica.',
        },
        {
          target: '.tuto-historico-fecha',
          content: 'Selecciona la fecha de corte para ver el snapshot de cartera.',
        },
        {
          target: '.tuto-historico-chart',
          content: 'Gráfico de distribución de cartera a la fecha seleccionada.',
        },
      ]);
    }
  }, [tab, setSteps]);

  const tabs: { id: CarteraTab; label: string; icon: typeof List }[] = [
    { id: 'cuentas', label: 'Cuentas', icon: List },
    { id: 'aging', label: 'Aging', icon: BarChart3 },
    { id: 'porvencer', label: 'Por Vencer', icon: Clock },
    { id: 'reporte', label: 'Reporte', icon: FileSpreadsheet },
    { id: 'indicadores', label: 'KPIs', icon: Activity },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'historico', label: 'Histórico', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto">
      <div className="tuto-header-cartera">
        <PageHeader
          icon={Landmark}
          title="Cartera"
          subtitle="Gestión de cuentas por cobrar"
          switcher={
            <div className="tuto-cartera-tabs flex flex-wrap gap-1">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-[1.1rem] text-[9px] font-black uppercase tracking-widest transition-all
                    ${tab === t.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <t.icon size={12} /> {t.label}
                </button>
              ))}
            </div>
          }
        />
      </div>

      <main className="animate-in fade-in slide-in-from-bottom-3 duration-700">
        {tab === 'cuentas' && <CuentasPorCobrarView />}
        {tab === 'aging' && <AgingCarteraView />}
        {tab === 'porvencer' && <PorVencerView />}
        {tab === 'reporte' && <ReporteView />}
        {tab === 'indicadores' && <IndicadoresView />}
        {tab === 'clientes' && <ResumenClienteView />}
        {tab === 'historico' && <HistoricoView />}
      </main>
    </div>
  );
};

export default CarteraPage;
