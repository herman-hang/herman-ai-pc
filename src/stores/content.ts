import { defineStore } from 'pinia'

// 聊天内容搜索关键词标记
export const useContentStore = defineStore({
    id: 'content',
    state: () => ({
        keywords: '',
    }),
    actions: {
        setKeywords(keyword: string) {
            this.keywords = keyword
        }
    },
    getters: {
        getKeywords(): string {
            return this.keywords
        }
    }
});