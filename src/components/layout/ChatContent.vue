<template>
    <div class="flex flex-col h-full">
        <!-- 内容区 -->
        <div class="p-4 custom-scrollbar">
            <div v-for="message in messages" :key="message.id" class="mb-4">
                <div class="flex justify-center text-xs text-gray-400">
                    20:24:30
                </div>
                <!-- 发送内容 -->
                <div v-if="message.isSent" class="flex justify-end items-center">
                    <div class="bg-blue-500 text-white text-left py-1 px-2 rounded-lg break-words text-sm">{{
                        message.text }}</div>
                    <div class="w-10 h-10 ml-1 justify-center items-center">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    </div>
                </div>
                <!-- 接收内容 -->
                <div v-else class="flex justify-start items-center">
                    <div class="w-10 h-10 mr-1 justify-center items-center">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    </div>
                    <div class="bg-gray-200 py-1 px-2 rounded-lg break-words text-sm">{{ message.text }}</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
const messages = [
    { id: 1, text: 'Hello!', isSent: true },
    { id: 2, text: 'Hi!', isSent: false },
    { id: 3, text: 'How are you?', isSent: true },
    { id: 4, text: 'I\'m good, thanks!', isSent: false },
    { id: 5, text: 'Hello!', isSent: true },
    { id: 6, text: '4456!', isSent: false },
    { id: 7, text: '123', isSent: true },
    { id: 8, text: 'I\'m good, thanks!', isSent: false },
    { id: 9, text: 'Hello!', isSent: true },
    { id: 10, text: 'Hi!', isSent: false },
    { id: 11, text: 'How are you?', isSent: true },
    { id: 12, text: 'I\'m good, thanks!', isSent: false },
    { id: 13, text: 'Hello!', isSent: true },
    { id: 14, text: 'Hi!', isSent: false },
    { id: 15, text: 'How are you?', isSent: true },
    { id: 16, text: 'I\'m good, thanks!', isSent: false },
    { id: 17, text: 'Hello!', isSent: true },
    { id: 18, text: 'Hi!', isSent: false },
    { id: 19, text: 'How are you?', isSent: true },
    { id: 20, text: 'I\'m good, thanks!', isSent: false },
    { id: 22, text: 'Hello!', isSent: true },
    { id: 23, text: 'Hi!', isSent: false },
    { id: 24, text: 'How are you?', isSent: true },
    { id: 25, text: 'I\'m good, thanks!', isSent: false },
]
</script>

<style lang="scss" scoped>
.custom-scrollbar {
    overflow-y: hidden;
    /* 显示垂直滚动条 */
    scrollbar-width: thin;
    /* 设置滚动条的宽度 */
    scrollbar-color: #C4C0BF lightgray;
    /* 设置滚动条的颜色 */
}

.custom-scrollbar:hover {
    overflow-y: scroll;
    /* 鼠标悬停时强制显示滚动条 */
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    /* 设置滚动条的宽度 */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #C4C0BF;
    /* 设置滚动条的颜色 */
    border-radius: 4px;
    /* 添加圆角 */
}
</style>