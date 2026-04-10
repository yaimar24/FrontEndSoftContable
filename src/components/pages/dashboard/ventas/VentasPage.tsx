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
import { useTutorial } from "../../../../context/TutorialContext";

const VentasPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'lista' | 'formulario'>('lista');
  const [ventas, setVentas] = useState<FacturaVentaReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<FacturaVentaReadDTO | null>(null);
  const { setSteps } = useTutorial();

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const response = await getVentasByColegio();
      if (response.success && response.data) setVentas(response.data);        
    } finally { setLoading(false); }
  };

  useEffect(() => { 
    if (view === 'lista') {
      fetchVentas();
      setSteps([
        {
          target: '.tuto-ventas-header',
          content: 'Este es el módulo de Ventas, donde puedes controlar todas las facturas de venta emitidas.',

        },
        {
          target: '.tuto-ventas-lista',
          content: 'Presiona aquí para ver el historial completo de ventas realizadas.',
        },
        {
          target: '.tuto-ventas-nueva',
          content: 'Crea una nueva factura de venta para un cliente desde este botón.',
        },
        {
          target: '.tuto-ventas-export',
          content: 'Exporta la lista de facturas a Excel o PDF para tus reportes.',
        },
        {
          target: '.tuto-ventas-search',
          content: 'Busca facturas por número o nombre del cliente rápidamente.',
        },
        {
          target: '.tuto-ventas-table',
          content: 'Aquí verás las facturas de venta. Cada fila tiene botones de acción: vista previa del PDF y ver detalles completos.',
        }
      ]);
    } else {
      setSteps([
        {
          target: '.tuto-ventas-sticky-header',
          content: 'Esta barra muestra el total estimado de la factura y el botón para guardar. Se mantiene visible mientras te desplazas.',

        },
        {
          target: '.tuto-ventas-encabezado',
          content: 'Completa los datos de encabezado: selecciona el cliente, la fecha y verifica el número de factura.',
        },
        {
          target: '.tuto-ventas-detalle',
          content: 'Agrega los productos que vas a vender. Puedes buscar productos, ajustar cantidades, precios y descuentos por línea.',
        },
        {
          target: '.tuto-ventas-pagos',
          content: 'Configura la condición de pago (contado, crédito o parcial) y selecciona el medio de pago (efectivo, banco, etc.).',
        }
      ]);
    }
  }, [view, setSteps]);

  const handleBackToList = () => {
    setView('lista');
  };

  return (
    <div className="tuto-ventas-form min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto">
      {loading && <LoadingOverlay message="Sincronizando Facturas..." />}

      <div className="tuto-ventas-header">
        <PageHeader
          title="Gestión de Ventas"
          subtitle={view === 'lista' && !loading ? `${ventas.length} Facturas registradas` : undefined}
          icon={Receipt}
          switcher={
            <>
              <button
                onClick={handleBackToList}
                className={`tuto-ventas-lista flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                  ${view === 'lista' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <FileText size={14} /> Historial de Ventas
              </button>
              <button
                onClick={() => { setView('formulario'); }}
                className={`tuto-ventas-nueva flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                  ${view === 'formulario' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}       
              >
                <FilePlus size={14} /> Nueva Venta
              </button>
            </>
          }
        />
      </div>

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
