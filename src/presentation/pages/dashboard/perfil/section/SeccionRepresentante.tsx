import { UserCheck, Hash } from 'lucide-react';
import InputField from '../../../../components/atoms/InputField';
import SelectField from '../../../../components/atoms/SelectField';
import React from 'react';
import type { RepresentanteLegal, TipoIdentificacion } from '../../../../../domain/models/Colegio';



interface Props {
  representantes: RepresentanteLegal[];
  tiposId: TipoIdentificacion[];
  onRepChange: (index: number, field: keyof RepresentanteLegal, value: string | number) => void;
  errors?: Record<string, string>;
}

export const SeccionRepresentante: React.FC<Props> = ({ representantes, tiposId, onRepChange, errors = {} }) => (
  <section className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
      <UserCheck size={14} className="text-purple-500"/> Representante Legal
    </h3>

    {representantes.map((rep, index) => (
      <div key={rep.id ?? index} className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <InputField
          label="Nombre"
          name="nombre"
          value={rep.nombre}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onRepChange(index, 'nombre', e.target.value)}
          icon={UserCheck}
          error={errors.repNombre}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Identificación"
            name="numeroIdentificacion"
            value={rep.numeroIdentificacion}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onRepChange(index, 'numeroIdentificacion', e.target.value)}
            icon={Hash}
            error={errors.repNumeroIdentificacion}
          />

          <SelectField
            label="Tipo"
            name="tipoIdentificacionId"
            value={rep.tipoIdentificacionId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              onRepChange(index, 'tipoIdentificacionId', Number(e.target.value))
            }
            options={tiposId}
            displayExpr={(t: TipoIdentificacion) => t.nombre}
          />
        </div>
      </div>
    ))}
  </section>
);
