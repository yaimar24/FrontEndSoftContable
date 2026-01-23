import { useEffect, useState } from "react";
import type { TipoFactura } from "../models/TipoFactura";
import { getTipoFactura } from "../services/TipoFacturas/tipoFacturas";

export const useTipoFactura = () => {
  const [tiposFactura, setTiposFactura] = useState<TipoFactura[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTiposFactura = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getTipoFactura();

        if (response.success) {
          setTiposFactura(response.data ?? []);
        } else {
          setError("No se pudieron cargar los tipos de factura");
        }
      } catch (err) {
        setError("Error al conectar con el servidor");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTiposFactura();
  }, []);

  return {
    tiposFactura,
    loading,
    error,
  };
};
