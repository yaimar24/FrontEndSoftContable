import React, { useState } from "react";
import type { ContratoUpdateDTO } from "@/domain/models/Contrato";
import InputField from "@/presentation/components/atoms/InputField";
import SelectField from "@/presentation/components/atoms/SelectField";
import CheckboxCard from "@/presentation/components/atoms/CheckboxCard";
import StatusModal from "@/presentation/components/organisms/StatusModal";
import { useContratoForm } from "@/application/hooks/useContratoForm";
import { Briefcase, Calendar, DollarSign, Save, ArrowLeft, Hash, ShieldCheck } from "lucide-react";
import Button from "@/presentation/components/atoms/Button";

import {
  TipoContratoOptions,
  TipoCotizanteOptions,
  SubtipoCotizanteOptions,
  EpsOptions,
  FondoPensionOptions,
  ArlOptions,
  ClaseRiesgoOptions,
  CajaCompensacionOptions,
  FondoCesantiasOptions,
} from "@/domain/models/Contrato";

interface ContratoCreatePageProps {
  empleadoId: string;
  initialData?: ContratoUpdateDTO | null;
  onBack: () => void;
  onFinish: () => void;
}

const CARGOS = [
  { id: 1, nombre: "Docente" },
  { id: 2, nombre: "Coordinador académico" },
  { id: 3, nombre: "Administrativo" },
  { id: 4, nombre: "Directivo" },
];

const CODIGOS = [
  { id: "01", nombre: "01" },
  { id: "02", nombre: "02" },
  { id: "03", nombre: "03" },
];

type SocialSelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options: { id: string | number; nombre: string }[];
  placeholder?: string;
  required?: boolean;
};
const SocialSelect: React.FC<SocialSelectProps> = ({ options, ...props }) => (
  <SelectField {...props} options={options} displayExpr={(c) => c.nombre} />
);

const ContratoCreatePage: React.FC<ContratoCreatePageProps> = ({
  empleadoId,
  initialData,
  onBack,
  onFinish,
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

  const requiereFechaFin = formData.tipoContrato === "Fijo" || formData.tipoContrato === "Aprendizaje";

  const [datosVisuales, setDatosVisuales] = useState({
    numeroContrato: "",
    tipoCotizanteId: "",
    subtipoCotizanteId: "0",
    epsId: "",
    porcentajeSalud: "4.0",
    fondoPensionId: "",
    porcentajePension: "4.0",
    arlId: "",
    claseRiesgo: "",
    codigo: "",
    cajaCompensacionId: "0",
    fondoCesantiasId: "",
    activaRetencionFuente: false,
  });

  const handleVisualChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDatosVisuales((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm sticky top-4 z-20 border border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors" type="button">
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
          <SocialSelect
            label="Tipo de contrato"
            name="tipoContrato"
            value={formData.tipoContrato}
            onChange={handleChange}
            options={TipoContratoOptions}
            required
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

      <section className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
        <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <Hash size={16} className="text-blue-600" />
          </h3>
        </div>

        <div className="space-y-4">
          <InputField
            label="Número de contrato"
            name="numeroContrato"
            value={datosVisuales.numeroContrato}
            onChange={handleVisualChange}
            icon={Hash}
          />

          <SocialSelect
            label="Cargo"
            name="cargoId"
            value={String(formData.cargoId)}
            onChange={handleChange}
            options={CARGOS}
            placeholder="Seleccione cargo"
            required
          />
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
        <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600" />
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SocialSelect
              label="Tipo de cotizante"
              name="tipoCotizanteId"
              value={datosVisuales.tipoCotizanteId}
              onChange={handleVisualChange}
              options={TipoCotizanteOptions}
              placeholder="Seleccione tipo de cotizante"
              required
            />
            <SocialSelect
              label="Subtipo de cotizante"
              name="subtipoCotizanteId"
              value={datosVisuales.subtipoCotizanteId}
              onChange={handleVisualChange}
              options={SubtipoCotizanteOptions}
              placeholder="Seleccione subtipo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SocialSelect
              label="Fondo de salud (EPS)"
              name="epsId"
              value={datosVisuales.epsId}
              onChange={handleVisualChange}
              options={EpsOptions}
              placeholder="Seleccione EPS"
              required
            />
            <InputField
              type="number"
              label="Porcentaje fondo de salud"
              name="porcentajeSalud"
              value={datosVisuales.porcentajeSalud}
              onChange={handleVisualChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SocialSelect
              label="Fondo de pensiones"
              name="fondoPensionId"
              value={datosVisuales.fondoPensionId}
              onChange={handleVisualChange}
              options={FondoPensionOptions}
              placeholder="Seleccione fondo de pensiones"
              required
            />
            <InputField
              type="number"
              label="Porcentaje fondo de pensiones"
              name="porcentajePension"
              value={datosVisuales.porcentajePension}
              onChange={handleVisualChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SocialSelect
              label="ARL"
              name="arlId"
              value={datosVisuales.arlId}
              onChange={handleVisualChange}
              options={ArlOptions}
              placeholder="Seleccione ARL"
              required
            />
            <SocialSelect
              label="Clase de riesgo"
              name="claseRiesgo"
              value={datosVisuales.claseRiesgo}
              onChange={handleVisualChange}
              options={ClaseRiesgoOptions}
              placeholder="Seleccione clase"
            />
            <SocialSelect
              label="Código"
              name="codigo"
              value={datosVisuales.codigo}
              onChange={handleVisualChange}
              options={CODIGOS}
              placeholder="01"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SocialSelect
              label="Caja de compensación"
              name="cajaCompensacionId"
              value={datosVisuales.cajaCompensacionId}
              onChange={handleVisualChange}
              options={CajaCompensacionOptions}
              placeholder="Seleccione caja de compensación"
            />
            <SocialSelect
              label="Fondo de cesantías"
              name="fondoCesantiasId"
              value={datosVisuales.fondoCesantiasId}
              onChange={handleVisualChange}
              options={FondoCesantiasOptions}
              placeholder="Seleccione fondo de cesantías"
            />
          </div>

          <CheckboxCard
            label="Activar deducciones de retención en la fuente"
            checked={datosVisuales.activaRetencionFuente}
            onChange={() => setDatosVisuales((p) => ({ ...p, activaRetencionFuente: !p.activaRetencionFuente }))}
          />
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