import { useEffect, useState } from 'react';
import { Table, type Column } from '../../../components/organisms/Table';
import SearchBar from '../../../components/molecules/SearchBar';
import { FilterGroup } from '../../../components/molecules/FilterGroup';
import { useCuentasPorPagar } from '../../../../application/hooks/useCuentasPorPagar';
import type { CuentaPorPagar } from '../../../../domain/models/CuentasPorPagar';
import { FileText } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import { getDiasVencidosBadge, getEstadoBadgeColor as getEstadoBadge } from '../../../../utils/statusHelpers';
import StatusModal from '../../../components/organisms/StatusModal';
export const enviarRecordatorioPago = async (_id: number) => ({ success: true, message: "Recordatorio enviado" }); 
// import { getCuentasPorPagar } from '../../../../data/services/cuentasPorPagar/cuentasPorPagarService';

export const CuentasPorPagarView = () => {
  const { cuentas, loading, fetchCuentasPorPagar } = useCuentasPorPagar();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  // Recordatorio state
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; facturaId: number; proveedorNombre: string }>({ show: false, facturaId: 0, proveedorNombre: '' });
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: '' });
  const [, setSendingId] = useState<number | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<number, number>>({});

  const cooldownCount = Object.keys(cooldowns).length;

  useEffect(() => {
    if (cooldownCount === 0) return;
    const timer = setInterval(() => {
      setCooldowns((prev) => {
        const next: Record<number, number> = {};
        for (const [id, val] of Object.entries(prev)) {
          if (val > 1) next[Number(id)] = val - 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownCount]);

  const handleSendRecordatorio = async () => {
    const { facturaId } = confirmModal;
    setConfirmModal({ show: false, facturaId: 0, proveedorNombre: '' });
    setSendingId(facturaId);
    try {
      const res = await enviarRecordatorioPago(facturaId);
      setResultModal({ show: true, success: res.success, message: res.message });
      if (res.success) {
        setCooldowns((prev) => ({ ...prev, [facturaId]: 60 }));
      }
    } catch (err) {
      setResultModal({ show: true, success: false, message: (err as Error).message || 'Error al enviar recordatorio' });
    } finally {
      setSendingId(null);
    }
  };

  useEffect(() => {
    const estadoNum = filterEstado !== '' ? Number(filterEstado) : undefined;
    fetchCuentasPorPagar(undefined, desde || undefined, hasta || undefined, estadoNum);
  }, [fetchCuentasPorPagar, filterEstado, desde, hasta]);

  const filteredData = (cuentas || []).filter(c => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (c.proveedorNombre || '').toLowerCase().includes(term) ||
      (c.numeroFactura || '').toLowerCase().includes(term);
  });

  const columns: Column<CuentaPorPagar>[] = [
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
      header: 'Proveedor',
      render: (item) => (
        <span className="font-bold text-[10px] text-slate-700 uppercase">{item.proveedorNombre}</span>
      )
    },
    {
      header: 'Vencimiento',
      render: (item) => (
        <span className="text-[10px] font-bold text-slate-600">
          {item.fechaVencimiento ? new Date(item.fechaVencimiento).toLocaleDateString() : 'Contado'}
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
      render: (item) => {
        const displayEstado = (item.estado === 'Abonada' || item.estado === 'PendienteConAbono') ? 'Pendiente' : item.estado;
        return (
          <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider ${getEstadoBadge(displayEstado)}`}>
            {displayEstado}
          </span>
        );
      }
    },
    // {
    //   header: 'Acciones',
    //   className: 'text-right',
    //   render: (item) => (
    //     <div className="flex justify-end gap-1.5">
    //       <ModuleGate route="/dashboard/ventas">
    //         <button
    //           onClick={() => navigate(`/dashboard/ventas/${item.facturaId}`)}
    //           className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-600 hover:text-white transition-all shadow-sm"
    //           title="Ver Factura"
    //         >
    //           <Eye size={15} strokeWidth={2.5} />
    //         </button>
    //       </ModuleGate>
    //     </div>
    //   )
    // }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="tuto-cuentasPorPagar-search w-full md:w-1/3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por proveedor o factura..."
          />
        </div>
        <div className="tuto-cuentasPorPagar-filters flex flex-wrap gap-2 items-end">
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
              { label: 'Pendiente', id: '3' },
              { label: 'Pagada', id: '5' },
              { label: 'Anulada', id: '2' },
            ]}
            activeId={filterEstado}
            onChange={setFilterEstado}
          />
        </div>
      </div>

      <div className="tuto-cuentasPorPagar-table bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold text-sm">Cargando...</div>
        ) : (
          <Table data={filteredData} columns={columns} />
        )}
      </div>

      {/* Modal confirmar recordatorio */}
      <StatusModal
        show={confirmModal.show}
        type="confirm"
        message={`¿Enviar recordatorio de pago a ${confirmModal.proveedorNombre}?`}
        onConfirm={handleSendRecordatorio}
        onClose={() => setConfirmModal({ show: false, facturaId: 0, proveedorNombre: '' })}
        confirmText="Enviar"
        cancelText="Cancelar"
      />

      {/* Modal resultado */}
      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => setResultModal((m) => ({ ...m, show: false }))}
      />
    </div>
  );
};
