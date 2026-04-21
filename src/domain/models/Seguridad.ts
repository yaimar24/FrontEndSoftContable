export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface ModuloPlan {
  id: number;
  nombre: string;
}

export interface UsuarioReadDTO {
  id: string;
  nombre: string;
  email: string;
  rolId: number;
  rolNombre: string;
  modulosPermitidos: number[];
  activo: boolean;
  fechaRegistro: string;
}

export interface UsuarioCreateDTO {
  nombre: string;
  email: string;
  password: string;
  rolNombre: string;
  rolDescripcion?: string;
  modulosPermitidos: number[];
}

export interface UsuarioUpdateDTO {
  nombre?: string;
  email?: string;
  password?: string;
  rolNombre?: string;
  rolDescripcion?: string;
  modulosPermitidos?: number[];
}

/** Mapa de módulo ID → ruta principal del módulo */
export const MODULO_RUTA_MAP: Record<number, string[]> = {
  2: ["/dashboard/ventas", "/dashboard/ventas/recibos"],
  3: ["/dashboard/factura-compra", "/dashboard/factura-compra/egresos"],
  4: ["/dashboard/asientos-contables"],
  5: ["/dashboard/terceros"],
  6: ["/dashboard/productos"],
  7: ["/dashboard/puc"],
  8: ["/dashboard/perfil"],
  9: ["/dashboard/seguridad"],
  10: ["/dashboard/cartera"],
};

/** Dada la lista de módulos del usuario, retorna la primera ruta accesible */
export function getFirstAllowedRoute(modulos: number[]): string {
  // Dashboard home no requiere permiso y queda como fallback global.
  const prioridad = [8, 5, 7, 6, 2, 3, 10, 4, 9];
  for (const moduloId of prioridad) {
    if (modulos.includes(moduloId)) {
      const rutas = MODULO_RUTA_MAP[moduloId];
      if (rutas && rutas.length > 0) return rutas[0];
    }
  }
  return "/dashboard";
}

/** Dado un pathname, retorna el moduloId requerido o null si no requiere permiso especial */
export function getModuloIdForPath(pathname: string): number | null {
  // Orden de más específico a menos específico
  const routeModuleMap: { pattern: string; moduloId: number }[] = [
    { pattern: "/dashboard/seguridad", moduloId: 9 },
    { pattern: "/dashboard/cartera", moduloId: 10 },
    { pattern: "/dashboard/asientos-contables", moduloId: 4 },
    { pattern: "/dashboard/factura-compra", moduloId: 3 },
    { pattern: "/dashboard/ventas", moduloId: 2 },
    { pattern: "/dashboard/terceros", moduloId: 5 },
    { pattern: "/dashboard/productos", moduloId: 6 },
    { pattern: "/dashboard/puc", moduloId: 7 },
    { pattern: "/dashboard/perfil", moduloId: 8 },
  ];

  for (const { pattern, moduloId } of routeModuleMap) {
    if (pathname.startsWith(pattern)) {
      return moduloId;
    }
  }

  return null;
}
