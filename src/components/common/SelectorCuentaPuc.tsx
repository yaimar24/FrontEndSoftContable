import React from 'react';
import { AsyncSearchField } from './AsyncSearchField';
import { getCuentasPuc } from '../../services/puc/pucService';
import type { CuentaPuc } from '../../models/Puc';

interface SelectorCuentaPucProps {
  label: string;
  codigoRaiz: string;
  value: string | null;
  onChange: (codigo: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  displayValue?: string;
}

export const SelectorCuentaPuc: React.FC<SelectorCuentaPucProps> = ({
  label,
  codigoRaiz,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  displayValue
}) => {
  return (
    <div className={disabled ? 'opacity-70 pointer-events-none' : ''}>
      <AsyncSearchField
        label={label}
        value={value || ''}
        displayValue={displayValue || value || ''}
        placeholder="Seleccionar cuenta..."
        required={required}
        error={error}
        fetcher={async (query) => {
          const res = await getCuentasPuc(codigoRaiz, true, query, true);
          return res.success && res.data ? res.data : [];
        }}
        getDisplayValue={(c: CuentaPuc) => `${c.codigo} - ${c.nombre}`}
        getKey={(c: CuentaPuc) => c.codigo}
        onSelect={(c: CuentaPuc) => onChange(c.codigo)}
      />
    </div>
  );
};
