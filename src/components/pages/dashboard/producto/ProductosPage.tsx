import { useEffect, useState } from "react";
import { Package, Plus, Layers } from "lucide-react";


import PageHeader from "../../../Layout/PageHeader";
import type { ProductoReadDTO } from "../../../../models/Producto";
import { getProductosByColegio } from "../../../../services/producto/productoService";
import ProductosList from "./ProductosList";
import ProductosCreatePage from "./ProductosCreatePage";

const ProductosPage = () => {
  // Estado para alternar entre la tabla y el formulario
  const [view, setView] = useState<"lista" | "formulario">("lista");
  
  // Estado para los datos del catálogo
  const [productos, setProductos] = useState<ProductoReadDTO[]>([]);
  
  // Estado para el producto que se va a editar
  const [selectedProducto, setSelectedProducto] = useState<ProductoReadDTO | null>(null);

  // Función de carga de datos
  const fetchProductos = async () => {
    const response = await getProductosByColegio();
    if (response.success && response.data) {
      setProductos(response.data);
    }
  };

  // Efecto para refrescar la lista al volver de crear/editar
  useEffect(() => {
    if (view === "lista") {
      (async () => {
        await fetchProductos();
      })();
    }
  }, [view]);

  // Manejador para abrir el formulario en modo edición
  const handleEdit = (producto: ProductoReadDTO) => {
    setSelectedProducto(producto);
    setView("formulario");
  };

  // Manejador para cerrar el formulario y limpiar la selección
  const handleBackToList = () => {
    setSelectedProducto(null);
    setView("lista");
  };

  return (
    <div className="p-10 max-w-[1600px] mx-auto">
      <PageHeader
        title="Gestión de Productos"
        subtitle={`${productos.length} Ítems en el catálogo`}
        icon={Package}
        switcher={
          <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm">
            <button
              onClick={() => setView("lista")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition
                ${
                  view === "lista"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
            >
              <Layers size={14} />
              Lista
            </button>

            <button
              onClick={() => {
                setSelectedProducto(null); // Asegura que sea un registro nuevo
                setView("formulario");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition
                ${
                  view === "formulario"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
            >
              <Plus size={14} />
              Registrar
            </button>
          </div>
        }
      />

      <main className="animate-in fade-in slide-in-from-bottom-3 duration-700">
        {view === "lista" ? (
          <ProductosList 
            data={productos} 
            onEdit={handleEdit} 
          />
        ) : (
          <ProductosCreatePage
            initialData={selectedProducto}
            onBack={handleBackToList}
          />
        )}
      </main>
    </div>
  );
};

export default ProductosPage;