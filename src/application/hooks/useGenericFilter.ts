import { useState, useMemo } from 'react';

export interface FilterConfig<T> {
  searchFields: (keyof T)[];
  customFilters?: {
    [key: string]: (item: T, value: string) => boolean;
  };
}

export function useFilter<T>(data: T[], config: FilterConfig<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Búsqueda por texto en campos definidos
      const matchesSearch = config.searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });

      // 2. Filtros personalizados (Exactos)
      const matchesCustom = Object.entries(activeFilters).every(([key, value]) => {
        if (value === 'all' || value === undefined || value === null) return true;
        return config.customFilters?.[key]?.(item, value) ?? true;
      });

      return matchesSearch && matchesCustom;
    });
  }, [data, searchTerm, activeFilters, config]);

  const updateFilter = (filterName: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [filterName]: value }));
  };

  return {
    searchTerm,
    setSearchTerm,
    activeFilters,
    updateFilter,
    filteredData,
  };
}