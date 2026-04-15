import React from "react";
import {
  Package,
  Save,
  ArrowLeft,
  Tag,
  ShieldCheck,
  DollarSign,
  Box,
  BookMarked,
} from "lucide-react";
import Button from "../../../components/atoms/Button";
import StatusModal from "../../../components/organisms/StatusModal";
import InputField from "../../../components/atoms/InputField";
import SelectField from "../../../components/atoms/SelectField";
import { SelectorCuentaPuc } from "../../../components/organisms/SelectorCuentaPuc";
import { useProductosForm } from "../../../../application/hooks/useProductosForm";

interface Props {
  initialData?: any;
  onBack: () => void;
}

const ProductosCreatePage: React.FC<Props> = ({ initialData, onBack }) => {
  const isEditing = !!initialData;
  const {
    formData,
    parametros,
    showConfirm,
    resultModal,
    setShowConfirm,
    setResultModal,
    handleChange,
    handleConfirmSave,
  } = useProductosForm(initialData);

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "Requerido";
    if (!formData.sku?.trim()) newErrors.sku = "Requerido";
    if (!formData.categoriaId) newErrors.categoriaId = "Requerido";
    if (!formData.tipoUso) newErrors.tipoUso = "Requerido";
    if (formData.precios?.[0]?.valor === undefined || formData.precios[0].valor === null || formData.precios[0].valor < 0) {
      newErrors.valor = "Requerido";
    }
    // if (!formData.cuentaIngresoCodigo) newErrors.cuentaIngresoCodigo = "Requerido";
    // if (!formData.cuentaCostoCodigo) newErrors.cuentaCostoCodigo = "Requerido";
    // if (!formData.cuentaInventarioCodigo) newErrors.cuentaInventarioCodigo = "Requerido";
    if (!formData.impuestoCargoId) newErrors.impuestoCargoId = "Requerido";
    if (!formData.unidadMedidaDianId) newErrors.unidadMedidaDianId = "Requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setShowConfirm(true);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      noValidate
      className="max-w-6xl mx-auto space-y-4 pb-20 px-4 animate-in fade-in duration-500"
    >
      <StatusModal
        show={showConfirm}
        type="confirm"
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
        message={
          isEditing
            ? "¿Actualizar este producto?"
            : "¿Crear este nuevo producto?"
        }
      />

      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => {
          setResultModal((m) => ({ ...m, show: false }));
          if (resultModal.success) onBack();
        }}
      />

      {/* Header Sticky */}
      <div className="tuto-producto-sticky-header flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm sticky top-4 z-20 border border-slate-100">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-400" />
          </button>
          <h1 className="text-xl font-black text-slate-800 uppercase flex items-center gap-2">
            <Package size={28} className="text-blue-600" />
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h1>
        </div>
        <Button type="submit" icon={Save}>
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <section className="tuto-producto-identificacion bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <Box size={18} className="text-blue-500" /> Identificación del
              Ítem
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  icon={Package}
                  required
                  error={errors.nombre}
                />
              </div>
              <InputField
                label="Código de referencia"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                icon={Tag}
                required
                error={errors.sku}
              />
              <SelectField
                label="Categoría"
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                options={parametros?.categorias || []}
                displayExpr={(c) => c.nombre}
                required
                error={errors.categoriaId}
              />
              <SelectField
                label="Tipo de Uso"
                name="tipoUso"
                value={formData.tipoUso}
                onChange={handleChange}
                options={[
                  { id: 1, nombre: 'Venta' },
                  { id: 2, nombre: 'Compra' }
                ]}
                displayExpr={(t) => t.nombre}
                required
                error={errors.tipoUso}
              />

              
            </div>
          </section>

          <section className="tuto-producto-precio bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <DollarSign size={18} className="text-emerald-500" /> Precio
              General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Valor"
                name="valor"
                type="number"
                value={formData.precios?.[0]?.valor || 0}
                onChange={(e) => {
                  const newPrecios = [...(formData.precios || [])];
                  if (newPrecios.length === 0) {
                    newPrecios.push({ nombreLista: "General", valor: 0, incluyeIva: false });
                  }
                  newPrecios[0].valor = Number(e.target.value);
                  handleChange({
                    target: { name: "precios", value: newPrecios },
                  });
                }}
                icon={DollarSign}
                required
                error={errors.valor}
              />
            </div>
          </section>

          <section className="tuto-producto-cuentas bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mt-6">
            <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <BookMarked size={18} className="text-amber-500" /> Cuentas Contables (PUC) <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold ml-2">OPCIONAL</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectorCuentaPuc
                label="Cuenta de Ingreso"
                codigoRaiz="41"
                value={formData.cuentaIngresoCodigo || null}
                displayValue={formData.cuentaIngresoNombre ? `${formData.cuentaIngresoCodigo} - ${formData.cuentaIngresoNombre}` : formData.cuentaIngresoCodigo}
                onChange={(val) => handleChange({ target: { name: 'cuentaIngresoCodigo', value: val }})}
                error={errors.cuentaIngresoCodigo}
              />
              <SelectorCuentaPuc
                label="Cuenta de Costo"
                codigoRaiz="6"
                value={formData.cuentaCostoCodigo || null}
                displayValue={formData.cuentaCostoNombre ? `${formData.cuentaCostoCodigo} - ${formData.cuentaCostoNombre}` : formData.cuentaCostoCodigo}
                onChange={(val) => handleChange({ target: { name: 'cuentaCostoCodigo', value: val }})}
                error={errors.cuentaCostoCodigo}
              />
              <SelectorCuentaPuc
                label="Cuenta de Inventario"
                codigoRaiz="14"
                value={formData.cuentaInventarioCodigo || null}
                displayValue={formData.cuentaInventarioNombre ? `${formData.cuentaInventarioCodigo} - ${formData.cuentaInventarioNombre}` : formData.cuentaInventarioCodigo}
                onChange={(val) => handleChange({ target: { name: 'cuentaInventarioCodigo', value: val }})}
                error={errors.cuentaInventarioCodigo}
              />
            </div>
          </section>

        </div>

        <div className="space-y-4">
          <section className="tuto-producto-fiscal bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <ShieldCheck size={18} className="text-purple-500" /> Datos
              Fiscales
            </h3>
            <div className="space-y-4">
              <SelectField
                label="Impuesto"
                name="impuestoCargoId"
                value={formData.impuestoCargoId}
                onChange={handleChange}
                options={parametros?.impuestos || []}
                displayExpr={(i) => i.nombre}
                required
                error={errors.impuestoCargoId}
              />
              <SelectField
                label="Retención Sugerida"
                name="retencionId"
                value={formData.retencionId || ""}
                onChange={handleChange}
                options={parametros?.retenciones || []}
                displayExpr={(r) => `${r.nombre} (${r.tarifa}%)`}
                placeholder="Ninguna / No aplica"
              />
              <SelectField
                label="Unidad DIAN"
                name="unidadMedidaDianId"
                value={formData.unidadMedidaDianId}
                onChange={handleChange}
                options={parametros?.unidadesMedida || []}
                displayExpr={(u) => u.nombre}
                required
                error={errors.unidadMedidaDianId}
              />
            </div>
          </section>
        </div>
      </div>
    </form>
  );
};

export default ProductosCreatePage;
