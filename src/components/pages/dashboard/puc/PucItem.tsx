import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus, Edit2, EyeOff, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PucNodo } from '../../../../models/Puc';

interface Props {
  nodo: PucNodo;
  onAddChild: (padre: { codigo: string; nombre: string }, hijos: PucNodo[]) => void;
  onEditNode?: (nodo: PucNodo) => void;
  onDeleteNode?: (nodo: PucNodo) => void;
  forceOpen?: boolean;
}

const PucItem: React.FC<Props> = ({ nodo, onAddChild, onEditNode, onDeleteNode, forceOpen }) => {
  const [isOpen, setIsOpen] = useState(!!forceOpen);
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0;

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

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
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-700 uppercase">{nodo.nombre}</span>
            {nodo.esGlobal ? (
              <span className="flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest border border-slate-200">
                <Globe size={10} /> Sistema
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest border border-blue-100">
                Propia
              </span>
            )}
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center justify-end gap-2 transition-all">
          {!nodo.esDetalle && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddChild({ codigo: nodo.codigo, nombre: nodo.nombre }, nodo.hijos); }}
              title="A�adir sub-cuenta"
              className="p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          )}
          {onEditNode && (
            <button
              onClick={(e) => { e.stopPropagation(); onEditNode(nodo); }}
              title="Editar cuenta"
              className="p-2 bg-amber-500 text-white rounded-xl shadow-lg hover:bg-amber-600 hover:scale-110 transition-all flex items-center justify-center"
            >
              <Edit2 size={14} />
            </button>
          )}
          {onDeleteNode && (
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteNode(nodo); }}
              title="Ocultar cuenta"
              className="p-2 bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600 hover:scale-110 transition-all flex items-center justify-center"
            >
              <EyeOff size={14} />
            </button>
          )}
        </div>
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
                key={`${hijo.codigo}-${hijo.colegioId || ''}`}
                nodo={hijo}
                onAddChild={onAddChild}
                onEditNode={onEditNode}
                onDeleteNode={onDeleteNode}
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
