<template>
  <div class="container">
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb">
      <el-breadcrumb-item v-for="dir in nowRoute">{{ dir }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮组 -->
    <!-- <div class="buttons">
      <el-button :icon="Back" circle></el-button>
    </div> -->
    <!-- 文件列表 -->
    <el-table
      :data="files"
      style="width: 100%"
      @row-contextmenu="handleContextMenu"
    >
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="size" label="大小" width="180"></el-table-column>
    </el-table>
    <!-- 右键菜单 -->
    <div
      v-if="showContextMenu"
      class="context-menu"
      :style="{ top: menuY + 'px', left: menuX + 'px' }"
    >
      <ul>
        <li @click="handleMenuCommand('open')">打开</li>
        <li @click="handleMenuCommand('download')">下载</li>
        <li @click="handleMenuCommand('rename')">重命名</li>
        <li @click="handleMenuCommand('delete')">删除</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,inject, onMounted } from "vue";

const props = defineProps<{
  bagName: string;
}>();

const nowRoute = ref(["to", "the", "dir"]);
const nowBase = ref('/')
const nowDirName = ref('/')
var axios: any = inject("$axios");

const showContextMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);

const files = ref([
  { date: "2024-05-14", name: "文件1.txt", size: "2KB" },
  { date: "2024-05-14", name: "文件2.txt", size: "3KB" },
  { date: "2024-05-14", name: "文件2.txt", size: "3KB" },
  { date: "2024-05-14", name: "文件2.txt", size: "3KB" },
]);

onMounted(() => {
  getDir();
})

const getDir = () => {
  // 获取当前目录
  let token = localStorage.getItem(props.bagName);
  axios.post('/space/'+ props.bagName + '/get',{
    token: token,
    base: nowBase.value,
    dir: nowDirName.value
  }).then((res: any) => {
    console.log(res);
  }).catch((err: any) => {
    console.error(err);
  })
}

const closeContextMenu = (event: any) => {
  if (!event.target.closest(".context-menu")) {
    showContextMenu.value = false;
    document.removeEventListener("click", closeContextMenu);
  }
};

const handleMenuCommand = (command: any) => {
  console.log("执行操作：", command);
  document.removeEventListener("click", closeContextMenu);
  showContextMenu.value = false;
};

const handleContextMenu = (_row: any, _column: any, event: any) => {
  event.preventDefault();
  showContextMenu.value = true;
  menuX.value = event.clientX;
  menuY.value = event.clientY;
  document.addEventListener("click", closeContextMenu);
};
</script>

<style>
.container {
  position: relative;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}
.buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
  left: 0;
}
.el-table {
  border-radius: 10px;
  overflow: hidden;
  min-height: 600px;
}
</style>
