import { type ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  type?: string;
  name: string;
  value: string | number | boolean; 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxLength?: number; 
  onlyNumbers?: boolean; 
  allowDecimals?: boolean; 
  showToggle?: boolean; 
  showPassword?: boolean;
  setShowPassword?: (val: boolean) => void;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  autoComplete?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon: Icon,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  maxLength,
  onlyNumbers = false,
  allowDecimals = false,
  showToggle = false,
  showPassword,
  setShowPassword,
  disabled = false,
  min,
  max,
  step,
  autoComplete,
}) => {
  const isNumericInput = type === 'number' || onlyNumbers;

  // Mantenemos tu lógica original de Notación Científica
  const expandScientificNotation = (rawValue: string) => {
    if (!/[eE]/.test(rawValue)) {
      return rawValue;
    }

    const [coefficient, exponentPart] = rawValue.toLowerCase().split('e');
    const exponent = Number(exponentPart);

    if (!Number.isFinite(exponent)) {
      return rawValue;
    }

    const isNegative = coefficient.startsWith('-');
    const unsignedCoefficient = isNegative ? coefficient.slice(1) : coefficient;
    const [integerPart, decimalPart = ''] = unsignedCoefficient.split('.');
    const digits = `${integerPart}${decimalPart}`.replace(/^0+(?=\d)/, '') || '0';
    const decimalIndex = integerPart.length;
    const targetIndex = decimalIndex + exponent;

    let expanded = '';

    if (targetIndex <= 0) {
      expanded = `0.${'0'.repeat(Math.abs(targetIndex))}${digits}`;
    } else if (targetIndex >= digits.length) {
      expanded = `${digits}${'0'.repeat(targetIndex - digits.length)}`;
    } else {
      expanded = `${digits.slice(0, targetIndex)}.${digits.slice(targetIndex)}`;
    }

    return isNegative ? `-${expanded}` : expanded;
  };

  const normalizeDisplayValue = (rawValue: string | number | boolean) => {
    if (!isNumericInput) {
      return String(rawValue);
    }
    return expandScientificNotation(String(rawValue));
  };

  // Esta es la fuente de verdad corregida
  const externalDisplayValue = value === undefined || value === null ? '' : normalizeDisplayValue(value);


  // Mantenemos tu sanitizador original
  const sanitizeNumericValue = (rawValue: string) => {
    let sanitizedValue = rawValue.replace(/[eE+-]/g, '');

    if (allowDecimals) {
      sanitizedValue = sanitizedValue.replace(/,/g, '.').replace(/[^\d.]/g, '');

      const firstDotIndex = sanitizedValue.indexOf('.');
      if (firstDotIndex !== -1) {
        const integerPart = sanitizedValue.slice(0, firstDotIndex + 1);
        const decimalPart = sanitizedValue.slice(firstDotIndex + 1).replace(/\./g, '');
        sanitizedValue = `${integerPart}${decimalPart}`;
      }
    } else {
      sanitizedValue = sanitizedValue.replace(/\D/g, '');
    }

    const MAX_SAFE_DIGITS = 15;
    const effectiveMaxLength = maxLength && maxLength > 0 ? Math.min(maxLength, MAX_SAFE_DIGITS) : MAX_SAFE_DIGITS;

    if (allowDecimals) {
      const dotIndex = sanitizedValue.indexOf('.');
      if (dotIndex !== -1) {
        const intPart = sanitizedValue.slice(0, dotIndex).slice(0, effectiveMaxLength);
        const decPart = sanitizedValue.slice(dotIndex + 1);
        sanitizedValue = `${intPart}.${decPart}`;
      } else {
        sanitizedValue = sanitizedValue.slice(0, effectiveMaxLength);
      }
    } else {
      sanitizedValue = sanitizedValue.slice(0, effectiveMaxLength);
    }

    return sanitizedValue;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNumericInput) {
      onChange(e);
      return;
    }

    const sanitizedValue = sanitizeNumericValue(e.target.value);

    // Actualizamos el valor directamente en el evento
    e.target.value = sanitizedValue;

    onChange(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isNumericInput) {
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];
      if (allowDecimals && (e.key === '.' || e.key === ',')) return;
      if (allowedKeys.includes(e.key)) return;

      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="flex flex-col space-y-1 relative">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative group">
        {Icon && (
          <Icon 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" 
            size={18} 
          />
        )}

        <input
          type={type === 'password' && showToggle ? (showPassword ? 'text' : 'password') : isNumericInput ? 'text' : type}
          name={name}
          // RESPETAMOS TU LÓGICA DE CHECKBOX ORIGINAL
          {...(type === 'checkbox' 
              ? { checked: !!value } 
              : { value: externalDisplayValue } // Quitamos el ternario de isFocused que causaba el bug
          )}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          inputMode={isNumericInput ? (allowDecimals ? "decimal" : "numeric") : undefined}
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 outline-none transition-all
            ${Icon ? 'pl-11' : ''}
            ${showToggle ? 'pr-11' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}
            ${type === 'checkbox' ? 'w-3.5 h-3.5 cursor-pointer accent-blue-600' : ''}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          `}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
        />

        {showToggle && setShowPassword && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default InputField;