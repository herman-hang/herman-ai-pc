import { defineStore } from 'pinia'


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