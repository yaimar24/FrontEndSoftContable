import React, { useEffect } from 'react';
import PageHeader from '../../components/organisms/PageHeader';
import { Table } from '../../components/organisms/Table';
import { useEmpleadosNomina } from '../../../application/hooks/nomina/useEmpleadosNomina';
import { useNavigate } from 'react-router-dom';

export const EmpleadosNominaList: React.FC = () => {
  const { empleados, fetchEmpleados } = useEmpleadosNomina();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  return (
    <div className="p-6">
      <PageHeader
        title="Gestión de Empleados"
        subtitle="Administrar el personal y contratos de nómina"
        actions={<button className="primary" onClick={() => navigate('/dashboard/nomina/empleados/nuevo')}>Nuevo Empleado</button>}
      />

      <div className="mt-4">
        <Table
          columns={[
            { header: 'Nombre Completo', render: (row: any) => row.nombreCompleto },
            { header: 'Documento', render: (row: any) => row.numeroDocumento },
            { header: 'Correo Electrónico', render: (row: any) => row.correoElectronico },
            { header: 'Estado', render: (row: any) => row.activo ? "Activo" : "Inactivo" },
          ]}
          data={empleados}
          onView={(row) => navigate(`/dashboard/nomina/empleados/${row.id}`)}
          onEdit={(row) => navigate(`/dashboard/nomina/empleados/${row.id}/editar`)}
        />
      </div>
    </div>
  );
};
