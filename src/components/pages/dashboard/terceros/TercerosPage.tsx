import React, { useEffect, useState } from "react";
import { Users, Hash, Mail, MapPin, Phone, Building2, UserCircle, Save, Globe, ShieldCheck } from "lucide-react";
import { getColegioIdFromToken } from "../../../../utils/jwt";
import { getParametros } from "../../../../services/colegio/parametrosService";
import { vincularTercero } from "../../../../services/terceros/terceroService";
import { validators } from "../../../../utils/validators";
import { validateForm } from "../../../../utils/validateForm";
import { calcularDV } from "../../../../utils/calcularDV";
import { useAuth } from "../../../../hooks/useAuth";
import InputField from "../../../common/InputField";
import SelectField from "../../../common/SelectField";
import Button from "../../../common/Button";
import StatusModal from "../../../common/StatusModal";
import type { TerceroCreateDTO } from "../../../../models/Tercero";

const TercerosPage = () => {
  const { token } = useAuth();
  const colegioId = getColegioIdFromToken(token);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [parametros, setParametros] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<TerceroCreateDTO>({
    tipoPersonaId: 1,
    tipoIdentificacionId: 1,
    identificacion: "",
    dv: "",
    nombres: "",
    apellidos: "",
    nombreComercial: "", 
    email: "",
    indicativo: "+57",
    codigoPostal: "",
    contactoNombres: "",
    contactoApellidos: "",
    correoFacturacion: "", 
    colegioId:"",
    categoriaId: 1,
    regimenIvaId: 1,
    ciudadId: 1,
    direccion: "",
    telefono: "",
    responsabilidadesFiscalesIds: [] 
  });

  // Esquema de Validación actualizado
  const schema = {
    identificacion: [validators.required(), validators.onlyNumbers(), validators.minLength(5)],
    email: [validators.required(), validators.email?.() || validators.required()],
    telefono: [validators.required(), validators.onlyNumbers()],
    direccion: [validators.required()],
    categoriaId: [validators.requiredSelect()],
    regimenIvaId: [validators.requiredSelect()],
    ciudadId: [validators.requiredSelect()],
    correoFacturacion: [validators.email?.() || validators.required()],
    ...(formData.tipoPersonaId == 1
      ? { nombres: [validators.required()], apellidos: [validators.required()] }
      : { nombreComercial: [validators.required()] }
    ),
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    if (colegioId) {
      getParametros().then((data) => {
        setParametros(data);
        setLoading(false);
      });
    }
  }, [colegioId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));

    setFormData((prev: any) => {
      const newData = { ...prev, [name]: value };
      // Recalcular DV si es NIT (ID 3 según tu lista)
      if (name === "identificacion" && prev.tipoIdentificacionId == 3) {
        newData.dv = calcularDV(value).toString();
      }
      return newData;
    });
  };

  const handleCheckboxChange = (id: number) => {
    setFormData((prev: any) => {
      const currentIds = prev.responsabilidadesFiscalesIds;
      const newIds = currentIds.includes(id)
        ? currentIds.filter((item: number) => item !== id)
        : [...currentIds, id];
      return { ...prev, responsabilidadesFiscalesIds: newIds };
    });
  };

  const handleSaveClick = () => {
    const validationErrors = validateForm(formData, schema) as Record<string, string>;
    if (Object.keys(validationErrors).length === 0) {
      setShowConfirm(true);
    } else {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmSave = async () => {
    if (!colegioId) return;
    setShowConfirm(false);
    setIsSaving(true);

    try {
      const payload = { ...formData, colegioId };
      const result = await vincularTercero(payload);
      setResultModal({
        show: true,
        success: result.success,
        message: result.success ? "Tercero vinculado correctamente." : result.message,
      });
      if(result.success) resetForm();
    } catch (error) {
      setResultModal({ show: true, success: false, message: "Error de conexión con el servidor" });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData((prev: any) => ({
        ...prev,
        identificacion: "", dv: "", nombres: "", apellidos: "", nombreComercial: "",
        email: "", correoFacturacion: "", contactoNombres: "", contactoApellidos: "",
        responsabilidadesFiscalesIds: []
    }));
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-500 font-medium">Cargando parámetros...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4">
      <StatusModal show={showConfirm} type="confirm" onConfirm={handleConfirmSave} onClose={() => setShowConfirm(false)} message="¿Confirmas la vinculación de este tercero con sus datos fiscales?" />
      <StatusModal show={resultModal.show} success={resultModal.success} message={resultModal.message} onClose={() => setResultModal(m => ({ ...m, show: false }))} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm sticky top-4 z-20 border border-slate-100 gap-4">
        <h1 className="text-xl font-black text-slate-800 uppercase flex items-center gap-2">
          <Users size={28} className="text-blue-600" /> Registro de Tercero
        </h1>
        <Button onClick={handleSaveClick} icon={Save} isLoading={isSaving} className="w-full md:w-auto">
          Guardar y Vincular
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA 1: IDENTIFICACIÓN */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
          <h3 className="font-bold text-slate-700 flex items-center gap-2"><ShieldCheck size={18}/> Identificación</h3>
          <SelectField 
            label="Tipo Persona" 
            name="tipoPersonaId" 
            value={formData.tipoPersonaId} 
            onChange={handleChange} 
            options={parametros?.tiposPersona || []} 
            displayExpr={t => t.nombre} 
          />
          <SelectField 
            label="Tipo Documento" 
            name="tipoIdentificacionId" 
            value={formData.tipoIdentificacionId} 
            onChange={handleChange} 
            options={parametros?.tiposIdentificacion || []} 
            displayExpr={t => t.nombre} 
          />
          <div className="flex gap-2">
            <InputField 
              label="Número" 
              name="identificacion" 
              value={formData.identificacion} 
              onChange={handleChange} 
              error={errors.identificacion} 
              onlyNumbers 
              icon={Hash}
              required
            />
            {formData.tipoIdentificacionId == 3 && (
              <div className="w-20">
                <InputField label="DV" name="dv" value={formData.dv} onChange={()=>{}} readonly />
              </div>
            )}
          </div>
        </section>

        {/* COLUMNA 2 y 3: DATOS PRINCIPALES */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><UserCircle size={18}/> Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.tipoPersonaId == 1 ? (
                <>
                  <InputField label="Nombres" name="nombres" value={formData.nombres} onChange={handleChange} error={errors.nombres} icon={UserCircle} required />
                  <InputField label="Apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} error={errors.apellidos} icon={UserCircle} required />
                </>
              ) : (
                <div className="col-span-2">
                  <InputField label="Nombre Comercial / Razón Social" name="nombreComercial" value={formData.nombreComercial} onChange={handleChange} error={errors.nombreComercial} icon={Building2} required />
                </div>
              )}
              <InputField label="Email Principal" name="email" value={formData.email} onChange={handleChange} error={errors.email} icon={Mail} required />
              <InputField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} error={errors.telefono} icon={Phone} required />
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2"><MapPin size={18}/> Ubicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Ciudad" name="ciudadId" value={formData.ciudadId} onChange={handleChange} error={errors.ciudadId} options={parametros?.ciudades || []} displayExpr={c => c.nombre} />
              <InputField label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} error={errors.direccion} icon={MapPin} required />
            </div>
          </section>
        </div>

        {/* SECCIÓN FISCAL COMPLETA */}
        <section className="lg:col-span-3 bg-slate-50 p-8 rounded-[2.5rem] border border-dashed border-slate-300 space-y-8">
          <div>
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase">
              <Globe size={22} className="text-blue-600"/> Datos Tributarios y Facturación
            </h3>
            <p className="text-slate-500 text-sm">Información requerida para la generación de facturas electrónicas y reportes DIAN.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-3xl shadow-sm">
            <InputField label="Correo Facturación" name="correoFacturacion" value={formData.correoFacturacion} onChange={handleChange} error={errors.correoFacturacion} icon={Mail} />
            <InputField label="Cód. Postal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} placeholder="000000" />
            <SelectField label="Categoría" name="categoriaId" value={formData.categoriaId} onChange={handleChange} error={errors.categoriaId} options={parametros?.categorias || []} displayExpr={c => c.nombre} />
            <SelectField label="Régimen IVA" name="regimenIvaId" value={formData.regimenIvaId} onChange={handleChange} error={errors.regimenIvaId} options={parametros?.regimenesIva || []} displayExpr={r => r.nombre} />
          </div>

          <div className="space-y-4">
            <label className="font-bold text-slate-700 flex items-center gap-2">
              Responsabilidades Fiscales <span className="text-xs font-normal text-slate-400">(Seleccione todas las que apliquen)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {parametros?.responsabilidadesFiscales?.map((resp: any) => (
                <div 
                  key={resp.id} 
                  onClick={() => handleCheckboxChange(resp.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    formData.responsabilidadesFiscalesIds.includes(resp.id) 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-white bg-white hover:border-slate-200"
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.responsabilidadesFiscalesIds.includes(resp.id) ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"}`}>
                    {formData.responsabilidadesFiscalesIds.includes(resp.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{resp.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TercerosPage;