import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getPucTree } from "../../../../services/puc/pucService";
import FormNuevaCuenta from "./FormNuevaCuenta";
import PucItem from "./PucItem";
import type { PucNodo } from "../../../../models/Puc";
import PageHeader from "../../../Layout/PageHeader";
import SearchBar from "../../../common/SearchBar";
import { FolderPlus, RefreshCcw, EyeOff, Globe, Eye } from "lucide-react";
import { hideCuentaContable, restoreCuentaContable, updateCuentaContable, getHiddenPuc } from "../../../../services/puc/pucService";
import Modal from "../../../common/Modal";
import StatusModal from "../../../common/StatusModal";
import InputField from "../../../common/InputField";
import Button from "../../../common/Button";

const PucPage: React.FC = () => {
  const [tree, setTree] = useState<PucNodo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [padreSeleccionado, setPadreSeleccionado] = useState<
    { codigo: string; nombre: string } | undefined
  >(undefined);
  const [hijosDelPadre, setHijosDelPadre] = useState<string[]>([]);

  // Edit state
  const [editNode, setEditNode] = useState<PucNodo | undefined>(undefined);
  const [editNombre, setEditNombre] = useState("");
  const [editNaturaleza, setEditNaturaleza] = useState("D");
  const [editEsDetalle, setEditEsDetalle] = useState(false);

  // Hidden state
  const [showHiddenModal, setShowHiddenModal] = useState(false);
  const [hiddenNodes, setHiddenNodes] = useState<PucNodo[]>([]);

  const [statusModal, setStatusModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'success', message: '' });

  const closeStatusModal = () => setStatusModal(prev => ({ ...prev, show: false, onConfirm: undefined }));

  const handleDeleteNode = async (nodo: PucNodo) => {
    setStatusModal({
      show: true,
      type: 'confirm',
      message: `¿Seguro que desea ocultar la cuenta ${nodo.codigo}?`,
      onConfirm: async () => {
        setStatusModal(prev => ({ ...prev, show: false }));
        try {
          const res = await hideCuentaContable(nodo.codigo);
          if (res.success) { await fetchData(); }
          else { setStatusModal({ show: true, type: 'error', message: res.message }); }
        } catch (e) { setStatusModal({ show: true, type: 'error', message: 'Error de red' }); }
      }
    });
  };

  const startEditNode = (nodo: PucNodo) => {
    setEditNode(nodo);
    setEditNombre(nodo.nombre);
    setEditNaturaleza(nodo.naturaleza);
    setEditEsDetalle(nodo.esDetalle);
  };

  const handleUpdateNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNode) return;
    try {
      const res = await updateCuentaContable(editNode.codigo, {
        nombre: editNombre,
        naturaleza: editNode.esGlobal ? undefined : editNaturaleza,
        esDetalle: editNode.esGlobal ? undefined : editEsDetalle
      });
      if (res.success) {
        setEditNode(undefined);
        await fetchData();
      } else {
        setStatusModal({ show: true, type: 'error', message: res.message });
      }
    } catch(err) { setStatusModal({ show: true, type: 'error', message: 'Error de red' }); }
  };

  const loadHidden = async () => {
    try {
      const res = await getHiddenPuc();
      if (res.success && res.data) setHiddenNodes(res.data);
    } catch (e) { console.error(e); }
  };

  const handleShowHidden = async () => {
    await loadHidden();
    setShowHiddenModal(true);
  };

  const handleRestore = async (codigo: string) => {
    try {
      const res = await restoreCuentaContable(codigo);
      if (res.success) {
        await loadHidden();
        await fetchData();
      } else {
        setStatusModal({ show: true, type: 'error', message: res.message });
      }
    } catch(err) { setStatusModal({ show: true, type: 'error', message: 'Error al restaurar' }); }
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await getPucTree();
      if (response.success && response.data) {
        setTree(JSON.parse(JSON.stringify(response.data)));
      }
    } catch (error) {
      console.error("Error cargando PUC", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, [fetchData]);

  const filteredTree = useMemo(() => {
    if (!searchTerm) return tree;

    const filterNodes = (nodes: PucNodo[]): PucNodo[] =>
      nodes
        .map((node) => ({ ...node }))
        .filter((node) => {
          const match =
            node.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.codigo.includes(searchTerm);

          if (node.hijos?.length) {
            node.hijos = filterNodes(node.hijos);
            return match || node.hijos.length > 0;
          }
          return match;
        });

    return filterNodes(tree);
  }, [tree, searchTerm]);

  const handleOpenModal = (
    padre?: { codigo: string; nombre: string },
    hijos: PucNodo[] = []
  ) => {
    setPadreSeleccionado(padre);
    setHijosDelPadre(hijos.map((h) => h.codigo));
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto relative">
      {/* Loader global */}

      {/* Header */}
      <PageHeader
        title="Plan de Cuentas"
        subtitle="Catálogo institucional de cuentas"
        actions={
          <div className="flex items-center gap-3">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="BUSCAR CUENTA..."
              className="md:w-64"
            />

            <button
              onClick={fetchData}
              className="p-4 bg-white border-2 border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-blue-600 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCcw
                size={20}
              />
            </button>

            <button
              onClick={handleShowHidden}
              title="Cuentas Ocultas"
              className="p-4 bg-white border-2 border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-slate-600 transition-all active:scale-95 disabled:opacity-50"
            >
              <EyeOff size={20} />
            </button>

            <Button
              variant="primary"
              icon={FolderPlus}
              onClick={() => handleOpenModal(undefined, tree)}
            >
              Nueva Clase
            </Button>
          </div>
        }
      />

      {/* Árbol PUC */}
<div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-50 min-h-[600px]">
        {filteredTree.length > 0 ? (
          <div className="max-w-5xl">
            {filteredTree.map((nodo) => (
              <PucItem
                key={nodo.codigo}
                nodo={nodo}
                onAddChild={handleOpenModal}
                onEditNode={startEditNode}
                onDeleteNode={handleDeleteNode}
                forceOpen={!!searchTerm}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-slate-400">
            <p className="font-bold uppercase text-xs tracking-widest">
              No se encontraron resultados
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <FormNuevaCuenta
        isOpen={showModal}
        padre={padreSeleccionado}
        hijosExistentes={hijosDelPadre}
        onClose={() => {
          setShowModal(false);
          setPadreSeleccionado(undefined);
        }}
        onSuccess={fetchData}
      />

      {/* Edit Modal */}
      <Modal isOpen={!!editNode} onClose={() => setEditNode(undefined)} title={`Editar Cuenta: ${editNode?.codigo}`}>
        <form onSubmit={handleUpdateNode} className="space-y-6 min-w-[400px]">
            {editNode?.esGlobal && (
               <div className="bg-amber-50 text-amber-600 p-4 rounded-xl flex gap-3">
                 <Globe size={24} className="shrink-0" />
                 <div>
                   <p className="font-bold uppercase text-xs">Cuenta del Sistema</p>
                   <p className="text-xs mt-1">Solo puedes modificar el nombre.</p>
                 </div>
               </div>
            )}
            <InputField
                label="Nombre de la Cuenta"
                name="editNombre"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                required
            />
            {!editNode?.esGlobal && (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2">
                        Naturaleza
                    </label>
                    <select
                        value={editNaturaleza}
                        onChange={(e) => setEditNaturaleza(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wide focus:border-blue-500 focus:bg-white outline-none transition-all"
                    >
                        <option value="D">Deudora (Débito)</option>
                        <option value="C">Acreedora (Crédito)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl cursor-pointer" onClick={() => setEditEsDetalle(!editEsDetalle)}>
                    <div>
                        <label className="text-sm font-bold text-slate-700 uppercase cursor-pointer pointer-events-none">
                          Cuenta de Detalle
                        </label>
                        <p className="text-xs text-slate-400 font-medium mt-1 pointer-events-none">
                          Recibe movimientos directamente
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        checked={editEsDetalle}
                        onChange={(e) => setEditEsDetalle(e.target.checked)}
                        className="w-6 h-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 bg-white cursor-pointer"
                        title="Es Detalle"
                    />
                  </div>
                </>
            )}
            <div className="flex items-center gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => setEditNode(undefined)}
                    className="flex-1 bg-white border-2 border-slate-100 text-slate-500 font-bold uppercase tracking-widest text-xs py-4 rounded-[1.5rem] hover:bg-slate-50 active:scale-95 transition-all"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-[1.5rem] active:scale-95 transition-all shadow-lg shadow-blue-500/30"
                >
                    Guardar
                </button>
            </div>
        </form>
      </Modal>

      {/* Hidden Puc Modal */}
      <Modal isOpen={showHiddenModal} onClose={() => setShowHiddenModal(false)} title="Cuentas Ocultas">
         <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 min-w-[500px]">
            {hiddenNodes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <EyeOff size={48} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold text-sm text-center uppercase tracking-widest">No hay cuentas ocultas</p>
                </div>
            )}
            {hiddenNodes.map(nodo => (
                <div key={nodo.codigo} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                        <FolderPlus className="text-slate-300" size={18} />
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-slate-700 uppercase">{nodo.nombre}</p>
                           {nodo.esGlobal && <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100"><Globe size={8} className="inline mr-1" />Global</span>}
                       </div>
                       <p className="text-[11px] font-bold text-slate-400 font-mono tracking-widest mt-1">{nodo.codigo}</p>
                     </div>
                   </div>
                   <button onClick={() => handleRestore(nodo.codigo)} className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/30 active:scale-95 opacity-0 group-hover:opacity-100" title="Restaurar cuenta">
                      <Eye size={18} />
                   </button>
                </div>
            ))}
         </div>
      </Modal>

      {/* Global Status Modal */}
      <StatusModal
        show={statusModal.show}
        type={statusModal.type}
        message={statusModal.message}
        onConfirm={statusModal.onConfirm}
        onClose={closeStatusModal}
        confirmText={statusModal.type === 'confirm' ? "Sí, Ocultar" : "Entendido"}
        cancelText="Cancelar"
      />
    </div>
  );
};

export default PucPage;
