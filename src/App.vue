<template>
  <!-- 路由占位符 -->
  <RouterView />

  <!-- 登录对话框 -->
  <el-dialog v-model="loginDialogState" center align-center :before-close="beforeCloseDialog" :show-close="false"
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
import { reactive, ref, onMounted, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { SendCode, Login } from '@/api/home'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth';
// 登录对话框打开状态
const loginDialogState = ref(false);
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

onMounted(() => {
  const token = localStorage.getItem('Authorization')
  if (token === '' || token === null || token === undefined) {
    useAuthStore().setLoginDialog(true)
    return
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
  formEl.validate(async (valid) => {
    if (valid) {
      // 开启登录按钮加载状态
      isLogining.value = true;
      const { data: res } = await Login(loginForm)
      isLogining.value = false;
      if (res.code === 200) {
        useAuthStore().setLoginDialog(false)

        // 缓存token
        localStorage.setItem('Authorization', res.data)
        ElMessage.success(res.message)
      } else {
        ElMessage.error(res.message)
      }
    } else {
      return false
    }
  })
};

// 用户登录对话框关闭前事件
const beforeCloseDialog = () => { }

// 行为验证码校验成功回调
const checkCaptchaSuccess = async (call: any) => {
  if (countDown.value > 0) return;
  loginForm.captchaVerification = call.data.captchaVerification
  loginForm.pointJson = call.data.pointJson
  loginForm.token = call.data.token
  const { data: res } = await SendCode(loginForm)
  if (res.code !== 200) {
    ElMessage.error(res.message)
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
}

// 监听登录状态
watch(() => useAuthStore().getLoginDialogState, (newValue, oldValue) => {
  if (newValue) {
    loginDialogState.value = true
  } else {
    loginDialogState.value = false
  }
})
</script>
<style lang="scss" scoped></style>
