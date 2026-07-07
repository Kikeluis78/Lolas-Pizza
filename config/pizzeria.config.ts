// Define el tipo primero
interface PizzeriaConfig {
  // Información básica
  nombre: string;
  slogan: string;
  desarrollador: string;
  
  // Contacto
  telefonos: string[];
  email: string;
  ubicacion: string;
  ciudad: string;
  coordenadas: string;
  whatsapp: string;
  
  // 🚨 MODO DEMO - Para locatarios que prueban el sistema
  demoMode: {
    enabled: boolean; // true = DEMO (pide WhatsApp al locatario) | false = PRODUCCIÓN (usa whatsapp configurado)
    message: string;  // Mensaje que aparece en el modal de captura
  };
  
  // Redes sociales
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    x: string;
  };
  
  // Horarios
  schedule: {
    weekdays: string;
    weekends: string;
  };
  
  // Políticas
  policies: {
    privacy: string;
    cookies: string;
    terms: string;
  };

  // Promociones del mes — agrega todas las que quieras, el sistema muestra la activa según fecha
  promoMes: {
    enabled: boolean;
    promos: {
      fechaInicio: string; // "MM-DD"
      fechaFin: string;    // "MM-DD"
      paqueteId: string;   // id del paquete en menu.config.ts
      titulo: string;      // título que aparece en el modal
      descripcion: string; // subtítulo del modal
    }[];
  };

  // ─── FEATURE FLAGS ───────────────────────────────────────────
  // Cambia true/false para activar o desactivar secciones completas.
  // No toques el código, solo este archivo por negocio.
  features: {
    promo2x1: boolean;       // Sección /2x1 y botón en /pizzas
    promo3x1: boolean;       // Sección /3x1 y botón en /pizzas
    paquetes: boolean;       // Carrusel de paquetes en /home y nav
    spaguetti: boolean;      // Sección spaguetti en /complementos
    bebidas: boolean;        // Sección bebidas en /complementos
    snacks: boolean;         // Sección snacks en /complementos
    recompensas: boolean;    // Página /recompensas y link en nav
    vip: boolean;            // Página /vip y link en nav
    orillasRellenas: boolean; // Opción "Orilla de Queso" en modales de pizza
    mitadYMitad: boolean;    // Opción "Mitad y Mitad" en modales de pizza
  };
}

// Luego exportas con el tipo
export const pizzeriaConfig: PizzeriaConfig = {
  // Información básica
  nombre: "Lola's Pizza",
  slogan: "Entrega a Domicilio  'GRATIS'",
  desarrollador: "Enrique Vargas",
  telefonos: ["557258-1593", "551665-6041", "556659-6934"],
  email: "",
  ubicacion: "Reyes Ixtacala 1ra. Sección, Municipio: Tlalnepantla de Baz",
  ciudad: "Estado de México",
  coordenadas: "",

  // WhatsApp para pedidos — configura en .env.local: NEXT_PUBLIC_WHATSAPP_NUMBER
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5611001627",

  // ═══════════════════════════════════════════════════════════════════════════
  // 🚨 MODO DEMO - IMPORTANTE: Cambiar antes de pasar a PRODUCCIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  // 
  // DEMO MODE (enabled: true):
  //   - Muestra un modal pidiendo el WhatsApp del locatario
  //   - Los pedidos se envían al número que el locatario ingrese
  //   - Ideal para que prueben el sistema en tiempo real
  //
  // PRODUCCIÓN (enabled: false):
  //   - Usa el número configurado en "whatsapp" arriba
  //   - Los pedidos van directo al negocio
  //
  // 📝 PARA PASAR A PRODUCCIÓN:
  //   1. Cambiar enabled: false
  //   2. Verificar que "whatsapp" tenga el número correcto del negocio
  //   3. Hacer build y deploy
  //
  demoMode: {
    enabled: true, // ⚠️ Cambiar a false en producción
    message: "Ingresa tu WhatsApp para recibir este pedido de prueba y verificar el sistema en tiempo real",
  },

  social: {
    facebook: "https://facebook.com/lolaspiza",
    instagram: "https://instagram.com/lolaspiza",
    twitter: "https://twitter.com/lolaspiza",
    youtube: "https://youtube.com/lolaspiza",
    x: "https://twitter.com/lolaspiza",
  },

  // Horarios
  schedule: {
    weekdays: "1:00 PM - 10:00 PM",
    weekends: "1:00 PM - 10:00 PM",
  },

  // Políticas
  policies: {
    privacy: "/politicas/privacidad",
    cookies: "/politicas/cookies",
    terms: "/politicas/terminos",
  },

  // Promociones del mes
  promoMes: {
    enabled: false,
    promos: [
      {
        fechaInicio: "01-01",
        fechaFin: "01-31",
        paqueteId: "pkg-familiar",
        titulo: "¡Promo de Año Nuevo!",
        descripcion: "Empieza el año con la mejor pizza",
      },
      {
        fechaInicio: "02-01",
        fechaFin: "02-28",
        paqueteId: "pkg-pareja",
        titulo: "¡Promo San Valentín!",
        descripcion: "Comparte una pizza con quien más quieres",
      },
      {
        fechaInicio: "05-01",
        fechaFin: "05-31",
        paqueteId: "pkg-promo-mes",
        titulo: "¡Promo de Mayo!",
        descripcion: "Aprovecha nuestros mejores descuentos",
      },
      {
        fechaInicio: "12-01",
        fechaFin: "12-31",
        paqueteId: "pkg-mega",
        titulo: "¡Promo Navideña!",
        descripcion: "Celebra en grande con toda la familia",
      },
    ],
  },

  // ─── FEATURE FLAGS ───────────────────────────────────────────
  features: {
    promo2x1: false,
    promo3x1: false,
    paquetes: true,
    spaguetti: true,
    bebidas: true,
    snacks: true,
    recompensas: false,
    vip: false,
    orillasRellenas: true,
    mitadYMitad: true,
  },
};