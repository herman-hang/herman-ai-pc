<template>
  <RouterView />

  <!-- 登录对话框 -->
  <el-dialog v-model="dialogVisible" center align-center :before-close="beforeCloseDialog" :show-close="false"
    width="45%">
    <div class="flex justify-center">
      <span class="text-lg mb-3 font-semibold">用户登录</span>
    </div>
    <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="80px">
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="loginForm.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="flex">
          <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
          <el-button class="ml-2" @click="getCode" color="#626aef" plain :disabled="countDown > 0">
            {{ countDown > 0 ? `${countDown} 秒` : buttonText }}
          </el-button>
        </div>
      </el-form-item>
      <div class="flex justify-center">
        <el-button color="#626aef" :loading="isLogining" @click="login(loginFormRef)">登录</el-button>
      </div>
    </el-form>

    <!-- 验证码 -->
    <Verify mode="pop" :captchaType="captchaType" :imgSize="{ width: '400px', height: '200px' }" ref="verify"></Verify>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
const verify = ref(null)
const captchaType = ref('blockPuzzle')
const dialogVisible = ref(true);
const loginForm = ref({
  phone: '',
  code: ''
});
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
const countDown = ref(0);
const buttonText = ref('获取验证码');
const isLogining = ref(false);
const loginFormRef = ref<FormInstance>()

// 发送获取验证码的请求
const getCode = () => {
  verify.value!.show()
  if (countDown.value > 0) return;
  // 在请求成功后，启动倒计时
  countDown.value = 60;
  const timer = setInterval(() => {
    if (countDown.value > 0) {
      countDown.value -= 1;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

// 登录操作
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // 发送登录请求
      // 在请求成功后，执行登录操作
      isLogining.value = true;
      setTimeout(() => {
        isLogining.value = false;
        dialogVisible.value = false;
        // 执行登录操作

      }, 2000);
    } else {
      console.log('error submit!')
      return false
    }
  })
};

// 用户登录对话框关闭前事件
const beforeCloseDialog = () => { }

const handleSuccess = (res: any) => {
  console.log(res);
  console.log('sucess');
}
</script>
<style lang="scss" scoped></style>
