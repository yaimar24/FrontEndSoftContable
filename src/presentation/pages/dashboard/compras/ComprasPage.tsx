import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table } from '../../../components/organisms/Table';
import type { Column } from '../../../components/organisms/Table';
import LoadingOverlay from '../../../components/shared/LoadingOverlay';
import { getComprasByColegio, registrarFacturaCompra, anularFacturaCompra } from '../../../../data/services/compra/compraService';
import type { FacturaCompraReadDTO } from '../../../../domain/models/FacturaCompra';
import { ShoppingCart, FilePlus, FileText, ArrowRight, Edit2, CheckCircle, XCircle, Eye } from 'lucide-react';
import SearchBar from '../../../components/molecules/SearchBar';
import StatusModal from '../../../components/organisms/StatusModal';
import { useFilter } from '../../../../application/hooks/useGenericFilter';
import CreateCompras from './CreateCompras/CreateCompras';
import { DocumentViewerModal } from '../../../components/organisms/DocumentViewerModal';
import { CompraInvoiceTemplate } from './CompraInvoiceTemplate';
import PageHeader from "../../../components/organisms/PageHeader";
import { useTutorial } from '../../../../application/context/TutorialContext';

const getEstadoInfo = (estado: string | number) => {
  const map: Record<string, { label: string, color: string }> = {
    '0': { label: 'Borrador', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    '1': { label: 'Registrada', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    '2': { label: 'Anulada', color: 'bg-red-50 text-red-600 border-red-100' },
  };
  return map[estado.toString()] || { label: 'Desconocido', color: 'bg-slate-100 text-slate-500' };
};

const ComprasPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialView = (searchParams.get('view') as 'lista' | 'formulario') || 'lista';
  const initialId = searchParams.get('id') ? Number(searchParams.get('id')) : null;

  const [view, setView] = useState<'lista' | 'formulario'>(initialView);
  const [compras, setCompras] = useState<FacturaCompraReadDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(initialView === 'lista');
  const [error, setError] = useState<string | null>(null);
  const [compraEditId, setCompraEditId] = useState<number | null>(initialId);
  const [selectedInvoice, setSelectedInvoice] = useState<FacturaCompraReadDTO | null>(null);

  // Sync state if URL changes to reset to lista or load form
  useEffect(() => {
    const currentView = (searchParams.get('view') as 'lista' | 'formulario') || 'lista';
    const currentId = searchParams.get('id') ? Number(searchParams.get('id')) : null;
    setView(currentView);
    setCompraEditId(currentId);
  }, [location.search]);
  const [confirmModal, setConfirmModal] = useState<{show: boolean, action: 'registrar' | 'anular' | null, id: number | null}>({show: false, action: null, id: null});
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });

  const { searchTerm, setSearchTerm, filteredData } = useFilter(compras, {
    searchFields: ["numero", "proveedorNombre"],
  });
  
  const { setSteps } = useTutorial();

  useEffect(() => {
    if (view === 'lista') {
      setSteps([
        {
          target: '.tuto-header',
          content: 'Este es el módulo de Compras. Desde aquí puedes gestionar todas las facturas de compra de tu institución.',
        },
        {
          target: '.tuto-switch-history',
          content: 'Visualiza el historial completo de compras registradas.',
        },
        {
          target: '.tuto-switch-new',
          content: 'Registra una nueva factura de compra a un proveedor.',
        },
        {
          target: '.tuto-search',
          content: 'Busca facturas por número o nombre del proveedor.',
        },
        {
          target: '.tuto-table',
          content: 'Listado de compras con acciones: editar (borradores), registrar (confirmar), anular, vista previa PDF y ver detalles.',
        }
      ]);
      fetchCompras();
    } else {
      setSteps([
        {
          target: '.tuto-compra-sticky-header',
          content: 'Barra superior fija: aquí ves el total estimado y el botón para guardar la factura.',
        },
        {
          target: '.tuto-compra-encabezado',
          content: 'Rellena los datos básicos: número de compra, proveedor, fecha y medio de pago.',
        },
        {
          target: '.tuto-compra-detalle',
          content: 'Agrega los ítems de la compra. Puedes elegir entre productos, activos fijos o gastos, y asignar las cuentas contables correspondientes.',
        }
      ]);
      setLoading(false);
    }
  }, [view, setSteps]);

  const fetchCompras = async () => {
    try {
      setLoading(true);
      const res = await getComprasByColegio();
      if (res.success && res.data) {
        setCompras(res.data);
      } else {
        setError(res.message || 'Error al obtener compras');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.id || !confirmModal.action) return;
    setLoading(true);
    setConfirmModal({ ...confirmModal, show: false });
    
    try {
      const res = confirmModal.action === 'registrar' 
        ? await registrarFacturaCompra(confirmModal.id)
        : await anularFacturaCompra(confirmModal.id);
        
      if (res.success) {
        setResultModal({ show: true, success: true, message: `Factura ${confirmModal.action === 'registrar' ? 'registrada' : 'anulada'} exitosamente.` });
        fetchCompras();
      } else {
        setResultModal({ show: true, success: false, message: res.message || `Error al ${confirmModal.action} la factura.` });
      }
    } catch (error: any) {
      setResultModal({ show: true, success: false, message: error.message || 'Error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/dashboard/factura-compra?view=formulario&id=${id}`);
  };

  const columns: Column<FacturaCompraReadDTO>[] = [
    {
      header: "Factura",
      className: "min-w-[280px]",
      render: (v: FacturaCompraReadDTO) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <FileText size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase text-[11px] text-slate-800">{v.numero || 'S/N'}</span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Fecha: {new Date(v.fechaElaboracion).toLocaleDateString()}</span>
          </div>
        </div>
      )
    },
    {
      header: "Proveedor",
      render: (v: FacturaCompraReadDTO) => (
        <span className="font-bold text-[10px] text-slate-700 uppercase">{v.proveedorNombre}</span>
      )
    },
    {
      header: "Total Neto",
      render: (v: FacturaCompraReadDTO) => (
        <span className="font-bold text-slate-700">${v.totalNeto?.toLocaleString()}</span>
      )
    },
    {
      header: "Estado",
      render: (v: FacturaCompraReadDTO) => {
        const info = getEstadoInfo(v.estadoId);
        return (
          <span className={`px-3 py-1 text-[9px] font-black uppercase border rounded-lg ${info.color}`}>
            {info.label}
          </span>
        )
      }
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (v: FacturaCompraReadDTO) => (
        <div className="flex justify-end gap-2">
          {v.estadoId === 0 && (
            <>
              <button onClick={() => handleEdit(v.id)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Editar">
                <Edit2 size={15} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => setConfirmModal({ show: true, action: 'registrar', id: v.id })} 
                className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" 
                title="Registrar"
              >
                <CheckCircle size={15} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => setConfirmModal({ show: true, action: 'anular', id: v.id })} 
                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" 
                title="Anular"
              >
                <XCircle size={15} strokeWidth={2.5} />
              </button>
            </>
          )}
          {v.estadoId === 1 && (
            <>
              <button onClick={() => setSelectedInvoice(v)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Vista Previa PDF">
                <Eye size={15} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setConfirmModal({ show: true, action: 'anular', id: v.id })}
                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                title="Anular"
              >
                <XCircle size={15} strokeWidth={2.5} />
              </button>
            </>
          )}
          <button onClick={() => navigate(`/dashboard/factura-compra/${v.id}`)} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-700 hover:text-white transition-all shadow-sm" title="Ver Detalles de Compra">
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto">
      {loading && <LoadingOverlay message="Procesando..." />}

      <StatusModal
        show={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, action: null, id: null })}
        type="confirm"
        message={`¿Estás seguro de ${confirmModal.action} esta factura de compra?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmAction}
      />

      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => setResultModal({ ...resultModal, show: false })}
      />

      <div className="tuto-header">
        <PageHeader
          title="Gestión de Compras"
          subtitle={view === 'lista' && !loading ? `${compras.length} Facturas registradas` : undefined}
          icon={ShoppingCart}
          switcher={
            <>
              <button
                onClick={() => navigate('/dashboard/factura-compra')}
                className={`tuto-switch-history flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all ${view === 'lista' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <FileText size={14} /> Historial de Compras
              </button>
              <button
                onClick={() => navigate('/dashboard/factura-compra?view=formulario')}
                className={`tuto-switch-new flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all ${view === 'formulario' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}       
              >
                <FilePlus size={14} /> Nueva Compra
              </button>
            </>
          }
        />
      </div>

      <main className="tuto-form-container animate-in fade-in slide-in-from-bottom-3 duration-700 space-y-4"> 
        {view === 'lista' ? (
          <>
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>}

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="tuto-search w-full lg:w-1/3">
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por número o proveedor" />
              </div>
            </div>

            <div className="tuto-table bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <Table columns={columns} data={filteredData} />
            </div>
          </>
        ) : (
          <CreateCompras onBack={() => { setView('lista'); setCompraEditId(null); fetchCompras(); navigate('/dashboard/factura-compra', { replace: true }); }} initialCompraId={compraEditId ?? undefined} />
        )}
      </main>

      <DocumentViewerModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Vista Previa Factura Compra N° ${selectedInvoice?.numero || ''}`}
        onOpenNewTab={() => {
          if (selectedInvoice) {
            window.open(`/purchase-invoice/${selectedInvoice.id}`, '_blank');
          }
        }}
      >
        <CompraInvoiceTemplate factura={selectedInvoice} />
      </DocumentViewerModal>
    </div>
  );
};

export default ComprasPage;
