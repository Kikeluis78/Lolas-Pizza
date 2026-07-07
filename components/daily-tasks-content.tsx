"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Youtube, Check, ArrowLeft } from "lucide-react"
import Swal from "sweetalert2"

interface DailyTasksContentProps {
  dailyTasks: { [key: string]: string }
  onBack: () => void
  onTaskComplete: (platform: string, points: number) => void
}

export function DailyTasksContent({ dailyTasks, onBack, onTaskComplete }: DailyTasksContentProps) {
  const handleDailyLike = (platform: string, points: number) => {
    const today = new Date().toDateString()
    const taskKey = `like-${platform}`

    if (dailyTasks[taskKey] === today) {
      Swal.fire({
        title: "Ya completaste esta tarea",
        text: "Vuelve mañana para ganar más puntos",
        icon: "info",
      })
      return
    }

    const socialUrls: { [key: string]: string } = {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://x.com",
      youtube: "https://youtube.com",
    }

    window.open(socialUrls[platform], "_blank")

    setTimeout(() => {
      Swal.fire({
        title: "¡Dale like a nuestra última publicación!",
        text: `Visita nuestra página en ${platform}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Ya di like",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          onTaskComplete(platform, points)
        }
      })
    }, 1000)
  }

  const today = new Date().toDateString()

  return (
    <>
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            Tareas Diarias
          </CardTitle>
          <CardDescription>Dale like a nuestra última publicación (100 puntos por red social)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              onClick={() => handleDailyLike("facebook", 100)}
              disabled={dailyTasks[`like-facebook`] === today}
              className="justify-between"
              variant={
                dailyTasks[`like-facebook`] === today ? "secondary" : "outline"
              }
            >
              <span className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Like en Facebook
              </span>
              {dailyTasks[`like-facebook`] === today ? (
                <Check className="h-4 w-4" />
              ) : (
                <Badge>+100</Badge>
              )}
            </Button>

            <Button
              onClick={() => handleDailyLike("instagram", 100)}
              disabled={dailyTasks[`like-instagram`] === today}
              className="justify-between"
              variant={
                dailyTasks[`like-instagram`] === today ? "secondary" : "outline"
              }
            >
              <span className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Like en Instagram
              </span>
              {dailyTasks[`like-instagram`] === today ? (
                <Check className="h-4 w-4" />
              ) : (
                <Badge>+100</Badge>
              )}
            </Button>

            <Button
              onClick={() => handleDailyLike("twitter", 100)}
              disabled={dailyTasks[`like-twitter`] === today}
              className="justify-between"
              variant={dailyTasks[`like-twitter`] === today ? "secondary" : "outline"}
            >
              <span className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Like en X
              </span>
              {dailyTasks[`like-twitter`] === today ? (
                <Check className="h-4 w-4" />
              ) : (
                <Badge>+100</Badge>
              )}
            </Button>

            <Button
              onClick={() => handleDailyLike("youtube", 100)}
              disabled={dailyTasks[`like-youtube`] === today}
              className="justify-between"
              variant={dailyTasks[`like-youtube`] === today ? "secondary" : "outline"}
            >
              <span className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                Like en YouTube
              </span>
              {dailyTasks[`like-youtube`] === today ? (
                <Check className="h-4 w-4" />
              ) : (
                <Badge>+100</Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
