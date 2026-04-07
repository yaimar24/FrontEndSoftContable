import { useEffect, useState } from "react";
import VentasList from "./ListVentas/VentasList";
import VentasCreatePage from "./CreateVentas/VentasCreatePage";
import { getVentasByColegio } from "../../../../services/venta/ventaService";
import { FileText, FilePlus, Receipt } from "lucide-react";
import LoadingOverlay from "../../../shared/LoadingOverlay";
import type { FacturaVentaReadDTO } from "../../../../models/Venta";
import { DocumentViewerModal } from "../../../common/DocumentViewerModal";
import { InvoiceTemplate } from "./ListVentas/InvoiceTemplate";
import PageHeader from "../../../Layout/PageHeader";
import { useNavigate } from 'react-router-dom';

const VentasPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'lista' | 'formulario'>('lista');
  const [ventas, setVentas] = useState<FacturaVentaReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<FacturaVentaReadDTO | null>(null);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const response = await getVentasByColegio();
      if (response.success && response.data) setVentas(response.data);        
    } finally { setLoading(false); }
  };

  useEffect(() => { if (view === 'lista') fetchVentas(); }, [view]);

  const handleBackToList = () => {
    setView('lista');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {loading && <LoadingOverlay message="Sincronizando Facturas..." />}

      <PageHeader
        title="Gestión de Ventas"
        subtitle={view === 'lista' && !loading ? `${ventas.length} Facturas registradas` : undefined}
        icon={Receipt}
        switcher={
          <>
            <button
              onClick={handleBackToList}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                ${view === 'lista' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <FileText size={14} /> Historial de Ventas
            </button>
            <button
              onClick={() => { setView('formulario'); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                ${view === 'formulario' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}       
            >
              <FilePlus size={14} /> Nueva Venta
            </button>
          </>
        }
      />

      <main className="animate-in fade-in slide-in-from-bottom-3 duration-700"> 
        {view === 'lista' ? (
          <VentasList data={ventas} onPreview={(v) => setSelectedInvoice(v)} onDetails={(id) => navigate(`/dashboard/ventas/${id}`)} />
        ) : (
          <VentasCreatePage onBack={handleBackToList} />
        )}
            </main>

      <DocumentViewerModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Vista Previa Factura N° ${selectedInvoice?.numero || ''}`}
        onOpenNewTab={() => {
          if (selectedInvoice) {
            window.open(`/invoice/${selectedInvoice.id}`, '_blank');
          }
        }}
      >
        <InvoiceTemplate factura={selectedInvoice} />
      </DocumentViewerModal>
    </div>
  );
};
export default VentasPage;
