"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, type, ...props }) {
        // Map custom ToastType to allowed values
        let mappedType: "foreground" | "background" | undefined;
        if (type === "success" || type === "info") {
          mappedType = "foreground";
        } else if (type === "error" || type === "warning") {
          mappedType = "background";
        } else {
          mappedType = undefined;
        }
        return (
          <Toast key={id} type={mappedType} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
