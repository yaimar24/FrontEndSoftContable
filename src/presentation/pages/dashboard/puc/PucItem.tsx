import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus, Edit2, EyeOff, Globe, Loader2, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PucNodo } from '../../../../domain/models/Puc';
import { getPucChildren } from '../../../../data/services/puc/pucService';

interface Props {
  nodo: PucNodo;
  onAddChild: (padre: { codigo: string; nombre: string }, hijos: PucNodo[]) => void;
  onEditNode?: (nodo: PucNodo) => void;
  onDeleteNode?: (nodo: PucNodo) => void;
  forceOpen?: boolean;
  highlightCodigo?: string;
  expandCodigos?: Set<string>;
}

const PucItem: React.FC<Props> = ({ nodo, onAddChild, onEditNode, onDeleteNode, forceOpen, highlightCodigo, expandCodigos }) => {
  const [isOpen, setIsOpen] = useState(!!forceOpen);
  const [children, setChildren] = useState<PucNodo[]>(nodo.hijos || []);
  const [isLoading, setIsLoading] = useState(false);
  const [childrenLoaded, setChildrenLoaded] = useState(nodo.hijos && nodo.hijos.length > 0);

  const canExpand = nodo.tieneHijos === true || (children.length > 0);
  const isHighlighted = highlightCodigo === nodo.codigo;

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // Auto-expand if this node is in the expandCodigos set
  useEffect(() => {
    if (expandCodigos?.has(nodo.codigo) && !isOpen) {
      handleToggle();
    }
  }, [expandCodigos]);

  // Scroll into view when highlighted
  useEffect(() => {
    if (isHighlighted) {
      const el = document.getElementById(`puc-node-${nodo.codigo}`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      }
    }
  }, [isHighlighted]);

  // Sync children if nodo.hijos changes externally (e.g. after search filter)
  useEffect(() => {
    if (nodo.hijos && nodo.hijos.length > 0) {
      setChildren(nodo.hijos);
      setChildrenLoaded(true);
    }
  }, [nodo.hijos]);

  const handleToggle = async () => {
    if (!canExpand) return;

    if (!isOpen && !childrenLoaded && nodo.tieneHijos) {
      // Load children on demand
      setIsLoading(true);
      try {
        const res = await getPucChildren(nodo.codigo);
        if (res.success && res.data) {
          setChildren(res.data);
          setChildrenLoaded(true);
        }
      } catch (e) {
        console.error("Error loading children for", nodo.codigo, e);
      } finally {
        setIsLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const renderIcon = () => {
    if (isLoading) return <Loader2 size={16} className="animate-spin text-blue-500" />;
    if (canExpand) {
      return isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />;
    }
    return <div className="w-4" />;
  };

  const renderNodeIcon = () => {
    if (nodo.esDetalle) return <FileText size={18} />;
    if (!nodo.tieneHijos && !nodo.esDetalle) return <Folder size={18} />;
    return isOpen ? <FolderOpen size={18} /> : <Folder size={18} />;
  };

  return (
    <div className="ml-4">
      <div
        id={`puc-node-${nodo.codigo}`}
        className={`flex items-center gap-3 py-2 px-4 rounded-2xl hover:bg-slate-50 group transition-all ${
          isHighlighted ? 'bg-blue-50 ring-2 ring-blue-400 animate-pulse' : ''
        }`}
      >
        <div onClick={handleToggle} className="cursor-pointer text-slate-400 hover:text-blue-500">
          {renderIcon()}
        </div>

        <div className={nodo.esDetalle ? "text-blue-500" : "text-amber-500"}>
          {renderNodeIcon()}
        </div>

        <div className="flex flex-col flex-1 cursor-pointer" onClick={handleToggle}>
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
              onClick={(e) => { e.stopPropagation(); onAddChild({ codigo: nodo.codigo, nombre: nodo.nombre }, children); }}
              title="Añadir sub-cuenta"
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
        {isOpen && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="border-l-2 border-slate-100 ml-6"
          >
            {children.map((hijo) => (
              <PucItem
                key={`${hijo.codigo}-${hijo.colegioId || ''}`}
                nodo={hijo}
                onAddChild={onAddChild}
                onEditNode={onEditNode}
                onDeleteNode={onDeleteNode}
                forceOpen={forceOpen}
                highlightCodigo={highlightCodigo}
                expandCodigos={expandCodigos}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PucItem;
