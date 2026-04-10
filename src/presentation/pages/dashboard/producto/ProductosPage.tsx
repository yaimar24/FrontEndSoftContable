import { useEffect, useState } from "react";
import { Package, Plus, Layers } from "lucide-react";


import PageHeader from "../../../components/organisms/PageHeader";
import type { ProductoReadDTO } from "../../../../domain/models/Producto";
import { getProductosByColegio } from "../../../../data/services/producto/productoService";
import ProductosList from "./ProductosList";
import ProductosCreatePage from "./ProductosCreatePage";
import { useTutorial } from "../../../../application/context/TutorialContext";

const ProductosPage = () => {
  // Estado para alternar entre la tabla y el formulario
  const [view, setView] = useState<"lista" | "formulario">("lista");
  const { setSteps } = useTutorial();
  
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
      
      setSteps([
        {
          target: '.tuto-header',
          content: 'Este es el módulo de Productos. Administra tu catálogo completo de productos y servicios.',
        },
        {
          target: '.tuto-switch-lista',
          content: 'Consulta el listado completo de productos registrados.',
        },
        {
          target: '.tuto-switch-nuevo',
          content: 'Registra un nuevo producto o servicio en el sistema.',
        },
        {
          target: '.tuto-productos-export',
          content: 'Exporta tu catálogo de productos a Excel o PDF.',
        },
        {
          target: '.tuto-productos-search',
          content: 'Busca productos por nombre o código de referencia.',
        },
        {
          target: '.tuto-productos-table',
          content: 'Tabla de productos con categoría, precio base y botón de edición para modificar cada producto.',
        }
      ]);
    } else {
      setSteps([
        {
          target: '.tuto-producto-sticky-header',
          content: 'Barra fija con botón de guardar. Se mantiene visible mientras te desplazas por el formulario.',
        },
        {
          target: '.tuto-producto-identificacion',
          content: 'Completa los datos básicos: nombre del producto, código de referencia (SKU) y categoría.',
        },
        {
          target: '.tuto-producto-precio',
          content: 'Asigna el precio base del producto.',
        },
        {
          target: '.tuto-producto-cuentas',
          content: 'Asocia las cuentas contables (PUC) de ingreso, costo e inventario para la contabilización automática.',
        },
        {
          target: '.tuto-producto-fiscal',
          content: 'Configura el impuesto (IVA), la retención sugerida y la unidad de medida DIAN.',
        }
      ]);
    }
  }, [view, setSteps]);

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
    <div className="tuto-form-producto min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto">
      <div className="tuto-header">
        <PageHeader
          title="Gestión de Productos"
          subtitle={`${productos.length} Ítems en el catálogo`}
          icon={Package}
          switcher={
            <>
              <button
                onClick={() => setView("lista")}
                className={`tuto-switch-lista flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                  ${
                    view === "lista"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <Layers size={14} />
                Lista de Productos
              </button>

              <button
                onClick={() => {
                  setSelectedProducto(null); // Asegura que sea un registro nuevo
                  setView("formulario");
                }}
                className={`tuto-switch-nuevo flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                  ${
                    view === "formulario" && !selectedProducto
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <Plus size={14} />
                Registrar Producto
              </button>
            </>
          }
        />
      </div>

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
