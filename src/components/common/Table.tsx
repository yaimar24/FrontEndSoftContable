// components/common/Table.tsx
import React from 'react';

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export const Table = <T,>({ columns, data }: TableProps<T>) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Este div controla el scroll interno horizontal */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse min-w-max"> 
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={`p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap ${col.className}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item, i) => (
              <tr key={i} className="group transition-colors hover:bg-blue-50/20">
                {columns.map((col, j) => (
                  <td key={j} className={`p-6 text-sm text-slate-600 font-medium ${col.className}`}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};