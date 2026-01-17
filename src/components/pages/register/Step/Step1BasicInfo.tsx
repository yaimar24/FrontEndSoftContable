import React, { useState } from "react";
import { School, MapPin, Phone } from "lucide-react";
import InputField from "../../../common/InputField";
import SelectField from "../../../common/SelectField";
import { validators } from "../../../../utils/validators";
import { validateForm } from "../../../../utils/validateForm";
import type { Colegio } from "../../../../models/Colegio";
import Button from "../../../common/Button";

// Interfaces Locales
interface Ciudad {
  id: number;
  nombre: string;
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
  ciudades: Ciudad[];
  actividadesEconomicas: ActividadEconomica[];
}

const Step1BasicInfo: React.FC<Step1Props> = ({
  formData,
  handleChange,
  nextStep,
  ciudades,
  actividadesEconomicas,
}) => {
  // Tipamos el estado de errores explícitamente
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    ciudadId: [validators.requiredSelect()],
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
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-2.5 rounded-xl text-[#1e3a8a]">
          <School size={22} />
        </div>
        <h2 className="text-xl font-bold border-b-2 border-blue-500 pr-6 italic">
          Información Institucional
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          label="Ciudad"
          name="ciudadId"
          value={formData.ciudadId || ""}
          onChange={handleChange}
          options={ciudades}
          placeholder="Selecciona Ciudad"
          error={errors.ciudadId}
          displayExpr={(c: Ciudad) => c.nombre} // Tipado en la expresión
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

   <Button 
        onClick={handleNext} 
        fullWidth 
        className="py-5 shadow-xl"
      >
        Siguiente: Datos Legales
      </Button>
    </div>
  );
};

export default Step1BasicInfo;