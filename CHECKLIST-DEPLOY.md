# ✅ Checklist de Deploy — Nueva Pizzería

Sigue estos pasos en orden para activar la plantilla en un nuevo negocio.
Tiempo estimado: **15-20 minutos**.

---

## 1. Información del negocio
**Archivo:** `config/pizzeria.config.ts`

- [ ] `nombre` — Nombre de la pizzería
- [ ] `slogan` — Frase corta del negocio
- [ ] `telefonos` — Array con los teléfonos de contacto
- [ ] `email` — Correo de contacto
- [ ] `ubicacion` — Calle y colonia
- [ ] `ciudad` — Ciudad
- [ ] `coordenadas` — Coordenadas para Google Maps (opcional)
- [ ] `social` — URLs de redes sociales
- [ ] `schedule` — Horarios de atención
- [ ] `desarrollador` — Tu nombre como desarrollador

## 2. WhatsApp para pedidos
**Archivo:** `.env.local` (crear si no existe)

```
NEXT_PUBLIC_WHATSAPP_NUMBER=521XXXXXXXXXX
```
- [ ] Número con código de país, sin `+`, sin espacios
- [ ] En Vercel: agregar como variable de entorno en el dashboard

## 3. Features del negocio
**Archivo:** `config/pizzeria.config.ts` → sección `features`

- [ ] `promo2x1` — ¿El negocio maneja 2x1?
- [ ] `promo3x1` — ¿El negocio maneja 3x1?
- [ ] `paquetes` — ¿Tiene paquetes especiales?
- [ ] `spaguetti` — ¿Vende spaguetti?
- [ ] `bebidas` — ¿Vende bebidas?
- [ ] `recompensas` — ¿Tiene programa de puntos?
- [ ] `vip` — ¿Tiene zona VIP?
- [ ] `orillasRellenas` — ¿Ofrece orilla de queso?
- [ ] `mitadYMitad` — ¿Ofrece mitad y mitad?

## 4. Menú y precios
**Archivo:** `config/menu.config.ts`

- [ ] `especialidades2x1` — Nombres y precios de las pizzas
- [ ] `paquetes` — Paquetes disponibles con precios e imágenes
- [ ] `complementos.bebidas` — Bebidas con precios
- [ ] `complementos.spaguetti` — Spaguetti con precios
- [ ] `cupones` — Códigos de descuento activos

## 5. Promociones del mes
**Archivo:** `config/pizzeria.config.ts` → sección `promoMes`

- [ ] `enabled` — Activar o desactivar el sistema de promos
- [ ] `promos` — Array con fechas de inicio/fin, paqueteId, título y descripción

## 6. Imágenes
**Directorio:** `/public`

- [ ] Logo del negocio (reemplazar `placeholder-logo.png`)
- [ ] Imágenes de paquetes (las que se usan en `menu.config.ts`)
- [ ] Ícono PWA: `icon-192x192.png`, `icon-512x512.png`, `icon-96x96.png`
- [ ] `apple-icon.png`

## 7. Colores y tema
**Archivo:** `app/globals.css`

- [ ] Variable `--primary` — Color principal del negocio
- [ ] Variable `--accent` — Color de acento

## 8. Deploy en Vercel

```bash
# Opción A — CLI
vercel --prod

# Opción B — GitHub
# Push a main → Vercel despliega automáticamente
```

- [ ] Agregar `NEXT_PUBLIC_WHATSAPP_NUMBER` en Vercel → Settings → Environment Variables
- [ ] Verificar que el build pase sin errores
- [ ] Probar el flujo completo: Menú → Carrito → Dirección → Confirmar → WhatsApp

---

## Verificación final

- [ ] El nombre del negocio aparece en header, footer y título del navegador
- [ ] El modal de promo del mes aparece (si hay promo activa)
- [ ] El pedido llega correctamente por WhatsApp
- [ ] La app funciona en móvil
- [ ] El modo oscuro/claro funciona
