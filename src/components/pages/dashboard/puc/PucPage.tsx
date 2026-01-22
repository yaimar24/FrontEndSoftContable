import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FolderPlus, RefreshCcw, Search } from 'lucide-react';
import { getPucTree } from '../../../../services/puc/pucService';
import FormNuevaCuenta from './FormNuevaCuenta';
import PucItem from './PucItem';
import type { PucNodo } from '../../../../models/puc';

const PucPage: React.FC = () => {
  const [tree, setTree] = useState<PucNodo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [padreSeleccionado, setPadreSeleccionado] = useState<{codigo: string, nombre: string} | undefined>(undefined);
  const [hijosDelPadre, setHijosDelPadre] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPucTree();
      if (response.success && response.data) {
        // Clonamos para asegurar que React detecte un cambio total de estado
        setTree(JSON.parse(JSON.stringify(response.data)));
      }
    } catch (error) {
      console.error("Error cargando PUC", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredTree = useMemo(() => {
    if (!searchTerm) return tree;
    const filterNodes = (nodes: PucNodo[]): PucNodo[] => {
      return nodes.map(node => ({ ...node })).filter(node => {
        const matchSelf = node.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || node.codigo.includes(searchTerm);
        if (node.hijos && node.hijos.length > 0) {
          node.hijos = filterNodes(node.hijos);
          return matchSelf || node.hijos.length > 0;
        }
        return matchSelf;
      });
    };
    return filterNodes(tree);
  }, [tree, searchTerm]);

  const handleOpenModal = (padre?: {codigo: string, nombre: string}, hijos: PucNodo[] = []) => {
    setPadreSeleccionado(padre);
    setHijosDelPadre(hijos.map(h => h.codigo));
    setShowModal(true);
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Plan de Cuentas</h1>
          <p className="text-slate-500 font-medium italic">Catálogo institucional</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Buscar cuenta..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold w-80 outline-none focus:border-blue-500 shadow-sm transition-all"
            />
          </div>
          <button onClick={fetchData} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm">
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => handleOpenModal(undefined, tree)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black shadow-xl transition-all">
            <FolderPlus size={20} /> Nueva Clase
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-50 min-h-[500px]">
        {loading ? (
          <div className="flex justify-center py-20 text-slate-300 font-black animate-pulse">CARGANDO...</div>
        ) : (
          <div className="max-w-4xl">
            {filteredTree.map((nodo) => (
              <PucItem 
                key={`${nodo.codigo}-${nodo.colegioId}`} 
                nodo={nodo} 
                onAddChild={handleOpenModal} 
                forceOpen={!!searchTerm} 
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <FormNuevaCuenta 
          padre={padreSeleccionado} 
          hijosExistentes={hijosDelPadre}
          onClose={() => { setShowModal(false); setPadreSeleccionado(undefined); }} 
          onSuccess={fetchData} 
        />
      )}
    </div>
  );
};

export default PucPage;