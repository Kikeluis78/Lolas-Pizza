"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface RatingModalProps {
  open: boolean
  orderId: string
  onRate: (rating: number, comment: string) => void
  onClose: () => void
}

export function RatingModal({ open, orderId, onRate, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    if (rating === 0) {
      return
    }
    onRate(rating, comment)
    setRating(0)
    setComment("")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Cómo estuvo tu pedido?</DialogTitle>
          <DialogDescription>
            Tu opinión nos ayuda a mejorar el servicio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Estrellas */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= (hover || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Texto según calificación */}
          {rating > 0 && (
            <p className="text-center font-medium">
              {rating === 1 && "😞 Muy malo"}
              {rating === 2 && "😕 Malo"}
              {rating === 3 && "😐 Regular"}
              {rating === 4 && "😊 Bueno"}
              {rating === 5 && "🤩 Excelente"}
            </p>
          )}

          {/* Comentario opcional */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Comentario (opcional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos más sobre tu experiencia..."
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/200
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Después
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full sm:w-auto"
          >
            Enviar Calificación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
