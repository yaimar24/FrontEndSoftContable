// components/common/Table.tsx
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  itemsPerPage?: number;
}

export const Table = <T,>({ columns, data, itemsPerPage = 10 }: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  // Automatically adjust current page if data shrinks out of bounds
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const generatePageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
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
      {totalPages > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/30 px-4 py-3 flex flex-wrap gap-3 items-center justify-between">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, data.length)} de {data.length}
            </div>
            
            <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg border-2 border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-100 hover:bg-blue-50 transition-all disabled:opacity-50 active:scale-95"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                    {generatePageNumbers().map((page, idx) => (
                        page === '...' ? (
                            <div key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-300">
                                <MoreHorizontal size={14} />
                            </div>
                        ) : (
                            <button
                                key={`page-${page}`}
                                onClick={() => setCurrentPage(page as number)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all active:scale-95 border-2 ${
                                    currentPage === page 
                                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm' 
                                    : 'bg-white text-slate-500 border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg border-2 border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-100 hover:bg-blue-50 transition-all disabled:opacity-50 active:scale-95"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
