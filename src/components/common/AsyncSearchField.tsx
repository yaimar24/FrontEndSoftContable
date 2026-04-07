import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface AsyncSearchFieldProps<T> {
  label: string;
  placeholder?: string;
  required?: boolean;
  value: string; // the id/value to be updated
  displayValue?: string; // initial display text
  fetcher: (query: string) => Promise<T[]>;
  getDisplayValue: (item: T) => string;
  getKey: (item: T) => string | number;
  onSelect: (item: T) => void;
  icon?: React.ElementType;
  error?: string;
}

export function AsyncSearchField<T>({
  label,
  placeholder = "Buscar...",
  required = false,
  value,
  displayValue = "",
  fetcher,
  getDisplayValue,
  getKey,
  onSelect,
  icon: Icon,
  error
}: AsyncSearchFieldProps<T>) {
  const [query, setQuery] = useState(displayValue);
  const [results, setResults] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store the current fetch abort controller to prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (displayValue) {
      setQuery(displayValue);
    }
  }, [displayValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true); // Open the dropdown when the user types

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!newQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      // Let the parent component know that the value has been cleared
      // if they provide a handler for clearing
      return;
    }

    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      // Abort any old pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const data = await fetcher(newQuery);
        // Only set results if this is still the active request
        if (!controller.signal.aborted) {
          setResults(data);
          setIsOpen(true);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("AsyncSearchField:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400); // 400ms debounce
  };

  const handleSelect = (item: T) => {
    const selectedDisplay = getDisplayValue(item);
    setQuery(selectedDisplay);
    setIsOpen(false);
    onSelect(item);
  };

  const handleInputClick = () => {
    // If the user clears the text while it's selected, open it directly so they can see all default search options if needed.
    if (query.trim() || results.length > 0) setIsOpen(true);
  };

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      {label && (
        <label className="text-[11px] font-black text-slate-700 tracking-widest uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </div>
        ) : (
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
             <Search size={18} />
           </div>
        )}
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder={placeholder}
          onClick={handleInputClick}
          onFocus={handleInputClick}
          className={`w-full bg-slate-50 border text-slate-700 text-sm font-bold rounded-2xl focus:ring-4 outline-none transition-all py-3.5 pr-4 pl-12 placeholder:font-medium placeholder:text-slate-400 ${
            error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
          }`}
        />
        {/* Hidden input to store proper value for form submission, etc if needed */}
        <input type="hidden" value={value} required={required} />
      </div>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col p-2 space-y-1">
          {loading ? (
            <li className="px-4 py-3 text-sm text-slate-400 text-center font-bold">Buscando...</li>
          ) : results.length > 0 ? (
            results.map((item, idx) => (
              <li
                key={getKey(item) || idx}
                onClick={() => handleSelect(item)}
                className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors border-b border-slate-50 last:border-0"
              >
                 <span className="text-xs font-bold text-slate-700">{getDisplayValue(item)}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-slate-400 text-center font-bold">No se encontraron resultados</li>
          )}
        </ul>
      )}
    </div>
  );
}
