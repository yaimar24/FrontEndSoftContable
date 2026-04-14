// components/organisms/Table.tsx
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface ServerPagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  itemsPerPage?: number;
  isServer?: boolean;
  serverPagination?: ServerPagination;
}

export const Table = <T,>({ columns, data, itemsPerPage = 10, isServer, serverPagination }: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const activePage = isServer && serverPagination ? serverPagination.page : currentPage;
  
  
  const totalPages = isServer && serverPagination
    ? (serverPagination.totalPages > 0 ? serverPagination.totalPages : 1)
    : Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    if (isServer) return data;
    const start = (activePage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, activePage, itemsPerPage, isServer]);

  const handlePageChange = (page: number) => {
    if (isServer && serverPagination) {
      serverPagination.onPageChange(page);
    } else {
      setCurrentPage(page);
    }
  };

  // Automatically adjust current page if data shrinks out of bounds
  React.useEffect(() => {
    if (activePage > totalPages && totalPages > 0) {
      handlePageChange(totalPages);
    } else if (totalPages === 0 && !isServer) {
      setCurrentPage(1);
    }
  }, [totalPages, activePage, isServer]);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (activePage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (activePage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', activePage - 1, activePage, activePage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Este div controla el scroll interno horizontal */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-5 py-5 text-left text-[9.5px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr key={i} className="group transition-colors hover:bg-blue-50/20">
                  {columns.map((col, j) => (
                    <td key={j} className={`px-5 py-4.5 sm:py-5 text-xs text-slate-600 font-medium ${col.className || ''}`}>
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
               <tr>
                 <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wide">
                    No hay registros disponibles
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

            {/* Pagination Container */}
      {(totalPages > 0 || isServer) && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)]">
            <div className="text-[11px] font-bold text-slate-500 whitespace-nowrap flex flex-col sm:flex-row gap-3 items-center">
              <span>
                {isServer && serverPagination ? (
                  <>Mostrando del <span className="text-slate-800">{(activePage - 1) * serverPagination.pageSize + 1}</span> al <span className="text-slate-800">{Math.min(activePage * serverPagination.pageSize, serverPagination.totalCount)}</span> de <span className="text-slate-800">{serverPagination.totalCount}</span> registros</>
                ) : (
                  <>Mostrando del <span className="text-slate-800">{(activePage - 1) * itemsPerPage + 1}</span> al <span className="text-slate-800">{Math.min(activePage * itemsPerPage, data.length)}</span> de <span className="text-slate-800">{data.length}</span> registros</>
                )}
              </span>

              {isServer && serverPagination?.onPageSizeChange && (
                  <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Filas:</span>
                    <select
                      value={serverPagination.pageSize}
                      onChange={(e) => serverPagination.onPageSizeChange!(Number(e.target.value))}
                      className="bg-transparent outline-none font-bold text-slate-700 text-xs cursor-pointer"
                    >
                      {[5, 10, 20, 30, 50, 100].map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </label>
              )}
            </div>

            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm border border-slate-200 bg-white overflow-hidden" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(Math.max(activePage - 1, 1))} 
                  disabled={isServer ? !serverPagination?.hasPreviousPage : activePage === 1}
                  className="relative inline-flex items-center px-2 py-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 focus:z-20 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors cursor-pointer"
                >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="hidden sm:flex border-x border-slate-200">
                    {getPageNumbers().map((page, idx) => (
                        page === '...' ? (
                            <span key={`ellipsis-${idx}`} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-400 select-none">
                                <MoreHorizontal size={16} />
                            </span>
                        ) : (
                            <button
                                key={`page-${page}`}
                                onClick={() => handlePageChange(page as number)}
                                className={`relative inline-flex items-center px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                                    activePage === page
                                    ? 'z-10 bg-blue-50 text-blue-700 shadow-[inset_0_-2px_0_0_#2563eb]'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-x border-transparent hover:border-slate-200'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <div className="flex sm:hidden items-center px-4 py-2 text-xs font-bold text-slate-700 border-x border-slate-200 select-none">
                   Pág. {activePage} de {totalPages}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(activePage + 1, totalPages))}
                  disabled={isServer ? !serverPagination?.hasNextPage : activePage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 focus:z-20 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors cursor-pointer"
                >
                    <span className="sr-only">Siguiente</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
            </nav>
        </div>
      )}
    </div>
  );
};
