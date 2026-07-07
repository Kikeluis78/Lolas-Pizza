// =============================================
// SPIN UTILS
// Motor de la ruleta profesional
// =============================================

export interface Prize {
  id: number
  icon: string
  label: string
  color: string
  weight: number
  type: "money" | "discount" | "pizza" | "gift"
  value: number | string
  description?: string
}

// =========================================
// CONFIGURACIÓN DE TIEMPO
// =========================================

// Desarrollo: 4 minutos
export const SPIN_COOLDOWN = 4 * 60 * 1000

// Producción: 24 horas
// export const SPIN_COOLDOWN = 24 * 60 * 60 * 1000

// =========================================
// PREMIOS CON PROBABILIDADES
// =========================================
// El dinero se acumula en saldo, no se puede cambiar por efectivo
// Pizza Grande Gratis: solo especialidad de 1 ingrediente

export const prizes: Prize[] = [
  // Dinero (se acumula)
  {
    id: 1,
    icon: "💵",
    label: "$0.50",
    color: "bg-green-400",
    weight: 45,
    type: "money",
    value: 0.50,
    description: "Se suma a tu saldo",
  },
  {
    id: 2,
    icon: "💵",
    label: "$1.00",
    color: "bg-green-500",
    weight: 25,
    type: "money",
    value: 1,
    description: "Se suma a tu saldo",
  },
  {
    id: 3,
    icon: "💵",
    label: "$2.00",
    color: "bg-green-600",
    weight: 10,
    type: "money",
    value: 2,
    description: "Se suma a tu saldo",
  },
  {
    id: 4,
    icon: "💰",
    label: "$5.00",
    color: "bg-emerald-500",
    weight: 3,
    type: "money",
    value: 5,
    description: "Se suma a tu saldo",
  },
  {
    id: 5,
    icon: "💰",
    label: "$10.00",
    color: "bg-emerald-600",
    weight: 5,
    type: "money",
    value: 10,
    description: "Se suma a tu saldo",
  },
  {
    id: 6,
    icon: "💎",
    label: "$15.00",
    color: "bg-cyan-500",
    weight: 3,
    type: "money",
    value: 15,
    description: "Se suma a tu saldo",
  },
  {
    id: 7,
    icon: "💎",
    label: "$30.00",
    color: "bg-cyan-600",
    weight: 3,
    type: "money",
    value: 30,
    description: "Se suma a tu saldo",
  },
  {
    id: 8,
    icon: "👑",
    label: "$250.00",
    color: "bg-yellow-500",
    weight: 1,
    type: "money",
    value: 250,
    description: "¡Premio máximo!",
  },
  // Descuento
  {
    id: 9,
    icon: "🏷️",
    label: "50% Descuento",
    color: "bg-purple-500",
    weight: 2,
    type: "discount",
    value: 50,
    description: "En tu próxima compra",
  },
  // Pizza Grande Gratis (probabilidad muy baja para inicio)
  {
    id: 10,
    icon: "🍕",
    label: "Pizza Grande",
    color: "bg-orange-500",
    weight: 0.1, // Súper baja probabilidad - 0.1%
    type: "pizza",
    value: "grande",
    description: "1 ingrediente - No canjeable por efectivo",
  },
  // Premio Sorpresa
  {
    id: 11,
    icon: "🎁",
    label: "Premio Sorpresa",
    color: "bg-pink-500",
    weight: 2,
    type: "gift",
    value: "sorpresa",
    description: "¡Descúbrelo en tu pedido!",
  },
]

// =========================================
// PROBABILIDADES (para referencia)
// =========================================
// $0.50:      45%
// $1.00:      25%
// $2.00:      10%
// $10.00:      5%
// $5.00:       3%
// $15.00:      3%
// $30.00:      3%
// 50% Desc:    2%
// Premio Sop:  2%
// $250.00:     1%
// Pizza Gde:   0.1% (muy baja para inicio)

// =========================================
// PREMIO ALEATORIO USANDO PESOS
// =========================================

export function getRandomPrize(): Prize {
  const totalWeight = prizes.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * totalWeight

  for (const item of prizes) {
    random -= item.weight
    if (random <= 0) {
      return item
    }
  }

  return prizes[0]
}

// =========================================
// CONSTRUIR SECUENCIA DE GIRO
// =========================================

export function buildSpinSequence(winner: Prize, turns: number = 60): Prize[] {
  const sequence: Prize[] = []

  for (let i = 0; i < turns; i++) {
    const random = prizes[Math.floor(Math.random() * prizes.length)]
    sequence.push(random)
  }

  sequence.push(winner)

  return sequence
}

// =========================================
// LOCAL STORAGE
// =========================================

const STORAGE_KEY = "last_spin"
const LAST_WIN_KEY = "last_win"
const STREAK_KEY = "spin_streak"
const STREAK_DATES_KEY = "streak_dates"

export function saveSpin() {
  localStorage.setItem(STORAGE_KEY, Date.now().toString())
}

export function getLastSpin(): number | null {
  const value = localStorage.getItem(STORAGE_KEY)
  if (!value) return null
  return Number(value)
}

export function saveLastWin(prize: Prize) {
  localStorage.setItem(LAST_WIN_KEY, JSON.stringify(prize))
}

export function getLastWin(): Prize | null {
  const value = localStorage.getItem(LAST_WIN_KEY)
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

// =========================================
// SISTEMA DE RACHA
// =========================================

interface StreakData {
  currentStreak: number
  lastSpinDate: string // YYYY-MM-DD
  dates: string[] // Últimas fechas de giro
}

export function getStreakData(): StreakData {
  const value = localStorage.getItem(STREAK_DATES_KEY)
  if (!value) {
    return { currentStreak: 0, lastSpinDate: "", dates: [] }
  }
  try {
    return JSON.parse(value)
  } catch {
    return { currentStreak: 0, lastSpinDate: "", dates: [] }
  }
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD
}

export function getYesterdayDate(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

export function updateStreak(): { streak: number; broken: boolean; completed: boolean } {
  const today = getTodayDate()
  const yesterday = getYesterdayDate()
  const streakData = getStreakData()

  // Si ya giró hoy, no actualizar la racha
  if (streakData.lastSpinDate === today) {
    return { streak: streakData.currentStreak, broken: false, completed: streakData.currentStreak >= 10 }
  }

  let newStreak = streakData.currentStreak
  let broken = false

  // Verificar si rompió la racha (no giró ayer)
  if (streakData.lastSpinDate && streakData.lastSpinDate !== yesterday && streakData.lastSpinDate !== today) {
    // Rompió la racha - perder todo si no completó los 10 días
    if (streakData.currentStreak < 10) {
      broken = true
      newStreak = 1
      // Reiniciar todos los premios
      resetAllRewards()
    } else {
      // Ya completó 10 días, empieza nueva racha pero sin perder
      newStreak = 1
    }
  } else if (!streakData.lastSpinDate) {
    // Primer giro
    newStreak = 1
  } else {
    // Continúa la racha
    newStreak = streakData.currentStreak + 1
  }

  // Actualizar datos de racha
  const newDates = [...streakData.dates, today].slice(-10) // Guardar últimas 10 fechas
  const newStreakData: StreakData = {
    currentStreak: newStreak,
    lastSpinDate: today,
    dates: newDates,
  }
  localStorage.setItem(STREAK_DATES_KEY, JSON.stringify(newStreakData))

  const completed = newStreak >= 10

  return { streak: newStreak, broken, completed }
}

export function getCurrentStreak(): number {
  const streakData = getStreakData()
  const today = getTodayDate()
  const yesterday = getYesterdayDate()

  // Si giró hoy o ayer, la racha sigue vigente
  if (streakData.lastSpinDate === today || streakData.lastSpinDate === yesterday) {
    return streakData.currentStreak
  }

  // Si no giró hoy ni ayer, la racha se rompió
  return 0
}

export function hasCompletedStreak(): boolean {
  const streakData = getStreakData()
  return streakData.currentStreak >= 10
}

export function getStreakStatus(): { 
  current: number
  remaining: number
  completed: boolean
  lastDate: string 
} {
  const streakData = getStreakData()
  const current = getCurrentStreak()
  
  return {
    current,
    remaining: Math.max(0, 10 - current),
    completed: current >= 10,
    lastDate: streakData.lastSpinDate,
  }
}

// Función para reiniciar todos los premios cuando se rompe la racha
function resetAllRewards() {
  localStorage.removeItem("spinMoneyBalance")
  localStorage.removeItem("wonPizzas")
  localStorage.removeItem("wonDiscounts")
  localStorage.removeItem("wonGifts")
}

// =========================================
// PUEDE GIRAR
// =========================================

export function canSpin(): boolean {
  const last = getLastSpin()
  if (last === null) return true
  return Date.now() - last >= SPIN_COOLDOWN
}

// =========================================
// TIEMPO RESTANTE
// =========================================

export function getRemainingTime(): number {
  const last = getLastSpin()
  if (last === null) return 0

  const remain = SPIN_COOLDOWN - (Date.now() - last)
  return Math.max(0, remain)
}

// =========================================
// FORMATO HH:MM:SS
// =========================================

export function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60

  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

// =========================================
// SUMAR PUNTOS AL USUARIO
// =========================================

export function addPointsToUser(points: number) {
  const defaultRewards = { points: 0, completedOnce: [], dailyTasks: {} }
  const saved = localStorage.getItem("rewardsData")
  const currentRewards = saved ? { ...defaultRewards, ...JSON.parse(saved) } : defaultRewards
  const newRewards = { ...currentRewards, points: currentRewards.points + points }
  localStorage.setItem("rewardsData", JSON.stringify(newRewards))
  return newRewards.points
}

// =========================================
// SALDO ACUMULADO (DINERO)
// =========================================

export function addMoneyToUser(amount: number) {
  const currentBalance = getMoneyBalance()
  const newBalance = currentBalance + amount
  localStorage.setItem("spinMoneyBalance", newBalance.toString())
  return newBalance
}

export function getMoneyBalance(): number {
  const value = localStorage.getItem("spinMoneyBalance")
  return value ? parseFloat(value) : 0
}

export function useMoneyBalance(amount: number): boolean {
  const current = getMoneyBalance()
  if (current < amount) return false
  localStorage.setItem("spinMoneyBalance", (current - amount).toString())
  return true
}

// =========================================
// PIZZAS GANADAS
// =========================================

interface WonPizza {
  id: string
  size: string
  date: string
  used: boolean
}

export function addWonPizza(size: string): WonPizza {
  const pizza: WonPizza = {
    id: `pizza-${Date.now()}`,
    size,
    date: new Date().toISOString(),
    used: false,
  }
  const pizzas = getWonPizzas()
  pizzas.push(pizza)
  localStorage.setItem("wonPizzas", JSON.stringify(pizzas))
  return pizza
}

export function getWonPizzas(): WonPizza[] {
  const value = localStorage.getItem("wonPizzas")
  return value ? JSON.parse(value) : []
}

export function getAvailablePizzas(): WonPizza[] {
  return getWonPizzas().filter(p => !p.used)
}

export function usePizza(pizzaId: string): boolean {
  const pizzas = getWonPizzas()
  const pizza = pizzas.find(p => p.id === pizzaId)
  if (!pizza || pizza.used) return false
  pizza.used = true
  localStorage.setItem("wonPizzas", JSON.stringify(pizzas))
  return true
}

// =========================================
// DESCUENTOS GANADOS
// =========================================

interface WonDiscount {
  id: string
  percentage: number
  date: string
  used: boolean
}

export function addWonDiscount(percentage: number): WonDiscount {
  const discount: WonDiscount = {
    id: `discount-${Date.now()}`,
    percentage,
    date: new Date().toISOString(),
    used: false,
  }
  const discounts = getWonDiscounts()
  discounts.push(discount)
  localStorage.setItem("wonDiscounts", JSON.stringify(discounts))
  return discount
}

export function getWonDiscounts(): WonDiscount[] {
  const value = localStorage.getItem("wonDiscounts")
  return value ? JSON.parse(value) : []
}

export function getAvailableDiscounts(): WonDiscount[] {
  return getWonDiscounts().filter(d => !d.used)
}

export function useDiscount(discountId: string): boolean {
  const discounts = getWonDiscounts()
  const discount = discounts.find(d => d.id === discountId)
  if (!discount || discount.used) return false
  discount.used = true
  localStorage.setItem("wonDiscounts", JSON.stringify(discounts))
  return true
}

// =========================================
// PREMIOS SORPRESA
// =========================================

interface WonGift {
  id: string
  date: string
  claimed: boolean
}

export function addWonGift(): WonGift {
  const gift: WonGift = {
    id: `gift-${Date.now()}`,
    date: new Date().toISOString(),
    claimed: false,
  }
  const gifts = getWonGifts()
  gifts.push(gift)
  localStorage.setItem("wonGifts", JSON.stringify(gifts))
  return gift
}

export function getWonGifts(): WonGift[] {
  const value = localStorage.getItem("wonGifts")
  return value ? JSON.parse(value) : []
}

export function getAvailableGifts(): WonGift[] {
  return getWonGifts().filter(g => !g.claimed)
}
