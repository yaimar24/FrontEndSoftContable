import React from "react";
import type { ContratoUpdateDTO } from "@/domain/models/Contrato";
import InputField from "@/presentation/components/atoms/InputField";
import SelectField from "@/presentation/components/atoms/SelectField";
import CheckboxCard from "@/presentation/components/atoms/CheckboxCard";
import StatusModal from "@/presentation/components/organisms/StatusModal";
import { useContratoForm } from "@/application/hooks/useContratoForm";
import { Briefcase, Calendar, DollarSign, Save, ArrowLeft } from "lucide-react";
import Button from "@/presentation/components/atoms/Button";

interface ContratoCreatePageProps {
  empleadoId: string;
  initialData?: ContratoUpdateDTO | null;
  onBack: () => void;
  onFinish: () => void;
}

const ContratoCreatePage: React.FC<ContratoCreatePageProps> = ({ 
  empleadoId, 
  initialData, 
  onBack, 
  onFinish 
}) => {
  const isEditing = !!initialData;
  
  const {
    formData,
    setFormData, 

    errors,

    showConfirm,
    setShowConfirm,

    resultModal,
    setResultModal,

    handleChange,
    handleSaveClick,
    handleConfirmSave,

  } = useContratoForm(empleadoId, initialData);

  
  const tiposContrato = [
    { id: "Indefinido", nombre: "Indefinido" },
    { id: "Fijo", nombre: "Fijo" },
    { id: "Obra o labor", nombre: "Obra o labor" },
    { id: "Aprendizaje", nombre: "Aprendizaje" },
  ];

  const requiereFechaFin = formData.tipoContrato === "Fijo" || formData.tipoContrato === "Aprendizaje";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 animate-in fade-in duration-500">
      
    
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm sticky top-4 z-20 border border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
            type="button"
          >
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <h1 className="text-lg font-black text-slate-800 uppercase flex items-center gap-2 tracking-tight">
            <Briefcase size={22} className="text-blue-600" />
            {isEditing ? "Editar Contrato" : "Datos del Contrato"}
          </h1>
        </div>
        <Button onClick={handleSaveClick} icon={Save}>
          {isEditing ? "Actualizar" : "Guardar y finalizar"}
        </Button>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
        <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <Briefcase size={16} className="text-blue-600" />
          </h3>
        </div>

        <div className="space-y-4">
          <SelectField
            label="Tipo de contrato"
            name="tipoContrato"
            value={formData.tipoContrato}
            onChange={handleChange}
            options={tiposContrato}
            displayExpr={(t) => t.nombre}
            required
            error={errors.tipoContrato}
            placeholder="Seleccione tipo de contrato"
          />

          <InputField
            type="date"
            label="Fecha inicio de contrato"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleChange}
            error={errors.fechaInicio}
            icon={Calendar}
            required
          />

          {requiereFechaFin && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <InputField
                type="date"
                label="Fecha fin de contrato"
                name="fechaFin"
                value={formData.fechaFin || ""}
                onChange={handleChange}
                error={errors.fechaFin}
                icon={Calendar}
                required
              />
            </div>
          )}

          <InputField
            type="number"
            label="Sueldo"
            name="salarioBase"
            value={formData.salarioBase === 0 ? "" : formData.salarioBase}
            onChange={handleChange}
            error={errors.salarioBase}
            icon={DollarSign}
            allowDecimals
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <CheckboxCard
              label="Auxilio de transporte"
              checked={formData.auxilioTransporte}
              onChange={() => setFormData((p) => ({ ...p, auxilioTransporte: !p.auxilioTransporte }))}
            />
            <CheckboxCard
              label="Aplica horas extra"
              checked={formData.aplicaHorasExtra}
              onChange={() => setFormData((p) => ({ ...p, aplicaHorasExtra: !p.aplicaHorasExtra }))}
            />
          </div>
        </div>
      </section>

      <StatusModal
        show={showConfirm}
        type="confirm"
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
        message={isEditing ? "¿Actualizar este contrato?" : "¿Guardar este contrato?"}
      />
      
      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => {
          setResultModal((m) => ({ ...m, show: false }));
          if (resultModal.success) onFinish();
        }}
      />
    </div>
  );
};

export default ContratoCreatePage;