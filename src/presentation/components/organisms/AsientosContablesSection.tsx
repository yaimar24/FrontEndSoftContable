import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface AsientosContablesSectionProps {
  tipoDocumento: 'FacturaVenta' | 'FacturaCompra' | 'ReciboCaja';
  documentoId: number;
}

export const AsientosContablesSection: React.FC<AsientosContablesSectionProps> = ({ tipoDocumento, documentoId }) => {
  const [comprobantes, setComprobantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
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
    if (documentoId) {
      cargar();
    }
  }, [tipoDocumento, documentoId]);

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
    <div className="space-y-6">
      {comprobantes.map(comp => (
        <div key={comp.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 border-b border-slate-200 gap-2">
            <span className="font-black text-sm text-[#1e3a8a] flex items-center gap-2">
              <span className="text-xl">📄</span> 
              {comp.numero} — {comp.tipoComprobante} ({comp.estado})
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
                    <td className="px-6 py-3 font-medium text-slate-700">{m.cuentaNombre}</td>
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
  );
};
