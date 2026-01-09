import React, { useEffect, useState } from 'react';
import { 
  Save, Building2, ShieldCheck, UserCheck, MapPin, 
  Phone, Hash, Percent, Landmark, 
  Briefcase
} from 'lucide-react';
import { getColegioIdFromToken } from '../../utils/jwt';
import { getColegioById, updateColegio } from '../../services/colegioService';
import type { Colegio } from '../../models/Colegio';
import InputField from '../InputField';
import { useAuth } from '../../hooks/useAuth';

const PerfilForm = () => {
  const { token } = useAuth();
  const colegioId = getColegioIdFromToken(token);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Colegio>>({});

  useEffect(() => {
    if (colegioId) {
      getColegioById(colegioId).then(data => {
        setFormData(data);
        setLoading(false);
      });
    }
  }, [colegioId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // Tu InputField ya gestiona correctamente checked/value
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse tracking-widest">CARGANDO...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-4 z-20">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Perfil Institucional</h1>
          <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
            Suscripción {formData.planSeleccionado}
          </p>
        </div>
        <button 
          onClick={() => { setIsSaving(true); updateColegio(colegioId!, formData).finally(() => setIsSaving(false)); }}
          className="bg-[#1e3a8a] text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
          disabled={isSaving}
        >
          <Save size={18} /> {isSaving ? 'PROCESANDO...' : 'GUARDAR CAMBIOS'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUMNA 1: INFORMACIÓN BÁSICA */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
              <Building2 size={14} className="text-blue-500"/> Datos Principales
            </h3>
            <InputField label="Nombre Institución" name="nombreColegio" value={formData.nombreColegio || ""} onChange={handleChange} icon={Building2} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="NIT" name="nit" value={formData.nit || ""} onChange={handleChange} icon={Hash} onlyNumbers />
              <InputField label="Teléfono" name="telefono" value={formData.telefono || ""} onChange={handleChange} icon={Phone} />
            </div>
            <InputField label="Dirección de la Sede" name="direccion" value={formData.direccion || ""} onChange={handleChange} icon={MapPin} />
          </section>

          {/* SECCIÓN REPRESENTANTE (AQUÍ DENTRO DE COLUMNA) */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
              <UserCheck size={14} className="text-purple-500"/> Representante Legal
            </h3>
            {formData.representantesLegales?.map((rep, index) => (
              <div key={rep.id || index} className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <InputField label="Nombre Completo" name={`rep_nombre_${index}`} value={rep.nombre} onChange={() => {}} icon={UserCheck} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Identificación" name={`rep_doc_${index}`} value={rep.numeroIdentificacion} onChange={() => {}} icon={Hash}  />
                    <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo Doc.</label>
                        <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-600 text-xs" >
                           {rep.tipoIdentificacionId === 2 ? 'Cédula de Ciudadanía' : 'Otro'}
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* COLUMNA 2: CONFIGURACIÓN FISCAL */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm h-fit">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
            <ShieldCheck size={14} className="text-amber-500"/> Configuración Fiscal y Tributaria
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* USANDO INPUTFIELD CON TYPE CHECKBOX */}
            <CheckWrapper checked={!!formData.manejaAiu}>
              <InputField type="checkbox" label="Maneja AIU" name="manejaAiu" value={!!formData.manejaAiu} onChange={handleChange} />
            </CheckWrapper>

            <CheckWrapper checked={!!formData.ivaRetencion}>
              <InputField type="checkbox" label="IVA Retención" name="ivaRetencion" value={!!formData.ivaRetencion} onChange={handleChange} />
            </CheckWrapper>

            <CheckWrapper checked={!!formData.usaDobleImpuesto}>
              <InputField type="checkbox" label="Doble Impuesto" name="usaDobleImpuesto" value={!!formData.usaDobleImpuesto} onChange={handleChange} />
            </CheckWrapper>

            <CheckWrapper checked={!!formData.usaImpuestoAdValorem}>
              <InputField type="checkbox" label="Imp. Ad Valorem" name="usaImpuestoAdValorem" value={!!formData.usaImpuestoAdValorem} onChange={handleChange} />
            </CheckWrapper>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-50">
            <InputField label="Tarifa ICA (%)" name="tarifaIca" value={formData.tarifaIca || ""} onChange={handleChange} icon={Percent} onlyNumbers allowDecimals />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Actividad Econ." name="actividadEconomicaId" value={formData.actividadEconomicaId || ""} onChange={handleChange} icon={Briefcase} onlyNumbers />
              <InputField label="Resp. Fiscal" name="responsabilidadFiscalId" value={formData.responsabilidadFiscalId || ""} onChange={handleChange} icon={Landmark} onlyNumbers />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Regimen IVA" name="regimenIvaId" value={formData.regimenIvaId || ""} onChange={handleChange} onlyNumbers />
                <InputField label="Tributo ID" name="tributoId" value={formData.tributoId || ""} onChange={handleChange} onlyNumbers />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};


const CheckWrapper = ({ children, checked }: { children: React.ReactNode, checked: boolean }) => (
  <div className={`p-2 rounded-[1.5rem] border-2 transition-all ${checked ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-50'}`}>
    {children}
  </div>
);

export default PerfilForm;