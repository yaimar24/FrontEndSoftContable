import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PucNodo } from '../../../../models/puc';

interface Props {
  nodo: PucNodo;
  onAddChild: (padre: { codigo: string; nombre: string }, hijos: PucNodo[]) => void;
  forceOpen?: boolean;
}

const PucItem: React.FC<Props> = ({ nodo, onAddChild, forceOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0;

  useEffect(() => { if (forceOpen) setIsOpen(true); }, [forceOpen]);

  return (
    <div className="ml-4">
      <div className="flex items-center gap-3 py-2 px-4 rounded-2xl hover:bg-slate-50 group transition-all">
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer text-slate-400 hover:text-blue-500">
          {tieneHijos ? (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <div className="w-4" />}
        </div>
        
        <div className={nodo.esDetalle ? "text-blue-500" : "text-amber-500"}>
          {nodo.esDetalle ? <FileText size={18} /> : <Folder size={18} />}
        </div>

        <div className="flex flex-col flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{nodo.codigo}</span>
          <span className="text-sm font-bold text-slate-700 uppercase">{nodo.nombre}</span>
        </div>

        {!nodo.esDetalle && (
          <button 
            onClick={() => onAddChild({ codigo: nodo.codigo, nombre: nodo.nombre }, nodo.hijos)}
            className="opacity-0 group-hover:opacity-100 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 transition-all"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && tieneHijos && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -10 }}
            className="border-l-2 border-slate-100 ml-6"
          >
            {nodo.hijos.map((hijo) => (
              <PucItem 
                key={`${hijo.codigo}-${hijo.colegioId}`} 
                nodo={hijo} 
                onAddChild={onAddChild} 
                forceOpen={forceOpen} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PucItem;