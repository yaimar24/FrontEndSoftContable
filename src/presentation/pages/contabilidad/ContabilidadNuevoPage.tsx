import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/organisms/PageHeader';
import { SelectorCuentaPuc } from '../../components/organisms/SelectorCuentaPuc';
import { AsyncSearchField } from '../../components/organisms/AsyncSearchField';
import StatusModal from '../../components/organisms/StatusModal';
import { useContabilidad } from '../../../application/hooks/useContabilidad';
import type { MovimientoContableCreate } from '../../../domain/models/Contabilidad';
import { useTutorial } from '../../../application/context/TutorialContext';
import { formatCurrency } from '../../../utils/formatters';

export const ContabilidadNuevoPage = () => {
  const navigate = useNavigate();
  const { createAjusteManual, loading } = useContabilidad();
  const { setSteps } = useTutorial();

  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  
  const [modalConfig, setModalConfig] = useState({
    show: false,
    type: 'success' as 'success' | 'error' | 'confirm',
    message: '',
    onConfirm: undefined as (() => void) | undefined
  });

  const [movimientos, setMovimientos] = useState<MovimientoContableCreate[]>([
    { cuentaCodigo: '', debito: 0, credito: 0, descripcion: '' },
    { cuentaCodigo: '', debito: 0, credito: 0, descripcion: '' }
  ]);

  useEffect(() => {
    setSteps([
      {
        target: '.tuto-header-nuevo',
        content: 'Aquí creas un movimiento manual (asiento de ajuste) en tu contabilidad.',
      },
      {
        target: '.tuto-nuevo-fecha',
        content: 'Selecciona la fecha y agrega una descripción general para el comprobante.',
      },
      {
        target: '.tuto-nuevo-movimientos',
        content: 'Agrega las líneas del asiento: selecciona la cuenta PUC y coloca los montos de débito o crédito.',
      },
      {
        target: '.tuto-nuevo-totales',
        content: 'Los totales de débito y crédito deben cuadrar para poder guardar el comprobante.',
      },
    ]);
  }, [setSteps]);

  const addLine = () => {
    setMovimientos([...movimientos, { cuentaCodigo: '', debito: 0, credito: 0, descripcion: '' }]);
  };

  const updateLine = (index: number, field: keyof MovimientoContableCreate, value: string | number) => {
    const updated = [...movimientos];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'debito' && (value as number) > 0) updated[index].credito = 0;
    if (field === 'credito' && (value as number) > 0) updated[index].debito = 0;

    setMovimientos(updated);
  };

  const removeLine = (index: number) => {
    setMovimientos(movimientos.filter((_, i) => i !== index));
  };

  

  const validMovimientos = movimientos.filter(m => m.cuentaCodigo && (Number(m.debito) > 0 || Number(m.credito) > 0));
  
  const totales = useMemo(() => {
    return validMovimientos.reduce(
      (acc, curr) => ({
        debito: acc.debito + (Number(curr.debito) || 0),
        credito: acc.credito + (Number(curr.credito) || 0)
      }),
      { debito: 0, credito: 0 }
    );
  }, [validMovimientos]);

  const isCuadrado = Math.abs(totales.debito - totales.credito) < 0.01 && totales.debito > 0;
  

  
  const handleSave = () => {
    if (!fecha) {
      setModalConfig({ show: true, type: 'error', message: 'Por favor seleccione una fecha.', onConfirm: undefined });
      return;
    }
    if (validMovimientos.length < 2) {
      setModalConfig({ show: true, type: 'error', message: 'Debe agregar y completar al menos 2 líneas de movimiento (busque y seleccione la cuenta).', onConfirm: undefined });
      return;
    }
    if (!isCuadrado) {
      setModalConfig({ show: true, type: 'error', message: 'Los totales de Débito y Crédito no cuadran o son cero.', onConfirm: undefined });
      return;
    }

    setModalConfig({
      show: true,
      type: 'confirm',
      message: '¿Está seguro de guardar este comprobante?',
      onConfirm: async () => {
        setModalConfig(prev => ({ ...prev, show: false }));
        try {
          await createAjusteManual({
            fecha,
            descripcion: descripcion.trim() || undefined,
            movimientos: validMovimientos.map(m => ({ ...m, debito: Number(m.debito), credito: Number(m.credito) }))
          });
          
          setModalConfig({
            show: true,
            type: 'success',
            message: 'Comprobante guardado exitosamente.',
            onConfirm: undefined
          });
        } catch (err) {
          setModalConfig({ show: true, type: 'error', message: 'Ocurrió un error al guardar el asiento. Intente de nuevo.', onConfirm: undefined });
        }
      }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="tuto-header-nuevo">
      <PageHeader
        title="Movimiento manual"
        subtitle="Registra un asiento manual en tu contabilidad"
        actions={
          <button onClick={() => navigate('/dashboard/asientos-contables')} className="px-4 py-2 border rounded-lg hover:bg-gray-50 mr-2">
            Cancelar
          </button>
        }
      />
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="tuto-nuevo-fecha grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input 
              type="date" 
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción General</label>
            <input 
              type="text" 
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Descripción del asiento"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div className="tuto-nuevo-movimientos border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Movimientos (Líneas)</h3>
            <button onClick={addLine} className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
              + Agregar Línea
            </button>
          </div>

          <div className="space-y-4">
            {movimientos.map((line, idx) => (
              <div key={idx} className="flex gap-2 items-end border p-4 rounded-lg bg-gray-50">
                <div className="w-1/4">
                  <SelectorCuentaPuc
                    label="Cuenta PUC"
                    codigoRaiz=""
                    value={line.cuentaCodigo}
                    onChange={val => updateLine(idx, 'cuentaCodigo', val || '')}
                  />
                </div>
                <div className="w-1/4">
                  <AsyncSearchField
                    label="Tercero (Opcional)"
                    value={line.terceroId || ''}
                    getDisplayValue={(item: any) => item.nombreCompleto || item.razonSocial || '-'}
                    getKey={(item: any) => item.id}
                    onSelect={(item: any) => updateLine(idx, 'terceroId', item.id.toString())}
                    fetcher={async (val) => {
                        if (!val) return [];
                          const { buscarTerceros } = await import('../../../data/services/terceros/terceroService');
                          const resp = await buscarTerceros('CLIENTE,PROVEEDOR', val, true);
                        if (!resp.success || !resp.data) return [];
                        return resp.data;
                      }}
                    placeholder="Buscar tercero..."
                  />
                </div>
                <div className="w-1/6">
                  <label className="block text-sm font-medium mb-1">Débito</label>
                  <input 
                    type="number" min="0" step="0.01" 
                    value={line.debito || ''}
                    onChange={e => updateLine(idx, 'debito', Number(e.target.value))}
                    className="block w-full border rounded-md p-2"
                  />
                </div>
                <div className="w-1/6">
                  <label className="block text-sm font-medium mb-1">Crédito</label>
                  <input 
                    type="number" min="0" step="0.01" 
                    value={line.credito || ''}
                    onChange={e => updateLine(idx, 'credito', Number(e.target.value))}
                    className="block w-full border rounded-md p-2"
                  />
                </div>
                <div className="w-1/4 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <input 
                      type="text" 
                      value={line.descripcion || ''}
                      onChange={e => updateLine(idx, 'descripcion', e.target.value)}
                      className="block w-full border rounded-md p-2"
                    />
                  </div>
                  <button onClick={() => removeLine(idx)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {movimientos.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 mt-4">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin Líneas</p>
              <p className="text-slate-500 text-sm mt-2">Agrega al menos dos movimientos para cuadrar el asiento.</p>
            </div>
          )}
        </div>

        <div className="tuto-nuevo-totales bg-[#1e3a8a]/5 p-6 rounded-3xl border border-[#1e3a8a]/10 flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
          <div className="flex gap-8 items-center bg-white py-3 px-6 rounded-2xl shadow-sm border border-[#1e3a8a]/10 w-full md:w-auto">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Débito</p>
              <p className="text-xl font-black tracking-tight text-emerald-600">{formatCurrency(totales.debito)}</p>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Crédito</p>
              <p className="text-xl font-black tracking-tight text-rose-600">{formatCurrency(totales.credito)}</p>
            </div>
            {!isCuadrado && movimientos.length > 0 && (
              <>
                <div className="h-8 w-px bg-rose-200 mx-2"></div>
                <div>
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Diferencia</p>
                  <p className="text-lg font-black tracking-tight text-rose-600">{formatCurrency(Math.abs(totales.debito - totales.credito))}</p>
                </div>
              </>
            )}
          </div>
          <button 
            disabled={loading}
            onClick={handleSave}
              className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all w-full md:w-auto ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border-2 border-slate-200' : 'bg-[#1e3a8a] text-white hover:bg-blue-900 hover:shadow-[#1e3a8a]/20 shadow-[#1e3a8a]/30'}`}
          >
            {loading ? 'Guardando...' : 'Guardar Comprobante'}
          </button>
        </div>

      </div>
      <StatusModal
        show={modalConfig.show}
        type={modalConfig.type}
        message={modalConfig.message}
        onClose={() => {
            setModalConfig(prev => ({ ...prev, show: false }));
            if (modalConfig.type === 'success') {
              navigate('/dashboard/asientos-contables');
            }
        }}
        onConfirm={modalConfig.type === 'confirm' ? modalConfig.onConfirm : undefined}
      />
    </div>
  );
};






