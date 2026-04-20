import type { ReactNode } from "react";
import { useModuleAccess } from "../../application/hooks/useModuleAccess";

interface Props {
  /** Ruta destino que requiere permiso (ej: "/dashboard/asientos-contables") */
  route?: string;
  /** O directamente el ID del módulo requerido */
  moduloId?: number;
  children: ReactNode;
}

/**
 * Renderiza children solo si el usuario tiene acceso al módulo/ruta indicado.
 *
 * Uso:
 *   <ModuleGate route="/dashboard/asientos-contables">
 *     <Link to={...}>Ver asiento</Link>
 *   </ModuleGate>
 *
 *   <ModuleGate moduloId={4}>
 *     <button>Ir a contabilidad</button>
 *   </ModuleGate>
 */
export const ModuleGate: React.FC<Props> = ({ route, moduloId, children }) => {
  const { canNavigateTo, hasModule } = useModuleAccess();

  if (route && !canNavigateTo(route)) return null;
  if (moduloId && !hasModule(moduloId)) return null;

  return <>{children}</>;
};
