interface SelectFieldProps {
  label: string;
  name: string;
  value: any;
  onChange: any;
  options: any[];
  error?: string;
  placeholder?: string;
  displayExpr: (item: any) => string; 
  required?: boolean;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options, error, placeholder, displayExpr, required, disabled }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full bg-slate-50 border-2 rounded-2xl p-4 outline-none focus:ring-2 transition-all ${
        error ? "border-red-500 focus:ring-red-500" : "border-slate-100 focus:ring-blue-500"
      }`}
    >
      <option value="" disabled>{placeholder || "Selecciona una opción"}</option>
      {options?.map((item) => (
        <option key={item.id} value={item.id}>
          {displayExpr(item)}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default SelectField;
