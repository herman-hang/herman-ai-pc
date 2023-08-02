<template>
    <div class="flex flex-col" :style="{ height: chatContentHeight + 'px' }">
        <!-- 内容区 -->
        <el-scrollbar class="px-4" ref="scrollbarRef">
            <div ref="innerRef">
                <div v-for="message in messages" :key="message.id" class="mb-4" ref="child">
                    <div class="flex justify-center text-xs text-gray-400">
                        20:24:30
                    </div>
                    <!-- 发送内容 -->
                    <div v-if="message.isSent" class="flex justify-end items-center">
                        <div
                            class="bg-gradient-to-r from-blue-400 to-indigo-400 text-white text-left py-1 px-2 rounded-lg break-words text-sm">
                            {{ message.text }}</div>
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
        </el-scrollbar>

        <!-- 发送内容输入框 -->
        <div class="flex m-2 justify-center items-center">
            <el-input resize="none" :autosize="{ minRows: 2, maxRows: 6 }" v-model="sendContent" type="textarea"
                placeholder="请教一个问题~" @keydown.enter.shift="sendWithNewLine" @keydown.enter.native.prevent="sendMessage" />
            <div class="px-1">
                <el-button color="#626aef" :icon="Promotion" circle @click="sendMessage" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, reactive, nextTick, watch } from "vue"
import { Promotion } from '@element-plus/icons-vue'
import { ElScrollbar as ElScrollbarType, ElMessage } from 'element-plus';
import { useChatStore } from '@/stores/chat';
import { SendMessage } from '@/api/home'
// 内容区引用
const innerRef = ref<HTMLDivElement>()
// 滚动条引用
const scrollbarRef = ref<InstanceType<typeof ElScrollbarType>>()
// 发送内容
const sendContent = ref<string>('')
// 自适应内容区高度
const chatContentHeight = ref<number>(0)

// 内容列表
const messages = reactive([
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
]);

// 组件渲染完成时调用
onMounted(() => {
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize);
    nextTick(() => {
        scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
    });
});

// 组件实例被卸载之后调用
onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize);
});

// 换行操作
const sendWithNewLine = () => {
    sendContent.value += '\n'
}

// 发送消息
const sendMessage = async () => {
    if (sendContent.value.trim() !== '') {
        const chatroom = useChatStore().getSelectedChatroom
        if (Object.keys(chatroom).length !== 0) {

            const chatroom: any = useChatStore().getSelectedChatroom
            const { data: res } = await SendMessage({ chatroomId: chatroom.id, content: sendContent.value })
            if (res.code === 200) {
                messages.push({ id: messages.length + 1, text: sendContent.value, isSent: true });
                sendContent.value = '';
                nextTick(() => {
                    scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
                });
            } else {
                ElMessage.error(res.message)
            }
        } else {
            ElMessage.error("请选中列表聊天再发送消息")
        }
    }
}

// 计算聊天区高度
const updateWindowSize = () => {
    chatContentHeight.value = window.innerHeight - 56;
};

// 监听选中的聊天室
watch(() => useChatStore().getSelectedChatroom, (newValue, oldValue) => {
    console.log(newValue, oldValue)
})
</script>

<style lang="scss" scoped></style>