# Frontend Soft Contable

Sistema frontend para gestión contable integrado diseñado con React, TypeScript y Vite. Proporciona una interfaz moderna y eficiente para gestionar perfiles, productos, terceros, facturación y operaciones contables.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes Principales](#componentes-principales)
- [Servicios](#servicios)
- [Contextos](#contextos)
- [Hooks Personalizados](#hooks-personalizados)
- [Modelos de Datos](#modelos-de-datos)
- [Rutas](#rutas)
- [Dependencias Principales](#dependencias-principales)

## 🎯 Descripción del Proyecto

Frontend Soft Contable es una aplicación web completa para la gestión integral de procesos contables y administrativos. Incluye funciones para:

- **Autenticación y Autorización**: Sistema de login y registro con JWT
- **Gestión de Perfiles**: Administración de datos básicos, información fiscal y representantes
- **Catálogo de Productos**: Crear, editar y listar productos con categorización
- **Plan de Cuentas (PUC)**: Gestión de estructura contable
- **Gestión de Terceros**: Registro y administración de clientes/proveedores
- **Control de Ventas**: Registro y seguimiento de operaciones comerciales
- **Generación de Reportes**: Exportación a formatos PDF y Excel

## 🛠️ Tecnologías

- **React 19.2.0** - Biblioteca UI moderna con características avanzadas
- **TypeScript 5.9.3** - Tipado estático para mayor seguridad
- **Vite 7.2.4** - Build tool ultrarrápido con HMR
- **Tailwind CSS 4.1.18** - Framework CSS utilitario
- **React Router 7.11.0** - Enrutamiento declarativo
- **Framer Motion 12.25.0** - Animaciones fluidas
- **jsPDF & jsPDF-autotable 4.0.0** - Generación de documentos PDF
- **XLSX 0.18.5** - Exportación de datos a Excel
- **Lucide React 0.562.0** - Librería de iconos
- **JWT-decode 4.0.0** - Decodificación de tokens JWT



## 📁 Estructura del Proyecto

```
src/
├── api/
│   └── apiClient.ts           # Cliente HTTP configurado para llamadas API
├── assets/                    # Recursos estáticos (imágenes, videos, etc)
├── components/
│   ├── common/                # Componentes reutilizables globales
│   │   ├── Button.tsx
│   │   ├── ExportButtons.tsx
│   │   ├── FilterGroup.tsx
│   │   ├── InputField.tsx
│   │   ├── Modal.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SelectField.tsx
│   │   ├── StatusModal.tsx
│   │   └── Table.tsx
│   ├── Layout/                # Componentes de estructura
│   │   ├── PageHeader.tsx
│   │   └── Sidebar.tsx
│   └── pages/                 # Componentes de páginas
│       ├── dashboard/         # Dashboard principal
│       │   ├── Dashboard.tsx
│       │   ├── perfil/        # Gestión de perfil
│       │   │   ├── PerfilPage.tsx
│       │   │   └── section/
│       │   │       ├── SeccionDatosBasicos.tsx
│       │   │       ├── SeccionFiscal.tsx
│       │   │       └── SeccionRepresentante.tsx
│       │   ├── producto/      # Gestión de productos
│       │   │   ├── ProductosPage.tsx
│       │   │   ├── ProductosList.tsx
│       │   │   └── ProductosCreatePage.tsx
│       │   ├── puc/           # Plan de cuentas
│       │   │   ├── PucPage.tsx
│       │   │   ├── PucItem.tsx
│       │   │   └── FormNuevaCuenta.tsx
│       │   ├── terceros/      # Gestión de terceros
│       │   │   ├── TercerosPage.tsx
│       │   │   ├── CreateTerceros/
│       │   │   │   ├── TercerosCreatePage.tsx
│       │   │   │   └── sections/
│       │   │   │       ├── SeccionFiscal.tsx
│       │   │   │       └── SeccionIdentificacion.tsx
│       │   │   └── ListTerceros/
│       │   │       └── TercerosList.tsx
│       │   └── ventas/        # Gestión de ventas
│       │       └── Ventas.tsx
│       ├── login/             # Autenticación
│       │   └── LoginForm.tsx
│       └── register/          # Registro de usuarios
│           ├── RegisterForm.tsx
│           └── Step/
│               ├── Step1BasicInfo.tsx
│               ├── Step2Legal.tsx
│               └── Step3Account.tsx
├── context/                   # Context API para estado global
│   ├── AuthContext.tsx
│   └── LoadingContext.tsx
├── hooks/                     # Hooks personalizados
│   ├── useAuth.ts
│   ├── useGenericFilter.ts
│   ├── usePerfilForm.ts
│   ├── useProductosForm.ts
│   ├── useRegisterForm.ts
│   ├── useTercerosForm.ts
│   └── useTipoFactura.ts
├── models/                    # Modelos y tipos
│   ├── Auth.ts
│   ├── Categoria.ts
│   ├── Colegio.ts
│   ├── Parametros.ts
│   ├── Producto.ts
│   ├── Puc.ts
│   ├── Tercero.ts
│   ├── TipoFactura.ts
│   ├── TipoPersona.ts
│   ├── User.ts
│   └── types/
│       ├── ApiResponse.ts
│       └── Validation.ts
├── routes/                    # Configuración de rutas
│   ├── ProtectedRoute.tsx
│   └── Routes.tsx
├── services/                  # Servicios de API
│   ├── auth/
│   │   └── authService.ts
│   ├── colegio/
│   │   ├── colegioService.ts
│   │   └── parametrosService.ts
│   ├── loading/
│   │   └── loadingController.ts
│   ├── planes/
│   │   └── planService.ts
│   ├── producto/
│   │   └── productoService.ts
│   ├── puc/
│   │   └── pucService.ts
│   ├── terceros/
│   │   └── terceroService.ts
│   └── TipoFacturas/
│       └── tipoFacturas.ts
├── shared/                    # Componentes compartidos
│   └── LoadingOverlay.tsx
├── utils/                     # Funciones de utilidad
│   ├── calcularDV.ts         # Cálculo de dígito verificador
│   ├── exportUtils.ts        # Utilidades de exportación
│   ├── jwt.ts                # Manejo de JWT
│   ├── toFormData.ts         # Conversión a FormData
│   ├── validateForm.ts       # Validación de formularios
│   └── validators.ts         # Validadores específicos
├── App.tsx                    # Componente raíz
├── App.css                    # Estilos globales
├── main.tsx                   # Punto de entrada
└── index.css                  # Estilos CSS base

public/                        # Assets estáticos no procesados

# Archivos de configuración
├── index.html                 # HTML principal
├── vite.config.ts            # Configuración de Vite
├── tsconfig.json             # Configuración de TypeScript base
├── tsconfig.app.json         # Configuración de TypeScript para app
├── tsconfig.node.json        # Configuración de TypeScript para Node
├── eslint.config.js          # Configuración de ESLint
└── package.json              # Dependencias y scripts
```

## 🧩 Componentes Principales

### Componentes Comunes (`src/components/common/`)
- **Button**: Botón personalizable con variantes
- **InputField**: Campo de entrada con validación
- **SelectField**: Selector desplegable
- **SearchBar**: Barra de búsqueda
- **Modal**: Modal reutilizable
- **Table**: Tabla de datos con paginación
- **ExportButtons**: Botones para exportar (PDF/Excel)
- **FilterGroup**: Grupo de filtros
- **StatusModal**: Modal para cambios de estado

### Componentes de Layout
- **Sidebar**: Navegación lateral
- **PageHeader**: Encabezado de páginas

### Páginas Principales
- **Dashboard**: Página principal del sistema
- **Perfil**: Gestión de información de la empresa
- **Productos**: Catálogo de productos
- **PUC**: Plan de cuentas contable
- **Terceros**: Gestión de clientes/proveedores
- **Ventas**: Registro de operaciones
- **Autenticación**: Login y Registro

## 🔧 Servicios

Los servicios están organizados por dominio y manejan toda la comunicación con el backend:

- **authService**: Autenticación y autorización
- **productoService**: CRUD de productos
- **pucService**: Gestión del plan de cuentas
- **terceroService**: Gestión de terceros
- **colegioService**: Información de colegios
- **parametrosService**: Parámetros del sistema
- **planService**: Información de planes
- **tipoFacturas**: Tipos de facturación
- **loadingController**: Control de estado de carga global

## 🌐 Contextos

- **AuthContext**: Gestiona estado de autenticación y usuario actual
- **LoadingContext**: Controla el estado de carga global de la aplicación

## 🎣 Hooks Personalizados

- **useAuth**: Acceso a autenticación desde cualquier componente
- **usePerfilForm**: Lógica de formulario de perfil
- **useProductosForm**: Lógica de formulario de productos
- **useTercerosForm**: Lógica de formulario de terceros
- **useRegisterForm**: Lógica de registro en pasos
- **useGenericFilter**: Filtrado genérico de datos
- **useTipoFactura**: Gestión de tipos de factura

## 📊 Modelos de Datos

Se definen en `src/models/`:
- **Auth**: Información de autenticación
- **User**: Datos del usuario
- **Producto**: Información de productos
- **Tercero**: Datos de terceros
- **Puc**: Cuentas contables
- **Categoria**: Categorías de productos
- **TipoFactura**: Tipos de documento
- **TipoPersona**: Tipología de personas
- **Parametros**: Configuraciones del sistema

## 🛣️ Rutas

El sistema utiliza React Router con rutas protegidas:
- `/login` - Formulario de login
- `/register` - Registro de nuevo usuario
- `/dashboard` - Panel principal (protegido)
- `/dashboard/perfil` - Gestión de perfil
- `/dashboard/productos` - Catálogo de productos
- `/dashboard/puc` - Plan de cuentas
- `/dashboard/terceros` - Gestión de terceros
- `/dashboard/ventas` - Operaciones de venta

## 📚 Dependencias Principales

### Producción
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.11.0",
  "typescript": "~5.9.3",
  "@tailwindcss/vite": "^4.1.18",
  "framer-motion": "^12.25.0",
  "jspdf": "^4.0.0",
  "jspdf-autotable": "^5.0.7",
  "xlsx": "^0.18.5",
  "lucide-react": "^0.562.0",
  "jwt-decode": "^4.0.0"
}
```

### Desarrollo
```json
{
  "vite": "^7.2.4",
  "eslint": "^9.39.1",
  "@vitejs/plugin-react": "^5.1.2",
  "@vitejs/plugin-react-swc": "^4.2.2",
  "typescript-eslint": "^8.46.4"
}
```

## 🔐 Seguridad

- **JWT Tokens**: Utiliza autenticación basada en JWT
- **Protected Routes**: Las rutas están protegidas mediante `ProtectedRoute`
- **Token Validation**: Validación de tokens en servicios
- **CORS**: Configuración CORS en cliente API

## 💾 Almacenamiento

- **LocalStorage**: Almacenamiento de tokens JWT
- **Context API**: Estado global de autenticación y carga

## 📝 Estándares de Código

- **TypeScript**: Tipado fuerte en todo el proyecto
- **ESLint**: Linting mediante eslint.config.js
- **Naming**: Componentes con PascalCase, archivos con notación kebab-case
- **Folder Structure**: Organización por dominios y características




**Estado del Proyecto**: En desarrollo activo ✨
