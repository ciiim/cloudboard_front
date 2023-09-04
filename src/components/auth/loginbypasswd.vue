<template>
  <div class="top-text">
    <el-text size="large" type="info">登录</el-text>
  </div>
  <el-form ref="loginFormRef" :model="loginForm" :rules="rules">
    <el-form-item prop="email">
      <el-input
        v-model="loginForm.email"
        auto-complete="off"
        placeholder="邮箱"
      ></el-input>
    </el-form-item>
    <el-form-item prop="passwd">
      <el-input
        type="password"
        v-model="loginForm.passwd"
        auto-complete="off"
        placeholder="密码"
        show-password
      ></el-input>
    </el-form-item>
    <el-form-item style="justify-content: center;">
      <el-button
        style="margin: auto; width: 100px"
        type="primary"
        plain
        @click="submitForm(loginFormRef)"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>

<style>
.top-text {
  margin-bottom: 30px;
}
</style>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { ref } from "vue";
import axios from "axios";
import "element-plus/es/components/message/style/css";
import router from "@/router";

const loginFormRef = ref<FormInstance>();

const loginForm = ref({
  email: "",
  passwd: "",
});

const rules = ref({
  email: [{ required: true, message: "请输入邮箱" }],
  passwd: [{ required: true, message: "请输入密码" }],
});

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate((valid: boolean) => {
    if (valid) {
      axios.defaults.baseURL = "http://localhost:8080";
      axios({
        method: "post",
        url: "/api/v1/auth/login",
        data: {
          email: loginForm.value.email,
          passwd: loginForm.value.passwd,
          type: "passwd",
        },
      })
        .then((res: any) => {
          if (res.data.code === 1000) {
            localStorage.setItem("token", res.data.data.token);
            router.push("/home");
            return;
          } else {
            ElMessage.error("登录失败");
          }
        })
        .catch((error: any) => {
          ElMessage.error(error.response.data.msg);
        });
      return true;
    } else {
      return false;
    }
  });
};
</script>
