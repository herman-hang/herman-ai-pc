<template>
    <div class="flex flex-col bg-white h-14" style="-webkit-app-region: drag">
        <div class="h-6 flex justify-end">
            <!-- 最小化 -->
            <div class="flex justify-center items-center h-6 w-6 hover:bg-gray-200 focus:outline-none cursor-pointer"
                @click="minWindow" style="-webkit-app-region: no-drag">
                <el-icon size="16">
                    <svg v-if="isElectron" t="1690037091521" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="9228" width="200" height="200">
                        <path
                            d="M923 571H130.7c-27.6 0-50-22.4-50-50s22.4-50 50-50H923c27.6 0 50 22.4 50 50s-22.4 50-50 50z"
                            fill="#2c2c2c" p-id="9229"></path>
                    </svg>
                </el-icon>
            </div>
            <!-- 最大化 -->
            <div style="-webkit-app-region: no-drag" v-if="isMax"
                class="flex justify-center items-center h-6 w-6 hover:bg-gray-200 focus:outline-none cursor-pointer"
                @click="maxWindow">
                <el-icon size="16">
                    <svg v-if="isElectron" t="1690037039150" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="8138" width="200" height="200">
                        <path
                            d="M812.2 65H351.6c-78.3 0-142.5 61.1-147.7 138.1-77 5.1-138.1 69.4-138.1 147.7v460.6c0 81.6 66.4 148 148 148h460.6c78.3 0 142.5-61.1 147.7-138.1 77-5.1 138.1-69.4 138.1-147.7V213c0-81.6-66.4-148-148-148z m-45.8 746.3c0 50.7-41.3 92-92 92H213.8c-50.7 0-92-41.3-92-92V350.7c0-50.7 41.3-92 92-92h460.6c50.7 0 92 41.3 92 92v460.6z m137.8-137.7c0 47.3-35.8 86.3-81.8 91.4V350.7c0-81.6-66.4-148-148-148H260.2c5.1-45.9 44.2-81.8 91.4-81.8h460.6c50.7 0 92 41.3 92 92v460.7z"
                            fill="#2c2c2c" p-id="8139"></path>
                    </svg>
                </el-icon>
            </div>

            <div v-else style="-webkit-app-region: no-drag"
                class="flex justify-center items-center h-6 w-6 hover:bg-gray-200 focus:outline-none cursor-pointer"
                @click="maxWindow">
                <el-icon size="16">
                    <svg v-if="isElectron" t="1690766518491" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="1781" width="200" height="200">
                        <path
                            d="M800 928H224c-70.692 0-128-57.308-128-128V224c0-70.692 57.308-128 128-128h576c70.692 0 128 57.308 128 128v576c0 70.692-57.308 128-128 128z m64-704c0-35.346-28.654-64-64-64H224c-35.346 0-64 28.654-64 64v576c0 35.346 28.654 64 64 64h576c35.346 0 64-28.654 64-64V224z"
                            p-id="1782"></path>
                    </svg>
                </el-icon>
            </div>
            <!-- 关闭 -->
            <div style="-webkit-app-region: no-drag"
                class="flex justify-center items-center h-6 w-6 hover:bg-red-400 focus:outline-none cursor-pointer"
                @click="closeWindow">
                <el-icon size="16">
                    <svg v-if="isElectron" t="1690037120604" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="10236" width="200" height="200">
                        <path
                            d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z"
                            fill="#2c2c2c" p-id="10237"></path>
                    </svg>
                </el-icon>
            </div>

        </div>
        <div class="ml-6 text-lg font-medium focus:outline-none cursor-pointer select-none">
            <span v-if="name === ''">当前聊天名称</span>
            <span v-else>{{ name }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"
import { useChatStore } from '@/stores/chat';
// 是否窗口最大化
const isMax = ref<boolean>(false)
// 聊天名称
const name = ref('')
// electron主进程ipcRenderer对象
let ipcRenderer: any = null
// 是否electron环境
const isElectron = navigator.userAgent.toLowerCase().indexOf('electron/') > -1;

// 在 Electron 环境中加载
if (isElectron) {
    const electron = require('electron')
    ipcRenderer = electron.ipcRenderer
}

// 组件完成渲染时调用
onMounted(() => {
    if (isElectron) {
        isMaximized()
    }
})

// 最小化
const minWindow = () => {
    if (isElectron) {
        ipcRenderer.send('window-min')
    }
}

// 最大化
const maxWindow = () => {
    if (isElectron) {
        ipcRenderer.send('window-max')
        isMax.value = !isMax.value
    }
}

// 关闭窗口
const closeWindow = () => {
    if (isElectron) {
        ipcRenderer.send('window-close')
    }
}

// 监听窗口最大化状态
const isMaximized = () => {
    if (isElectron) {
        ipcRenderer.on('window-maximized', () => {
            isMax.value = true
        });

        ipcRenderer.on('window-unmaximized', () => {
            isMax.value = false
        });

        ipcRenderer.send('get-window-maximized');
    }
}

// 监听聊天室名称
watch(() => useChatStore().getSelectedChatroomName, (newValue, oldValue) => {
    name.value = newValue
})
</script>

<style lang="scss" scoped></style>