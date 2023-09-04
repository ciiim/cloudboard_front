<template>
    <div class="top-text">
    <el-text size="large" type="info">注册</el-text>
  </div>
  <el-form
    ref="regFormRef"
    :model="regForm"
    label-position="right"
    :rules="rules"
  >
    <el-form-item prop="nickname">
      <el-input v-model="regForm.nickname" placeholder="昵称"></el-input>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model="regForm.email" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item prop="verify_code">
      <el-row>
        <el-col :span="16">
          <el-form-item>
            <el-input
              v-model="regForm.verify_code"
              placeholder="验证码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button
            class="send-button"
            type="primary"
            @click="sendVerifyCode(regForm.email)"
            >发送验证码</el-button
          >
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item prop="passwd">
      <el-input
        type="password"
        show-password
        v-model="regForm.passwd"
        placeholder="密码"
      ></el-input>
    </el-form-item>
    <el-form-item prop="passwd_confirm">
      <el-input
        type="password"
        show-password
        v-model="regForm.passwd_confirm"
        placeholder="再次输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(regFormRef)">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<style>
.send-button {
  margin-left: 10px;
}

.top-text {
  margin-bottom: 30px;
}
</style>

<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import axios from "axios";
import "element-plus/es/components/message/style/css";
import router from "@/router";

const regFormRef = ref<FormInstance>();

const regForm = ref({
  nickname: "",
  email: "",
  verify_code: "",
  passwd: "",
  passwd_confirm: "",
});

const rules = ref({
  nickname: [{ required: true, message: "请输入昵称" }],
  email: [{ required: true, message: "请输入邮箱" }],
  verify_code: [{ required: true, message: "请输入邮箱验证码" }],
  passwd: [{ required: true, message: "请输入密码" }],
  passwd_confirm: [{ required: true, message: "请再次输入密码" }],
});

const sendVerifyCode = (email: string | undefined) => {
  if (!email || email === "") {
    ElMessage.error("请输入邮箱");
    return;
  }
  axios.defaults.baseURL = "http://localhost:8080";
  axios({
    method: "post",
    url: "/api/v1/auth/email-verify-code",
    data: {
      email: email,
      type: "register",
    },
  })
    .then((res: any) => {
      if (res.data.code === 1200) {
        ElMessage.success("验证码发送成功");
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
        url: "/api/v1/auth/register",
        data: {
          nickname: regForm.value.nickname,
          email: regForm.value.email,
          verify_code: regForm.value.verify_code,
          verify_type: 'register',
          passwd: regForm.value.passwd,
        },
      })
        .then((res: any) => {
          if (res.data.code === 1100) {
            ElMessage.error("注册成功");
            router.push("/home");
            return;
          } else {
            ElMessage.error("注册失败");
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
