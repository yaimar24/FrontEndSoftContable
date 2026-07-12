import { useState } from "react";
import type { EmpleadoCreateDTO, EmpleadoUpdateDTO } from "@/domain/models/Empleado";
import InputField from "@/presentation/components/atoms/InputField";
import SelectField from "@/presentation/components/atoms/SelectField";
import Button from "@/presentation/components/atoms/Button";
import { crearEmpleado, updateEmpleado } from "@/data/services/empleado/empleadoService";

interface EmpleadosCreatePageProps {
  initialData?: EmpleadoUpdateDTO | null;
  onBack: () => void;
}

const defaultValues: EmpleadoCreateDTO = {
  nombres: "",
  apellidos: "",
  tipoIdentificacionId: 0,
  numeroDocumento: "",
  correoElectronico: "",
  numeroCelular: "",
  municipioResidenciaId: 0,
  direccionResidencia: "",
  medioPagoId: 0,
  bancoId: 0,
  tipoCuenta: 1,
  numeroCuenta: "",
  municipioOficinaId: 0,
  direccionOficina: "",
};

const EmpleadosCreatePage = ({ initialData, onBack }: EmpleadosCreatePageProps) => {
  const [form, setForm] = useState<EmpleadoCreateDTO>(initialData || defaultValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if ((initialData as EmpleadoUpdateDTO)?.id) {
        await updateEmpleado((initialData as EmpleadoUpdateDTO).id, { ...form, id: (initialData as EmpleadoUpdateDTO).id, activo: (initialData as EmpleadoUpdateDTO).activo });
      } else {
        await crearEmpleado(form);
      }
      onBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">{initialData ? "Editar Empleado" : "Registrar Empleado"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Nombres" name="nombres" value={form.nombres} onChange={handleChange} required />
        <InputField label="Apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} required />
        <InputField label="Número de Documento" name="numeroDocumento" value={form.numeroDocumento} onChange={handleChange} required />
        <InputField label="Correo Electrónico" name="correoElectronico" value={form.correoElectronico} onChange={handleChange} required />
        <InputField label="Número Celular" name="numeroCelular" value={form.numeroCelular} onChange={handleChange} />
        <InputField label="Dirección Residencia" name="direccionResidencia" value={form.direccionResidencia} onChange={handleChange} />
        <InputField label="Dirección Oficina" name="direccionOficina" value={form.direccionOficina} onChange={handleChange} />
        <InputField label="Número de Cuenta" name="numeroCuenta" value={form.numeroCuenta} onChange={handleChange} />
        {/* Selects para tipoIdentificacionId, municipioResidenciaId, medioPagoId, bancoId, tipoCuenta, municipioOficinaId */}
        <SelectField label="Tipo de Identificación" name="tipoIdentificacionId" value={form.tipoIdentificacionId} onChange={handleChange} options={[]} displayExpr={item => item?.label || ""} required />
        <SelectField label="Municipio Residencia" name="municipioResidenciaId" value={form.municipioResidenciaId} onChange={handleChange} options={[]} displayExpr={item => item?.label || ""} />
        <SelectField label="Medio de Pago" name="medioPagoId" value={form.medioPagoId} onChange={handleChange} options={[]} displayExpr={item => item?.label || ""} />
        <SelectField label="Banco" name="bancoId" value={form.bancoId} onChange={handleChange} options={[]} displayExpr={item => item?.label || ""} />
        <SelectField label="Tipo de Cuenta" name="tipoCuenta" value={form.tipoCuenta} onChange={handleChange} options={[{ label: "Ahorros", value: 1 }, { label: "Corriente", value: 2 }]} displayExpr={item => item?.label || ""} />
        <SelectField label="Municipio Oficina" name="municipioOficinaId" value={form.municipioOficinaId} onChange={handleChange} options={[]} displayExpr={item => item?.label || ""} />
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="button" variant="secondary" onClick={onBack} disabled={loading}>Volver</Button>
        <Button type="submit" isLoading={loading}>{initialData ? "Actualizar" : "Registrar"}</Button>
      </div>
    </form>
  );
};

export default EmpleadosCreatePage;
