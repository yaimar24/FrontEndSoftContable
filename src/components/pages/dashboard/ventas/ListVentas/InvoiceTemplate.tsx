import React from 'react';
import type { FacturaVentaReadDTO } from '../../../../../models/Venta';
import { getNombreColegioFromToken, getLogoUrlFromToken } from '../../../../../utils/jwt';
import { useAuth } from '../../../../../hooks/useAuth';

interface InvoiceTemplateProps {
  factura: FacturaVentaReadDTO | null;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ factura }) => {
  const { token } = useAuth();

  if (!factura) return null;

  let perfil: any = null;
  try {
    const rawPerfil = localStorage.getItem('perfilInstitucional');
    if (rawPerfil) perfil = JSON.parse(rawPerfil);
  } catch (e) {
    console.error("Error parsing perfil", e);
  }

  const nombreColegio = perfil?.nombreColegio || getNombreColegioFromToken(token) || "Mi Institución";   
  const nitColegio = perfil?.nit || perfil?.identificacion || 'N/A';
  const telefonoColegio = perfil?.telefono || 'N/A';
  const direccionColegio = perfil?.direccion || 'N/A';
  
  const rawLogoUrl = localStorage.getItem('logoUrl') || getLogoUrlFromToken(token);
  const logoUrl = rawLogoUrl ? (rawLogoUrl.startsWith('http') ? new URL(new URL(rawLogoUrl).pathname, window.location.origin).toString() : rawLogoUrl) : null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).format(date);
  };

  const formatCurrency = (val?: number) => {
    return (val || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  };

  // Add 30 days default expiration for preview purposes if the backend doesn't explicitly have it yet
  const expirationDate = new Date(factura.fechaElaboracion || new Date());
  expirationDate.setDate(expirationDate.getDate() + 30);

  const impuestosCargo = (factura.detalles || [])
    .filter(d => d.tarifaCargo && d.tarifaCargo > 0)
    .map(d => ({ nombre: d.impuestoCargoNombre, tarifa: d.tarifaCargo, valor: d.impuestoCargo }));

  const impuestosRetencion = (factura.detalles || [])
    .filter(d => d.tarifaRetencion && d.tarifaRetencion > 0)
    .map(d => ({ nombre: d.retencionNombre, tarifa: d.tarifaRetencion, valor: d.impuestoRetencion }));

  return (
    <div className="w-full h-full bg-white print:p-0 p-8 sm:p-12 text-slate-800 text-sm">
      {/* Header Panel */}
      <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
        <div className="flex flex-col gap-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-16 object-contain mb-3 drop-shadow-sm" />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow-sm flex items-center justify-center rounded-2xl mb-3">
              <span className="font-black text-slate-400 text-xs tracking-widest">LOGO</span>
            </div>
          )}
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{nombreColegio}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-black tracking-wider border border-slate-200/60">NIT {nitColegio}</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">
            <span className="font-bold text-slate-600">{direccionColegio}</span> • Tel. <span className="font-bold text-slate-600">{telefonoColegio}</span>
          </p>
        </div>

        <div className="text-right flex flex-col items-end">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-3">Factura de Venta</h2>
          <div className="flex bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 flex items-center justify-center px-1.5 py-3 border-r border-slate-200/60">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>NUM</span>
            </div>
            <div className="px-5 py-3 text-left min-w-32 flex items-center justify-center bg-white">
              <p className="text-2xl font-black text-blue-600 tracking-tight leading-none text-center">{factura.numero}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-4 border-b border-slate-200 pb-2">Facturar A</h3>
          <p className="font-black text-base text-slate-800 mb-1">{factura.clienteNombre}</p>
          <p className="text-xs text-slate-600 font-medium mb-1"><span className="text-slate-400">ID / NIT:</span> {factura.clienteId}</p>
          <p className="text-xs text-slate-600 font-medium mb-1"><span className="text-slate-400">Teléfono:</span> {factura.clienteTelefono || 'N/A'}</p>
          <p className="text-xs text-slate-600 font-medium"><span className="text-slate-400">Dirección:</span> {factura.clienteDireccion || 'N/A'}</p>        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Fecha</p>
              <p className="text-xs font-bold text-slate-800">{formatDate(factura.fechaElaboracion).split(',')[0]}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Medio de Pago</p>
              <p className="text-xs font-bold text-slate-800">
                {factura.recibos && factura.recibos.length > 0
                  ? (factura.recibos.length > 1 ? "Múltiples (Dividido)" : factura.recibos[0].medioPagoNombre || factura.recibos[0].medioPagoCodigo)
                  : "A Crédito / Pendiente"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10 rounded-2xl overflow-hidden border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1e3a8a] text-white">
            <tr>
              <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest w-[10%]">Ítem</th>
              <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest w-[30%]">Descripción</th>
              <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-center border-l border-blue-800/50 w-[8%]">Cant.</th>
              <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-right border-l border-blue-800/50 w-[15%]">V. Unitario</th>
              <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-center border-l border-blue-800/50 w-[10%]">Cargo</th>
              <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-center border-l border-blue-800/50 w-[10%]">Retención</th>
              <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-right border-l border-blue-800/50 w-[17%]">V. Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {factura.detalles?.map((det, idx) => (
              <tr key={idx} className="bg-white">
                <td className="py-3 px-4 text-xs text-slate-500">{det.productoId?.substring(0, 8) || (idx + 1).toString().padStart(3, '0')}</td>
                <td className="py-3 px-4 text-[11px] text-slate-800 font-bold">{det.productoNombre || det.descripcion || "Item"}</td>
                <td className="py-3 px-4 text-xs text-slate-600 text-center">{det.cantidad}</td>
                <td className="py-3 px-4 text-xs text-slate-600 text-right">{formatCurrency(det.valorUnitario)}</td>
                <td className="py-3 px-4 text-[10px] text-slate-600 text-center uppercase tracking-wider font-bold text-blue-600 bg-blue-50/50">{det.impuestoCargoNombre ? `${det.impuestoCargoNombre} ${det.tarifaCargo ? `(${det.tarifaCargo}%)` : ''}` : '-'}</td>
                <td className="py-3 px-4 text-[10px] text-slate-600 text-center uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50/50">{det.retencionNombre ? `${det.retencionNombre} ${det.tarifaRetencion ? `(${det.tarifaRetencion}%)` : ''}` : '-'}</td>
                <td className="py-3 px-4 text-xs text-blue-900 font-black text-right">{formatCurrency(det.valorTotal)}</td>
              </tr>
            ))}
            {(!factura.detalles || factura.detalles.length === 0) && (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400 font-medium">No hay detalles registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex justify-between items-start">
        <div className="w-1/2 pr-8">
          <div className="mb-6">
            <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 border-b border-slate-200 pb-1">Observaciones / Notas</h4>
            <p className="text-xs text-slate-600 italic">N/A</p>
          </div>

        </div>

        <div className="w-[40%] bg-slate-50 rounded-2xl border border-slate-200 p-6">
          <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 uppercase">Subtotal</span>
            <span className="text-sm font-black text-slate-800">{formatCurrency(factura.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 uppercase">Descuentos</span>
            <span className="text-sm font-black text-red-500">- {formatCurrency(factura.descuentoTotal)}</span>
          </div>

          {impuestosCargo.length > 0 || impuestosRetencion.length > 0 ? (
            <>
              {impuestosCargo.map((imp, idx) => (
                <div key={`cargo-${idx}`} className="flex justify-between items-center py-2 border-b border-slate-200/60">
                  <span className="text-xs font-bold text-slate-500 uppercase">{imp.nombre} ({imp.tarifa}%)</span>
                  <span className="text-sm font-black text-slate-800">{formatCurrency(imp.valor)}</span>
                </div>
              ))}
              {impuestosRetencion.map((imp, idx) => (
                <div key={`ret-${idx}`} className="flex justify-between items-center py-2 border-b border-slate-200/60">
                  <span className="text-xs font-bold text-slate-500 uppercase">{imp.nombre} ({imp.tarifa}%)</span>
                  <span className="text-sm font-black text-red-500">- {formatCurrency(imp.valor)}</span>
                </div>
              ))}
            </>
          ) : (
            <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
              <span className="text-xs font-bold text-slate-500 uppercase">Impuestos</span>
              <span className="text-sm font-black text-slate-800">{formatCurrency(factura.totalImpuestos)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 mt-2">
            <span className="text-sm font-black text-blue-900 uppercase tracking-widest">Total Pagar</span>
            <span className="text-2xl font-black text-emerald-600 drop-shadow-sm">{formatCurrency(factura.totalNeto)}</span>
          </div>

          <div className="flex justify-between items-center py-2 mt-4 border-t-2 border-slate-100 border-dashed">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Pagado</span>
            <span className="text-sm font-black text-blue-600">{formatCurrency(factura.totalPagado)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs font-black text-rose-500 uppercase tracking-widest">Saldo Pendiente</span>
            <span className="text-lg font-black text-rose-500">{formatCurrency(factura.saldo)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


