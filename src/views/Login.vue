<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-indigo-500">
        <div class="w-full max-w-md p-4">
            <h1 class="text-3xl font-bold text-white mb-6">登录</h1>
            <form>
                <div class="mb-4">
                    <label for="phone" class="text-white">手机号码</label>
                    <input type="text" id="phone" class="w-full px-4 py-2 rounded border focus:outline-none focus:ring"
                        placeholder="输入手机号码">
                </div>
                <div class="mb-4">
                    <label for="code" class="text-white">验证码</label>
                    <input type="text" id="code" class="w-full px-4 py-2 rounded border focus:outline-none focus:ring"
                        placeholder="输入验证码">
                </div>
                <button type="submit"
                    class="w-full px-4 py-2 bg-white text-indigo-500 rounded focus:outline-none focus:ring">登录</button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

</script>

<style lang="scss" scoped></style>