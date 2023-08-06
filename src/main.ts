import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import '@/assets/main.css'
import 'element-plus/dist/index.css'

const app = createApp(App)

// 判断是否在 Electron 环境中
const isElectron = typeof window.process !== 'undefined' && window.process?.versions?.electron;
// 使用 provide API 在根组件注入标志位
app.provide('isElectron', isElectron);

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
