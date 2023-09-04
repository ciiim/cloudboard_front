<template>
  <el-button @click="logout"> 登出 </el-button>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";
import router from "@/router";

const logout = () => {
  localStorage.removeItem("token");
  router.push("/auth");
};
</script>
