import React from "react";
import {
  Package,
  Save,
  ArrowLeft,
  Tag,
  ShieldCheck,
  DollarSign,
  Box,
} from "lucide-react";
import Button from "../../../common/Button";
import StatusModal from "../../../common/StatusModal";
import InputField from "../../../common/InputField";
import SelectField from "../../../common/SelectField";
import { useProductosForm } from "../../../../hooks/useProductosForm";

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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4 animate-in fade-in duration-500">
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
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm sticky top-4 z-20 border border-slate-100">
        <div className="flex items-center gap-4">
          <button
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
        <Button onClick={() => setShowConfirm(true)} icon={Save}>
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
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
                />
              </div>
              <InputField
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                icon={Tag}
              />
              <SelectField
                label="Categoría"
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                options={parametros?.categorias || []}
                displayExpr={(c) => c.nombre}
              />

              
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <DollarSign size={18} className="text-emerald-500" /> Precio
              General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Valor"
                name="valor"
                type="number"
                value={formData.precios[0]?.valor}
                onChange={(e) => {
                  const newPrecios = [...formData.precios];
                  newPrecios[0].valor = e.target.value;
                  handleChange({
                    target: { name: "precios", value: newPrecios },
                  });
                }}
                icon={DollarSign}
                required
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
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
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductosCreatePage;
