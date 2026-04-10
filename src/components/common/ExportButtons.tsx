import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface ExportButtonsProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ onExportExcel, onExportPDF }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onExportExcel}
        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] sm:text-xs font-black uppercase shadow-sm hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
      >
        <FileSpreadsheet size={16} strokeWidth={2.5} /> Excel
      </button>
      <button
        onClick={onExportPDF}
        className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] sm:text-xs font-black uppercase shadow-sm hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
      >
        <FileText size={16} strokeWidth={2.5} /> PDF
      </button>
    </div>
  );
};
