import React, { useEffect, useState } from 'react';
import { 
  Save, Building2, ShieldCheck, UserCheck, MapPin, 
  Phone, Hash, Percent
} from 'lucide-react';
import { getColegioIdFromToken } from '../../../../utils/jwt';
import { getColegioById, updateColegio } from '../../../../services/colegio/colegioService';
import { getParametros } from '../../../../services/colegio/parametrosService';
import type { 
  Colegio, Ciudad, ActividadEconomica, TipoIdentificacion, 
  RegimenIva, Tributo, ResponsabilidadFiscal 
} from '../../../../models/Colegio';
import InputField from '../../../common/InputField';
import SelectField from '../../../common/SelectField';
import { useAuth } from '../../../../hooks/useAuth';
import StatusModal from '../../../common/StatusModal';
import Button from '../../../common/Button';

interface ParametrosSistema {
  ciudades: Ciudad[];
  actividadesEconomicas: ActividadEconomica[];
  tiposIdentificacion: TipoIdentificacion[];
  regimenesIva: RegimenIva[];
  tributos: Tributo[];
  responsabilidadesFiscales: ResponsabilidadFiscal[];
}

const PerfilForm = () => {
  const { token } = useAuth();
  const colegioId = getColegioIdFromToken(token);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Colegio>>({});
  const [parametros, setParametros] = useState<ParametrosSistema | null>(null);
  
  // Estados para Modales
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({
    show: false,
    success: false,
    message: ''
  });

  useEffect(() => {
    if (colegioId) {
      Promise.all([
        getColegioById(colegioId),
        getParametros()
      ]).then(([colegioData, parametrosData]) => {
        setFormData(colegioData);
        setParametros(parametrosData);
        setLoading(false);
      }).catch(err => {
        console.error("Error al cargar datos:", err);
        setLoading(false);
      });
    }
  }, [colegioId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: val 
    }));
  };

  const handleRepChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const reps = [...(prev.representantesLegales || [])];
      reps[index] = { ...reps[index], [field]: value };
      return { ...prev, representantesLegales: reps };
    });
  };

  const handleSaveClick = () => {
    setShowConfirm(true); 
  };

  const handleConfirmSave = async () => {
    // FIX: Validación de nulidad para evitar error TS2345
    if (!colegioId) {
      setResultModal({
        show: true,
        success: false,
        message: "No se pudo identificar la institución. Por favor, reincie sesión."
      });
      return;
    }

    setShowConfirm(false);
    setIsSaving(true);
    
    try {
      const result = await updateColegio(colegioId, formData);
      setResultModal({
        show: true,
        success: result.success,
        message: result.success 
          ? "La información institucional ha sido actualizada correctamente." 
          : (result.message || "Ocurrió un problema al guardar.")
      });
    } catch (error) {
      setResultModal({ 
        show: true, 
        success: false, 
        message: "Error de comunicación con el servidor." 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-bold text-slate-400 animate-pulse tracking-widest uppercase">
      Cargando perfil institucional...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* MODAL DE CONFIRMACIÓN */}
      <StatusModal 
        show={showConfirm}
        type="confirm"
        message="¿Deseas aplicar los cambios en el perfil institucional?"
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
        confirmText="Sí, guardar"
        cancelText="Cancelar"
      />

      {/* MODAL DE RESULTADO */}
      <StatusModal 
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => setResultModal(prev => ({ ...prev, show: false }))}
      />

      {/* HEADER ACCIÓN */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-4 z-20">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Perfil Institucional</h1>
          <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
            ID: {colegioId || 'N/A'}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={handleSaveClick} icon={Save} isLoading={isSaving}>
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUMNA 1: DATOS BÁSICOS Y REPRESENTANTE */}
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

            <InputField label="Dirección" name="direccion" value={formData.direccion || ""} onChange={handleChange} icon={MapPin} />

            <SelectField 
              label="Ciudad"
              name="ciudadId"
              value={formData.ciudadId}
              onChange={handleChange}
              options={parametros?.ciudades || []}
              displayExpr={(c) => c.nombre}
              placeholder="Seleccionar ciudad"
            />
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
              <UserCheck size={14} className="text-purple-500"/> Representante Legal
            </h3>
            {formData.representantesLegales?.map((rep, index) => (
              <div key={rep.id || index} className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <InputField 
                  label="Nombre Completo" 
                  name='nombre'
                  value={rep.nombre} 
                  onChange={(e) => handleRepChange(index, 'nombre', e.target.value)} 
                  icon={UserCheck} 
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField 
                    label="Identificación" 
                    name='numeroIdentificacion'
                    value={rep.numeroIdentificacion} 
                    onChange={(e) => handleRepChange(index, 'numeroIdentificacion', e.target.value)} 
                    icon={Hash} 
                  />
                  <SelectField 
                    label="Tipo Doc."
                    name={`rep_tipo_${index}`}
                    value={rep.tipoIdentificacionId}
                    // FIX: Tipado del evento (e)
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleRepChange(index, 'tipoIdentificacionId', e.target.value)}
                    options={parametros?.tiposIdentificacion || []}
                    displayExpr={(t) => t.nombre}
                    placeholder="Tipo..."
                  />
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

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <InputField label="Tarifa ICA (%)" name="tarifaIca" value={formData.tarifaIca || ""} onChange={handleChange} icon={Percent} onlyNumbers allowDecimals />
            
            <SelectField 
              label="Actividad Económica"
              name="actividadEconomicaId"
              value={formData.actividadEconomicaId}
              onChange={handleChange}
              options={parametros?.actividadesEconomicas || []}
              displayExpr={(a) => `${a.codigo} - ${a.descripcion.substring(0, 35)}...`}
              placeholder="Seleccionar actividad"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField 
                label="Regimen IVA"
                name="regimenIvaId"
                value={formData.regimenIvaId}
                onChange={handleChange}
                options={parametros?.regimenesIva || []}
                displayExpr={(r) => r.nombre}
                placeholder="Seleccionar..."
              />
              <SelectField 
                label="Tributo"
                name="tributoId"
                value={formData.tributoId}
                onChange={handleChange}
                options={parametros?.tributos || []}
                displayExpr={(t) => t.nombre}
                placeholder="Seleccionar..."
              />
            </div>

            <SelectField 
              label="Responsabilidad Fiscal"
              name="responsabilidadFiscalId"
              value={formData.responsabilidadFiscalId}
              onChange={handleChange}
              options={parametros?.responsabilidadesFiscales || []}
              displayExpr={(rf) => rf.nombre}
              placeholder="Seleccionar responsabilidad"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const CheckWrapper = ({ children, checked }: { children: React.ReactNode, checked: boolean }) => (
  <div className={`p-2 rounded-[1.5rem] border-2 transition-all duration-300 ${checked ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-50'}`}>
    {children}
  </div>
);

export default PerfilForm;