import React from 'react';
import type { ElementType } from 'react';

interface CheckboxCardProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  icon?: ElementType;
  colorTheme?: 'blue' | 'indigo';
  hasError?: boolean;
}

const CheckboxCard: React.FC<CheckboxCardProps> = ({
  label,
  checked,
  onChange,
  icon: Icon,
  colorTheme = 'blue',
  hasError = false,
}) => {
  const themeColors = {
    blue: {
      bgActive: 'bg-blue-50/30',
      borderActive: 'border-blue-200',
      textActive: 'text-blue-600',
      boxActive: 'bg-blue-500 border-blue-500',
      iconActive: 'text-blue-400',
    },
    indigo: {
      bgActive: 'bg-indigo-50/30',
      borderActive: 'border-indigo-200',
      textActive: 'text-indigo-600',
      boxActive: 'bg-indigo-500 border-indigo-500',
      iconActive: 'text-indigo-400',
    }
  };

  const colors = themeColors[colorTheme];

  return (
    <div
      onClick={onChange}
      className={`flex items-center p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm
        ${checked 
            ? `${colors.bgActive} ${colors.borderActive}` 
            : hasError 
              ? "bg-red-50/10 border-red-200" 
              : "bg-white border-slate-50 hover:border-slate-200"
        }`}
    >
      <div className="flex items-center gap-3 w-full pointer-events-none">
        <div className={`w-3.5 h-3.5 rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-colors ${
          checked ? colors.boxActive : "bg-white border-slate-300 shadow-sm"
        }`}>
          {checked && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
        </div>
        
        <div className="flex flex-col justify-center">
          <span
            className={`text-[10px] uppercase tracking-widest font-black transition-colors ${
              checked ? colors.textActive : "text-slate-400"
            }`}
          >
            {label}
          </span>
          {Icon && (
            <Icon
              size={13}
              className={`mt-0.5 ${checked ? colors.iconActive : "text-slate-300"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckboxCard;