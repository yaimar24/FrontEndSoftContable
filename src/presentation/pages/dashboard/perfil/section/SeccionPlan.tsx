import { useState } from 'react';
import { Crown, ShieldCheck, ChevronRight } from 'lucide-react';
import type { ModuloPlan } from '../../../../../domain/models/Seguridad';
import { MODULE_ICON, MODULE_LABEL, PLAN_BADGE } from './planConstants';
import { PlanesModal } from './PlanesModal';

interface Props {
  planNombre?: string;
  modulosDelPlan?: ModuloPlan[];
}

export const SeccionPlan: React.FC<Props> = ({ planNombre, modulosDelPlan }) => {
  const [showModal, setShowModal] = useState(false);

  if (!planNombre) return null;

  const badge = PLAN_BADGE[planNombre] ?? PLAN_BADGE['Básico'];

  return (
    <>
      <section className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: plan info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 border border-amber-100">
              <Crown size={16} className="text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-0.5">
                Plan Activo
              </p>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badge}`}>
                  {planNombre}
                </span>
                {modulosDelPlan && (
                  <span className="text-[10px] text-slate-400">
                    · {modulosDelPlan.length} módulos
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: module chips (compact) */}
          <div className="hidden md:flex items-center gap-1.5 flex-1 justify-center min-w-0">
            {modulosDelPlan?.slice(0, 6).map((mod) => {
              const meta = MODULE_ICON[mod.id];
              const Icon = meta?.icon ?? ShieldCheck;
              const color = meta?.color ?? 'text-slate-500';
              return (
                <div
                  key={mod.id}
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 border border-slate-100"
                  title={MODULE_LABEL[mod.id] ?? mod.nombre}
                >
                  <Icon size={13} className={color} />
                </div>
              );
            })}
            {modulosDelPlan && modulosDelPlan.length > 6 && (
              <span className="text-[10px] text-slate-400 font-semibold ml-1">
                +{modulosDelPlan.length - 6}
              </span>
            )}
          </div>

          {/* Right: action */}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
          >
            Ver Planes
            <ChevronRight size={14} />
          </button>
        </div>
      </section>

      <PlanesModal
        show={showModal}
        onClose={() => setShowModal(false)}
        planActual={planNombre}
        modulosActuales={modulosDelPlan}
      />
    </>
  );
};
