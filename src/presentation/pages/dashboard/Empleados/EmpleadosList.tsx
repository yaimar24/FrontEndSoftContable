import { useEffect, useState } from "react";
import type { EmpleadoUpdateDTO } from "@/domain/models/Empleado";
import { getEmpleados } from "@/data/services/empleado/empleadoService";
import { Table } from "@/presentation/components/organisms/Table";
import Button from "@/presentation/components/atoms/Button";

interface EmpleadosListProps {
  onEdit: (empleado: EmpleadoUpdateDTO) => void;
}

const EmpleadosList = ({ onEdit }: EmpleadosListProps) => {
  const [empleados, setEmpleados] = useState<EmpleadoUpdateDTO[]>([]);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    // setLoading(true);
    getEmpleados()
      .then((res) => {
        setEmpleados(Array.isArray(res.data) ? res.data : []);
      })
      // .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Empleados registrados</h2>
      </div>
      <Table
        columns={[
          { header: "Nombres", render: (row) => row.nombres },
          { header: "Apellidos", render: (row) => row.apellidos },
          { header: "Documento", render: (row) => row.numeroDocumento },
          { header: "Correo", render: (row) => row.correoElectronico },
          { header: "Activo", render: (row) => row.activo ? "Sí" : "No" },
          {
            header: "Acciones",
            render: (row) => (
              <Button
                variant="secondary"
                onClick={() => onEdit(row)}
                className="text-xs"
              >
                Editar
              </Button>
            ),
          },
        ]}
        data={empleados}
        // loading={loading}
        // emptyMessage="No hay empleados registrados."
      />
    </div>
  );
};

export default EmpleadosList;
