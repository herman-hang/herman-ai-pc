import { defineStore } from 'pinia'

// 标记菜单栏AI产品切换
export const useAiStore = defineStore({
    id: 'ai',
    state: () => ({
        aiType: 1,
    }),
    actions: {
        setAiType(aiType: number) {
            this.aiType = aiType
        }
    },
    getters: {
        getAiType(): number {
            return this.aiType
        }
    }
});