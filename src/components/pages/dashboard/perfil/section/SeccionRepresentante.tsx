import { UserCheck, Hash } from 'lucide-react';
import InputField from '../../../../common/InputField';
import SelectField from '../../../../common/SelectField';


interface Props {
  representantes: any[];
  tiposId: any[];
  onRepChange: (index: number, field: string, value: any) => void;
}

export const SeccionRepresentante = ({ representantes, tiposId, onRepChange }: Props) => (
  <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
      <UserCheck size={14} className="text-purple-500"/> Representante Legal
    </h3>
    {representantes?.map((rep, index) => (
      <div key={rep.id || index} className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
        <InputField 
          label="Nombre" 
          name="Nombre" 
          value={rep.nombre} 
          onChange={(e) => onRepChange(index, 'nombre', e.target.value)} 
          icon={UserCheck} 
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField 
            name='Identificación'
            label="Identificacion" 
            value={rep.numeroIdentificacion} 
            onChange={(e) => onRepChange(index, 'numeroIdentificacion', e.target.value)} 
            icon={Hash} 
          />
          <SelectField 
            label="Tipo"
            name="Tipo"
            value={rep.tipoIdentificacionId}
            onChange={(e) => onRepChange(index, 'tipoIdentificacionId', e.target.value)}
            options={tiposId}
            displayExpr={(t) => t.nombre}
          />
        </div>
      </div>
    ))}
  </section>
);