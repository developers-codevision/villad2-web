# Estructura Modular de la Aplicación

Esta aplicación sigue una arquitectura modular organizada de la siguiente manera:

## 📁 Estructura de Carpetas

```
src/modules/
├── client/         # Módulo de la aplicación de cara al cliente
│   ├── components/ # Componentes específicos del cliente
│   ├── pages/      # Páginas del cliente
│   ├── hooks/      # Hooks personalizados del cliente
│   └── services/   # Servicios API del cliente
│
├── admin/          # Módulo del backoffice/administración
│   ├── components/ # Componentes específicos del admin
│   ├── pages/      # Páginas del admin
│   ├── hooks/      # Hooks personalizados del admin
│   └── services/   # Servicios API del admin
│
└── shared/         # Código compartido entre módulos
    ├── components/ # Componentes compartidos (UI, Navbar, Footer, etc.)
    ├── hooks/      # Hooks compartidos
    ├── lib/        # Utilidades compartidas
    ├── types/      # Tipos TypeScript compartidos
    ├── services/   # Servicios API compartidos
    └── data/       # Datos y constantes compartidas
```

## 📦 Módulos

### Client Module (`client/`)
Contiene toda la funcionalidad de cara al cliente final:
- **Pages**: Index, Rooms, RoomDetail, Services, Reservations, Login
- **Components**: RoomCard, ImageUploader, NavLink
- **Services**: 
  - `rooms.service.ts` - Gestión de habitaciones
  - `reservations.service.ts` - Gestión de reservas

### Admin Module (`admin/`)
Contiene toda la funcionalidad del panel de administración:
- **Pages**: AdminLayout, AdminReservas, AdminHabitaciones, AdminPromociones, AdminResenas
- **Services**:
  - `api.ts` - Cliente API con autenticación
  - `rooms.service.ts` - CRUD de habitaciones
  - `reservations.service.ts` - Gestión de reservas del admin

### Shared Module (`shared/`)
Contiene código compartido entre los módulos client y admin:
- **Components**: 
  - `ui/` - Componentes de shadcn/ui
  - `Navbar`, `Footer`, `NotFound`
- **Hooks**: `use-mobile`, `use-toast`
- **Lib**: `utils.ts` (función `cn` para clases CSS)
- **Types**: Interfaces y tipos TypeScript compartidos
- **Services**: `api.ts` - Cliente API base
- **Data**: `hostal.ts` - Datos de configuración

## 🔄 Importaciones

### Ejemplo de importaciones correctas:

```typescript
// Desde cualquier módulo, importar componentes compartidos:
import { Button } from "@/modules/shared/components/ui/button";
import { Navbar, Footer } from "@/modules/shared/components";
import { cn } from "@/modules/shared/lib";

// Desde páginas del cliente, importar componentes del cliente:
import { RoomCard } from "@/modules/client/components";

// Servicios del cliente:
import { roomsService } from "@/modules/client/services/rooms.service";

// Servicios del admin:
import { adminRoomsService } from "@/modules/admin/services/rooms.service";

// Datos compartidos:
import { HOSTAL, ROOMS } from "@/modules/shared/data/hostal";

// Tipos compartidos:
import type { Room, Reservation } from "@/modules/shared/types";
```

## 🎯 Ventajas de esta Arquitectura

1. **Separación de Responsabilidades**: Cada módulo tiene su propio dominio claramente definido
2. **Reutilización**: Los componentes y servicios compartidos evitan duplicación
3. **Escalabilidad**: Fácil agregar nuevos módulos sin afectar los existentes
4. **Mantenibilidad**: Más fácil localizar y mantener el código relacionado
5. **Testing**: Cada módulo puede ser testeado de forma independiente
6. **Colaboración**: Equipos diferentes pueden trabajar en módulos diferentes

## 📝 Convenciones

- Cada módulo debe exportar sus componentes/hooks/servicios a través de archivos `index.ts` (barrel exports)
- Los servicios deben seguir el patrón `{nombre}.service.ts`
- Los hooks personalizados deben empezar con `use-`
- Los componentes compartidos van en `shared/`, los específicos en su módulo correspondiente
- Las interfaces compartidas van en `shared/types/`

