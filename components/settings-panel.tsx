"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Moon, Sun, User, Trash2, LogOut, MapPin, Edit, Home, ShoppingBag } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export function SettingsPanel() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [userAccount, setUserAccount] = useState<{ name: string; email: string; phone: string } | null>(null)
  const [mainAddress, setMainAddress] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const account = localStorage.getItem("userAccount")
    if (account) {
      setUserAccount(JSON.parse(account))
    }

    // Cargar dirección principal
    const addresses = localStorage.getItem("deliveryAddresses")
    if (addresses) {
      const parsedAddresses = JSON.parse(addresses)
      const main = parsedAddresses.find((addr: any) => addr.isMain) || parsedAddresses[0]
      setMainAddress(main)
    }
  }, [])

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Deberás iniciar sesión nuevamente",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/auth")
      }
    })
  }

  const handleClearData = () => {
    Swal.fire({
      title: "¿Eliminar todos los datos?",
      text: "Esto eliminará tu cuenta, direcciones, y toda la información guardada. Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar todo",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear()
        Swal.fire({
          icon: "success",
          title: "Datos eliminados",
          text: "Toda tu información ha sido eliminada",
          timer: 2000,
          showConfirmButton: false,
        })
        setTimeout(() => {
          router.push("/auth")
        }, 2000)
      }
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Account Info */}
      {userAccount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información de Cuenta
            </CardTitle>
            <CardDescription>Datos de tu cuenta actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground">Nombre</Label>
              <p className="font-semibold text-card-foreground">{userAccount.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-semibold text-card-foreground">{userAccount.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Teléfono</Label>
              <p className="font-semibold text-card-foreground">{userAccount.phone}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
          <CardDescription>Personaliza cómo se ve la aplicación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base font-medium">
                Modo Oscuro
              </Label>
              <p className="text-sm text-muted-foreground">Activa el tema oscuro para reducir la fatiga visual</p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="flex-1 bg-transparent"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4 mr-2" />
              Claro
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="flex-1 bg-transparent"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4 mr-2" />
              Oscuro
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mis Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Mis Pedidos
          </CardTitle>
          <CardDescription>Historial de tus pedidos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => router.push("/mis-pedidos")}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Ver Historial de Pedidos
          </Button>
        </CardContent>
      </Card>

      {/* Mi Cuenta - Dirección 1 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Dirección 1
          </CardTitle>
          <CardDescription>Tu dirección principal de entrega</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mainAddress ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{mainAddress.userName}</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    ({mainAddress.addressType === "otro" && mainAddress.otherDescription 
                      ? mainAddress.otherDescription 
                      : mainAddress.addressType})
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {mainAddress.street} #{mainAddress.number}, {mainAddress.neighborhood}
                </p>
                <p className="text-sm text-muted-foreground pl-6">
                  CP: {mainAddress.postalCode}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => router.push("/direccion")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => router.push("/cuenta")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Ver Cuenta
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">No tienes dirección guardada</p>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={() => router.push("/direccion")}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Agregar Dirección
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones de Cuenta</CardTitle>
          <CardDescription>Gestiona tu cuenta y datos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Zona de peligro</p>
            <Button variant="destructive" className="w-full justify-start" onClick={handleClearData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Todos los Datos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Versión</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Desarrollado por</span>
            <span className="font-medium">Enrique Vargas</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
