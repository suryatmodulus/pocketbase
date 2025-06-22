import { create } from 'zustand';

const useConfirmationStore = create((set) => ({
  text: '',
  yesCallback: null,
  noCallback: null,
  confirm: (text, yesCallback, noCallback) => set({ text, yesCallback, noCallback }),
  resetConfirmation: () => set({ text: '', yesCallback: null, noCallback: null }),
}));

export default useConfirmationStore;
