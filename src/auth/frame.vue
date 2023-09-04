<script setup lang="ts">
import { ref } from "vue";

const mode = ref(0);
</script>

<template>
  <div class="auth-frame">
    <div class="left-text">
      <text>云 板</text>
    </div>
    <div class="auth-content">
      <Loginbypasswd v-if="mode === 0"></Loginbypasswd>
      <Loginbycode v-else-if="mode === 1"></Loginbycode>
      <Register v-else-if="mode === 2"></Register>
      <Forget v-else-if="mode === 3"></Forget>
      <el-divider />
      <!-- 登录 -->
      <div v-if="mode === 0">
        <el-button link @click="mode = 1">邮箱验证码登录</el-button>
      </div>
      <div v-if="mode === 1">
        <el-button link @click="mode = 0">密码登录</el-button>
      </div>

      <div style="margin-top: 20px" v-if="mode !== 0 && mode !== 1">
        <el-button link @click="mode = 0">登录</el-button>
      </div>

      <!-- 注册 -->
      <div style="margin-top: 10px" v-if="mode === 0 || mode === 1">
        <el-button link @click="mode = 2">注册</el-button>
      </div>

      <!-- 找回密码 -->

      <div style="margin-top: 10px" v-if="mode !== 3">
        <el-button link @click="mode = 3">找回密码</el-button>
      </div>
    </div>
  </div>
</template>

<style>
.left-text {
  font-size: x-large;
  font-weight: bold;
  margin-right: 20px;
  margin-left: 20px;
}

.auth-content {
  width: 330px;
  padding: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.auth-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;

  background: #f5f5f5;
  border-radius: 5px;
  box-shadow: var(--el-box-shadow-dark);
}
</style>
