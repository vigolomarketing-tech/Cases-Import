// CONFIG — Cases Import (demo Vigolo Web Studio)
// Todo lo que cambia de un comercio a otro vive acá.
// Lo marcado "PENDIENTE CLIENTE" son datos de ejemplo a confirmar con ella.

const CONFIG = {
  negocio: {
    nombre: "Cases Import",
    rubro: "Cases y accesorios para celulares",
    localidad: "Neuquén",
    eslogan: "Fundas y accesorios con onda para tu celular",
    logo: "img/logo.webp",
  },

  contacto: {
    whatsapp: "5492993255217", // 549 + área + número, sin + ni espacios. PENDIENTE CLIENTE: confirmar que sea el de ventas
    mensajeWhatsapp: "¡Hola! Vi su web y quería consultar por una funda 💌",
    telefono: "+54 9 299 325-5217", // PENDIENTE CLIENTE
    instagram: "https://instagram.com/casesimportt",
    instagramUsuario: "@casesimportt",
    ubicacion: "Neuquén, Argentina",
  },

  pedidos: {
    habilitado: true,
    entregas: ["Envío a todo el país", "Retiro en Neuquén"], // PENDIENTE CLIENTE
    formasDePago: ["Transferencia", "Mercado Pago", "Efectivo (retiro)"], // PENDIENTE CLIENTE
  },

  categorias: ["Fundas", "Cargadores", "Protectores", "Baterías"],

  // PRECIOS DE EJEMPLO — PENDIENTE CLIENTE
  // modelos: lista de modelos compatibles; null = sirve para cualquier celular
  productos: [
    { id: "kiss", categoria: "Fundas", nombre: "Funda espejo “Kiss”", descripcion: "Transparente con efecto espejo y letras rosas. Para mirarte y retocarte.", precio: 14500, modelos: ["iPhone 17"], foto: "img/funda-espejo-kiss.webp", w: 460, h: 817, etiqueta: "Más pedida" },
    { id: "estrellas", categoria: "Fundas", nombre: "Funda estrellas rosa", descripcion: "Rosa pastel con estrellitas negras. Borde reforzado.", precio: 13500, modelos: ["iPhone 17"], foto: "img/funda-estrellas-rosa.webp", w: 441, h: 783 },
    { id: "argentina", categoria: "Fundas", nombre: "Funda Argentina", descripcion: "Sol de Mayo, mate, empanadas y campeones del mundo en rosa.", precio: 13500, modelos: ["iPhone 17"], foto: "img/funda-argentina.webp", w: 467, h: 831 },
    { id: "encaje", categoria: "Fundas", nombre: "Funda encaje negro", descripcion: "Diseño de encaje con letras plateadas. Elegante y delicada.", precio: 15000, modelos: ["iPhone 16 Pro Max"], foto: "img/funda-encaje-negro.webp", w: 466, h: 828, etiqueta: "Nueva" },
    { id: "gatito", categoria: "Fundas", nombre: "Funda rosa con gatito", descripcion: "Rosa chicle con lunares y un gatito 3D que se asoma.", precio: 16000, modelos: ["iPhone 16 Pro Max"], foto: "img/funda-rosa-gatito.webp", w: 489, h: 868 },
    { id: "salchicha", categoria: "Fundas", nombre: "Funda salchicha rayada", descripcion: "Rayas bordó y crema con un perrito salchicha canchero.", precio: 14500, modelos: ["iPhone 16 Pro Max"], foto: "img/funda-salchicha.webp", w: 467, h: 830 },
    { id: "leopardo", categoria: "Fundas", nombre: "Funda “You look nice today”", descripcion: "Transparente con estampa leopardo plateada y estrellas.", precio: 15500, modelos: ["iPhone 17 Pro"], foto: "img/funda-leopardo-plata.webp", w: 551, h: 980, etiqueta: "Nueva" },
    { id: "silicone", categoria: "Fundas", nombre: "Silicone case rosa", descripcion: "Silicona suave al tacto, interior de microfibra y varios colores.", precio: 18000, modelos: ["iPhone 17 Pro", "iPhone 18 Pro"], foto: "img/funda-silicone-rosa.webp", w: 533, h: 948 },
    { id: "corazon", categoria: "Fundas", nombre: "Funda corazón 3D negra", descripcion: "Relieve de corazón con efecto tela drapeada. Mate y antihuellas.", precio: 15500, modelos: ["iPhone 17 Pro Max", "iPhone 18 Pro Max"], foto: "img/funda-corazon-negro.webp", w: 521, h: 925 },
    { id: "cargador-completo", categoria: "Cargadores", nombre: "Cargador completo iPhone", descripcion: "Adaptador de 20 W + cable. Elegí ficha Lightning o ficha C.", precio: 24000, modelos: null, foto: "img/cargadores-completos.webp", w: 900, h: 576, opciones: ["Ficha Lightning", "Ficha C"] },
    { id: "protector-corazon", categoria: "Protectores", nombre: "Protector de cargador corazón", descripcion: "Para cargador de 20 W + protector de cable plateado. Con corazones cromados.", precio: 6500, modelos: null, foto: "img/protector-cargador-corazon.webp", w: 900, h: 898, etiqueta: "Combo con descuento" },
    { id: "battery-pack", categoria: "Baterías", nombre: "Battery pack MagSafe 10.000 mAh", descripcion: "Cargador portátil magnético. Un poco más grueso, pero con mucha más capacidad.", precio: 62000, modelos: null, foto: "img/battery-pack.webp", w: 800, h: 924 },
  ],

  seo: {
    titulo: "Fundas y accesorios para celulares | Cases Import",
    descripcion: "Cases Import en Neuquén: fundas lindas, cargadores y battery packs para iPhone. Elegí tu modelo, armá tu pedido y mandalo por WhatsApp. Envíos a todo el país.",
  },
};
