import { defineStore } from 'pinia'


export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    loginDialog: false,
  }),
  actions: {
    showLoginDialog() {
      this.loginDialog = true;
    },
    hideLoginDialog() {
      this.loginDialog = false;
    },
  },
});