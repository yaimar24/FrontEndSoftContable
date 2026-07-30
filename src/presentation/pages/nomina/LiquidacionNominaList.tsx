import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/organisms/PageHeader';
import { useLiquidacion } from '../../../application/hooks/nomina/useLiquidacion';
import { Table } from '../../components/organisms/Table';
import Modal from '../../components/organisms/Modal';
import Button from '../../components/atoms/Button';
import { getYears, months } from '@/utils/dateOptions';

export const LiquidacionNominaList: React.FC = () => {
  const navigate = useNavigate();
  const { nominas, fetchNominas, generarNomina, error } = useLiquidacion();

  const years = getYears();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    anio: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    tipoPeriodo: 3,
    fechaGeneracion: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchNominas();
  }, [fetchNominas]);

  const handleGenerar = async (e: React.FormEvent) => {
    e.preventDefault();
    await generarNomina(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Liquidación de Nómina"
        subtitle="Administra y genera las nóminas periódicas"
        actions={
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
          >
            Generar Nómina
          </Button>
        }
      />

      {error && (
        <div className="mb-4 rounded bg-red-50 p-2 text-red-500">
          {error}
        </div>
      )}

      <div className="mt-4">
        <Table
          columns={[
            {
              header: 'Período',
              render: (row: any) =>
                `${row.anio}-${String(row.mes).padStart(2, '0')}`,
            },
            {
              header: 'Total Devengado',
              render: (row: any) =>
                `$${row.totalDevengado?.toLocaleString()}`,
            },
            {
              header: 'Total Deducciones',
              render: (row: any) =>
                `$${row.totalDeducciones?.toLocaleString()}`,
            },
            {
              header: 'Total Neto',
              render: (row: any) =>
                `$${row.totalNeto?.toLocaleString()}`,
            },
            {
              header: 'Estado',
              render: (row: any) =>
                row.estado === 1 ? 'Borrador' : 'Cerrada',
            },
          ]}
          data={nominas}
          onView={(row) =>
            navigate(`/dashboard/nomina/liquidacion/${row.id}`)
          }
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generar Nueva Nómina"
      >
        <form onSubmit={handleGenerar} className="space-y-4 pt-4">

          {/* Año */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Año
            </label>
            <select
              className="border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
              value={formData.anio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  anio: Number(e.target.value),
                })
              }
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Mes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Mes
            </label>
            <select
              className="border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
              value={formData.mes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mes: Number(e.target.value),
                })
              }
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de periodo */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tipo Periodo
            </label>
            <select
              className="border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
              value={formData.tipoPeriodo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipoPeriodo: Number(e.target.value),
                })
              }
            >
              <option value={1}>Semanal</option>
              <option value={2}>Quincenal</option>
              <option value={3}>Mensual</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>

            <Button variant="primary" type="submit">
              Generar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};