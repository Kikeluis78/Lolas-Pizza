"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Youtube, Check } from "lucide-react"
import Swal from "sweetalert2"

interface RewardsSocialCardProps {
  completedOnce: string[]
  onTaskComplete: (platform: string, points: number) => void
}

export function RewardsSocialCard({ completedOnce, onTaskComplete }: RewardsSocialCardProps) {
  const handleFollowTask = (platform: string, points: number) => {
    if (completedOnce.includes(platform)) return

    const socialUrls: { [key: string]: string } = {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://x.com",
      youtube: "https://youtube.com",
    }

    window.open(socialUrls[platform], "_blank")

    setTimeout(() => {
      Swal.fire({
        title: "¡Verificando!",
        text: `Por favor, sigue nuestra página en ${platform}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Ya seguí la página",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          onTaskComplete(platform, points)
        }
      })
    }, 1000)
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">👥</span>
          Síguenos en Redes Sociales
        </CardTitle>
        <CardDescription>Gana 500 puntos por cada red social (solo una vez)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            onClick={() => handleFollowTask("facebook", 500)}
            disabled={completedOnce.includes("facebook")}
            className="justify-between"
            variant={completedOnce.includes("facebook") ? "secondary" : "default"}
          >
            <span className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              Facebook
            </span>
            {completedOnce.includes("facebook") ? (
              <Check className="h-4 w-4" />
            ) : (
              <Badge variant="secondary">+500</Badge>
            )}
          </Button>

          <Button
            onClick={() => handleFollowTask("instagram", 500)}
            disabled={completedOnce.includes("instagram")}
            className="justify-between"
            variant={completedOnce.includes("instagram") ? "secondary" : "default"}
          >
            <span className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </span>
            {completedOnce.includes("instagram") ? (
              <Check className="h-4 w-4" />
            ) : (
              <Badge variant="secondary">+500</Badge>
            )}
          </Button>

          <Button
            onClick={() => handleFollowTask("twitter", 500)}
            disabled={completedOnce.includes("twitter")}
            className="justify-between"
            variant={completedOnce.includes("twitter") ? "secondary" : "default"}
          >
            <span className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />X (Twitter)
            </span>
            {completedOnce.includes("twitter") ? (
              <Check className="h-4 w-4" />
            ) : (
              <Badge variant="secondary">+500</Badge>
            )}
          </Button>

          <Button
            onClick={() => handleFollowTask("youtube", 500)}
            disabled={completedOnce.includes("youtube")}
            className="justify-between"
            variant={completedOnce.includes("youtube") ? "secondary" : "default"}
          >
            <span className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              YouTube
            </span>
            {completedOnce.includes("youtube") ? (
              <Check className="h-4 w-4" />
            ) : (
              <Badge variant="secondary">+500</Badge>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
