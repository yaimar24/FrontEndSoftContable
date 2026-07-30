import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/organisms/PageHeader';
import { useCatalogosNomina } from '../../../application/hooks/nomina/useCatalogosNomina';
import { Table } from '../../components/organisms/Table';
import Modal from '../../components/organisms/Modal';
import InputField from '../../components/atoms/InputField';
import SelectField from '../../components/atoms/SelectField';
import Button from '../../components/atoms/Button';

export const ConfiguracionNomina: React.FC = () => {
  const { 
    cargos, fetchCargos, saveCargo, removeCargo, 
    centrosCosto, fetchCentrosCosto, saveCentroCosto, removeCentroCosto,
    bancos, fetchBancos, saveBanco, removeBanco,
    conceptos, fetchConceptos, saveConcepto, removeConcepto,
    error 
  } = useCatalogosNomina();
  
  const [activeTab, setActiveTab] = useState('cargos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'cargos') fetchCargos();
    if (activeTab === 'centroCosto') fetchCentrosCosto();
    if (activeTab === 'bancos') fetchBancos();
    if (activeTab === 'conceptos') fetchConceptos();
  }, [activeTab, fetchCargos, fetchCentrosCosto, fetchBancos, fetchConceptos]);

  const handleCreate = () => {
    if (activeTab === 'cargos') setFormData({ nombre: '', descripcion: '' });
    if (activeTab === 'centroCosto' || activeTab === 'bancos') setFormData({ codigo: '', nombre: '' });
    if (activeTab === 'conceptos') setFormData({ nombre: '', descripcion: '', tipoConcepto: 1 });
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      if (activeTab === 'cargos') await removeCargo(item.id);
      if (activeTab === 'centroCosto') await removeCentroCosto(item.id);
      if (activeTab === 'bancos') await removeBanco(item.id);
      if (activeTab === 'conceptos') await removeConcepto(item.id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      if (activeTab === 'cargos') await saveCargo(formData, formData.id);
      if (activeTab === 'centroCosto') await saveCentroCosto(formData, formData.id);
      if (activeTab === 'bancos') await saveBanco(formData, formData.id);
      if (activeTab === 'conceptos') await saveConcepto(formData, formData.id);
      setIsModalOpen(false);
    }
  };

  const tabs = [
    { id: 'cargos', label: 'Cargos' },
    { id: 'centroCosto', label: 'Centros de Costo' },
    { id: 'bancos', label: 'Bancos' },
    { id: 'conceptos', label: 'Conceptos de Nómina' },
  ];

  return (
    <div className="p-6">
      <PageHeader 
        title="Configuración de Nómina" 
        subtitle="Administra los catálogos base para el módulo de nómina" 
        actions={<Button variant="primary" onClick={handleCreate}>Agregar</Button>}
      />
      
      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <li className="mr-2" key={tab.id}>
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === tab.id ? 'border-primary text-primary font-semibold' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 bg-white rounded shadow p-4">
        {activeTab === 'cargos' && (
          <Table 
            columns={[
              { header: 'ID', render: (row: any) => row.id },
              { header: 'Nombre', render: (row: any) => row.nombre },
              { header: 'Descripción', render: (row: any) => row.descripcion },
            ]}
            data={cargos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {(activeTab === 'centroCosto' || activeTab === 'bancos') && (
          <Table 
            columns={[
              { header: 'ID', render: (row: any) => row.id },
              { header: 'Código', render: (row: any) => row.codigo },
              { header: 'Nombre', render: (row: any) => row.nombre },
            ]}
            data={activeTab === 'centroCosto' ? centrosCosto : bancos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {activeTab === 'conceptos' && (
          <Table 
            columns={[
              { header: 'ID', render: (row: any) => row.id },
              { header: 'Nombre', render: (row: any) => row.nombre },
              { header: 'Descripción', render: (row: any) => row.descripcion },
              { header: 'Tipo Concepto', render: (row: any) => row.tipoConcepto === 1 ? 'Devengo' : row.tipoConcepto === 2 ? 'Deducción' : 'Provisión' },
            ]}
            data={conceptos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData?.id ? "Editar Registro" : "Crear Registro"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {(activeTab === 'centroCosto' || activeTab === 'bancos') && (
            <InputField
              label="Código"
              value={formData?.codigo || ''}
              onChange={(val) => setFormData((prev: any) => ({...prev!, codigo: val}))}
              required
            />
          )}
          
          <InputField
            label="Nombre"
            value={formData?.nombre || ''}
            onChange={(val) => setFormData((prev: any) => ({...prev!, nombre: val}))}
            required
          />
          
          {(activeTab === 'cargos' || activeTab === 'conceptos') && (
            <InputField
              label="Descripción"
              value={formData?.descripcion || ''}
              onChange={(val) => setFormData((prev: any) => ({...prev!, descripcion: val}))}
            />
          )}

          {activeTab === 'conceptos' && (
            <SelectField
              label="Tipo Concepto"
              value={formData?.tipoConcepto?.toString() || '1'}
              onChange={(val: any) => setFormData((prev: any) => ({...prev!, tipoConcepto: parseInt(val.target ? val.target.value : val)}))}
              options={[
                { value: '1', label: 'Devengo' },
                { value: '2', label: 'Deducción' },
                { value: '3', label: 'Provisión' },
              ]}
              required
            />
          )}

          <div className="mt-4 flex justify-end gap-2 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
