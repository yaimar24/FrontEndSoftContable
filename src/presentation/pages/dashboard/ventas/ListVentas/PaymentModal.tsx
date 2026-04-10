import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Target, AlignLeft } from 'lucide-react';
import Modal from '../../../../components/organisms/Modal';
import InputField from '../../../../components/atoms/InputField';
import { SelectorCuentaPuc } from '../../../../components/organisms/SelectorCuentaPuc';
import Button from '../../../../components/atoms/Button';
import { registrarPago } from '../../../../../data/services/venta/ventaService';
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
  
  const [status, setStatus] = useState<{ show: boolean, type: 'error' | 'success', message: string }>({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMonto(factura.saldo.toString());
      setFechaPago(new Date().toISOString().split('T')[0]);
      setReferencia('');
      setObservacion('');
      setSelectedMedio('');
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
        medioPagoCodigo: selectedMedio,
        monto: Number(monto),
        fechaRecibo,
        referencia,
        observacion
      });
      if (res.success && res.data) {
        const remaining = factura.saldo - numMonto;
        setStatus({ 
            show: true, 
            type: 'success', 
            message: res.data.esAbono 
              ? `Abono registrado. Saldo pendiente: $${remaining.toLocaleString('es-CO', {minimumFractionDigits: 2})}` 
              : 'Pago total registrado. Factura pagada.' 
        });
        onSuccess();
        setTimeout(() => {
            setStatus({ show: false, type: 'success', message: '' });
            onClose();
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
        <form onSubmit={handleSubmit} className="space-y-4 min-w-[500px]">
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col gap-1 text-center">
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Saldo Pendiente</p>
               <p className="text-3xl font-black text-blue-600">${factura.saldo.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="space-y-4">
               <SelectorCuentaPuc
                 label="Medio de Pago"
                 codigoRaiz="11"
                 value={selectedMedio}
                 onChange={(val) => setSelectedMedio(val || '')}
                 required
               />
            </div>

            <div className="flex gap-4">
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
            
            <div className="flex gap-4">
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

            <div className="flex gap-4 pt-4 border-t border-slate-100">
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
