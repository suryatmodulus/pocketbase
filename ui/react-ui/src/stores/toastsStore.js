import { create } from 'zustand';

let toastId = 0;

const useToastsStore = create((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = toastId++;
    const newToast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (toast.duration) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration);
    }
    return id;
  },
  addInfoToast: (message, duration = 3000) => {
    return get().addToast({ message, type: 'info', duration });
  },
  addSuccessToast: (message, duration = 3000) => {
    return get().addToast({ message, type: 'success', duration });
  },
  addErrorToast: (message, duration = 5000) => {
    return get().addToast({ message, type: 'error', duration });
  },
  addWarningToast: (message, duration = 5000) => {
    return get().addToast({ message, type: 'warning', duration });
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  removeAllToasts: () => {
    set({ toasts: [] });
  },
}));

export default useToastsStore;
