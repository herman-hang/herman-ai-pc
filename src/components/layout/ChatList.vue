<template>
    <div class="flex-1">
        <!-- 搜索框 -->
        <div class="flex justify-center items-center h-14 bg-white">
            <div class="flex justify-center items-center">
                <el-input clearable v-model="keywords" size="small" :prefix-icon="Search" placeholder="搜索" />
                <div class="text-gray-400 hover:text-gray-500" @click="isAdd = true">
                    <el-icon class="m-2" size="18">
                        <i-ep-CirclePlus />
                    </el-icon>
                </div>
            </div>
        </div>

        <!-- 聊天列表 -->
        <el-scrollbar class="select-none" :style="{ height: chatListHeight + 'px' }">
            <div v-for="message in messages.data" :key="message.id" @contextmenu="showContextMenu($event, message)">
                <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none"
                    @click="showSelectItem(message.id)" :class="selectId === message.id ? 'bg-gray-200' : ''">
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
        </el-scrollbar>


        <!-- 右键菜单 -->
        <transition name="fade">
            <div v-if="isContextMenuVisible" class="absolute right-click-menu"
                :style="{ left: contextMenuPosition.left + 'px', top: contextMenuPosition.top + 'px' }">
                <div class="bg-white border rounded">
                    <div class="py-1">
                        <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="renameAction()">
                            重命名
                        </div>
                        <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="deleteAction()">
                            删除
                        </div>
                    </div>
                </div>
            </div>
        </transition>


        <!-- 重命名对话框 -->
        <el-dialog v-model="isRename" title="重命名" width="45%">
            <el-form>
                <el-form-item>
                    <el-input v-model="selectedMessage.name" placeholder="请输入名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button color="#626aef" plain @click="isRename = false">取消</el-button>
                    <el-button @click="renameConfirm" color="#626aef">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 新增聊天室 -->
        <el-dialog v-model="isAdd" title="添加" width="45%">
            <el-form>
                <el-form-item>
                    <el-input v-model="addChatroomName" placeholder="请输入名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button color="#626aef" plain @click="isAdd = false">取消</el-button>
                    <el-button @click="addConfirm" color="#626aef">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 删除对话框 -->
        <el-dialog v-model="isDelete" title="删除提示" width="45%">
            <div class="flex items-center">
                <el-icon :size="16" color="#E6A23C"><i-ep-InfoFilled /></el-icon>
                <span>您确定要删除 {{ selectedMessage.name }} 吗?</span>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button color="#626aef" plain @click="isDelete = false">取消</el-button>
                    <el-button @click="deleteConfirm" color="#626aef">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, onBeforeUnmount } from "vue"
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useAiStore } from '@/stores/ai'
// 搜索关键词
const keywords = ref<string>("")
// 聊天列表自适应高度
const chatListHeight = ref<number>(0);
// 右键菜单的显示与隐藏状态
const isContextMenuVisible = ref(false);
// 右键菜单的位置
const contextMenuPosition = ref({ left: 0, top: 0 });
// 用于存储 message 的值
let selectedMessage = reactive<any>({})
// 重命名对话框状态
const isRename = ref(false);
// 新增对话框状态
const isAdd = ref(false);
// 新增聊天室名称
const addChatroomName = ref('')
// 删除对话框状态
const isDelete = ref(false);
// AI类型状态监听
const aiStore = useAiStore()
// 列表选中状态的ID
const selectId = ref(0)

// 列表数据
const messages = reactive({
    data: [
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
    ]
})
// 组件完成渲染后调用
onMounted(() => {
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize);
    document.addEventListener('click', handleClick);
});

// 组件实例被卸载之前调用
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick);
});

// 组件实例被卸载之后调用
onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize);
});

// 计算聊天列表高度
const updateWindowSize = () => {
    chatListHeight.value = window.innerHeight - 56;
};

// 监听全局的 click 事件
const handleClick = (event: any) => {
    // 判断点击的位置是否在右键菜单内
    const isClickInsideContextMenu = event.target.closest('.right-click-menu') !== null;
    if (!isClickInsideContextMenu) {
        // 点击的位置不在右键菜单内，隐藏菜单
        hideContextMenu();
    }
}

// 显示右键菜单
const showContextMenu = (event: any, message: any) => {
    event.preventDefault();
    // 获取鼠标点击的位置
    const { clientX, clientY } = event;
    // 设置右键菜单的位置
    contextMenuPosition.value = { left: clientX, top: clientY };
    // 显示右键菜单
    isContextMenuVisible.value = true;
    // 存储message
    selectedMessage = message
};

// 隐藏右键菜单
const hideContextMenu = () => {
    isContextMenuVisible.value = false;
};

// 重命名对话框弹出操作
const renameAction = () => {
    // 执行重命名操作
    isRename.value = true
    // 隐藏右键菜单
    hideContextMenu();
};

// 重命名对话框确定操作
const renameConfirm = () => {
    console.log(selectedMessage)
}

// 删除对话弹出框操作
const deleteAction = () => {
    // 执行删除操作
    isDelete.value = true
    // 隐藏右键菜单
    hideContextMenu();
};

// 删除对话框确定操作
const deleteConfirm = () => {
    console.log(selectedMessage)
}

// 新增聊天室确定操作
const addConfirm = () => {
    console.log(addChatroomName.value, aiStore.aiType)
}

// 列表鼠标点击选中操作
const showSelectItem = (id: number) => {
    selectId.value = id
} 
</script>

<style lang="scss" scoped></style>