

# 🏨 Sitio Web de Hostal — Plan de Implementación

## Resumen
Sitio web moderno para un hostal con diseño claro, acentos amarillos y negros, tipografía moderna (Inter/Poppins). Incluye sistema de reservas con calendario interactivo, promoción de servicios y ubicación con mapa.

---

## Páginas y Secciones

### 1. Página de Inicio (Landing)
- **Hero** con imagen destacada del hostal, título y botón "Reservar Ahora"
- **Sección de habitaciones** — Vista previa de los tipos disponibles (6-8 habitaciones: individual, doble, suite, dormitorio compartido, familiar, etc.) con fotos placeholder, precio por noche y botón "Ver más"
- **Sección de servicios** — Tarjetas con iconos para servicios básicos (WiFi, desayuno, parking, limpieza) y turísticos (tours, excursiones, alquiler de bicicletas, traslados al aeropuerto)
- **Sección de contacto** — Teléfonos, email, WhatsApp y redes sociales
- **Mapa de ubicación** — Mapa embebido de Google Maps con la ubicación del hostal
- **Footer** con datos de contacto rápidos y enlaces

### 2. Página de Habitaciones
- Galería de habitaciones con descripción detallada, capacidad, comodidades incluidas y precio
- Botón para ir directamente a la reserva de cada habitación

### 3. Página de Reservas
- **Calendario interactivo** para seleccionar fechas de check-in y check-out
- **Selector de habitación** y número de huéspedes
- **Formulario de datos** del huésped (nombre, email, teléfono)
- **Sección de métodos de pago** — Logos e instrucciones para Stripe (tarjeta), Bizum y Zelle (solo informativo, sin procesamiento real)
- **Resumen de reserva** con detalle de fechas, habitación y precio total
- Botón de confirmar reserva (muestra mensaje de confirmación)

### 4. Página de Servicios
- Descripción detallada de cada servicio con iconos e imágenes placeholder
- Servicios básicos del hostal y actividades turísticas

---

## Diseño Visual
- **Fondo claro** (blanco/crema) con acentos en **amarillo dorado** y **negro**
- **Tipografía moderna** (Poppins o Inter)
- Diseño responsive (desktop, tablet, móvil)
- Navegación fija con logo y menú

---

## Datos
- Se usarán datos de ejemplo (nombre del hostal, dirección, precios) que podrás personalizar fácilmente después
- No se requiere backend ni base de datos — todo funciona en el frontend

