import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/organisms/PageHeader';
import { useLiquidacion } from '../../../application/hooks/nomina/useLiquidacion';
import { Table } from '../../components/organisms/Table';
import Button from '../../components/atoms/Button';

export const LiquidacionNominaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentNomina, detalles, fetchNominaById, cerrarNomina, error } = useLiquidacion();

  useEffect(() => {
    if (id) fetchNominaById(id);
  }, [id, fetchNominaById]);

  const handleCerrar = async () => {
    if (confirm('¿Está seguro de cerrar esta nómina? Ya no podrá ser editada.')) {
      await cerrarNomina(id!);
    }
  };

  if (!currentNomina) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <PageHeader 
        title={`Detalle de Nómina ${currentNomina.anio}-${String(currentNomina.mes).padStart(2, '0')}`}
        subtitle={`Estado: ${currentNomina.estado === 1 ? 'Borrador' : 'Cerrada'}`}
        actions={<Button variant="secondary" onClick={() => navigate('/nomina/liquidacion')}>Volver</Button>}
      />

      {error && <div className="mb-4 text-red-500 bg-red-50 p-2 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pt-4">
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <div className="text-gray-500 text-sm">Total Devengado</div>
          <div className="text-xl font-bold">${currentNomina.totalDevengado?.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
          <div className="text-gray-500 text-sm">Total Deducciones</div>
          <div className="text-xl font-bold">${currentNomina.totalDeducciones?.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <div className="text-gray-500 text-sm">Total Neto</div>
          <div className="text-xl font-bold">${currentNomina.totalNeto?.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Detalle por Empleados</h3>
          {currentNomina.estado === 1 && (
            <Button variant="primary" onClick={handleCerrar} className="bg-orange-500 hover:bg-orange-600">
              Cerrar Nómina
            </Button>
          )}
        </div>

        <Table 
          columns={[
            { header: 'Empleado', render: (row: any) => row.empleadoNombre },
            { header: 'Salario Base', render: (row: any) => `$${row.salarioBase?.toLocaleString()}` },
            { header: 'Neto a Pagar', render: (row: any) => `$${row.netoPagar?.toLocaleString()}` }
          ]}
          data={detalles}
        />
      </div>
    </div>
  );
};
