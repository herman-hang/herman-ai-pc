<template>
    <div class="flex-1">

        <!-- 搜索框 -->
        <div class="flex justify-center items-center h-14 bg-white">
            <div class="flex justify-center items-center">
                <el-input clearable v-model="keywords" size="small" :prefix-icon="Search" placeholder="搜索" />
                <div class="text-slate-400 hover:text-slate-500">
                    <el-icon class="m-2" size="18">
                        <i-ep-CirclePlus />
                    </el-icon>
                </div>
            </div>
        </div>

        <!-- 聊天列表 -->

        <div class="custom-scrollbar select-none">

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1 select-none">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小红</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小红</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小米</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小米</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小米</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小米</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小米</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小米</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小米</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小米</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>


            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小名</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小名</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>


            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小名</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>


            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小名</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>


            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小名</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>


            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小名</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none">
                <div class="w-10 h-10">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div class="w-full m-1">
                    <div class="flex justify-between items-center">
                        <div class="text-base font-medium">小名</div>
                        <div class="text-sm text-gray-400 font-medium">15:51</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 font-medium">最新一条消息</div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { Search } from '@element-plus/icons-vue'

const keywords = ref("")


</script>

<style lang="scss" scoped>
.custom-scrollbar {
    overflow-y: hidden;
    /* 显示垂直滚动条 */
    scrollbar-width: thin;
    /* 设置滚动条的宽度 */
    scrollbar-color: #C4C0BF lightgray;
    /* 设置滚动条的颜色 */
    height: 90vh;
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