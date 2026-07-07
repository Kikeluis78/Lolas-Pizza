"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Settings, Menu, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { pizzeriaConfig } from "@/config/pizzeria.config"

export function Header() {
  const { items } = useCart()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cerrar menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  // Cerrar menú al presionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false)
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  const itemCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0

  const navLinks = [
    { href: "/home", label: "Inicio" },
    { href: "/pizzas", label: "Pizzas" },
    { href: "/paquetes", label: "Paquetes", feature: "paquetes" as const },
    { href: "/complementos", label: "Complementos" },
    { href: "/recompensas", label: "Recompensas", feature: "recompensas" as const },
    { href: "/vip", label: "V.I.P", feature: "vip" as const },
  ].filter(link => !link.feature || pizzeriaConfig.features[link.feature])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-primary/20 bg-gradient-to-r from-background via-background to-primary/5 backdrop-blur-md shadow-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/home" className="flex items-center gap-3 group">
            <Image
              src="/logoLolaspizza.png"
              alt="Lola's Pizza Logo"
              width={40}
              height={40}
              className="rounded-lg shadow-md group-hover:scale-110 transition-all duration-300"
            />
            <span className="text-xl font-extrabold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              <span className="font-brand">Lola's Pizza</span>
            </span>
          </Link>

          {/* Menú para desktop - oculto en móvil */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-all duration-200 ${
                  pathname === link.href
                    ? "text-primary scale-110 drop-shadow-md"
                    : "text-foreground hover:text-primary hover:scale-105"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Botón hamburguesa para móvil - solo visible en móvil */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X className="!h-9 !w-9 text-primary" /> : <Menu className="!h-9 !w-9 text-primary" />}
            </Button>

            {/* Carrito y Ajustes - solo visibles en desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/carrito">
                <Button
                  variant={mounted && itemCount > 0 ? "default" : "ghost"}
                  size="icon"
                  className={`relative transition-all duration-300 ${
                    mounted && itemCount > 0 
                      ? "gradient-primary shadow-md hover:shadow-glow hover:scale-110" 
                      : "hover:bg-primary/10"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-1 -top-1 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold animate-pulse-glow"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/ajustes">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:scale-110 transition-all duration-300">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil desplegable */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          ${isMenuOpen ? "visible" : "invisible"}
          transition-all duration-300
        `}
      >
        {/* Overlay */}
        <div
          className={`
            absolute inset-0 bg-black/60 backdrop-blur-sm
            ${isMenuOpen ? "opacity-100" : "opacity-0"}
            transition-opacity duration-300
          `}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Panel del menú */}
        <div
          className={`
            absolute right-0 top-0 h-full w-72 bg-gradient-to-b from-background to-primary/5 shadow-2xl border-l-2 border-primary/20
            ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
            transition-transform duration-300 ease-in-out
          `}
        >
          <div className="flex flex-col p-6">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/home"
                className="flex items-center gap-2 group"
                onClick={handleLinkClick}
              >
                <Image
                  src="/logoLolaspizza.png"
                  alt="Lola's Pizza Logo"
                  width={40}
                  height={40}
                  className="rounded-lg shadow-md"
                />
                <span className="text-xl font-extrabold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                  <span className="font-brand">Lola's Pizza</span>
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
                className="hover:bg-primary/10"
              >
                <X className="h-5 w-5 text-primary" />
              </Button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`py-3 px-4 text-base font-bold rounded-xl transition-all duration-200 ${
                    pathname === link.href
                      ? "bg-gradient-to-r from-primary to-destructive text-white shadow-md"
                      : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Carrito y Ajustes solo en menú móvil */}
            <div className="mt-8 pt-6 border-t-2 border-primary/20">
              <div className="flex flex-col gap-3">
                <Link
                  href="/carrito"
                  className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-primary/10 transition-all duration-200"
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold">Carrito</span>
                  </div>
                  {mounted && itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="h-6 w-6 flex items-center justify-center p-0 text-xs font-bold"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Link>
                <Link
                  href="/ajustes"
                  className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-primary/10 transition-all duration-200"
                  onClick={handleLinkClick}
                >
                  <Settings className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold">Ajustes</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}