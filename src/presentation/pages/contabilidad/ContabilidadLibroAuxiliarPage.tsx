import { useState, useMemo, useEffect } from 'react';
import PageHeader from '../../components/organisms/PageHeader';
import { SelectorCuentaPuc } from '../../components/organisms/SelectorCuentaPuc';
import { Table, type Column } from '../../components/organisms/Table';
import StatusModal from '../../components/organisms/StatusModal';
import { useContabilidad } from '../../../application/hooks/useContabilidad';
import type { MovimientoLibroAuxiliar } from '../../../domain/models/Contabilidad';
import { useTutorial } from '../../../application/context/TutorialContext';
import { formatCurrency } from '../../../utils/formatters';

export const ContabilidadLibroAuxiliarPage = () => {
  const { libroAuxiliar, fetchLibroAuxiliar, loading, error } = useContabilidad();
  const { setSteps } = useTutorial();

  const [cuentaCodigo, setCuentaCodigo] = useState<string | null>('');
  const [desde, setDesde] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [hasta, setHasta] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setSteps([
      {
        target: '.tuto-header-auxiliar',
        content: 'El Auxiliar Contable muestra los movimientos detallados y saldos de una cuenta específica.',
      },
      {
        target: '.tuto-auxiliar-filtros',
        content: 'Selecciona una cuenta PUC y un rango de fechas para consultar los movimientos.',
      },
      {
        target: '.tuto-auxiliar-consultar',
        content: 'Presiona este botón para ejecutar la consulta y ver los resultados.',
      },
    ]);
  }, [setSteps]);

  const handleConsultar = () => {
    fetchLibroAuxiliar(cuentaCodigo || null, desde || null, hasta || null);
  };

  const processedData = useMemo(() => {
    if (!libroAuxiliar || libroAuxiliar.length === 0) return [];
    
    let saldoActual = 0;
    return libroAuxiliar.map(m => {
      if (m.naturalezaCuenta === 'D') {
        saldoActual += (m.debito || 0) - (m.credito || 0);
      } else {
        saldoActual += (m.credito || 0) - (m.debito || 0);
      }

      return {
        ...m,
        saldo: saldoActual
      };
    });
  }, [libroAuxiliar]);

  const columns: Column<MovimientoLibroAuxiliar & { saldo: number }>[] = [
    {
      header: 'Cuenta',
      render: (m) => <span className="font-mono text-sm">{m.cuentaCodigo}</span>
    },
    {
      header: 'Nombre Base',
      render: (m) => m.cuentaNombre
    },
    {
      header: 'Nat.',
      render: (m) => (
        <span className={`px-2 py-1 text-xs font-bold rounded ${m.naturalezaCuenta === 'D' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
          {m.naturalezaCuenta}
        </span>
      )
    },
    {
      header: 'Tercero',
      render: (m) => m.terceroNombre || '-'
    },
    {
      header: 'Descripción',
      render: (m) => m.descripcion || '-'
    },
    {
      header: 'Débito',
      render: (m) => <span className="text-emerald-700 font-bold">{formatCurrency(m.debito)}</span>
    },
    {
      header: 'Crédito',
      render: (m) => <span className="text-rose-600 font-bold">{formatCurrency(m.credito)}</span>
    },
    {
      header: 'Saldo',
      render: (m) => <span className={`font-black tracking-tight ${m.saldo < 0 ? 'text-red-600' : 'text-[#1e3a8a]'}`}>{formatCurrency(m.saldo)}</span>
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="tuto-header-auxiliar">
      <PageHeader
        title="Auxiliar contable"
        subtitle="Consulta los movimientos detallados y saldos de una cuenta contable"
      />
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="tuto-auxiliar-filtros grid grid-cols-1 md:grid-cols-4 gap-6 items-end">       
          <div className="col-span-2 relative z-50">
            <SelectorCuentaPuc
              label="Cuenta Contable (opcional)"
              codigoRaiz=""
              value={cuentaCodigo}
              onChange={setCuentaCodigo}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={e => setDesde(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 hover:bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={e => setHasta(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 hover:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleConsultar}
            disabled={loading}
            className={`tuto-auxiliar-consultar px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-colors shadow-lg ${(loading) ? 'bg-slate-200 text-slate-400 shadow-none' : 'bg-[#1e3a8a] text-white hover:bg-blue-900 shadow-[#1e3a8a]/20'}`}
          >
            {loading ? 'Consultando...' : 'Consultar Movimientos'}
          </button>
        </div>
      </div>

      {/* Error Modal */}
      <StatusModal
        show={!!error}
        success={false}
        message={error || ''}
        onClose={() => fetchLibroAuxiliar(null, null, null)}
      />

      {processedData.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Resultados de Búsqueda</h3>
          </div>
          <div className="p-0">
            <Table data={processedData} columns={columns} itemsPerPage={50} />    
          </div>
        </div>
      ) : (
        !loading && !error && libroAuxiliar.length === 0 && (
          <div className="mt-8 text-center text-slate-500 py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center gap-2">
            <span className="text-2xl opacity-50">📊</span>
            <p className="font-black uppercase tracking-widest text-xs text-slate-400">Realiza una consulta para ver los movimientos y el auxiliar contable.</p>  
          </div>
        )
      )}
    </div>
  );
};




