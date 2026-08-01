import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
import { useCatalogosNomina } from '../../../application/hooks/nomina/useCatalogosNomina';
import { useContrato } from '../../../application/hooks/nomina/useContrato';
import Modal from '../../components/organisms/Modal';

export const EmpleadoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchEmpleadoById, saveEmpleado, error } = useEmpleadosNomina();
  const { saveBanco } = useCatalogosNomina();
  const { contrato, fetchContrato } = useContrato(id !== 'nuevo' ? id : undefined);
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info');
  const [formData, setFormData] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: '' });

  // Listas de datos
  const [tiposIdentificacion, setTiposIdentificacion] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [mediosPago, setMediosPago] = useState<any[]>([]);
  const [bancos, setBancos] = useState<any[]>([]);

  // Estados locales para los selects anidados de Residencia y Oficina
  const [departamentoResidenciaId, setDepartamentoResidenciaId] = useState<string>('');
  const [departamentoOficinaId, setDepartamentoOficinaId] = useState<string>('');
  
  const [isBancoModalOpen, setIsBancoModalOpen] = useState(false);
  const [bancoFormData, setBancoFormData] = useState({ codigo: '', nombre: '' });
  
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
          setDepartamentos(paramRes.data.departamentos || []);
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
      fetchContrato();
      fetchEmpleadoById(id).then(data => {
        if(data) {
          setFormData(data);
          // Al cargar, inferimos los departamentos desde los IDs de los municipios que vengan
          if (data.municipioResidenciaId && municipios.length > 0) {
             const m = municipios.find(x => x.id === Number(data.municipioResidenciaId));
             if (m) setDepartamentoResidenciaId(String(m.departamentoId));
          }
          if (data.municipioOficinaId && municipios.length > 0) {
             const m = municipios.find(x => x.id === Number(data.municipioOficinaId));
             if (m) setDepartamentoOficinaId(String(m.departamentoId));
          }
        }
      });
    } else {
      setFormData({
        nombres: '', apellidos: '', tipoIdentificacionId: 1, numeroDocumento: '', 
        correoElectronico: '', numeroCelular: '', activo: true
      });
    }
  }, [id, fetchEmpleadoById, municipios]);

  const handleSaveInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData) return;
    try {
      const response = await saveEmpleado(formData, id !== 'nuevo' ? id : undefined);
      
      if (response && response.success === false) {
        setResultModal({ show: true, success: false, message: response.message || 'Error al guardar el empleado.' });
        setShowConfirm(false);
        return;
      }
      
      setResultModal({ show: true, success: true, message: 'Empleado guardado exitosamente.' });
      setShowConfirm(false);
      
      // Si se acaba de crear el empleado ('nuevo') redirigirlo a la url de su ID para que se quede en esta pestaña
      if (id === 'nuevo') {
         const newId = response?.data?.id || response?.id || response?.data?.data?.id;
         if (newId) {
             navigate(`/dashboard/nomina/empleados/${newId}?tab=contrato`, { replace: true });
         }
      } else {
         const url = new URL(window.location.href);
         url.searchParams.set('tab', 'contrato');
         window.history.pushState({}, '', url);
         window.dispatchEvent(new Event('popstate'));
      }
    } catch (error: any) {
      setResultModal({ show: true, success: false, message: error.message || 'Error al guardar el empleado.' });
      setShowConfirm(false);
    }
  };

  const handleCreateBanco = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveBanco(bancoFormData as any);
      setIsBancoModalOpen(false);
      // Recargar la lista de bancos
      const bancosRes = await catalogosNominaService.getBancos();
      if (bancosRes?.data) setBancos(bancosRes.data);
      else if (Array.isArray(bancosRes)) setBancos(bancosRes);
    } catch (err) {
      alert("Error al guardar el banco");
    }
  };
  // Sync activeTab when query string changes directly (e.g. from internal forwards)
  useEffect(() => {
    const handlePopState = () => {
      const qs = new URLSearchParams(window.location.search);
      const tab = qs.get('tab');
      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
  }
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
        onClose={() => { setResultModal(m => ({ ...m, show: false })); }} 
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
          <Button type="submit" form="empleado-info-form" icon={Save}>
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
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded shadow p-6">
        {activeTab === 'info' && (
          <form id="empleado-info-form" onSubmit={handleSaveInfo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Formulario info general... */}
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
            <InputField label="Dirección Residencia" value={formData.direccionResidencia || ''} onChange={(e: any) => setFormData({...formData, direccionResidencia: e.target.value})} required />
            
            <SelectField 
              label="Departamento Residencia" 
              value={departamentoResidenciaId} 
              onChange={(e) => {
                setDepartamentoResidenciaId(e.target.value);
                setFormData({...formData, municipioResidenciaId: ''});
              }} 
              options={departamentos}
              required
            />

            <SelectField 
              label="Municipio Residencia" 
              value={formData.municipioResidenciaId || ''} 
              onChange={(e: any) => setFormData({...formData, municipioResidenciaId: Number(e.target.value)})} 
              options={municipios.filter(m => m.departamentoId === Number(departamentoResidenciaId))}
              displayExpr={(item) => item.nombre}
              disabled={!departamentoResidenciaId}
              required
            />
            
            <InputField label="Dirección Oficina" value={formData.direccionOficina || ''} onChange={(e: any) => setFormData({...formData, direccionOficina: e.target.value})} required />
            
             <SelectField 
              label="Departamento Oficina" 
              value={departamentoOficinaId} 
              onChange={(e) => {
                setDepartamentoOficinaId(e.target.value);
                setFormData({...formData, municipioOficinaId: ''});
              }} 
              options={departamentos}
              required
            />

            <SelectField 
              label="Municipio Oficina" 
              value={formData.municipioOficinaId || ''} 
              onChange={(e: any) => setFormData({...formData, municipioOficinaId: Number(e.target.value)})} 
              options={municipios.filter(m => m.departamentoId === Number(departamentoOficinaId))}
              displayExpr={(item) => item.nombre}
              disabled={!departamentoOficinaId}
              required
            />
            
            <SelectField 
              label="Medio de Pago" 
              value={formData.medioPagoId || ''} 
              onChange={(e: any) => setFormData({...formData, medioPagoId: Number(e.target.value)})} 
              options={mediosPago}
              required
            />
            
            <SelectField 
              label="Banco" 
              value={formData.bancoId || ''} 
              onChange={(e: any) => setFormData({...formData, bancoId: Number(e.target.value)})} 
              options={bancos}
              onCreate={() => {
                setBancoFormData({ codigo: '', nombre: '' });
                setIsBancoModalOpen(true);
              }}
              required
            />
            
            <SelectField 
              label="Tipo de Cuenta" 
              value={formData.tipoCuenta || ''} 
              onChange={(e: any) => setFormData({...formData, tipoCuenta: Number(e.target.value)})} 
              options={tiposCuenta}
              required
            />
            
            <InputField label="Número Cuenta" value={formData.numeroCuenta || ''} onChange={(e: any) => setFormData({...formData, numeroCuenta: e.target.value})} required />
            
            {/* Removed redundant button guardando with global Save */}
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
      
      {/* Modal para catálogos directos en el Formulario del Empleado */}
      <Modal isOpen={isBancoModalOpen} onClose={() => setIsBancoModalOpen(false)} title="Crear Banco">
        <form onSubmit={handleCreateBanco} className="space-y-4">
           <InputField label="Código" value={bancoFormData.codigo || ''} onChange={(e: any) => setBancoFormData({...bancoFormData, codigo: e.target ? e.target.value : e})} required />
           <InputField label="Nombre" value={bancoFormData.nombre || ''} onChange={(e: any) => setBancoFormData({...bancoFormData, nombre: e.target ? e.target.value : e})} required />
           <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
             <Button variant="secondary" onClick={() => setIsBancoModalOpen(false)}>Cancelar</Button>
             <Button type="submit" variant="primary">Guardar</Button>
           </div>
        </form>
      </Modal>

    </div>
  );
};
