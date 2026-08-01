import React, { useEffect, useState } from 'react';
import { useContrato } from '../../../../application/hooks/nomina/useContrato';
import { useCatalogosNomina } from '../../../../application/hooks/nomina/useCatalogosNomina';
import InputField from '../../../components/atoms/InputField';
import SelectField from '../../../components/atoms/SelectField';
import Button from '../../../components/atoms/Button';
import Modal from '../../../components/organisms/Modal';

interface Props {
  empleadoId: string;
}

export const ContratoTab: React.FC<Props> = ({ empleadoId }) => {
  const { contrato, catalogos, fetchContrato, fetchCatalogos, saveContrato, error } = useContrato(empleadoId);
  const { saveCargo, saveCentroCosto } = useCatalogosNomina();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});
  
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'cargo' | 'centroCosto' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catalogoData, setCatalogoData] = useState<any>({});

  const handleCreateCatalogo = (type: 'cargo' | 'centroCosto', title: string) => {
    setModalType(type);
    setModalTitle(title);
    setCatalogoData({ nombre: '', descripcion: '', codigo: '' });
    setIsModalOpen(true);
  };

  const handleSaveCatalogo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === 'cargo') {
        await saveCargo(catalogoData);
      } else if (modalType === 'centroCosto') {
        await saveCentroCosto(catalogoData);
      }
      setIsModalOpen(false);
      fetchCatalogos(); // Recargar los catálogos del contrato para ver el nuevo registro
    } catch (e) {
      alert("Error al guardar el catálogo");
    }
  };

  useEffect(() => {
    fetchCatalogos();
    fetchContrato();
  }, [fetchCatalogos, fetchContrato]);

  useEffect(() => {
    let isMounted = true;
    if (contrato && isMounted) {
      setTimeout(() => setFormData(contrato), 0);
    } else if (isMounted) {
      setTimeout(() => setFormData({
        empleadoId: empleadoId,
        cargoId: '', centroCostoId: '', tipoContratoId: '', salarioBase: 0,
        fechaInicio: '', fechaFin: '', tipoCotizante: '', subtipoCotizante: '',
        eps: '', fondoPension: '', arl: '', claseRiesgo: '', cajaCompensacion: '',
        fondoCesantias: '', auxilioTransporte: false, aplicaHorasExtra: false
      }), 0);
    }
    return () => { isMounted = false; };
  }, [contrato, empleadoId]);

  // Manejar default values para cotizaSalud y cotizaPension si no vienen
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      if (formData.cotizaSalud === undefined) setFormData((prev: any) => ({ ...prev, cotizaSalud: true }));
      if (formData.cotizaPension === undefined) setFormData((prev: any) => ({ ...prev, cotizaPension: true }));
    }
  }, [formData.cotizaSalud, formData.cotizaPension]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveContrato(formData);
      
      // Emit details update event or handle tab change directly
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'seguridadSocial');
      window.history.pushState({}, '', url);
      // We trigger a custom event so parent can listen to it if wanted without full reload
      window.dispatchEvent(new Event('popstate'));
    } catch (e) {
      // El error ya es manejado por el hook que setea la variable global error
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toOptions = (items: any[]) => {
    if (!items) return []; // Quitamos el placeholder inyectado directamente a los datos
    return items.map(i => ({ value: i.id.toString(), label: i.nombre }));
  };

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
     if (contrato?.id) {
         setMostrarFormulario(true);
     }
  }, [contrato]);

  if (!catalogos) return <div>Cargando catálogos...</div>;

  if (!mostrarFormulario) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <div className="bg-amber-50 text-amber-600 p-4 rounded-xl border border-amber-100 max-w-md text-center shadow-sm">
            <h3 className="font-bold text-lg mb-1">Sin contrato registrado</h3>
            <p className="text-sm">Actualmente el empleado no posee un contrato laboral activo en el sistema. Debes crearle uno para poder ingresarlo a la nómina y afiliarlo a la seguridad social.</p>
          </div>
          <Button onClick={() => setMostrarFormulario(true)} variant="primary">Crear Contrato Laboral</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
      {error && <div className="col-span-full text-red-500 bg-red-50 p-2 rounded">{error}</div>}
      
      <div className="col-span-full border-b pb-2 mb-2 font-semibold">Información del contrato</div>
      
      <InputField label="Salario Base" type="number" required
        value={formData.salarioBase || ''} 
        onChange={(e: any) => setFormData({...formData, salarioBase: Number(e.target ? e.target.value : e)})} 
      />
      <InputField label="Fecha Inicio" type="date" required
        value={formData.fechaInicio?.split('T')[0] || ''} 
        onChange={(e: any) => setFormData({...formData, fechaInicio: e.target ? e.target.value : e})} 
      />
      <InputField label="Fecha Fin" type="date" 
        value={formData.fechaFin?.split('T')[0] || ''} 
        onChange={(e: any) => setFormData({...formData, fechaFin: e.target ? e.target.value : e})} 
      />
      
      <SelectField label="Tipo Contrato" required
        value={formData.tipoContratoId?.toString() || ''}
        options={toOptions(catalogos.tipoContrato)}
        onChange={(e: any) => setFormData({...formData, tipoContratoId: Number(e.target ? e.target.value : e)})}
      />

      <SelectField label="Cargo" required
        value={formData.cargoId?.toString() || ''}
        options={toOptions(catalogos.cargos)}
        onChange={(e: any) => setFormData({...formData, cargoId: Number(e.target ? e.target.value : e)})}
        onCreate={() => handleCreateCatalogo('cargo', 'Crear Cargo')}
      />

      <SelectField label="Centro de Costo" required
        value={formData.centroCostoId?.toString() || ''}
        options={toOptions(catalogos.centrosCosto)}
        onChange={(e: any) => setFormData({...formData, centroCostoId: Number(e.target ? e.target.value : e)})}
        onCreate={() => handleCreateCatalogo('centroCosto', 'Crear Centro de Costo')}
      />

      <div className="col-span-full border-b pb-2 mb-2 mt-4 font-semibold">Opciones de Liquidación</div>
      <div className="flex gap-4 col-span-full">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!formData.cotizaSalud} onChange={e => {
            const checked = e.target.checked;
            setFormData({
               ...formData, 
               cotizaSalud: checked,
               porcentajeSaludEmpleado: checked ? formData.porcentajeSaludEmpleado : 0
            });
          }} />
          Cotiza Salud
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!formData.cotizaPension} onChange={e => {
            const checked = e.target.checked;
            setFormData({
               ...formData, 
               cotizaPension: checked,
               porcentajePensionEmpleado: checked ? formData.porcentajePensionEmpleado : 0
            });
          }} />
          Cotiza Pensión
        </label>
      </div>
      
      {!formData.cotizaSalud && !formData.cotizaPension ? (
         <div className="col-span-full bg-slate-50 border border-slate-200 text-slate-600 p-4 rounded-xl flex items-center justify-center italic text-sm mb-2 mt-2">
            Este contrato no tendrá descuentos de salud/pensión en nómina.
         </div>
      ) : null}

      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
         <InputField 
           label="Porcentaje Salud Empleado %" 
           type="number" 
           required={formData.cotizaSalud}
           disabled={!formData.cotizaSalud}
           min="0" max="100" step="0.01"
           value={formData.porcentajeSaludEmpleado ?? ''} 
           onChange={(e: any) => setFormData({...formData, porcentajeSaludEmpleado: Number(e.target ? e.target.value : e)})} 
         />
         <InputField 
           label="Porcentaje Pensión Empleado %" 
           type="number" 
           required={formData.cotizaPension}
           disabled={!formData.cotizaPension}
           min="0" max="100" step="0.01"
           value={formData.porcentajePensionEmpleado ?? ''} 
           onChange={(e: any) => setFormData({...formData, porcentajePensionEmpleado: Number(e.target ? e.target.value : e)})} 
         />
      </div>

      <div className="col-span-full border-b pb-2 mb-2 mt-4 font-semibold">Opciones</div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!formData.auxilioTransporte} onChange={e => setFormData({...formData, auxilioTransporte: e.target.checked})} />
          Aplica Auxilio de Transporte
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!formData.aplicaHorasExtra} onChange={e => setFormData({...formData, aplicaHorasExtra: e.target.checked})} />
          Aplica Horas Extras
        </label>
      </div>

      <div className="col-span-full flex justify-end mt-4">
        <Button type="submit" variant="primary">Guardar Contrato</Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <form onSubmit={handleSaveCatalogo} className="space-y-4">
          {modalType === 'centroCosto' && (
             <InputField label="Código" value={catalogoData.codigo || ''} onChange={(e: any) => setCatalogoData({...catalogoData, codigo: e.target ? e.target.value : e})} required />
          )}
          <InputField label="Nombre" value={catalogoData.nombre || ''} onChange={(e: any) => setCatalogoData({...catalogoData, nombre: e.target ? e.target.value : e})} required />
          {modalType === 'cargo' && (
             <InputField label="Descripción" value={catalogoData.descripcion || ''} onChange={(e: any) => setCatalogoData({...catalogoData, descripcion: e.target ? e.target.value : e})} />
          )}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar</Button>
          </div>
        </form>
      </Modal>
    </form>
  );
};
