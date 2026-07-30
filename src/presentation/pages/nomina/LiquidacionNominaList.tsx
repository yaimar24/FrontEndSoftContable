import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/organisms/PageHeader';
import { useLiquidacion } from '../../../application/hooks/nomina/useLiquidacion';
import { Table } from '../../components/organisms/Table';
import Modal from '../../components/organisms/Modal';
import InputField from '../../components/atoms/InputField';
import Button from '../../components/atoms/Button';

export const LiquidacionNominaList: React.FC = () => {
  const navigate = useNavigate();
  const { nominas, fetchNominas, generarNomina, error } = useLiquidacion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ anio: new Date().getFullYear(), mes: new Date().getMonth() + 1 });

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
        actions={<Button variant="primary" onClick={() => setIsModalOpen(true)}>Generar Nómina</Button>}
      />

      {error && <div className="mb-4 text-red-500 bg-red-50 p-2 rounded">{error}</div>}

      <div className="mt-4">
        <Table 
          columns={[
            { header: 'Período', render: (row: any) => `${row.anio}-${String(row.mes).padStart(2, '0')}` },
            { header: 'Total Devengado', render: (row: any) => `$${row.totalDevengado?.toLocaleString()}` },
            { header: 'Total Deducciones', render: (row: any) => `$${row.totalDeducciones?.toLocaleString()}` },
            { header: 'Total Neto', render: (row: any) => `$${row.totalNeto?.toLocaleString()}` },
            { header: 'Estado', render: (row: any) => row.estado === 1 ? 'Borrador' : 'Cerrada' },
          ]}
          data={nominas}
          onView={(row) => navigate(`/dashboard/nomina/liquidacion/${row.id}`)}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generar Nueva Nómina">
        <form onSubmit={handleGenerar} className="space-y-4 pt-4">
          <InputField label="Año" type="number" required value={formData.anio} onChange={(v) => setFormData({...formData, anio: Number(v)})} />
          <InputField label="Mes" type="number" required value={formData.mes} onChange={(v) => setFormData({...formData, mes: Number(v)})} />
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Generar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
