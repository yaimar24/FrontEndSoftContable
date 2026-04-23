import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import { getNotasByColegio } from "../../../../data/services/notaCreditoDebito/notaCreditoDebitoService";
import type { NotaCreditoDebitoReadDTO } from "../../../../domain/models/NotaCreditoDebito";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import PageHeader from "../../../components/organisms/PageHeader";
import { Table } from "../../../components/organisms/Table";
import type { Column } from "../../../components/organisms/Table";
import SearchBar from "../../../components/molecules/SearchBar";
import { formatCurrencyDecimals as formatCurrency, formatDateShort } from "../../../../utils/formatters";
import { getNotaEstadoInfo } from "../../../../utils/statusHelpers";

const NotasPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notas, setNotas] = useState<NotaCreditoDebitoReadDTO[]>([]);
  const [notasInfo, setNotasInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNotas = async () => {
    try {
      setLoading(true);
      const response = await getNotasByColegio(page, pageSize);
      if (response.success && response.data) {
        setNotasInfo(response.data);
        setNotas((response.data as any).items || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, [page, pageSize]);

  const filtered = searchTerm
    ? notas.filter(
        (n) =>
          n.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.terceroNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.tipoNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.facturaNumero?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : notas;

  const columns: Column<NotaCreditoDebitoReadDTO>[] = [
    {
      header: "Número",
      render: (row) => (
        <span className="flex items-center gap-2 font-bold text-slate-800">
          <FileText size={14} className="text-blue-400" />
          {row.numero}
        </span>
      ),
    },
    {
      header: "Tipo",
      render: (row) => (
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
            row.tipoId === 1
              ? "bg-blue-50 text-blue-600"
              : "bg-orange-50 text-orange-600"
          }`}
        >
          {row.tipoNombre}
        </span>
      ),
    },
    {
      header: "Factura",
      render: (row) => (
        <span className="text-sm text-slate-600">{row.facturaNumero}</span>
      ),
    },
    {
      header: "Tercero",
      render: (row) => (
        <span className="text-sm text-slate-700 font-medium truncate max-w-45 block">
          {row.terceroNombre}
        </span>
      ),
    },
    {
      header: "Motivo",
      render: (row) => (
        <span className="text-sm text-slate-600">{row.motivoNombre}</span>
      ),
    },
    {
      header: "Total Neto",
      render: (row) => (
        <span className="text-sm font-bold text-slate-800">
          {formatCurrency(row.totalNeto)}
        </span>
      ),
    },
    {
      header: "Fecha",
      render: (row) => (
        <span className="text-sm text-slate-600">
          {formatDateShort(row.fechaElaboracion)}
        </span>
      ),
    },
    {
      header: "Estado",
      render: (row) => {
        const { label, color } = getNotaEstadoInfo(row.estadoNombre);
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${color}`}>
            {label}
          </span>
        );
      },
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/dashboard/notas/${row.id}`)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
            title="Ver detalle"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-5 max-w-400 mx-auto">
      {loading && (
        <LoadingOverlay message="Cargando notas..." />
      )}

      <PageHeader
        title="Notas Crédito / Débito"
        subtitle={!loading ? `${notas.length} Notas registradas` : undefined}
        icon={FileText}
      />

      <div className="flex items-center gap-4 mb-2">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por número, tercero, factura..."
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
        isServer
        serverPagination={{
          page,
          pageSize,
          totalCount: notasInfo?.totalCount || 0,
          totalPages: notasInfo?.totalPages || 1,
          hasNextPage: notasInfo?.hasNextPage || false,
          hasPreviousPage: notasInfo?.hasPreviousPage || false,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  );
};

export default NotasPage;
