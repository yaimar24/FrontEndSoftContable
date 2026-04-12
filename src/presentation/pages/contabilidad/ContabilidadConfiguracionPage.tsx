import { useEffect, useState } from 'react';
import PageHeader from '../../components/organisms/PageHeader';
import { SelectorCuentaPuc } from '../../components/organisms/SelectorCuentaPuc';
import { useContabilidad } from '../../../application/hooks/useContabilidad';

export const ContabilidadConfiguracionPage = () => {
  const { configuracion, fetchConfiguracion, updateConfiguracion, loading } = useContabilidad();
  const [form, setForm] = useState({
    cuentaCxCClientesCodigo: '',
    cuentaProveedoresCodigo: '',
    cuentaIvaPorPagarCodigo: '',
    cuentaIvaDescontableCodigo: '',
    cuentaRetencionAFavorCodigo: '',
    cuentaRetencionPorPagarCodigo: ''
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchConfiguracion();
  }, [fetchConfiguracion]);

  useEffect(() => {
    if (configuracion) {
      setForm({
        cuentaCxCClientesCodigo: configuracion.cuentaCxCClientesCodigo || '',
        cuentaProveedoresCodigo: configuracion.cuentaProveedoresCodigo || '',
        cuentaIvaPorPagarCodigo: configuracion.cuentaIvaPorPagarCodigo || '',
        cuentaIvaDescontableCodigo: configuracion.cuentaIvaDescontableCodigo || '',
        cuentaRetencionAFavorCodigo: configuracion.cuentaRetencionAFavorCodigo || '',
        cuentaRetencionPorPagarCodigo: configuracion.cuentaRetencionPorPagarCodigo || ''
      });
    }
  }, [configuracion]);

  const handleChange = (field: string, value: string | null) => {
    setForm(prev => ({ ...prev, [field]: value || '' }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateConfiguracion(form);
      setSuccessMsg('Configuración guardada exitosamente.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !configuracion) return <div className="p-8 text-center">Cargando configuración...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader 
        title="Configuración Contable" 
        subtitle="Mapeo de cuentas PUC automáticas para los procesos del sistema"
      />

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-100 p-4 rounded-2xl font-bold flex items-center gap-3">
          <span>✅</span> {successMsg}
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest border-b-2 border-slate-200/60 pb-3">
              Ventas / Cartera
            </h3>
            <SelectorCuentaPuc
              label="Cuenta CxC Clientes (13*)"
              codigoRaiz="13"
              value={form.cuentaCxCClientesCodigo}
              onChange={v => handleChange('cuentaCxCClientesCodigo', v)}
            />
            <SelectorCuentaPuc
              label="Cuenta IVA por Pagar (2408*)"
              codigoRaiz="2408"
              value={form.cuentaIvaPorPagarCodigo}
              onChange={v => handleChange('cuentaIvaPorPagarCodigo', v)}
            />
            <SelectorCuentaPuc
              label="Cuenta Retención a Favor (1355*)"
              codigoRaiz="1355"
              value={form.cuentaRetencionAFavorCodigo}
              onChange={v => handleChange('cuentaRetencionAFavorCodigo', v)}
            />
          </div>

          <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest border-b-2 border-slate-200/60 pb-3">
              Compras / Provisiones
            </h3>
            <SelectorCuentaPuc
              label="Cuenta Proveedores (22*)"
              codigoRaiz="22"
              value={form.cuentaProveedoresCodigo}
              onChange={v => handleChange('cuentaProveedoresCodigo', v)}
            />
            <SelectorCuentaPuc
              label="Cuenta IVA Descontable (2408*)"
              codigoRaiz="2408"
              value={form.cuentaIvaDescontableCodigo}
              onChange={v => handleChange('cuentaIvaDescontableCodigo', v)}
            />
            <SelectorCuentaPuc
              label="Cuenta Retención por Pagar (2365*)"
              codigoRaiz="2365"
              value={form.cuentaRetencionPorPagarCodigo}
              onChange={v => handleChange('cuentaRetencionPorPagarCodigo', v)}
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className={`px-8 py-3.5 rounded-2xl font-black uppercase text-sm tracking-widest text-white shadow-lg transition-all ${saving ? 'bg-slate-300 shadow-none cursor-wait' : 'bg-[#1e3a8a] hover:bg-blue-900 shadow-[#1e3a8a]/20 hover:shadow-[#1e3a8a]/30'}`}
          >
            {saving ? 'Guardando...' : 'Aplicar Mapeo Contable'}
          </button>
        </div>
      </div>
    </div>
  );
};
