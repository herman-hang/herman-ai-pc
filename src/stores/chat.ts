import { defineStore } from 'pinia'

export const useChatStore = defineStore({
    id: 'chat',
    state: () => ({
        selectedChatroomId: 0,
        selectedChatroomName: '',
        scroll: false,
        newMessageId: 0,
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
        },
        setNewMessageId(id: number) {
            this.newMessageId = id
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
        },
        getNewMessageId(): number {
            return this.newMessageId
        }
    }
});