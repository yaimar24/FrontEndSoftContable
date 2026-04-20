/**
 * Centralized status badge color mapping for invoice/document states.
 */

export interface EstadoInfo {
  label: string;
  color: string;
}

const VENTA_ESTADOS: Record<string, EstadoInfo> = {
  '0': { label: 'Borrador', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  '1': { label: 'Pendiente', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  '2': { label: 'Aprobada', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  '3': { label: 'Enviada', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  '4': { label: 'Pagada', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  '5': { label: 'Anulada', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  'Borrador': { label: 'Borrador', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  'Pendiente': { label: 'Pendiente', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  'Aprobada': { label: 'Aprobada', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  'Enviada': { label: 'Enviada', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  'PendienteConAbono': { label: 'Parcial', color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
  'Pagada': { label: 'Pagada', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  'Anulada': { label: 'Anulada', color: 'bg-rose-50 text-rose-600 border-rose-100' },
};

const COMPRA_ESTADOS: Record<string, EstadoInfo> = {
  '0': { label: 'Borrador', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  '2': { label: 'Anulada', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  '3': { label: 'Pendiente', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  '4': { label: 'Parcial', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  '5': { label: 'Pagado', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  'Borrador': { label: 'Borrador', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  'Anulada': { label: 'Anulada', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  'Pendiente': { label: 'Pendiente', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  'Parcial': { label: 'Parcial', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  'Pagado': { label: 'Pagado', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
};

const DEFAULT_ESTADO: EstadoInfo = { label: 'Desconocido', color: 'bg-gray-50 text-gray-600 border-gray-100' };

export const getVentaEstadoInfo = (estado: string | number): EstadoInfo =>
  VENTA_ESTADOS[estado?.toString()] || { label: estado?.toString() || DEFAULT_ESTADO.label, color: DEFAULT_ESTADO.color };

export const getCompraEstadoInfo = (estado: string | number): EstadoInfo =>
  COMPRA_ESTADOS[estado?.toString()] || { label: estado?.toString() || DEFAULT_ESTADO.label, color: DEFAULT_ESTADO.color };

export const getEstadoBadgeColor = (estado: string): string => {
  switch (estado?.toLowerCase()) {
    case 'pagada':
    case 'pagado':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'pendiente':
      return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'anulada':
      return 'bg-rose-50 text-rose-600 border-rose-100';
    case 'aprobada':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'enviada':
      return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    case 'borrador':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

export const getDiasVencidosBadge = (dias: number): string => {
  if (dias <= 0) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (dias <= 30) return 'bg-amber-50 text-amber-600 border-amber-100';
  if (dias <= 60) return 'bg-orange-50 text-orange-600 border-orange-100';
  return 'bg-rose-50 text-rose-600 border-rose-100';
};

export const getAgingRangeBadge = (rango: string): string => {
  if (rango.includes('0') && rango.includes('30')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (rango.includes('31') || rango.includes('60')) return 'bg-amber-50 text-amber-600 border-amber-100';
  if (rango.includes('61') || rango.includes('90')) return 'bg-orange-50 text-orange-600 border-orange-100';
  return 'bg-rose-50 text-rose-600 border-rose-100';
};
