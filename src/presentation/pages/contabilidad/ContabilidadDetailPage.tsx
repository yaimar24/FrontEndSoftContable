import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, type Column } from '../../components/organisms/Table';
import { useContabilidad } from '../../../application/hooks/useContabilidad';
import type { MovimientoContableRead } from '../../../domain/models/Contabilidad';
import LoadingOverlay from '../../components/shared/LoadingOverlay';

export const ContabilidadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { comprobanteDetail, fetchComprobanteById, loading } = useContabilidad();

  useEffect(() => {
    if (id) {
      fetchComprobanteById(Number(id));
    }
  }, [id, fetchComprobanteById]);

  if (loading) return <LoadingOverlay message="Cargando detalle..." />;
  if (!comprobanteDetail) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">Asiento no encontrado</div>;

  const navigateToSource = () => {
    const { documentoOrigenTipo, documentoOrigenId } = comprobanteDetail;
    
    if (documentoOrigenTipo === 'FacturaVenta') navigate(`/dashboard/ventas/${documentoOrigenId}`);
    if (documentoOrigenTipo === 'FacturaCompra') navigate(`/dashboard/factura-compra/${documentoOrigenId}`);
    if (documentoOrigenTipo === 'ReciboCaja') navigate(`/dashboard/ventas/recibos/${documentoOrigenId}`);
    // Adjust routes based on your app's actual paths 
  };

  const columns: Column<MovimientoContableRead>[] = [
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
      header: 'Débito',
      render: (m) => <span className="text-emerald-700 font-bold">${m.debito.toLocaleString()}</span>
    },
    {
      header: 'Crédito',
      render: (m) => <span className="text-rose-600 font-bold">${m.credito.toLocaleString()}</span>
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Asiento #{comprobanteDetail.numero}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Tipo {comprobanteDetail.tipoComprobante} • Fecha {new Date(comprobanteDetail.fecha).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => navigate('/dashboard/asientos-contables')} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all hover:border-slate-300"
          >
            Volver a Lista
          </button>
        </div>
      </div>

      <div className="bg-white p-0 md:p-6 md:rounded-3xl md:shadow-sm border-0 md:border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="flex flex-wrap gap-8 items-center z-10 w-full p-6 md:p-0">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</p>
            <span className={`px-3 py-1 border rounded-lg text-[9px] font-black tracking-widest uppercase inline-block ${comprobanteDetail.estado?.toLowerCase() === 'aprobado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : comprobanteDetail.estado?.toLowerCase() === 'anulado' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
              {comprobanteDetail.estado}
            </span>
          </div>
          {comprobanteDetail.documentoOrigenTipo && (
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento Origen</p>
              <button 
                onClick={navigateToSource} 
                className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
                title="Ver origen"
              >
                {comprobanteDetail.documentoOrigenTipo} #{comprobanteDetail.documentoOrigenId}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white md:rounded-3xl shadow-sm border-y md:border border-slate-100 overflow-hidden mt-6">
        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-5 flex justify-between items-center">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Movimientos Asentados</h3>
        </div>
        <div className="p-0">
          <Table data={comprobanteDetail.movimientos} columns={columns} itemsPerPage={100} />
        </div>
        
        <div className={`p-6 md:p-8 flex flex-col sm:flex-row justify-end gap-6 sm:gap-12 text-sm border-t relative overflow-hidden ${comprobanteDetail.estaCuadrado ? 'bg-emerald-50/20 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-slate-50/50 mix-blend-overlay rotate-[24deg] transform translate-x-32" />
          <span className="uppercase font-black text-[11px] self-end sm:self-center text-slate-400 tracking-widest">
            {comprobanteDetail.estaCuadrado ? 'SALDADO (CUADRADO)' : 'DESCUADRADO'}
          </span>
          <span className="flex justify-between sm:flex-col sm:text-right gap-4 sm:gap-1 z-10 w-full sm:w-auto items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">Débito</span> 
            <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-700">${comprobanteDetail.totalDebito.toLocaleString()}</span>
          </span>
          <span className="flex justify-between sm:flex-col sm:text-right gap-4 sm:gap-1 z-10 w-full sm:w-auto items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100">Crédito</span> 
            <span className="text-xl sm:text-2xl font-black tracking-tight text-rose-700">${comprobanteDetail.totalCredito.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
