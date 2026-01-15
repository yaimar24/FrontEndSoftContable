import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { Save, X } from 'lucide-react';
import { buscarEnPucMaestro, createCuentaContable } from '../../services/puc/pucService';

interface Props {
  padre?: { codigo: string; nombre: string };
  onClose: () => void;
  onSuccess: () => void;
}

const FormNuevaCuenta: React.FC<Props> = ({ padre, onClose, onSuccess }) => {
  const [codigo, setCodigo] = useState(padre ? padre.codigo : '');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  // Efecto para buscar el nombre en el PUC maestro si el código cambia
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (codigo.length >= 4) {
        try {
          const sug = await buscarEnPucMaestro(codigo);
          if (sug) setNombre(sug.nombre);
        } catch (e) { /* No se encontró, el usuario escribe el nombre */ }
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [codigo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCuentaContable({ 
        codigo, 
        nombre, 
        codigoPadre: padre?.codigo 
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error al crear la cuenta. Verifique el código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-[#1e3a8a] p-8 text-white">
          <h2 className="text-2xl font-black uppercase tracking-tight">Nueva Cuenta</h2>
          <p className="text-blue-200 text-xs font-bold uppercase mt-1">
            {padre ? `Subcuenta de: ${padre.nombre} (${padre.codigo})` : 'Cuenta de Nivel Raíz'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-2">Código de Cuenta</label>
              <input 
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 focus:ring-0 transition-all"
                placeholder="Ej: 11050501"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-2">Nombre de la Cuenta</label>
              <input 
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 focus:ring-0 transition-all uppercase"
                placeholder="Ej: CAJA GENERAL AUXILIAR"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4" >
            <Button variant="secondary" onClick={onClose} fullWidth icon={X}>Cancelar</Button>
            <Button type="submit" disabled isLoading={loading} fullWidth icon={Save}>Guardar Cuenta</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormNuevaCuenta;