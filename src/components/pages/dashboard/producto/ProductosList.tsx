import { Edit3, Tag, Box } from "lucide-react";
import { ExportButtons } from "../../../common/ExportButtons";
import SearchBar from "../../../common/SearchBar";
import { Table } from "../../../common/Table";
import type { ProductoReadDTO } from "../../../../models/Producto";
import { useFilter } from "../../../../hooks/useGenericFilter";
import { 
  exportToExcel, 
  exportToPDF, 
  type ExportConfig 
} from "../../../../utils/exportUtils";

interface Props {
  data: ProductoReadDTO[];
  onEdit: (p: ProductoReadDTO) => void;
}

const ProductosList: React.FC<Props> = ({ data = [], onEdit }) => {
  const { searchTerm, setSearchTerm, filteredData } = useFilter(data || [], {
    searchFields: ["nombre", "sku"],
    customFilters: {
      categoria: (item, value) => {
        if (value === "all") return true;
        return item.categoriaProductoId === Number(value);
      },
    },
  });

  // --- CONFIGURACIÓN DE EXPORTACIÓN (Igual que en Terceros) ---
  const exportConfig: ExportConfig<ProductoReadDTO> = {
    filename: `Reporte_Productos`,
    data: filteredData,
    columns: [
      { header: "NOMBRE PRODUCTO", dataKey: "nombre" },
      { header: "Código  De referencia", dataKey: (p) => p.sku || "N/A" },
      { header: "CATEGORÍA", dataKey: "categoriaNombre" },
      { 
        header: "PRECIO BASE", 
        dataKey: (p) => p.precios[0]?.valor ? `$${p.precios[0].valor.toLocaleString()}` : "$0" 
      },
      { header: "TIPO", dataKey: (p) => (p.esServicio ? "SERVICIO" : "PRODUCTO") },
      { header: "IVA", dataKey: (p) => p.impuestoCargoNombre || "EXENTO" },
    ],
  };

  const columns = [
    {
      header: "Producto / Código de referencia",
      className: "min-w-[280px]",
      render: (p: ProductoReadDTO) => (
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${p.esServicio ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
            {p.esServicio ? <Tag size={18} /> : <Box size={18} />}
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase text-[11px] text-slate-800">{p.nombre}</span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Código  De referencia: {p.sku || '---'}</span>
          </div>
        </div>
      )
    },
    {
      header: "Categoría",
      render: (p: ProductoReadDTO) => (
        <span className="px-3 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-[9px] font-black uppercase">
          {p.categoriaNombre}
        </span>
      )
    },
    {
      header: "Precio Base",
      render: (p: ProductoReadDTO) => (
        <span className="font-bold text-slate-700">${p.precios[0]?.valor.toLocaleString()}</span>
      )
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (p: ProductoReadDTO) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => onEdit(p)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
            <Edit3 size={15} strokeWidth={2.5} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Espacio para FilterGroup si lo necesitas, igual que en Terceros */}
        <div className="flex-1" /> 
        
        <ExportButtons
          onExportExcel={() => exportToExcel(exportConfig)}
          onExportPDF={() => exportToPDF(exportConfig)}
        />
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre o código  De referencia" />

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <Table columns={columns} data={filteredData} />
      </div>
    </div>
  );
};

export default ProductosList;