import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  nodo: any;
  onAddChild: (padre: { codigo: string; nombre: string }) => void;
}

const PucItem: React.FC<Props> = ({ nodo, onAddChild }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0;

  return (
    <div className="ml-4">
      <div className="flex items-center gap-3 py-2 px-4 rounded-2xl hover:bg-slate-50 group transition-all">
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer text-slate-400">
          {tieneHijos ? (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <div className="w-4" />}
        </div>

        <div className={nodo.esDetalle ? "text-blue-500" : "text-amber-500"}>
          {nodo.esDetalle ? <FileText size={18} /> : <Folder size={18} />}
        </div>

        <div className="flex flex-col flex-1" onClick={() => setIsOpen(!isOpen)}>
          <span className="text-[10px] font-bold text-slate-400 font-mono">{nodo.codigo}</span>
          <span className="text-sm font-bold text-slate-700 uppercase">{nodo.nombre}</span>
        </div>

        <button 
          onClick={() => onAddChild({ codigo: nodo.codigo, nombre: nodo.nombre })}
          className="opacity-0 group-hover:opacity-100 p-2 bg-blue-600 text-white rounded-xl shadow-lg transition-all"
        >
          <Plus size={14} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && tieneHijos && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="border-l-2 border-slate-100 ml-6">
            {nodo.hijos.map((hijo: any) => (
              <PucItem key={hijo.codigo} nodo={hijo} onAddChild={onAddChild} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PucItem;