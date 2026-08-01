interface SelectFieldProps {
  label: string;
  name?: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[]; 
  error?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayExpr?: (item: any) => string;
  required?: boolean;
  disabled?: boolean;
  onCreate?: () => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options, error, placeholder, displayExpr, required, disabled, onCreate }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "CREATE_NEW") {
      if (onCreate) onCreate();
      // Reiniciar el valor en caso de que cancelen la creación
      e.target.value = value ? String(value) : "";
      return;
    }
    onChange(e);
  };

  return (
  <div className="flex flex-col space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={handleSelectChange}
      required={required}
      disabled={disabled}
      className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 transition-all ${
        error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
      }`}
    >
      <option value="" disabled>{placeholder || "Selecciona una opción"}</option>
      {onCreate && (
        <option value="CREATE_NEW" className="font-bold text-blue-600 bg-blue-50">
          + Crear nuevo {label.toLowerCase()}
        </option>
      )}
      {options?.map((item, idx) => (
        <option key={idx} value={String(item.id || item.value || idx)}>
          {displayExpr ? displayExpr(item) : String(item.nombre || item.label || item.value || JSON.stringify(item))}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)};

export default SelectField;
