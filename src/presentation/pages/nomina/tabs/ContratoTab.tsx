import React, { useEffect, useState } from 'react';
import { useContrato } from '../../../../application/hooks/nomina/useContrato';
import InputField from '../../../components/atoms/InputField';
import SelectField from '../../../components/atoms/SelectField';
import Button from '../../../components/atoms/Button';

interface Props {
  empleadoId: string;
}

export const ContratoTab: React.FC<Props> = ({ empleadoId }) => {
  const { contrato, catalogos, fetchContrato, fetchCatalogos, saveContrato, error } = useContrato(empleadoId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});

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
        cargoId: '', centroCostoId: '', tipoContrato: '', salarioBase: 0,
        fechaInicio: '', fechaFin: '', tipoCotizante: '', subtipoCotizante: '',
        eps: '', fondoPension: '', arl: '', claseRiesgo: '', cajaCompensacion: '',
        fondoCesantias: '', auxilioTransporte: false, aplicaHorasExtra: false
      }), 0);
    }
    return () => { isMounted = false; };
  }, [contrato, empleadoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveContrato(formData);
      alert('Contrato guardado correctamente');
    } catch (e) {
      // El error ya es manejado por el hook que setea la variable global error
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toOptions = (items: any[], placeholder = "Seleccione...") => {
    if (!items) return [{value: '', label: placeholder}];
    return [{value: '', label: placeholder}, ...items.map(i => ({ value: i.id.toString(), label: i.nombre }))];
  };

  if (!catalogos) return <div>Cargando catálogos...</div>;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        value={formData.tipoContrato || ''}
        options={toOptions(catalogos.tipoContrato)}
        onChange={(e: any) => setFormData({...formData, tipoContrato: e.target ? e.target.value : e})}
      />

      <SelectField label="Cargo" required
        value={formData.cargoId?.toString() || ''}
        options={toOptions(catalogos.cargos)}
        onChange={(e: any) => setFormData({...formData, cargoId: Number(e.target ? e.target.value : e)})}
      />

      <SelectField label="Centro de Costo" required
        value={formData.centroCostoId?.toString() || ''}
        options={toOptions(catalogos.centrosCosto)}
        onChange={(e: any) => setFormData({...formData, centroCostoId: Number(e.target ? e.target.value : e)})}
      />

      <div className="col-span-full border-b pb-2 mb-2 mt-4 font-semibold">Seguridad Social base</div>

      <SelectField label="Tipo Cotizante" required
        value={formData.tipoCotizante?.toString() || ''}
        options={toOptions(catalogos.tipoCotizante)}
        onChange={(e: any) => {
           const newTipoCotizante = Number(e.target ? e.target.value : e);
           const subtiposFiltrados = catalogos.subtipoCotizante?.filter((s: any) => 
               !newTipoCotizante || s.tipoCotizanteId === newTipoCotizante || s.tipoCotizanteId === 0
           ) || [];
           
           setFormData({
               ...formData, 
               tipoCotizante: newTipoCotizante,
               // Si solo hay un subtipo cotizante luego del filtro (ej: No aplica), seleccionarlo por defecto automáticamente
               subtipoCotizante: subtiposFiltrados.length === 1 ? subtiposFiltrados[0].id : formData.subtipoCotizante
           });
        }}
      />
      <SelectField label="Subtipo Cotizante" required
        value={formData.subtipoCotizante?.toString() || ''}
        options={toOptions(catalogos.subtipoCotizante?.filter((s: { tipoCotizanteId: number, [key: string]: unknown }) => 
            !formData.tipoCotizante || s.tipoCotizanteId === Number(formData.tipoCotizante) || s.tipoCotizanteId === 0
        ))}
        onChange={(e: any) => setFormData({...formData, subtipoCotizante: Number(e.target ? e.target.value : e)})}
      />
      <SelectField label="EPS" required value={formData.eps?.toString() || ''} options={toOptions(catalogos.eps)} onChange={(e: any) => setFormData({...formData, eps: Number(e.target ? e.target.value : e)})} />
      <SelectField label="Fondo Pensión" required value={formData.fondoPension?.toString() || ''} options={toOptions(catalogos.fondoPension)} onChange={(e: any) => setFormData({...formData, fondoPension: Number(e.target ? e.target.value : e)})} />
      <SelectField label="ARL" required value={formData.arl?.toString() || ''} options={toOptions(catalogos.arl)} onChange={(e: any) => setFormData({...formData, arl: Number(e.target ? e.target.value : e)})} />
      <SelectField label="Clase Riesgo" required value={formData.claseRiesgo?.toString() || ''} options={toOptions(catalogos.claseRiesgo)} onChange={(e: any) => setFormData({...formData, claseRiesgo: Number(e.target ? e.target.value : e)})} />
      <SelectField label="Caja Compensación" required value={formData.cajaCompensacion?.toString() || ''} options={toOptions(catalogos.cajaCompensacion)} onChange={(e: any) => setFormData({...formData, cajaCompensacion: Number(e.target ? e.target.value : e)})} />
      <SelectField label="Fondo Cesantías" required value={formData.fondoCesantias?.toString() || ''} options={toOptions(catalogos.fondoCesantias)} onChange={(e: any) => setFormData({...formData, fondoCesantias: Number(e.target ? e.target.value : e)})} />

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
    </form>
  );
};
