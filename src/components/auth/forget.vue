<template>
  <el-form :ref="forgetFormRef" :model="forgetForm" :rules="rules">
    <el-form-item label="邮箱">
      <el-input v-model="forgetForm.email"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="info" @click="submitForm(forgetForm.email)">重设密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import axios from "axios";
import { ref } from "vue";

const forgetForm = ref({
  email: "",
});

const rules = ref({
  email: [{ required: true, message: "请输入邮箱" }],
});

const forgetFormRef = ref<FormInstance>();

const submitForm = (email: string) => {
  axios.defaults.baseURL = "http://localhost:8080";
  axios({
    method: "post",
    url: "/api/v1/auth/reset-send",
    data: {
      email: email,
    },
  })
    .then((res) => {
      if (res.data.code == 1310) {
        ElMessage.success(res.data.msg);
      } else {
        ElMessage.error(res.data.msg);
      }
    })
    .catch((err) => {
      ElMessage.error(err.response.data.msg);
    });
};
</script>
