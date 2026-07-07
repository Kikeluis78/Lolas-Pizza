"use client"

import { Footer } from "@/components/footer"
import { ServiceSelector } from "@/components/service-selector"
import { PackageCarousel } from "@/components/package-carousel"
import { pizzeriaConfig } from "@/config/pizzeria.config"

export default function Home() {
  const { features } = pizzeriaConfig
  return (
    <>
      <main className="min-h-screen bg-linear-to-b from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-12 space-y-12">
          <section className="space-y-8">
            <div className="text-center space-y-6">
                <span className=" text-3xl bg-linear-to-r from-primary via-destructive to-secondary bg-clip-text text-transparent drop-shadow-lg">
                  Bienvenidos a
                </span>
               
              <h1 className="text-5xl md:text-7xl font-extrabold text-balance leading-tight">
                <span className="bg-linear-to-r from-primary via-destructive to-secondary bg-clip-text text-transparent drop-shadow-lg">
                  <span className="font-brand">Lola's Pizza</span>
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto text-green-600">
                {pizzeriaConfig.slogan}
              </p>
            </div>

            {features.paquetes && <PackageCarousel />}
          </section>

          <section className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 bg-linear-to-r from-primary to-destructive bg-clip-text text-transparent">    
            </h2>
            <ServiceSelector />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
