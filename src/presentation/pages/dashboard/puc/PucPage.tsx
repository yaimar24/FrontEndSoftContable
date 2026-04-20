import React, { useState, useEffect, useCallback, useRef } from "react";
import { getPucTree, searchPuc, getPucChildren } from "../../../../data/services/puc/pucService";
import FormNuevaCuenta from "./FormNuevaCuenta";
import PucItem from "./PucItem";
import type { PucNodo } from "../../../../domain/models/Puc";
import type { PucSearchResult } from "../../../../domain/models/Puc";
import PageHeader from "../../../components/organisms/PageHeader";
import SearchBar from "../../../components/molecules/SearchBar";
import { FolderPlus, RefreshCcw, EyeOff, Globe, Eye, BookOpen, Loader2, Search, FileText } from "lucide-react";
import { hideCuentaContable, restoreCuentaContable, updateCuentaContable, getHiddenPuc } from "../../../../data/services/puc/pucService";
import Modal from "../../../components/organisms/Modal";
import StatusModal from "../../../components/organisms/StatusModal";
import InputField from "../../../components/atoms/InputField";
import Button from "../../../components/atoms/Button";
import { useTutorial } from "../../../../application/context/TutorialContext";

const PucPage: React.FC = () => {
  const [tree, setTree] = useState<PucNodo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [padreSeleccionado, setPadreSeleccionado] = useState<
    { codigo: string; nombre: string } | undefined
  >(undefined);
  const [hijosDelPadre, setHijosDelPadre] = useState<string[]>([]);

  // Search state
  const [searchResults, setSearchResults] = useState<PucSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Highlight & expand state
  const [highlightCodigo, setHighlightCodigo] = useState<string | undefined>(undefined);
  const [expandCodigos, setExpandCodigos] = useState<Set<string>>(new Set());

  // Edit state
  const [editNode, setEditNode] = useState<PucNodo | undefined>(undefined);
  const [editNombre, setEditNombre] = useState("");
  const [editNaturaleza, setEditNaturaleza] = useState("D");
  const [editEsDetalle, setEditEsDetalle] = useState(false);

  // Hidden state
  const [showHiddenModal, setShowHiddenModal] = useState(false);
  const [hiddenNodes, setHiddenNodes] = useState<PucNodo[]>([]);

  const { setSteps } = useTutorial();

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
    setSteps([
      {
        target: '.tuto-puc-header',
        content: 'Este es el módulo del Plan Único de Cuentas (PUC). Desde aquí puedes ver, buscar y administrar toda la estructura contable de tu institución.',
      },
      {
        target: '.tuto-puc-search',
        content: 'Usa esta barra para buscar cuentas por código o nombre rápidamente.',
      },
      {
        target: '.tuto-puc-refresh',
        content: 'Recarga la información del plan de cuentas desde el servidor.',
      },
      {
        target: '.tuto-puc-hidden',
        content: 'Accede a las cuentas ocultas y restaura las que necesites.',
      },
      {
        target: '.tuto-puc-new',
        content: 'Crea una nueva clase contable de primer nivel para tu plan de cuentas.',
      },
      {
        target: '.tuto-puc-tree',
        content: 'Este es el árbol de cuentas. Haz clic en cada cuenta para expandirla y ver sus cuentas hijas. Cada cuenta tiene opciones para crear subcuentas, editar o ocultar.',
      }
    ]);
  }, [fetchData, setSteps]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setHighlightCodigo(undefined);
    setExpandCodigos(new Set());

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await searchPuc(value.trim());
        if (res.success && res.data) {
          setSearchResults(res.data);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Navigate to a search result in the tree
  const handleSelectSearchResult = async (result: PucSearchResult) => {
    setShowSearchResults(false);
    setSearchTerm("");
    setSearchResults([]);

    // Expand ancestors sequentially to load the path
    const codigos = new Set<string>();
    for (const ancestorCodigo of result.rutaAncestros) {
      codigos.add(ancestorCodigo);
    }
    
    // Reload tree to ensure root is fresh, then set expand codes
    await fetchData();
    setExpandCodigos(new Set(codigos));
    setHighlightCodigo(result.codigo);

    // Clear highlight after 3 seconds
    setTimeout(() => setHighlightCodigo(undefined), 3000);
  };

  const handleOpenModal = (
    padre?: { codigo: string; nombre: string },
    hijos: PucNodo[] = []
  ) => {
    setPadreSeleccionado(padre);
    setHijosDelPadre(hijos.map((h) => h.codigo));
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto relative">
      {/* Loader global */}

      {/* Header */}
            <div className="tuto-puc-header">
        <PageHeader
          title="Plan de Cuentas"
          subtitle="Catálogo institucional de cuentas"
          icon={BookOpen}
          actions={
            <div className="flex items-center gap-3">
              <div className="tuto-puc-search">
                <SearchBar
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="BUSCAR CUENTA..."
                  className="md:w-64"
                />
              </div>

              <button
                onClick={fetchData}
                className="tuto-puc-refresh p-4 bg-white border-2 border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-blue-600 transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCcw
                  size={20}
                />
              </button>

              <button
                onClick={handleShowHidden}
                title="Cuentas Ocultas"
                className="tuto-puc-hidden p-4 bg-white border-2 border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-slate-600 transition-all active:scale-95 disabled:opacity-50"
              >
                <EyeOff size={20} />
              </button>

              <div className="tuto-puc-new">
                <Button
                  variant="primary"
                  icon={FolderPlus}
                  onClick={() => handleOpenModal(undefined, tree)}
                >
                  Nueva Clase
                </Button>
              </div>
            </div>
          }
        />
      </div>

      {/* Árbol PUC */}
<div className="tuto-puc-tree bg-white rounded-2xl p-6 shadow-2xl shadow-slate-200/50 border border-slate-50 min-h-[600px]">
        {showSearchResults ? (
          // Search results panel
          <div className="max-w-5xl">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 size={32} className="animate-spin text-blue-500 mb-4" />
                <p className="font-bold uppercase text-xs tracking-widest">Buscando...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">
                  {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
                </p>
                {searchResults.map((result) => (
                  <button
                    key={result.codigo}
                    onClick={() => handleSelectSearchResult(result)}
                    className="w-full flex items-center gap-4 py-3 px-4 rounded-2xl hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className={result.esDetalle ? "text-blue-500" : "text-amber-500"}>
                      {result.esDetalle ? <FileText size={18} /> : <Search size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{result.codigo}</span>
                        <span className="text-[9px] text-slate-300">Nivel {result.nivel}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700 uppercase">{result.nombre}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {result.rutaAncestros.join(' → ')} → {result.codigo}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 text-slate-400">
                <Search size={48} className="text-slate-200 mb-4" />
                <p className="font-bold uppercase text-xs tracking-widest">Sin resultados</p>
                <p className="text-xs mt-2 text-slate-300">Intenta con otro término de búsqueda</p>
              </div>
            )}
          </div>
        ) : tree.length > 0 ? (
          <div className="max-w-5xl">
            {tree.map((nodo) => (
              <PucItem
                key={nodo.codigo}
                nodo={nodo}
                onAddChild={handleOpenModal}
                onEditNode={startEditNode}
                onDeleteNode={handleDeleteNode}
                highlightCodigo={highlightCodigo}
                expandCodigos={expandCodigos}
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
        <form onSubmit={handleUpdateNode} className="space-y-4 min-w-[400px]">
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
