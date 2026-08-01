import React, { useEffect, useState } from 'react';
import { useSeguridadSocial } from '../../../../application/hooks/nomina/useSeguridadSocial';
import { useContrato } from '../../../../application/hooks/nomina/useContrato';
import InputField from '../../../components/atoms/InputField';
import SelectField from '../../../components/atoms/SelectField';
import Button from '../../../components/atoms/Button';

interface Props {
  empleadoId: string;
}

export const SeguridadSocialTab: React.FC<Props> = ({ empleadoId }) => {
  const { catalogos, fetchCatalogos } = useContrato(); 
  const { seguridadSocial, fetchSeguridadSocial, saveSeguridadSocial, error } = useSeguridadSocial(empleadoId);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchCatalogos();
    fetchSeguridadSocial();
  }, [fetchCatalogos, fetchSeguridadSocial]);

  useEffect(() => {
    if (seguridadSocial) {
      setFormData(seguridadSocial);
    } else {
      setFormData({
        empleadoId,
        tipoCotizanteId: '', subtipoCotizanteId: '', epsId: '', porcentajeSalud: 4.0,
        fondoPensionId: '', porcentajePension: 4.0, arlId: '', claseRiesgo: '',
        actividadEconomicaId: '', codigoActividad: '', cajaCompensacionId: '', fondoCesantiasId: ''
      });
    }
  }, [seguridadSocial, empleadoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSeguridadSocial(formData);
  };

  const toOptions = (items: any[], placeholder = "Seleccione...") => {
    if (!items) return []; // Quitamos el placeholder inyectado directamente a los datos
    return items.map(i => ({ value: i.id.toString(), label: i.nombre }));
  };

  if (!catalogos) return <div>Cargando catálogos...</div>;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {error && <div className="col-span-full text-red-500 bg-red-50 p-2 rounded">{error}</div>}

      <SelectField label="Tipo Cotizante" required 
        value={formData.tipoCotizanteId?.toString() || ''} 
        options={toOptions(catalogos.tipoCotizante)} 
        onChange={(e: any) => {
           const newTipoCotizanteId = Number(e.target ? e.target.value : e);
           const subtiposFiltrados = catalogos.subtipoCotizante?.filter((s: any) => 
               !newTipoCotizanteId || s.tipoCotizanteId === newTipoCotizanteId || s.tipoCotizanteId === 0
           ) || [];
           
           setFormData({
               ...formData, 
               tipoCotizanteId: newTipoCotizanteId,
               subtipoCotizanteId: subtiposFiltrados.length === 1 ? subtiposFiltrados[0].id : formData.subtipoCotizanteId
           });
        }} 
      />
      <SelectField label="Subtipo Cotizante" required 
        value={formData.subtipoCotizanteId?.toString() || ''} 
        options={toOptions(catalogos.subtipoCotizante?.filter((s:any) => 
            !formData.tipoCotizanteId || s.tipoCotizanteId === Number(formData.tipoCotizanteId) || s.tipoCotizanteId === 0
        ))} 
        onChange={(e: any) => setFormData({...formData, subtipoCotizanteId: Number(e.target ? e.target.value : e)})} 
      />
      
      <SelectField label="EPS" required value={formData.epsId?.toString() || ''} options={toOptions(catalogos.eps)} onChange={(e: any) => setFormData({...formData, epsId: Number(e.target ? e.target.value : e)})} />
      <InputField label="Porcentaje Salud" type="number" required value={formData.porcentajeSalud || ''} onChange={(e: any) => setFormData({...formData, porcentajeSalud: Number(e.target ? e.target.value : e)})} />
      
      <SelectField label="Fondo Pensión" required value={formData.fondoPensionId?.toString() || ''} options={toOptions(catalogos.fondoPension)} onChange={(e: any) => setFormData({...formData, fondoPensionId: Number(e.target ? e.target.value : e)})} />
      <InputField label="Porcentaje Pensión" type="number" required value={formData.porcentajePension || ''} onChange={(e: any) => setFormData({...formData, porcentajePension: Number(e.target ? e.target.value : e)})} />
      
      <SelectField label="ARL" required value={formData.arlId?.toString() || ''} options={toOptions(catalogos.arl)} onChange={(e: any) => setFormData({...formData, arlId: Number(e.target ? e.target.value : e)})} />
      <SelectField label="Clase Riesgo" required value={formData.claseRiesgo?.toString() || ''} options={toOptions(catalogos.claseRiesgo)} onChange={(e: any) => setFormData({...formData, claseRiesgo: Number(e.target ? e.target.value : e)})} />
      
      <InputField label="Código Actividad" required value={formData.codigoActividad || ''} onChange={(e: any) => setFormData({...formData, codigoActividad: e.target ? e.target.value : e})} />
      
      <SelectField label="Caja Compensación" required value={formData.cajaCompensacionId?.toString() || ''} options={toOptions(catalogos.cajaCompensacion)} onChange={(e: any) => setFormData({...formData, cajaCompensacionId: Number(e.target ? e.target.value : e)})} />
      <SelectField label="Fondo Cesantías" required value={formData.fondoCesantiasId?.toString() || ''} options={toOptions(catalogos.fondoCesantias)} onChange={(e: any) => setFormData({...formData, fondoCesantiasId: Number(e.target ? e.target.value : e)})} />

      <div className="col-span-full flex justify-end mt-4">
        <Button type="submit" variant="primary">Guardar Seguridad Social</Button>
      </div>
    </form>
  );
};
