import { toast } from "sonner";

interface ToastOptions {
  message: string;
  variant?: "success" | "error" | "info" | "warning";
  duration?: number;
}

export const showToastNotification = ({
  message,
  variant = "info",
  duration = 3000,
}: ToastOptions) => {
  switch (variant) {
    case "success":
      return toast.success(message, { duration });
    case "error":
      return toast.error(message, { duration });
    case "warning":
      return toast.warning(message, { duration });
    case "info":
    default:
      return toast.info(message, { duration });
  }
};
