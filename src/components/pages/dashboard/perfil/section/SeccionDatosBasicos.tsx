import { Building2, MapPin, Phone, Hash } from 'lucide-react';
import InputField from '../../../../common/InputField';
import SelectField from '../../../../common/SelectField';

export const SeccionDatosBasicos = ({ formData, ciudades, onChange }: any) => (
  <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
      <Building2 size={14} className="text-blue-500"/> Datos Principales
    </h3>
    <InputField label="Nombre Institución" name="nombreColegio" value={formData.nombreColegio || ""} onChange={onChange} icon={Building2} />
    <div className="grid grid-cols-2 gap-4">
      <InputField label="NIT" name="nit" value={formData.nit || ""} onChange={onChange} icon={Hash} onlyNumbers />
      <InputField label="Teléfono" name="telefono" value={formData.telefono || ""} onChange={onChange} icon={Phone} />
    </div>
    <InputField label="Dirección" name="direccion" value={formData.direccion || ""} onChange={onChange} icon={MapPin} />
    <SelectField 
      label="Ciudad" name="ciudadId" value={formData.ciudadId} onChange={onChange}
      options={ciudades || []} displayExpr={(c: any) => c.nombre} placeholder="Seleccionar ciudad"
    />
  </section>
);