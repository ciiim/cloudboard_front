<template>
  <div class="floating-button-container">
    <div v-if="currentTabType == 'entry'">
      <el-button class="floating-button" :icon="Plus" @click="createBackpackButtonClick"
        ><span>新建背包</span></el-button
      >
    </div>
    <div v-else-if="currentTabType == 'filelist'">
      <el-button class="floating-button" :icon="UploadFilled"
        ><span>上传</span></el-button
      >
      <el-button class="floating-button" :icon="View"
        ><span>预览</span></el-button
      >
      <el-button class="floating-button" :icon="Download"
        ><span>下载</span></el-button
      >
      <el-button class="floating-button" :icon="Edit"
        ><span>重命名</span></el-button
      >
      <el-button class="floating-button" :icon="Delete"
        ><span>删除</span></el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,defineEmits  } from "vue";
import {
  Plus,
  View,
  Download,
  Edit,
  UploadFilled,
  Delete,
} from "@element-plus/icons-vue";

const emits = defineEmits(['create-backpack-clicked']);

const props = defineProps<{
  currentTabType: string;
}>();

const createBackpackButtonClick = () => {
    emits('create-backpack-clicked');
};
</script>

<style>
.floating-button-container {
  display: flex;
  flex-direction: column;
  align-items:center;
  gap: 15px; 
  position: relative;
  left: 0;
}

.floating-button {
  border: none;
  background-color: #3e98ff;
  color: white;
  padding: 10px;
  border-radius: 50%; /* 初始为圆形 */
  overflow: hidden;
  transition: all 0.3s ease; /* 过渡动画 */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px; /* 初始宽度 */
  height: 40px; /* 初始高度 */
}

.floating-button:hover {
  border-radius: 30px;
  width: 120px;
  padding: 10px 20px;
}

.floating-button span {
  display: none;
  margin-left: 10px;
}

.floating-button:hover span {
  display: inline; /* 悬停时显示文字 */
}
</style>
