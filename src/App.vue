<template>
  <!-- 路由占位符 -->
  <RouterView />

  <!-- 登录对话框 -->
  <el-dialog v-model="authStore.loginDialog" center align-center :before-close="beforeCloseDialog" :show-close="false"
    width="45%">
    <div class="flex justify-center">
      <span class="text-lg mb-3 font-semibold">用户登录</span>
    </div>
    <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="80px"
      @keyup.enter="login(loginFormRef)">
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="loginForm.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="flex">
          <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
          <el-button class="ml-2" @click="getCode(loginFormRef)" color="#626aef" plain :disabled="countDown > 0">
            {{ countDown > 0 ? `${countDown} 秒` : buttonText }}
          </el-button>
        </div>
      </el-form-item>
      <div class="flex justify-center">
        <el-button color="#626aef" :loading="isLogining" @click="login(loginFormRef)">登录</el-button>
      </div>
    </el-form>

    <!-- 滑块验证码 -->
    <Verify mode="pop" @success="checkCaptchaSuccess" :captchaType="loginForm.captchaType"
      :imgSize="{ width: '400px', height: '200px' }" ref="verify"></Verify>

  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { SendCode, Login } from '@/api/home'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth';

// 滑块验证码引用
const verify = ref()
// 登录表单
const loginForm = reactive({
  phone: '',
  code: '',
  captchaVerification: '',
  captchaType: 'blockPuzzle',
  pointJson: '',
  token: ''
});
// 表单引用
const loginFormRef = ref<FormInstance>()
// 登录表单验证规则
const loginFormRules = ref({
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入正确的验证码', trigger: 'blur' }
  ]
});
// 获取手机验证码校验规则
const countDown = ref(0);
// 获取验证码按钮文本变量
const buttonText = ref('获取验证码');
// 点击登录按钮加载状态
const isLogining = ref(false);
// 登录状态对话框监听对象
const authStore = useAuthStore();

onMounted(() => {
  const token = localStorage.getItem('Authorization')
  if (!token) {
    authStore.loginDialog = true
  }
})

// 发送获取验证码的请求
const getCode = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validateField('phone', (errorMessage) => {
    if (errorMessage) {
      loginForm.captchaType = Math.floor(Math.random() * 10) % 2 === 0 ? "blockPuzzle" : "clickWord"
      verify.value.show()
    }
  })
};

// 登录操作
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // 开启登录按钮加载状态
      isLogining.value = true;
      Login(loginForm).then(res => {
        isLogining.value = false;
        if (res.data.code === 200) {
          authStore.loginDialog = false
          // 缓存token
          localStorage.setItem('Authorization', res.data.data)
          ElMessage.success(res.data.message)
        } else {
          ElMessage.error(res.data.message)
        }
      })
    } else {
      return false
    }
  })
};

// 用户登录对话框关闭前事件
const beforeCloseDialog = () => { }

// 行为验证码校验成功回调
const checkCaptchaSuccess = (res: any) => {
  if (countDown.value > 0) return;
  loginForm.captchaVerification = res.data.captchaVerification
  loginForm.pointJson = res.data.pointJson
  loginForm.token = res.data.token
  SendCode(loginForm).then(res => {
    if (res.data.code !== 200) {
      ElMessage({
        type: 'error',
        message: res.data.message,
      })
    } else {
      countDown.value = 60;
      const timer = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value -= 1;
        } else {
          clearInterval(timer);
        }
      }, 1000);
    }
  })
}

</script>
<style lang="scss" scoped></style>
