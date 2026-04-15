import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import Modal from './Modal';

interface AsientosContablesSectionProps {
  tipoDocumento: 'FacturaVenta' | 'FacturaCompra' | 'ReciboCaja';
  documentoId: number;
  initialComprobantes?: any[];
}

export const AsientosContablesSection: React.FC<AsientosContablesSectionProps> = ({ tipoDocumento, documentoId, initialComprobantes }) => {
  const [comprobantes, setComprobantes] = useState<any[]>(initialComprobantes || []);
  const [loading, setLoading] = useState(!initialComprobantes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (initialComprobantes && initialComprobantes.length > 0) {
      setComprobantes(initialComprobantes);
      setLoading(false);
      return;
    }
  
    const cargar = async () => {
      setLoading(true);
      try {
        const { getAsientosPorDocumento } = await import('../../../data/services/contabilidad/contabilidadService');
        const res = await getAsientosPorDocumento(tipoDocumento, documentoId);
        if (res.success && res.data) {
          setComprobantes(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (documentoId && (!initialComprobantes || initialComprobantes.length === 0)) {
      cargar();
    }
  }, [tipoDocumento, documentoId, initialComprobantes]);

  if (loading) return <div className="text-gray-500 text-sm">Cargando asientos...</div>;

  if (comprobantes.length === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center gap-2">
        <span className="text-2xl opacity-50">📂</span>
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Sin contabilizar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button 
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-white border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-sm group"
      >
        <span className="relative flex items-center justify-center">
          <Eye size={16} className="text-slate-400 group-hover:text-blue-500" />
          {comprobantes.some(c => c.tipoComprobanteId === 7) && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-sm shadow-amber-500/50"></span>
          )}
        </span>
        Ver todos los asientos contables ({comprobantes.length})
      </button>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Asientos Contables" 
        subtitle="Listado de movimientos vinculados a este documento."
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {comprobantes.map(comp => (
            <div key={comp.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 border-b border-slate-200 gap-2">
                <span className="font-black text-sm text-[#1e3a8a] flex flex-wrap items-center gap-2">
                  <span className="text-xl">📄</span> 
                  <span>{comp.numero} — {comp.tipoComprobante} ({comp.estado})</span>
                  {comp.tipoComprobanteId === 7 && comp.estado === 'Aprobado' && (
                    <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-widest ml-2">
                      REVERSO / ANULACIÓN
                    </span>
                  )}
                </span>
                <Link to={`/dashboard/asientos-contables/${comp.id}`} className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-1">
                  Ver asiento <span className="text-[10px]">→</span>
                </Link>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-black text-[10px] uppercase tracking-widest text-slate-500">Cuenta</th>
                      <th className="px-6 py-3 font-black text-[10px] uppercase tracking-widest text-slate-500">Nombre</th>
                      <th className="px-6 py-3 font-black text-[10px] uppercase tracking-widest text-emerald-600 text-right">Débito</th> 
                      <th className="px-6 py-3 font-black text-[10px] uppercase tracking-widest text-rose-600 text-right">Crédito</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comp.movimientos?.map((m: any) => (
                      <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-bold text-slate-600">{m.cuentaCodigo}</td>
                        <td className="px-6 py-3 font-medium text-slate-700">
                          {m.cuentaNombre}
                          {m.descripcion && (
                            <div className="text-[10px] text-slate-400 mt-0.5 max-w-[200px] truncate" title={m.descripcion}>
                              {m.descripcion}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right font-black text-emerald-600 bg-emerald-50/10">
                          {m.debito > 0 ? `$${m.debito.toLocaleString()}` : ''}
                        </td>
                        <td className="px-6 py-3 text-right font-black text-rose-600 bg-rose-50/10">
                          {m.credito > 0 ? `$${m.credito.toLocaleString()}` : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
