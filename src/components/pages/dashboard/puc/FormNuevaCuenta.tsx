import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { createCuentaContable } from '../../../../services/puc/pucService';

interface Props {
  padre?: { codigo: string; nombre: string };
  hijosExistentes: string[];
  onClose: () => void;
  onSuccess: () => void;
}

const FormNuevaCuenta: React.FC<Props> = ({ padre, hijosExistentes, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [naturaleza, setNaturaleza] = useState('D');
  const [esDetalle, setEsDetalle] = useState(false);

  const sugerirCodigo = () => {
    if (!padre) {
      const raices = hijosExistentes.map(c => parseInt(c)).filter(n => !isNaN(n));
      return (raices.length > 0 ? Math.max(...raices) + 1 : 1).toString();
    }
    const prefijo = padre.codigo;
    const hijos = hijosExistentes
      .filter(c => c.startsWith(prefijo) && c.length > prefijo.length)
      .map(c => parseInt(c.substring(prefijo.length)))
      .filter(n => !isNaN(n));
    const max = hijos.length > 0 ? Math.max(...hijos) : 0;
    return `${prefijo}${(max + 1).toString().padStart(2, '0')}`;
  };

  const [codigo, setCodigo] = useState(sugerirCodigo());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createCuentaContable({ codigo, nombre: nombre.toUpperCase(), codigoPadre: padre?.codigo, naturaleza, esDetalle });
      if (res.success) { onSuccess(); onClose(); }
      else { alert(res.message); }
    } catch (err) { alert("Error de conexión"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Nueva Cuenta</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase">{padre ? `Padre: ${padre.codigo}` : 'Nivel Raíz'}</p>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Código" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500" required />
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre de cuenta" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500 uppercase" required />
            
            <div className="grid grid-cols-2 gap-4">
              <select value={naturaleza} onChange={e => setNaturaleza(e.target.value)} className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none">
                <option value="D">DÉBITO</option>
                <option value="C">CRÉDITO</option>
              </select>
              <button type="button" onClick={() => setEsDetalle(!esDetalle)} className={`rounded-2xl p-4 text-[10px] font-black uppercase transition-all ${esDetalle ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                {esDetalle ? 'Es Movimiento' : 'Es Grupo'}
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 font-bold text-slate-400">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 shadow-lg disabled:opacity-50">
              <Save size={18} /> {loading ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormNuevaCuenta;