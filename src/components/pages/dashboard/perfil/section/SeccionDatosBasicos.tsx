import { Building2, MapPin, Phone, Hash, Upload } from 'lucide-react';
import InputField from '../../../../common/InputField';
import SelectField from '../../../../common/SelectField';
import type { Ciudad } from '../../../../../models/Colegio';

export const SeccionDatosBasicos = ({ formData, ciudades, onChange }: any) => {
  const getFullUrl = (path: string) => path.startsWith('http') ? path : `${import.meta.env.VITE_API_URL}${path}`;

  const logoPreview = formData.logo instanceof File
    ? URL.createObjectURL(formData.logo)
    : formData.logoPath ? getFullUrl(formData.logoPath) : null;

  return (
    <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
        <Building2 size={14} className="text-blue-500" /> Datos Principales
      </h3>
      
      <div className="flex flex-col items-center pt-2 pb-6">
        <label className="mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
          Identidad Institucional (Logo)
        </label>
        <div className="relative w-32 h-32 rounded-[2rem] border-2 border-dashed border-slate-300 bg-slate-50 shadow-sm overflow-hidden hover:border-blue-600 transition-all flex items-center justify-center cursor-pointer group">
          {logoPreview ? (
            <div className="relative w-full h-full p-2 animate-in zoom-in-95 duration-300">
              <img
                src={logoPreview}
                alt="Logo Colegio"
                className="object-contain w-full h-full drop-shadow-sm"
                onLoad={() => {
                  if (formData.logo instanceof File) URL.revokeObjectURL(logoPreview);
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="text-white" size={24} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-400">
              <Upload size={28} />
              <span className="text-[9px] font-black mt-2">SUBIR LOGO</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            name="logo"
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
        </div>
      </div>

      <InputField label="Nombre Institución" name="nombreColegio" value={formData.nombreColegio || ""} onChange={onChange} icon={Building2} />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="NIT" name="nit" value={formData.nit || ""} onChange={onChange} icon={Hash} onlyNumbers />
        <InputField label="Teléfono" name="telefono" value={formData.telefono || ""} onChange={onChange} icon={Phone} />
      </div>
      <InputField label="Dirección" name="direccion" value={formData.direccion || ""} onChange={onChange} icon={MapPin} />
      <SelectField
        label="Ciudad" name="ciudadId" value={formData.ciudadId} onChange={onChange}
        options={ciudades || []} displayExpr={(c: Ciudad) => c.nombre} placeholder="Seleccionar ciudad"
      />
    </section>
  );
};
