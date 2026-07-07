"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { especialidades2x1, especialidades3x1, UnIngrediente } from "@/config/menu.config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Pizza2x1Card } from "@/components/pizza-2x1-card"
import { Pizza3x1Card } from "@/components/pizza-3x1-card"
import { PizzaUnIngredienteCard } from "@/components/pizza-un-ingrediente-card"
import { PromoMesModal } from "@/components/promo-mes-modal"
import { pizzeriaConfig } from "@/config/pizzeria.config"

type ViewType = "menu" | "2x1" | "3x1" | "individual" | "un-ingrediente"

export default function PizzasPage() {
    const [view, setView] = useState<ViewType>("menu")
    const [selectedPizza, setSelectedPizza] = useState<(typeof especialidades2x1)[0] | null>(null)
    const [selectedUningrediente, setSelectedUningrediente] = useState<(typeof UnIngrediente)[0] | null>(null)
    const [isPromoOpen, setIsPromoOpen] = useState(false)
    const [promoActiva, setPromoActiva] = useState<typeof pizzeriaConfig.promoMes.promos[0] | null>(null)

    useEffect(() => {
        const { enabled, promos } = pizzeriaConfig.promoMes
        if (!enabled) return

        const now = new Date()
        const mmdd = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
        const activa = promos.find(p => mmdd >= p.fechaInicio && mmdd <= p.fechaFin) ?? null
        if (!activa) return

        const hiddenDate = localStorage.getItem("promoMesHiddenDate")
        const today = now.toISOString().slice(0, 10)
        if (hiddenDate === today) return

        setPromoActiva(activa)
        setIsPromoOpen(true)
    }, [])

    const handlePizzaClick = (pizza: typeof especialidades2x1[0]) => {
        setSelectedPizza(pizza)
    }

    // Menu Principal - Solo 2 tarjetas
    if (view === "menu") {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-linear-to-b from-background via-background to-primary/5">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-linear-to-r from-primary via-destructive to-secondary bg-clip-text text-transparent drop-shadow-lg">
                               Elige la oferta que prefieres 
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground font-medium">
                                
                            </p>
                        </div>

                        {/* Main Cards */}
                        <div className="grid gap-6 max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                            {/* 2x1 Card - Condicional */}
                            {pizzeriaConfig.features.promo2x1 && (
                            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-primary/60 bg-gradient-to-br from-card via-primary/10 to-accent/10 hover:border-primary/100 hover:shadow-glow">
                                <CardHeader className="bg-gradient-to-r from-primary/20 via-accent/10 to-secondary/10 pb-6">
                                    <Badge className="w-fit mb-3 bg-gradient-to-r from-primary to-accent text-white font-bold">🔥 Promoción</Badge>
                                    <CardTitle className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                                        2x1
                                    </CardTitle>
                                    <p className="text-lg text-primary font-semibold mt-2">Dos pizzas al precio de una</p>
                                </CardHeader>
                                <CardContent className="pt-6 pb-6">
                                    <p className="text-muted-foreground mb-6 text-base">
                                        Elige dos especialidades diferentes y disfruta de ambas al precio de una sola. Perfecto para compartir.
                                    </p>
                                    <Button 
                                        onClick={() => setView("2x1")} 
                                        className="w-full h-14 text-lg font-extrabold bg-gradient-to-r from-primary via-accent to-secondary text-white hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 shadow-md hover:shadow-glow transition-all duration-300 hover:scale-105"
                                    >
                                        Ordenar →
                                    </Button>
                                </CardContent>
                            </Card>
                            )}

                            {/* 3x1 Card - Condicional */}
                            {pizzeriaConfig.features.promo3x1 && (
                                <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-accent/60 bg-gradient-to-br from-card via-accent/10 to-secondary/10 hover:border-accent/100 hover:shadow-glow">
                                    <CardHeader className="bg-gradient-to-r from-accent/20 via-secondary/10 to-primary/10 pb-6">
                                        <Badge className="w-fit mb-3 bg-gradient-to-r from-accent to-secondary text-white font-bold">⚡ Super Promo</Badge>
                                        <CardTitle className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
                                            3x1
                                        </CardTitle>
                                        <p className="text-lg text-accent font-semibold mt-2">Tres pizzas al precio de una</p>
                                    </CardHeader>
                                    <CardContent className="pt-6 pb-6">
                                        <p className="text-muted-foreground mb-6 text-base">
                                            La mejor oferta. Elige tres especialidades diferentes y paga solo una. Ideal para fiestas.
                                        </p>
                                        <Button 
                                            onClick={() => setView("3x1")} 
                                            className="w-full h-14 text-lg font-extrabold bg-gradient-to-r from-accent via-secondary to-primary text-white hover:from-accent/90 hover:via-secondary/90 hover:to-primary/90 shadow-md hover:shadow-glow transition-all duration-300 hover:scale-105"
                                        >
                                            Ordenar →
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Individual Pizza Card */}
                            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-secondary/60 bg-gradient-to-br from-card via-secondary/10 to-accent/10 hover:border-secondary/100 hover:shadow-glow">
                                <CardHeader className="bg-gradient-to-r from-secondary/20 via-accent/10 to-primary/10 pb-6">
                                    <Badge className="w-fit mb-3 bg-gradient-to-r from-secondary to-accent text-white font-bold">🍕 Clásico</Badge>
                                    <CardTitle className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                                      Especialidades
                                    </CardTitle>
                                    <p className="text-lg text-secondary font-semibold mt-2">Una pizza, Super Precio</p>
                                </CardHeader>
                                <CardContent className="pt-6 pb-6">
                                    <p className="text-muted-foreground mb-6 text-base">
                                        Elige una de nuestras especialidades en el tamaño que prefieras. Personaliza con tus extras favoritos.
                                    </p>
                                    <Button 
                                        onClick={() => setView("individual")} 
                                        className="w-full h-14 text-lg font-extrabold bg-gradient-to-r from-secondary via-accent to-primary text-white hover:from-secondary/90 hover:via-accent/90 hover:to-primary/90 shadow-md hover:shadow-glow transition-all duration-300 hover:scale-105"
                                    >
                                        Ordenar →
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Un Ingrediente Card */}
                            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-amber-500/60 bg-gradient-to-br from-card via-amber-500/10 to-orange-500/10 hover:border-amber-500/100 hover:shadow-glow">
                                <CardHeader className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-secondary/10 pb-6">
                                    <Badge className="w-fit mb-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold">✨ Sencillo</Badge>
                                    <CardTitle className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-500 via-orange-500 to-secondary bg-clip-text text-transparent">
                                        Un Ingrediente
                                    </CardTitle>
                                    <p className="text-lg text-amber-600 font-semibold mt-2">Pizzas simples y deliciosas</p>
                                </CardHeader>
                                <CardContent className="pt-6 pb-6">
                                    <p className="text-muted-foreground mb-6 text-base">
                                        Pizza con un solo ingrediente. Perfectas para los que prefieren lo sencillo y delicioso.
                                    </p>
                                    <Button 
                                        onClick={() => setView("un-ingrediente")} 
                                        className="w-full h-14 text-lg font-extrabold bg-gradient-to-r from-amber-500 via-orange-500 to-secondary text-white hover:from-amber-500/90 hover:via-orange-500/90 hover:to-secondary/90 shadow-md hover:shadow-glow transition-all duration-300 hover:scale-105"
                                    >
                                        Ordenar →
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
                <Footer />
                <PromoMesModal
                    isOpen={isPromoOpen}
                    onClose={() => setIsPromoOpen(false)}
                    promo={promoActiva}
                />
            </>
        )
    }

    // 2x1 View - Grid de especialidades
    if (view === "2x1" && !selectedPizza) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-linear-to-b from-background via-background to-primary/5">
                    <div className="container mx-auto px-4 py-8">
                        <Button
                            variant="outline"
                            className="mb-8"
                            onClick={() => setView("menu")}
                        >
                            ← Volver
                        </Button>

                        <div className="text-center mb-12">
                            <Badge className="gradient-primary text-white text-sm px-4 py-1 mb-4 inline-block">
                                Promoción 2x1
                            </Badge>
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-linear-to-r from-primary via-destructive to-secondary bg-clip-text text-transparent drop-shadow-lg">
                                Especialidades 2x1
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground font-medium">
                                Selecciona tu primera pizza
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {especialidades2x1.map((especialidad, index) => (
                                <Card
                                    key={especialidad.name}
                                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-primary/60 animate-fadeIn bg-gradient-to-br from-card via-primary/5 to-accent/5 hover:border-primary/100 hover:shadow-glow"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    onClick={() => handlePizzaClick(especialidad)}
                                >
                                    <CardHeader className="pb-3 pt-4 px-3 bg-gradient-to-r from-primary/10 to-accent/10">
                                        <CardTitle className="text-center text-lg sm:text-xl md:text-base font-extrabold text-primary group-hover:text-primary/80 transition-colors line-clamp-2">
                                            {especialidad.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-3 pb-3 px-3">
                                        <Button size="sm" className="w-full text-xs h-8 font-bold bg-gradient-to-r from-primary via-accent to-secondary text-white hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 shadow-md hover:shadow-glow hover:scale-105 transition-all duration-300">
                                            Seleccionar
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    // 2x1 Customization View
    if (view === "2x1" && selectedPizza) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-linear-to-b from-background via-background to-primary/5">
                    <div className="container mx-auto px-4 py-8">
                        <Button
                            variant="outline"
                            className="mb-6"
                            onClick={() => setSelectedPizza(null)}
                        >
                            ← Volver al menú
                        </Button>
                        <div className="max-w-2xl mx-auto">
                            <Pizza2x1Card
                                especialidad={selectedPizza}
                                allEspecialidades={especialidades2x1.map(e => e.name)}
                            />
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    // 3x1 View - Grid de especialidades
    if (view === "3x1" && !selectedPizza) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
                    <div className="container mx-auto px-4 py-8">
                        <Button
                            variant="outline"
                            className="mb-8"
                            onClick={() => setView("menu")}
                        >
                            ← Volver
                        </Button>

                        <div className="text-center mb-12">
                            <Badge className="bg-gradient-to-r from-accent to-secondary text-white text-sm px-4 py-1 mb-4 inline-block">
                                Promoción 3x1
                            </Badge>
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-linear-to-r from-accent via-secondary to-primary bg-clip-text text-transparent drop-shadow-lg">
                                Especialidades 3x1
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground font-medium">
                                Selecciona tu primera pizza
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {especialidades3x1.map((especialidad, index) => (
                                <Card
                                    key={especialidad.name}
                                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-accent/60 animate-fadeIn bg-gradient-to-br from-card via-accent/5 to-secondary/5 hover:border-accent/100 hover:shadow-glow"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    onClick={() => handlePizzaClick(especialidad)}
                                >
                                    <CardHeader className="pb-3 pt-4 px-3 bg-gradient-to-r from-accent/10 to-secondary/10">
                                        <CardTitle className="text-center text-lg sm:text-xl md:text-base font-extrabold text-accent group-hover:text-accent/80 transition-colors line-clamp-2">
                                            {especialidad.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-3 pb-3 px-3">
                                        <Button size="sm" className="w-full text-xs h-8 font-bold bg-gradient-to-r from-accent via-secondary to-primary text-white hover:from-accent/90 hover:via-secondary/90 hover:to-primary/90 shadow-md hover:shadow-glow hover:scale-105 transition-all duration-300">
                                            Seleccionar
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    // 3x1 Customization View
    if (view === "3x1" && selectedPizza) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
                    <div className="container mx-auto px-4 py-8">
                        <Button
                            variant="outline"
                            className="mb-6"
                            onClick={() => setSelectedPizza(null)}
                        >
                            ← Volver al menú
                        </Button>
                        <div className="max-w-2xl mx-auto">
                            <Pizza3x1Card
                                especialidad={selectedPizza}
                                allEspecialidades={especialidades3x1.map(e => e.name)}
                            />
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    // Individual Pizza View - Grid
    if (view === "individual" && !selectedPizza) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-linear-to-b from-background via-background to-primary/5">
                    <div className="container mx-auto px-4 py-8">
                        <Button
                            variant="outline"
                            className="mb-8"
                            onClick={() => setView("menu")}
                        >
                            ← Volver
                        </Button>

                        <div className="text-center mb-12">
                            <Badge className="bg-secondary text-white text-sm px-4 py-1 mb-4 inline-block">
                                Pizzas Individuales
                            </Badge>
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-linear-to-r from-secondary via-primary to-accent bg-clip-text text-transparent drop-shadow-lg">
                                Una Pizza
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground font-medium">
                                Elige tu especialidad favorita
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {especialidades2x1.map((especialidad, index) => (
                                <Card
                                    key={especialidad.name}
                                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-secondary/60 animate-fadeIn bg-gradient-to-br from-card via-secondary/5 to-accent/5 hover:border-secondary/100 hover:shadow-glow"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    onClick={() => {
                                        setSelectedPizza(especialidad)
                                    }}
                                >
                                    <CardHeader className="pb-3 pt-4 px-3 bg-gradient-to-r from-secondary/10 to-accent/10">
                                        <CardTitle className="text-center text-lg sm:text-xl md:text-base font-extrabold text-secondary group-hover:text-secondary/80 transition-colors line-clamp-2">
                                            {especialidad.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-3 pb-3 px-3">
                                        <Button size="sm" className="w-full text-xs h-8 font-bold bg-gradient-to-r from-secondary via-accent to-primary text-white hover:from-secondary/90 hover:via-accent/90 hover:to-primary/90 shadow-md hover:shadow-glow hover:scale-105 transition-all duration-300">
                                            Seleccionar
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    // Individual Pizza Customization View
    if (view === "individual" && selectedPizza) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-linear-to-b from-background via-background to-secondary/5">
                    <div className="container mx-auto px-4 py-8">
                        <Button
                            variant="outline"
                            className="mb-6"
                            onClick={() => setSelectedPizza(null)}
                        >
                            ← Volver al menú
                        </Button>
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-secondary">Pizza Individual</h2>
                                <p className="text-sm text-muted-foreground">Personaliza tu pizza</p>
                            </div>
                            <Pizza2x1Card
                                especialidad={selectedPizza}
                                allEspecialidades={especialidades2x1.map(e => e.name)}
                            />
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    // Un Ingrediente View - Grid
    if (view === "un-ingrediente" && !selectedUningrediente) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-linear-to-b from-background via-background to-amber-500/5">
                    <div className="container mx-auto px-4 py-8">
                        <Button
                            variant="outline"
                            className="mb-8"
                            onClick={() => setView("menu")}
                        >
                            ← Volver
                        </Button>

                        <div className="text-center mb-12">
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm px-4 py-1 mb-4 inline-block">
                                Un Ingrediente
                            </Badge>
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-linear-to-r from-amber-500 via-orange-500 to-secondary bg-clip-text text-transparent drop-shadow-lg">
                                Pizzas de Un Ingrediente
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground font-medium">
                                Elige tu ingrediente favorito
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {UnIngrediente.map((pizza, index) => (
                                <Card
                                    key={pizza.name}
                                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-amber-500/60 animate-fadeIn bg-gradient-to-br from-card via-amber-500/5 to-orange-500/5 hover:border-amber-500/100 hover:shadow-glow"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    onClick={() => setSelectedUningrediente(pizza)}
                                >
                                    <CardHeader className="pb-3 pt-4 px-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                                        <CardTitle className="text-center text-lg sm:text-xl md:text-base font-extrabold text-amber-600 group-hover:text-amber-700 transition-colors line-clamp-2">
                                            {pizza.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-3 pb-3 px-3">
                                        <Button size="sm" className="w-full text-xs h-8 font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-secondary text-white hover:from-amber-500/90 hover:via-orange-500/90 hover:to-secondary/90 shadow-md hover:shadow-glow hover:scale-105 transition-all duration-300">
                                            Seleccionar
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    // Un Ingrediente Customization View
    if (view === "un-ingrediente" && selectedUningrediente) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-linear-to-b from-background via-background to-amber-500/5">
                    <div className="container mx-auto px-4 py-8">
                        <Button
                            variant="outline"
                            className="mb-6"
                            onClick={() => setSelectedUningrediente(null)}
                        >
                            ← Volver al menú
                        </Button>
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-amber-600">Pizza Un Ingrediente</h2>
                                <p className="text-sm text-muted-foreground">Personaliza tu pizza</p>
                            </div>
                            <PizzaUnIngredienteCard pizza={selectedUningrediente} />
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }
}
