<script setup lang="ts">
import { inject, ref } from "vue";

const emits = defineEmits(["enteredBag"]);

const bag = ref("");
const password = ref("");
var axios: any = inject("$axios");
const enterBackpack = () => {
  axios.post("space/noauth/verify", {
      space: bag.value,
      password: password.value,
    })
    .then((res: any) => {
      console.log(res);
      emits("enteredBag", {
        bag: bag.value,
        msg: "success",
      });
      localStorage.setItem(bag.value, res.data.data.token)
    })
    .catch((err: any) => {
      console.error(err);
    });
};
</script>

<template>
  <div class="content">
    <div class="row">
      <el-input v-model="bag" style="width: 240px" placeholder="背包名" />
      <el-button type="primary" @click="enterBackpack" style="width: 240px"
        >进入</el-button
      >
    </div>
    <div class="row">
      <el-input v-model="password" style="width: 240px" placeholder="密码" />
    </div>
  </div>
</template>

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
