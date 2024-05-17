<template>
  <div class="content">
    <div class="row">
      <el-input placeholder="请输入背包名" v-model="bagName"></el-input>
    </div>
    <div class="row">
      <el-input
        placeholder="请输入密码"
        v-model="password"
        type="password"
      ></el-input>
    </div>
    <div class="row">
      <el-input
        placeholder="确认密码"
        v-model="confirmPassword"
        type="password"
      ></el-input>
    </div>
    <div class="row">
      <el-button type="primary" @click="createBag">创建</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";

const bagName = ref("");
const password = ref("");
const confirmPassword = ref("");

const emits = defineEmits(["bagCreatedCallback"]);

var axios: any = inject("$axios");

const createBag = () => {
  if (password.value !== confirmPassword.value) {
    alert("两次密码不一致");
    return;
  }
  axios.post("/space/noauth/", {
      space: bagName.value,
      password: password.value,
    })
    .then((res: any) => {
      console.log(res);
      emits("bagCreatedCallback", {
        bagName: bagName.value,
        msg: "success",
      });
      localStorage.setItem(bagName.value, res.data.data.token);
    })
    .catch((err: any) => {
      console.error(err);
    });
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
  padding: 10px 0;
}

.el-input {
  flex: 2;
  padding-right: 10px;
}

.el-button {
  flex: 1;
}
</style>
