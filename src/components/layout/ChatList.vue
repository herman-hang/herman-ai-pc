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
        <div class="custom-scrollbar select-none">
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
import { ref, reactive } from "vue"
import { Search } from '@element-plus/icons-vue'

const keywords = ref("")

let messages = reactive([
    { id: 1, name: '小航', isEdit: false },
    { id: 2, name: 'Hi!哈哈', isEdit: false },
    { id: 3, name: '小河', isEdit: false },
    { id: 4, name: '得人', isEdit: false },
    { id: 5, name: '哈哈', isEdit: false },
    { id: 6, name: '经济', isEdit: false },
    { id: 7, name: '问问', isEdit: false },
    { id: 8, name: '的按所多', isEdit: false },
    { id: 9, name: 'Hello!', isEdit: false },
    { id: 10, name: 'Hi!', isEdit: false },
    { id: 11, name: '的哥哥哥', isEdit: false },
    { id: 12, name: '得我', isEdit: false },
    { id: 13, name: 'Hello!', isEdit: false },
    { id: 14, name: 'Hi!', isEdit: false },
    { id: 15, name: '分分?', isEdit: false },
    { id: 16, name: '分为二维', isEdit: false },
    { id: 17, name: 'Hello!', isEdit: false },
    { id: 18, name: 'Hi!', isEdit: false },
    { id: 19, name: 'How are you?', isEdit: false },
    { id: 20, name: '分分!', isEdit: false },
    { id: 22, name: 'Hello!', isEdit: false },
    { id: 23, name: 'Hi!', isEdit: false },
    { id: 24, name: '分分为', isEdit: false },
    { id: 25, name: '分我分', isEdit: false },
])


</script>

<style lang="scss" scoped>
.custom-scrollbar {
    overflow-y: hidden;
    /* 显示垂直滚动条 */
    scrollbar-width: thin;
    /* 设置滚动条的宽度 */
    scrollbar-color: #C4C0BF lightgray;
    /* 设置滚动条的颜色 */
    height: 100vh;
    /* 设置容器铺满整个浏览器窗口 */
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