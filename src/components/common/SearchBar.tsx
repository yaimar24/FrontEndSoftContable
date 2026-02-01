import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "BUSCAR...", 
  className = "" 
}) => {
  return (
    <div className={`relative group w-full ${className}`}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors z-10"
        size={20}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-[11px] font-bold uppercase tracking-wider shadow-sm"
      />
    </div>
  );
};

export default SearchBar;