import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getPucTree } from "../../../../services/puc/pucService";
import FormNuevaCuenta from "./FormNuevaCuenta";
import PucItem from "./PucItem";
import type { PucNodo } from "../../../../models/puc";
import PageHeader from "../../../Layout/PageHeader";
import SearchBar from "../../../common/SearchBar";
import { FolderPlus, RefreshCcw } from "lucide-react";
import Button from "../../../common/Button";

const PucPage: React.FC = () => {
  const [tree, setTree] = useState<PucNodo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [padreSeleccionado, setPadreSeleccionado] = useState<
    { codigo: string; nombre: string } | undefined
  >(undefined);
  const [hijosDelPadre, setHijosDelPadre] = useState<string[]>([]);

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
    <div className="p-10 max-w-[1600px] mx-auto relative">
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
    </div>
  );
};

export default PucPage;
