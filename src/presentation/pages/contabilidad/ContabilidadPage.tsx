import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/organisms/PageHeader';
import { Table, type Column } from '../../components/organisms/Table';
import SearchBar from '../../components/molecules/SearchBar';
import { FilterGroup } from '../../components/molecules/FilterGroup';
import StatusModal from '../../components/organisms/StatusModal';
import { useContabilidad } from '../../../application/hooks/useContabilidad';
import type { ComprobanteContableRead } from '../../../domain/models/Contabilidad';
import { Eye, FileText, PlusCircle } from 'lucide-react';
import LoadingOverlay from '../../components/shared/LoadingOverlay';

export const ContabilidadPage = () => {
  const navigate = useNavigate();
  const { comprobantes, fetchComprobantes, pagination, anular, loading } = useContabilidad();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showAnularModal, setShowAnularModal] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });
  const [comprobanteToAnular, setComprobanteToAnular] = useState<number | null>(null);

  useEffect(() => {
    fetchComprobantes(page, pageSize, searchTerm);
  }, [fetchComprobantes, page, pageSize, searchTerm]);

  const handleAnular = async () => {
    if (comprobanteToAnular) {
      await anular(comprobanteToAnular);
      setResultModal({ show: true, success: true, message: "Asiento anulado correctamente." });
      setComprobanteToAnular(null);
      fetchComprobantes(page, pageSize, searchTerm);
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch(tipo?.toLowerCase()) {
      case 'facturaventa': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'facturacompra': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'recibocaja': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'ajuste': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch(estado?.toLowerCase()) {
      case 'aprobado': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'anulado': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredData = useMemo(() => {
    return comprobantes.filter(c => {
      const matchSearch = searchTerm ? 
        c.numero.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) 
        : true;
const matchTipo = filterTipo ? c.tipoComprobante === filterTipo : true;
      const matchEstado = filterEstado ? c.estado === filterEstado : true;      
      return matchSearch && matchTipo && matchEstado;
    });
  }, [comprobantes, searchTerm, filterTipo, filterEstado]);

  const columns: Column<ComprobanteContableRead>[] = [
    {
      header: 'Asiento',
      className: "min-w-[280px]",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${getTipoBadgeColor(item.tipoComprobante)}`}>
            <FileText size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase text-[11px] text-slate-800">{item.numero || 'S/N'}</span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
              {item.tipoComprobante} \u2022 {new Date(item.fecha).toLocaleDateString()}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Documento Origen',
      render: (item) => (
        item.documentoOrigenTipo ? (
          <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
            {item.documentoOrigenTipo} #{item.documentoOrigenId}
          </span>
        ) : (
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            Ajuste Manual
          </span>
        )
      )
    },
    {
      header: 'Debito / Credito',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-emerald-600 font-black text-xs">${item.totalDebito.toLocaleString()}</span>
          <span className="text-rose-600 font-black text-[10px]">${item.totalCredito.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Estado',
      render: (item) => (
        <span className={`px-3 py-1 border rounded-lg text-[9px] font-black tracking-widest uppercase ${getEstadoBadgeColor(item.estado)}`}>
          {item.estado}
        </span>
      )
    },
    {
      header: 'Acciones',
      className: "text-right",
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate(`/dashboard/asientos-contables/${item.id}`)}
            className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-600 hover:text-white transition-all shadow-sm"
            title="Ver Detalle"
          >
            <Eye size={15} strokeWidth={2.5} />
          </button>
          {/* Ocultamos anular de momento
          {item.estado?.toLowerCase() !== 'anulado' && (
            <button
              onClick={() => { setComprobanteToAnular(item.id); setShowAnularModal(true); }}
              className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
              title="Anular Asiento"
            >
              <XCircle size={15} strokeWidth={2.5} />
            </button>
          )} 
          */}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      <PageHeader 
        title="Comprobantes contables"
        subtitle="Gestiona los comprobantes contables registrados en el sistema"      
        actions={<button onClick={() => navigate('/dashboard/asientos-contables/nuevo')} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-sm shadow-blue-900/20 active:scale-95 text-[13px]"><PlusCircle size={18} strokeWidth={2.5} /><span>Movimiento manual</span></button>}
      />

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center relative z-10">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por numero o descripcion..."
        />
        <div className="flex gap-2 w-full md:w-auto">
          <FilterGroup
            options={[
              {label: 'Todos', id: ''},
              {label: 'Recibos', id: 'ReciboCaja'},
              {label: 'Ajustes', id: 'Ajuste'}
            ]}
            activeId={filterTipo}
            onChange={setFilterTipo}
          />
          <FilterGroup
            options={[
              {label: 'Estados', id: ''},
              {label: 'Aprobado', id: 'Aprobado'},
              {label: 'Anulado', id: 'Anulado'}
            ]}
            activeId={filterEstado}
            onChange={setFilterEstado}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
        {loading && <LoadingOverlay message="Cargando asientos..." />}
        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : (
            <Table 
              data={filteredData} 
              columns={columns}               isServer={!!pagination}
              itemsPerPage={pageSize}              serverPagination={pagination ? {
                ...pagination,
                onPageChange: setPage,
                onPageSizeChange: (s) => { setPageSize(s); setPage(1); }
              } : undefined}
            />          )}
        </div>

      <StatusModal
        show={showAnularModal}        type="confirm"
        message="¿Estás seguro que deseas anular este asiento? Esta acción es irreversible."
        onConfirm={handleAnular}
        onClose={() => setShowAnularModal(false)}
        confirmText="Sí, anular asiento"
        cancelText="Cancelar"
      />

      <StatusModal
        show={resultModal.show}
        type={resultModal.success ? "success" : "error"}
        message={resultModal.message}
        onClose={() => setResultModal({ ...resultModal, show: false })}
      />
    </div>
  );
};


