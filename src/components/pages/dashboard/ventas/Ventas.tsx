"use client";

import { useState, type ChangeEvent } from "react";
import SelectField from "../../../common/SelectField";
import InputField from "../../../common/InputField";
import { useTipoFactura } from "../../../../hooks/useTipoFactura";
import PageHeader from "../../../Layout/PageHeader";

export default function VentasPage() {
  const [form, setForm] = useState({
    tipoFactura: 0,
    cliente: "",
    contacto: 0,
    fecha: "",
    numero: "",
    vendedor: "",
  });

  const { tiposFactura } = useTipoFactura();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-10 max-w-[1600px] mx-auto relative">
      <PageHeader title="Ventas" />

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-50 min-h-[600px]">
        {/* Columna izquierda */}
        <div className="space-y-6">
          <SelectField
            label="Tipo de factura"
            name="tipoFactura"
            value={form.tipoFactura}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setForm((prev) => ({
                ...prev,
                tipoFactura: Number(e.target.value),
              }))
            }
            options={tiposFactura}
            placeholder={"Seleccione tipo de factura"}
            displayExpr={(item) => item.nombre}
          />

          <InputField
            label="Cliente"
            name="cliente"
            value={form.cliente}
            onChange={handleInputChange}
            placeholder="Buscar"
            required
          />

          <SelectField
            label="Contacto"
            name="contacto"
            value={form.contacto}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setForm((prev) => ({
                ...prev,
                contacto: Number(e.target.value),
              }))
            }
            options={[]}
            placeholder="Seleccione"
            displayExpr={(item) => item.nombre}
          />

          <InputField
            label="Fecha de elaboración"
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <InputField
            label="Número"
            name="numero"
            value={form.numero}
            onChange={handleInputChange}
            onlyNumbers
            required
          />

          <InputField
            label="Vendedor"
            name="vendedor"
            value={form.vendedor}
            onChange={handleInputChange}
            placeholder="Buscar"
            required
          />
        </div>
      </div>
    </div>
  );
}
