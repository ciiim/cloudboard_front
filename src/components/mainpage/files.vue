<template>
  <el-table :data="boardSub"></el-table>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import axios from "axios";

const props = defineProps(["nowBoard"]);
const nowBaseDir = ref("");
const nowDir = ref("");

const boardSub = ref();

watchEffect(() => {
  nowBaseDir.value = "";
  nowDir.value = "";
  getBoardSub();
});

const getBoardSub = () => {
  axios.defaults.baseURL = "http://localhost:8080";
  axios({
    url: "/api/v1/fs/board/sub",
    method: "get",
    params: {
      space: props.nowBoard.space,
      baseDir: nowBaseDir.value,
      nowDir: nowDir.value,
    },
  });
};
</script>
