interface SelectFieldProps {
  label: string;
  name: string;
  value: any;
  onChange: any;
  options: any[];
  error?: string;
  placeholder?: string;
  displayExpr: (item: any) => string; // Cómo mostrar el texto
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options, error, placeholder, displayExpr }) => (
  <div className="flex flex-col">
    <label className="text-sm font-bold mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`bg-slate-50 border-2 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-500" : "border-slate-100"
      }`}
    >
      <option value={0}>{placeholder}</option>
      {options.map((item) => (
        <option key={item.id} value={item.id}>
          {displayExpr(item)}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default SelectField;