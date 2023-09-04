<template>
  <div class="reset-frame">
    <div class="left-text">
      <text>云 板</text>
    </div>
    <div class="reset-content">
      <el-form :ref="resetFormRef" :model="resetForm" :rules="rules">
    <el-form-item label="新密码">
      <el-input v-model="resetForm.new_passwd"></el-input>
    </el-form-item>
    <el-form-item label="确认新密码">
      <el-input v-model="resetForm.new_passwd_confirm"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="info" @click="submitForm(resetForm.new_passwd)">重设密码</el-button>
    </el-form-item>
  </el-form>
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

.reset-content {
  width: 330px;
  padding: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.reset-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;

  background: #f5f5f5;
  border-radius: 5px;
  box-shadow: var(--el-box-shadow-dark);
}
</style>


<script setup lang="ts">
import router from "@/router";
import type { FormInstance } from "element-plus";
import { ElMessageBox } from "element-plus";
import axios from "axios";
import { onMounted, ref } from "vue";
import 'element-plus/es/components/message-box/style/css'

const resetForm = ref({
  new_passwd: "",
  new_passwd_confirm: "",
});

const rules = ref({
  new_passwd: [{ required: true, message: "请输入新密码" }],
  new_passwd_confirm: [{ required: true, message: "请再次输入新密码" }],
});

const resetFormRef = ref<FormInstance>();

const token = ref('');
const email = ref('');

const submitForm = (newPasswd: string) => {
  axios.defaults.baseURL = "http://localhost:8080";
  axios({
    method: "post",
    url: "/api/v1/auth/reset",
    data: {
      email: email.value,
      new_passwd: newPasswd,
      token: token.value,
    },
  })
    .then((res) => {
      if (res.data.code == 1300) {
        ElMessageBox.alert("重设密码成功", "提示", {
          confirmButtonText: "确定",
          callback: () => {
            router.push("/auth");
          },
        });
      } else {
        ElMessageBox.alert("重设密码失败", "警告", {
          confirmButtonText: "确定",
          callback: () => {
            router.push("/auth");
          },
        });
      }
    })
    .catch((err) => {
      ElMessageBox.alert("重设密码失败", "警告", {
        confirmButtonText: "确定",
        callback: () => {
          router.push("/auth");
        },
      });
    });
};

onMounted(() => {
  //检查token是否有效
  console.log(router.currentRoute.value.params.token);
  axios.defaults.baseURL = "http://localhost:8080";
  token.value = router.currentRoute.value.params.token as string;
  email.value = router.currentRoute.value.params.email as string;
  axios({
    method: "post",
    url: "/api/v1/auth/check-reset-token",
    data: {
      token: token.value,
    },
  })
    .then((res) => {
      if (res.data.code == 1200) {
        return;
      } else {
        ElMessageBox.alert("重设邮件已过期", "警告", {
          confirmButtonText: "确定",
          callback: () => {
            router.push("/auth");
          },
        });
      }
    })
    .catch((err) => {
      ElMessageBox.alert("重设邮件已过期", "警告", {
        confirmButtonText: "确定",
        callback: () => {
          router.push("/auth");
        },
      });
    });
});
</script>
