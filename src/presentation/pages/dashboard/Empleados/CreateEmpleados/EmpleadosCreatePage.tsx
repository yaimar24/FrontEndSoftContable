import React from "react";
import type { EmpleadoUpdateDTO } from "@/domain/models/Empleado";

interface EmpleadosCreatePageProps {
  initialData?: EmpleadoUpdateDTO | null;
  onBack: () => void;
}

const EmpleadosCreatePage: React.FC<EmpleadosCreatePageProps> = ({ initialData, onBack }) => {
  // Aquí va el formulario reutilizando InputField, SelectField, etc.
  // Puedes adaptar el formulario de terceros o el anterior de empleados
  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{initialData ? "Editar Empleado" : "Registrar Empleado"}</h2>
      {/* Formulario aquí */}
      <button className="mt-4 btn btn-secondary" onClick={onBack}>Volver</button>
    </div>
  );
};

export default EmpleadosCreatePage;
