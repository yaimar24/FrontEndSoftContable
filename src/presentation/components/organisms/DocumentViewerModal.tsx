import React, { useRef } from "react";
import type { ReactNode } from "react";
import { X, FileText, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../atoms/Button";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  onDownloadPdf?: () => void;
  onOpenNewTab?: () => void;
  onPrint?: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  title = "Visor de Documentos",
  children,
  onOpenNewTab,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 print:absolute print:inset-0 print:bg-white print:p-0 print:z-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-slate-100 flex flex-col w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:h-auto print:rounded-none print:w-full print:max-w-none print:bg-white"
          >
            {/* Header - Not visible in print */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" size={24} />
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">{title}</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                  {onOpenNewTab && (
                    <Button variant="outline" onClick={onOpenNewTab} icon={ExternalLink} className="text-xs px-4 py-2 rounded-xl">
                      Vista previa
                    </Button>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                  title="Cerrar Visor"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Document Content Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar print:overflow-visible print:p-0 bg-slate-100 print:bg-white">
              <div 
                ref={containerRef}
                className="bg-white mx-auto shadow-sm print:shadow-none print:max-w-none min-h-[1056px] max-w-[816px] origin-top"
                style={{ width: "100%" }}
              >
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
