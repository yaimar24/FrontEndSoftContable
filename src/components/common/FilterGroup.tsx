import React from 'react';

interface Option {
  id: string | number;
  label: string;
}

interface FilterGroupProps {
  options: Option[];
  activeId: string | number;
  onChange: (id: any) => void;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({ options, activeId, onChange }) => {
  return (
    <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm self-start overflow-x-auto no-scrollbar">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
            activeId === opt.id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};