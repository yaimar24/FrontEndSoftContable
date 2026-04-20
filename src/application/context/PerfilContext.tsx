import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getMiPerfil } from "../../data/services/seguridad/seguridadService";
import type { UsuarioReadDTO } from "../../domain/models/Seguridad";
import AuthContext from "./AuthContext";

interface PerfilContextType {
  perfil: UsuarioReadDTO | null;
  modulos: number[];
  rolNombre: string;
  isAdmin: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined);

export const PerfilProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [perfil, setPerfil] = useState<UsuarioReadDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = useContext(AuthContext);
  const token = auth?.token ?? null;

  const fetchPerfil = useCallback(async () => {
    if (!token) {
      setPerfil(null);
      setLoading(false);
      return;
    }
    try {
      const res = await getMiPerfil();
      if (res.success && res.data) {
        setPerfil(res.data);
      }
    } catch {
      // silently fail — permisos del JWT se usan como fallback
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPerfil();
  }, [fetchPerfil]);

  const modulos = perfil?.modulosPermitidos ?? [];
  const rolNombre = perfil?.rolNombre ?? "";
  const isAdmin = rolNombre === "Administrador";

  return (
    <PerfilContext.Provider value={{ perfil, modulos, rolNombre, isAdmin, loading, refetch: fetchPerfil }}>
      {children}
    </PerfilContext.Provider>
  );
};

export const usePerfil = (): PerfilContextType => {
  const ctx = useContext(PerfilContext);
  if (!ctx) throw new Error("usePerfil must be used within PerfilProvider");
  return ctx;
};

export default PerfilContext;
