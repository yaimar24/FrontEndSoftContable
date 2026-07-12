
import React from "react";
import type { EmpleadoUpdateDTO } from "@/domain/models/Empleado";
import InputField from "@/presentation/components/atoms/InputField";
import SelectField from "@/presentation/components/atoms/SelectField";
import StatusModal from "@/presentation/components/organisms/StatusModal";
import { useEmpleadosForm } from "@/application/hooks/useEmpleadosForm";
import { User, Hash, Mail, Phone, MapPin, Banknote, Building2, Save, ArrowLeft, Briefcase, Plus } from "lucide-react";
import Button from "@/presentation/components/atoms/Button";

interface EmpleadosCreatePageProps {
  initialData?: (EmpleadoUpdateDTO & { id?: string }) | null;
  onBack: () => void;
  onSuccessSave: (id: string) => void;
  onManageContract: () => void; // <--- Propiedad agregada para solucionar el error de TypeScript
}

const EmpleadosCreatePage: React.FC<EmpleadosCreatePageProps> = ({ 
  initialData, 
  onBack, 
  onSuccessSave,
  onManageContract // <--- Desestructuración de la nueva propiedad
}) => {
  const isEditing = !!initialData;
  const {
    formData,
    errors,
    showConfirm,
    setShowConfirm,
    resultModal,
    setResultModal,
    handleChange,
    handleSaveClick,
    handleConfirmSave,
    parametros,
  } = useEmpleadosForm(initialData);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 animate-in fade-in duration-500">
      {/* Sticky header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm sticky top-4 z-20 border border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors" type="button">
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <h1 className="text-lg font-black text-slate-800 uppercase flex items-center gap-2 tracking-tight">
            <User size={22} className="text-blue-600" />
            {isEditing ? "Editar Empleado" : "Nuevo Empleado"}
          </h1>
        </div>
        <Button onClick={handleSaveClick} icon={Save}>
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Identificación y contacto */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm h-full">
          <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <User size={16} className="text-blue-600"/> Identificación
            </h3>
          </div>
          <div className="space-y-3">
            <SelectField
              label="Tipo de Identificación"
              name="tipoIdentificacionId"
              value={formData.tipoIdentificacionId}
              onChange={handleChange}
              options={parametros?.tiposIdentificacion || []}
              displayExpr={t => t.nombre}
              required
              error={errors.tipoIdentificacionId}
              placeholder="Seleccione tipo de documento"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <InputField
                  label="Número de Documento"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  error={errors.numeroDocumento}
                  icon={Hash}
                  required
                />
              </div>
            </div>
            <InputField
              label="Nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              error={errors.nombres}
              icon={User}
              required
            />
            <InputField
              label="Apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              error={errors.apellidos}
              icon={User}
              required
            />
            <InputField
              label="Correo Electrónico"
              name="correoElectronico"
              value={formData.correoElectronico}
              onChange={handleChange}
              error={errors.correoElectronico}
              icon={Mail}
            />
            <InputField
              label="Número Celular"
              name="numeroCelular"
              value={formData.numeroCelular}
              onChange={handleChange}
              error={errors.numeroCelular}
              icon={Phone}
            />
          </div>
        </section>

        {/* Residencia & Contratación Laboral (Exclusivo en Editar) */}
        <div className="space-y-5 flex flex-col justify-between">
          <section className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm flex-1">
            <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={16} className="text-blue-600"/> Residencia
              </h3>
            </div>
            <SelectField
              label="Municipio de Residencia"
              name="municipioResidenciaId"
              value={formData.municipioResidenciaId}
              onChange={handleChange}
              options={parametros?.municipios || []}
              displayExpr={m => m.nombre}
              required
              error={errors.municipioResidenciaId}
              placeholder="Seleccione municipio"
            />
            <InputField
              label="Dirección de Residencia"
              name="direccionResidencia"
              value={formData.direccionResidencia}
              onChange={handleChange}
              error={errors.direccionResidencia}
              icon={MapPin}
            />
          </section>

          {/* Esta sección se renderiza ÚNICAMENTE al editar porque el ID del empleado ya existe */}
          {isEditing && (
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-2xl border border-blue-100/70 space-y-4 shadow-sm animate-in zoom-in-95 duration-300">
              <div className="flex flex-col gap-1 pb-2 border-b border-blue-100">
                <h3 className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-600"/> Contratación Laboral
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Este empleado ya posee registro base. Presiona el siguiente botón para crear o modificar los términos de su contrato de trabajo.
              </p>
              <button
                type="button"
                onClick={onManageContract}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-200 hover:shadow-lg active:scale-[0.98]"
              >
                <Plus size={16} />
                Crear / Editar Contrato
              </button>
            </section>
          )}
        </div>

        {/* Bancaria y oficina */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm h-full">
          <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <Banknote size={16} className="text-blue-600"/> Bancaria y Oficina
            </h3>
          </div>
          <SelectField
            label="Banco"
            name="bancoId"
            value={formData.bancoId}
            onChange={handleChange}
            options={parametros?.bancos || []}
            displayExpr={b => b.nombre}
            error={errors.bancoId}
          />
          <SelectField
            label="Medio de Pago"
            name="medioPagoId"
            value={formData.medioPagoId}
            onChange={handleChange}
            options={parametros?.mediosPago || []}
            displayExpr={m => m.nombre}
            error={errors.medioPagoId}
          />
          <InputField
            label="Tipo de Cuenta"
            name="tipoCuenta"
            value={formData.tipoCuenta}
            onChange={handleChange}
            error={errors.tipoCuenta}
            icon={Banknote}
          />
          <InputField
            label="Número de Cuenta"
            name="numeroCuenta"
            value={formData.numeroCuenta}
            onChange={handleChange}
            error={errors.numeroCuenta}
            icon={Hash}
          />
          <SelectField
            label="Municipio de Oficina"
            name="municipioOficinaId"
            value={formData.municipioOficinaId}
            onChange={handleChange}
            options={parametros?.municipios || []}
            displayExpr={m => m.nombre}
            error={errors.municipioOficinaId}
            placeholder="Seleccione municipio"
          />
          <InputField
            label="Dirección de Oficina"
            name="direccionOficina"
            value={formData.direccionOficina}
            onChange={handleChange}
            error={errors.direccionOficina}
            icon={Building2}
          />
        </section>
      </div>

      <StatusModal
        show={showConfirm}
        type="confirm"
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
        message={isEditing ? "¿Actualizar este empleado?" : "¿Registrar este empleado?"}
      />
      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => {
          setResultModal((m) => ({ ...m, show: false }));
          if (resultModal.success) {
            const createdId = initialData?.id;
            onSuccessSave(createdId || '');
          }
        }}
      />
    </div>
  );
};

export default EmpleadosCreatePage;

