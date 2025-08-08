"use client"
import { Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type DeleteConfirmationModalProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  itemName?: string
  title?: string
  description?: string
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void | Promise<void>
  confirmLoading?: boolean
  className?: string
}

export function DeleteConfirmationModal(props: DeleteConfirmationModalProps) {
  const {
    open = true,
    onOpenChange,
    itemName,
    title,
    description,
    cancelText = "Cancel",
    confirmText = "Delete",
    onConfirm,
    confirmLoading = false,
    className,
  } = props

  const computedTitle = title ?? `Delete${itemName ? ` ${itemName}` : ""}?`
  const computedDesc = description ??
    (itemName
      ? `This action cannot be undone. This will permanently delete ${itemName}.`
      : "This action cannot be undone. This will permanently delete the selected item.")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-md rounded-3xl p-6 sm:p-8 shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          className,
        )}
        showCloseButton={false}
      >
        {/* keep content minimal; no secondary close button */}

        <div className="mx-auto mb-4 mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 ring-8 ring-background">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
            <Trash2 className="h-5 w-5" />
          </div>
        </div>

        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-2xl font-semibold">{computedTitle}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-muted-foreground">
            {computedDesc}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <DialogClose asChild>
            <Button variant="outline" className="h-12 rounded-xl border-2 px-8 text-base">
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            className="h-12 rounded-xl bg-red-600 px-8 text-base hover:bg-red-600/90"
            onClick={onConfirm}
            disabled={confirmLoading}
          >
            {confirmLoading ? "Deleting..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmationModal


