<template>
    <div class="flex-1">
        <!-- 搜索框 -->
        <div class="flex justify-center items-center h-14 bg-white">
            <div class="flex justify-center items-center">
                <el-input v-model="queryInfo.keywords" size="small" :prefix-icon="Search" placeholder="搜索"
                    @change="list" @input="handleInput"/>
                <div class="text-gray-400 hover:text-gray-500" @click="addAction">
                    <el-icon class="m-2" size="18">
                        <i-ep-CirclePlus />
                    </el-icon>
                </div>
            </div>
        </div>

        <!-- 聊天列表 -->
        <el-scrollbar ref="scrollContainer" class="scroll-container select-none" :style="{ height: chatListHeight + 'px' }"
            @scroll="handleScroll">
            <div v-if="messageList.data.length > 0" v-for="message in messageList.data" :key="message.id"
                @contextmenu="showContextMenu($event, message)">
                <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none"
                    @click="showSelectItem(message)"
                    :class="useChatStore().getSelectedChatroomId === message.id ? 'bg-gray-200' : ''">
                    <div class="w-10 h-10">
                        <el-avatar
                            :src="message.photoId === 0 ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' : message.photo" />
                    </div>
                    <div class="w-full m-1 select-none">
                        <div class="flex justify-between items-center">
                            <div class="text-sm font-medium text-overflow-name">
                                <span>{{ message.name }}</span>
                            </div>
                            <div class="text-xs text-gray-400 font-medium whitespace-nowrap">{{ message.createdAt }}
                            </div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-500 font-medium text-overflow-newest">{{ message.newest || '　' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex justify-center mt-2">
                <span class="text-gray-400 font-medium text-sm">无数据~</span>
            </div>

        </el-scrollbar>

    </div>


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
        <el-form :model="selectedMessage" ref="renameFormRef" :rules="renameFormRules">
            <el-form-item prop="name">
                <el-input v-model="selectedMessage.name" placeholder="请输入名称"
                    @keydown.enter.native.prevent="renameConfirm(renameFormRef)" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button color="#626aef" plain @click="renameCancel">取消</el-button>
                <el-button @click="renameConfirm(renameFormRef)" color="#626aef">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 新增聊天室 -->
    <el-dialog v-model="isAdd" title="添加" width="45%">
        <el-form :model="addFrom" ref="addFormRef" :rules="addFormRules">
            <el-form-item prop="addChatroomName">
                <el-input v-model="addFrom.addChatroomName" placeholder="请输入名称"
                    @keydown.enter.native.prevent="addConfirm(addFormRef)" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button color="#626aef" plain @click="addCancel">取消</el-button>
                <el-button @click="addConfirm(addFormRef)" color="#626aef">
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
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, onBeforeUnmount, watch } from "vue"
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useAiStore } from '@/stores/ai'
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/stores/chat';
import { AddChatroom, ChatroomList, Preview, DeleteChatroom, ModifyChatroom } from '@/api/home'
import { formatDate } from '@/uitls/formatDate'
import { debounce } from 'lodash'

// 列表对象
const queryInfo = reactive({
    // 搜索关键字
    keywords: '',
    // 当前页码
    page: 1,
    // 总条数
    total: 0,
    // 总页数
    pageNum: 0,
    // 每页显示多少条数据
    pageSize: 25,
    // Ai类型
    aiType: useAiStore().getAiType
})
// 定义messages的类型 
type Message = {
    id: number;
    photoId: number;
    photo: string,
    name: string;
    createdAt: string;
    newest: string;
};
// 列表数据
const messageList = reactive<{ data: Message[] }>({ data: [] })
// 聊天列表自适应高度
const chatListHeight = ref<number>(0);
// 右键菜单的显示与隐藏状态
const isContextMenuVisible = ref(false);
// 右键菜单的位置
const contextMenuPosition = ref({ left: 0, top: 0 });
// 用于存储 message 的值
const selectedMessage = reactive<Message>({
    id: 0,
    photoId: 0,
    photo: '',
    name: '',
    createdAt: '',
    newest: ''
})
// 重命名对话框状态
const isRename = ref(false);
// 新增对话框状态
const isAdd = ref(false);
// 新增聊天室名称
const addFrom = reactive({ addChatroomName: '' })
// 删除对话框状态
const isDelete = ref(false);
// 新增表单引用
const addFormRef = ref<FormInstance>()
// 重命名表单引用
const renameFormRef = ref<FormInstance>()
// 新增表单验证规则
const addFormRules = ref({
    addChatroomName: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ]
});
// 重命名表单验证规则
const renameFormRules = ref({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ]
});
// 列表滚动条引用
const scrollContainer = ref<any>(null);
// 组件完成渲染后调用
onMounted(() => {
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize);
    document.addEventListener('click', handleClick);
    list()
});

// 组件实例被卸载之前调用
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick);
});

// 组件实例被卸载之后调用
onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize);
});

// 监听AI类型切换状态
watch(() => useAiStore().getAiType, (newValue, oldValue) => {
    queryInfo.aiType = newValue
    initQueryInfo()
    list()
})

// 监听登录状态
watch(() => useAuthStore().getLoginDialogState, (newValue, oldValue) => {
    if (oldValue) {
        list()
    }
})

// 监听发送消息刷新列表
watch(() => useChatStore().getNewMessageId, (newValue, oldValue) => {
    handleInput()
})

// 初始化查询数据
const initQueryInfo = () => {
    queryInfo.keywords = ''
    queryInfo.page = 1
    queryInfo.pageNum = 0
    queryInfo.pageSize = 25
    queryInfo.total = 0
}

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
const showContextMenu = (event: MouseEvent, message: Message) => {
    event.preventDefault();
    // 获取鼠标点击的位置
    const { clientX, clientY } = event;
    // 设置右键菜单的位置
    contextMenuPosition.value = { left: clientX, top: clientY };
    // 存储message
    selectedMessage.createdAt = message.createdAt
    selectedMessage.id = message.id
    selectedMessage.name = message.name
    selectedMessage.newest = message.newest
    selectedMessage.photo = message.photo
    selectedMessage.photoId = message.photoId
    // 显示右键菜单
    isContextMenuVisible.value = true;
};

// 隐藏右键菜单
const hideContextMenu = () => {
    isContextMenuVisible.value = false;
};

// 重命名对话框弹出操作
const renameAction = () => {
    // 隐藏右键菜单
    hideContextMenu();
    // 显示重命名对话框
    isRename.value = true
};

// 重命名对话框确定操作
const renameConfirm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            const { data: res } = await ModifyChatroom(selectedMessage)
            if (res.code === 200) {
                list()
                isRename.value = false
                ElMessage.success(res.message)
            } else {
                ElMessage.error(res.message)
            }
        } else {
            return false
        }
    })

}

// 重命名对话框取消操作
const renameCancel = () => {
    list()
    isRename.value = false
}

// 删除对话弹出框操作
const deleteAction = () => {
    // 删除对话框标识
    isDelete.value = true
    // 隐藏右键菜单
    hideContextMenu();
};

// 删除对话框确定操作
const deleteConfirm = async () => {
    const { data: res } = await DeleteChatroom({ id: selectedMessage.id })
    if (res.code === 200) {
        list()
        isDelete.value = false
        ElMessage.success(res.message)
    } else {
        ElMessage.error(res.message)
    }
}

// 新增聊天室
const addAction = () => {
    addFrom.addChatroomName = ''
    isAdd.value = true
}

// 获取列表数据
const list = async () => {
    const token = localStorage.getItem('Authorization')
    if (token === '' || token === null || token === undefined) {
        useAuthStore().setLoginDialog(true)
        return
    }

    const { data: res } = await ChatroomList(queryInfo)
    if (res.code === 200) {
        queryInfo.page = res.data.page;
        queryInfo.total = res.data.total;
        queryInfo.pageNum = res.data.pageNum;
        queryInfo.pageSize = res.data.pageSize;
        queryInfo.aiType = useAiStore().getAiType;

        if (Array.isArray(res.data.list) && res.data.list.length > 0) {
            res.data.list.forEach((item: Message) => {
                if (item.photoId !== 0) {
                    Preview(item.photoId).then(resp => {
                        const blob = new Blob([resp.data], { type: resp.headers['content-type'] });
                        const imageUrl = URL.createObjectURL(blob);
                        // 在这里给每个item添加一个键值对
                        item.photo = imageUrl;
                    })
                }
                item.createdAt = formatDate(item.createdAt, 1)
            });
            messageList.data = res.data.list;
        } else {
            messageList.data = []
        }
    }

}

// 新增聊天室对话框确定操作
const addConfirm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            const { data: res } = await AddChatroom({ aiType: useAiStore().getAiType, name: addFrom.addChatroomName })
            if (res.code === 200) {
                list()
                isAdd.value = false
                useChatStore().setSelectChatroomId(res.data.id)
                useChatStore().setSelectChatroomName(res.data.name)
                ElMessage.success(res.message)
            } else {
                ElMessage.error(res.message)
            }
        } else {
            return false
        }
    })
}

// 新增聊天室对话框取消操作
const addCancel = () => {
    list()
    isAdd.value = false
}

// 列表鼠标点击选中聊天室操作
const showSelectItem = (chatroom: Message) => {
    useChatStore().setSelectChatroomId(chatroom.id)
    useChatStore().setSelectChatroomName(chatroom.name)
    useChatStore().setScroll(false)
}

// 监听搜索框防抖
const handleInput = debounce(() => {
    list()
}, 300);

// 监听滚动条是否滚到底部
const handleScroll = debounce(() => {
    loadListData()
}, 300);

// 监听滚动条是否滚到底部
const loadListData = async () => {
    const element = scrollContainer.value.$el.getElementsByClassName('el-scrollbar__wrap')[0];
    const containerHeight = scrollContainer.value.$el.clientHeight;
    const scrollHeight = element.scrollHeight;
    const scrollTop = element.scrollTop;
    // 计算滚动条距离底部的距离
    const distanceToBottom = scrollHeight - scrollTop - containerHeight;

    // 距离底部200px时开始请求
    if (distanceToBottom <= 200) {
        queryInfo.page = queryInfo.page + 1
        const { data: res } = await ChatroomList(queryInfo)
        if (res.code === 200) {
            if (Array.isArray(res.data.list) && res.data.list.length > 0) {
                res.data.list.forEach((item: Message) => {
                    if (item.photoId !== 0) {
                        Preview(item.photoId).then(resp => {
                            const blob = new Blob([resp.data], { type: resp.headers['content-type'] });
                            const imageUrl = URL.createObjectURL(blob);
                            // 在这里给每个item添加一个键值对
                            item.photo = imageUrl;
                        })
                    }
                    item.createdAt = formatDate(item.createdAt, 1)
                });

                messageList.data = messageList.data.concat(res.data.list)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.text-overflow-newest {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 170px;
}

.text-overflow-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 140px;
}
</style>