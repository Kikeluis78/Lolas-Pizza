"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ComplementoCard } from "@/components/complemento-card"
import { complementos } from "@/config/menu.config"
import { pizzeriaConfig } from "@/config/pizzeria.config"
import { UtensilsCrossed } from "lucide-react"

export default function ComplementosPage() {
  const { features } = pizzeriaConfig
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <UtensilsCrossed className="h-10 w-10 text-secondary" />
              <h1 className="text-5xl md:text-6xl font-extrabold bg-linear-to-r from-secondary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg">
                Complementos
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">Acompaña tu pedido con bebidas y spaguetti</p>
          </div>

          <div className="space-y-12">
            {features.bebidas && (
            <section>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-secondary">Bebidas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {complementos.bebidas.map((item) => (
                  <ComplementoCard key={item.id} complemento={item} />
                ))}
              </div>
            </section>
            )}

            {features.spaguetti && (
            <section>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-secondary">Spaguetti</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {complementos.spaguetti.map((item) => (
                  <ComplementoCard key={item.id} complemento={item} />
                ))}
              </div>
            </section>
            )}

            {features.snacks && complementos.snacks && (
            <section>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-secondary">Snacks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {complementos.snacks.map((item) => (
                  <ComplementoCard key={item.id} complemento={item} />
                ))}
              </div>
            </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
