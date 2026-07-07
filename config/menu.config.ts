// Especialidades 2x1
export const especialidades2x1 = [
  {
    name: "PEPERONI",
    ingredients: "Peperoni,Queso Mozzarela",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "HAWAIANA",
    ingredients: "Piña, Jamón ,Queso Mozzarela",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "MEXICANA",
    ingredients: "Queso Mozzarela,peperoni,Chorizo,Jalapeño,Cebolla",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  
  {
    name: "4 QUESOS",
    ingredients: "Queso Mozzarela,Queso Monterrey Jack,Queso Quedar,Queso Crema",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "CHAMPIÑONES SOLOS",
    ingredients: "Queso Mozzarela y Champiñones",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "CHAMPIÑON ESPECIAL",
    ingredients: "Queso Mozzarella,Peperoni,Champiñones",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "VEGETARIANA",
    ingredients: "Queso Mozzarela,Champiñones,Pimiento.Cebolla,Aceitunas",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "COSTILLAS",
    ingredients: "Queso Mozzarela,Costillas,Papas",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "ALITAS",
    ingredients: "Queso Mozzarela,Alitas,Papas",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "Carne Dulce",
    ingredients: "Queso Mozzarela,Carne de Cerdo con BBQ Dulce,Papas",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "PASTOR",
    ingredients: "Queso Mozzarela,Pastor,Piña,Cebolla",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "ATUN",
    ingredients: "Queso Mozzarela,Atún,Queso Crema",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "ITALIANA",
    ingredients: "Queso Mozzarela,Peperoni,Champiñones,Salchicha Italina,Pimiento,Cebolla,Aceitunas",
    prices: { CH: 140, MED: 235, GDE: 275, FAM: 325 },
  },
  {
    name: "MEAT LOVERS",
    ingredients: "Queso Mozzarela,Peperoni,Carne Molida,Salchicha Italiana,Tocino, Cebolla",
    prices: { CH: 210, MED: 260, GDE: 320, FAM: 410 },
  },
  
]
 export const UnIngrediente = [
   {
    name: "PEPERONI",
    ingredients: "Peperoni",
    prices: { CH: 130, MED: 220, GDE: 250, FAM: 300 },
  },
   {
    name: "PIERNA",
    ingredients: "Pierna",
    prices: { CH: 130, MED: 220, GDE: 250, FAM: 300 },
  },
   {
    name: "JAMON",
    ingredients: "Jampòn",
    prices: { CH: 130, MED: 220, GDE: 250, FAM: 300 },
  },
   {
    name: "TOCINO",
    ingredients: "Tocino",
    prices: { CH: 130, MED: 220, GDE: 250, FAM: 300 },
  },
   {
    name: "SALAMI",
    ingredients: "Salami",
    prices: { CH: 130, MED: 220, GDE: 250, FAM: 300 },
  },
   {
    name: "CHORIZO",
    ingredients: "Chorizo",
    prices: { CH: 130, MED: 220, GDE: 250, FAM: 300 },
  }, 
  {
    name: "SALCHICHA",
    ingredients: "Salchicha",
    prices: { CH: 130, MED: 220, GDE: 250, FAM: 300 },
  },
   {
    name: "CHAMPIÑONES",
    ingredients: "Champiñones",
    prices: { CH: 130, MED: 220, GDE: 250, FAM: 300 },
  },
 ]
// Especialidades 3x1
export const especialidades3x1 = especialidades2x1

// Paquetes
export const paquetes = [
  {
    id: "pkg-1",
    name: "PAKETAZO",
    description: "Pizza Grande HAWAIANA + Pizza Grande PEPERONI",
    image: "/family-pizza-package-with-drinks.jpg",
    price: 520,
  },
 
]

// Complementos
export const complementos = {
  bebidas: [
    { id: "refresco-coca-600", name: "Refresco", price: 25, description: "Coca-Cola 600ml" },
    { id: "refresco-sprite-600", name: "Refresco", price: 25, description: "Sprite 600ml" },
    { id: "refresco-mundet-600", name: "Refresco", price: 25, description: "Mundet 600ml" },
    { id: "refresco-mundet-2l", name: "Refresco", price: 55, description: "Mundet 2lts" },
    { id: "refresco-sprite-2l", name: "Refresco", price: 55, description: "Sprite 2lts" },
    { id: "refresco-coca-2.5l", name: "Refresco", price: 55, description: "Coca-Cola 2.5lts" },
  ],
  spaguetti: [
    { id: "spaguetti-bolognese", name: "Spaguetti", price: 75, description: "Salsa de quesos" },
  ],
   snacks: [
    { id: "alitas-grandes", name: "Orden Alitas Grandes", price: 145, description: "10 Alitas salsa BBQ" },
    { id: "alitas-chicas", name: "Orden Alitas Chicas", price: 80, description: "6 Alitas salsa BBQ" },
    { id: "costillas-grandes", name: "Orden Costillas Grandes", price: 145, description: "10 Costillas salsa BBQ" },
    { id: "costillas-chicas", name: "Orden Costillas Chicas", price: 80, description: "6 Costillas salsa BBQ" },
    { id: "papas-sencillas", name: "Orden Papas Sencillas", price: 80, description: "Papas fritas" },
    { id: "papas-grandes", name: "Orden Papas Grandes", price: 110, description: "Papas fritas grande" },
    { id: "papas-especiales", name: "Papas Especiales", price: 90, description: "Queso mozzarela, queso chedar y tocino" },
    { id: "papas-especiales-grandes", name: "Papas Especiales Grandes", price: 120, description: "Queso mozzarela, queso chedar y tocino" },
  ],
}

// Cupones de descuento
export const cupones: Record<string, { discount: number; description: string }> = {
  "PZD-50": { discount: 50, description: "50% de descuento" },
  "PZD-25": { discount: 25, description: "25% de descuento" },
  "PZD-10": { discount: 10, description: "10% de descuento" },
}

// Alias para el carrusel de pizzas (misma data, estructura con id y sizes)
export const pizzas2x1 = especialidades2x1.map((e) => ({
  id: e.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
  name: e.name,
  description: e.ingredients,
  sizes: e.prices,
  category: "2x1" as const,
}))

// Complementos con imagen para el carrusel visual
export const complementosCarrusel = [
  { id: "paquete-alla-bolognese", name: "Spaguetti Alla Bolognese", description: "Salsa, Carne Molida y Queso", price: 109, image: "/spaguetti-bolognese.jpg", category: "Spaguetti" },
  { id: "paquete-della-casa", name: "Spaguetti de la Casa", description: "Jamón, Champiñones y Queso", price: 109, image: "/spaguetti-with-ham.jpg", category: "Spaguetti" },
  { id: "paquete-napoli", name: "Spaguetti Napoli", description: "Salsa Napoli y Queso", price: 109, image: "/spaguetti-napoli.jpg", category: "Spaguetti" },
  { id: "paquete-carbonarina", name: "Spaguetti Alla Carbonarina", description: "Tocino, Champiñones, Cebolla y Queso", price: 109, image: "/spaguetti-carbonara.jpg", category: "Spaguetti" },
]
