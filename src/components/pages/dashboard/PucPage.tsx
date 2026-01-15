import React, { useState, useEffect } from 'react';

import { FolderPlus } from 'lucide-react';
import { getPucTree } from '../../../services/puc/pucService';
import FormNuevaCuenta from '../../puc/FormNuevaCuenta';
import PucItem from '../../puc/PucItem';

const PucPage: React.FC = () => {
  const [tree, setTree] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [padreSeleccionado, setPadreSeleccionado] = useState<any>(null);

  const fetchData = async () => {
    const data = await getPucTree();
    setTree(data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAbrirModal = (padre?: any) => {
    setPadreSeleccionado(padre);
    setShowModal(true);
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Plan Único de Cuentas</h1>
          <p className="text-slate-500">Gestione la jerarquía contable institucional</p>
        </div>
        <button 
          onClick={() => handleAbrirModal(null)}
          className="bg-slate-800 text-white px-8 py-4 rounded-3xl font-bold flex items-center gap-2 hover:bg-black transition-all"
        >
          <FolderPlus size={20} /> Nueva Clase (Raíz)
        </button>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/60 border border-slate-50">
        {tree.map((nodo: any) => (
          <PucItem key={nodo.codigo} nodo={nodo} onAddChild={handleAbrirModal} />
        ))}
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