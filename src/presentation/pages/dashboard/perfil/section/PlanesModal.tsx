import { useEffect, useState } from 'react';
import { X, Crown, Check, ShieldCheck } from 'lucide-react';
import type { ModuloPlan } from '../../../../../domain/models/Seguridad';
import { MODULE_ICON, MODULE_LABEL } from './planConstants';

/* ─── Plan definitions (static for now, will come from API later) ─── */
interface PlanDef {
  nombre: string;
  descripcion: string;
  modulos: number[];
  accent: string;
  badge: string;
  iconColor: string;
}

const PLANES: PlanDef[] = [
  {
    nombre: 'Básico',
    descripcion: 'Funcionalidades esenciales para empezar',
    modulos: [2, 5, 6, 8],
    accent: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-600',
    iconColor: 'text-slate-400',
  },
  {
    nombre: 'Estándar',
    descripcion: 'Ideal para negocios en crecimiento',
    modulos: [2, 3, 5, 6, 7, 8],
    accent: 'border-blue-200',
    badge: 'bg-blue-50 text-blue-700',
    iconColor: 'text-blue-400',
  },
  {
    nombre: 'Premium',
    descripcion: 'Acceso completo a todos los módulos',
    modulos: [2, 3, 4, 5, 6, 7, 8, 9, 10,11],
    accent: 'border-amber-200',
    badge: 'bg-amber-50 text-amber-700',
    iconColor: 'text-amber-500',
  },
];

interface Props {
  show: boolean;
  onClose: () => void;
  planActual?: string;
  modulosActuales?: ModuloPlan[];
}

export const PlanesModal: React.FC<Props> = ({ show, onClose, planActual }) => {
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setIsAnimate(true), 10);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
        setIsAnimate(false);
      };
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
        ${isAnimate ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent'}`}
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transition-all duration-300
          ${isAnimate ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <Crown size={18} className="text-amber-500" />
            <h2 className="text-sm font-bold text-slate-800">Planes Disponibles</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Plans grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANES.map((plan) => {
            const isActual = plan.nombre === planActual;

            return (
              <div
                key={plan.nombre}
                className={`relative flex flex-col rounded-xl border-2 p-5 transition-all
                  ${isActual ? `${plan.accent} bg-white shadow-sm` : 'border-slate-100 bg-white hover:border-slate-200'}`}
              >
                {/* Current badge */}
                {isActual && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider">
                      Tu plan
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="text-center mb-4 mt-1">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${plan.badge} mb-2`}>
                    <Crown size={18} className={plan.iconColor} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{plan.nombre}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{plan.descripcion}</p>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 my-3" />

                {/* Modules list */}
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Módulos ({plan.modulos.length})
                </p>
                <ul className="space-y-1.5 flex-1">
                  {plan.modulos.map((modId) => {
                    const meta = MODULE_ICON[modId];
                    const Icon = meta?.icon ?? ShieldCheck;
                    const color = meta?.color ?? 'text-slate-500';
                    const label = MODULE_LABEL[modId] ?? `Módulo ${modId}`;

                    return (
                      <li key={modId} className="flex items-center gap-2 text-[11px] text-slate-600">
                        <Icon size={12} className={color} />
                        <span className="flex-1">{label}</span>
                        <Check size={12} className="text-emerald-400" />
                      </li>
                    );
                  })}
                </ul>

                {/* Action area (placeholder for future upgrade/buy) */}
                <div className="mt-4">
                  {isActual ? (
                    <div className="w-full py-2 rounded-lg bg-slate-50 text-center text-[11px] font-semibold text-slate-400">
                      Plan actual
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 rounded-lg bg-slate-100 text-center text-[11px] font-semibold text-slate-400 cursor-not-allowed"
                      title="Próximamente"
                    >
                      Próximamente
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
