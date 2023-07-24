<template>
    <div class="flex-1">
        <!-- 搜索框 -->
        <div class="flex justify-center items-center h-14 bg-white">
            <div class="flex justify-center items-center">
                <el-input clearable v-model="keywords" size="small" :prefix-icon="Search" placeholder="搜索" />
                <div class="text-gray-400 hover:text-gray-500">
                    <el-icon class="m-2" size="18">
                        <i-ep-CirclePlus />
                    </el-icon>
                </div>
            </div>
        </div>

        <!-- 聊天列表 -->
        <div class="custom-scrollbar select-none" :style="{ height: chatListHeight + 'px'}">
            <div v-for="message in messages" :key="message.id">
                <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                    <div class="w-10 h-10">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    </div>
                    <div class="w-full m-1 select-none">
                        <div class="flex justify-between items-center">
                            <div class="text-base font-medium">
                                <span>{{ message.name }}</span>
                            </div>
                            <div class="text-sm text-gray-400 font-medium">15:51</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from "vue"
import { Search } from '@element-plus/icons-vue'

const keywords = ref<string>("")
let chatListHeight = ref<number>(0);

let messages = reactive([
    { id: 1, name: "消息1", menuVisible: false },
    { id: 2, name: "消息2", menuVisible: false },
    { id: 3, name: "消息3", menuVisible: false },
    { id: 4, name: "消息4", menuVisible: false },
    { id: 5, name: "消息5", menuVisible: false },
    { id: 6, name: "消息6", menuVisible: false },
    { id: 7, name: "消息7", menuVisible: false },
    { id: 8, name: "消息8", menuVisible: false },
    { id: 9, name: "消息9", menuVisible: false },
    { id: 10, name: "消息10", menuVisible: false },
    { id: 11, name: "消息11", menuVisible: false },
    { id: 12, name: "消息1", menuVisible: false },
    { id: 13, name: "消息2", menuVisible: false },
    { id: 14, name: "消息3", menuVisible: false },
    { id: 15, name: "消息4", menuVisible: false },
    { id: 16, name: "消息5", menuVisible: false },
    { id: 17, name: "消息6", menuVisible: false },
    { id: 18, name: "消息7", menuVisible: false },
    { id: 19, name: "消息8", menuVisible: false },
    { id: 20, name: "消息9", menuVisible: false },
    { id: 21, name: "消息10", menuVisible: false },
    { id: 22, name: "消息11", menuVisible: false },
])

// 计算聊天列表高度
const updateWindowSize = () => {
    chatListHeight.value = window.innerHeight - 56;
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
}

.custom-scrollbar:hover {
    /* 鼠标悬停时强制显示滚动条 */
    overflow-y: scroll;
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