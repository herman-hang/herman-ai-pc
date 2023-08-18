import { defineStore } from 'pinia'

// 存储个人用户信息
interface User {
    id: number;
    phone: string;
    nickname: string;
    photoId:number;
    photo: string;
}

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        user: {} as User,
    }),
    actions: {
        setUser(user: User): void {
            this.user = user;
        },
    },
    getters: {
        getUser(): User {
            return this.user;
        },
    }
});