# Frontend Soft Contable

Sistema frontend de gestión contable integral construido con React, TypeScript y Vite. Permite gestionar facturación de compras y ventas, contabilidad (asientos contables, libro auxiliar, PUC), productos, terceros, comprobantes de egreso, recibos de caja y más.

## Tecnologías

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| UI | React | 19.2.0 |
| Lenguaje | TypeScript | ~5.9.3 |
| Build | Vite | 7.2.4 |
| Estilos | Tailwind CSS (Vite plugin) | 4.1.18 |
| Routing | React Router | 7.11.0 |
| Animaciones | Framer Motion | 12.25.0 |
| Gráficas | Recharts | 3.8.1 |
| Iconos | Lucide React | 0.562.0 |
| PDF | jsPDF + jspdf-autotable | 4.0.0 / 5.0.7 |
| Excel | xlsx | 0.18.5 |
| Auth | jwt-decode | 4.0.0 |
| Tutoriales | react-joyride | 3.0.2 |

## Instalación

```bash
npm install
npm run dev
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compilación TypeScript + build de producción |
| `npm run lint` | Análisis de código con ESLint |
| `npm run preview` | Preview del build de producción |

## Arquitectura

El proyecto sigue una arquitectura por capas (Clean Architecture):

```
src/
├── application/           # Lógica de aplicación
│   ├── context/           # Contextos globales (Auth, Loading, Tutorial)
│   └── hooks/             # Hooks personalizados
├── data/                  # Capa de datos
│   ├── api/               # Cliente HTTP (apiClient)
│   └── services/          # Servicios por dominio
├── domain/                # Capa de dominio
│   └── models/            # Modelos e interfaces TypeScript
├── presentation/          # Capa de presentación
│   ├── components/        # Componentes UI (Atomic Design)
│   │   ├── atoms/         # Button, InputField, SelectField, CheckboxCard
│   │   ├── molecules/     # ExportButtons, FilterGroup, Pagination, SearchBar
│   │   ├── organisms/     # Table, Modal, Sidebar, PageHeader, etc.
│   │   ├── shared/        # Componentes compartidos
│   │   └── templates/     # Plantillas de layout
│   ├── pages/             # Páginas de la aplicación
│   └── routes/            # Configuración de rutas
└── utils/                 # Utilidades (JWT, validaciones, exportación, etc.)
```

## Módulos

### Dashboard
Página principal con métricas y resumen del negocio.

### Ventas
- Listado, creación y detalle de facturas de venta
- Recibos de caja vinculados
- Impresión de facturas

### Compras
- Listado, creación y detalle de facturas de compra
- Comprobantes de egreso vinculados
- Registro de pagos a proveedores
- Impresión de facturas de compra

### Contabilidad
- Asientos contables (listado, creación, detalle)
- Libro auxiliar
- Configuración contable

### Plan de Cuentas (PUC)
Gestión jerárquica del plan único de cuentas.

### Productos
Catálogo con creación y listado de productos.

### Terceros
Registro y administración de clientes y proveedores.

### Perfil
Datos básicos, información fiscal y representante legal de la institución.

## Servicios (API)

| Servicio | Dominio |
|----------|---------|
| `authService` | Autenticación y registro |
| `compraService` | Facturas de compra |
| `ventaService` | Facturas de venta |
| `comprobanteEgresoService` | Comprobantes de egreso |
| `contabilidadService` | Asientos contables |
| `dashboardService` | Métricas del dashboard |
| `productoService` | Productos |
| `pucService` | Plan de cuentas |
| `terceroService` | Terceros |
| `colegioService` / `parametrosService` | Institución y parámetros |
| `planService` | Planes de suscripción |
| `tipoFacturas` | Tipos de factura |

## Contextos

| Contexto | Función |
|----------|---------|
| `AuthContext` | Estado de autenticación y usuario actual |
| `LoadingContext` | Estado de carga global |
| `TutorialContext` | Onboarding con Joyride |

## Hooks

| Hook | Función |
|------|---------|
| `useAuth` | Acceso a autenticación |
| `useComprasForm` | Formulario de compras |
| `useVentasForm` | Formulario de ventas |
| `useContabilidad` | Gestión contable |
| `useProductosForm` | Formulario de productos |
| `useTercerosForm` | Formulario de terceros |
| `usePerfilForm` | Formulario de perfil |
| `useRegisterForm` | Registro multi-paso |
| `useGenericFilter` | Filtrado genérico |
| `usePagination` | Paginación |
| `useTipoFactura` | Tipos de factura |

## Modelos

Definidos en `src/domain/models/`:

`Auth` · `User` · `Colegio` · `Producto` · `Categoria` · `Tercero` · `TipoPersona` · `Puc` · `FacturaCompra` · `Venta` · `Contabilidad` · `ComprobanteEgreso` · `Parametros` · `TipoFactura` · `ApiResponse` · `Validation`

## Rutas

### Públicas
- `/login` — Inicio de sesión
- `/register` — Registro de usuario

### Protegidas (Dashboard)
| Ruta | Página |
|------|--------|
| `/dashboard` | Inicio |
| `/dashboard/perfil` | Perfil de la institución |
| `/dashboard/puc` | Plan de cuentas |
| `/dashboard/productos` | Catálogo de productos |
| `/dashboard/terceros` | Terceros |
| `/dashboard/ventas` | Facturas de venta |
| `/dashboard/ventas/:id` | Detalle de venta |
| `/dashboard/ventas/recibos` | Recibos de caja |
| `/dashboard/ventas/recibos/ver/:id` | Detalle de recibo |
| `/dashboard/factura-compra` | Facturas de compra |
| `/dashboard/factura-compra/:id` | Detalle de compra |
| `/dashboard/factura-compra/egresos` | Comprobantes de egreso |
| `/dashboard/factura-compra/egresos/:id` | Detalle de egreso |
| `/dashboard/asientos-contables` | Asientos contables |
| `/dashboard/asientos-contables/nuevo` | Nuevo asiento |
| `/dashboard/asientos-contables/configuracion` | Configuración contable |
| `/dashboard/asientos-contables/libro-auxiliar` | Libro auxiliar |
| `/dashboard/asientos-contables/:id` | Detalle de asiento |

### Impresión (sin sidebar)
- `/invoice/:id` — Impresión factura de venta
- `/purchase-invoice/:id` — Impresión factura de compra

## Configuración

- **Path alias:** `@` → `./src`
- **Proxy:** `/uploads` → `https://localhost:7260` (backend .NET)
- **Auth:** JWT almacenado en LocalStorage
- **Rutas protegidas:** Componente `ProtectedRoute`

**Estado del proyecto:** En desarrollo activo
