"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

/**
 * Hook para validar que el usuario tenga una dirección guardada antes de agregar productos al carrito.
 * Estilo Temu/DiDi: Dirección obligatoria antes de ordenar.
 * 
 * @returns {Object} - { hasAddress: boolean, requireAddress: () => boolean }
 */
export function useRequireAddress() {
  const router = useRouter()
  const [hasAddress, setHasAddress] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkAddress()
  }, [])

  const checkAddress = () => {
    if (typeof window === "undefined") return false
    
    const addresses = localStorage.getItem("deliveryAddresses")
    const hasAddr = Boolean(addresses && JSON.parse(addresses).length > 0)
    setHasAddress(hasAddr)
    return hasAddr
  }

  /**
   * Valida si hay dirección guardada (solo para delivery).
   * Si el servicio es "restaurant", no requiere dirección.
   * Si no existe dirección y es delivery, muestra alerta y redirige a /direccion
   * 
   * @returns {boolean} - true si cumple requisitos, false si no
   */
  const requireAddress = (): boolean => {
    if (!mounted) return false

    // Verificar tipo de servicio
    const serviceType = localStorage.getItem("serviceType")
    
    // Si es recoger en restaurante, no requiere dirección
    if (serviceType === "restaurant") {
      return true
    }

    // Si es delivery, validar dirección
    const hasAddr = checkAddress()

    if (!hasAddr) {
      Swal.fire({
        icon: "warning",
        title: "Agrega tu dirección",
        html: `
          <p>Para comenzar a ordenar, necesitas agregar tu dirección de entrega.</p>
          <p class="text-sm text-muted-foreground mt-2">Es rápido y solo lo harás una vez.</p>
        `,
        confirmButtonText: "Agregar Dirección",
        showCancelButton: true,
        cancelButtonText: "Después",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/direccion")
        }
      })
      return false
    }

    return true
  }

  return {
    hasAddress,
    requireAddress,
  }
}
