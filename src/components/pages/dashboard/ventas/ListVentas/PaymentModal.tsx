import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, Target, AlignLeft } from 'lucide-react';
import Modal from '../../../../common/Modal';
import InputField from '../../../../common/InputField';
import Button from '../../../../common/Button';
import { getMediosPago, registrarPago } from '../../../../../services/venta/ventaService';
import type { FacturaVentaReadDTO } from '../../../../../models/Venta';
import type { PucNodo } from '../../../../../models/Puc';
import StatusModal from '../../../../common/StatusModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: FacturaVentaReadDTO;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, factura, onSuccess }) => {
  const [mediosPago, setMediosPago] = useState<PucNodo[]>([]);
  const [selectedMedio, setSelectedMedio] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaRecibo, setFechaPago] = useState(() => new Date().toISOString().split('T')[0]);
  const [referencia, setReferencia] = useState('');
  const [observacion, setObservacion] = useState('');
  
  const [status, setStatus] = useState<{ show: boolean, type: 'error' | 'success', message: string }>({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMedios();
      setMonto(factura.saldo.toString());
      setFechaPago(new Date().toISOString().split('T')[0]);
      setReferencia('');
      setObservacion('');
    }
  }, [isOpen, factura]);

  const loadMedios = async () => {
    try {
      const res = await getMediosPago();
      if (res.success && res.data) {
        setMediosPago(res.data);
        if (res.data.length > 0) setSelectedMedio(res.data[0].codigo);
      }
    } catch (e) {}
  };

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
        monto: numMonto,
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
        <form onSubmit={handleSubmit} className="space-y-6 min-w-[500px]">
            <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 flex flex-col gap-1 text-center">
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Saldo Pendiente</p>
               <p className="text-3xl font-black text-blue-600">${factura.saldo.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="space-y-2">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">
                  Medio de Pago (PUC)
               </label>
               <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus-within:border-blue-500 focus-within:bg-white transition-all overflow-hidden h-14">
                  <CreditCard className="absolute left-4 text-slate-400 z-10" strokeWidth={2.5} size={18} />
                  <select 
                      value={selectedMedio}
                      onChange={e => setSelectedMedio(e.target.value)}
                      className="w-full h-full bg-transparent pl-12 pr-6 text-sm font-bold text-slate-700 uppercase tracking-wide outline-none appearance-none cursor-pointer"
                      required
                  >
                      {mediosPago.map(m => (
                          <option key={m.codigo} value={m.codigo}>{m.codigo} - {m.nombre}</option>
                      ))}
                  </select>
               </div>
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
                <Button type="submit" variant="primary" fullWidth disabled={loading}>
                    {loading ? 'Procesando...' : 'Confirmar Pago'}
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