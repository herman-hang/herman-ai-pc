<script setup lang="ts">
</script>

<template>
  <div class="flex">
    <!-- 菜单 -->
    <div class="w-14 bg-gradient-to-r from-blue-400 to-indigo-400">
      <Menu></Menu>
    </div>

    <!-- 聊天列表 -->
    <div class="flex w-60 bg-gray-100">
      <ChatList></ChatList>
      <div class="border-l border-gray-200"></div>
    </div>

    <!-- 聊天主体 -->
    <div class="flex flex-col flex-grow bg-gray-100">
      <ChatTop></ChatTop>
      <ChatContent></ChatContent>
    </div>
  </div>
</template>

<style scoped></style>
