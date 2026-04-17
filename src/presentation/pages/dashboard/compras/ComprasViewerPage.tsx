import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button';
import LoadingOverlay from '../../../components/shared/LoadingOverlay';
import { getCompraById, registrarFacturaCompra, anularFacturaCompra } from '../../../../data/services/compra/compraService';
import type { FacturaCompraReadDTO } from '../../../../domain/models/FacturaCompra';
import StatusModal from '../../../components/organisms/StatusModal';
import { CompraInvoiceTemplate } from './CompraInvoiceTemplate';
import { exportInvoiceToPDF } from '../../../../utils/exportInvoicePDF';
import { AsientosContablesSection } from '../../../components/organisms/AsientosContablesSection';
import { PaymentEgresoModal } from './pagos/PaymentEgresoModal';
import { FileText, Banknote, ShoppingCart, CheckCircle, XCircle, Edit2, Download, ArrowLeft, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComprasViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [compra, setCompra] = useState<FacturaCompraReadDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{show: boolean, action: 'registrar' | 'anular' | null}>({show: false, action: null});
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCompra(Number(id));
    }
  }, [id]);

  const fetchCompra = async (compraId: number) => {
    try {
      setLoading(true);
      const res = await getCompraById(compraId);
      if (res.success && res.data) {
        setCompra(res.data);
      } else {
        setError(res.message || 'Error al cargar la compra');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!id || !confirmModal.action) return;
    setLoading(true);
    setConfirmModal({ show: false, action: null });
    
    try {
      const res = confirmModal.action === 'registrar' 
        ? await registrarFacturaCompra(Number(id))
        : await anularFacturaCompra(Number(id));
        
      if (res.success) {
        setResultModal({ show: true, success: true, message: `Factura ${confirmModal.action === 'registrar' ? 'registrada' : 'anulada'} exitosamente.` });
        fetchCompra(Number(id));
      } else {
        setResultModal({ show: true, success: false, message: res.message || `Error al ${confirmModal.action} la factura.` });
      }
    } catch (err: any) {
      setResultModal({ show: true, success: false, message: err.message || 'Error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!compra) return;
    try {
      const token = localStorage.getItem('token');
      await exportInvoiceToPDF(compra, token);
    } catch (error) {
      console.error("Error generando PDF", error);
    }
  };

  if (loading) return <LoadingOverlay message="Cargando compra..." />;
  
  if (error || !compra) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-black text-slate-800 mb-4">{error || 'Factura no encontrada'}</h2>
        <Button onClick={() => navigate('/dashboard/factura-compra')} variant="primary">Volver a Compras</Button>
      </div>
    );
  }

  // Determine Badge Colors
  let badgeColor = "bg-slate-100 text-slate-600";
  if (compra.estadoId === 0) badgeColor = "bg-blue-100 text-blue-600"; // Borrador
  if (compra.estadoId === 1) badgeColor = "bg-emerald-100 text-emerald-600"; // Registrada
  if (compra.estadoId === 2) badgeColor = "bg-red-100 text-red-600"; // Anulada
  if (compra.estadoId === 5 || compra.estadoNombre === 'Pagada') badgeColor = "bg-teal-100 text-teal-600"; // Pagada

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '$ 0';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <StatusModal
        show={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, action: null })}
        type="confirm"
        message={`¿Estás seguro de ${confirmModal.action} esta factura de compra?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmAction}
      />

      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => setResultModal({ ...resultModal, show: false })}
      />

      <PaymentEgresoModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        factura={compra}
        onSuccess={() => {
          setIsPaymentModalOpen(false);
          if (id) fetchCompra(Number(id));
        }}
      />

      {/* Header bar (no printable) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard/factura-compra')} icon={ArrowLeft}>
            Volver
          </Button>
          <div className="hidden sm:flex items-center gap-3">
             <h1 className="text-xl font-black text-slate-800 tracking-tight">Compra #{compra.numero}</h1>
             <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
               {compra.estadoNombre}
             </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {[1, 3, 4].includes(compra.estadoId) && (compra.saldo ?? compra.totalNeto) > 0 && (
            <Button
              variant="secondary"
              icon={Banknote}
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border-emerald-100 shadow-none"
            >
              Registrar Pago
            </Button>
          )}
          {compra.estadoId === 0 && (
            <>
              <Button variant="outline" onClick={() => navigate(`/dashboard/factura-compra?view=formulario&id=${compra.id}`)} icon={Edit2}>
                Editar
              </Button>
              <Button variant="success" onClick={() => setConfirmModal({ show: true, action: 'registrar' })} icon={CheckCircle}>
                Registrar
              </Button>
              <Button variant="danger" onClick={() => setConfirmModal({ show: true, action: 'anular' })} icon={XCircle}>
                Anular
              </Button>
            </>
          )}
          {compra.estadoId === 1 && (
            <Button variant="danger" onClick={() => setConfirmModal({ show: true, action: 'anular' })} icon={XCircle}>
              Anular
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

      {/* Main Content Area (Printable Dashboard View) */}
      <div className="max-w-6xl mx-auto mt-8 px-4 print:mt-0 print:px-0 space-y-4">
         
         {/* Alerta de Anulación / Reverso */}
         {compra.estadoId === 2 && compra.egresos?.some((e: any) => e.estado === 'Aprobado' || e.estadoNombre === 'Aprobado') && (
           <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-sm flex items-start gap-4">
             <span className="text-amber-500 text-2xl">⚠️</span>
             <div>
               <h3 className="text-amber-800 font-black text-sm uppercase tracking-widest">Factura de Compra Anulada</h3>
               <p className="text-amber-700 text-xs font-medium mt-1">
                 Esta factura ha sido anulada. Se ha generado un registro de <b>ajuste o reverso automático</b> en la contabilidad para neutralizar los valores previamente asentados. Revisa la sección de asientos contables para ver los detalles del reverso.
               </p>
             </div>
           </div>
         )}
         
         {/* Encabezado */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Proveedor</p>
               <p className="text-base font-black text-slate-800">{compra.proveedorNombre}</p>
               <p className="text-sm text-slate-500 font-medium">Dir: {compra.proveedorDireccion || 'N/A'}</p>
               <p className="text-sm text-slate-500 font-medium">Tel: {compra.proveedorTelefono || 'N/A'}</p>
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Colegio</p>
               <p className="text-sm font-bold text-slate-700">{compra.colegioNombre}</p>
               <p className="text-sm text-slate-500 font-medium">NIT: {compra.colegioNit || 'N/A'}</p>
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha Elaboración</p>
               <p className="text-sm font-bold text-slate-700">{new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(compra.fechaElaboracion))}</p>
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Medio de Pago</p>
               <p className="text-sm font-bold text-slate-700 text-indigo-600">{compra.medioPagoId} - {compra.medioPagoNombre || 'N/A'}</p>
            </div>
         </div>

         {/* Grid de Tablas: Productos */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Left Column: Productos (Colspan 2) */}
            <div className="lg:col-span-2 space-y-4">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                     <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingCart size={18} className="text-indigo-500" />
                        Detalle de Ítems
                     </h3>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                           <tr>
                              <th className="px-6 py-3">Ítem / Descripción</th>
                              <th className="px-6 py-3">Cuenta Contable</th>
                              <th className="px-6 py-3 text-center">Cant</th>
                              <th className="px-6 py-3 text-right">V. Unitario</th>
                              <th className="px-6 py-3 text-right">Subtotal</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-medium">
                           {compra.detalles?.map(det => (
                              <tr key={det.id} className="hover:bg-slate-50">
                                 <td className="px-6 py-4 text-slate-800">
                                   <p className="font-bold">{det.tipoItemNombre}</p>
                                   <p className="text-xs text-slate-500">{det.descripcion || det.productoNombre}</p>
                                 </td>
                                 <td className="px-6 py-4 text-slate-600 text-xs whitespace-nowrap">
                                   {det.cuentaContableCodigo ? `${det.cuentaContableCodigo} - ${det.cuentaContableNombre || ''}` : '—'}
                                 </td>
                                 <td className="px-6 py-4 text-center text-slate-600">{det.cantidad}</td>
                                 <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(det.valorUnitario)}</td>
                                 <td className="px-6 py-4 text-right text-slate-800 font-bold">{formatCurrency(det.valorTotal)}</td>
                              </tr>
                           ))}
                           {(!compra.detalles || compra.detalles.length === 0) && (
                              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No hay detalles.</td></tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Tabla de Egresos Vinculados */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                     <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <Banknote size={18} className="text-emerald-500" />
                        Comprobantes de Egreso Vinculados
                     </h3>
                  </div>
                  
                  {/* Progress Bar Pagos */}
                  {(() => {
                     const totalNeto = compra.totalNeto;
                     const totalPagado = totalNeto - (compra.saldo ?? totalNeto);
                     const porcentaje = totalNeto > 0 ? ((totalPagado / totalNeto) * 100).toFixed(1) : "0.0";
                     return (
                        <div className="px-6 py-4 bg-white border-b border-slate-100">
                           <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                              <span>Progreso de Pagos</span>
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                 Total Pagado: {formatCurrency(totalPagado)} / {formatCurrency(totalNeto)} ({porcentaje}%)
                              </span>
                           </div>
                           <div className="w-full bg-slate-100 rounded-full h-2.5">
                              <div 
                                 className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                                 style={{ width: `${Math.min(Number(porcentaje), 100)}%` }}
                              ></div>
                           </div>
                        </div>
                     );
                  })()}

                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                           <tr>
                              <th className="px-6 py-3">Egreso</th>
                              <th className="px-6 py-3">Fecha</th>
                              <th className="px-6 py-3">Medio</th>
                              <th className="px-6 py-3">Estado</th>
                              <th className="px-6 py-3 text-right">Monto</th>
                              <th className="px-6 py-3 text-center">Acciones</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-medium">
                           {compra.egresos?.map((egreso: any) => (
                              <tr key={egreso.id} className="hover:bg-slate-50">
                                 <td className="px-6 py-4">
                                    <Link to={`/dashboard/factura-compra/egresos/${egreso.id}`} className="text-blue-600 font-bold hover:underline">
                                       {egreso.numero}
                                    </Link>
                                 </td>
                                 <td className="px-6 py-4 text-slate-600">{new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(egreso.fechaEgreso || egreso.fechaComprobante))}</td>
                                 <td className="px-6 py-4 text-slate-600">{egreso.medioPagoNombre || '-'}</td>
                                 <td className="px-6 py-4 text-slate-600">{egreso.estado || egreso.estadoNombre || 'Aplicado'}</td>
                                 <td className="px-6 py-4 text-right text-slate-800 font-bold">{formatCurrency(egreso.monto)}</td>
                                 <td className="px-6 py-4 text-center">
                                   {(egreso.estadoId === 1 || egreso.estadoNombre === 'Aplicado' || egreso.estado === 'Aplicado' || (!egreso.estado && !egreso.estadoNombre)) && (
                                     <button 
                                       onClick={() => {
                                         import('../../../../data/services/comprobanteEgreso/comprobanteEgresoService')
                                           .then(m => m.anularComprobanteEgreso(egreso.id))
                                           .then(res => {
                                             if(res.success) {
                                               setResultModal({ show: true, success: true, message: 'Egreso anulado.' });
                                               fetchCompra(Number(id));
                                             } else {
                                               setResultModal({ show: true, success: false, message: res.message || 'Error al anular.' });
                                             }
                                           })
                                       }}
                                       className="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                                     >
                                       Anular
                                     </button>
                                   )}
                                 </td>
                              </tr>
                           ))}
                           {(!compra.egresos || compra.egresos.length === 0) && (
                              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No hay comprobantes de egreso vinculados.</td></tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Right Column: Resumen Totales */}
            <div className="lg:col-span-1 space-y-4">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-black text-slate-700 mb-6 uppercase tracking-widest text-sm flex items-center gap-2">
                     <FileText size={18} className="text-slate-400"/> Resumen
                  </h3>
                  
                  <div className="space-y-4 text-sm font-medium text-slate-600">
                     <div className="flex justify-between">
                        <span>Total Bruto</span>
                        <span className="font-bold text-slate-800">{formatCurrency(compra.totalBruto)}</span>
                     </div>
                     <div className="flex justify-between text-blue-600">
                        <span>Descuentos</span>
                        <span>-{formatCurrency(compra.descuentoTotal)}</span>
                     </div>
                     <div className="flex justify-between text-rose-600">
                        <span>Impuestos</span>
                        <span>+{formatCurrency(compra.totalImpuestoCargo)}</span>
                     </div>
                     <div className="flex justify-between text-emerald-600">
                        <span>Retenciones</span>
                        <span>-{formatCurrency(compra.totalRetencion)}</span>
                     </div>

                     <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="font-black text-slate-800 uppercase tracking-wider text-xs">Total Neto</span>
                        <span className="text-2xl font-black text-indigo-600">{formatCurrency(compra.totalNeto)}</span>
                     </div>
                  </div>
               </div>

               {/* Comprobantes contables Section */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-4">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                     <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <Banknote size={18} className="text-blue-500" />
                        Comprobantes contables
                     </h3>
                  </div>
                  <div className="p-4">
                     <AsientosContablesSection 
                        tipoDocumento="FacturaCompra" 
                        documentoId={compra.id} 
                        initialComprobantes={compra.comprobantes || []} 
                     />
                  </div>
               </div>
            </div>

         </div>
      </div>

      {/* Hidden Printable Template */}
      <div className="hidden print:block">
         <CompraInvoiceTemplate factura={compra} />
      </div>
    </div>
  );
};

export default ComprasViewerPage;

