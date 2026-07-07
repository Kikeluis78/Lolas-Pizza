# Guía de Mejoras UX — Plantilla Pizzería
> Solo mejoras de experiencia de usuario. Sin romper lógica ni funcionalidad existente.

---

## FASE 1 — Correcciones Críticas (antes de producción)
*Problemas que bloquean o confunden al usuario en el flujo principal.*

### 1.1 Reducir spinner de entrada
- **Archivo:** `app/page.tsx`
- **Problema:** El usuario espera 3 segundos sin poder hacer nada.
- **Fix:** Cambiar `setTimeout` de `3000` a `1200`.

### 1.2 Agregar CTA "Ir al checkout" en el carrito
- **Archivo:** `app/carrito/page.tsx` y `components/shopping-cart-view.tsx`
- **Problema:** El usuario llena el carrito pero no hay un botón claro de "Confirmar pedido". Tiene que adivinar que debe ir a otra página.
- **Fix:** Agregar botón prominente al final del carrito que lleve a `/confirmar-pedido`.

### 1.3 Validar dirección antes de confirmar pedido
- **Archivo:** `app/confirmar-pedido/page.tsx`
- **Problema:** Si el usuario eligió "domicilio" pero no guardó dirección, llega a confirmar sin saberlo.
- **Fix:** Al montar la página, si `serviceType === "delivery"` y no hay `selectedAddress` en localStorage, mostrar alerta y redirigir a `/direccion`.

### 1.4 Corregir título de página `/pizzas`
- **Archivo:** `app/pizzas/page.tsx`
- **Problema:** El `<h1>` dice "Elige Qué quieres" con mayúscula rara y espacio extra en el código.
- **Fix:** Cambiar a "Nuestras Especialidades" o texto limpio y consistente.

---

## FASE 2 — Mejoras de Navegación
*El usuario sabe dónde está y a dónde puede ir.*

### 2.1 Indicador de página activa en el header
- **Archivo:** `components/header.tsx`
- **Problema:** No hay feedback visual de en qué sección está el usuario.
- **Fix:** Usar `usePathname()` de Next.js para agregar clase `text-primary font-bold` al link activo.

### 2.2 Hacer el carrito más visible en desktop
- **Archivo:** `components/header.tsx`
- **Problema:** El ícono del carrito es pequeño y se pierde. Para una app de pedidos es el elemento más importante.
- **Fix:** Cuando `itemCount > 0`, mostrar el botón del carrito con fondo de color primario en lugar de ghost.

### 2.3 Contexto para secciones VIP y Recompensas
- **Archivo:** `components/header.tsx` y páginas respectivas
- **Problema:** Un usuario nuevo ve "V.I.P" y no sabe qué es ni si aplica para él.
- **Fix:** Agregar un tooltip o subtítulo breve en la página de entrada de cada sección explicando el beneficio en una línea.

### 2.4 Breadcrumb o indicador de paso en el flujo de pedido
- **Problema:** El usuario no sabe en qué paso del proceso está (1. Menú → 2. Carrito → 3. Dirección → 4. Confirmar).
- **Fix:** Agregar un componente simple de pasos en las páginas `/carrito`, `/direccion` y `/confirmar-pedido`.

---

## FASE 3 — Pulido de Experiencia
*Detalles que hacen la app sentirse profesional.*

### 3.1 Mensaje de carrito vacío con CTA
- **Archivo:** `components/shopping-cart-view.tsx`
- **Problema:** Si el carrito está vacío, probablemente solo muestra texto. No guía al usuario.
- **Fix:** Mostrar ilustración/ícono + "Tu carrito está vacío" + botón "Ver el menú" que lleve a `/pizzas`.

### 3.2 Confirmación visual al agregar al carrito
- **Problema:** El usuario hace clic en "Agregar" y no hay feedback inmediato claro (solo el badge del header cambia).
- **Fix:** Usar el `sonner` (ya instalado) para mostrar un toast "✅ Agregado al carrito" al añadir cualquier producto.

### 3.3 Botón "Seguir comprando" en el carrito
- **Archivo:** `app/carrito/page.tsx`
- **Fix:** Agregar link de regreso a `/pizzas` para que el usuario pueda seguir agregando sin usar el botón atrás del navegador.

### 3.4 Resumen del pedido visible en `/confirmar-pedido`
- **Problema:** El usuario llega a confirmar y puede no recordar qué pidió.
- **Fix:** Mostrar un resumen colapsable de los items del carrito al inicio de la página de confirmación.

---

## FASE 4 — Optimizaciones para Producción Masiva
*Ajustes para cuando la plantilla se replica en múltiples negocios.*

### 4.1 Un solo archivo de configuración maestro
- **Problema actual:** La información del negocio está en `pizzeria.config.ts`, el menú en `menu.config.ts` y `menu2x1.config.ts` (duplicado), y el tema en `theme.config.ts`.
- **Fix:** Consolidar en un solo `config/index.ts` que exporte todo, o al menos eliminar la duplicación entre `menu.config.ts` y `menu2x1.config.ts` (ver Pregunta 3 abajo).

### 4.2 Variables de entorno para datos sensibles
- **Problema:** El número de WhatsApp está hardcodeado en `pizzeria.config.ts`.
- **Fix:** Mover a `.env.local` → `NEXT_PUBLIC_WHATSAPP_NUMBER=5611001627`.

### 4.3 Checklist de deploy por negocio
Crear un `CHECKLIST-DEPLOY.md` con los 5 pasos mínimos para activar la plantilla en un nuevo negocio:
1. Editar `config/pizzeria.config.ts` (nombre, teléfonos, WhatsApp, redes)
2. Editar `config/menu.config.ts` (activar/desactivar productos con `enabled`)
3. Reemplazar imágenes en `/public`
4. Ajustar colores en `app/globals.css`
5. Deploy en Vercel

---

## Orden de ejecución recomendado

```
Fase 1 (crítico)  →  Fase 2 (navegación)  →  Fase 4 (config)  →  Fase 3 (pulido)
```

Fase 4 antes de Fase 3 porque si vas a replicar el negocio, es mejor tener la estructura limpia antes de agregar más componentes.
