import { create } from 'zustand';

const useErrorsStore = create((set) => ({
  errors: {},
  setErrors: (newErrors) => set({ errors: newErrors }),
  addError: (key, value) => set((state) => ({
    errors: { ...state.errors, [key]: value },
  })),
  removeError: (key) => set((state) => {
    const newErrors = { ...state.errors };
    delete newErrors[key];
    return { errors: newErrors };
  }),
}));

export default useErrorsStore;
