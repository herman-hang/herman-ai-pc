import { defineStore } from 'pinia'

// 对聊天相关监听
export const useChatStore = defineStore({
    id: 'chat',
    state: () => ({
        selectedChatroomId: 0, // 聊天列表选中的对话
        selectedChatroomName: '', // 选中聊天对话名称
        scroll: false, // 聊天内容控制滚动条滑到底部
        newMessageId: 0, // 发送新消息
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