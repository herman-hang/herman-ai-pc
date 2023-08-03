<template>
    <div class="flex flex-col" :style="{ height: chatContentHeight + 'px' }">
        <!-- 内容区 -->
        <el-scrollbar class="px-4 scroll-container" ref="scrollbarRef" @scroll="loadListData">
            <div ref="innerRef">
                <div v-if="messages.data.length > 0" v-for="message in messages.data" :key="message.id" class="mb-4"
                    ref="child">
                    <div class="flex justify-center text-xs text-gray-400">
                        {{ message.createdAt }}
                    </div>
                    <!-- 发送内容 -->
                    <div v-if="message.isMe" class="flex justify-end items-center">
                        <div :style="{ maxWidth: chatContentWidth + 'px' }"
                            class="bg-gradient-to-r from-blue-400 to-indigo-400 text-white text-left py-1 px-2 rounded-lg break-words text-sm">
                            {{ message.content }}</div>
                        <div class="w-10 h-10 ml-1 justify-center items-center">
                            <el-avatar
                                :src="message.photoId === 0 ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' : message.photo" />
                        </div>
                    </div>
                    <!-- 接收内容 -->
                    <div v-else class="flex justify-start items-center">
                        <div class="w-10 h-10 mr-1 justify-center items-center">
                            <el-avatar
                                :src="message.photoId === 0 ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' : message.photo" />
                        </div>
                        <div :style="{ maxWidth: chatContentWidth + 'px' }"
                            class="bg-gray-200 py-1 px-2 rounded-lg break-words text-sm">{{ message.content }}</div>
                    </div>
                </div>
                <div v-else class="flex justify-center items-center mt-2">
                    <span class="text-gray-400 font-medium text-sm">无数据~</span>
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
import { SendMessage, MessageList, Preview } from '@/api/home'
import { formatDate } from '@/uitls/formatDate'
import { debounce } from 'lodash'
// 内容区引用
const innerRef = ref<HTMLDivElement>()
// 滚动条引用
const scrollbarRef = ref<InstanceType<typeof ElScrollbarType>>()
// 发送内容
const sendContent = ref<string>('')
// 自适应内容区高度
const chatContentHeight = ref<number>(0)
// 自适应内容区宽度
const chatContentWidth = ref<number>(0)
// 定义messages的类型
type Message = {
    id: number; // 消息ID
    isMe: boolean; // 是否是我
    senderId: number, // 发送者ID
    receiverId: number; // 接收者
    photoId: number, // 头像ID
    photo: string, // 头像临时url
    content: string; // 消息内容
    createdAt: string // 发送时间
};
// 消息列表对象
const queryInfo = reactive({
    // 当前页码
    page: 1,
    // 总条数
    total: 0,
    // 总页数
    pageNum: 0,
    // 每页显示多少条数据
    pageSize: 25,
    // 聊天室ID
    chatroomId: useChatStore().getSelectedChatroomId
})
// 消息内容列表
const messages = reactive<{ data: Message[] }>({ data: [] });
// 头像数组类型定义
type Avatar = {
    id: number,
    url: string
}
// 定义响应式的头像数组对象
const avatarArray = reactive<Avatar[]>([]);


// 组件渲染完成时调用
onMounted(() => {
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize);
    setScrollTop()
    useChatStore().setScroll(true)
});

// 组件实例被卸载之后调用
onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize);
});

// 向头像数组中添加新的项
const addAvatarItem = (id: number, url: string) => {
    avatarArray.push({ id: id, url: url });
};

// 根据ID获取头像URL
const getAvatarUrl = (id: number) => {
    const avatar = avatarArray.find(item => item.id === id);
    if (avatar?.url !== '') {
        return avatar?.url
    } else {
        Preview(id).then(resp => {
            const blob = new Blob([resp.data], { type: resp.headers['content-type'] });
            const imageUrl = URL.createObjectURL(blob);
            addAvatarItem(id, imageUrl)
        })
    }
    return avatar ? avatar.url : '';
};

// 换行操作
const sendWithNewLine = () => {
    sendContent.value += '\n'
}

// 获取消息列表
const list = async () => {
    const { data: res } = await MessageList(queryInfo)
    if (res.code === 200) {
        queryInfo.page = res.data.page;
        queryInfo.total = res.data.total;
        queryInfo.pageNum = res.data.pageNum;
        queryInfo.pageSize = res.data.pageSize;
        if (Array.isArray(res.data.list) && res.data.list.length > 0) {
            res.data.list.forEach((item: Message) => {
                if (item.photoId !== 0) {
                    const url = getAvatarUrl(item.photoId)
                    item.photo = url ? url : ''
                }
                item.createdAt = formatDate(item.createdAt, 2)
            });
            messages.data = res.data.list;
        } else {
            messages.data = []
        }
    }
}

// 发送消息
const sendMessage = async () => {
    if (sendContent.value.trim() !== '') {
        const chatroomId = useChatStore().getSelectedChatroomId
        if (chatroomId !== 0) {
            const { data: res } = await SendMessage({ chatroomId: chatroomId, content: sendContent.value })
            if (res.code === 200) {
                const url = getAvatarUrl(res.data.photoId)
                messages.data.push({
                    id: res.data.id,
                    isMe: res.data.isMe,
                    senderId: res.data.senderId,
                    receiverId: res.data.receiverId,
                    photoId: res.data.photoId,
                    photo: url ? url : '',
                    content: res.data.content,
                    createdAt: formatDate(res.data.createdAt, 2),
                });
                sendContent.value = '';
                useChatStore().setNewMessageId(res.data.id)
                setScrollTop()
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
    // 296是菜单栏和聊天列表的宽度
    chatContentWidth.value = window.innerWidth - (296 + 100)
    setScrollTop()
};

// 监听选中的聊天室
watch(() => useChatStore().getSelectedChatroomId, (newValue, oldValue) => {
    useChatStore().setScroll(false)
    // 请求后端获取消息列表
    queryInfo.chatroomId = useChatStore().getSelectedChatroomId
    queryInfo.page = 1
    queryInfo.pageNum = 0
    queryInfo.pageSize = 50
    queryInfo.total = 0
    list()
    setScrollTop()
    useChatStore().setScroll(true)
})

// 监听滚动条是否滚到顶部
const loadListData = debounce(async (enter: any) => {
    if (!useChatStore().getScrollState) return;

    if (enter.scrollTop <= 200) {
        queryInfo.page = queryInfo.page + 1
        const { data: res } = await MessageList(queryInfo)
        if (res.code === 200) {
            if (Array.isArray(res.data.list) && res.data.list.length > 0) {
                res.data.list.forEach((item: Message) => {
                    if (item.photoId !== 0) {
                        const url = getAvatarUrl(item.photoId)
                        item.photo = url ? url : ''
                    }
                    item.createdAt = formatDate(item.createdAt, 2)
                });
                messages.data = messages.data.concat(res.data.list)
            }
        }
    }
}, 300);


// 将滚动条设置到底部
const setScrollTop = () => {
    nextTick(() => {
        setTimeout(() => {
            scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight);
        }, 100);
    });
}
</script>

<style lang="scss" scoped></style>