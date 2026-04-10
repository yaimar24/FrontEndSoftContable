import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface ExportButtonsProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ onExportExcel, onExportPDF }) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={onExportExcel}
        className="flex items-center gap-2.5 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs sm:text-sm font-black uppercase shadow-md hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
      >
        <FileSpreadsheet size={20} strokeWidth={2.5} /> Excel
      </button>
      <button
        onClick={onExportPDF}
        className="flex items-center gap-2.5 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl text-xs sm:text-sm font-black uppercase shadow-md hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
      >
        <FileText size={20} strokeWidth={2.5} /> PDF
      </button>
    </div>
  );
};
