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
    <el-form-item prop="verify_code">
      <el-row>
        <el-col :span="18">
          <el-input
            type="text"
            v-model="loginForm.verify_code"
            auto-complete="off"
            width="50px"
            placeholder="验证码"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            ref="sendButtonRef"
            class="send-button"
            type="primary"
            :disabled="codeExpireTime > 0"
            @click="sendVerifyCode(loginForm.email)"
            >{{ codeButtonText }}</el-button
          >
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
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
.send-button {
  margin-left: 5px;
}

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

const codeButtonText = ref("发送验证码");
const codeExpireTime = ref(0);

const loginForm = ref({
  email: "",
  verify_code: "",
});

const rules = ref({
  email: [{ required: true, message: "请输入邮箱" }],
  verify_code: [{ required: true, message: "请输入验证码" }],
});

const sendVerifyCode = async (email: string) => {
  if (!email) {
    ElMessage.error("请输入邮箱");
    return;
  }
  axios.defaults.baseURL = "http://localhost:8080";
  axios({
    method: "post",
    url: "/api/v1/auth/email-verify-code",
    data: {
      email: email,
      type: "login",
    },
  })
    .then((res: any) => {
      if (res.data.code === 1200) {
        ElMessage.success("验证码发送成功");
        codeExpireTime.value = res.data.data.expire_time;
        let interval = setInterval(() => {
          if (codeExpireTime.value <= 0) {
            codeButtonText.value = "发送验证码";
            clearInterval(interval);
            return;
          } else {
            codeButtonText.value = codeExpireTime.value + "秒后重发";
          }
          codeExpireTime.value -= 1;
        }, 1000);
        return;
      } else {
        ElMessage.error("验证码发送失败");
      }
    })
    .catch((error: any) => {
      ElMessage.error(error.response.data.msg);
    });
};

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
          verify_code: loginForm.value.verify_code,
          verify_type: "login",
          type: "code",
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
