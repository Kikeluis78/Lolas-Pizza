# 🚀 Guía de Deployment - De DEMO a PRODUCCIÓN

Este documento explica cómo pasar de la versión DEMO (para locatarios) a la versión de PRODUCCIÓN (para el negocio real).

---

## 📋 Checklist de Producción

### ✅ 1. Desactivar Modo DEMO

**Archivo:** `/config/pizzeria.config.ts`

```typescript
demoMode: {
  enabled: false, // ⚠️ Cambiar de true a false
  message: "...",
}
```

**¿Qué hace esto?**
- En DEMO: Muestra un modal pidiendo el WhatsApp del locatario para recibir pedidos de prueba
- En PRODUCCIÓN: Envía los pedidos directamente al número configurado del negocio

---

### ✅ 2. Configurar Número de WhatsApp del Negocio

**Archivo:** `/config/pizzeria.config.ts`

```typescript
// WhatsApp para pedidos
whatsapp: "5512345678", // ⚠️ Reemplazar con el número real del negocio
```

**Formato:**
- 10 dígitos sin espacios ni guiones
- Ejemplo: `5512345678`
- El sistema agregará automáticamente el código de país (52) para México

**Alternativa con variable de entorno:**

Si prefieres usar variables de entorno (recomendado para seguridad):

1. Crear archivo `.env.local` en la raíz del proyecto:
```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=5512345678
```

2. El código ya está preparado para leerlo:
```typescript
whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5512345678",
```

---

### ✅ 3. Actualizar Información del Negocio

**Archivo:** `/config/pizzeria.config.ts`

Verifica y actualiza:

```typescript
export const pizzeriaConfig: PizzeriaConfig = {
  // Información básica
  nombre: "Tu Pizzería Real", // ⚠️ Nombre del negocio
  slogan: "Tu slogan aquí",
  desarrollador: "Tu nombre",

  // Contacto
  telefonos: ["55 1234-5678", "55 8765-4321"], // ⚠️ Teléfonos reales
  email: "contacto@tupizzeria.com", // ⚠️ Email real
  ubicacion: "Calle Real #123, Colonia Centro", // ⚠️ Dirección real
  ciudad: "Ciudad de México",
  coordenadas: "https://maps.google.com/?q=...", // ⚠️ Link de Google Maps

  // Redes sociales
  social: {
    facebook: "https://facebook.com/tupizzeria", // ⚠️ URLs reales
    instagram: "https://instagram.com/tupizzeria",
    twitter: "https://twitter.com/tupizzeria",
    youtube: "https://youtube.com/tupizzeria",
    x: "https://twitter.com/tupizzeria",
  },

  // Horarios
  schedule: {
    weekdays: "10:00 AM - 11:00 PM", // ⚠️ Horarios reales
    weekends: "10:00 AM - 12:00 AM",
  },
}
```

---

### ✅ 4. Actualizar Menú y Precios

**Archivo:** `/config/menu.config.ts`

- Revisar todas las especialidades de pizza
- Actualizar precios reales
- Verificar ingredientes y descripciones
- Actualizar paquetes y promociones
- Configurar cupones de descuento válidos

---

### ✅ 5. Reemplazar Imágenes

**Directorio:** `/public/`

Reemplazar con fotos reales del negocio:
- Logo de la pizzería
- Fotos de pizzas
- Imágenes de paquetes
- Banner principal

**Mantener los mismos nombres de archivo** para que las referencias en el código sigan funcionando.

---

### ✅ 6. Verificar Build

Antes de hacer deploy, verificar que todo compile correctamente:

```bash
npm run build
```

Si hay errores, corregirlos antes de continuar.

---

### ✅ 7. Deploy en Vercel (o tu plataforma)

#### Opción A: Deploy desde GitHub

1. Hacer commit de todos los cambios:
```bash
git add .
git commit -m "Configuración de producción"
git push origin main
```

2. En Vercel:
   - Conectar el repositorio
   - Configurar variables de entorno si usas `.env.local`
   - Deploy automático

#### Opción B: Deploy directo desde CLI

```bash
vercel --prod
```

---

### ✅ 8. Configurar Variables de Entorno en Vercel

Si usas `.env.local`, agregar en Vercel:

1. Ir a: **Project Settings → Environment Variables**
2. Agregar:
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = `5512345678`

---

### ✅ 9. Pruebas Post-Deploy

Después del deploy, verificar:

- [ ] El número de WhatsApp es el correcto
- [ ] Los pedidos se envían al negocio (no al locatario)
- [ ] No aparece el modal de "modo demo"
- [ ] Toda la información del negocio es correcta
- [ ] Las imágenes se cargan correctamente
- [ ] Los precios son los correctos
- [ ] El sitio funciona en móvil y desktop

---

## 🔄 Volver a Modo DEMO

Si necesitas volver a mostrar el sistema a otro locatario:

1. Cambiar en `/config/pizzeria.config.ts`:
```typescript
demoMode: {
  enabled: true, // Activar modo demo
  message: "Ingresa tu WhatsApp para recibir este pedido de prueba...",
}
```

2. Hacer build y deploy nuevamente

---

## 📞 Soporte

Si tienes dudas sobre el deployment, contacta al desarrollador:
- **Desarrollador:** Ver campo `desarrollador` en `pizzeria.config.ts`

---

## 🎯 Resumen Rápido

**Para pasar a producción:**

1. ✅ `demoMode.enabled: false` en `pizzeria.config.ts`
2. ✅ Actualizar `whatsapp` con número real del negocio
3. ✅ Verificar toda la información del negocio
4. ✅ Actualizar menú y precios
5. ✅ Reemplazar imágenes
6. ✅ `npm run build` para verificar
7. ✅ Deploy a producción
8. ✅ Probar que todo funcione correctamente

---

**¡Listo! Tu sistema de pedidos está en producción. 🍕🚀**
