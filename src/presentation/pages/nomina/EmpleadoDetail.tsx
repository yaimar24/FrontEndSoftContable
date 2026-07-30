import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Save, ArrowLeft } from 'lucide-react';
import { useEmpleadosNomina } from '../../../application/hooks/nomina/useEmpleadosNomina';
import InputField from '../../components/atoms/InputField';
import SelectField from '../../components/atoms/SelectField';
import Button from '../../components/atoms/Button';
import StatusModal from '../../components/organisms/StatusModal';

import { ContratoTab } from './tabs/ContratoTab';
import { SeguridadSocialTab } from './tabs/SeguridadSocialTab';
import { NovedadesTab } from './tabs/NovedadesTab';

import { getParametros, getParametrosFacturacion } from '../../../data/services/colegio/parametrosService';
import { catalogosNominaService } from '../../../data/services/nomina/catalogosNominaService';

export const EmpleadoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchEmpleadoById, saveEmpleado, error } = useEmpleadosNomina();
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: '' });

  // Listas de datos
  const [tiposIdentificacion, setTiposIdentificacion] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [mediosPago, setMediosPago] = useState<any[]>([]);
  const [bancos, setBancos] = useState<any[]>([]);
  
  const [tiposCuenta] = useState([
    { id: 1, nombre: 'Ahorros' },
    { id: 2, nombre: 'Corriente' }
  ]);

  useEffect(() => {
    // Cargar parámetros
    const loadParametros = async () => {
      try {
        const paramRes = await getParametros();
        if (paramRes.success && paramRes.data) {
          setTiposIdentificacion(paramRes.data.tiposIdentificacion || []);
          setMunicipios(paramRes.data.municipios || []);
        }

        const paramFactRes = await getParametrosFacturacion();
        if (paramFactRes.success && paramFactRes.data) {
          setMediosPago(paramFactRes.data.mediosPago || []);
        }

        const bancosRes = await catalogosNominaService.getBancos();
        if (bancosRes?.data) setBancos(bancosRes.data);
        else if (Array.isArray(bancosRes)) setBancos(bancosRes);

      } catch (err) {
        console.error('Error cargando parámetros en EmpleadoDetail:', err);
      }
    };
    loadParametros();
  }, []);

  useEffect(() => {
    if (id && id !== 'nuevo') {
      fetchEmpleadoById(id).then(data => {
        if(data) setFormData(data);
      });
    } else {
      setFormData({
        nombres: '', apellidos: '', tipoIdentificacionId: 1, numeroDocumento: '', 
        correoElectronico: '', numeroCelular: '', activo: true
      });
    }
  }, [id, fetchEmpleadoById]);

  const handleSaveInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData) return;
    try {
      await saveEmpleado(formData, id !== 'nuevo' ? id : undefined);
      setResultModal({ show: true, success: true, message: 'Empleado guardado exitosamente.' });
      setShowConfirm(false);
    } catch (error) {
      setResultModal({ show: true, success: false, message: 'Error al guardar el empleado.' });
      setShowConfirm(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'Información General' },
    { id: 'contrato', label: 'Contrato Laboral', disabled: id === 'nuevo' },
    { id: 'seguridadSocial', label: 'Seguridad Social', disabled: id === 'nuevo' },
    { id: 'novedades', label: 'Novedades', disabled: id === 'nuevo' },
  ];

  if (!formData) return <div>Cargando...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20 px-4 animate-in fade-in duration-500">
      <StatusModal 
        show={showConfirm} type="confirm" onConfirm={() => handleSaveInfo()} 
        onClose={() => setShowConfirm(false)} 
        message={id === 'nuevo' ? 'Â¿Crear este nuevo empleado?' : 'Â¿Actualizar informaciÃ³n del empleado?'} 
      />
      <StatusModal 
        show={resultModal.show} success={resultModal.success} message={resultModal.message} 
        onClose={() => { setResultModal(m => ({ ...m, show: false })); if (resultModal.success && id === 'nuevo') navigate('/dashboard/nomina/empleados'); }} 
      />

      <div className="tuto-empleados-sticky-header flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm sticky top-4 z-20 border border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/nomina/empleados')} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <h1 className="text-lg font-black text-slate-800 uppercase flex items-center gap-2 tracking-tight">
            <Users size={22} className="text-blue-600" /> 
            {id === 'nuevo' ? 'Nuevo Empleado' : 'Detalle de Empleado'}
          </h1>
        </div>
        {(activeTab === 'info') && (
          <Button onClick={() => setShowConfirm(true)} icon={Save}>
            {id === 'nuevo' ? 'Guardar' : 'Actualizar'}
          </Button>
        )}
      </div>

      {error && <div className="mb-4 text-red-500 bg-red-50 p-2 rounded">{error}</div>}

      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <li className="mr-2" key={tab.id}>
              <button
                disabled={tab.disabled}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${tab.disabled ? 'text-gray-400 cursor-not-allowed' : activeTab === tab.id ? 'border-primary text-primary font-semibold' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded shadow p-6">
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Nombres" value={formData.nombres} onChange={(e: any) => setFormData({...formData, nombres: e.target.value})} required />
            <InputField label="Apellidos" value={formData.apellidos} onChange={(e: any) => setFormData({...formData, apellidos: e.target.value})} required />
            
            <SelectField 
              label="Tipo Documento" 
              value={formData.tipoIdentificacionId || ''} 
              onChange={(e: any) => setFormData({...formData, tipoIdentificacionId: Number(e.target.value)})} 
              options={tiposIdentificacion}
              displayExpr={(item) => item.nombreCorto || item.nombreCorto === '' ? `${item.nombreCorto} - ${item.nombre}` : item.nombre}
              required 
            />
            
            <InputField label="Documento" value={formData.numeroDocumento} onChange={(e: any) => setFormData({...formData, numeroDocumento: e.target.value})} required />
            <InputField label="Correo Electrónico" value={formData.correoElectronico} onChange={(e: any) => setFormData({...formData, correoElectronico: e.target.value})} required type="email" />
            <InputField label="Celular" value={formData.numeroCelular} onChange={(e: any) => setFormData({...formData, numeroCelular: e.target.value})} required />
            <InputField label="Dirección Residencia" value={formData.direccionResidencia || ''} onChange={(e: any) => setFormData({...formData, direccionResidencia: e.target.value})} />
            
            <SelectField 
              label="Municipio Residencia" 
              value={formData.municipioResidenciaId || ''} 
              onChange={(e: any) => setFormData({...formData, municipioResidenciaId: Number(e.target.value)})} 
              options={municipios}
              displayExpr={(item) => `${item.nombre} - ${item.departamento}`}
            />
            
            <InputField label="Dirección Oficina" value={formData.direccionOficina || ''} onChange={(e: any) => setFormData({...formData, direccionOficina: e.target.value})} />
            
            <SelectField 
              label="Municipio Oficina" 
              value={formData.municipioOficinaId || ''} 
              onChange={(e: any) => setFormData({...formData, municipioOficinaId: Number(e.target.value)})} 
              options={municipios}
              displayExpr={(item) => `${item.nombre} - ${item.departamento}`}
            />
            
            <SelectField 
              label="Medio de Pago" 
              value={formData.medioPagoId || ''} 
              onChange={(e: any) => setFormData({...formData, medioPagoId: Number(e.target.value)})} 
              options={mediosPago}
            />
            
            <SelectField 
              label="Banco" 
              value={formData.bancoId || ''} 
              onChange={(e: any) => setFormData({...formData, bancoId: Number(e.target.value)})} 
              options={bancos}
            />
            
            <SelectField 
              label="Tipo de Cuenta" 
              value={formData.tipoCuenta || ''} 
              onChange={(e: any) => setFormData({...formData, tipoCuenta: Number(e.target.value)})} 
              options={tiposCuenta}
            />
            
            <InputField label="Número Cuenta" value={formData.numeroCuenta || ''} onChange={(e: any) => setFormData({...formData, numeroCuenta: e.target.value})} />
            
            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <Button type="submit" variant="primary">Guardar Información</Button>
            </div>
          </form>
        )}

        {activeTab === 'contrato' && (
          <ContratoTab empleadoId={id!} />
        )}

        {activeTab === 'seguridadSocial' && (
          <SeguridadSocialTab empleadoId={id!} />
        )}

        {activeTab === 'novedades' && (
          <NovedadesTab empleadoId={id!} />
        )}
      </div>
    </div>
  );
};
