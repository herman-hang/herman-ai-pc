import { defineStore } from 'pinia'

export const useChatStore = defineStore({
    id: 'chat',
    state: () => ({
        selectedChatroom: {},
    }),
    actions: {
        selectChatroom(chatroom: object) {
            this.selectedChatroom = chatroom
        }
    },
    getters: {
        getSelectedChatroom(): object {
            return this.selectedChatroom
        }
    }
});