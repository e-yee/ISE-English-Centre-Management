"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ExportNotificationProps {
  isOpen: boolean
  onClose: () => void
  message?: string
  type?: "success" | "info" | "warning" | "error"
}

export function ExportNotification({
  isOpen,
  onClose,
  message = "Your class report has been exported successfully!",
  type = "success",
}: ExportNotificationProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (isOpen) {
      // Reset progress when notification opens
      setProgress(100)
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      // Progress bar countdown
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(progressInterval)
            return 0
          }
          return prev - 2 // Decrease by 2% every 100ms (5 seconds total)
        })
      }, 100)

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose()
        }
      }

      document.addEventListener("keydown", handleEscape)

      return () => {
        clearTimeout(timer)
        clearInterval(progressInterval)
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          iconColor: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        }
      case "info":
        return {
          icon: Download,
          iconColor: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        }
      case "warning":
        return {
          icon: Download,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        }
      case "error":
        return {
          icon: X,
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        }
      default:
        return {
          icon: CheckCircle,
          iconColor: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        }
    }
  }

  const { icon: Icon, iconColor, bgColor, borderColor } = getIconAndColors()

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />

      {/* Notification Card - Top Center */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
        <Card className="bg-white shadow-lg border border-gray-200 animate-in slide-in-from-top-2 duration-300">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${bgColor} ${borderColor} border`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900">Export Complete</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100">
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-gray-700 text-sm leading-relaxed">{message}</p>

              {/* Progress bar animation */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all duration-100 ease-linear"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                This notification will close automatically in {Math.ceil(progress / 20)} seconds
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                onClick={() => {
                  // Handle download action
                  console.log("Download initiated")
                  onClose()
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 