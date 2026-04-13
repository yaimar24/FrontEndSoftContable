import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Target, AlignLeft } from 'lucide-react';
import Modal from '../../../../components/organisms/Modal';
import InputField from '../../../../components/atoms/InputField';
import SelectField from '../../../../components/atoms/SelectField';
import Button from '../../../../components/atoms/Button';
import { registrarPago } from '../../../../../data/services/venta/ventaService';
import { getParametrosFacturacion } from '../../../../../data/services/colegio/parametrosService';
import type { FacturaVentaReadDTO } from '../../../../../domain/models/Venta';
import StatusModal from '../../../../components/organisms/StatusModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: FacturaVentaReadDTO;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, factura, onSuccess }) => {
  const [selectedMedio, setSelectedMedio] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaRecibo, setFechaPago] = useState(() => new Date().toISOString().split('T')[0]);
  const [referencia, setReferencia] = useState('');
  const [observacion, setObservacion] = useState('');
  const [paymentKey, setPaymentKey] = useState(() => crypto.randomUUID());
  
  const [status, setStatus] = useState<{ show: boolean, type: 'error' | 'success', message: string }>({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);
  const [mediosPago, setMediosPago] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    getParametrosFacturacion().then(res => {
      if (res.success && res.data) {
        setMediosPago(res.data.mediosPago);
      }
    });
  }, []);

  const valorCuota = factura.esCredito && factura.numeroCuotas ? Math.ceil(factura.totalNeto / factura.numeroCuotas) : 0;
  const cuotaSugerida = Math.min(valorCuota, factura.saldo);

  useEffect(() => {
    if (isOpen) {
      const initialMonto = factura.esCredito && cuotaSugerida > 0 ? cuotaSugerida.toString() : factura.saldo.toString();
      setMonto(initialMonto);
      setFechaPago(new Date().toISOString().split('T')[0]);
      setReferencia('');
      setObservacion('');
      setSelectedMedio('');
      // Generar una nueva key cada vez que se abre el modal para un nuevo pago
      setPaymentKey(crypto.randomUUID());
    }
  }, [isOpen, factura]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numMonto = parseFloat(monto);
    if (!selectedMedio) return setStatus({ show: true, type: 'error', message: 'Debe seleccionar un medio de pago' });
    if (numMonto <= 0 || numMonto > factura.saldo) {
      return setStatus({ show: true, type: 'error', message: `El monto excede el saldo pendiente ($${factura.saldo.toLocaleString('es-CO')})` });
    }

    try {
      setLoading(true);
      const res = await registrarPago(factura.id, {
        medioPagoId: Number(selectedMedio),
        monto: Number(monto),
        fechaRecibo,
        referencia,
        observacion
      }, paymentKey);
      if (res.success && res.data) {
        const remaining = factura.saldo - numMonto;
        setStatus({
            show: true,
            type: 'success',
            message: res.data.esAbono
              ? `Abono registrado. Saldo pendiente: $${remaining.toLocaleString('es-CO', {minimumFractionDigits: 2})}`
              : 'Pago total registrado. Factura pagada.'
        });
        onClose(); // Ocultar el formulario
        onSuccess(); // Actualizar la vista (factura) en background
        setTimeout(() => {
            setStatus({ show: false, type: 'success', message: '' });
        }, 2500);
      } else {
        setStatus({ show: true, type: 'error', message: res.message });
      }
    } catch (err: any) {
      setStatus({ show: true, type: 'error', message: 'Error de red al procesar el pago' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !status.show) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Registrar Pago" subtitle={`Factura #${factura.numero}`}>
        <form onSubmit={handleSubmit} className="space-y-4 min-w-[500px] pb-2">
            <div className="bg-blue-50/50 p-4 mx-6 mt-4 rounded-2xl border border-blue-100 flex flex-col gap-1 text-center">
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Saldo Pendiente</p>
               <p className="text-3xl font-black text-blue-600">${Math.round(factura.saldo).toLocaleString('es-CO')}</p>
            </div>

            {factura.esCredito && cuotaSugerida > 0 && cuotaSugerida < factura.saldo && (
               <div className="flex gap-2 px-6 justify-center">
                 <button
                   type="button"
                   onClick={() => setMonto(cuotaSugerida.toString())}
                   className={`text-xs px-3 py-1.5 rounded-full border transition-all ${Number(monto) === cuotaSugerida ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}        
                 >
                   Pagar 1 Cuota (${Math.round(cuotaSugerida).toLocaleString('es-CO')})
                 </button>
               </div>
            )}

            <div className="space-y-4 px-6">
               <SelectField
                 label="Medio de Pago"
                 name="medioPagoId"
                 value={selectedMedio}
                 onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMedio(e.target.value)}
                 options={mediosPago}
                 displayExpr={(item) => item.nombre}
                 required
               />
            </div>

            <div className="flex gap-4 px-6">
                <InputField
                    label="Monto a Pagar"
                    name="monto"
                    type="number"
                    value={monto}
                    onChange={e => setMonto(e.target.value)}
                    icon={DollarSign}
                    required
                />
                <InputField
                    label="Fecha de Pago"
                    name="fechaRecibo"
                    type="date"
                    value={fechaRecibo}
                    onChange={e => setFechaPago(e.target.value)}
                    icon={Calendar}
                    required
                />
            </div>
            
            <div className="flex gap-4 px-6 mb-4">
                <InputField
                    label="Referencia / Nro"
                    name="referencia"
                    value={referencia}
                    onChange={e => setReferencia(e.target.value)}
                    icon={Target}
                    placeholder="Ej: TRX-91823"
                />
                <InputField
                    label="Observación"
                    name="observacion"
                    value={observacion}
                    onChange={e => setObservacion(e.target.value)}
                    icon={AlignLeft}
                    placeholder="Opcional"
                />
            </div>

            <div className="flex gap-4 pt-4 px-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl py-4">
                <Button type="button" variant="outline" fullWidth onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" fullWidth isLoading={loading}>
                    Confirmar Pago
                </Button>
            </div>
        </form>
      </Modal>

      <StatusModal
         show={status.show}
         type={status.type}
         message={status.message}
         onClose={() => setStatus({ ...status, show: false })}
      />
    </>
  );
};
