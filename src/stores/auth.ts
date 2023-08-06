import { defineStore } from 'pinia'

// 标记当前登录对话框的状态
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