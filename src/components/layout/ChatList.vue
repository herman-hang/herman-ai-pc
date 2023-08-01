<template>
    <div class="flex-1">
        <!-- 搜索框 -->
        <div class="flex justify-center items-center h-14 bg-white">
            <div class="flex justify-center items-center">
                <el-input clearable v-model="queryInfo.data.keywords" size="small" :prefix-icon="Search" placeholder="搜索" />
                <div class="text-gray-400 hover:text-gray-500" @click="addAction">
                    <el-icon class="m-2" size="18">
                        <i-ep-CirclePlus />
                    </el-icon>
                </div>
            </div>
        </div>

        <!-- 聊天列表 -->
        <el-scrollbar class="select-none" :style="{ height: chatListHeight + 'px' }">
            <div v-if="messages.data.length > 0" v-for="message in messages.data" :key="message.id"
                @contextmenu="showContextMenu($event, message)">
                <div class="flex items-center py-1 px-2 hover:bg-gray-200 focus:outline-none"
                    @click="showSelectItem(message.id)" :class="selectId === message.id ? 'bg-gray-200' : ''">
                    <div class="w-10 h-10">
                        <el-avatar
                            :src="message.photoId === null ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' : message.photo" />
                    </div>
                    <div class="w-full m-1 select-none">
                        <div class="flex justify-between items-center">
                            <div class="text-base font-medium line-clamp">
                                <span>{{ message.name }}</span>
                            </div>
                            <div class="text-sm text-gray-400 font-medium">{{ message.createdAt }}
                            </div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500 font-medium line-clamp">{{ message.newest }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex justify-center">
                <span class="text-gray-400 font-medium text-sm">无数据~</span>
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
    </div>


    <!-- 重命名对话框 -->
    <el-dialog v-model="isRename" title="重命名" width="45%">
        <el-form @keyup.enter="renameConfirm">
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
        <el-form :model="addFrom" ref="addFormRef" :rules="addFormRules" @keyup.enter="addConfirm(addFormRef)">
            <el-form-item prop="addChatroomName">
                <el-input v-model="addFrom.addChatroomName" placeholder="请输入名称" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button color="#626aef" plain @click="isAdd = false">取消</el-button>
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
import { useAiStore } from '@/stores/ai'
import { useAuthStore } from '@/stores/auth';
import { AddChatroom, ChatroomList, Preview, DeleteChatroom } from '@/api/home'
import { formatDate } from '@/uitls/formatDate'
import type { FormInstance } from 'element-plus'

// AI类型状态监听
const aiStore = useAiStore()
// 登录状态对话框监听对象
const authStore = useAuthStore();
// 列表对象
const queryInfo = reactive({
    data: {
        //搜索关键字
        keywords: '',
        //当前页码
        page: 1,
        // 总条数
        total: 0,
        // 总页数
        pageNum: 0,
        //每页显示多少条数据
        pageSize: 25,
        // Ai类型
        aiType: aiStore.aiType
    }
})
// 定义messages的类型
type Message = {
    id: number;
    photoId: number | null;
    photo: string,
    name: string;
    createdAt: string;
    newest: string;
};
// 列表数据
const messages = reactive<{ data: Message[] }>({ data: [] })
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
const addFrom = reactive({ addChatroomName: '' })
// 删除对话框状态
const isDelete = ref(false);
// 列表选中状态的ID
const selectId = ref(0)
// 新增表单引用
const addFormRef = ref<FormInstance>()
// 登录表单验证规则
const addFormRules = ref({
    addChatroomName: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ]
});

// 组件完成渲染后调用
onMounted(() => {
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize);
    document.addEventListener('click', handleClick);
    List()
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
watch(() => aiStore.aiType, (newValue, oldValue) => {
    queryInfo.data.aiType = newValue
    List()
})

// 监听登录状态
watch(() => authStore.loginDialog, (newValue, oldValue) => {
    if (oldValue) {
        List()
    }
})

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
    DeleteChatroom({ id: selectedMessage.id }).then(res => {
        if (res.data.code === 200) {
            List()
            isDelete.value = false
            ElMessage.success(res.data.message)
        } else {
            ElMessage.error(res.data.message)
        }
    })
}

// 新增聊天室
const addAction = () => {
    addFrom.addChatroomName = ''
    isAdd.value = true
}

// 获取列表数据
const List = () => {
    const token = localStorage.getItem('Authorization')
    // 登录状态监听对象
    if (!token) {
        return;
    }

    ChatroomList(queryInfo.data).then(res => {
        if (res.data.code === 200) {
            queryInfo.data = {
                //搜索关键字
                keywords: '',
                //当前页码
                page: res.data.data.page,
                // 总条数
                total: res.data.data.total,
                // 总页数
                pageNum: res.data.data.pageNum,
                //每页显示多少条数据
                pageSize: res.data.data.pageNum,
                // AI类型
                aiType: aiStore.aiType
            }
            if (Array.isArray(res.data.data.list) && res.data.data.list.length > 0) {
                res.data.data.list.forEach((item: Message) => {
                    if (item.photoId !== null) {
                        Preview(item.photoId).then(resp => {
                            const blob = new Blob([resp.data], { type: resp.headers['content-type'] });
                            const imageUrl = URL.createObjectURL(blob);
                            // 在这里给每个item添加一个键值对
                            item.photo = imageUrl;
                        })
                    }
                    item.createdAt = formatDate(item.createdAt)
                });
                messages.data = res.data.data.list;
            } else {
                messages.data = []
            }
        }
    })
}

// 新增聊天室确定操作
const addConfirm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            AddChatroom({ aiType: aiStore.aiType, name: addFrom.addChatroomName }).then(res => {
                if (res.data.code === 200) {
                    // 刷新列表
                    List()
                    isAdd.value = false
                } else {
                    ElMessage.error(res.data.message)
                }
            })
        } else {
            return false
        }
    })
}

// 列表鼠标点击选中操作
const showSelectItem = (id: number) => {
    selectId.value = id
}


</script>

<style lang="scss" scoped>
.line-clamp {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 显示两行 */
  -webkit-box-orient: vertical;
}
</style>