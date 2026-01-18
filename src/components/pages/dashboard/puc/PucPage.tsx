import React, { useState, useEffect, useCallback } from 'react';
import { FolderPlus, RefreshCcw } from 'lucide-react';
import { getPucTree } from '../../../../services/puc/pucService';
import FormNuevaCuenta from './FormNuevaCuenta';
import PucItem from './PucItem';
import type { PucNodo } from '../../../../models/puc';


const PucPage: React.FC = () => {
  const [tree, setTree] = useState<PucNodo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  
  // Usamos undefined en lugar de null para evitar errores de tipos con props opcionales
  const [padreSeleccionado, setPadreSeleccionado] = useState<{codigo: string, nombre: string} | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPucTree();
      setTree(data);
    } catch (error) {
      console.error("Error al cargar el PUC:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Función para abrir el modal, acepta un padre opcional
  const handleAbrirModal = (padre?: {codigo: string, nombre: string}) => {
    setPadreSeleccionado(padre);
    setShowModal(true);
  };

  return (
    <div className="p-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Plan de Cuentas</h1>
          <p className="text-slate-500 font-medium">Gestión del catálogo contable institucional</p>
        </div>
        
        <div className="flex gap-4">
          <button onClick={fetchData} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          
          <button 
            onClick={() => handleAbrirModal(undefined)}
            className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            <FolderPlus size={20} /> Nueva Clase
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-50 min-h-[400px]">
        {loading && tree.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-slate-400 font-bold uppercase tracking-widest animate-pulse">
            Cargando Estructura...
          </div>
        ) : (
          <div className="max-w-4xl">
            {tree.map((nodo) => (
              <PucItem key={nodo.codigo} nodo={nodo} onAddChild={handleAbrirModal} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <FormNuevaCuenta 
          padre={padreSeleccionado} 
          onClose={() => setShowModal(false)} 
          onSuccess={fetchData} 
        />
      )}
    </div>
  );
};

export default PucPage;