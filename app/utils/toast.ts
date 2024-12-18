import { toast } from 'sonner';

interface ToastOptions {
  description?: string;
}

export const showToast = {
  success: (title: string, options?: ToastOptions) => {
    toast.success(title, {
      description: options?.description
    });
  },

  error: (title: string, options?: ToastOptions) => {
    toast.error(title, {
      description: options?.description
    });
  },

  // Add more toast types as needed
  warning: (title: string, options?: ToastOptions) => {
    toast.warning(title, {
      description: options?.description
    });
  },

  info: (title: string, options?: ToastOptions) => {
    toast.info(title, {
      description: options?.description
    });
  }
};