import React from 'react';
import { Users, Save, ArrowLeft, UserCircle, MapPin, Building2, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import Button from '../../../../common/Button';
import StatusModal from '../../../../common/StatusModal';
import InputField from '../../../../common/InputField';
import SelectField from '../../../../common/SelectField';
import { useTercerosForm } from '../../../../../hooks/useTercerosForm';
import { SeccionIdentificacion } from './sections/SeccionIdentificacion';
import { SeccionFiscal } from './sections/SeccionFiscal';

interface Props {
  initialData?: any;
  onBack: () => void;
}

const TercerosCreatePage: React.FC<Props> = ({ initialData, onBack }) => {
  const { token } = useAuth();
  const isEditing = !!initialData;
  const {
    formData, parametros, errors,
    showConfirm, resultModal, setShowConfirm, setResultModal,
    handleChange, handleCheckboxChange, handleSaveClick, handleConfirmSave
  } = useTercerosForm(token, initialData);


  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4 animate-in fade-in duration-500">

      <StatusModal 
        show={showConfirm} type="confirm" onConfirm={handleConfirmSave} 
        onClose={() => setShowConfirm(false)} 
        message={isEditing ? "¿Actualizar este tercero?" : "¿Vincular este tercero?"} 
      />
      
      <StatusModal 
        show={resultModal.show} success={resultModal.success} message={resultModal.message} 
        onClose={() => { setResultModal(m => ({ ...m, show: false })); if(resultModal.success) onBack(); }} 
      />

      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm sticky top-4 z-20 border border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-400" />
          </button>
          <h1 className="text-xl font-black text-slate-800 uppercase flex items-center gap-2">
            <Users size={28} className="text-blue-600" /> 
            {isEditing ? 'Editar Tercero' : 'Nuevo Tercero'}
          </h1>
        </div>
        <Button onClick={handleSaveClick} icon={Save}>
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SeccionIdentificacion formData={formData} parametros={parametros} errors={errors} onChange={handleChange} />
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <UserCircle size={18} className="text-blue-500"/> Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.tipoPersonaId === 1 ? (
                <>
                  <InputField label="Nombres" name="nombres" value={formData.nombres || ""} onChange={handleChange} error={errors.nombres} icon={UserCircle} required />
                  <InputField label="Apellidos" name="apellidos" value={formData.apellidos || ""} onChange={handleChange} error={errors.apellidos} icon={UserCircle} required />
                </>
              ) : (
                <div className="col-span-2">
                  <InputField label="Nombre Comercial" name="nombreComercial" value={formData.nombreComercial || ""} onChange={handleChange} error={errors.nombreComercial} icon={Building2} required />
                </div>
              )}
              <InputField label="Email Principal" name="email" value={formData.email || ""} onChange={handleChange} error={errors.email} icon={Mail} required />
              <InputField label="Teléfono" name="telefono" value={formData.telefono || ""} onChange={handleChange} error={errors.telefono} icon={Phone} required />
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <MapPin size={18} className="text-blue-500"/> Ubicación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Ciudad" name="ciudadId" value={formData.ciudadId ?? ""} onChange={handleChange} error={errors.ciudadId} options={parametros?.ciudades || []} displayExpr={c => c.nombre} />
              <InputField label="Dirección" name="direccion" value={formData.direccion || ""} onChange={handleChange} error={errors.direccion} icon={MapPin} required />
            </div>
          </section>
        </div>
        <SeccionFiscal formData={formData} parametros={parametros} errors={errors} onChange={handleChange} onCheckboxChange={handleCheckboxChange} />
      </div>
    </div>
  );
};

export default TercerosCreatePage;