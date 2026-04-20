import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Target, AlignLeft } from 'lucide-react';
import Modal from '../../../../components/organisms/Modal';
import InputField from '../../../../components/atoms/InputField';
import SelectField from '../../../../components/atoms/SelectField';
import Button from '../../../../components/atoms/Button';
import { registrarComprobanteEgreso } from '../../../../../data/services/comprobanteEgreso/comprobanteEgresoService';
import { getParametrosFacturacion } from '../../../../../data/services/colegio/parametrosService';
import type { FacturaCompraReadDTO } from '../../../../../domain/models/FacturaCompra';
import StatusModal from '../../../../components/organisms/StatusModal';

interface PaymentEgresoModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: FacturaCompraReadDTO;
  onSuccess: () => void;
}

export const PaymentEgresoModal: React.FC<PaymentEgresoModalProps> = ({ isOpen, onClose, factura, onSuccess }) => {
  const [selectedMedio, setSelectedMedio] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaEgreso, setFechaEgreso] = useState(() => new Date().toISOString().split('T')[0]);
  const [referencia, setReferencia] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [paymentKey, setPaymentKey] = useState(() => crypto.randomUUID());

  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<{ show: boolean, type: 'error' | 'success', message: string }>({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);
  const [mediosPago, setMediosPago] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const currentSaldo = factura.saldo ?? factura.totalNeto;
      setMonto(currentSaldo.toString());
      setFechaEgreso(new Date().toISOString().split('T')[0]);
      setSelectedMedio('');
      setReferencia('');
      setObservaciones('');
      setPaymentKey(crypto.randomUUID());
      const fetchMediosPago = async () => {
        try {
          const res = await getParametrosFacturacion();
          if (res.success && res.data) {
            setMediosPago(res.data.mediosPago);
          }
        } catch (error) {
          console.error("Error al cargar medios de pago", error);
        }
      };
      if (mediosPago.length === 0) fetchMediosPago();
    }
  }, [isOpen, factura.saldo, factura.totalNeto]);

  const handleConfirm = async () => {
    if (!selectedMedio || !monto || !fechaEgreso) return;

    setLoading(true);
    setStatus({ show: false, type: 'success', message: '' });
    try {
      const payload = {
        monto: Number(monto),
        medioPagoId: Number(selectedMedio),
        fechaEgreso: fechaEgreso,
        esAbono: false,
        referencia: referencia || undefined,
        observaciones: observaciones || undefined
      };

      const res = await registrarComprobanteEgreso(factura.id, payload, paymentKey);
      if (res.success) {
        setStatus({ show: true, type: 'success', message: 'Comprobante de egreso generado exitosamente' });
      } else {
        setStatus({ show: true, type: 'error', message: res.message || 'Error al generar el comprobante' });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setStatus({ show: true, type: 'error', message: 'Ocurrió un error inesperado' });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const handleStatusClose = () => {
    if (status.type === 'success') {
      onSuccess();
      onClose();
    }
    setStatus({ show: false, type: 'success', message: '' });
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Registrar Pago a Proveedor" maxWidth="max-w-lg">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-emerald-800 text-sm font-bold opacity-80 uppercase tracking-wide">Saldo Pendiente</p>
              <p className="text-2xl font-black text-emerald-900 tracking-tight">
                {(factura.saldo ?? factura.totalNeto).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100/50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Factura #</p>
              <p className="text-sm font-black text-slate-700">{factura.numero}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Monto a Pagar"
              name="monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              icon={DollarSign}
              required
              type="number"
            />
            <InputField
              label="Fecha de Pago"
              name="fecha"
              value={fechaEgreso}
              onChange={(e) => setFechaEgreso(e.target.value)}
              icon={Calendar}
              required
              type="date"
            />
          </div>

          <SelectField
            label="Medio de Pago"
            name="medioPago"
            value={selectedMedio}
            onChange={(e: any) => setSelectedMedio(e.target.value)}
            options={[{ id: '', nombre: 'Seleccionar medio...' }, ...mediosPago.map(m => ({ id: m.id.toString(), nombre: m.nombre }))]}
            displayExpr={(opt: any) => opt.nombre}
            required
          />

          <InputField
            label="Referencia (Opcional)"
            name="referencia"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            icon={Target}
            placeholder="Ej: Transacción #12345"
          />

          <InputField
            label="Observaciones (Opcional)"
            name="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            icon={AlignLeft}
            placeholder="Nota adicional..."
          />

          <div className="flex gap-4 justify-end pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setShowConfirm(true)}
              disabled={!selectedMedio || !monto || parseFloat(monto) > (factura.saldo ?? factura.totalNeto) || loading}
            >
              Confirmar Pago
            </Button>
          </div>
        </div>
      </Modal>

      <StatusModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        type="confirm"
        message="¿Confirmas el registro del pago a proveedor por este monto?"
        onConfirm={handleConfirm}
        confirmText={loading ? 'Procesando...' : 'Confirmar Pago'}
      />

      <StatusModal
        show={status.show}
        onClose={handleStatusClose}
        success={status.type === 'success'}
        message={status.message}
      />
    </>
  );
};
