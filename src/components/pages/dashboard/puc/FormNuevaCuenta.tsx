import React, { useState } from 'react';
import { Save, Hash, BookOpen, Activity } from 'lucide-react';
import { createCuentaContable } from '../../../../services/puc/pucService';
import InputField from '../../../common/InputField';
import Button from '../../../common/Button';
import Modal from '../../../common/Modal'; // Importamos el nuevo Modal

interface Props {
  padre?: { codigo: string; nombre: string };
  hijosExistentes: string[];
  isOpen: boolean; // Nueva prop
  onClose: () => void;
  onSuccess: () => void;
}

const FormNuevaCuenta: React.FC<Props> = ({ padre, hijosExistentes, isOpen, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [naturaleza, setNaturaleza] = useState('D');
  const [esDetalle, setEsDetalle] = useState(false);

  // Lógica de sugerencia de código (igual a la anterior)
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
    try {
      const res = await createCuentaContable({ 
        codigo, 
        nombre: nombre.toUpperCase(), 
        codigoPadre: padre?.codigo, 
        naturaleza, 
        esDetalle 
      });
      if (res.success) { onSuccess(); onClose(); } 
      else { alert(res.message); }
    } catch (err) { alert("Error de conexión"); } 
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Nueva Cuenta" 
      subtitle={padre ? `Depende de: ${padre.codigo}` : 'Nivel Principal'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-5">
          <InputField
            label="Código de Cuenta"
            name="codigo"
            icon={Hash}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ej: 110505"
            required
          />

          <InputField
            label="Nombre de la Cuenta"
            name="nombre"
            icon={BookOpen}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: CAJA GENERAL"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Naturaleza
              </label>
              <div className="relative">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <select 
                  value={naturaleza} 
                  onChange={e => setNaturaleza(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:border-blue-500 appearance-none text-slate-700"
                >
                  <option value="D">DÉBITO</option>
                  <option value="C">CRÉDITO</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                ¿Es Cuenta Auxiliar?
              </label>
              <label className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 cursor-pointer hover:bg-slate-100 transition-all border-dashed">
                <input 
                  type="checkbox"
                  checked={esDetalle}
                  onChange={(e) => setEsDetalle(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">PERMITE MOVIMIENTOS</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth icon={Save}>
            Registrar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FormNuevaCuenta;