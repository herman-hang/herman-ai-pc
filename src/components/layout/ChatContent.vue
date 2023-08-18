<template>
    <div class="flex flex-col" :style="{ height: chatContentHeight + 'px' }">
        <!-- 内容区 -->
        <el-scrollbar class="px-4" ref="scrollbarRef" @scroll="loadListData">
            <div ref="innerRef" class="scroll-container">
                <div v-if="reversedMessages.length > 0" v-for="message in reversedMessages" :key="message.id" class="mb-4"
                    :ref="saveRef(message.id)">
                    <div class="flex justify-center text-xs text-gray-400">
                        {{ message.createdAt }}
                    </div>
                    <!-- 发送内容 -->
                    <div v-if="message.isMe" class="flex justify-end items-center">
                        <div :style="{ maxWidth: chatContentWidth + 'px' }"
                            class="bg-gradient-to-r from-blue-400 to-indigo-400 text-white text-left py-2 px-2 rounded-lg break-words text-base">
                            <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ message.content }}</pre>
                        </div>
                        <div class="w-10 h-10 ml-1 justify-center items-center">
                            <el-avatar
                                :src="message.photo === '' ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' : message.photo" />
                        </div>
                    </div>
                    <!-- 接收内容 -->
                    <div v-else class="flex justify-start items-center">
                        <div class="w-10 h-10 mr-1 justify-center items-center">
                            <el-avatar
                                :src="message.photoId === 0 ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' : message.photo" />
                        </div>
                        <div :style="{ maxWidth: chatContentWidth + 'px' }"
                            class="bg-white rounded-lg break-words text-base flex flex-col px-3 py-3">
                            <div class="markdown-body" v-html="renderMarkdown(message.content)"></div>
                        </div>
                    </div>
                </div>
                <div v-else class="flex justify-center items-center mt-2">
                    <el-empty class="text-gray-400 font-medium text-sm" description="无数据~" />
                </div>
            </div>
        </el-scrollbar>

        <!-- 发送内容输入框 -->
        <div class="flex m-2 justify-center items-center">
            <el-input resize="none" :autosize="{ minRows: 2, maxRows: 6 }" v-model="sendContent" type="textarea"
                placeholder="请教一个问题~" @keydown.enter="handleKeyDown" ref="sendRef" />
            <div class="px-1">
                <el-button color="#626aef" :loading="isSend" :icon="Promotion" circle @click="sendMessage" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, reactive, nextTick, watch, computed, inject } from "vue"
import { Promotion } from '@element-plus/icons-vue'
import { ElScrollbar as ElScrollbarType, ElMessage } from 'element-plus';
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/user'
import { useAiStore } from '@/stores/ai'
import { useContentStore } from '@/stores/content';
import { MessageList, Preview, SendMessage } from '@/api/home'
import { formatDate } from '@/uitls/formatDate'
import { debounce } from 'lodash'
import { useAuthStore } from '@/stores/auth';
import { Marked } from 'marked';
import "github-markdown-css"
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js'
import "highlight.js/styles/atom-one-dark.css";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { mangle } from "marked-mangle";
// 发送消息标志位
const isSend = ref<boolean>(false)
// 存储item引用
const childRefs = reactive<any>({});
// 消息发送输入框引用
const sendRef = ref()
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
    pageSize: 50,
    // 聊天室ID
    chatroomId: useChatStore().getSelectedChatroomId,
    // 搜索关键词
    keywords: '',
    // 消息ID
    messageId: 0
})
// 消息内容列表
const messages = reactive<{ data: Message[] }>({ data: [] });

// 定义响应式的头像数组对象
const avatarArray: string[] = [];
// 修改原数组
const reversedMessages = computed(() =>
    messages.data.slice().reverse()
);

// 组件渲染完成时调用
onMounted(() => {
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize);
    useChatStore().setScroll(true)
    handleClick()
    setScrollBottom()
});

// 组件实例被卸载之后调用
onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize);
});

// 保存item引用
const saveRef = (id: number) => (el: any) => {
    if (el) {
        childRefs['child' + id] = el;
    }
};

// 处理electron环境点击链接跳转问题
const handleClick = () => {
    // 获取当前环境
    const isElectron = inject('isElectron');
    if (isElectron) {
        const { shell } = require('electron');
        document.addEventListener('click', (event: any) => {
            if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
                event.preventDefault();
                shell.openExternal(event.target.href);
            }
        });
    }
}

// 接收消息渲染
const renderMarkdown = (value: string) => {
    const marked = new Marked(
        markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code, lang) {
                const validLanguage = hljs.getLanguage(lang) ? lang : 'plaintext';
                const highlightedCode = hljs.highlight(code, { language: validLanguage, ignoreIllegals: true }).value;
                const lines = highlightedCode.split('\n').map((line, index) => {
                    return `<span class="line" data-line="${index + 1}">${line}</span>`;
                });

                return `${lines.join('\n')}`;
            },
        }),
    );
    marked.setOptions({
        gfm: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
    });
    marked.use(gfmHeadingId({
        prefix: "herman-ai-code-",
    }), mangle());

    return marked.parse(value);
};

// 根据ID获取头像URL
const getAvatarUrl = async (id: number) => {
    if (avatarArray[id] !== '' && avatarArray[id] !== null && avatarArray[id] !== undefined) {
        return avatarArray[id];
    } else {
        const resp = await Preview(id);
        const blob = new Blob([resp.data], { type: resp.headers['content-type'] });
        const imageUrl = URL.createObjectURL(blob);
        if (imageUrl !== '' && imageUrl !== null && imageUrl !== undefined) {
            avatarArray[id] = imageUrl
            return imageUrl;
        }
    }
};

// 键盘回车按键触发事件
const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        // 发送消息的操作
        sendMessage();
        event.preventDefault(); // 阻止默认的换行行为
    }
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
            const avatarPromises = res.data.list.map((item: Message) => {
                if (item.photoId !== 0) {
                    if (avatarArray[item.photoId] !== '' && avatarArray[item.photoId] !== null && avatarArray[item.photoId] !== undefined) {
                        return Promise.resolve({ id: item.photoId, url: avatarArray[item.photoId] });
                    }
                    if (item.isMe) {
                        const user = useUserStore().getUser
                        return Promise.resolve({ id: user.photoId, url: user.photo });
                    }
                    return Preview(item.photoId).then(resp => {
                        const blob = new Blob([resp.data], { type: resp.headers['content-type'] });
                        const imageUrl = URL.createObjectURL(blob);
                        if (imageUrl !== '' && imageUrl !== null && imageUrl !== undefined) {
                            avatarArray[item.photoId] = imageUrl
                            return { id: item.photoId, url: imageUrl };
                        }
                        return null;
                    })
                }
                return null;
            });

            const avatarArrays = await Promise.all(avatarPromises);

            res.data.list.forEach((item: Message, index: number) => {
                if (avatarArrays[index]) {
                    item.photo = avatarArrays[index].url ? avatarArrays[index].url : '';
                }
                item.createdAt = formatDate(item.createdAt, 2);
            });

            messages.data = res.data.list;
        } else {
            messages.data = [];
        }
    }
}

// 流式响应
const sendMessage = async () => {
    const token = localStorage.getItem('Authorization')
    const chatroomId = useChatStore().getSelectedChatroomId
    const receiverId = ref<number>(0)
    if (token === '' || token === null || token === undefined) {
        useAuthStore().setLoginDialog(true)
        return
    }
    if (sendContent.value.trim() === '') {
        return
    }
    if (chatroomId == 0) {
        ElMessage.error('请选中左侧聊天再发消息')
        return
    };
    const { data: res } = await SendMessage({ chatroomId: chatroomId, content: sendContent.value })
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }

    const eventSource = new EventSource(import.meta.env.VITE_BASE_URL + 'pc/chat/gpt/stream?chatroomId='
        + chatroomId
        + '&token=' + token
    );

    eventSource.addEventListener('open', function (event) {
        isSend.value = true
    });

    eventSource.addEventListener('message', function (event) {
        const respomse = JSON.parse(event.data);

        switch (respomse.code) {
            case 100: // 流式响应
                streamResponse(receiverId.value, respomse)
                break
            case 206: // 发送者接收者数据
                if (!respomse.data.isMe) {
                    receiverId.value = respomse.data.id
                    respomse.data.content = ''
                }
                dataPush(respomse)
                break
            case 401: // 鉴权相关
                useAuthStore().setLoginDialog(true)
                ElMessage.error(respomse.message)
                break
            case 500: // 错误相关
                ElMessage.error(respomse.message)
                break
            default:
                ElMessage.error(respomse.message)
        }

        setScrollBottom()
    });

    eventSource.addEventListener('error', function (event) {
        eventSource.close()
        isSend.value = false
    });

    eventSource.addEventListener('close', function (event) {
        eventSource.close()
        isSend.value = false
    });
}

// 数据渲染
const dataPush = async (respomse: any) => {
    let photo
    if (respomse.data.photoId !== 0) {
        photo = await getAvatarUrl(respomse.data.photoId)
    }
    messages.data.unshift({
        id: respomse.data.id,
        isMe: respomse.data.isMe,
        senderId: respomse.data.senderId,
        receiverId: respomse.data.receiverId,
        photoId: respomse.data.photoId,
        photo: photo ? photo : '',
        content: respomse.data.content,
        createdAt: formatDate(respomse.data.createdAt, 2),
    })

    useChatStore().setNewMessageId(respomse.data.id)
    sendContent.value = '';
}

// 流响应的数据
const streamResponse = (receiverId: number, respomse: any) => {
    const itemToUpdate = messages.data.find(item => item.id === receiverId)
    if (itemToUpdate) {
        itemToUpdate.content += respomse.data
        if (itemToUpdate.content.includes('END_OF_MESSAGE')) {
            isSend.value = false
        }
    }
}

// 计算聊天区高度
const updateWindowSize = () => {
    chatContentHeight.value = window.innerHeight - 56;
    // 296是菜单栏和聊天列表的宽度
    chatContentWidth.value = window.innerWidth - (296 + 100)
    setScrollBottom()
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
    queryInfo.messageId = 0
    list()
    setScrollBottom()
    sendRef.value.focus()
    useChatStore().setScroll(true)
    useContentStore().setMessageId(0)
})

// 监听搜索消息ID
watch(() => useContentStore().getMessageId, (newValue, oldValue) => {
    if (newValue !== 0) {
        queryInfo.messageId = newValue
        queryInfo.keywords = ''
        queryInfo.page = 1
        queryInfo.pageSize = 50
        list()
        nextTick(() => {
            setTimeout(() => {
                const childRefName = 'child' + newValue
                const targetMessageRef = childRefs[childRefName];
                if (targetMessageRef && innerRef.value) {
                    const targetOffsetTop = targetMessageRef.offsetTop;
                    const containerOffsetTop = innerRef.value.offsetTop;
                    const scrollOffset = targetOffsetTop - containerOffsetTop;
                    scrollbarRef.value?.scrollTo(scrollOffset);
                }
            }, 500);
        });

    }
})

// 监听搜索内容
watch(() => useContentStore().getKeywords, (newValue, oldValue) => {
    if (newValue == '') {
        queryInfo.messageId = 0
        queryInfo.keywords = ''
        queryInfo.page = 1
        queryInfo.pageSize = 50
        list()
        setScrollBottom()
    }
})

// 监听AI类型切换状态
watch(() => useAiStore().getAiType, (newValue, oldValue) => {
    queryInfo.keywords = ''
    queryInfo.messageId = 0
})

// 监听滚动条是否滚到顶部
const loadListData = debounce(async (enter: any) => {
    if (!useChatStore().getScrollState) return;

    if (enter.scrollTop <= 200) {
        queryInfo.page = queryInfo.page + 1
        const { data: res } = await MessageList(queryInfo)
        if (res.code === 200) {
            if (Array.isArray(res.data.list) && res.data.list.length > 0) {
                const avatarPromises = res.data.list.map((item: Message) => {
                    if (item.photoId !== 0) {
                        if (avatarArray[item.photoId] !== '' && avatarArray[item.photoId] !== null && avatarArray[item.photoId] !== undefined) {
                            return Promise.resolve({ id: item.photoId, url: avatarArray[item.photoId] });
                        }
                        if (item.isMe) {
                            const user = useUserStore().getUser
                            return Promise.resolve({ id: user.photoId, url: user.photo });
                        }
                        return Preview(item.photoId).then(resp => {
                            const blob = new Blob([resp.data], { type: resp.headers['content-type'] });
                            const imageUrl = URL.createObjectURL(blob);
                            if (imageUrl !== '' && imageUrl !== null && imageUrl !== undefined) {
                                return { id: item.photoId, url: imageUrl };
                            }
                            return null;
                        })
                    }
                    return null;
                });

                const avatarArray = await Promise.all(avatarPromises);

                res.data.list.forEach((item: Message, index: number) => {
                    if (avatarArray[index]) {
                        item.photo = avatarArray[index].url ? avatarArray[index].url : '';
                    }
                    item.createdAt = formatDate(item.createdAt, 2);
                });

                messages.data = messages.data.concat(res.data.list);
            }
        }
    }
}, 300);


// 将滚动条设置到底部
const setScrollBottom = () => {
    nextTick(() => {
        setTimeout(() => {
            scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight);
        }, 500);
    });
}
</script>

<style lang="scss">
.scroll-container {
    overflow-x: hidden;
}

.line {
    position: relative;
    overflow-x: auto;
}

.line::before {
    content: attr(data-line);
    display: inline-block;
    margin-right: 0.5em;
    user-select: none;
    border-right: 1px solid #c5c5c5;
    /* 添加右侧内边距，让白线和内容有一定的间隔 */
    width: 24px;
    padding-right: 0.5em;
    text-align: right;
}

.markdown-body pre {
    padding: 6px
}

pre code.hljs {
    padding: 0px
}
</style>