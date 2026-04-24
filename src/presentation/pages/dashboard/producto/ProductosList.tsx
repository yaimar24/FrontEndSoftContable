import React, { useState, useEffect } from 'react';
import { Edit3, Tag, Box } from "lucide-react";
import { ExportButtons } from "../../../components/molecules/ExportButtons";
import SearchBar from "../../../components/molecules/SearchBar";
import { Table } from "../../../components/organisms/Table";
import type { ProductoReadDTO } from "../../../../domain/models/Producto";
import { useFilter } from "../../../../application/hooks/useGenericFilter";
import { formatCurrency } from '../../../../utils/formatters';
import { 
  exportToExcel, 
  exportToPDF, 
  type ExportConfig 
} from "../../../../utils/exportUtils";

interface Props {
  data: ProductoReadDTO[];
  onEdit: (p: ProductoReadDTO) => void;
  isServer?: boolean;
  paginationProps?: any;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const ProductosList: React.FC<Props> = ({  data = [], onEdit , isServer, paginationProps, searchTerm: externalSearchTerm, onSearchChange }) => {
  const [localData, setLocalData] = useState<ProductoReadDTO[]>(Array.isArray(data) ? data : []);

  useEffect(() => {
    if (data && (data as any).items) {
      setLocalData((data as any).items);
    } else if (Array.isArray(data)) {
      setLocalData(data);
    }
  }, [data]);

  const { searchTerm: internalSearchTerm, setSearchTerm: internalSetSearchTerm, filteredData } = useFilter(localData || [], {
    searchFields: ["nombre", "sku"],
    customFilters: {
      categoria: (item, value) => {
        if (value === "all") return true;
        return item.categoriaProductoId === Number(value);
      },
    },
  });
  
  const searchTerm = isServer ? (externalSearchTerm ?? internalSearchTerm) : internalSearchTerm;
  const setSearchTerm = isServer ? (onSearchChange ?? internalSetSearchTerm) : internalSetSearchTerm;

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
        dataKey: (p) => p.precios[0]?.valor ? formatCurrency(p.precios[0].valor) : "$0" 
      },
      { header: "TIPO", dataKey: (p) => (p.esServicio ? "SERVICIO" : "PRODUCTO") },
      { header: "IVA", dataKey: (p) => p.impuestoCargoNombre || "EXENTO" },
      { header: "CTA INGRESO", dataKey: (p) => p.cuentaIngresoCodigo ? `${p.cuentaIngresoCodigo} - ${p.cuentaIngresoNombre || ''}` : "N/A" },
      { header: "CTA COSTO", dataKey: (p) => p.cuentaCostoCodigo ? `${p.cuentaCostoCodigo} - ${p.cuentaCostoNombre || ''}` : "N/A" },
      { header: "CTA INVENTARIO", dataKey: (p) => p.cuentaInventarioCodigo ? `${p.cuentaInventarioCodigo} - ${p.cuentaInventarioNombre || ''}` : "N/A" },
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
        <span className="font-bold text-slate-700">{formatCurrency(p.precios[0]?.valor)}</span>
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
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="tuto-productos-search w-full lg:w-1/3">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre o código de referencia" />
        </div>

        <div className="tuto-productos-export w-full sm:w-auto self-end">
          <ExportButtons
            onExportExcel={() => exportToExcel(exportConfig)}
            onExportPDF={() => exportToPDF(exportConfig)}
          />
        </div>
      </div>

      <div className="tuto-productos-table bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <Table columns={columns} 
          data={filteredData}
          isServer={isServer}
          serverPagination={paginationProps}
       />
      </div>
    </div>
  );
};

export default ProductosList;
