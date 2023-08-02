import { defineStore } from 'pinia'


export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    loginDialog: false,
  }),
  actions: {
    setLoginDialog(state: boolean) {
      this.loginDialog = state
    }
  },
  getters: {
    getLoginDialogState(): boolean {
      return this.loginDialog;
    },
  }
});