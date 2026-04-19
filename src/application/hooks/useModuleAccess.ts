import { getModulosFromToken, getRoleFromToken } from "../../utils/jwt";
import { getModuloIdForPath } from "../../domain/models/Seguridad";
import { usePerfil } from "../context/PerfilContext";

/**
 * Hook que expone funciones para verificar si el usuario actual
 * tiene acceso a un módulo o ruta específica.
 *
 * Usa los permisos frescos del endpoint /mi-perfil (context).
 * Fallback al JWT si el perfil aún no cargó.
 */
export function useModuleAccess() {
  const { modulos: perfilModulos, isAdmin: perfilIsAdmin, loading } = usePerfil();

  // Fallback al JWT mientras el perfil no haya cargado
  const token = localStorage.getItem("token");
  const jwtModulos = getModulosFromToken(token);
  const jwtRole = getRoleFromToken(token);
  const jwtIsAdmin = jwtRole === "Administrador";

  const modulos = loading ? jwtModulos : perfilModulos;
  const isAdmin = loading ? jwtIsAdmin : perfilIsAdmin;

  /** Verifica si el usuario tiene acceso a un módulo por ID */
  const hasModule = (moduloId: number): boolean => {
    if (isAdmin) return true;
    return modulos.includes(moduloId);
  };

  /** Verifica si el usuario puede navegar a una ruta específica */
  const canNavigateTo = (path: string): boolean => {
    if (isAdmin) return true;
    const requiredModulo = getModuloIdForPath(path);
    if (!requiredModulo) return true;
    return modulos.includes(requiredModulo);
  };

  return { hasModule, canNavigateTo, isAdmin, modulos };
}
