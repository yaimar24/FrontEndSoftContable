import React, { useEffect, useState } from 'react';
import { useNovedades } from '../../../../application/hooks/nomina/useNovedades';
import { Table } from '../../../components/organisms/Table';
import Modal from '../../../components/organisms/Modal';
import InputField from '../../../components/atoms/InputField';
import Button from '../../../components/atoms/Button';
import SelectField from '../../../components/atoms/SelectField';
import type { NovedadNomina } from '../../../../data/services/nomina/novedadesService';

interface Props {
  empleadoId: string;
}

export const NovedadesTab: React.FC<Props> = ({ empleadoId }) => {
  const { novedades, fetchNovedades, addNovedad, removeNovedad, error } = useNovedades(empleadoId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({ empleadoId, tipoNovedad: '', valor: '', fecha: '', observacion: '' });

  useEffect(() => {
    fetchNovedades();
  }, [fetchNovedades]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDelete = async (item: any) => {
    if (confirm('¿Está seguro de eliminar esta novedad?')) {
      await removeNovedad(item.id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNovedad({
      ...formData,
      valor: Number(formData.valor)
    });
    setIsModalOpen(false);
    setFormData({ empleadoId, tipoNovedad: '', valor: '', fecha: '', observacion: '' });
  };

  return (
    <div>
      {error && <div className="mb-4 text-red-500 bg-red-50 p-2 rounded">{error}</div>}
      
      <div className="flex justify-end mb-4">
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>Agregar Novedad</Button>
      </div>

      <Table 
        columns={[
          { header: 'Tipo', render: (row: NovedadNomina) => row.tipoNovedad },
          { header: 'Valor', render: (row: NovedadNomina) => `$${Number(row.valor).toLocaleString()}` },
          { header: 'Fecha', render: (row: NovedadNomina) => row.fecha.split('T')[0] },
          { header: 'Observación', render: (row: NovedadNomina) => row.observacion }
        ]}
        data={novedades}
        onDelete={handleDelete}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agregar Novedad">
        <form onSubmit={handleSave} className="space-y-4 pt-4">
          <SelectField 
            label="Tipo de Novedad" 
            value={formData.tipoNovedad} 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => setFormData({...formData, tipoNovedad: e.target ? e.target.value : e})}
            required
            options={[
              { value: '', label: 'Seleccione...' },
              { value: 'HorasExtra', label: 'Horas Extra' },
              { value: 'Bono', label: 'Bonificación' },
              { value: 'Descuento', label: 'Deducción / Descuento' }
            ]}
          />
          <InputField label="Valor" type="number" required value={formData.valor} onChange={(v: React.ChangeEvent<HTMLInputElement> | string | number) => { const value = typeof v === 'object' && 'target' in v ? v.target.value : v; setFormData({...formData, valor: Number(value)}); }} />
          <InputField label="Fecha" type="date" required value={formData.fecha} onChange={(v: React.ChangeEvent<HTMLInputElement> | string | number) => { const value = typeof v === 'object' && 'target' in v ? v.target.value : v; setFormData({...formData, fecha: value.toString()}); }} />
          <InputField label="Observación" value={formData.observacion} onChange={(v: React.ChangeEvent<HTMLInputElement> | string | number) => { const value = typeof v === 'object' && 'target' in v ? v.target.value : v; setFormData({...formData, observacion: value.toString()}); }} />

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar Novedad</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
