import React, { useState } from "react";
import { Link } from "react-router-dom";
import { School, MapPin, Phone } from "lucide-react";
import InputField from "../../../components/atoms/InputField";
import SelectField from "../../../components/atoms/SelectField";
import { validators } from "../../../../utils/validators";
import { validateForm } from "../../../../utils/validateForm";
import type { Colegio } from "../../../../domain/models/Colegio";
import Button from "../../../components/atoms/Button";

// Interfaces Locales
interface Departamento {
  id: number;
  nombre: string;
}

interface Municipio {
  id: number;
  nombre: string;
  departamentoId: number;
}

interface ActividadEconomica {
  id: number;
  codigo: string;
  descripcion: string;
}

interface Step1Props {
  formData: Partial<Colegio>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  nextStep: () => void;
  departamentos: Departamento[];
  municipios: Municipio[];
  actividadesEconomicas: ActividadEconomica[];
}

const Step1BasicInfo: React.FC<Step1Props> = ({
  formData,
  handleChange,
  nextStep,
  departamentos,
  municipios,
  actividadesEconomicas,
}) => {
  // Tipamos el estado de errores explícitamente
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<string>("");

  const municipiosFiltrados = municipios.filter(
    (m) => m.departamentoId === Number(selectedDepartamentoId)
  );

  const schema = {
    nombreColegio: [validators.required()],
    nit: [
      validators.required(),
      validators.onlyNumbers(),
      validators.minLength(9),
    ],
    direccion: [validators.required()],
    telefono: [
      validators.required(),
      validators.onlyNumbers(),
      validators.minLength(7),
    ],
    municipioId: [validators.requiredSelect()],
    actividadEconomicaId: [validators.requiredSelect()],
  };

  const handleNext = () => {
    // Asumimos que validateForm devuelve Record<string, string>
    const validationErrors = validateForm(formData, schema) as Record<string, string>;

    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-2.5 rounded-xl text-[#1e3a8a]">
          <School size={22} />
        </div>
        <h2 className="text-xl font-bold border-b-2 border-blue-500 pr-6 italic">
          Información Institucional
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          label="Nombre de la Institución"
          name="nombreColegio"
          value={formData.nombreColegio || ""}
          onChange={handleChange}
          required
          error={errors.nombreColegio}
        />

        <InputField
          label="NIT"
          name="nit"
          value={formData.nit || ""}
          onChange={handleChange}
          required
          error={errors.nit}
          onlyNumbers
          maxLength={10}
        />

        <InputField
          label="Dirección"
          name="direccion"
          value={formData.direccion || ""}
          onChange={handleChange}
          required
          error={errors.direccion}
          icon={MapPin}
        />

        <InputField
          label="Teléfono"
          name="telefono"
          value={formData.telefono || ""}
          onChange={handleChange}
          required
          error={errors.telefono}
          icon={Phone}
          onlyNumbers
          maxLength={10}
        />

        <SelectField
          label="Departamento"
          name="departamentoId"
          value={selectedDepartamentoId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedDepartamentoId(e.target.value);
            handleChange({ target: { name: "municipioId", value: "" } } as React.ChangeEvent<HTMLSelectElement>);
          }}
          options={departamentos || []}
          placeholder="Selecciona Departamento"
          displayExpr={(d: Departamento) => d.nombre}
        />

        <SelectField
          label="Municipio"
          name="municipioId"
          value={formData.municipioId || ""}
          onChange={handleChange}
          options={municipiosFiltrados}
          placeholder="Selecciona Municipio"
          error={errors.municipioId}
          displayExpr={(c: Municipio) => c.nombre} // Tipado en la expresión
          disabled={!selectedDepartamentoId}
        />

        <SelectField
          label="Actividad Económica (CIIU)"
          name="actividadEconomicaId"
          value={formData.actividadEconomicaId || ""}
          onChange={handleChange}
          options={actividadesEconomicas}
          placeholder="Selecciona Actividad"
          error={errors.actividadEconomicaId}
          displayExpr={(a: ActividadEconomica) =>
            `${a.codigo} - ${a.descripcion?.substring(0, 40)}...`
          }
        />
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-6 border-t border-slate-100">
        <Button 
          variant="primary" 
          onClick={handleNext} 
          className="flex-1"
        >
          Siguiente
        </Button>
      </div>

      {/* Enlace a Login */}
      <div className="text-center pt-4">
        <p className="text-sm text-slate-600 font-medium">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-[#1e3a8a] hover:text-[#1e3a8a]/80 font-bold underline transition-colors"
          >
            Ir al Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
