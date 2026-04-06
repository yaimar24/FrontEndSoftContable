import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, Banknote } from "lucide-react";
import { getVentaById } from "../../../../services/venta/ventaService";
import { InvoiceTemplate } from "./ListVentas/InvoiceTemplate";
import type { FacturaVentaReadDTO } from "../../../../models/Venta";
import LoadingOverlay from "../../../shared/LoadingOverlay";
import Button from "../../../common/Button";
import { exportInvoiceToPDF } from "../../../../utils/exportInvoicePDF";
import { PaymentModal } from "./ListVentas/PaymentModal";

const VentasViewerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState<FacturaVentaReadDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchFactura = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getVentaById(Number(id));
      if (res.success && res.data) {
        setFactura(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactura();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!factura) return;
    try {
      const token = localStorage.getItem('token');
      await exportInvoiceToPDF(factura, token);
    } catch (error) {
      console.error("Error generando PDF", error);
    }
  };

  if (loading) return <LoadingOverlay message="Cargando documento..." />;

  if (!factura) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-black text-slate-800 mb-4">No se encontro la factura</h2>
        <Button onClick={() => navigate('/dashboard/ventas')} variant="primary">Volver a Ventas</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header bar (no printable) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm print:hidden sticky top-0 z-50">
        <Button variant="outline" onClick={() => navigate('/dashboard/ventas')} icon={ArrowLeft}>
          Volver
        </Button>
        <h1 className="text-sm font-black text-slate-700 uppercase tracking-widest hidden md:block">
          Factura #{factura.numero}
        </h1>
        <div className="flex items-center gap-3">
          {(factura.estadoId === 2 || factura.estadoId === 3 || factura.estadoId === 6) && factura.saldo > 0 && (
            <Button
              variant="secondary"
              icon={Banknote}
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border-emerald-100 shadow-none hidden sm:flex"
            >
              Registrar Pago
            </Button>
          )}
          <Button variant="outline" onClick={handleDownloadPDF} icon={Download}>
            PDF
          </Button>
          <Button variant="primary" onClick={handlePrint} icon={Printer}>       
            Imprimir
          </Button>
        </div>
      </div>

      {isPaymentModalOpen && (
          <PaymentModal
             isOpen={isPaymentModalOpen}
             onClose={() => setIsPaymentModalOpen(false)}
             factura={factura}
             onSuccess={fetchFactura}
          />
      )}

      {/* Main Print Area */}
      <div className="flex-1 overflow-auto p-8 print:p-0 flex justify-center custom-scrollbar">
        <div
          ref={printRef}
          className="bg-white shadow-xl print:shadow-none min-h-[1056px] w-[816px] origin-top"
        >
          <InvoiceTemplate factura={factura} />
        </div>
      </div>
    </div>
  );
};

export default VentasViewerPage;
