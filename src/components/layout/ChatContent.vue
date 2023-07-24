<template>
    <div class="flex flex-col" :style="{ height: chatContentHeight + 'px' }">
        <!-- 内容区 -->
        <div class="px-4 py-2 custom-scrollbar">
            <div v-for="message in messages" :key="message.id" class="mb-4">
                <div class="flex justify-center text-xs text-gray-400">
                    20:24:30
                </div>
                <!-- 发送内容 -->
                <div v-if="message.isSent" class="flex justify-end items-center">
                    <div
                        class="bg-gradient-to-r from-blue-400 to-indigo-400 text-white text-left py-1 px-2 rounded-lg break-words text-sm">
                        {{
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

        <!-- 输入框 -->
        <div class="flex m-2 justify-center items-center">
            <el-input resize="none" :autosize="{ minRows: 2,maxRows: 6 }" v-model="sendContent" type="textarea" placeholder="请教一个问题~"/>
            <div class="px-1">
                <el-button color="#626aef" :icon="Promotion" circle @click="sendMessage" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue"

import { Promotion } from '@element-plus/icons-vue'
const sendContent = ref<string>()
const chatContentHeight = ref<number>(0)
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
// 发送消息
const sendMessage = () => {
    console.log(sendContent.value)
}

// 计算聊天区高度
const updateWindowSize = () => {
    chatContentHeight.value = window.innerHeight - 56;
};

onMounted(() => {
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize);
});
</script>

<style lang="scss" scoped>
.custom-scrollbar {
    /* 显示垂直滚动条 */
    overflow-y: hidden;
    /* 设置滚动条的宽度 */
    scrollbar-width: thin;
    /* 设置滚动条的颜色 */
    scrollbar-color: #C4C0BF lightgray;
    /* 设置容器铺满整个浏览器窗口 */
    // height: 82vh;
}

.custom-scrollbar:hover {
    overflow-y: scroll;
    /* 鼠标悬停时强制显示滚动条 */
}

.custom-scrollbar::-webkit-scrollbar {
    /* 设置滚动条的宽度 */
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    /* 设置滚动条的颜色 */
    background-color: #C4C0BF;
    /* 添加圆角 */
    border-radius: 4px;
}
</style>