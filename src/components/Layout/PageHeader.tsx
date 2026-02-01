import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  idTag?: string | number | null;
  actions?: React.ReactNode; // Para buscadores, botones, etc.
  switcher?: React.ReactNode; // Para el toggle de "Lista / Registro"
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  idTag,
  actions,
  switcher,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon className="text-blue-600" size={32} strokeWidth={2.5} />
          )}
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter leading-none">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {subtitle && (
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
              {subtitle}
            </p>
          )}
          {idTag && (
            <span className="px-3 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-100 uppercase">
              ID: {idTag}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
        {switcher && (
          <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm">
            {switcher}
          </div>
        )}
        {actions && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
