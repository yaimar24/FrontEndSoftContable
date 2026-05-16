import { useState, useEffect } from 'react';
import { Landmark, List, BarChart3, Clock, FileSpreadsheet, Activity, Users, History } from 'lucide-react';
import PageHeader from '../../../components/organisms/PageHeader';
import { CuentasPorPagarView } from './CuentasPorPagarView';
import { AgingPagarView } from './AgingPagarView';
import { PorVencerPagarView } from './PorVencerPagarView';
import { ReportePagarView } from './ReportePagarView';
import { IndicadoresPagarView } from './IndicadoresPagarView';
import { ResumenProveedorView } from './ResumenProveedorView';
import { HistoricoPagarView } from './HistoricoPagarView';
import { useTutorial } from '../../../../application/context/TutorialContext';

type CuentasPorPagarTab = 'cuentas' | 'aging' | 'porvencer' | 'reporte' | 'indicadores' | 'proveedores' | 'historico';

const CuentasPorPagarPage = () => {
  const [tab, setTab] = useState<CuentasPorPagarTab>('cuentas');
  const { setSteps } = useTutorial();

  useEffect(() => {
    if (tab === 'cuentas') {
      setSteps([
        {
          target: '.tuto-header-cuentasPorPagar',
          content: 'Este es el módulo de CuentasPorPagar. Gestiona las cuentas por pagar de tu institución.',
        },
        {
          target: '.tuto-cuentasPorPagar-tabs',
          content: 'Navega entre las diferentes vistas: Cuentas por Pagar, Aging, Por Vencer, Reporte, KPIs, proveedores e Histórico.',
        },
        {
          target: '.tuto-cuentasPorPagar-search',
          content: 'Busca facturas por nombre de proveedor o número de factura.',
        },
        {
          target: '.tuto-cuentasPorPagar-filters',
          content: 'Filtra por rango de fechas y estado de la factura.',
        },
        {
          target: '.tuto-cuentasPorPagar-table',
          content: 'Tabla con las cuentas por pagar. Los colores indican la antigüedad del vencimiento.',
        },
      ]);
    } else if (tab === 'aging') {
      setSteps([
        {
          target: '.tuto-header-cuentasPorPagar',
          content: 'Aging de CuentasPorPagar: análisis de antigüedad de la deuda.',
        },
        {
          target: '.tuto-aging-cards',
          content: 'Indicadores clave: total de deuda, total pagado y facturas pendientes.',
        },
        {
          target: '.tuto-aging-charts',
          content: 'Gráficos de distribución de cuentasPorPagar por rangos de vencimiento (0-30, 31-60, 61-90, +90 días).',
        },
        {
          target: '.tuto-aging-table',
          content: 'Tabla detallada de las facturas vencidas ordenadas por antigüedad.',
        },
      ]);
    } else if (tab === 'porvencer') {
      setSteps([
        {
          target: '.tuto-header-cuentasPorPagar',
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
          target: '.tuto-header-cuentasPorPagar',
          content: 'Reporte de CuentasPorPagar: vista detallada exportable con filtros avanzados.',
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
          target: '.tuto-header-cuentasPorPagar',
          content: 'Indicadores (KPIs): métricas financieras clave de tu cuentasPorPagar.',
        },
        {
          target: '.tuto-indicadores-grid',
          content: 'Indicadores: total cuentasPorPagar, % vencida, días promedio de recaudo y rotación.',
        },
      ]);
    } else if (tab === 'proveedores') {
      setSteps([
        {
          target: '.tuto-header-cuentasPorPagar',
          content: 'Resumen por Proveedor: concentración de deuda por cada proveedor.',
        },
        {
          target: '.tuto-resumen-search',
          content: 'Busca un proveedor específico.',
        },
        {
          target: '.tuto-resumen-table',
          content: 'Tabla con la deuda consolidada por proveedor, incluyendo nivel de riesgo.',
        },
      ]);
    } else if (tab === 'historico') {
      setSteps([
        {
          target: '.tuto-header-cuentasPorPagar',
          content: 'Histórico: consulta el estado de la cuentasPorPagar en una fecha de corte específica.',
        },
        {
          target: '.tuto-historico-fecha',
          content: 'Selecciona la fecha de corte para ver el snapshot de cuentasPorPagar.',
        },
        {
          target: '.tuto-historico-chart',
          content: 'Gráfico de distribución de cuentasPorPagar a la fecha seleccionada.',
        },
      ]);
    }
  }, [tab, setSteps]);

  const tabs: { id: CuentasPorPagarTab; label: string; icon: typeof List }[] = [
    { id: 'cuentas', label: 'Cuentas', icon: List },
    { id: 'aging', label: 'Aging', icon: BarChart3 },
    { id: 'porvencer', label: 'Por Vencer', icon: Clock },
    { id: 'reporte', label: 'Reporte', icon: FileSpreadsheet },
    { id: 'indicadores', label: 'KPIs', icon: Activity },
    { id: 'proveedores', label: 'proveedores', icon: Users },
    { id: 'historico', label: 'Histórico', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto">
      <div className="tuto-header-cuentasPorPagar">
        <PageHeader
          icon={Landmark}
          title="Cuentas Por Pagar"
          subtitle="Gestión de cuentas por pagar"
          switcher={
            <div className="tuto-cuentasPorPagar-tabs flex flex-wrap gap-1">
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
        {tab === 'cuentas' && <CuentasPorPagarView />}
        {tab === 'aging' && <AgingPagarView />}
        {tab === 'porvencer' && <PorVencerPagarView />}
        {tab === 'reporte' && <ReportePagarView />}
        {tab === 'indicadores' && <IndicadoresPagarView />}
        {tab === 'proveedores' && <ResumenProveedorView />}
        {tab === 'historico' && <HistoricoPagarView />}
      </main>
    </div>
  );
};

export default CuentasPorPagarPage;
