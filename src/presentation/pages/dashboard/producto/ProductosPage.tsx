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

  // Estado para los datos del catA�logo
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [productosInfo, setProductosInfo] = useState<any>(null); const [productos, setProductos] = useState<ProductoReadDTO[]>([]);

  // Estado para el producto que se va a editar
  const [selectedProducto, setSelectedProducto] = useState<ProductoReadDTO | null>(null);

  // FunciA3n de carga de datos
  const fetchProductos = async () => {
    try {
      const response = await getProductosByColegio(page, pageSize, searchTerm); 
      if (response.success && response.data) {
        setProductosInfo(response.data); setProductos((response.data as any).items || []);
      }
    } catch (e) {
      console.error(e);
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
          content: 'Este es el mA3dulo de Productos. Administra tu catA�logo completo de productos y servicios.',
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
          content: 'Exporta tu catA�logo de productos a Excel o PDF.',
        },
        {
          target: '.tuto-productos-search',
          content: 'Busca productos por nombre o cA3digo de referencia.',       
        },
        {
          target: '.tuto-productos-table',
          content: 'Tabla de productos con categorA-a, precio base y botA3n de ediciA3n para modificar cada producto.',
        }
      ]);
    } else {
      setSteps([
        {
          target: '.tuto-producto-sticky-header',
          content: 'Barra fija con botA3n de guardar. Se mantiene visible mientras te desplazas por el formulario.',
        },
        {
          target: '.tuto-producto-identificacion',
          content: 'Completa los datos bA�sicos: nombre del producto, cA3digo de referencia (SKU) y categorA-a.',
        },
        {
          target: '.tuto-producto-precio',
          content: 'Asigna el precio base del producto.',
        },
        {
          target: '.tuto-producto-cuentas',
          content: 'Asocia las cuentas contables (PUC) de ingreso, costo e inventario para la contabilizaciA3n automA�tica.',
        },
        {
          target: '.tuto-producto-fiscal',
          content: 'Configura el impuesto (IVA), la retenciA3n sugerida y la unidad de medida DIAN.',
        }
      ]);
    }
  }, [view, page, pageSize, searchTerm]);

  // Manejador para abrir el formulario en modo ediciA3n
  const handleEdit = (producto: ProductoReadDTO) => {
    setSelectedProducto(producto);
    setView("formulario");
  };

  // Manejador para cerrar el formulario y limpiar la selecciA3n
  const handleBackToList = () => {
    setSelectedProducto(null);
    setView("lista");
  };

  return (
    <div className="tuto-form-producto min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto">
      <div className="tuto-header">
        <PageHeader
          title="Gestion de Productos"
          subtitle={`${productos.length} A-tems en el catA�logo`}
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
            isServer={!!productosInfo}
            paginationProps={productosInfo ? {
              ...productosInfo,
              onPageChange: setPage,
              onPageSizeChange: (s: number) => { setPageSize(s); setPage(1); }  
            } : undefined}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
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
