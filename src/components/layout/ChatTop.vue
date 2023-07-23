<template>
    <div class="flex-1 bg-white h-14">
        <div class="h-6 flex justify-end">
            <!-- 最小化 -->
            <el-icon size="16" class="mx-2 pt-1 hover:bg-gray-200 focus:outline-none cursor-pointer" @click="minWindow">
                <svg t="1690037091521" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    p-id="9228" width="200" height="200">
                    <path d="M923 571H130.7c-27.6 0-50-22.4-50-50s22.4-50 50-50H923c27.6 0 50 22.4 50 50s-22.4 50-50 50z"
                        fill="#2c2c2c" p-id="9229"></path>
                </svg>
            </el-icon>
            <!-- 最大化 -->
            <el-icon v-if="isMax" size="16" class="mx-2 pt-1 hover:bg-gray-200 focus:outline-none cursor-pointer"
                @click="maxWindow">
                <svg t="1690037039150" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    p-id="8138" width="200" height="200">
                    <path
                        d="M812.2 65H351.6c-78.3 0-142.5 61.1-147.7 138.1-77 5.1-138.1 69.4-138.1 147.7v460.6c0 81.6 66.4 148 148 148h460.6c78.3 0 142.5-61.1 147.7-138.1 77-5.1 138.1-69.4 138.1-147.7V213c0-81.6-66.4-148-148-148z m-45.8 746.3c0 50.7-41.3 92-92 92H213.8c-50.7 0-92-41.3-92-92V350.7c0-50.7 41.3-92 92-92h460.6c50.7 0 92 41.3 92 92v460.6z m137.8-137.7c0 47.3-35.8 86.3-81.8 91.4V350.7c0-81.6-66.4-148-148-148H260.2c5.1-45.9 44.2-81.8 91.4-81.8h460.6c50.7 0 92 41.3 92 92v460.7z"
                        fill="#2c2c2c" p-id="8139"></path>
                </svg>
            </el-icon>
            <el-icon v-else size="16" class="mx-2 pt-1 hover:bg-gray-200 focus:outline-none cursor-pointer"
                @click="maxWindow">
                <svg t="1690036894705" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    p-id="7745" width="200" height="200">
                    <path
                        d="M770.9 923.3H253.1c-83.8 0-151.9-68.2-151.9-151.9V253.6c0-83.8 68.2-151.9 151.9-151.9h517.8c83.8 0 151.9 68.2 151.9 151.9v517.8c0 83.8-68.1 151.9-151.9 151.9zM253.1 181.7c-39.7 0-71.9 32.3-71.9 71.9v517.8c0 39.7 32.3 71.9 71.9 71.9h517.8c39.7 0 71.9-32.3 71.9-71.9V253.6c0-39.7-32.3-71.9-71.9-71.9H253.1z"
                        p-id="7746" fill="#2c2c2c"></path>
                </svg>
            </el-icon>
            <!-- 关闭 -->
            <el-icon size="16" class="mx-2 pt-1 hover:bg-red-400 focus:outline-none cursor-pointer" @click="closeWindow">
                <svg t="1690037120604" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    p-id="10236" width="200" height="200">
                    <path
                        d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z"
                        fill="#2c2c2c" p-id="10237"></path>
                </svg>
            </el-icon>
        </div>
        <div class="ml-6 text-lg font-medium focus:outline-none cursor-pointer select-none">
            <span>当前聊天名称</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
const { ipcRenderer } = require('electron')
let isMax = ref<boolean>(false)

// 最小化
const minWindow = () => {
    ipcRenderer.send('window-min')
}

// 最大化
const maxWindow = () => {
    ipcRenderer.send('window-max')
    isMax.value = !isMax.value
}

// 关闭窗口
const closeWindow = () => {
    ipcRenderer.send('window-close')
}

</script>

<style lang="scss" scoped></style>