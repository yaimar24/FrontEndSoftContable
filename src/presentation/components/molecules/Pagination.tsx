import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  totalCount,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalPages <= 1 && totalCount === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-slate-200 bg-white">
      <div className="text-sm text-slate-500 font-medium">
        Mostrando <span className="font-bold text-slate-800">{page * pageSize - pageSize + 1}</span> a{' '}
        <span className="font-bold text-slate-800">
          {Math.min(page * pageSize, totalCount)}
        </span>{' '}
        de <span className="font-bold text-slate-800">{totalCount}</span> resultados
      </div>

      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {[10, 20, 30, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={!hasPreviousPage}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Primera página"
          >
            <ChevronsLeft size={18} />
          </button>
          
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPreviousPage}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
            {page} / {totalPages > 0 ? totalPages : 1}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Página siguiente"
          >
            <ChevronRight size={18} />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Última página"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};