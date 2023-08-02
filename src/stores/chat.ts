import { defineStore } from 'pinia'

export const useChatStore = defineStore({
    id: 'chat',
    state: () => ({
        selectedChatroomId: 0,
        selectedChatroomName: '',
        scroll: false
    }),
    actions: {
        setSelectChatroomId(selectedChatroomId: number) {
            this.selectedChatroomId = selectedChatroomId
        },
        setSelectChatroomName(selectedChatroomName: string) {
            this.selectedChatroomName = selectedChatroomName
        },
        setScroll(state: boolean) {
            this.scroll = state
        }
    },
    getters: {
        getSelectedChatroomId(): number {
            return this.selectedChatroomId
        },
        getSelectedChatroomName(): string {
            return this.selectedChatroomName
        },
        getScrollState(): boolean {
            return this.scroll
        }
    }
});