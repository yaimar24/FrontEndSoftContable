import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, type Column } from '../../../components/organisms/Table';
import { FilterGroup } from '../../../components/molecules/FilterGroup';
import { useCartera } from '../../../../application/hooks/useCartera';
import type { FacturaPorVencer } from '../../../../domain/models/Cartera';
import { FileText, Eye } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import { ModuleGate } from '../../../components/shared/ModuleGate';

export const PorVencerView = () => {
  const navigate = useNavigate();
  const { porVencer, loading, fetchPorVencer } = useCartera();
  const [dias, setDias] = useState('30');

  useEffect(() => {
    fetchPorVencer(Number(dias));
  }, [fetchPorVencer, dias]);

  const sorted = [...porVencer].sort((a, b) => a.diasParaVencer - b.diasParaVencer);

  const columns: Column<FacturaPorVencer>[] = [
    {
      header: 'Factura',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${item.diasParaVencer <= 7 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
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
      header: 'Días para Vencer',
      render: (item) => (
        <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider ${
          item.diasParaVencer <= 7
            ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse'
            : item.diasParaVencer <= 15
              ? 'bg-amber-50 text-amber-600 border-amber-100'
              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
        }`}>
          {item.diasParaVencer} días
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
        <span className="px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border-amber-100">
          {item.estado}
        </span>
      )
    },
    {
      header: 'Acciones',
      className: 'text-right',
      render: (item) => (
        <ModuleGate route="/dashboard/ventas">
          <div className="flex justify-end">
            <button
              onClick={() => navigate(`/dashboard/ventas/${item.facturaId}`)}
              className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-600 hover:text-white transition-all shadow-sm"
              title="Ver Factura"
            >
              <Eye size={15} strokeWidth={2.5} />
            </button>
          </div>
        </ModuleGate>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="tuto-porvencer-filter flex items-center gap-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vence en los próximos:</span>
        <FilterGroup
          options={[
            { label: '15 días', id: '15' },
            { label: '30 días', id: '30' },
            { label: '60 días', id: '60' },
            { label: '90 días', id: '90' },
          ]}
          activeId={dias}
          onChange={setDias}
        />
      </div>

      <div className="tuto-porvencer-table bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold text-sm">Cargando...</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="font-bold text-sm">No hay facturas por vencer en este rango</p>
          </div>
        ) : (
          <Table data={sorted} columns={columns} />
        )}
      </div>
    </div>
  );
};
