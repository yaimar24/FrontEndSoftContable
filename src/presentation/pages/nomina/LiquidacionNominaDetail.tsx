import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/organisms/PageHeader';
import { useLiquidacion } from '../../../application/hooks/nomina/useLiquidacion';
import { Table } from '../../components/organisms/Table';
import Button from '../../components/atoms/Button';
import { novedadesService } from '../../../data/services/nomina/novedadesService';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const LiquidacionNominaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentNomina, detalles, fetchNominaById, cerrarNomina, error } = useLiquidacion();
  
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [novedadesByEmpleado, setNovedadesByEmpleado] = useState<Record<string, any[]>>({});
  const [loadingNovedades, setLoadingNovedades] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) fetchNominaById(id);
  }, [id, fetchNominaById]);

  const handleCerrar = async () => {
    if (confirm('¿Está seguro de cerrar esta nómina? Ya no podrá ser editada.')) {
      await cerrarNomina(id!);
    }
  };
  
  const toggleRow = async (empleadoId: string) => {
    const isExpanded = !!expandedRows[empleadoId];
    
    setExpandedRows(prev => ({
      ...prev,
      [empleadoId]: !isExpanded
    }));

    if (!isExpanded && !novedadesByEmpleado[empleadoId]) {
      setLoadingNovedades(prev => ({ ...prev, [empleadoId]: true }));
      try {
        const novedadesRes = await novedadesService.getNovedadesByEmpleado(empleadoId);
        const novedadesData = novedadesRes?.data || novedadesRes || [];
        setNovedadesByEmpleado(prev => ({
          ...prev,
          [empleadoId]: Array.isArray(novedadesData) ? novedadesData : []
        }));
      } catch (err) {
        console.error("Error al cargar novedades", err);
        setNovedadesByEmpleado(prev => ({ ...prev, [empleadoId]: [] }));
      } finally {
        setLoadingNovedades(prev => ({ ...prev, [empleadoId]: false }));
      }
    }
  };

  if (!currentNomina) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <PageHeader 
        title={`Detalle de Nómina ${currentNomina.anio}-${String(currentNomina.mes).padStart(2, '0')}`}
        subtitle={`Estado: ${currentNomina.estado === 1 ? 'Borrador' : 'Cerrada'}`}
        actions={<Button variant="secondary" onClick={() => navigate('/dashboard/nomina/liquidacion')}>Volver</Button>}
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

<div className="bg-white rounded shadow p-4 overflow-x-auto">
        <div className="flex justify-between items-center mb-4 min-w-max">
          <h3 className="text-lg font-bold">Detalle por Empleados</h3>
          {currentNomina.estado === 1 && (
            <Button variant="primary" onClick={handleCerrar} className="bg-orange-500 hover:bg-orange-600">
              Cerrar Nómina
            </Button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse min-w-max">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-5 text-left text-[9.5px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">Detalle</th>
                  <th className="px-5 py-5 text-left text-[9.5px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">Identificación</th>
                  <th className="px-5 py-5 text-left text-[9.5px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">Empleado</th>
                  <th className="px-5 py-5 text-left text-[9.5px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">Contrato ID</th>
                  <th className="px-5 py-5 text-left text-[9.5px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">Salario Base</th>
                  <th className="px-5 py-5 text-left text-[9.5px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">Tot. Devengado</th>
                  <th className="px-5 py-5 text-left text-[9.5px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">Tot. Deducciones</th>
                  <th className="px-5 py-5 text-left text-[9.5px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">Neto a Pagar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {detalles.length > 0 ? detalles.map((row: any, i: number) => {
                  const isExpanded = !!expandedRows[row.empleadoId];
                  const isLoading = !!loadingNovedades[row.empleadoId];
                  const novedades = novedadesByEmpleado[row.empleadoId] || [];

                  return (
                    <React.Fragment key={i}>
                      <tr className="group transition-colors hover:bg-blue-50/20">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <button onClick={() => toggleRow(row.empleadoId)} className="text-blue-500 hover:text-blue-700 bg-blue-50/50 p-1.5 px-3 rounded-md inline-flex items-center gap-1 text-xs">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            Novedades
                          </button>
                        </td>
                        <td className="px-5 py-4.5 sm:py-5 text-xs text-slate-600 font-medium">
                           {row.empleadoDocumento || row.numeroDocumento || row.empleadoIdentificacion || '-'}
                        </td>
                        <td className="px-5 py-4.5 sm:py-5 text-xs text-slate-600 font-medium">{row.empleadoNombre}</td>
                        <td className="px-5 py-4.5 sm:py-5 text-xs font-medium">
                          {row.contratoId ? (
                            <button 
                              onClick={() => window.open(`/dashboard/nomina/empleados/${row.empleadoId}?tab=contrato`, '_blank')}
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              {row.contratoId}
                            </button>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4.5 sm:py-5 text-xs text-slate-600 font-medium">${row.salarioBase?.toLocaleString()}</td>
                        <td className="px-5 py-4.5 sm:py-5 text-xs text-slate-600 font-medium">${row.totalDevengado?.toLocaleString()}</td>
                        <td className="px-5 py-4.5 sm:py-5 text-xs text-slate-600 font-medium">${row.totalDeducciones?.toLocaleString()}</td>
                        <td className="px-5 py-4.5 sm:py-5 text-xs font-bold text-blue-600">${row.netoPagar?.toLocaleString()}</td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50 border-none">
                          <td colSpan={8} className="p-0 border-none">
                            <div className="p-4 pl-12">
                              <h4 className="text-sm font-bold mb-2 text-slate-700">Desglose de Novedades</h4>
                              {isLoading ? (
                                <div className="text-xs text-slate-500 py-2">Cargando novedades...</div>
                              ) : novedades.length === 0 ? (
                                <div className="text-xs text-slate-500 py-2 italic font-medium">No se registran novedades para este empleado.</div>
                              ) : (
                                <table className="w-full max-w-3xl text-left border-collapse bg-white rounded shadow-sm border border-slate-200">
                                  <thead>
                                    <tr className="bg-slate-100 border-b border-slate-200">
                                      <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase">Concepto</th>
                                      <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                                      <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase w-1/3">Observación</th>
                                      <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase text-right">Valor</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {novedades.map((n: any, idx: number) => (
                                      <tr key={idx} className="hover:bg-slate-50 text-xs text-slate-800">
                                        <td className="px-3 py-2 flex items-center gap-2">
                                          {n.esIngreso ? (
                                            <span className="w-2 h-2 rounded-full bg-green-500" title="Devengado"></span>
                                          ) : (
                                            <span className="w-2 h-2 rounded-full bg-red-500" title="Deducción"></span>
                                          )}
                                          {n.conceptoNombre || n.tipoNovedad || 'Concepto'}
                                        </td>
                                        <td className="px-3 py-2 text-slate-500">{n.fecha ? new Date(n.fecha).toLocaleDateString() : '-'}</td>
                                        <td className="px-3 py-2 text-slate-500 italic max-w-xs truncate" title={n.observacion || ''}>{n.observacion || '-'}</td>
                                        <td className="px-3 py-2 text-right font-medium">${n.valor?.toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wide">
                      No hay detalles de empleados registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
