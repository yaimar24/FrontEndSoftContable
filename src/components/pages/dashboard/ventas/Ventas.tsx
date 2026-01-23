"use client";

import { useState, type ChangeEvent } from "react";
import SelectField from "../../../common/SelectField";
import InputField from "../../../common/InputField";
import { useTipoFactura } from "../../../../hooks/useTipoFactura";

export default function VentasPage() {
  const [form, setForm] = useState({
    tipoFactura: 0,
    cliente: "",
    contacto: 0,
    fecha: "",
    numero: "",
    vendedor: "",
  });

  const { tiposFactura, loading } = useTipoFactura();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="bg-white rounded-xl shadow p-8 space-y-8">
        <h1 className="text-2xl font-semibold text-blue-600">
          Nueva factura de venta / Ingresos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <SelectField
              label="Tipo de factura"
              name="tipoFactura"
              value={form.tipoFactura}
              onChange={(e :ChangeEvent<HTMLSelectElement>) =>
                setForm((prev) => ({        
                  ...prev,
                  tipoFactura: Number(e.target.value),
                }))
              }
              options={tiposFactura}
              placeholder={
                loading
                  ? "Cargando tipos de factura..."
                  : "Seleccione tipo de factura"
              }
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
              onChange={(e :ChangeEvent<HTMLSelectElement>) =>
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
    </main>
  );
}
