import { defineStore } from 'pinia'

// 聊天内容搜索关键词标记
export const useContentStore = defineStore({
    id: 'content',
    state: () => ({
        messageId: 0,
        keywords: '',
    }),
    actions: {
        setKeywords(keyword: string) {
            this.keywords = keyword
        },
        setMessageId(id: number) {
            this.messageId = id
        }
    },
    getters: {
        getKeywords(): string {
            return this.keywords
        },
        getMessageId(): number {
            return this.messageId
        }
    }
});